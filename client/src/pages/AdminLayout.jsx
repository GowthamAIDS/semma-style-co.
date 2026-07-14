import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { admin as adminApi } from '../api';
import { formatPrice } from '../utils';

export default function AdminLayout() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.orders()])
      .then(([s, o]) => { setStats(s); setOrders(o); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const navItems = [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Products', to: '/admin/products' },
  ];

  return (
    <div className="page" style={{ paddingTop: 80 }}>
      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <h3>Admin</h3>
          <nav>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >{item.label}</Link>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 28 }}>Dashboard</h1>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '60px 0' }}>Loading…</p>
          ) : (
            <>
              {stats && (
                <div className="stats-grid">
                  {[
                    { label: 'Orders', value: stats.total_orders ?? stats.orders ?? 0 },
                    { label: 'Revenue', value: formatPrice(stats.revenue ?? 0) },
                    { label: 'Products', value: stats.total_products ?? stats.products ?? 0 },
                    { label: 'Users', value: stats.total_users ?? stats.users ?? 0 },
                  ].map(item => (
                    <div key={item.label} className="stat-card">
                      <p>{item.label}</p>
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No orders yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.user_name || order.email || '—'}</td>
                          <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                          <td>
                            <span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'pending' ? 'badge-pending' : 'badge-default'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
