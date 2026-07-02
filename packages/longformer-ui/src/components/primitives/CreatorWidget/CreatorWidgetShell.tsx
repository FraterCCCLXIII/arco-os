import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import type { CreatorWidgetBackground } from "./types";
import styles from "./CreatorWidgetShell.module.css";

export interface CreatorWidgetShellProps {
  children: ReactNode;
  className?: string;
  background?: CreatorWidgetBackground;
}

/** Full-bleed media card shell with gradient backgrounds and glass overlays. */
export function CreatorWidgetShell({
  children,
  className,
  background = "studio",
}: CreatorWidgetShellProps) {
  return (
    <div className={cx(styles.shell, styles[background], className)}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
