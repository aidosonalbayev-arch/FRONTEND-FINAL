// store/modalSlice.js
// Редьюсер 2 — управляет модальными окнами подтверждения
// Вместо confirm() — красивое модальное окно
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false, // открыто ли модальное окно
    title: "", // заголовок
    message: "", // текст
    itemId: null, // id элемента который хотим удалить
    itemType: "", // тип: "expense" | "category" | "user"
  },
  reducers: {
    // Открыть модальное окно с нужными данными
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.itemId = action.payload.itemId;
      state.itemType = action.payload.itemType;
    },
    // Закрыть модальное окно (отмена или после подтверждения)
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
