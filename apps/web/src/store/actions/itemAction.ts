import { items } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addItem as addItemAPI,
  updateItem as updateItemAPI,
  getAllItems as getAllItemsAPI,
  deleteItem as deleteItemFromAPI,
  addManyItemApi,
} from "@/services/inventories/inventory.service";

export const getItemsFromLocalStorage = (): items[] => {
  try {
    const itemsData = localStorage.getItem("items");
    return itemsData ? JSON.parse(itemsData) : [];
  } catch (error) {
    console.error("Error retrieving links from localStorage", error);
    return [];
  }
};

export const saveItemsToLocalStorage = (items: Partial<items>[]): void => {
  try {
    localStorage.setItem("items", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving links to localStorage", error);
  }
};

export const addItem = createAsyncThunk(
  "items/addItem",
  async (item: Partial<items>, { rejectWithValue }) => {
    const existingItems = getItemsFromLocalStorage() || [];
    const updatedItems = [...existingItems, item];
    saveItemsToLocalStorage(updatedItems);

    try {
      
      const response = await addItemAPI(item);
      return response.item; 
    } catch (error: any) {
    
      saveItemsToLocalStorage(existingItems);
      return rejectWithValue(error.message);
    }
  }
);
export const addManyItem = createAsyncThunk(
  "items/addItems",
  async (item: Partial<items>[], { rejectWithValue }) => {
    const existingItems = getItemsFromLocalStorage() || [];
    item.map((item)=>item)
    const updatedItems = [...existingItems,...item];
    saveItemsToLocalStorage(updatedItems);

    try {
      const response = await addManyItemApi(item);
      
      return response.item; 
    } catch (error: any) {
     
      saveItemsToLocalStorage(existingItems);
      return rejectWithValue(error.message);
    }
  }
);


export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (
    { item, itemId }: { item: Partial<items>; itemId?: string },
    { rejectWithValue }
  ) => {
    const existingItems = getItemsFromLocalStorage() || [];
    const updatedItems = existingItems.map((existingItem: items) =>
      existingItem._id === itemId ? { ...existingItem, ...item } : existingItem
    );
    saveItemsToLocalStorage(updatedItems);

    try {
      await updateItemAPI(item, itemId);
      return { itemId, updatedItem: item };
    } catch (error: any) {
      saveItemsToLocalStorage(existingItems);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all items action
export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllItemsAPI();
      saveItemsToLocalStorage(response.items); 
      return response.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle delete item
export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const existingItems = getItemsFromLocalStorage();
      const updatedItems = existingItems.filter((item) => item._id !== itemId);
      saveItemsToLocalStorage(updatedItems);

      const response = await deleteItemFromAPI(itemId);

      return { itemId, message:response.message };
    } catch (error: any) {
      // Rollback
      const existingItems = getItemsFromLocalStorage();
      saveItemsToLocalStorage(existingItems);
      return rejectWithValue("Failed to delete item");
    }
  }
);
