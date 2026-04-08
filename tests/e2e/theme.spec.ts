import { expect, test, type Page } from "@playwright/test";
import { APP_TEST_SELECTORS } from "../../src/shared/testing/selectors";

async function forceFallbackCoinMode(page: Page): Promise<void> {
  await page.route("**/*heads*.svg", (route) => route.abort());
  await page.route("**/*tails*.svg", (route) => route.abort());
}

async function getFallbackCoinStyles(page: Page): Promise<{ boxShadow: string; faceColor: string }> {
  await expect(page.locator(APP_TEST_SELECTORS.coin)).toHaveAttribute("data-render-mode", "fallback");

  return page.evaluate(() => {
    const fallbackLayer = document.querySelector(
      '[data-testid="coin-screen-coin-fallback-layer"]'
    ) as HTMLElement | null;
    const headsFace = fallbackLayer?.querySelector(".coin__face--heads") as HTMLElement | null;

    if (!fallbackLayer || !headsFace) {
      throw new Error("Fallback coin layer is not available");
    }

    const layerStyle = window.getComputedStyle(fallbackLayer);
    const faceStyle = window.getComputedStyle(headsFace);

    return {
      boxShadow: layerStyle.boxShadow,
      faceColor: faceStyle.color
    };
  });
}

test("uses neutral fallback theme in preview mode", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.goto("/");

  await expect(page.locator(APP_TEST_SELECTORS.coinScreen)).toBeVisible();

  const vars = await page.evaluate(() => {
    const style = document.documentElement.style;
    return {
      bg: style.getPropertyValue("--app-bg-color").trim(),
      text: style.getPropertyValue("--app-text-color").trim(),
      button: style.getPropertyValue("--app-button-color").trim(),
      buttonText: style.getPropertyValue("--app-button-text-color").trim()
    };
  });

  expect(vars).toEqual({
    bg: "#f3f4f6",
    text: "#111827",
    button: "#2563eb",
    buttonText: "#ffffff"
  });
});

test("applies dark telegram theme variables without replacement", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.addInitScript(() => {
    (window as Window & { Telegram?: unknown }).Telegram = {
      WebApp: {
        ready: () => undefined,
        themeParams: {
          bg_color: "#17212b",
          text_color: "#f5f5f5",
          button_color: "#8774e1",
          button_text_color: "#ffffff"
        }
      }
    };
  });

  await page.goto("/");

  const vars = await page.evaluate(() => {
    const style = document.documentElement.style;
    return {
      bg: style.getPropertyValue("--app-bg-color").trim(),
      text: style.getPropertyValue("--app-text-color").trim(),
      button: style.getPropertyValue("--app-button-color").trim(),
      buttonText: style.getPropertyValue("--app-button-text-color").trim()
    };
  });

  expect(vars).toEqual({
    bg: "#17212b",
    text: "#f5f5f5",
    button: "#8774e1",
    buttonText: "#ffffff"
  });

  const fallbackCoin = await getFallbackCoinStyles(page);
  expect(fallbackCoin.faceColor).toBe("rgb(248, 232, 189)");
  expect(fallbackCoin.boxShadow).toContain("rgb(143, 106, 22)");
  expect(fallbackCoin.boxShadow).toContain("rgb(183, 135, 40)");
  expect(fallbackCoin.boxShadow).toContain("rgb(212, 167, 63)");
});

test("applies light telegram theme variables without replacement", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.addInitScript(() => {
    (window as Window & { Telegram?: unknown }).Telegram = {
      WebApp: {
        ready: () => undefined,
        themeParams: {
          bg_color: "#ffffff",
          text_color: "#0f172a",
          button_color: "#3b82f6",
          button_text_color: "#f8fafc"
        }
      }
    };
  });

  await page.goto("/");

  const vars = await page.evaluate(() => {
    const style = document.documentElement.style;
    return {
      bg: style.getPropertyValue("--app-bg-color").trim(),
      text: style.getPropertyValue("--app-text-color").trim(),
      button: style.getPropertyValue("--app-button-color").trim(),
      buttonText: style.getPropertyValue("--app-button-text-color").trim()
    };
  });

  expect(vars).toEqual({
    bg: "#ffffff",
    text: "#0f172a",
    button: "#3b82f6",
    buttonText: "#f8fafc"
  });

  const fallbackCoin = await getFallbackCoinStyles(page);
  expect(fallbackCoin.faceColor).toBe("rgb(111, 78, 0)");
  expect(fallbackCoin.boxShadow).toContain("rgb(203, 155, 30)");
  expect(fallbackCoin.boxShadow).toContain("rgb(232, 188, 59)");
  expect(fallbackCoin.boxShadow).toContain("rgb(246, 217, 119)");
});

test("fills only missing telegram theme values with fallback", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.addInitScript(() => {
    (window as Window & { Telegram?: unknown }).Telegram = {
      WebApp: {
        ready: () => undefined,
        themeParams: {
          bg_color: "#ededed",
          button_color: "#2a9d8f"
        }
      }
    };
  });

  await page.goto("/");

  const vars = await page.evaluate(() => {
    const style = document.documentElement.style;
    return {
      bg: style.getPropertyValue("--app-bg-color").trim(),
      text: style.getPropertyValue("--app-text-color").trim(),
      button: style.getPropertyValue("--app-button-color").trim(),
      buttonText: style.getPropertyValue("--app-button-text-color").trim()
    };
  });

  expect(vars).toEqual({
    bg: "#ededed",
    text: "#111827",
    button: "#2a9d8f",
    buttonText: "#ffffff"
  });

  const fallbackCoin = await getFallbackCoinStyles(page);
  expect(fallbackCoin.faceColor).toBe("rgb(111, 78, 0)");
  expect(fallbackCoin.boxShadow).toContain("rgb(203, 155, 30)");
  expect(fallbackCoin.boxShadow).toContain("rgb(232, 188, 59)");
  expect(fallbackCoin.boxShadow).toContain("rgb(246, 217, 119)");
});
