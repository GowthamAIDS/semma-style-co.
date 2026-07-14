import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Not authorized as admin');
        localStorage.removeItem('token');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', paddingTop: 80,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="card" style={{ padding: '40px 36px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Admin</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            Sign in to access the admin panel.
          </p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@semma.com" required autoFocus />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password" required
                style={{ paddingRight: 44 }}
              />
              <span onClick={() => setShowPw(p => !p)} style={{
                position: 'absolute', right: 12, bottom: 11, fontSize: 13,
                color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none',
                fontWeight: 600,
              }}>{showPw ? 'Hide' : 'Show'}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          Demo: admin@semma.com / admin123
        </p>
      </div>
    </div>
  );
}
