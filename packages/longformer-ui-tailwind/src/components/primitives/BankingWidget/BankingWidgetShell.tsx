import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./BankingWidgetShell.tailwind";

export type BankingWidgetSurface = "purple" | "lime" | "white" | "black";

export interface BankingWidgetShellProps {
  children: ReactNode;
  className?: string;
  surface?: BankingWidgetSurface;
  chamfer?: boolean;
  bleed?: boolean;
}

/** Banking dashboard tile — purple, lime, white, or black with optional chamfered corner. */
export function BankingWidgetShell({
  children,
  className,
  surface = "white",
  chamfer = false,
  bleed = true,
}: BankingWidgetShellProps) {
  return (
    <div className={cx(styles.shell, styles[surface], chamfer && styles.chamfer, bleed && styles.bleed, className)}>
      {children}
    </div>
  );
}
