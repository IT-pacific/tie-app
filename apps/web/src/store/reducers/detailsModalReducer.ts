import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setModalOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
