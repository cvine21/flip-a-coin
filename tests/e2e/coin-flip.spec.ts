import { expect, test, type Page } from "@playwright/test";
import { APP_TEST_SELECTORS } from "../../src/shared/testing/selectors";

async function forceFallbackCoinMode(page: Page): Promise<void> {
  await page.route("**/*heads*.svg", (route) => route.abort());
  await page.route("**/*tails*.svg", (route) => route.abort());
}

test("coin tap follows the same flip flow and locks controls during animation", async ({
  page
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Math, "random", {
      configurable: true,
      value: () => 0.9
    });
  });

  await page.goto("/");

  const coin = page.locator(APP_TEST_SELECTORS.coin);
  const flipButton = page.locator(APP_TEST_SELECTORS.flipButton);
  const resultText = page.locator(APP_TEST_SELECTORS.coinResultText);

  await expect(coin).toHaveAttribute("data-visible-side", "Heads");
  await expect(coin).toHaveAttribute("data-render-mode", /fallback|graphic/);
  await expect(coin).toHaveAttribute("data-asset-state", /loading|ready/);
  await expect(coin).toHaveAttribute("style", /--coin-flip-duration-ms:\s*3000ms/);
  await expect(resultText).toHaveAttribute("data-result-side", "Heads");
  await expect(resultText).toHaveText("Heads");

  await coin.click();

  await expect(flipButton).toBeDisabled();
  await expect(coin).toBeDisabled();
  await expect(coin).toHaveAttribute("data-animating", "true");

  await expect(coin).toHaveAttribute("data-visible-side", "Tails", {
    timeout: 4500
  });
  await expect(coin).toHaveAttribute("data-animating", "false", {
    timeout: 4500
  });
  await expect(resultText).toHaveText("Tails", {
    timeout: 4500
  });
  await expect(resultText).toHaveAttribute("data-result-side", "Tails");
  await expect(flipButton).toBeEnabled({
    timeout: 4500
  });
});

test("button and coin triggers share lock semantics and allow restart after settle", async ({
  page
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Math, "random", {
      configurable: true,
      value: () => 0.9
    });
  });

  await page.goto("/");

  const coin = page.locator(APP_TEST_SELECTORS.coin);
  const flipButton = page.locator(APP_TEST_SELECTORS.flipButton);
  const resultText = page.locator(APP_TEST_SELECTORS.coinResultText);

  await expect(coin).toHaveAttribute("data-visible-side", "Heads");

  await flipButton.click();
  await expect(flipButton).toBeDisabled();
  await expect(coin).toBeDisabled();

  await expect(coin).toHaveAttribute("data-visible-side", "Tails", {
    timeout: 4500
  });
  await expect(resultText).toHaveText("Tails", {
    timeout: 4500
  });
  await expect(resultText).toHaveAttribute("data-result-side", "Tails");
  await expect(flipButton).toBeEnabled({
    timeout: 4500
  });

  await page.evaluate(() => {
    Object.defineProperty(Math, "random", {
      configurable: true,
      value: () => 0.1
    });
  });

  await coin.click();
  await expect(flipButton).toBeDisabled();
  await expect(coin).toBeDisabled();

  await expect(coin).toHaveAttribute("data-visible-side", "Heads", {
    timeout: 4500
  });
  await expect(resultText).toHaveText("Heads", {
    timeout: 4500
  });
  await expect(resultText).toHaveAttribute("data-result-side", "Heads");
  await expect(flipButton).toBeEnabled({
    timeout: 4500
  });
});

test("fallback mode keeps lock-state and settles to expected side", async ({ page }) => {
  await forceFallbackCoinMode(page);
  await page.addInitScript(() => {
    Object.defineProperty(Math, "random", {
      configurable: true,
      value: () => 0.9
    });
  });
  await page.goto("/");

  const coin = page.locator(APP_TEST_SELECTORS.coin);
  const flipButton = page.locator(APP_TEST_SELECTORS.flipButton);
  const resultText = page.locator(APP_TEST_SELECTORS.coinResultText);
  const presentation = page.locator(APP_TEST_SELECTORS.coinPresentation);

  await expect(presentation).toHaveAttribute("data-render-mode", "fallback");
  await expect(coin).toHaveAttribute("data-render-mode", "fallback");

  await flipButton.click();
  await expect(flipButton).toBeDisabled();
  await expect(coin).toBeDisabled();

  await expect(coin).toHaveAttribute("data-visible-side", "Tails", {
    timeout: 4500
  });
  await expect(resultText).toHaveAttribute("data-result-side", "Tails", {
    timeout: 4500
  });
  await expect(flipButton).toBeEnabled({
    timeout: 4500
  });
});
