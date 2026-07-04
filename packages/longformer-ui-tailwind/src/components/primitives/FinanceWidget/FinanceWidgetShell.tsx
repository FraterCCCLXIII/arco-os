import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./FinanceWidgetShell.tailwind";

export type FinanceWidgetSurface = "dark" | "lime" | "white" | "lavender";

export interface FinanceWidgetShellProps {
  children: ReactNode;
  className?: string;
  surface?: FinanceWidgetSurface;
  bleed?: boolean;
}

/** Rounded finance dashboard tile — dark, lime, white, or lavender surfaces. */
export function FinanceWidgetShell({
  children,
  className,
  surface = "dark",
  bleed = true,
}: FinanceWidgetShellProps) {
  return (
    <div className={cx(styles.shell, styles[surface], bleed && styles.bleed, className)}>
      {children}
    </div>
  );
}
