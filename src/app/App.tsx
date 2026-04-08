import { useEffect, useMemo } from "react";
import { applyThemeVars, resolveAppTheme } from "../features/theme";
import { CoinScreen } from "../widgets/CoinScreen/CoinScreen";
import { getRuntimeContext, markReady } from "./runtime";

/**
 * Renders the single-screen application layout.
 */
export function App(): JSX.Element {
  const runtimeContext = useMemo(() => getRuntimeContext(), []);

  const appTheme = resolveAppTheme({
    mode: runtimeContext.mode,
    runtimeError: runtimeContext.runtimeError,
    themeParams: runtimeContext.webApp?.themeParams,
  });

  useEffect(() => {
    markReady(runtimeContext);
  }, [runtimeContext]);

  useEffect(() => {
    applyThemeVars(appTheme);
  }, [appTheme]);

  return <CoinScreen />;
}
