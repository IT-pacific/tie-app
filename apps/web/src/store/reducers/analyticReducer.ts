import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Analytic } from '@/types';
import { getAnalytics } from '../actions/analyticActions';


type AnalyticState = {
  analytic: Analytic | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AnalyticState = {
  analytic: null,
  isLoading: false,
  error: null,
};

const analyticSlice = createSlice({
  name: 'analytic',
  initialState,
  reducers: {
    clearAnalyticError: (state) => {
      state.error = null;
    },
    resetAnalytic: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getAnalytics.fulfilled,
      (state, action: PayloadAction<Analytic>) => {
        state.isLoading = false;
        state.analytic=action.payload
      }
    );
    builder.addCase(getAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const {clearAnalyticError, resetAnalytic } = analyticSlice.actions;
export default analyticSlice.reducer;
