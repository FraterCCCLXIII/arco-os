import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./DesignCardShell.module.css";

export type DesignCardTheme = "dark" | "light" | "blue" | "red" | "gradientGreen" | "gradientPurple";

export interface DesignCardShellProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: DesignCardTheme;
}

/** Shared pill shell for live-activity / widget-style design cards. */
export function DesignCardShell({ children, className, size = "md", theme = "dark" }: DesignCardShellProps) {
  return (
    <div className={cx(styles.shell, styles[size], styles[theme], className)}>
      {children}
    </div>
  );
}
