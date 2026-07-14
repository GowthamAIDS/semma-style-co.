import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../api';
import { formatPrice } from '../utils';

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.list().then(data => { setOrders(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page container" style={{ paddingTop: 120, paddingBottom: 80, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>My Account</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 14 }}>
        {user?.name} &middot; {user?.email}
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Orders</h2>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="empty">
          <h2>No orders yet</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} style={{
              border: '1px solid var(--border)', borderRadius: 8, padding: 20, background: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Order #{order.id}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                    background: order.status === 'completed' ? '#e8f5e9' : order.status === 'pending' ? '#fff3e0' : '#f5f5f5',
                    color: order.status === 'completed' ? '#2e7d32' : order.status === 'pending' ? '#e65100' : '#666',
                  }}>{order.status}</span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 12 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: 'var(--text-secondary)' }}>
                      <span>{item.name || item.product_name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              {order.download_token && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <a
                    href={`http://localhost:5000/api/orders/download/${order.download_token}`}
                    className="btn btn-sm btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Files
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
