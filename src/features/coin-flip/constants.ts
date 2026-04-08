import type { CoinFlipResult } from "./flipTypes";

/**
 * Duration of a single flip animation in milliseconds.
 */
export const FLIP_DURATION_MS = 3000;

/**
 * Side shown before first completed flip.
 */
export const INITIAL_VISIBLE_RESULT: CoinFlipResult = "HEADS";
