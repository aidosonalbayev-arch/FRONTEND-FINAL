import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import totalReducer from "./totalSlice";
import notificationReducer from "./notificationSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    total: totalReducer,
    notifications: notificationReducer,
    modal: modalReducer,
  },
});
