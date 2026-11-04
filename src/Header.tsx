import { useContext } from "react";
import { CartContext } from "./contexts";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [cart] = useContext(CartContext);
  return (
    <nav className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border px-4 sm:grid-cols-[1fr_3fr_1fr]">
      <Link
        to="/"
        className="flex min-w-0 items-center justify-center sm:col-start-2"
      >
        <h1 className="w-full">
          <img
            src="/public/padre_gino.svg"
            alt="Padre Gino's Pizza"
            className="h-[110px] w-full border-b border-border py-5 object-contain"
          />
        </h1>
      </Link>
      <div className="flex items-center justify-center text-[40px]">
        🛒{" "}
        <span className="relative -top-[17px] -left-[17px] flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-0.5 text-[18px] text-white">
          {cart.length}
        </span>
      </div>
    </nav>
  );
}
