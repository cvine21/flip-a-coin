/**
 * Internal domain result of a coin flip.
 */
export type CoinFlipResult = "HEADS" | "TAILS";

/**
 * Domain state of the coin flip lifecycle.
 */
export type CoinFlipStatus = "idle" | "flipping" | "settled";

/**
 * Source that initiated a flip.
 */
export type CoinFlipTriggerSource = "button" | "coin";

/**
 * Full internal state of the coin flip engine.
 */
export interface CoinFlipState {
  status: CoinFlipStatus;
  plannedResult: CoinFlipResult | null;
  visibleResult: CoinFlipResult;
  startedAtMs: number | null;
  completedAtMs: number | null;
  durationMs: number | null;
  triggerSource: CoinFlipTriggerSource | null;
  isLocked: boolean;
}

/**
 * Minimal state needed by UI.
 */
export interface CoinFlipViewModel {
  isLocked: boolean;
  visibleResult: CoinFlipResult;
  plannedResult: CoinFlipResult | null;
  status: CoinFlipStatus;
  durationMs: number | null;
}
