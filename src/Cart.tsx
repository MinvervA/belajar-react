import type { CartItem } from "./contexts";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface Props {
  cart: CartItem[];
  checkout: () => void;
}

export const Cart = ({ cart, checkout }: Props) => {
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="border-l border-border p-[15px] text-center leading-normal h-full">
      <h2>Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <span className="size">({item.size})</span>
            <span className="type">{item.pizza.name}</span>
            <span className="price">{item.price}</span>
          </li>
        ))}
      </ul>
      <p className="my-[15px]">Total Price: {intl.format(total)}</p>
      <button onClick={checkout} className="btn">
        Checkout
      </button>
    </div>
  );
};
