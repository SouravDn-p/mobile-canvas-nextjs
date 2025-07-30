import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toast: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { setToast, clearToast } = settingsSlice.actions;
export default settingsSlice.reducer;
