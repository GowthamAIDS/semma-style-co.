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
      <section style={{
        minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
      }}>
        <div>
          <p className="reveal" style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--text-secondary)', marginBottom: 16,
          }}>Semma Style Co</p>
          <h1 className="reveal" style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-1.5px',
            maxWidth: 700, margin: '0 auto 20px', lineHeight: 1.1,
          }}>Premium Digital Designs for Modern Brands</h1>
          <p className="reveal" style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 36px',
          }}>Curated mockups and t-shirt designs crafted to elevate your brand identity.</p>
          <Link to="/shop" className="btn btn-primary btn-lg reveal">Shop Now</Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section style={{ padding: '0 0 100px' }} className="container">
          <h2 className="reveal" style={{
            fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 40,
          }}>Featured Products</h2>
          <div className="reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
