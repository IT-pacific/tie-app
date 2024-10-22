import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { items } from '@/types';
import {
  addItemToCart,
  getCartFromLocalStorage,
  removeItemFromCart,
  updateCartItem,
} from '../actions/cartActions';

type CartState = {
  cartItems: items[] | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cartItems: getCartFromLocalStorage(), // Cart starts as empty
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      localStorage.removeItem('cart');
      state.cartItems = null;
    },

    clearCartError: (state) => {
      state.error = null;
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    // Add item to the cart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems
          ? state.cartItems.push(action.payload)
          : (state.cartItems = [action.payload]); // Add the item to the cart
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Remove item from the cart
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        if (state.cartItems) {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== action.payload
          );
        }
      })

      // Update item in the cart
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cartItems) {
          const index = state.cartItems.findIndex(
            (item) => item._id === action.payload._id
          );
          if (index !== -1) {
            state.cartItems[index] = action.payload;
          }
        }
      });
  },
});

export const { clearCartError, clearCart,resetCart } = cartSlice.actions;
export default cartSlice.reducer;
