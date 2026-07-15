import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as productsApi } from '../api';
import useScrollReveal from '../hooks/useScrollReveal';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useScrollReveal();

  useEffect(() => {
    productsApi.list().then(data => setFeatured(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="gsap-reveal hero-badge">Premium Design Studio</span>
          <h1 className="gsap-reveal" style={{
            fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-1.5px',
            maxWidth: 700, margin: '0 auto 20px', lineHeight: 1.1,
          }}>Crafted for<br />Modern Brands</h1>
          <p className="gsap-reveal" style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>Premium mockups and t-shirt designs to elevate your brand identity.</p>
          <div className="gsap-reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link to="/shop?category=Mockups" className="btn btn-secondary btn-lg">View Mockups</Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container hero-section" style={{ padding: '0 0 100px' }}>
          <h2 className="gsap-reveal section-title">Featured Products</h2>
          <p className="gsap-reveal section-subtitle">Curated designs made for creators, brands, and everyone in between.</p>
          <div className="section-divider gsap-reveal" style={{ marginBottom: 40 }} />
          <div className="grid-products gsap-reveal">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
