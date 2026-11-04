import { createLazyFileRoute } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, clearCart, selectCart } from "../features/cartSlice";
import {
  selectPizzaType,
  selectPizzaSize,
  setPizzaType,
  setPizzaSize,
} from "../features/orderSlice";
import { useGetPizzasQuery, usePlaceOrderMutation } from "../api/pizzaApi";

import { Pizza } from "../Pizza";
import { Cart } from "../Cart";
import type { PizzaSize } from "../APIResponseType";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const dispatch = useAppDispatch();
  const pizzaType = useAppSelector(selectPizzaType);
  const pizzaSizes = useAppSelector(selectPizzaSize);
  const cart = useAppSelector(selectCart);
  const {
    data: pizzaTypes = [],
    isLoading: loading,
    isError,
  } = useGetPizzasQuery();
  const [placeOrder, { isLoading: isCheckingOut, isError: checkoutError }] =
    usePlaceOrderMutation();
  const selectedPizza = pizzaTypes.find((pizza) => pizza.id === pizzaType);
  const price = selectedPizza
    ? intl.format(selectedPizza.sizes[pizzaSizes])
    : undefined;

  async function checkout() {
    if (isCheckingOut) return;
    const result = await placeOrder({ cart });
    if (!result.error) dispatch(clearCart());
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] px-4">
      <h2>Create Order</h2>
      <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-[2fr_1fr]">
        <form
          action=""
          className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();

            if (!selectedPizza || !price || isCheckingOut) {
              return;
            }
            dispatch(
              addToCart({ pizza: selectedPizza, size: pizzaSizes, price }),
            );
          }}
        >
          <div className="min-w-0 w-full border-b border-border p-[15px] text-center sm:border-r sm:border-b-0">
            <div className="my-[10px] text-center">
              <label
                htmlFor="pizzaType"
                className="mb-[10px] block text-[20px] text-secondary"
              >
                Pizza Type :
              </label>
              <select
                name="pizzaType"
                value={pizzaType}
                id="pizzaType"
                className="form-select mb-[30px] block w-full p-[5px] text-[16px]"
                onChange={(e) => dispatch(setPizzaType(e.target.value))}
              >
                {/* <option value="pepperoni">Pepperoni</option>
              <option value="hawaiian">Hawaiian</option>
              <option value="pizzaHut">Pizza Hut</option> */}
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="my-[10px] text-center">
              <p
                id="pizza-size-label"
                className="mb-[10px] block text-[20px] text-secondary"
              >
                Pizza Size :
              </p>
              <div
                role="radiogroup"
                aria-labelledby="pizza-size-label"
                className="my-[10px] flex flex-wrap justify-center gap-2 text-center"
              >
                <span className="inline-block">
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    checked={pizzaSizes === "S"}
                    type="radio"
                    id="pizza-s"
                    name="pizza-size"
                    value="S"
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="pizza-s"
                    className="
                      mb-[10px]
                      inline-flex h-20 w-20 cursor-pointer
                      items-center justify-center
                      rounded-[5px] border border-[#999]
                      bg-[#ccc] text-[#999]
                      peer-checked:bg-white
                      peer-checked:text-[#333]
                      peer-focus-visible:outline-2
                      peer-focus-visible:outline-offset-2
                      peer-focus-visible:outline-primary
                    "
                  >
                    Small
                  </label>
                </span>
                <span>
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    type="radio"
                    checked={pizzaSizes === "M"}
                    id="pizza-m"
                    name="pizza-size"
                    value="M"
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="pizza-m"
                    className="
                      mb-[10px]
                      inline-flex h-20 w-20 cursor-pointer
                      items-center justify-center
                      rounded-[5px] border border-[#999]
                      bg-[#ccc] text-[#999]
                      peer-checked:bg-white
                      peer-checked:text-[#333]
                      peer-focus-visible:outline-2
                      peer-focus-visible:outline-offset-2
                      peer-focus-visible:outline-primary
                    "
                  >
                    Medium
                  </label>
                </span>
                <span>
                  <input
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
                    type="radio"
                    checked={pizzaSizes === "L"}
                    id="pizza-l"
                    name="pizza-size"
                    value="L"
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="pizza-l"
                    className="
                      mb-[10px]
                      inline-flex h-20 w-20 cursor-pointer
                      items-center justify-center
                      rounded-[5px] border border-[#999]
                      bg-[#ccc] text-[#999]
                      peer-checked:bg-white
                      peer-checked:text-[#333]
                      peer-focus-visible:outline-2
                      peer-focus-visible:outline-offset-2
                      peer-focus-visible:outline-primary
                    "
                  >
                    Large
                  </label>
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={loading || !selectedPizza || isCheckingOut}
            >
              Add to cart
            </button>
          </div>
          {isError ? (
            <p role="alert">Gagal memuat pizza. Silakan coba lagi.</p>
          ) : loading || !selectedPizza ? (
            <h3>Sedang memuat...</h3>
          ) : (
            <div className="min-w-0 w-full p-[15px] text-center">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
        <div className="min-w-0 h-full">
          {checkoutError && (
            <p role="alert">
              Checkout gagal. Keranjang tetap tersimpan; silakan coba lagi.
            </p>
          )}
          {loading ? (
            <h2>Sedang memuat...</h2>
          ) : (
            <Cart
              cart={cart}
              checkout={() => void checkout()}
              isCheckingOut={isCheckingOut}
            />
          )}
        </div>
      </div>
    </div>
  );
}
