import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { APP_TEST_IDS } from "../shared/testing/selectors";
import { clearMockTelegramRuntime } from "../../tests/helpers/mockTelegram";
import { FALLBACK_THEME } from "../features/theme";
import { resetRuntimeReadyState } from "./runtime";

describe("App", () => {
  const getRootVar = (variableName: string): string =>
    document.documentElement.style.getPropertyValue(variableName).trim();

  afterEach(() => {
    clearMockTelegramRuntime();
    resetRuntimeReadyState();
  });

  it("uses telegram mode and calls ready when WebApp is available", () => {
    const readySpy = vi.fn();
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    });

    render(<App />);

    expect(screen.getAllByTestId(APP_TEST_IDS.coinScreen)).toHaveLength(1);
    expect(screen.getAllByTestId(APP_TEST_IDS.coin)).toHaveLength(1);
    expect(screen.getAllByTestId(APP_TEST_IDS.flipButton)).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Flip a coin" })).toBeEnabled();
    expect(getRootVar("--app-bg-color")).toBe(FALLBACK_THEME.bgColor);
    expect(getRootVar("--app-text-color")).toBe(FALLBACK_THEME.textColor);
    expect(getRootVar("--app-button-color")).toBe(FALLBACK_THEME.buttonColor);
    expect(getRootVar("--app-button-text-color")).toBe(FALLBACK_THEME.buttonTextColor);
    expect(readySpy).toHaveBeenCalledTimes(1);
  });

  it("calls ready once and only after coin screen mount", () => {
    const readySpy = vi.fn(() => {
      expect(document.querySelector(`[data-testid="${APP_TEST_IDS.coinScreen}"]`)).not.toBeNull();
    });
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    });

    const { rerender } = render(<App />);
    rerender(<App />);

    expect(screen.getByTestId(APP_TEST_IDS.coinScreen)).toBeInTheDocument();
    expect(readySpy).toHaveBeenCalledTimes(1);
  });

  it("calls ready even when audio preload reports an error", () => {
    const readySpy = vi.fn();
    const audioLoadSpy = vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => {
      throw new Error("audio-load-failed");
    });

    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    });

    render(<App />);

    expect(screen.getByTestId(APP_TEST_IDS.coinScreen)).toBeInTheDocument();
    expect(readySpy).toHaveBeenCalledTimes(1);
    audioLoadSpy.mockRestore();
  });

  it("applies full light Telegram theme params to CSS variables", () => {
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: vi.fn(),
          themeParams: {
            bg_color: "#ffffff",
            text_color: "#0f172a",
            button_color: "#3b82f6",
            button_text_color: "#f8fafc",
            secondary_bg_color: "#f1f5f9",
            hint_color: "#64748b"
          }
        }
      }
    });

    render(<App />);

    expect(getRootVar("--app-bg-color")).toBe("#ffffff");
    expect(getRootVar("--app-text-color")).toBe("#0f172a");
    expect(getRootVar("--app-button-color")).toBe("#3b82f6");
    expect(getRootVar("--app-button-text-color")).toBe("#f8fafc");
    expect(getRootVar("--app-surface-color")).toBe("#f1f5f9");
    expect(getRootVar("--app-muted-text-color")).toBe("#64748b");
  });

  it("applies full dark Telegram theme params to CSS variables", () => {
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: vi.fn(),
          themeParams: {
            bg_color: "#17212b",
            text_color: "#f5f5f5",
            button_color: "#8774e1",
            button_text_color: "#ffffff",
            secondary_bg_color: "#232e3c",
            hint_color: "#a3adb8"
          }
        }
      }
    });

    render(<App />);

    expect(getRootVar("--app-bg-color")).toBe("#17212b");
    expect(getRootVar("--app-text-color")).toBe("#f5f5f5");
    expect(getRootVar("--app-button-color")).toBe("#8774e1");
    expect(getRootVar("--app-button-text-color")).toBe("#ffffff");
    expect(getRootVar("--app-surface-color")).toBe("#232e3c");
    expect(getRootVar("--app-muted-text-color")).toBe("#a3adb8");
  });

  it("keeps valid Telegram values and fills only missing fields with fallback", () => {
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: {
        WebApp: {
          ready: vi.fn(),
          themeParams: {
            bg_color: "#ededed",
            button_color: "#2a9d8f"
          }
        }
      }
    });

    render(<App />);

    expect(getRootVar("--app-bg-color")).toBe("#ededed");
    expect(getRootVar("--app-button-color")).toBe("#2a9d8f");
    expect(getRootVar("--app-text-color")).toBe(FALLBACK_THEME.textColor);
    expect(getRootVar("--app-button-text-color")).toBe(FALLBACK_THEME.buttonTextColor);
    expect(getRootVar("--app-surface-color")).toBe(FALLBACK_THEME.surfaceColor);
    expect(getRootVar("--app-muted-text-color")).toBe(FALLBACK_THEME.mutedTextColor);
  });

  it("uses preview mode and skips ready when WebApp is missing", () => {
    clearMockTelegramRuntime();

    render(<App />);

    expect(screen.getByTestId(APP_TEST_IDS.coinScreen)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Flip a coin" })).toBeEnabled();
    expect(getRootVar("--app-bg-color")).toBe(FALLBACK_THEME.bgColor);
    expect(getRootVar("--app-text-color")).toBe(FALLBACK_THEME.textColor);
    expect(getRootVar("--app-button-color")).toBe(FALLBACK_THEME.buttonColor);
    expect(getRootVar("--app-button-text-color")).toBe(FALLBACK_THEME.buttonTextColor);
  });

  it("stays stable in preview mode when runtime reading throws", () => {
    Object.defineProperty(window, "Telegram", {
      configurable: true,
      get() {
        throw new Error("runtime unavailable");
      }
    });

    render(<App />);

    expect(screen.getByTestId(APP_TEST_IDS.coinScreen)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Flip a coin" })).toBeEnabled();
    expect(getRootVar("--app-bg-color")).toBe(FALLBACK_THEME.bgColor);
    expect(getRootVar("--app-text-color")).toBe(FALLBACK_THEME.textColor);
  });
});
