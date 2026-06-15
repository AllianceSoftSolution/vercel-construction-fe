import { createSlice } from "@reduxjs/toolkit";
import { isHeadUser } from "../utils/userHelpers";

const normalizeUser = (user) => {
  if (!user) return null;
  return { ...user, isHead: isHeadUser(user) };
};

const initialState = {
  token: null,
  userType: null,
  isLoggedIn: false,
  user: null,
  businessName: null,
  username: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token;
      state.user = normalizeUser(payload.user);
      state.isLoggedIn = true;

      // Optional: Extract role or userType if needed in future
      state.userType = payload.user?.role || null;
      state.username = payload.user?.name || null;
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      state.userType = null;
      state.username = null;
      state.businessName = null;
    },
    setUser: (state, { payload }) => {
      state.user = normalizeUser(payload);
    },
    setBusinessName: (state, { payload }) => {
      console.log(payload, "qwertyu111");
      state.businessName = payload;
    },
  },
});

export const selectUserFromLocalStorage = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;

export const { login, setUser, logout, setBusinessName } = authSlice.actions;

export default authSlice.reducer;
