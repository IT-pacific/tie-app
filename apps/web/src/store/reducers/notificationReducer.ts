import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNotification, markAllAsRead } from '../actions/notificationActions';
import { Notification } from "@/types";
interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      if (state.notifications.find((notification) => notification.id == action.payload.id)) {
       state.notifications=state.notifications
     }
      else {
        state.notifications.push(action.payload);
     }
    
    },
    markAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification, 
        read: true,
      }));
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotification.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getNotification.fulfilled,
      (state, action: PayloadAction<Notification[]>) => {
        state.isLoading = false;
        state.notifications = action.payload;
      }
    );
    builder.addCase(getNotification.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch notifications';
    });
    builder.addCase(markAllAsRead.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      markAllAsRead.fulfilled,
      (state) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((notification) => ({
          ...notification, 
          read: true,
        }));
      }
    );
    builder.addCase(markAllAsRead.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch notifications';
    });
  },
});

export const {
  addNotification,
  markAsRead,
  clearNotifications,
  setNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
