import { useCallback, useEffect, useRef } from "react";
import {
  FLIP_DURATION_MS,
  formatFlipResult,
  useCoinFlip,
  type CoinFlipTriggerSource,
} from "../../features/coin-flip";
import { APP_TEST_IDS } from "../../shared/testing/selectors";
import { Coin } from "../coin-screen/ui/Coin";
import { useCoinAssetState } from "../coin-screen/ui/useCoinAssetState";
import styles from "./CoinScreen.module.css";

/**
 * Renders coin screen connected to the coin flip domain engine.
 */
export function CoinScreen(): JSX.Element {
  const { isLocked, visibleResult, plannedResult, status, startFlip } =
    useCoinFlip();
  const {
    renderMode,
    assetState,
    assetUrls,
    handleAssetLoad,
    handleAssetError,
  } = useCoinAssetState();
  const wasLockedRef = useRef(false);
  const isAnimating = status === "flipping";
  const animationDurationMs = FLIP_DURATION_MS;
  const animationTargetResult = isAnimating
    ? (plannedResult ?? visibleResult)
    : visibleResult;
  const visibleSide = formatFlipResult(visibleResult);
  const animationTargetSide = formatFlipResult(animationTargetResult);
  useEffect(() => {
    wasLockedRef.current = isLocked;
  }, [isLocked]);

  const handleStartFlip = useCallback(
    (triggerSource: CoinFlipTriggerSource) => {
      if (isLocked) {
        return;
      }

      startFlip(triggerSource);
    },
    [isLocked, startFlip],
  );

  return (
    <main className={styles.coinScreen} data-testid={APP_TEST_IDS.coinScreen}>
      <section className={styles.panel}>
        <section
          data-testid={APP_TEST_IDS.coinPresentation}
          data-render-mode={renderMode}
          data-asset-state={assetState}
          className={styles.presentation}
          aria-label="Coin presentation"
        >
          <span data-testid={APP_TEST_IDS.coinAssetState} hidden>
            {assetState}
          </span>
          <Coin
            visibleSide={visibleSide}
            animationTargetSide={animationTargetSide}
            isAnimating={isAnimating}
            isLocked={isLocked}
            animationDurationMs={animationDurationMs}
            renderMode={renderMode}
            assetState={assetState}
            assetUrls={assetUrls}
            onAssetLoad={handleAssetLoad}
            onAssetError={handleAssetError}
            onFlip={() => handleStartFlip("coin")}
          />
          <output
            className={styles.result}
            data-testid={APP_TEST_IDS.coinResultText}
            data-result-side={visibleSide}
            aria-live="polite"
          >
            {visibleSide}
          </output>
        </section>

        <button
          type="button"
          className={styles.flipButton}
          data-testid={APP_TEST_IDS.flipButton}
          disabled={isLocked}
          onClick={() => handleStartFlip("button")}
        >
          Flip a coin
        </button>
      </section>
    </main>
  );
}
