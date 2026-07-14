import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products as productsApi } from '../api';
import { formatPrice, parseGallery } from '../utils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsApi.get(id).then(data => { setProduct(data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page container" style={{ paddingTop: 120 }}><p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '80px 0' }}>Loading…</p></div>;
  if (!product) return <div className="page container" style={{ paddingTop: 120 }}><div className="empty"><h2>Product not found</h2></div></div>;

  const images = parseGallery(product.gallery);
  const allImages = images.length > 0 ? images : [product.image].filter(Boolean);

  const handleAddToCart = async () => {
    if (!user) { alert('Please login to add items to cart.'); return; }
    setAdding(true);
    try { await addToCart(product.id); } catch { alert('Failed to add to cart.'); }
    setAdding(false);
  };

  return (
    <div className="page container" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          <div className="card" style={{
            aspectRatio: '3/4', overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 0,
          }}>
            {allImages.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => i === 0 ? allImages.length - 1 : i - 1)} style={{
                  position: 'absolute', left: 12, top: '50%', zIndex: 2,
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                  width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}>‹</button>
                <button onClick={() => setImgIndex(i => (i + 1) % allImages.length)} style={{
                  position: 'absolute', right: 12, top: '50%', zIndex: 2,
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                  width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}>›</button>
              </>
            )}
            {allImages[imgIndex] ? (
              <img src={allImages[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No Image</span>
            )}
          </div>
          {allImages.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)} style={{
                  width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: i === imgIndex ? 'var(--text-primary)' : 'var(--border)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
          )}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto' }}>
              {allImages.map((src, i) => (
                <img key={i} src={src} alt="" onClick={() => setImgIndex(i)} style={{
                  width: 64, height: 64, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                  border: i === imgIndex ? '2px solid var(--text-primary)' : '2px solid transparent',
                  opacity: i === imgIndex ? 1 : 0.6, flexShrink: 0, transition: 'border 0.2s, opacity 0.2s',
                }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ paddingTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: 8 }}>{product.category}</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>{product.name}</h1>
          <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{formatPrice(product.price)}</p>
          {product.description && (
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>{product.description}</p>
          )}
          <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg btn-block">{adding ? 'Adding…' : 'Add to Cart'}</button>
        </div>
      </div>
    </div>
  );
}
