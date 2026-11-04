import type { CartItem } from "./APIResponseType";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface Props {
  cart: CartItem[];
  checkout: () => void;
  isCheckingOut?: boolean;
}

export const Cart = ({ cart, checkout, isCheckingOut = false }: Props) => {
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="border-t border-border lg:border-t-0 lg:border-l p-[15px] text-center leading-normal h-full">
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
      <button
        onClick={checkout}
        className="btn"
        disabled={isCheckingOut}
        aria-busy={isCheckingOut || undefined}
      >
        Checkout
      </button>
    </div>
  );
};
