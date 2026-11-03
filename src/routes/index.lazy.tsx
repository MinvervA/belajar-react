import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="index">
      <div className="index-brand">
        <h1>Padre Gino's</h1>
        <p>Warung Pizza Terbaik se-jakarta Raya!</p>
      </div>
      <ul>
        <li>
          <Link to="/order">Order</Link>
        </li>
        <li>
          <Link to="/past">Riwayat Order</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
}
