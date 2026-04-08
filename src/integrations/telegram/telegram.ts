import { loadTelegramRuntime } from "./loadTelegramRuntime";
import type { TelegramRuntimeSnapshot, TelegramWindow } from "./types";

/**
 * Defines supported application launch modes.
 */
export type AppLaunchMode = "telegram" | "preview";

/**
 * Resolves launch mode and Telegram runtime availability.
 */
export function resolveTelegramRuntime(
  targetWindow: TelegramWindow = window
): TelegramRuntimeSnapshot & { mode: AppLaunchMode } {
  const runtimeSnapshot = loadTelegramRuntime(targetWindow);

  return {
    ...runtimeSnapshot,
    mode: runtimeSnapshot.hasTelegramWebApp ? "telegram" : "preview"
  };
}
