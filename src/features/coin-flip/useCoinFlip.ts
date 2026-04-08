import { useCallback, useEffect, useRef, useState } from "react";
import { FLIP_DURATION_MS, INITIAL_VISIBLE_RESULT } from "./constants";
import { pickFlipResult } from "./pickFlipResult";
import type {
  CoinFlipResult,
  CoinFlipState,
  CoinFlipTriggerSource,
  CoinFlipViewModel
} from "./flipTypes";

interface UseCoinFlipOptions {
  pickResult?: () => CoinFlipResult;
}

const createInitialState = (): CoinFlipState => ({
  status: "idle",
  plannedResult: null,
  visibleResult: INITIAL_VISIBLE_RESULT,
  startedAtMs: null,
  completedAtMs: null,
  durationMs: null,
  triggerSource: null,
  isLocked: false
});

/**
 * Provides state engine for coin flipping independent from visual animation.
 */
export function useCoinFlip(options?: UseCoinFlipOptions): CoinFlipViewModel & {
  startFlip: (triggerSource: CoinFlipTriggerSource) => void;
} {
  const [state, setState] = useState<CoinFlipState>(createInitialState);
  const stateRef = useRef<CoinFlipState>(state);
  const timeoutRef = useRef<number | null>(null);
  const pickResult = options?.pickResult ?? pickFlipResult;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startFlip = useCallback(
    (triggerSource: CoinFlipTriggerSource): void => {
      if (stateRef.current.isLocked) {
        return;
      }

      const plannedResult = pickResult();
      const startedAtMs = performance.now();
      const nextState: CoinFlipState = {
        status: "flipping",
        plannedResult,
        visibleResult: stateRef.current.visibleResult,
        startedAtMs,
        completedAtMs: null,
        durationMs: null,
        triggerSource,
        isLocked: true
      };

      stateRef.current = nextState;
      setState(nextState);

      timeoutRef.current = window.setTimeout(() => {
        const completedAtMs = performance.now();
        const latestState = stateRef.current;
        const resolvedResult = latestState.plannedResult ?? latestState.visibleResult;
        const resolvedDuration =
          latestState.startedAtMs !== null ? completedAtMs - latestState.startedAtMs : null;
        const settledState: CoinFlipState = {
          status: "settled",
          plannedResult: resolvedResult,
          visibleResult: resolvedResult,
          startedAtMs: latestState.startedAtMs,
          completedAtMs,
          durationMs: resolvedDuration,
          triggerSource: latestState.triggerSource,
          isLocked: false
        };

        stateRef.current = settledState;
        setState(settledState);
        timeoutRef.current = null;
      }, FLIP_DURATION_MS);
    },
    [pickResult]
  );

  return {
    isLocked: state.isLocked,
    visibleResult: state.visibleResult,
    plannedResult: state.plannedResult,
    status: state.status,
    durationMs: state.durationMs,
    startFlip
  };
}
