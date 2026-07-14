import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, parseGallery } from '../utils';

export default function ProductCard({ product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const gallery = parseGallery(product.gallery);
  const images = gallery.length > 0 ? gallery : [product.image];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setImgIndex(i => (i + 1) % images.length), 1200);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Link to={`/shop/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: 12, overflow: 'hidden',
        border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        <div style={{ aspectRatio: '3/4', background: '#f5f2ef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {images[imgIndex] ? (
            <img src={images[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s' }} />
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No Image</span>
          )}
        </div>
        <div style={{ padding: '16px 14px' }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{product.name}</h4>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{product.category}</p>
          <p style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
