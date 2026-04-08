import { act, renderHook } from "@testing-library/react";
import { FLIP_DURATION_MS } from "./constants";
import { useCoinFlip } from "./useCoinFlip";

describe("useCoinFlip", () => {
  let nowMs = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    nowMs = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => nowMs);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts first flip, locks state and ignores repeated starts while flipping", () => {
    const pickResult = vi.fn().mockReturnValue("TAILS");
    const { result } = renderHook(() => useCoinFlip({ pickResult }));

    expect(result.current.status).toBe("idle");
    expect(result.current.visibleResult).toBe("HEADS");
    expect(result.current.isLocked).toBe(false);
    expect(result.current.durationMs).toBeNull();

    act(() => {
      result.current.startFlip("button");
    });

    expect(result.current.status).toBe("flipping");
    expect(result.current.isLocked).toBe(true);
    expect(result.current.visibleResult).toBe("HEADS");
    expect(result.current.plannedResult).toBe("TAILS");
    expect(pickResult).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      result.current.startFlip("coin");
      result.current.startFlip("button");
    });

    expect(result.current.status).toBe("flipping");
    expect(result.current.isLocked).toBe(true);
    expect(result.current.plannedResult).toBe("TAILS");
    expect(pickResult).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("keeps one plannedResult for a single run even if start is retriggered", () => {
    const pickResult = vi
      .fn<() => "HEADS" | "TAILS">()
      .mockReturnValueOnce("HEADS")
      .mockReturnValueOnce("TAILS");
    const { result } = renderHook(() => useCoinFlip({ pickResult }));

    act(() => {
      result.current.startFlip("button");
      result.current.startFlip("coin");
    });

    expect(result.current.status).toBe("flipping");
    expect(result.current.plannedResult).toBe("HEADS");
    expect(pickResult).toHaveBeenCalledTimes(1);

    act(() => {
      nowMs = 4010;
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(result.current.status).toBe("settled");
    expect(result.current.visibleResult).toBe("HEADS");
    expect(result.current.plannedResult).toBe("HEADS");
  });

  it("settles to the planned side after timer and measures real duration with performance.now", () => {
    const pickResult = vi.fn().mockReturnValue("TAILS");
    const { result } = renderHook(() => useCoinFlip({ pickResult }));

    act(() => {
      result.current.startFlip("coin");
    });

    act(() => {
      nowMs = 4075;
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(result.current.status).toBe("settled");
    expect(result.current.isLocked).toBe(false);
    expect(result.current.visibleResult).toBe("TAILS");
    expect(result.current.plannedResult).toBe("TAILS");
    expect(result.current.durationMs).toBeGreaterThanOrEqual(2800);
    expect(result.current.durationMs).toBeLessThanOrEqual(3200);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("allows a new independent flip immediately after previous completion", () => {
    const pickResult = vi
      .fn<() => "HEADS" | "TAILS">()
      .mockReturnValueOnce("TAILS")
      .mockReturnValueOnce("HEADS");
    const { result } = renderHook(() => useCoinFlip({ pickResult }));

    act(() => {
      result.current.startFlip("button");
    });
    act(() => {
      nowMs = 4000;
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(result.current.status).toBe("settled");
    expect(result.current.visibleResult).toBe("TAILS");
    expect(result.current.isLocked).toBe(false);

    act(() => {
      result.current.startFlip("coin");
    });

    expect(result.current.status).toBe("flipping");
    expect(result.current.isLocked).toBe(true);
    expect(pickResult).toHaveBeenCalledTimes(2);

    act(() => {
      nowMs = 7050;
      vi.advanceTimersByTime(FLIP_DURATION_MS);
    });

    expect(result.current.status).toBe("settled");
    expect(result.current.visibleResult).toBe("HEADS");
    expect(result.current.isLocked).toBe(false);
  });
});
