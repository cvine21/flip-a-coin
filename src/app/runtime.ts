import { resolveTelegramRuntime } from "../integrations/telegram";
import type { AppLaunchMode, TelegramWebApp, TelegramWindow } from "../integrations/telegram";

let readyMarkedForSession = false;

/**
 * Stores runtime state used by app bootstrap flow.
 */
export interface RuntimeContext {
  mode: AppLaunchMode;
  hasTelegramWebApp: boolean;
  webApp: TelegramWebApp | null;
  runtimeError: Error | null;
  readyCalled: boolean;
}

/**
 * Builds runtime context from Telegram adapter snapshot.
 */
export function getRuntimeContext(targetWindow: TelegramWindow = window): RuntimeContext {
  const runtimeSnapshot = resolveTelegramRuntime(targetWindow);

  return {
    mode: runtimeSnapshot.mode,
    hasTelegramWebApp: runtimeSnapshot.hasTelegramWebApp,
    webApp: runtimeSnapshot.webApp,
    runtimeError: runtimeSnapshot.runtimeError,
    readyCalled: false
  };
}

/**
 * Calls Telegram WebApp.ready once when runtime is available.
 */
export function markReady(runtimeContext: RuntimeContext): RuntimeContext {
  if (runtimeContext.readyCalled || !runtimeContext.webApp) {
    return runtimeContext;
  }

  if (readyMarkedForSession) {
    return {
      ...runtimeContext,
      readyCalled: true
    };
  }

  try {
    runtimeContext.webApp.ready();
    readyMarkedForSession = true;

    return {
      ...runtimeContext,
      readyCalled: true
    };
  } catch {
    return runtimeContext;
  }
}

/**
 * Resets session-level ready marker in tests.
 */
export function resetRuntimeReadyState(): void {
  readyMarkedForSession = false;
}
