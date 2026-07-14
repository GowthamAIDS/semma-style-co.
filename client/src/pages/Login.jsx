import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{
        paddingTop: 120, paddingBottom: 80,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '40px 36px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Welcome back</h1>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
              Sign in to your account
            </p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoFocus
                />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  style={{ paddingRight: 44 }}
                />
                <span onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 12, bottom: 10, fontSize: 13,
                  color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none',
                  fontWeight: 600,
                }}>{showPw ? 'Hide' : 'Show'}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Create one</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            Demo: admin@semma.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
