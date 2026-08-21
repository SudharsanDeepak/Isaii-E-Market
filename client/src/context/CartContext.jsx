import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isConsumer } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated || !isConsumer) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, isConsumer]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }
    const res = await api.post('/cart', { productId, quantity });
    if (res.data.success) {
      setCart(res.data.cart);
      return res.data;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    if (res.data.success) {
      setCart(res.data.cart);
      return res.data;
    }
  };

  const removeFromCart = async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    if (res.data.success) {
      setCart(res.data.cart);
      return res.data;
    }
  };

  const clearCart = async () => {
    const res = await api.delete('/cart');
    if (res.data.success) {
      setCart(res.data.cart);
    }
  };

  const cartCount = cart.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const subtotal = cart.items
    ? cart.items.reduce((acc, item) => {
        const itemPrice = item.product ? item.product.price : 0;
        return acc + itemPrice * item.quantity;
      }, 0)
    : 0;

  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        tax,
        shipping,
        grandTotal,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
