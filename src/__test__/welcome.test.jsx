import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Welcome } from "../components/Welcome";

test("Menampilkan judul aplikasi", () => {
  render(<Welcome />);

  const heading = screen.getByRole("heading", {
    name: "Welcome to Padre Gino's Pizza",
  });

  expect(heading.textContent).toBe("Welcome to Padre Gino's Pizza");
});
