import {
  createOrder,
  getAllOrders,
  getOrderByIdApi,
  updateOrderStatusApi,
  uploadPaymentProofApi,
} from '@/services/orders/order.service';
import { items, Order } from '@/types';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Get orders from localStorage
export const getOrdersFromLocalStorage = (): Order[] => {
  try {
    const ordersData = localStorage.getItem('orders');
    return ordersData ? JSON.parse(ordersData) : [];
  } catch (error) {
    console.error('Error retrieving orders from localStorage', error);
    return [];
  }
};

// Save orders to localStorage
export const saveOrdersToLocalStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage', error);
  }
};
//get order from backend
export const fetchOrdersFromBackend = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrders();
      const orders: Order[] = response;
      saveOrdersToLocalStorage(orders);
      return orders;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);
// Add new order
export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (newOrder: Order, { rejectWithValue }) => {
    try {
      const existingOrders = getOrdersFromLocalStorage();
      const updatedOrders = [...existingOrders, newOrder];

      const response = await createOrder({ ...newOrder });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to add order');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    {
      orderId,
      newStatus,
      item_details
    }: {
      orderId: string;
      newStatus: 'pending' | 'confirmed' | 'rejected' | 'cancelled'|'completed';
        item_details?: {item:string }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const existingOrders = getOrdersFromLocalStorage();
      const updatedOrders = existingOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      const response = await updateOrderStatusApi(orderId, {
        status: newStatus,
        item_details:item_details
      });

      saveOrdersToLocalStorage(updatedOrders);
      return { orderId, newStatus };
    } catch (error) {
      return rejectWithValue('Failed to update order status');
    }
  }
);

// Update the payment proof for an existing order
export const updateOrderPaymentProof = createAsyncThunk(
  'orders/updateOrderPaymentProof',
  async (
    { orderId, paymentProof }: { orderId: string; paymentProof: string },
    { rejectWithValue }
  ) => {
    try {
      const existingOrders = getOrdersFromLocalStorage();
      const updatedOrders = existingOrders.map((order) =>
        order.order_id === orderId
          ? { ...order, p: paymentProof }
          : order
      );
      saveOrdersToLocalStorage(updatedOrders);
      return { orderId, paymentProof };
    } catch (error) {
      return rejectWithValue('Failed to update payment proof');
    }
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const existingOrders = getOrdersFromLocalStorage();
      const updatedOrders = existingOrders.filter(
        (order) => order.order_id !== orderId
      );
      saveOrdersToLocalStorage(updatedOrders);
      return orderId;
    } catch (error) {
      return rejectWithValue('Failed to delete order');
    }
  }
);

//GET ORDER BY iD
export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      const existingOrders = getOrdersFromLocalStorage();
      const response = await getOrderByIdApi(id);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to add order');
    }
  }
);
export const uploadPaymentProof = createAsyncThunk(
  'order/uploadPaymentProof',
  async ({ orderId, file }: { orderId: string; file: File }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('paymentProof', file);

      const response = await uploadPaymentProofApi(orderId, formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
