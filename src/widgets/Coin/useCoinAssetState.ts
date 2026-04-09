import { useCallback, useMemo, useState } from "react";
import type { CoinDisplayResult } from "../../features/coin-flip";
import headsAssetUrl from "../../shared/assets/coin/heads.png";
import tailsAssetUrl from "../../shared/assets/coin/tails.png";
import type { CoinAssetState, CoinRenderMode } from "./ui/Coin";

export type CoinAssetUrls = Record<CoinDisplayResult, string>;

interface UseCoinAssetStateResult {
  renderMode: CoinRenderMode;
  assetState: CoinAssetState;
  assetUrls: CoinAssetUrls;
  handleAssetLoad: (side: CoinDisplayResult) => void;
  handleAssetError: (side: CoinDisplayResult) => void;
}

/**
 * Tracks local coin image asset loading state and switches rendering to fallback on any error.
 */
export function useCoinAssetState(): UseCoinAssetStateResult {
  const [loadedSides, setLoadedSides] = useState<
    ReadonlySet<CoinDisplayResult>
  >(new Set());
  const [hasLoadError, setHasLoadError] = useState(false);
  const assetUrls = useMemo<CoinAssetUrls>(
    () => ({
      Heads: headsAssetUrl,
      Tails: tailsAssetUrl,
    }),
    [],
  );

  const handleAssetLoad = useCallback(
    (side: CoinDisplayResult): void => {
      if (hasLoadError) {
        return;
      }

      setLoadedSides((currentLoadedSides) => {
        if (currentLoadedSides.has(side)) {
          return currentLoadedSides;
        }

        const nextLoadedSides = new Set(currentLoadedSides);
        nextLoadedSides.add(side);
        return nextLoadedSides;
      });
    },
    [hasLoadError],
  );

  const handleAssetError = useCallback(
    (side: CoinDisplayResult): void => {
      setHasLoadError((currentHasLoadError) => {
        if (currentHasLoadError) {
          return currentHasLoadError;
        }

        console.error("coin-asset-load", {
          operation: "coin-asset-load",
          side,
          assetUrl: assetUrls[side],
        });

        return true;
      });
    },
    [assetUrls],
  );

  const assetState: CoinAssetState = hasLoadError
    ? "unavailable"
    : loadedSides.size === 2
      ? "ready"
      : "loading";
  const renderMode: CoinRenderMode =
    assetState === "ready" ? "graphic" : "fallback";

  return {
    renderMode,
    assetState,
    assetUrls,
    handleAssetLoad,
    handleAssetError,
  };
}
