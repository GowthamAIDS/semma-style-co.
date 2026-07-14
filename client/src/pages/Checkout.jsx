import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orders as ordersApi, payment as paymentApi } from '../api';
import { formatPrice } from '../utils';

export default function Checkout() {
  const { user } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEmail(user.email || '');

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [user, navigate]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const order = await paymentApi.createOrder();
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Semma Style Co',
        description: 'Purchase',
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const result = await ordersApi.create({
              email,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/thank-you', { state: { order: result } });
          } catch (err) {
            setError('Payment verified but order creation failed. Contact support.');
            setLoading(false);
          }
        },
        prefill: { email },
        theme: { color: '#1a1a1a' },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: 120 }}>
          <div className="empty">
            <h2>Your cart is empty</h2>
            <p>Add some items before checking out.</p>
            <a href="/shop" className="btn btn-primary">Browse Shop</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Checkout</h1>
        <div className="checkout-grid">
          <div>
            {error && <div className="error">{error}</div>}
            <div className="card" style={{ padding: 24 }}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={handlePay}
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
              </button>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name || item.product_name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 4 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>Total</p>
              <p style={{ fontSize: 18, fontWeight: 700 }}>{formatPrice(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
