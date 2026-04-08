import type { CSSProperties } from "react";
import type { CoinDisplayResult } from "../../../features/coin-flip";
import { APP_TEST_IDS } from "../../../shared/testing/selectors";
import "./coin.css";
import type { CoinAssetUrls } from "./useCoinAssetState";

export type CoinRenderMode = "graphic" | "fallback";
export type CoinAssetState = "ready" | "loading" | "unavailable";

interface CoinProps {
  visibleSide: CoinDisplayResult;
  animationTargetSide: CoinDisplayResult;
  isAnimating: boolean;
  isLocked: boolean;
  animationDurationMs: number;
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
  animationDurationMs,
  renderMode,
  assetState,
  assetUrls,
  onAssetLoad,
  onAssetError,
  onFlip
}: CoinProps): JSX.Element {
  const isFallbackMode = renderMode === "fallback";

  return (
    <button
      type="button"
      className="coin"
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
          "--coin-flip-duration-ms": `${animationDurationMs}ms`,
          "--coin-spin-final-angle": animationTargetSide === "Heads" ? "1800deg" : "1620deg"
        } as CSSProperties
      }
    >
      <span
        className="coin__layer coin__layer--graphic"
        data-testid={APP_TEST_IDS.coinGraphicLayer}
        aria-hidden="true"
        hidden={isFallbackMode}
      >
        <span
          className={`coin__rotor ${isAnimating ? "coin__rotor--animating" : ""}`}
          aria-hidden="true"
        >
          <span className="coin__face coin__face--heads coin__face--graphic">
            <img
              className="coin__asset-image"
              src={assetUrls.Heads}
              alt="Heads"
              draggable={false}
              onLoad={() => onAssetLoad("Heads")}
              onError={() => onAssetError("Heads")}
            />
          </span>
          <span className="coin__face coin__face--tails coin__face--graphic">
            <img
              className="coin__asset-image"
              src={assetUrls.Tails}
              alt="Tails"
              draggable={false}
              onLoad={() => onAssetLoad("Tails")}
              onError={() => onAssetError("Tails")}
            />
          </span>
        </span>
      </span>
      <span
        className="coin__layer coin__layer--fallback"
        data-testid={APP_TEST_IDS.coinFallbackLayer}
        aria-hidden="true"
        hidden={!isFallbackMode}
      >
        <span
          className={`coin__rotor ${isAnimating ? "coin__rotor--animating" : ""}`}
          aria-hidden="true"
        >
          <span className="coin__face coin__face--heads">Heads</span>
          <span className="coin__face coin__face--tails">Tails</span>
        </span>
      </span>
    </button>
  );
}
