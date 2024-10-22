import { createSlice } from '@reduxjs/toolkit';
import { items } from '@/types';
import {
  addItem,
  addManyItem,
  deleteItem,
  fetchItems,
  updateItem,
} from '../actions/itemAction';
import toast from 'react-hot-toast';

type itemState = {
 
  items: Partial<items>[] | null;
  fetchLoading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
};

const initialState: itemState = {
  items: [],
  fetchLoading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetItems: () => initialState,
  },
  extraReducers: (builder) => {
    // Handle adding a new item
    builder
      .addCase(addItem.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.addLoading = false;
        state.items
          ? state.items.push(action.payload)
          : (state.items = [action.payload]); // Add the item to the state
        toast.success('Item added successfully');
      })
      .addCase(addItem.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string; // Capture the error message
        toast.error('failed to add item');
      });
      builder
      .addCase(addManyItem.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
        .addCase(addManyItem.fulfilled, (state, action) => {
          state.addLoading = false;
          console.log(action.payload)
        action.payload
          ?state.items? state.items.push(...action.payload)
          //@ts-ignore
          :action.payload:(state.items = action.payload) 
        toast.success('Item added successfully');
      })
      .addCase(addManyItem.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string; 
        toast.error('failed to add items');
      });
    // Handle updateItem
    builder.addCase(updateItem.pending, (state) => {
      state.updateLoading = true;
      state.error = null;
    });
    builder
      .addCase(updateItem.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { itemId, updatedItem } = action.payload;
        toast.success('item updated successfully');

        if (state.items) {
          // Find and update the item, ensuring partial fields are safely merged
          const index = state.items.findIndex((item) => item._id === itemId);
          if (index !== -1) {
            state.items[index] = {
              ...state.items[index], // Keep existing fields
              ...updatedItem, // Merge updated fields
            } as items; // Ensure it's fully cast as items
          }
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
        toast.error('failed to update item');
      });

    // Delete item
    builder.addCase(deleteItem.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.deleteLoading = false;
      const { message, itemId } = action.payload;
      state.items =
        state.items && state.items.filter((item) => item._id !== itemId);
      toast.success(message);
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload as string;
      toast.error('Failed to delete item');
    });

    // Handle fetchItems
    builder.addCase(fetchItems.pending, (state) => {
      state.fetchLoading = true;
      state.error = null;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.fetchLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.fetchLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError,resetItems } = itemSlice.actions;
export default itemSlice.reducer;
