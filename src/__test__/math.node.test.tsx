import { expect, test } from "vitest";

function add(a: number, b: number) {
  return a + b;
}

test("should add two numbers", () => {
  const result = add(2, 3);

  expect(result).toBe(5);
});
