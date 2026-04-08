import type { AppTheme } from "./themeTypes";

/**
 * Applies theme values to CSS custom properties on the given element.
 */
export function applyThemeVars(
  theme: AppTheme,
  targetElement: HTMLElement = document.documentElement
): void {
  targetElement.style.setProperty("--app-bg-color", theme.bgColor);
  targetElement.style.setProperty("--app-text-color", theme.textColor);
  targetElement.style.setProperty("--app-button-color", theme.buttonColor);
  targetElement.style.setProperty("--app-button-text-color", theme.buttonTextColor);
  targetElement.style.setProperty("--app-surface-color", theme.surfaceColor);
  targetElement.style.setProperty("--app-muted-text-color", theme.mutedTextColor);
  targetElement.style.setProperty("--app-coin-rim-outer-color", theme.coinRimOuterColor);
  targetElement.style.setProperty("--app-coin-rim-middle-color", theme.coinRimMiddleColor);
  targetElement.style.setProperty("--app-coin-rim-inner-color", theme.coinRimInnerColor);
  targetElement.style.setProperty("--app-coin-face-text-color", theme.coinFaceTextColor);
  targetElement.style.setProperty("--app-coin-face-highlight-color", theme.coinFaceHighlightColor);
  targetElement.style.setProperty("--app-coin-face-shadow-color", theme.coinFaceShadowColor);
  targetElement.style.setProperty("--app-coin-face-start-color", theme.coinFaceStartColor);
  targetElement.style.setProperty("--app-coin-face-mid-color", theme.coinFaceMidColor);
  targetElement.style.setProperty("--app-coin-face-deep-color", theme.coinFaceDeepColor);
  targetElement.style.setProperty("--app-coin-face-end-color", theme.coinFaceEndColor);
  targetElement.style.setProperty("--app-coin-face-border-color", theme.coinFaceBorderColor);
}
