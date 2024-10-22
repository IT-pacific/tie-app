import { getAnalyticApi } from "@/services/analytic/analytic.service";
import { Analytic } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAnalytics = createAsyncThunk(
  "analytics",
  async (period:string|undefined, { rejectWithValue }) => {
    try {
      const response = await getAnalyticApi(period); 
      const analytics: Analytic = response; 
      return analytics;
    } catch (error) {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);