import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as productsApi } from '../api';
import { formatPrice, parseGallery } from '../utils';

const emptyForm = { name: '', description: '', price: '', category: 'T-Shirts', image: '', file_url: '', gallery: '' };

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    productsApi.list().then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const reset = () => { setForm(emptyForm); setEditId(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        gallery: form.gallery.trim(),
      };
      if (editId) {
        await productsApi.update(editId, body);
      } else {
        await productsApi.create(body);
      }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || 'T-Shirts',
      image: item.image || '',
      file_url: item.file_url || '',
      gallery: item.gallery || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 80 }}>
      <div className="container" style={{ display: 'flex', gap: 40, minHeight: 'calc(100vh - 80px)' }}>
        <aside style={{
          width: 200, flexShrink: 0, borderRight: '1px solid var(--border)', paddingTop: 32,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, padding: '0 16px' }}>Admin</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Dashboard', to: '/admin' },
              { label: 'Products', to: '/admin/products' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'block', padding: '10px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500,
                  color: item.to === '/admin/products' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: item.to === '/admin/products' ? '#fff' : 'transparent',
                  border: item.to === '/admin/products' ? '1px solid var(--border)' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >{item.label}</Link>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1, paddingTop: 32, paddingBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products</h1>
            {!editId && (
              <button onClick={() => { reset(); }} className="btn btn-primary btn-sm">Add Product</button>
            )}
          </div>

          <div style={{
            border: '1px solid var(--border)', borderRadius: 8, padding: 24, background: '#fff', marginBottom: 32,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editId ? 'Edit Product' : 'New Product'}</h3>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" step="0.01" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Mockups">Mockups</option>
                  <option value="general">general</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>File URL</label>
                <input value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Gallery (comma-separated URLs)</label>
                <input value={form.gallery} onChange={e => setForm(f => ({ ...f, gallery: e.target.value }))} placeholder="url1, url2, url3" />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
                </button>
                {editId && <button type="button" className="btn btn-secondary btn-sm" onClick={reset}>Cancel</button>}
              </div>
            </form>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '60px 0' }}>Loading…</p>
          ) : items.length === 0 ? (
            <div className="empty"><h2>No products</h2><p style={{ color: 'var(--text-secondary)' }}>Add your first product above.</p></div>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Image</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Price</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Gallery</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const gallery = parseGallery(item.gallery);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          {item.image ? (
                            <img src={item.image} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }} />
                          ) : (
                            <div style={{ width: 44, height: 44, background: '#f0ede8', borderRadius: 4 }} />
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{item.category}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatPrice(item.price)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {gallery.slice(0, 4).map((url, i) => (
                              <img key={i} src={url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 3, border: '1px solid var(--border)' }} />
                            ))}
                            {gallery.length > 4 && (
                              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-secondary)', background: '#f0ede8', borderRadius: 3 }}>
                                +{gallery.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEdit(item)} className="btn btn-secondary btn-sm">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm" style={{ border: '1px solid #e44', color: '#e44', background: 'none' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
