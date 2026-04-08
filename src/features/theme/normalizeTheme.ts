import { FALLBACK_THEME } from "./fallbackTheme";
import type { AppTheme, TelegramThemeParams, ThemeResolutionInput } from "./themeTypes";

/**
 * Resolves app theme from Telegram theme params with partial fallback support.
 */
export function normalizeTheme(themeParams?: TelegramThemeParams): AppTheme {
  const bgColor = resolveColor(themeParams?.bg_color, FALLBACK_THEME.bgColor);
  const coinPalette = resolveCoinPalette(bgColor);

  return {
    bgColor,
    textColor: resolveColor(themeParams?.text_color, FALLBACK_THEME.textColor),
    buttonColor: resolveColor(themeParams?.button_color, FALLBACK_THEME.buttonColor),
    buttonTextColor: resolveColor(themeParams?.button_text_color, FALLBACK_THEME.buttonTextColor),
    surfaceColor: resolveColor(themeParams?.secondary_bg_color, FALLBACK_THEME.surfaceColor),
    mutedTextColor: resolveColor(themeParams?.hint_color, FALLBACK_THEME.mutedTextColor),
    ...coinPalette
  };
}

/**
 * Resolves final app theme for current launch mode.
 */
export function resolveAppTheme(input: ThemeResolutionInput): AppTheme {
  if (input.mode !== "telegram" || input.runtimeError) {
    return FALLBACK_THEME;
  }

  return normalizeTheme(input.themeParams);
}

/**
 * Uses fallback when source value is absent or empty.
 */
function resolveColor(source: string | undefined, fallback: string): string {
  if (typeof source !== "string") {
    return fallback;
  }

  const normalizedSource = source.trim();
  return normalizedSource.length > 0 ? normalizedSource : fallback;
}

/**
 * Resolves fallback-coin palette for light and dark theme backgrounds.
 */
function resolveCoinPalette(backgroundColor: string): Pick<
  AppTheme,
  | "coinRimOuterColor"
  | "coinRimMiddleColor"
  | "coinRimInnerColor"
  | "coinFaceTextColor"
  | "coinFaceHighlightColor"
  | "coinFaceShadowColor"
  | "coinFaceStartColor"
  | "coinFaceMidColor"
  | "coinFaceDeepColor"
  | "coinFaceEndColor"
  | "coinFaceBorderColor"
> {
  if (isDarkBackground(backgroundColor)) {
    return {
      coinRimOuterColor: "#8f6a16",
      coinRimMiddleColor: "#b78728",
      coinRimInnerColor: "#d4a73f",
      coinFaceTextColor: "#f8e8bd",
      coinFaceHighlightColor: "rgb(255 255 255 / 18%)",
      coinFaceShadowColor: "rgb(0 0 0 / 35%)",
      coinFaceStartColor: "#d4a73f",
      coinFaceMidColor: "#b78728",
      coinFaceDeepColor: "#a27722",
      coinFaceEndColor: "#8f6a16",
      coinFaceBorderColor: "rgb(248 232 189 / 30%)"
    };
  }

  return {
    coinRimOuterColor: "#cb9b1e",
    coinRimMiddleColor: "#e8bc3b",
    coinRimInnerColor: "#f6d977",
    coinFaceTextColor: "#6f4e00",
    coinFaceHighlightColor: "#fff4c4",
    coinFaceShadowColor: "rgb(156 109 0 / 35%)",
    coinFaceStartColor: "#ffeb99",
    coinFaceMidColor: "#f9d75f",
    coinFaceDeepColor: "#edbf3f",
    coinFaceEndColor: "#d19a20",
    coinFaceBorderColor: "rgb(111 78 0 / 28%)"
  };
}

/**
 * Determines whether the background color belongs to a dark palette.
 */
function isDarkBackground(color: string): boolean {
  const [red, green, blue] = parseHexColor(color);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance < 140;
}

/**
 * Parses #RGB and #RRGGBB colors into RGB channels.
 */
function parseHexColor(color: string): [number, number, number] {
  const normalized = color.trim().replace(/^#/, "");

  if (normalized.length === 3) {
    return [
      Number.parseInt(normalized[0] + normalized[0], 16),
      Number.parseInt(normalized[1] + normalized[1], 16),
      Number.parseInt(normalized[2] + normalized[2], 16)
    ];
  }

  if (normalized.length === 6) {
    return [
      Number.parseInt(normalized.slice(0, 2), 16),
      Number.parseInt(normalized.slice(2, 4), 16),
      Number.parseInt(normalized.slice(4, 6), 16)
    ];
  }

  return parseHexColor(FALLBACK_THEME.bgColor);
}
