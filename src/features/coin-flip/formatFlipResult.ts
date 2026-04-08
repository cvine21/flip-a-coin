import type { CoinFlipResult } from "./flipTypes";

export type CoinDisplayResult = "Heads" | "Tails";

const DISPLAY_RESULT_BY_DOMAIN_RESULT: Record<CoinFlipResult, CoinDisplayResult> = {
  HEADS: "Heads",
  TAILS: "Tails"
};

/**
 * Maps internal domain value to user-facing coin side label.
 */
export function formatFlipResult(result: CoinFlipResult): CoinDisplayResult {
  return DISPLAY_RESULT_BY_DOMAIN_RESULT[result];
}
