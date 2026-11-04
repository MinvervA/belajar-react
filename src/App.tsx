import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { StrictMode } from "react";
import "./index.css";
// const App = () => {
//   return React.createElement("div", {}, [
//     React.createElement("h1", {}, "Hello World!"),
//     React.createElement(Pizza, {
//       name: "Margherita",
//       description: "Classic pizza with tomato sauce and mozzarella cheese",
//     }),
//     React.createElement(Pizza, {
//       name: "Papperoni",
//       description: "Classic pizza with tomato sauce and mozzarella cheese",
//     }),
//     React.createElement(Pizza, {
//       name: "Pizza Hut",
//       description: "Classic pizza with expensive price",
//     }),
//   ]);
// };

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const store = makeStore();
const App = () => {
  return (
    <div>
      <StrictMode>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </StrictMode>
    </div>
  );
};

// strictMode bertujuan memberikan extra warning dalam proses development dan juga melakukan render 2x

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container to render to");
}

const root = createRoot(container);
root.render(<App />);
