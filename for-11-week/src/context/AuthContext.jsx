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
  const isAdmin = useSelector(selectIsAdmin);

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
        isAdmin,
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
