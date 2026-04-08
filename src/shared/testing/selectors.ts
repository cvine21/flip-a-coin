/**
 * Stores shared UI test contracts used by component and E2E tests.
 */
export const APP_TEST_IDS = {
  coinScreen: "coinScreen",
  coin: "coin-screen-coin",
  flipButton: "coin-screen-flip-button",
  coinPresentation: "coin-screen-coin-presentation",
  coinFallbackLayer: "coin-screen-coin-fallback-layer",
  coinGraphicLayer: "coin-screen-coin-graphic-layer",
  coinAssetState: "coin-screen-coin-asset-state",
  coinResultText: "coin-screen-result-text",
} as const;

/**
 * Provides reusable selector strings for browser E2E checks.
 */
export const APP_TEST_SELECTORS = {
  coinScreen: `[data-testid="${APP_TEST_IDS.coinScreen}"]`,
  coin: `[data-testid="${APP_TEST_IDS.coin}"]`,
  flipButton: `[data-testid="${APP_TEST_IDS.flipButton}"]`,
  coinPresentation: `[data-testid="${APP_TEST_IDS.coinPresentation}"]`,
  coinFallbackLayer: `[data-testid="${APP_TEST_IDS.coinFallbackLayer}"]`,
  coinGraphicLayer: `[data-testid="${APP_TEST_IDS.coinGraphicLayer}"]`,
  coinAssetState: `[data-testid="${APP_TEST_IDS.coinAssetState}"]`,
  coinResultText: `[data-testid="${APP_TEST_IDS.coinResultText}"]`,
} as const;
