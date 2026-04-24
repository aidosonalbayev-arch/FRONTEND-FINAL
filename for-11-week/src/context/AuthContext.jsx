// context/AuthContext.jsx
// Обёртка над Redux authSlice — даёт удобный useAuth() хук.
// user, isAdmin читаются из Redux через useSelector.
import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  clearUser,
  selectUser,
  selectIsAdmin,
} from "../store/authSlice";
import { resetTotal } from "../store/totalSlice";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin); // boolean, НЕ функция

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    dispatch(setUser(userData));
  };

  const register = async (email, password) => {
    const userData = await registerUser(email, password);
    dispatch(setUser(userData));
  };

  const logout = () => {
    dispatch(clearUser());
    dispatch(resetTotal());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin, // boolean: true если role === "admin"
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
