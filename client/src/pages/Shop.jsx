import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products as productsApi } from '../api';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'T-Shirts', 'Mockups'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('category') || 'All';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const cat = active === 'All' ? undefined : active;
    productsApi.list(cat).then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  }, [active]);

  const setCategory = (c) => {
    if (c === 'All') setSearchParams({});
    else setSearchParams({ category: c });
  };

  return (
    <div className="page container" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Shop</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`btn btn-sm ${active === c ? 'btn-primary' : 'btn-secondary'}`}>{c}</button>
        ))}
      </div>
      {loading ? (
        <p style={{ color: 'var(--text-secondary)', padding: '60px 0', textAlign: 'center' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div className="empty"><h2>No products found</h2><p>Try a different category.</p></div>
      ) : (
        <div className="grid-products">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
