import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="header-logo">SEMMA</Link>

          <nav className="header-nav">
            <div className="nav-links">
              <Link to="/shop">Shop</Link>
              <Link to="/shop?category=T-Shirts">T-Shirts</Link>
              <Link to="/shop?category=Mockups">Mockups</Link>
              {user && <Link to="/account">Account</Link>}
              {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
            </div>
            {user ? (
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-sm btn-secondary">Logout</button>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            )}
            <Link to="/checkout" className="cart-link">
              <span className="cart-text">Cart</span>{items.length > 0 && <span className="cart-badge">{items.length}</span>}
            </Link>
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/shop" onClick={closeMenu}>Shop</Link>
          <Link to="/shop?category=T-Shirts" onClick={closeMenu}>T-Shirts</Link>
          <Link to="/shop?category=Mockups" onClick={closeMenu}>Mockups</Link>
          {user ? (
            <>
              <Link to="/account" onClick={closeMenu}>Account</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
              <button onClick={() => { logout(); navigate('/'); closeMenu(); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>Login</Link>
          )}
          <Link to="/checkout" onClick={closeMenu}>Cart ({items.length})</Link>
        </div>
      )}
    </>
  );
}
