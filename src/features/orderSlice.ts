import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PizzaSize } from "../APIResponseType";

interface OrderState {
  pizzaType: string;
  pizzaSize: PizzaSize;
}

const initialState: OrderState = { pizzaType: "pepperoni", pizzaSize: "M" };

// Deliberate behavior change: selection survives route navigation (not reloads).
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPizzaType(state, action: PayloadAction<string>) {
      state.pizzaType = action.payload;
    },
    setPizzaSize(state, action: PayloadAction<PizzaSize>) {
      state.pizzaSize = action.payload;
    },
  },
  selectors: {
    selectPizzaType: (state) => state.pizzaType,
    selectPizzaSize: (state) => state.pizzaSize,
  },
});

export const { setPizzaType, setPizzaSize } = orderSlice.actions;
export const { selectPizzaType, selectPizzaSize } = orderSlice.selectors;
