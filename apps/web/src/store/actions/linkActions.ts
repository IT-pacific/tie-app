import { Link } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createLink as createLinkAPI,
  updateLink as updateLinkAPI,
  deleteLink as deleteLinkAPI,
  getAllLinks as getAllLinksAPI,
  getItemsByLink as getItemsByLinkAPI,
} from '@/services/links/links.service';

// Helper functions
export const getLinksFromLocalStorage = (): Link[] => {
  try {
    const linksData = localStorage.getItem('links');
    return linksData ? JSON.parse(linksData) : [];
  } catch (error) {
    console.error('Error retrieving links from localStorage', error);
    return [];
  }
};

export const saveLinksToLocalStorage = (links: Partial<Link>[]): void => {
  try {
    localStorage.setItem('links', JSON.stringify(links));
  } catch (error) {
    console.error('Error saving links to localStorage', error);
  }
};

// Add a link
export const addLink = createAsyncThunk(
  'links/addLink',
  async (newLink: Partial<Link>, { rejectWithValue }) => {
    const existingLinks = getLinksFromLocalStorage();

    const updatedLinks = [...existingLinks, newLink];
    saveLinksToLocalStorage(updatedLinks);

    try {
      const response = await createLinkAPI(newLink);
      const { link, message } = response;
      return { link, message };
    } catch (error: any) {
      saveLinksToLocalStorage(existingLinks);
      return rejectWithValue(error.message);
    }
  }
);
export const addSpecificLink = createAsyncThunk(
  'links/addSpecificLink',
  async (newLink:  { item_ids:string[]|null,visibleFields?:string[],expiresAt:Date|undefined,customerIds?:[string]}, { rejectWithValue }) => {
    const existingLinks = getLinksFromLocalStorage();
 
    
    

    try {
      const response = await createLinkAPI(newLink);
      const { link,message} = response;
    
      const updatedLinks = [...existingLinks, link]
      saveLinksToLocalStorage(updatedLinks);
      return {link,message}
    } catch (error: any) {
      saveLinksToLocalStorage(existingLinks);
      return rejectWithValue(error.message);
    }
  }
);


// Update a link
export const updateLink = createAsyncThunk(
  'links/updateLink',
  async (
    { updatedLink, linkId }: { updatedLink: Partial<Link>; linkId: string },
    { rejectWithValue }
  ) => {
    const existingLinks = getLinksFromLocalStorage();
    const updatedLinks = existingLinks.map((link) =>
      link._id === updatedLink._id ? updatedLink : link
    );
    saveLinksToLocalStorage(updatedLinks);

    try {
      const response = await updateLinkAPI(updatedLink, linkId);
      return { linkId, message: response.message, updatedLink: response.link };
    } catch (error: any) {
      saveLinksToLocalStorage(existingLinks);
      return rejectWithValue(error.message);
    }
  }
);

// Delete a link
export const deleteLink = createAsyncThunk(
  'links/deleteLink',
  async (linkId: string, { rejectWithValue }) => {
    const existingLinks = getLinksFromLocalStorage();
    const updatedLinks = existingLinks.filter((link) => link._id !== linkId);
    saveLinksToLocalStorage(updatedLinks);
    try {
      const response = await deleteLinkAPI(linkId);
      return { linkId, message: response.message };
    } catch (error: any) {
      saveLinksToLocalStorage(existingLinks);
      return rejectWithValue(error.message);
    }
  }
);

export const getAllLinks = createAsyncThunk(
  'links/getAllLinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllLinksAPI();
     
      saveLinksToLocalStorage(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getItemsByLink = createAsyncThunk(
  'links/items',
  async (linkId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await getItemsByLinkAPI(linkId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
