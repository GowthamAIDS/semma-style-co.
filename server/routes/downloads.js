const express = require('express');
const path = require('path');
const fs = require('fs');
const { queryOne, execute } = require('../db');
const router = express.Router();

router.get('/:token', (req, res) => {
  const download = queryOne('SELECT * FROM downloads WHERE token = ?', [req.params.token]);
  if (!download) return res.status(404).json({ error: 'Download link not found' });
  const product = queryOne('SELECT * FROM products WHERE id = ?', [download.product_id]);
  if (!product || !product.file_url) return res.status(404).json({ error: 'File not found' });

  execute('UPDATE downloads SET downloaded_at = CURRENT_TIMESTAMP WHERE id = ?', [download.id]);

  const absolutePath = path.join(__dirname, '..', product.file_url);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'File not found on server' });
  }

  const filename = path.basename(product.file_url);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(absolutePath);
});

module.exports = router;
