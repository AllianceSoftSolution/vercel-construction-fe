import { createSlice } from "@reduxjs/toolkit";
// import apiClient from "../api/apiClient"

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
      state.user = payload.user;
      state.isLoggedIn = true;
      // console.log(payload.token);
      // state.userType = payload.userType;
      // state.rvnLvnValue = payload.rvnLvnValue
      // state.isLoggedIn = true;
      // state.username = payload.username;
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
    },

    setUser: (state, { payload }) => {
      state.user = payload; // Set the user data from the action payload
    },
    setBusinessName: (state, { payload }) => {
      console.log(payload, "qwertyu111");
      state.businessName = payload;
    },
  },
});

export const selectUserFromLocalStorage = (state) => {
  return state.auth.user;
};

// Action creators are generated for each case reducer function
export const { login, setUser, logout, setBusinessName } = authSlice.actions;

export default authSlice.reducer;
