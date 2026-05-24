import { createSlice } from "@reduxjs/toolkit";

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
    user: savedUser(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("et_user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("et_user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";
export const selectIsAuth = (state) => state.auth.user !== null;
