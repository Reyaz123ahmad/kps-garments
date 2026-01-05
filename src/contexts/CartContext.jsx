import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api/cart';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, ...action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, ...action.payload, loading: false };
    case 'UPDATE_ITEM':
      return { ...state, ...action.payload, loading: false };
    case 'REMOVE_ITEM':
      return { ...state, ...action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...state, items: [], totalPrice: 0, totalItems: 0, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  loading: false,
  error: null
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart(token);
    }
  }, []);

  const fetchCart = async (token) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await cartAPI.get({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.cart) {
        const cart = response.data.cart;
        dispatch({
          type: 'SET_CART',
          payload: {
            items: cart.items || [],
            totalPrice: cart.totalPrice || 0,
            totalItems: cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
          }
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await cartAPI.add({ productId, quantity });
      const cart = response.data.cart;
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          totalItems: cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
        }
      });
      toast.success('Product added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await cartAPI.update({ productId, quantity });
      const cart = response.data.cart;
      dispatch({
        type: 'UPDATE_ITEM',
        payload: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          totalItems: cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
        }
      });
      toast.success('Cart updated!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await cartAPI.remove(productId);
      const cart = response.data.cart;
      dispatch({
        type: 'REMOVE_ITEM',
        payload: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          totalItems: cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
        }
      });
      toast.success('Product removed from cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: () => {
      const token = localStorage.getItem('token');
      if (token) fetchCart(token);
    }
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
