import { expect, test } from "vitest";

function add(a, b) {
  return a + b;
}

test("should add two numbers", () => {
  const result = add(2, 3);

  expect(result).toBe(5);
});
