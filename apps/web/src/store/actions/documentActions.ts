import { PROTECTED_API } from "@/services/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PROTECTED_API.get("/document/all");
      return response.data.documents;
    } catch (error) {
      return rejectWithValue(error instanceof AxiosError? error.response?.data?.message: "Error fetching documents");
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  "documents/fetchDocumentById",
  async (id: string|undefined, { rejectWithValue }) => {
    try {
      const response = await PROTECTED_API.get(`/document/${id}`);
      return response.data.document;
    } catch (error) {
      return rejectWithValue(error instanceof AxiosError? error.response?.data?.message: "Error fetching documents");
    }
  }
);

// Save or update a document
export const saveDocument = createAsyncThunk(
  "documents/saveDocument",
  async ({ id, sheets }: { id: string, sheets: any[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/documents", { id, sheets });
      return response.data.document;
    } catch (error) {
      return rejectWithValue(error instanceof AxiosError? error.response?.data?.message: "Error fetching documents");
    }
  }
);
