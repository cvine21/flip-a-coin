import type { TelegramRuntimeSnapshot, TelegramWebApp, TelegramWindow } from "./types";

/**
 * Reads Telegram WebApp runtime from window in a safe way.
 */
export function loadTelegramRuntime(
  targetWindow: TelegramWindow = window
): TelegramRuntimeSnapshot {
  try {
    const webApp = targetWindow.Telegram?.WebApp ?? null;

    if (!webApp) {
      return {
        webApp: null,
        hasTelegramWebApp: false,
        runtimeError: null
      };
    }

    readThemeParamsSafely(webApp);

    return {
      webApp,
      hasTelegramWebApp: true,
      runtimeError: null
    };
  } catch (error) {
    return {
      webApp: null,
      hasTelegramWebApp: false,
      runtimeError: toError(error)
    };
  }
}

/**
 * Accesses theme params to ensure runtime getters do not throw during bootstrap.
 */
function readThemeParamsSafely(webApp: TelegramWebApp): void {
  void webApp.themeParams;
}

/**
 * Converts unknown thrown values into Error instance.
 */
function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}
