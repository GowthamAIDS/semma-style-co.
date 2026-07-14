const express = require('express');
const { queryAll, queryOne } = require('../db');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/orders', adminAuth, (req, res) => {
  const orders = queryAll('SELECT * FROM orders ORDER BY created_at DESC');
  const result = orders.map(o => {
    const items = queryAll('SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [o.id]);
    return { ...o, items };
  });
  res.json(result);
});

router.get('/users', adminAuth, (req, res) => {
  const users = queryAll('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json(users);
});

router.get('/stats', adminAuth, (req, res) => {
  const totalOrders = queryOne('SELECT COUNT(*) as count FROM orders');
  const totalRevenue = queryOne('SELECT COALESCE(SUM(total),0) as total FROM orders');
  const totalProducts = queryOne('SELECT COUNT(*) as count FROM products');
  const totalUsers = queryOne('SELECT COUNT(*) as count FROM users');
  const recentOrders = queryAll('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
  res.json({
    orders: totalOrders.count,
    revenue: totalRevenue.total,
    products: totalProducts.count,
    users: totalUsers.count,
    recentOrders
  });
});

module.exports = router;
