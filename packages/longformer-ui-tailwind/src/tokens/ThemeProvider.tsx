import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import "./theme.css";
import type { LongformerTheme } from "./tokens";
import { LF_PORTAL_ROOT_ID } from "../utils/getPortalContainer";

const STORAGE_KEY = "longformer:theme";

interface ThemeContextValue {
  theme: LongformerTheme;
  setTheme: (theme: LongformerTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredTheme(defaultTheme: LongformerTheme): LongformerTheme {
  if (typeof window === "undefined") return defaultTheme;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : defaultTheme;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Theme to use the first time a visitor has no stored preference. */
  defaultTheme?: LongformerTheme;
  /** Disable persisting the choice to localStorage (useful in embeds). */
  persist?: boolean;
  className?: string;
}

/**
 * Wraps an app (or a section of it) in the Longformer theme scope. Sets
 * `data-lf-theme` on the wrapper element, which is what every token in
 * `theme.css` keys off of.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
  persist = true,
  className,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<LongformerTheme>(() =>
    persist ? readStoredTheme(defaultTheme) : defaultTheme
  );

  useEffect(() => {
    if (persist) window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, persist]);

  const setTheme = useCallback((next: LongformerTheme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={["lf-root", className].filter(Boolean).join(" ")} data-lf-theme={theme}>
        {children}
      </div>
      <div id={LF_PORTAL_ROOT_ID} className="lf-portal" data-lf-theme={theme} />
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
