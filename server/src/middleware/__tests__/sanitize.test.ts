import { describe, it, expect } from "vitest";
import { sanitize } from "../sanitize";

describe("sanitize", () => {
  it("strips keys starting with $", () => {
    const input = { title: "ok", $gt: "bad", nested: { $where: "evil" } };
    expect(sanitize(input)).toEqual({ title: "ok", nested: {} });
  });

  it("strips keys containing .", () => {
    const input = { "a.b": "bad", title: "ok" };
    expect(sanitize(input)).toEqual({ title: "ok" });
  });

  it("handles arrays", () => {
    const input = [{ $gt: "bad", title: "ok" }, { clean: true }];
    expect(sanitize(input)).toEqual([{ title: "ok" }, { clean: true }]);
  });

  it("returns primitives unchanged", () => {
    expect(sanitize("hello")).toBe("hello");
    expect(sanitize(42)).toBe(42);
    expect(sanitize(null)).toBe(null);
  });

  it("handles deeply nested objects", () => {
    const input = { a: { b: { $ne: 1, c: { $regex: "x", d: "ok" } } } };
    expect(sanitize(input)).toEqual({ a: { b: { c: { d: "ok" } } } });
  });
});
