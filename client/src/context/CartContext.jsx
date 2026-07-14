import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cart as cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try { setItems(await cartApi.get()); } catch { setItems([]); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    const updated = await cartApi.add({ product_id, quantity });
    setItems(updated);
  };

  const updateQuantity = async (id, quantity) => {
    await cartApi.update(id, { quantity });
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const removeFromCart = async (id) => {
    await cartApi.remove(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
