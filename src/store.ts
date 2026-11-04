import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./features/cartSlice";
import { orderSlice } from "./features/orderSlice";
import { pizzaApi } from "./api/pizzaApi";

const rootReducer = combineSlices(cartSlice, orderSlice, pizzaApi);
export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pizzaApi.middleware),
    devTools: import.meta.env.DEV,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
