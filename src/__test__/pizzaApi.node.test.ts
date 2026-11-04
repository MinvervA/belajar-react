import { afterEach, expect, test, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { makeStore } from "../store";
import { pizzaApi } from "../api/pizzaApi";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
const stores: ReturnType<typeof makeStore>[] = [];
function newStore() {
  const store = makeStore();
  stores.push(store);
  return store;
}
afterEach(() => {
  stores.forEach((store) => store.dispatch(pizzaApi.util.resetApiState()));
  stores.length = 0;
  fetchMocker.resetMocks();
});

test("deduplicates pizza queries and caches past orders by page", async () => {
  fetchMocker.mockResponse(JSON.stringify([]));
  const store = newStore();
  await Promise.all([
    store.dispatch(pizzaApi.endpoints.getPizzas.initiate()),
    store.dispatch(pizzaApi.endpoints.getPizzas.initiate()),
  ]);
  expect(fetchMocker).toHaveBeenCalledTimes(1);
  await store.dispatch(pizzaApi.endpoints.getPastOrders.initiate(1));
  await store.dispatch(pizzaApi.endpoints.getPastOrders.initiate(2));
  await store.dispatch(pizzaApi.endpoints.getPastOrders.initiate(1));
  expect(fetchMocker).toHaveBeenCalledTimes(3);
});

test("successful checkout refreshes subscribed history but failed checkout does not", async () => {
  const oldOrders = [{ order_id: 1, date: "2026-11-04", time: "10:00" }];
  const newOrders = [
    { order_id: 2, date: "2026-11-04", time: "11:00" },
    ...oldOrders,
  ];
  fetchMocker.mockResponseOnce(JSON.stringify(oldOrders));
  const store = newStore();
  await store.dispatch(pizzaApi.endpoints.getPastOrders.initiate(1));
  fetchMocker.mockResponseOnce(JSON.stringify({ error: "Unavailable" }), {
    status: 500,
  });
  const failed = await store.dispatch(
    pizzaApi.endpoints.placeOrder.initiate({ cart: [] }),
  );
  expect(failed.error).toBeDefined();
  expect(fetchMocker).toHaveBeenCalledTimes(2);
  expect(
    pizzaApi.endpoints.getPastOrders.select(1)(store.getState()).data,
  ).toEqual(oldOrders);
  fetchMocker.mockResponseOnce(JSON.stringify({ status: "ok" }));
  fetchMocker.mockResponseOnce(JSON.stringify(newOrders));
  await store.dispatch(pizzaApi.endpoints.placeOrder.initiate({ cart: [] }));
  await waitFor(() =>
    expect(
      pizzaApi.endpoints.getPastOrders.select(1)(store.getState()).data,
    ).toEqual(newOrders),
  );
  expect(fetchMocker).toHaveBeenCalledTimes(4);
});
