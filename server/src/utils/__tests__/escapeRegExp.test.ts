import { describe, it, expect } from "vitest";
import { escapeRegExp } from "../escapeRegExp";

describe("escapeRegExp", () => {
  it("escapes all 12 regex metacharacters", () => {
    const input = ".*+?^${}()|[]\\";
    const escaped = escapeRegExp(input);
    // Each metacharacter should be preceded by a backslash
    expect(escaped).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  it("does not escape normal characters", () => {
    expect(escapeRegExp("hello world 123")).toBe("hello world 123");
  });

  it("escapes metacharacters mixed with normal text", () => {
    expect(escapeRegExp("stand.up")).toBe("stand\\.up");
    expect(escapeRegExp("price: $100")).toBe("price: \\$100");
    expect(escapeRegExp("(hello)")).toBe("\\(hello\\)");
  });

  it("handles empty string", () => {
    expect(escapeRegExp("")).toBe("");
  });

  it("escaped output works as a literal match in RegExp", () => {
    const dangerous = ".*+?^${}()|[]\\";
    const regex = new RegExp(escapeRegExp(dangerous));
    expect(regex.test(dangerous)).toBe(true);
    expect(regex.test("anything else")).toBe(false);
  });

  it("prevents ReDoS pattern from being interpreted as regex", () => {
    const redos = ".*.*.*.*.*.*.*.*a";
    const escaped = escapeRegExp(redos);
    // Should be a literal match, not a catastrophic backtracking pattern
    const regex = new RegExp(escaped);
    expect(regex.test(redos)).toBe(true);
    expect(regex.test("a")).toBe(false);
  });

  it("prevents match-all bypass", () => {
    const escaped = escapeRegExp(".*");
    const regex = new RegExp(escaped);
    expect(regex.test("hello")).toBe(false);
    expect(regex.test(".*")).toBe(true);
  });
});
