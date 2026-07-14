import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>SEMMA</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/shop" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Shop</Link>
          <Link to="/shop?category=T-Shirts" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>T-Shirts</Link>
          <Link to="/shop?category=Mockups" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Mockups</Link>
          {user ? (
            <>
              <Link to="/account" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Account</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Admin</Link>}
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm btn-secondary">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
          )}
          <Link to="/checkout" style={{ position: 'relative', fontSize: 13, fontWeight: 600 }}>
            Cart {items.length > 0 && <span style={{
              position: 'absolute', top: -8, right: -12, background: 'var(--text-primary)',
              color: 'var(--bg-primary)', fontSize: 10, borderRadius: '50%', width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{items.length}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
