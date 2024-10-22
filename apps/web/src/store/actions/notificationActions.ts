import { getNotificationApi, markAllAsReadApi } from "@/services/notification/notification.service";
import { Notification } from "@/types";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getNotification = createAsyncThunk(
  "notification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationApi(); 
      const notification:Notification[] = response; 
      return notification;
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);
export const markAllAsRead = createAsyncThunk(
  "notificationread",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllAsReadApi(); 
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);
