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
      <div className="container" style={{ display: 'flex', gap: 40, minHeight: 'calc(100vh - 80px)' }}>
        <aside style={{
          width: 200, flexShrink: 0, borderRight: '1px solid var(--border)',
          paddingTop: 32,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, padding: '0 16px' }}>Admin</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'block', padding: '10px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500,
                  color: location.pathname === item.to ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: location.pathname === item.to ? '#fff' : 'transparent',
                  border: location.pathname === item.to ? '1px solid var(--border)' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >{item.label}</Link>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1, paddingTop: 32, paddingBottom: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 28 }}>Dashboard</h1>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '60px 0' }}>Loading…</p>
          ) : (
            <>
              {stats && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 40,
                }}>
                  {[
                    { label: 'Orders', value: stats.total_orders ?? stats.orders ?? 0 },
                    { label: 'Revenue', value: formatPrice(stats.revenue ?? 0) },
                    { label: 'Products', value: stats.total_products ?? stats.products ?? 0 },
                    { label: 'Users', value: stats.total_users ?? stats.users ?? 0 },
                  ].map(item => (
                    <div key={item.label} style={{
                      border: '1px solid var(--border)', borderRadius: 8, padding: 20, background: '#fff',
                    }}>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>{item.label}</p>
                      <p style={{ fontSize: 24, fontWeight: 700 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No orders yet.</p>
              ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>User</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Total</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 16px' }}>#{order.id}</td>
                          <td style={{ padding: '12px 16px' }}>{order.user_name || order.email || '—'}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatPrice(order.total)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                              background: order.status === 'completed' ? '#e8f5e9' : order.status === 'pending' ? '#fff3e0' : '#f5f5f5',
                              color: order.status === 'completed' ? '#2e7d32' : order.status === 'pending' ? '#e65100' : '#666',
                            }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
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
