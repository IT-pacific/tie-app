import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { items, Order } from '@/types';
import {
  addOrder,
  deleteOrder,
  fetchOrdersFromBackend,
  getOrderById,
  getOrdersFromLocalStorage,
  updateOrderPaymentProof,
  updateOrderStatus,
  uploadPaymentProof,
} from '../actions/orderActions';
import toast from 'react-hot-toast';

type OrderState = {
  currentOrder?: {order:Order,companyInfo:any };
  orders: Order[];
  isLoading: boolean;
  confirmOrderLoading: boolean,
  rejectOrderLoading: boolean,
  cancelOrderLoading:boolean
  error: string | null;
};

const initialState: OrderState = {
  orders: getOrdersFromLocalStorage() || null,
  isLoading: false,
  error: null,
  confirmOrderLoading: false,
  rejectOrderLoading: false,
  cancelOrderLoading:false
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(addOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      addOrder.fulfilled,
      (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.orders
          ? state.orders.push(action.payload)
          : (state.orders = [action.payload]);
      }
    );
    builder.addCase(addOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchOrdersFromBackend.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOrdersFromBackend.fulfilled,
      (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      }
    );
    builder.addCase(fetchOrdersFromBackend.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const { orderId, newStatus } = action.payload;
      if (state.orders) {
        const order = state.orders.find((o) => o._id === orderId);
        if (order) {
          order.status = newStatus;
        }
      }
      toast.success("Order  successfully updated")
    });

    builder
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.currentOrder = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update payment proof
    builder.addCase(updateOrderPaymentProof.fulfilled, (state, action) => {
      const { orderId, paymentProof } = action.payload;
      if (state.orders) {
        const order = state.orders.find((o) => o.order_id === orderId);
        if (order) {
          order.paymentProof = paymentProof;
        }
      }
    });

    // upload paymentProof
  builder .addCase(uploadPaymentProof.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(uploadPaymentProof.fulfilled, (state) => {
      state.isLoading = false
      toast.success("Payment proof successfully uploaded")
    })
    .addCase(uploadPaymentProof.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload as string)
      state.error = action.payload as string;
    })

    // Delete order
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      if (state.orders) {
        state.orders = state.orders.filter(
          (order) => order.order_id !== action.payload
        );
      }
    });
  },
});

export const { clearOrderError, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
