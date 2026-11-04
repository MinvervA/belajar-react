import { useContext, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CartContext } from "../contexts";

import { Pizza } from "../Pizza";
import { Cart } from "../Cart";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponseType";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: order,
});

function order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [pizzaSizes, setPizzaSize] = useState<PizzaSize>("M");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  // const fetchPizzaType = async() =>{
  //   try {
  //     const response = await fetch
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSizes])
      : undefined;
  }

  async function fetchPizzaTypes() {
    await new Promise((res) => setTimeout(res, 3000));

    const response = await fetch("/api/pizzas");
    const parsedJson = (await response.json()) as PizzaType[];
    setPizzaTypes(parsedJson);
    setLoading(false);
  }

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  useEffect(() => {
    void fetchPizzaTypes();
  }, []);

  return (
    <div className="ml-[5%] w-full mx-auto w-full max-w-[1300px] px-4">
      <h2>Create Order</h2>
      <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-[2fr_1fr]">
        <form
          action=""
          className="flex justify-center"
          onSubmit={(e) => {
            e.preventDefault();

            if (!selectedPizza || !price) {
              return;
            }
            setCart([
              ...cart,
              { pizza: selectedPizza, size: pizzaSizes, price },
            ]);
          }}
        >
          <div className="w-full border-r border-border p-[15px]">
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
                className="form-select mb-[30px] block w-full p-[5px] text-[16x]"
                onChange={(e) => setPizzaType(e.target.value)}
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
              <label className="mb-[10px] block text-[20px] text-secondary">
                Pizza Size :
              </label>
              <div className="my-[10px] text-center">
                <span className="inline-block">
                  <input
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
                      mx-[15px] mb-[10px]
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
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
                      mx-[15px] mb-[10px]
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
                    onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
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
                      mx-[15px] mb-[10px]
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
            <button type="submit" className="btn">
              Add to cart
            </button>
          </div>
          {loading || !selectedPizza ? (
            <h3>Sedang memuat...</h3>
          ) : (
            <div className="ml-[25px] w-full">
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
          {loading ? (
            <h2>Sedang memuat...</h2>
          ) : (
            <Cart cart={cart} checkout={() => void checkout()} />
          )}
        </div>
      </div>
    </div>
  );
}
