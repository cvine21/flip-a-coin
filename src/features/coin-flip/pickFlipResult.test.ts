import { pickFlipResult } from "./pickFlipResult";

describe("pickFlipResult", () => {
  it("maps random values below threshold to HEADS and above threshold to TAILS", () => {
    expect(pickFlipResult(() => 0)).toBe("HEADS");
    expect(pickFlipResult(() => 0.4999)).toBe("HEADS");
    expect(pickFlipResult(() => 0.5)).toBe("TAILS");
    expect(pickFlipResult(() => 0.9999)).toBe("TAILS");
  });

  it("returns only HEADS or TAILS", () => {
    const randomSequence = [0, 0.1, 0.3, 0.5, 0.8, 0.9999];
    const results = randomSequence.map((value) => pickFlipResult(() => value));

    results.forEach((result) => {
      expect(["HEADS", "TAILS"]).toContain(result);
    });
  });

  it("can reach both outcomes across deterministic samples", () => {
    const randomSequence = [0.2, 0.7, 0.4, 0.9];
    const outcomes = new Set(randomSequence.map((value) => pickFlipResult(() => value)));

    expect(outcomes).toEqual(new Set(["HEADS", "TAILS"]));
  });
});
