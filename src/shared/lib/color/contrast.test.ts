import { getContrastRatio, hasSufficientContrast } from "./contrast";

describe("contrast utilities", () => {
  it("validates contrast for coordinated light and dark theme sets", () => {
    const lightTextRatio = getContrastRatio("#0f172a", "#ffffff");
    const lightButtonTextRatio = getContrastRatio("#ffffff", "#2563eb");
    const darkTextRatio = getContrastRatio("#f5f5f5", "#17212b");
    const darkButtonTextRatio = getContrastRatio("#ffffff", "#5b21b6");

    expect(lightTextRatio).toBeGreaterThanOrEqual(4.5);
    expect(lightButtonTextRatio).toBeGreaterThanOrEqual(4.5);
    expect(darkTextRatio).toBeGreaterThanOrEqual(4.5);
    expect(darkButtonTextRatio).toBeGreaterThanOrEqual(4.5);
  });

  it("returns true for high-contrast pair and false for low-contrast pair", () => {
    expect(hasSufficientContrast("#111827", "#ffffff")).toBe(true);
    expect(hasSufficientContrast("#9ca3af", "#f3f4f6")).toBe(false);
  });
});
