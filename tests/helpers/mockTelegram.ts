export interface MockTelegramWebApp {
  ready: () => void;
  expand: () => void;
  colorScheme: "light" | "dark";
  themeParams?: Record<string, string>;
}

export interface MockTelegramRuntime {
  WebApp: MockTelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: MockTelegramRuntime;
  }
}

/**
 * Creates a Telegram runtime stub for unit and integration tests.
 */
export function createMockTelegramRuntime(
  overrides: Partial<MockTelegramWebApp> = {}
): MockTelegramRuntime {
  return {
    WebApp: {
      ready: () => undefined,
      expand: () => undefined,
      colorScheme: "light",
      themeParams: {},
      ...overrides
    }
  };
}

/**
 * Installs Telegram runtime stub on the target window.
 */
export function installMockTelegramRuntime(
  targetWindow: Window = window,
  overrides: Partial<MockTelegramWebApp> = {}
): MockTelegramRuntime {
  const runtime = createMockTelegramRuntime(overrides);
  targetWindow.Telegram = runtime;
  return runtime;
}

/**
 * Removes Telegram runtime stub from the target window.
 */
export function clearMockTelegramRuntime(targetWindow: Window = window): void {
  delete targetWindow.Telegram;
}
