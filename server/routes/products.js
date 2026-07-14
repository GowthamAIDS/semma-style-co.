const express = require('express');
const { queryAll, queryOne, execute } = require('../db');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  const products = category
    ? queryAll('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC', [category])
    : queryAll('SELECT * FROM products ORDER BY created_at DESC');
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', adminAuth, (req, res) => {
  const { name, description, price, image, category, file_url, gallery } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
  const id = execute(
    'INSERT INTO products (name, description, price, image, category, file_url, gallery) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description || '', parseFloat(price), image || '', category || 'general', file_url || '', gallery || '']
  );
  const product = queryOne('SELECT * FROM products WHERE id = ?', [id]);
  res.status(201).json(product);
});

router.put('/:id', adminAuth, (req, res) => {
  const existing = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const { name, description, price, image, category, file_url, gallery } = req.body;
  execute(
    'UPDATE products SET name=?, description=?, price=?, image=?, category=?, file_url=?, gallery=? WHERE id=?',
    [
      name || existing.name,
      description ?? existing.description,
      price ? parseFloat(price) : existing.price,
      image ?? existing.image,
      category || existing.category,
      file_url ?? existing.file_url,
      (gallery !== undefined ? gallery : existing.gallery) || '',
      req.params.id
    ]
  );
  const product = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(product);
});

router.delete('/:id', adminAuth, (req, res) => {
  const existing = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  execute('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
