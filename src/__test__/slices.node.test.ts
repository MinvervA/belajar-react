import { expect, test } from "vitest";
import { makeStore } from "../store";
import {
  addToCart,
  clearCart,
  selectCart,
  selectCartCount,
} from "../features/cartSlice";
import {
  selectPizzaSize,
  selectPizzaType,
  setPizzaSize,
  setPizzaType,
} from "../features/orderSlice";
import type { CartItem } from "../APIResponseType";

const item: CartItem = {
  pizza: {
    id: "pepperoni",
    name: "Pepperoni",
    category: "Classic",
    description: "Cheese",
    image: "/pizza.webp",
    sizes: { S: 9, M: 12, L: 15 },
  },
  size: "M",
  price: "$12.00",
};

test("cart appends duplicates, derives badge count and clears without mutating payload", () => {
  const store = makeStore();
  store.dispatch(addToCart(item));
  store.dispatch(addToCart(item));
  expect(selectCartCount(store.getState())).toBe(2);
  expect(selectCart(store.getState())).toEqual([item, item]);
  store.dispatch(clearCart());
  expect(selectCartCount(store.getState())).toBe(0);
  expect(item.size).toBe("M");
});

test("order selection and preloaded state are isolated between stores", () => {
  const store = makeStore({
    order: { pizzaType: "pepperoni", pizzaSize: "L" },
  });
  store.dispatch(setPizzaType("hawaiian"));
  store.dispatch(setPizzaSize("S"));
  expect(selectPizzaType(store.getState())).toBe("hawaiian");
  expect(selectPizzaSize(store.getState())).toBe("S");
  const other = makeStore();
  expect(selectPizzaType(other.getState())).toBe("pepperoni");
  expect(selectPizzaSize(other.getState())).toBe("M");
});
