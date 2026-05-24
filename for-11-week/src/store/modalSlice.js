import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    title: "",
    message: "",
    itemId: null,
    itemType: "",
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.itemId = action.payload.itemId;
      state.itemType = action.payload.itemType;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.itemId = null;
      state.itemType = "";
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
