import { act, fireEvent, render, screen } from "@testing-library/react";
import { FLIP_DURATION_MS } from "../../features/coin-flip";
import { APP_TEST_IDS } from "../../shared/testing/selectors";
import { CoinScreen } from "./CoinScreen";

describe("CoinScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );
    vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders a stable coin shell with fallback mode until assets are ready", () => {
    render(<CoinScreen />);

    const screenNode = screen.getByTestId(APP_TEST_IDS.coinScreen);
    const presentationNode = screen.getByTestId(APP_TEST_IDS.coinPresentation);
    const coinNode = screen.getByTestId(APP_TEST_IDS.coin);
    const fallbackLayerNode = screen.getByTestId(
      APP_TEST_IDS.coinFallbackLayer,
    );
    const graphicLayerNode = screen.getByTestId(APP_TEST_IDS.coinGraphicLayer);
    const assetStateNode = screen.getByTestId(APP_TEST_IDS.coinAssetState);
    const resultTextNode = screen.getByTestId(APP_TEST_IDS.coinResultText);
    const buttonNode = screen.getByTestId(APP_TEST_IDS.flipButton);

    expect(screenNode).toBeInTheDocument();
    expect(screenNode).toHaveAttribute("data-testid", APP_TEST_IDS.coinScreen);
    expect(coinNode).toHaveAttribute("data-visible-side", "Heads");
    expect(coinNode).toHaveAttribute("data-animating", "false");
    expect(coinNode).toHaveAttribute("data-render-mode", "fallback");
    expect(coinNode).toHaveAttribute("data-asset-state", "loading");
    expect(coinNode).toHaveAttribute("data-animation-target-side", "Heads");
    expect(coinNode.getAttribute("style")).toContain(
      `--coin-flip-duration-ms: ${FLIP_DURATION_MS}ms`,
    );
    expect(presentationNode).toHaveAttribute("data-render-mode", "fallback");
    expect(presentationNode).toHaveAttribute("data-asset-state", "loading");
    expect(fallbackLayerNode).not.toHaveAttribute("hidden");
    expect(graphicLayerNode).toHaveAttribute("hidden");
    expect(assetStateNode).toHaveTextContent("loading");
    expect(resultTextNode).toHaveAttribute("data-result-side", "Heads");
    expect(resultTextNode).toHaveTextContent("Heads");
    expect(resultTextNode).not.toHaveTextContent("HEADS");
    expect(buttonNode).toHaveTextContent("Flip a coin");
  });

  it("starts the same flip flow from button and coin taps and blocks concurrent starts", () => {
    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    render(<CoinScreen />);

    const coinNode = screen.getByTestId(APP_TEST_IDS.coin);
    const buttonNode = screen.getByTestId(APP_TEST_IDS.flipButton);
    const resultTextNode = screen.getByTestId(APP_TEST_IDS.coinResultText);

    fireEvent.click(buttonNode);

    expect(buttonNode).toBeDisabled();
    expect(coinNode).toBeDisabled();
    expect(coinNode).toHaveAttribute("data-animating", "true");

    fireEvent.click(coinNode);
    expect(randomSpy).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(buttonNode).toBeEnabled();
    expect(coinNode).toBeEnabled();
    expect(coinNode).toHaveAttribute("data-visible-side", "Tails");
    expect(coinNode).toHaveAttribute("data-animating", "false");
    expect(resultTextNode).toHaveAttribute("data-result-side", "Tails");
    expect(resultTextNode).toHaveTextContent("Tails");
    expect(resultTextNode).not.toHaveTextContent("TAILS");
  });

  it("accepts coin tap as a flip trigger and settles to the planned side", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);

    render(<CoinScreen />);

    const coinNode = screen.getByTestId(APP_TEST_IDS.coin);
    const buttonNode = screen.getByTestId(APP_TEST_IDS.flipButton);
    const resultTextNode = screen.getByTestId(APP_TEST_IDS.coinResultText);

    fireEvent.click(coinNode);
    expect(buttonNode).toBeDisabled();
    expect(coinNode.getAttribute("style")).toContain(
      "--coin-spin-final-angle: 1800deg",
    );

    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(coinNode).toHaveAttribute("data-visible-side", "Heads");
    expect(buttonNode).toBeEnabled();
    expect(resultTextNode).toHaveAttribute("data-result-side", "Heads");
  });

  it("switches to fallback render mode and logs coin-asset-load on image error", () => {
    const coinAssetLoadErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(<CoinScreen />);

    const coinNode = screen.getByTestId(APP_TEST_IDS.coin);
    const presentationNode = screen.getByTestId(APP_TEST_IDS.coinPresentation);
    const fallbackLayerNode = screen.getByTestId(
      APP_TEST_IDS.coinFallbackLayer,
    );
    const graphicLayerNode = screen.getByTestId(APP_TEST_IDS.coinGraphicLayer);
    const assetStateNode = screen.getByTestId(APP_TEST_IDS.coinAssetState);
    const headsImage = graphicLayerNode.querySelector('img[alt="Heads"]');

    expect(headsImage).not.toBeNull();

    fireEvent.error(headsImage as HTMLImageElement);

    expect(coinNode).toHaveAttribute("data-render-mode", "fallback");
    expect(coinNode).toHaveAttribute("data-asset-state", "unavailable");
    expect(presentationNode).toHaveAttribute("data-render-mode", "fallback");
    expect(presentationNode).toHaveAttribute("data-asset-state", "unavailable");
    expect(fallbackLayerNode).not.toHaveAttribute("hidden");
    expect(graphicLayerNode).toHaveAttribute("hidden");
    expect(assetStateNode).toHaveTextContent("unavailable");
    expect(coinAssetLoadErrorSpy).toHaveBeenCalledWith(
      "coin-asset-load",
      expect.objectContaining({
        operation: "coin-asset-load",
        side: "Heads",
      }),
    );
  });

  it("allows a new flip after previous animation is completed", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);

    render(<CoinScreen />);

    const coinNode = screen.getByTestId(APP_TEST_IDS.coin);
    const buttonNode = screen.getByTestId(APP_TEST_IDS.flipButton);

    fireEvent.click(buttonNode);
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });
    expect(coinNode).toHaveAttribute("data-visible-side", "Tails");
    expect(buttonNode).toBeEnabled();
    expect(coinNode).toBeEnabled();

    fireEvent.click(coinNode);
    expect(buttonNode).toBeDisabled();
    expect(coinNode).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(coinNode).toHaveAttribute("data-visible-side", "Heads");
    expect(buttonNode).toBeEnabled();
    expect(coinNode).toBeEnabled();
  });
});
