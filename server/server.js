require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDb } = require('./db');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({ origin: isProd ? '*' : (process.env.CLIENT_URL || 'http://localhost:3000'), credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/downloads', require('./routes/downloads'));

if (isProd) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return;
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }
}

const PORT = process.env.PORT || 5000;

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (${isProd ? 'production' : 'development'})`));
});
