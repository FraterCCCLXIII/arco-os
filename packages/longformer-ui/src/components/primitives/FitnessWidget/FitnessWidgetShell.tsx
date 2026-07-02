import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./FitnessWidgetShell.module.css";

export type FitnessWidgetSurface = "dark" | "light" | "pink";

export interface FitnessWidgetShellProps {
  children: ReactNode;
  className?: string;
  surface?: FitnessWidgetSurface;
  bleed?: boolean;
}

/** Rounded fitness dashboard tile shell — dark, light, or pastel pink surfaces. */
export function FitnessWidgetShell({
  children,
  className,
  surface = "dark",
  bleed = true,
}: FitnessWidgetShellProps) {
  return (
    <div className={cx(styles.shell, styles[surface], bleed && styles.bleed, className)}>
      {children}
    </div>
  );
}
