import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./FitnessWidget.tailwind";

export interface DotMatrixProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "light" | "dark";
  className?: string;
}

/** Dot-matrix style numerals for fitness dashboard readouts. */
export function DotMatrix({ children, size = "md", tone = "light", className }: DotMatrixProps) {
  return (
    <span
      className={cx(
        styles.dotMatrix,
        size === "sm" && styles.dotMatrixSm,
        size === "md" && styles.dotMatrixMd,
        size === "lg" && styles.dotMatrixLg,
        size === "xl" && styles.dotMatrixXl,
        tone === "light" && styles.dotMatrixLight,
        tone === "dark" && styles.dotMatrixDark,
        className,
      )}
    >
      {children}
    </span>
  );
}
