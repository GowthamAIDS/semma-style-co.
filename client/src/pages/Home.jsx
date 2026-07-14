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
        <div>
          <p className="gsap-reveal" style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--text-secondary)', marginBottom: 20,
          }}>Semma Style Co</p>
          <h1 className="gsap-reveal" style={{
            fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-1.5px',
            maxWidth: 700, margin: '0 auto 20px', lineHeight: 1.1,
          }}>Premium Digital Designs for Modern Brands</h1>
          <p className="gsap-reveal" style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>Curated mockups and t-shirt designs crafted to elevate your brand identity.</p>
          <Link to="/shop" className="btn btn-primary btn-lg gsap-reveal">Shop Now</Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section style={{ padding: '0 0 100px' }} className="container">
          <h2 className="gsap-reveal" style={{
            fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 40,
          }}>Featured Products</h2>
          <div className="grid-products gsap-reveal">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
