import { useLocation, Link } from 'react-router-dom';

export default function ThankYou() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 120 }}>
          <div className="empty">
            <h2>No order found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Looks like you haven't placed an order yet.</p>
            <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Thank You!</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Your order has been placed successfully.</p>
          {order.id && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              Order ID: <strong>#{order.id}</strong>
            </p>
          )}
        </div>
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          background: '#fff',
          marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Details</h3>
          {order.items?.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name || item.product_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {item.quantity || 1}</p>
              </div>
              {item.download_token && (
                <a
                  href={`http://localhost:5000/api/orders/download/${item.download_token}`}
                  className="btn btn-primary btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
