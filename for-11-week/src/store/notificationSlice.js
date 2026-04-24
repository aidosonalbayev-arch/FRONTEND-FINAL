// store/notificationSlice.js
// Редьюсер 1 — управляет уведомлениями (toast-сообщения)
// Вместо alert() — красивые уведомления в углу экрана
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    // items = [{ id, message, type: "success"|"error"|"info", }]
  },
  reducers: {
    // Добавить уведомление
    addNotification: (state, action) => {
      state.items.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || "info",
      });
    },
    // Удалить уведомление по id (после таймаута или по клику)
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

// ─── Вспомогательные action creators ─────────────────────────────────────────
// Вместо dispatch({ type, payload }) — удобные функции
export const notify = {
  success: (message) => addNotification({ message, type: "success" }),
  error: (message) => addNotification({ message, type: "error" }),
  info: (message) => addNotification({ message, type: "info" }),
};
