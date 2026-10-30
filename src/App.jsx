import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
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
const queryClient = new QueryClient();
const App = () => {
  return (
    <div>
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    </div>
  );
};

// strictMode bertujuan memberikan extra warning dalam proses development dan juga melakukan render 2x

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
