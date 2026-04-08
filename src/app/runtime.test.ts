import { getRuntimeContext, markReady, resetRuntimeReadyState } from "./runtime";

describe("runtime bootstrap contract", () => {
  beforeEach(() => {
    resetRuntimeReadyState();
  });

  it("returns telegram mode when WebApp runtime exists", () => {
    const readySpy = vi.fn();
    const runtimeContext = getRuntimeContext({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);

    expect(runtimeContext.mode).toBe("telegram");
    expect(runtimeContext.hasTelegramWebApp).toBe(true);
    expect(runtimeContext.readyCalled).toBe(false);
  });

  it("returns preview mode when WebApp runtime does not exist", () => {
    const runtimeContext = getRuntimeContext({} as Window);

    expect(runtimeContext.mode).toBe("preview");
    expect(runtimeContext.hasTelegramWebApp).toBe(false);
    expect(runtimeContext.readyCalled).toBe(false);
  });

  it("keeps app in preview mode when theme params getter throws", () => {
    const runtimeContext = getRuntimeContext({
      Telegram: {
        WebApp: {
          ready: vi.fn(),
          get themeParams() {
            throw new Error("theme failure");
          }
        }
      }
    } as Window);

    expect(runtimeContext.mode).toBe("preview");
    expect(runtimeContext.hasTelegramWebApp).toBe(false);
    expect(runtimeContext.runtimeError).toBeInstanceOf(Error);
  });

  it("calls ready only once across repeated markReady calls", () => {
    const readySpy = vi.fn();
    const runtimeContext = getRuntimeContext({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);

    const afterFirstCall = markReady(runtimeContext);
    const afterSecondCall = markReady(afterFirstCall);

    expect(readySpy).toHaveBeenCalledTimes(1);
    expect(afterFirstCall.readyCalled).toBe(true);
    expect(afterSecondCall.readyCalled).toBe(true);
  });

  it("keeps ready call single across separate runtime contexts", () => {
    const readySpy = vi.fn();
    const firstContext = getRuntimeContext({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);
    const secondContext = getRuntimeContext({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);

    const afterFirst = markReady(firstContext);
    const afterSecond = markReady(secondContext);

    expect(afterFirst.readyCalled).toBe(true);
    expect(afterSecond.readyCalled).toBe(true);
    expect(readySpy).toHaveBeenCalledTimes(1);
  });
});
