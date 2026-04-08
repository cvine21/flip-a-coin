import type { CoinFlipResult } from "./flipTypes";

/**
 * Picks a coin flip outcome using a fair 50/50 threshold.
 */
export function pickFlipResult(randomSource: () => number = Math.random): CoinFlipResult {
  return randomSource() < 0.5 ? "HEADS" : "TAILS";
}
