import type { AppLaunchMode } from "../../integrations/telegram";

/**
 * Theme parameter keys expected from Telegram Mini Apps runtime.
 */
export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  hint_color?: string;
}

/**
 * Fully resolved application theme used for CSS custom properties.
 */
export interface AppTheme {
  bgColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  surfaceColor: string;
  mutedTextColor: string;
  coinRimOuterColor: string;
  coinRimMiddleColor: string;
  coinRimInnerColor: string;
  coinFaceTextColor: string;
  coinFaceHighlightColor: string;
  coinFaceShadowColor: string;
  coinFaceStartColor: string;
  coinFaceMidColor: string;
  coinFaceDeepColor: string;
  coinFaceEndColor: string;
  coinFaceBorderColor: string;
}

/**
 * Runtime data needed to resolve final theme.
 */
export interface ThemeResolutionInput {
  mode: AppLaunchMode;
  runtimeError: Error | null;
  themeParams?: TelegramThemeParams;
}
