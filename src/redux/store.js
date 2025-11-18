import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./favoriteSlice";
import cartReducer from "./cartSlice";
export const store = configureStore({
  reducer: {
    favorite: favoriteReducer,
      cart: cartReducer,
  },
});
