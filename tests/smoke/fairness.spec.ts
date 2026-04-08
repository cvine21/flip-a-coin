import { describe, expect, it } from "vitest";
import { pickFlipResult } from "../../src/features/coin-flip/pickFlipResult";

const EXPECTED_OUTCOMES = new Set(["HEADS", "TAILS"]);

/**
 * Creates deterministic pseudo-random generator for stable smoke checks.
 */
function createRandomSource(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("fairness smoke", () => {
  it("deterministically reaches both outcomes and stays within domain contract", () => {
    const randomSource = createRandomSource(123456);
    const outcomes = new Set<string>();

    for (let index = 0; index < 200; index += 1) {
      outcomes.add(pickFlipResult(randomSource));
    }

    expect(outcomes).toEqual(EXPECTED_OUTCOMES);
  });

  it("does not leak display-side values into domain contract", () => {
    const randomSource = createRandomSource(42);

    for (let index = 0; index < 30; index += 1) {
      const outcome = pickFlipResult(randomSource);
      expect(outcome).not.toBe("Heads");
      expect(outcome).not.toBe("Tails");
      expect(EXPECTED_OUTCOMES.has(outcome)).toBe(true);
    }
  });
});
