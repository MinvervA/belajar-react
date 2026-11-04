import { expect, test, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { pizzaApi } from "../api/pizzaApi";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const testPizza = {
  id: "calabrese",
  name: "The Calabrese Pizza",
  category: "Supreme",
  description:
    "Salami, Pancetta, Tomatoes, Red Onions, Friggitello Peppers, Garlic",
  image: "/public/pizzas/calabrese.webp",
  sizes: { S: 12.25, M: 16.25, L: 20.25 },
};

test("gives null initially, then returns the fetched pizza", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const store = makeStore();
  let pizza: ReturnType<typeof usePizzaOfTheDay> = null;
  function TestComponent() {
    pizza = usePizzaOfTheDay();
    return null;
  }
  const view = render(
    <Provider store={store}>
      <TestComponent />
    </Provider>,
  );
  expect(pizza).toBeNull();
  await waitFor(() => expect(pizza).toEqual(testPizza));
  const request = fetchMocker.mock.calls[0][0];
  if (!(request instanceof Request)) throw new Error("Expected a Request");
  expect(new URL(request.url).pathname).toBe("/api/pizza-of-the-day");
  expect(fetchMocker).toHaveBeenCalledTimes(1);
  view.unmount();
  store.dispatch(pizzaApi.util.resetApiState());
});
