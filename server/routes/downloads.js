const express = require('express');
const { queryOne, execute } = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/:token', auth, (req, res) => {
  const download = queryOne('SELECT * FROM downloads WHERE token = ?', [req.params.token]);
  if (!download) return res.status(404).json({ error: 'Download link not found' });
  const product = queryOne('SELECT * FROM products WHERE id = ?', [download.product_id]);
  if (!product || !product.file_url) return res.status(404).json({ error: 'File not found' });
  execute('UPDATE downloads SET downloaded_at = CURRENT_TIMESTAMP WHERE id = ?', [download.id]);
  res.json({ file_url: product.file_url, product_name: product.name });
});

module.exports = router;
