import { createSlice } from "@reduxjs/toolkit";

const userInitialState = { userInfo: null };

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUserInfo(state, action) {
      //console.log("Setting user info:", action.payload); // Log the payload to debug
      state.userInfo = action.payload;
    },
    resetUserInfo(state) {
      state.userInfo = null;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
