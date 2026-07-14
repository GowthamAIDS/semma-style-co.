const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const { queryAll } = require('../db');

const router = express.Router();

router.post('/create-order', auth, async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(400).json({ error: 'Payment gateway not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' });
  }

  const cartItems = queryAll(
    'SELECT ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?',
    [req.user.id]
  );

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const amountPaise = Math.round(total * 100);

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`,
    });
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency, key_id: keyId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment: ' + err.message });
  }
});

router.post('/verify', auth, (req, res) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto.createHmac('sha256', keySecret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

  if (expected === razorpay_signature) {
    res.json({ verified: true, payment_id: razorpay_payment_id });
  } else {
    res.status(400).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
