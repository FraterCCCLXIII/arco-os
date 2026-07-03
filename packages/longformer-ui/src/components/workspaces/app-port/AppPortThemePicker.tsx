import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { useTheme } from "../../../tokens/ThemeProvider";
import type { LongformerTheme } from "../../../tokens/tokens";
import styles from "./AppPortThemePicker.module.css";

export interface AppPortThemePickerProps {
  className?: string;
}

/** Light / dark switcher for App Port previews — updates the global Longformer theme. */
export function AppPortThemePicker({ className }: AppPortThemePickerProps) {
  const { theme, setTheme } = useTheme();

  function setMode(next: LongformerTheme) {
    setTheme(next);
  }

  return (
    <div className={cx(styles.picker, className)} role="group" aria-label="Theme">
      <button
        type="button"
        className={cx("lf-focusable", styles.tab, theme === "light" && styles.tabActive)}
        aria-pressed={theme === "light"}
        aria-label="Light mode"
        onClick={() => setMode("light")}
      >
        <Icon name="sun" size={14} />
        Light
      </button>
      <button
        type="button"
        className={cx("lf-focusable", styles.tab, theme === "dark" && styles.tabActive)}
        aria-pressed={theme === "dark"}
        aria-label="Dark mode"
        onClick={() => setMode("dark")}
      >
        <Icon name="moon" size={14} />
        Dark
      </button>
    </div>
  );
}
