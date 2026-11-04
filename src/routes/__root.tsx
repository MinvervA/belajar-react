import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import Header from "../Header";
import PizzaOfTheDay from "../PizzaOfTheDay";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div>
          <Header />
          <Outlet />
          <PizzaOfTheDay />
        </div>
        <TanStackRouterDevtools />
      </>
    );
  },
});
