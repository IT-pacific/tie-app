import { User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../actions/authActions';

type authState = {
  user: null | Partial<User>;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
};

const initialState: authState = {
  user: null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
  isAuthenticating: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setUser: (state, action: PayloadAction<null | Partial<User>>) => {
      state.user = action.payload;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setIsAuthenticated, setIsAuthenticating, setUser,resetUser } =
  authSlice.actions;

export default authSlice.reducer;
