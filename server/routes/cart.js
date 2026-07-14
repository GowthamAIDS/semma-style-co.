const express = require('express');
const { queryAll, queryOne, execute } = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const items = queryAll(
    `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image
     FROM cart_items ci JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`, [req.user.id]
  );
  res.json(items);
});

router.post('/add', auth, (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id) return res.status(400).json({ error: 'Product ID required' });
  const existing = queryOne('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
  if (existing) {
    execute('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing.id]);
  } else {
    execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity || 1]);
  }
  const items = queryAll(
    `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image
     FROM cart_items ci JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`, [req.user.id]
  );
  res.json(items);
});

router.put('/:id', auth, (req, res) => {
  execute('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [req.body.quantity, req.params.id, req.user.id]);
  res.json({ message: 'Updated' });
});

router.delete('/:id', auth, (req, res) => {
  execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ message: 'Removed' });
});

module.exports = router;
