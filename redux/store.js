import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { productApi } from "./api/productapi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
