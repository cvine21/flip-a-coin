import { loadTelegramRuntime } from "./loadTelegramRuntime";

describe("loadTelegramRuntime", () => {
  it("returns runtime snapshot with WebApp data", () => {
    const readySpy = vi.fn();
    const snapshot = loadTelegramRuntime({
      Telegram: {
        WebApp: {
          ready: readySpy,
          themeParams: {}
        }
      }
    } as Window);

    expect(snapshot.hasTelegramWebApp).toBe(true);
    expect(snapshot.runtimeError).toBeNull();
    expect(snapshot.webApp?.ready).toBe(readySpy);
  });

  it("returns preview snapshot when Telegram runtime is unavailable", () => {
    const snapshot = loadTelegramRuntime({} as Window);

    expect(snapshot.hasTelegramWebApp).toBe(false);
    expect(snapshot.webApp).toBeNull();
    expect(snapshot.runtimeError).toBeNull();
  });

  it("returns runtime error instead of throwing", () => {
    const snapshot = loadTelegramRuntime({
      get Telegram() {
        throw new Error("access denied");
      }
    } as Window);

    expect(snapshot.hasTelegramWebApp).toBe(false);
    expect(snapshot.webApp).toBeNull();
    expect(snapshot.runtimeError).toBeInstanceOf(Error);
    expect(snapshot.runtimeError?.message).toContain("access denied");
  });
});
