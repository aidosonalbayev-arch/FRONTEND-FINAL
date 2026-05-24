import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || "info",
      });
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

export const notify = {
  success: (message) => addNotification({ message, type: "success" }),
  error: (message) => addNotification({ message, type: "error" }),
  info: (message) => addNotification({ message, type: "info" }),
};
