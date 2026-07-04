import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./GlassWidgetShell.tailwind";

export type GlassWidgetTheme = "light" | "dark";

export interface GlassWidgetShellProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: GlassWidgetTheme;
}

/** Squircle glass widget shell — high-contrast light or dark dashboard tile. */
export function GlassWidgetShell({ children, className, size = "sm", theme = "light" }: GlassWidgetShellProps) {
  return (
    <div className={cx(styles.shell, styles[size], styles[theme], className)}>
      {children}
    </div>
  );
}
