import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { pizzaApi } from "../api/pizzaApi";
import { Route } from "../routes/contact.lazy";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const ContactRoute = Route.options.component;
  if (!ContactRoute) {
    throw new Error("Contact route has no component");
  }

  const store = makeStore();
  const screen = render(
    <Provider store={store}>
      <ContactRoute />
    </Provider>,
  );

  const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
  const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
  const msgTextArea = screen.getByPlaceholderText(
    "Message",
  ) as HTMLInputElement;

  const testData = {
    name: "Brian",
    email: "test@example.com",
    message: "This is a test message",
  };

  nameInput.value = testData.name;
  emailInput.value = testData.email;
  msgTextArea.value = testData.message;

  const btn = screen.getByRole("button");

  btn.click();

  const h3 = await screen.findByRole("heading", { level: 3 });

  expect(h3.innerText).toContain("Terkirim!");

  const request = fetchMocker.mock.calls[0][0];
  if (!(request instanceof Request)) throw new Error("Expected a Request");
  expect(fetchMocker).toHaveBeenCalledTimes(1);
  expect(new URL(request.url).pathname).toBe("/api/contact");
  expect(request.method).toBe("POST");
  expect(request.headers.get("Content-Type")).toBe("application/json");
  expect(await request.clone().json()).toEqual(testData);
  screen.unmount();
  store.dispatch(pizzaApi.util.resetApiState());
});
