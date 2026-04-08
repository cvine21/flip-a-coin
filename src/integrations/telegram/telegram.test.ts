import { resolveTelegramRuntime } from "./telegram";

describe("resolveTelegramRuntime", () => {
  it("resolves telegram mode when WebApp runtime exists", () => {
    const readySpy = vi.fn();

    const snapshot = resolveTelegramRuntime({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);

    expect(snapshot.mode).toBe("telegram");
    expect(snapshot.hasTelegramWebApp).toBe(true);
    expect(snapshot.runtimeError).toBeNull();
    expect(snapshot.webApp?.ready).toBe(readySpy);
  });

  it("resolves preview mode when runtime is unavailable", () => {
    const snapshot = resolveTelegramRuntime({} as Window);

    expect(snapshot.mode).toBe("preview");
    expect(snapshot.hasTelegramWebApp).toBe(false);
    expect(snapshot.runtimeError).toBeNull();
    expect(snapshot.webApp).toBeNull();
  });

  it("resolves preview mode when runtime access fails", () => {
    const snapshot = resolveTelegramRuntime({
      get Telegram() {
        throw new Error("runtime denied");
      }
    } as Window);

    expect(snapshot.mode).toBe("preview");
    expect(snapshot.hasTelegramWebApp).toBe(false);
    expect(snapshot.runtimeError).toBeInstanceOf(Error);
    expect(snapshot.runtimeError?.message).toContain("runtime denied");
  });
});
