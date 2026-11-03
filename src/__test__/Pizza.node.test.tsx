import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Pizza } from "../Pizza";

afterEach(cleanup);
/*
    NOTES!!
    test() mendefinisikan sebuah skenario pengujian.
    expect() menerima nilai yang ingin diperiksa.
    toBe() membandingkan nilai aktual dengan nilai yang diharapkan.
*/

test("alt text renders on image", () => {
  const name = "My favorite Pizza";
  const src = "https://picsum.photos/200";
  const screen = render(
    <Pizza name={name} description="super cool pizza" image={src} />,
  );

  const img = screen.getByRole("img") as HTMLImageElement;
  expect(img.src).not.toBe("");
});
