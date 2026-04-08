import { expect, test, type Page } from "@playwright/test";
import { APP_TEST_SELECTORS } from "../../src/shared/testing/selectors";

async function forceFallbackCoinMode(page: Page): Promise<void> {
  await page.route("**/*heads*.svg", (route) => route.abort());
  await page.route("**/*tails*.svg", (route) => route.abort());
}

test("loads app shell with stable selectors", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(APP_TEST_SELECTORS.coinScreen)).toBeVisible();
  await expect(page.locator(APP_TEST_SELECTORS.coinPresentation)).toBeVisible();
  await expect(page.locator(APP_TEST_SELECTORS.coin)).toBeVisible();
  await expect(page.locator(APP_TEST_SELECTORS.coinAssetState)).toContainText(/loading|ready/);
  await expect(page.locator(APP_TEST_SELECTORS.coinResultText)).toHaveText("Heads");
  await expect(page.locator(APP_TEST_SELECTORS.flipButton)).toHaveText(
    "Flip a coin"
  );
  await expect(page.locator(APP_TEST_SELECTORS.coin)).not.toHaveAttribute("data-asset-state", "unavailable");
  await expect(page.locator(APP_TEST_SELECTORS.coin)).toHaveAttribute("data-render-mode", /fallback|graphic/);
  await expect(
    page.getByRole("button", {
      name: "Flip a coin"
    })
  ).toBeEnabled();
});

test("keeps stable selectors and interactivity in fallback coin mode", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.goto("/");

  await expect(page.locator(APP_TEST_SELECTORS.coinScreen)).toBeVisible();
  await expect(page.locator(APP_TEST_SELECTORS.coinPresentation)).toHaveAttribute(
    "data-render-mode",
    "fallback"
  );
  await expect(page.locator(APP_TEST_SELECTORS.coin)).toHaveAttribute("data-render-mode", "fallback");
  await expect(page.locator(APP_TEST_SELECTORS.coinGraphicLayer)).toBeHidden();
  await expect(page.locator(APP_TEST_SELECTORS.coinFallbackLayer)).toBeVisible();
  await expect(page.locator(APP_TEST_SELECTORS.flipButton)).toBeEnabled();
  await expect(page.locator(APP_TEST_SELECTORS.coin)).toBeEnabled();
});

test("starts in preview mode without Telegram and remains interactive", async ({ page }) => {
  await page.goto("/");

  const coin = page.locator(APP_TEST_SELECTORS.coin);
  const flipButton = page.locator(APP_TEST_SELECTORS.flipButton);
  const presentation = page.locator(APP_TEST_SELECTORS.coinPresentation);

  await expect(page.locator(APP_TEST_SELECTORS.coinScreen)).toBeVisible();
  await expect(presentation).toHaveAttribute("data-render-mode", /fallback|graphic/);
  await expect(presentation).toHaveAttribute("data-asset-state", /loading|ready/);
  await expect(coin).toBeEnabled();
  await expect(flipButton).toBeEnabled();
});

test("calls WebApp.ready once and only after UI is mounted", async ({ page }) => {
  await page.addInitScript((selector: string) => {
    const state = {
      readyCalls: 0,
      hadUiAtReadyCall: false
    };

    (window as Window & { __readyState?: typeof state }).__readyState = state;
    (window as Window & { Telegram?: unknown }).Telegram = {
      WebApp: {
        ready: () => {
          state.readyCalls += 1;
          state.hadUiAtReadyCall = document.querySelector(selector) !== null;
        },
        themeParams: {}
      }
    };
  }, APP_TEST_SELECTORS.coinScreen);

  await page.goto("/");
  await expect(page.locator(APP_TEST_SELECTORS.coinScreen)).toBeVisible();

  const readyState = await page.evaluate(() => {
    return (window as Window & {
      __readyState: { readyCalls: number; hadUiAtReadyCall: boolean };
    }).__readyState;
  });

  expect(readyState.readyCalls).toBe(1);
  expect(readyState.hadUiAtReadyCall).toBe(true);
});
