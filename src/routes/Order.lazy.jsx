import { useContext, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { CartContext } from "../contexts";

import { Pizza } from "../Pizza";
import { Cart } from "../Cart";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/Order")({
  component: Order,
});

function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [pizzaSizes, setPizzaSize] = useState("M");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  // const fetchPizzaType = async() =>{
  //   try {
  //     const response = await fetch
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  let price, selectedPizza;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(
      selectedPizza.sizes ? selectedPizza.sizes[pizzaSizes] : "",
    );
  }

  async function fetchPizzaTypes() {
    await new Promise((res) => setTimeout(res, 3000));

    const response = await fetch("/api/pizzas");
    const parsedJson = await response.json();
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
    fetchPizzaTypes();
  }, []);

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          setCart([...cart, { pizza: selectedPizza, size: pizzaSizes, price }]);
        }}
      >
        <div className="">
          <div className="">
            <label htmlFor="pizzaType">Pizza Type :</label>
            <select
              name="pizzaType"
              value={pizzaType}
              id=""
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
          <div className="">
            <label htmlFor="pizzaSize">Pizza Size :</label>
            <div className="">
              <span>
                <input
                  onChange={(e) => setPizzaSize(e.target.value)}
                  checked={pizzaSizes === "S"}
                  type="radio"
                  id="pizza-s"
                  name="pizza-size"
                  value="S"
                />
                <label htmlFor="pizza-s">Small</label>
              </span>
              <span>
                <input
                  onChange={(e) => setPizzaSize(e.target.value)}
                  type="radio"
                  checked={pizzaSizes === "M"}
                  id="pizza-m"
                  name="pizza-size"
                  value="M"
                />
                <label htmlFor="pizza-m">Medium</label>
              </span>
              <span>
                <input
                  onChange={(e) => setPizzaSize(e.target.value)}
                  type="radio"
                  checked={pizzaSizes === "L"}
                  id="pizza-l"
                  name="pizza-size"
                  value="L"
                />
                <label htmlFor="pizza-l">Large</label>
              </span>
            </div>
          </div>
          <button type="submit">Add to cart</button>
        </div>
        {loading ? (
          <h3>Sedang memuat...</h3>
        ) : (
          <div className="order-pizza">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
      {loading ? (
        <h2>Sedang memuat...</h2>
      ) : (
        <Cart cart={cart} checkout={checkout} />
      )}
    </div>
  );
}
