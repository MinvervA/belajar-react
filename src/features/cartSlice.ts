import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../APIResponseType";

const initialState: CartItem[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.push(action.payload);
    },
    clearCart() {
      return initialState;
    },
  },
  selectors: {
    selectCart: (state) => state,
    selectCartCount: (state) => state.length,
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export const { selectCart, selectCartCount } = cartSlice.selectors;
