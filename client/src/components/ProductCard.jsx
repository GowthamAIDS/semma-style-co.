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
      <div className="card card-sm card-product">
        <div className="card-img">
          {images[imgIndex] ? (
            <img src={images[imgIndex]} alt={product.name} />
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No Image</span>
          )}
        </div>
        <div className="card-body" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{product.name}</h4>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{product.category}</p>
          <p style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
