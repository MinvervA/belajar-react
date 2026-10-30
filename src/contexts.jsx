import { createContext } from "react";

export const CartContext = createContext([
  [], // cart default
  function () {}, // fungsi default
]);
