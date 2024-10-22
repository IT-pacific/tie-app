import { createAsyncThunk } from '@reduxjs/toolkit';
import { items } from '@/types';

// Helper functions for localStorage
export const getCartFromLocalStorage = (): items[] => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error retrieving cart from localStorage', error);
    return [];
  }
};

export const saveCartToLocalStorage = (cartItems: items[]): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage', error);
  }
};

// Add an item to the cart
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (newItem: items, { rejectWithValue }) => {
    try {
      const existingCartItems = getCartFromLocalStorage();
      const updatedCartItems = [...existingCartItems, newItem];

      saveCartToLocalStorage(updatedCartItems);

      return newItem; // Return the added item to update the state
    } catch (error) {
      return rejectWithValue('Failed to add item to the cart');
    }
  }
);

// Remove an item from the cart
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const existingCartItems = getCartFromLocalStorage();
      const updatedCartItems = existingCartItems.filter(
        (item) => item._id !== itemId
      );

      saveCartToLocalStorage(updatedCartItems);

      return itemId; // Return the removed item's ID to update the state
    } catch (error) {
      return rejectWithValue('Failed to remove item from the cart');
    }
  }
);

// Update an item in the cart
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (updatedItem: items, { rejectWithValue }) => {
    try {
      const existingCartItems = getCartFromLocalStorage();
      const updatedCartItems = existingCartItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      );

      saveCartToLocalStorage(updatedCartItems);

      return updatedItem; // Return the updated item to update the state
    } catch (error) {
      return rejectWithValue('Failed to update item in the cart');
    }
  }
);
