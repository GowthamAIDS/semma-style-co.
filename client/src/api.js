const API = '/api';

const token = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

const req = async (url, opts = {}) => {
  const isFormData = opts.body instanceof FormData;
  const h = isFormData ? { Authorization: `Bearer ${token()}` } : { ...headers(), ...opts.headers };
  const res = await fetch(url, { ...opts, headers: h });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Server returned HTML instead of JSON — possibly a network or routing issue'); }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const auth = {
  login: (body) => req(`${API}/auth/login`, { method: 'POST', body: JSON.stringify(body) }),
  signup: (body) => req(`${API}/auth/signup`, { method: 'POST', body: JSON.stringify(body) }),
  me: () => req(`${API}/auth/me`),
};

export const products = {
  list: (category) => req(`${API}/products${category ? `?category=${category}` : ''}`),
  get: (id) => req(`${API}/products/${id}`),
  create: (body) => req(`${API}/products`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => req(`${API}/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => req(`${API}/products/${id}`, { method: 'DELETE' }),
};

export const cart = {
  get: () => req(`${API}/cart`),
  add: (body) => req(`${API}/cart/add`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => req(`${API}/cart/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => req(`${API}/cart/${id}`, { method: 'DELETE' }),
};

export const orders = {
  create: (body) => req(`${API}/orders`, { method: 'POST', body: JSON.stringify(body) }),
  list: () => req(`${API}/orders`),
  get: (id) => req(`${API}/orders/${id}`),
};

export const payment = {
  createOrder: () => req(`${API}/payment/create-order`, { method: 'POST' }),
  verify: (body) => req(`${API}/payment/verify`, { method: 'POST', body: JSON.stringify(body) }),
};

export const admin = {
  orders: () => req(`${API}/admin/orders`),
  users: () => req(`${API}/admin/users`),
  stats: () => req(`${API}/admin/stats`),
};

export const upload = {
  file: (formData) => req(`${API}/upload`, { method: 'POST', body: formData }),
};
