// src/context/AuthContext.jsx
// Контекст авторизации — теперь работает через реальный API (json-server)

import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Восстанавливаем сессию из localStorage при перезагрузке страницы.
  // Храним только безопасные данные (без пароля) — сервер его не возвращает.
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("et_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  // login — вызывает POST /login, получает объект пользователя (без пароля)
  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    localStorage.setItem("et_user", JSON.stringify(userData));
    setUser(userData);
  };

  // register — вызывает POST /register, хэш пароля делает сервер
  const register = async (email, password) => {
    const userData = await registerUser(email, password);
    localStorage.setItem("et_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("et_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
