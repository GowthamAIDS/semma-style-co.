import { useLocation, Link } from 'react-router-dom';

export default function ThankYou() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty">
            <h2>No order found</h2>
            <p>Looks like you haven't placed an order yet.</p>
            <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container page-sm" style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,125,50,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28,
          }}>✓</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Thank You!</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Your order has been placed successfully.</p>
          {order.id && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              Order ID: <strong>#{order.id}</strong>
            </p>
          )}
        </div>
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Details</h3>
          {order.items?.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
              padding: '12px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name || item.product_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {item.quantity || 1}</p>
              </div>
              {item.download_token && (
                <a
                  href={`/api/downloads/${item.download_token}`}
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
