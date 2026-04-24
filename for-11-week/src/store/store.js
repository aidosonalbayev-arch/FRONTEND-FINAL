// store/store.js — главный Redux store
// Регистрируем все 4 reducer-а. Без этого useSelector вернёт undefined.
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import totalReducer from "./totalSlice";
import notificationReducer from "./notificationSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // state.auth.user
    total: totalReducer, // state.total.{allTime, thisMonth, count}
    notifications: notificationReducer, // state.notifications.items
    modal: modalReducer, // state.modal.{isOpen, title, ...}
  },
});
