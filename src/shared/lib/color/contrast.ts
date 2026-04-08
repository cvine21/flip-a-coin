/**
 * Calculates WCAG contrast ratio for two HEX colors.
 */
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const foregroundLuminance = getRelativeLuminance(foregroundHex);
  const backgroundLuminance = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks whether color pair satisfies the minimum contrast ratio.
 */
export function hasSufficientContrast(
  foregroundHex: string,
  backgroundHex: string,
  minimumRatio = 4.5
): boolean {
  return getContrastRatio(foregroundHex, backgroundHex) >= minimumRatio;
}

/**
 * Converts HEX color to WCAG relative luminance.
 */
function getRelativeLuminance(hexColor: string): number {
  const [red, green, blue] = parseHexColor(hexColor);
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

/**
 * Parses #RGB and #RRGGBB HEX colors into RGB channels.
 */
function parseHexColor(hexColor: string): [number, number, number] {
  const normalized = hexColor.trim().replace(/^#/, "");

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

  throw new Error(`Unsupported HEX color format: ${hexColor}`);
}
