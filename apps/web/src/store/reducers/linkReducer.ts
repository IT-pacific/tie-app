import { items, Link } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  addLink,
  addSpecificLink,
  deleteLink,
  getAllLinks,
  getItemsByLink,
  updateLink,
} from '../actions/linkActions';
import toast from 'react-hot-toast';

type linkState = {
  links: Partial<Link>[] | null;
  company?:{email:string,phoneNumber?:string,companyName:string,companyLogo?:string}
  linkItems: Partial<items>[] | null;
  itemsLoading: boolean;
  fetchLoading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
};

const initialState: linkState = {
  links: [],
  
  linkItems: [],
  itemsLoading: false,
  fetchLoading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

const linkSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear any existing errors
    },
    resetLinks: () => initialState, //resetting links to initialState
  },
  extraReducers: (builder) => {
    // Handle adding a new link
    builder
      .addCase(addLink.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addLink.fulfilled, (state, action) => {
        state.addLoading = false;
        state.links
          ? state.links.push(action.payload.link)
          : (state.links = [action.payload.link]); 
        toast.success(action.payload.message);
      })
      .addCase(addLink.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string); 
      });


    
      builder
      .addCase(addSpecificLink.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addSpecificLink.fulfilled, (state, action) => {
        state.addLoading = false;
        state.links
          ? state.links.push(action.payload.link)
          : (state.links = [action.payload.link]); // Add the link to the state
        toast.success(action.payload.message);
      })
      .addCase(addSpecificLink.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string); // Capture the error message
      });

    // Update an existing link
    builder
      .addCase(updateLink.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { linkId, message, updatedLink } = action.payload;
        if (state.links) {
          // Find and update the link, ensuring partial fields are safely merged
          const index = state.links.findIndex((item) => item._id === linkId);
          if (index !== -1) {
            state.links[index] = {
              ...state.links[index], // Keep existing fields
              ...updatedLink, // Merge updated fields
            } as Link; // Ensure it's fully cast as items
          }
        }
        toast.success(message);
      })
      .addCase(updateLink.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Delete a link
    builder
      .addCase(deleteLink.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.deleteLoading = false;
        if (state.links)
          state.links = state.links.filter(
            (link) => link._id !== action.payload.linkId
          );
        toast.success(action.payload.message);
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // fetching links
    builder
      .addCase(getAllLinks.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(getAllLinks.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.links = action.payload;
      })
      .addCase(getAllLinks.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // fetching links with linkId
    builder
      .addCase(getItemsByLink.pending, (state) => {
        state.itemsLoading = true;
      })
      .addCase(getItemsByLink.fulfilled, (state, action) => {
        state.itemsLoading = false;
        state.linkItems = action.payload.items;
        state.company = action.payload.company;
      })
      .addCase(getItemsByLink.rejected, (state,action) => {
        state.itemsLoading = false;
        toast.error(action.payload as string);
      });
  },
});

export const { clearError, resetLinks } = linkSlice.actions;
export default linkSlice.reducer;
