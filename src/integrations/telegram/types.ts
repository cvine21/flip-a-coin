/**
 * Declares Telegram Mini App runtime contracts used by the adapter layer.
 */
export interface TelegramWebApp {
  ready: () => void;
  themeParams?: Record<string, string>;
}

/**
 * Declares Telegram object mounted on browser window.
 */
export interface TelegramRuntime {
  WebApp?: TelegramWebApp;
}

/**
 * Declares window shape that may contain Telegram runtime.
 */
export interface TelegramWindow extends Window {
  Telegram?: TelegramRuntime;
}

/**
 * Stores safe runtime data extracted from window.Telegram.
 */
export interface TelegramRuntimeSnapshot {
  webApp: TelegramWebApp | null;
  hasTelegramWebApp: boolean;
  runtimeError: Error | null;
}
