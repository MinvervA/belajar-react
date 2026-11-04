import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto my-12 grid w-full max-w-[700px] grid-cols-1 gap-[30px] px-4 lg:my-[120px] lg:grid-cols-2">
      <div className="flex min-w-0 flex-col">
        <h1 className="font-pacifico text-[32px] font-normal text-primary">
          Padre Gino's
        </h1>
        <p className="max-w-[315px] text-[40px] leading-tight font-bold text-secondary uppercase">
          Warung Pizza Terbaik se-jakarta Raya!
        </p>
      </div>
      <ul className="flex flex-col items-center justify-center">
        <li className="w-full max-w-[250px] text-center">
          <Link className="btn mb-[10px] w-full" to="/order">
            Order
          </Link>
        </li>
        <li className="w-full max-w-[250px] text-center">
          <Link className="btn mb-[10px] w-full" to="/past">
            Riwayat Order
          </Link>
        </li>
        <li className="w-full max-w-[250px] text-center">
          <Link className="btn mb-[10px] w-full" to="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}
