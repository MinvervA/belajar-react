import { fireEvent, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { makeStore } from "../store";
import { pizzaApi } from "../api/pizzaApi";
import { Route } from "../routes/past.lazy";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("new page hides previous rows while loading and returning uses cached rows", async () => {
  const store = makeStore();
  const firstPage = Array.from({ length: 10 }, (_, i) => ({
    order_id: i + 1,
    date: "2026-11-04",
    time: "10:00",
  }));
  let resolvePage: (body: string) => void = () => {
    throw new Error("Second page was not requested");
  };
  fetchMocker.mockResponseOnce(JSON.stringify(firstPage));
  fetchMocker.mockResponseOnce(
    () =>
      new Promise<string>((resolve) => {
        resolvePage = resolve;
      }),
  );
  const Past = Route.options.component;
  if (!Past) throw new Error("Missing route");
  const view = render(
    <Provider store={store}>
      <Past />
    </Provider>,
  );
  await view.findByRole("button", { name: "1" });
  fireEvent.click(view.getByRole("button", { name: "Next" }));
  await view.findByRole("heading", { name: "Sedang memuat..." });
  expect(view.queryByRole("button", { name: "1" })).toBeNull();
  await waitFor(() => expect(fetchMocker).toHaveBeenCalledTimes(2));
  resolvePage(
    JSON.stringify([{ order_id: 11, date: "2026-11-03", time: "09:00" }]),
  );
  await view.findByRole("button", { name: "11" });
  fireEvent.click(view.getByRole("button", { name: "Previous" }));
  await view.findByRole("button", { name: "1" });
  expect(fetchMocker).toHaveBeenCalledTimes(2);
  view.unmount();
  store.dispatch(pizzaApi.util.resetApiState());
});
