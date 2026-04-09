import type { CSSProperties } from "react";
import type { CoinDisplayResult } from "../../../features/coin-flip";
import { APP_TEST_IDS } from "../../../shared/testing/selectors";
import type { CoinAssetUrls } from "../useCoinAssetState";
import styles from "./Coin.module.css";

export type CoinRenderMode = "graphic" | "fallback";
export type CoinAssetState = "ready" | "loading" | "unavailable";

interface CoinProps {
  visibleSide: CoinDisplayResult;
  animationTargetSide: CoinDisplayResult;
  isAnimating: boolean;
  isLocked: boolean;
  renderMode: CoinRenderMode;
  assetState: CoinAssetState;
  assetUrls: CoinAssetUrls;
  onAssetLoad: (side: CoinDisplayResult) => void;
  onAssetError: (side: CoinDisplayResult) => void;
  onFlip: () => void;
}

/**
 * Renders an interactive coin with image assets and CSS fallback mode.
 */
export function Coin({
  visibleSide,
  animationTargetSide,
  isAnimating,
  isLocked,
  renderMode,
  assetState,
  assetUrls,
  onAssetLoad,
  onAssetError,
  onFlip,
}: CoinProps): JSX.Element {
  const isFallbackMode = renderMode === "fallback";

  return (
    <button
      type="button"
      className={styles.coin}
      data-testid={APP_TEST_IDS.coin}
      data-visible-side={visibleSide}
      data-animating={isAnimating ? "true" : "false"}
      data-render-mode={renderMode}
      data-asset-state={assetState}
      data-animation-target-side={animationTargetSide}
      disabled={isLocked}
      onClick={onFlip}
      aria-label={`Coin showing ${visibleSide}`}
      style={
        {
          "--coin-spin-final-angle":
            animationTargetSide === "Heads" ? "1800deg" : "1620deg",
        } as CSSProperties
      }
    >
      <span
        className={`${styles.coinLayer} ${styles.coinLayerGraphic}`}
        data-testid={APP_TEST_IDS.coinGraphicLayer}
        aria-hidden="true"
        hidden={isFallbackMode}
      >
        <span
          className={`${styles.coinRotor} ${isAnimating ? styles.coinRotorAnimating : ""}`}
          aria-hidden="true"
        >
          <span
            className={`${styles.coinFace} ${styles.coinFaceHeads} ${styles.coinFaceGraphic}`}
          >
            <img
              className={styles.coinAssetImage}
              src={assetUrls.Heads}
              alt="Heads"
              draggable={false}
              onLoad={() => onAssetLoad("Heads")}
              onError={() => onAssetError("Heads")}
            />
          </span>
          <span
            className={`${styles.coinFace} ${styles.coinFaceTails} ${styles.coinFaceGraphic}`}
          >
            <img
              className={styles.coinAssetImage}
              src={assetUrls.Tails}
              alt="Tails"
              draggable={false}
              onLoad={() => onAssetLoad("Tails")}
              onError={() => onAssetError("Tails")}
            />
          </span>
        </span>
      </span>
    </button>
  );
}
