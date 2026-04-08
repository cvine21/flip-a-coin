import { FALLBACK_THEME, applyThemeVars, normalizeTheme, resolveAppTheme } from ".";

describe("theme normalization", () => {
  it("keeps full light theme params without replacement", () => {
    const theme = normalizeTheme({
      bg_color: "#ffffff",
      text_color: "#0f172a",
      button_color: "#3b82f6",
      button_text_color: "#ffffff",
      secondary_bg_color: "#f1f5f9",
      hint_color: "#64748b"
    });

    expect(theme).toEqual({
      bgColor: "#ffffff",
      textColor: "#0f172a",
      buttonColor: "#3b82f6",
      buttonTextColor: "#ffffff",
      surfaceColor: "#f1f5f9",
      mutedTextColor: "#64748b",
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
    });
  });

  it("keeps full dark theme params without replacement", () => {
    const theme = normalizeTheme({
      bg_color: "#17212b",
      text_color: "#f5f5f5",
      button_color: "#8774e1",
      button_text_color: "#ffffff",
      secondary_bg_color: "#232e3c",
      hint_color: "#a3adb8"
    });

    expect(theme).toEqual({
      bgColor: "#17212b",
      textColor: "#f5f5f5",
      buttonColor: "#8774e1",
      buttonTextColor: "#ffffff",
      surfaceColor: "#232e3c",
      mutedTextColor: "#a3adb8",
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
    });
  });

  it("fills only missing values with fallback in telegram mode", () => {
    const theme = normalizeTheme({
      bg_color: "#ededed",
      button_color: "#2a9d8f"
    });

    expect(theme).toEqual({
      bgColor: "#ededed",
      textColor: FALLBACK_THEME.textColor,
      buttonColor: "#2a9d8f",
      buttonTextColor: FALLBACK_THEME.buttonTextColor,
      surfaceColor: FALLBACK_THEME.surfaceColor,
      mutedTextColor: FALLBACK_THEME.mutedTextColor,
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
    });
  });

  it("uses full neutral fallback in preview and runtime error mode", () => {
    const previewTheme = resolveAppTheme({
      mode: "preview",
      runtimeError: null
    });
    const errorTheme = resolveAppTheme({
      mode: "telegram",
      runtimeError: new Error("runtime failed"),
      themeParams: {
        bg_color: "#000000",
        text_color: "#ffffff",
        button_color: "#111111",
        button_text_color: "#f0f0f0"
      }
    });

    expect(previewTheme).toEqual(FALLBACK_THEME);
    expect(errorTheme).toEqual(FALLBACK_THEME);
  });
});

describe("applyThemeVars", () => {
  it("writes resolved values to css custom properties", () => {
    const root = document.documentElement;
    const theme = normalizeTheme({
      bg_color: "#ffffff",
      text_color: "#0f172a",
      button_color: "#3b82f6",
      button_text_color: "#f8fafc",
      secondary_bg_color: "#f1f5f9",
      hint_color: "#64748b"
    });

    applyThemeVars(theme, root);

    expect(root.style.getPropertyValue("--app-bg-color").trim()).toBe("#ffffff");
    expect(root.style.getPropertyValue("--app-text-color").trim()).toBe("#0f172a");
    expect(root.style.getPropertyValue("--app-button-color").trim()).toBe("#3b82f6");
    expect(root.style.getPropertyValue("--app-button-text-color").trim()).toBe("#f8fafc");
    expect(root.style.getPropertyValue("--app-surface-color").trim()).toBe("#f1f5f9");
    expect(root.style.getPropertyValue("--app-muted-text-color").trim()).toBe("#64748b");
    expect(root.style.getPropertyValue("--app-coin-rim-outer-color").trim()).toBe("#cb9b1e");
    expect(root.style.getPropertyValue("--app-coin-rim-middle-color").trim()).toBe("#e8bc3b");
    expect(root.style.getPropertyValue("--app-coin-rim-inner-color").trim()).toBe("#f6d977");
    expect(root.style.getPropertyValue("--app-coin-face-text-color").trim()).toBe("#6f4e00");
    expect(root.style.getPropertyValue("--app-coin-face-highlight-color").trim()).toBe("#fff4c4");
    expect(root.style.getPropertyValue("--app-coin-face-shadow-color").trim()).toBe(
      "rgb(156 109 0 / 35%)"
    );
    expect(root.style.getPropertyValue("--app-coin-face-start-color").trim()).toBe("#ffeb99");
    expect(root.style.getPropertyValue("--app-coin-face-mid-color").trim()).toBe("#f9d75f");
    expect(root.style.getPropertyValue("--app-coin-face-deep-color").trim()).toBe("#edbf3f");
    expect(root.style.getPropertyValue("--app-coin-face-end-color").trim()).toBe("#d19a20");
    expect(root.style.getPropertyValue("--app-coin-face-border-color").trim()).toBe(
      "rgb(111 78 0 / 28%)"
    );
  });
});
