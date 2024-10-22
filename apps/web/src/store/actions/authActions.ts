import { User } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Login, RegisterUser, whoami } from '@/services/auth/auth.service';
import {
  resetUser,
  setIsAuthenticated,
  setIsAuthenticating,
  setUser,
} from '../reducers/authReducer';
import toast from 'react-hot-toast';
import cookieStorage from '@/utils/cookieStorage';
import { resetItems } from '../reducers/itemReducer';
import { resetCart } from '../reducers/CartReducer';
import { resetOrders } from '../reducers/orderReducer';
import { resetLinks } from '../reducers/linkReducer';

// Register User Thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      // Call the register API
      const response = await RegisterUser(userData);

      // Assuming response contains user and token
      const { accessToken, refreshToken, message, user } = response;

      localStorage.setItem('isAuthenticated', 'true');

      // Save to localStorage
      cookieStorage.setItem('accessToken', accessToken);
      cookieStorage.setItem('refreshToken', refreshToken);

      // Update Redux store
      dispatch(setUser(user));
      dispatch(setIsAuthenticated(true));

      return { user, message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login User Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsAuthenticating(true));

      // Call the login API
      const response = await Login(credentials);

      // Assuming response contains user and token
      const { accessToken, message, refreshToken, user } = response;

      // Save to localStorage
      cookieStorage.setItem('accessToken', accessToken);
      cookieStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('isAuthenticated', 'true');

      // Update Redux store
      dispatch(setUser(user));
      dispatch(setIsAuthenticated(true));

      return { user, message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    } finally {
      dispatch(setIsAuthenticating(false));
    }
  }
);

export const whoAmI = createAsyncThunk(
  'auth/whoAmI',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsAuthenticating(true));

      const response = await whoami();
      const { user } = response;

      // Update Redux store
      dispatch(setUser(user));
      dispatch(setIsAuthenticated(true));
      return user;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Login failed');
    } finally {
      dispatch(setIsAuthenticating(false));
    }
  }
);

// Logout User Thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    // Clear localStorage
    localStorage.clear();
    cookieStorage.removeItem('accessToken');
    cookieStorage.removeItem('refreshToken');

    // Update Redux store
    dispatch(resetUser());
    dispatch(resetItems());
    dispatch(resetCart());
    dispatch(resetOrders());
    dispatch(resetLinks());
  }
);
