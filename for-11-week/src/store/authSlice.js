// store/authSlice.js
// Редьюсер 1 — хранит данные авторизации
// Это то что раньше было только в useState внутри AuthContext
// Теперь доступно через Redux в любом компоненте без useContext
import { createSlice } from "@reduxjs/toolkit";

// Читаем пользователя из localStorage при старте
const savedUser = () => {
  try {
    const s = localStorage.getItem("et_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser(), // { id, email, role, createdAt } или null
  },
  reducers: {
    // Вход / Регистрация — сохраняем пользователя
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("et_user", JSON.stringify(action.payload));
    },
    // Выход — очищаем пользователя
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("et_user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

// Селекторы — удобно читать конкретные поля
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsAuth = (state) => state.auth.user !== null;
