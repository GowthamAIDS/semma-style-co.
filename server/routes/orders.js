const express = require('express');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const { queryAll, queryOne, execute } = require('../db');

const router = express.Router();

router.post('/', auth, (req, res) => {
  const { email, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    const expected = crypto.createHmac('sha256', keySecret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }
  }

  const cartItems = queryAll(
    `SELECT ci.quantity, p.id as product_id, p.price, p.name, p.file_url
     FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?`, [req.user.id]
  );

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderId = execute(
    'INSERT INTO orders (user_id, total, email, status) VALUES (?, ?, ?, ?)',
    [req.user.id, total, email || null, 'completed']
  );

  for (const item of cartItems) {
    const itemId = execute(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, item.quantity, item.price]
    );
    const token = crypto.randomBytes(16).toString('hex');
    execute(
      'INSERT INTO downloads (order_id, product_id, token, email) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, token, email || null]
    );
  }

  execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

  const order = queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  const items = queryAll('SELECT oi.*, p.name, p.file_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [orderId]);
  const downloads = queryAll('SELECT * FROM downloads WHERE order_id = ?', [orderId]);
  res.status(201).json({ ...order, items, downloads, payment_id: razorpay_payment_id || null });
});

router.get('/', auth, (req, res) => {
  const orders = queryAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(orders);
});

router.get('/:id', auth, (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = queryAll('SELECT oi.*, p.name, p.file_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
  const downloads = queryAll('SELECT * FROM downloads WHERE order_id = ?', [order.id]);
  res.json({ ...order, items, downloads });
});

module.exports = router;
