import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./SelectionTile.module.css";

export type SelectionTileSize = "sm" | "md" | "lg" | "wide" | "tall";

export interface SelectionTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
  selected?: boolean;
  /** Controls bento grid footprint when placed inside a selection grid. */
  size?: SelectionTileSize;
}

/**
 * A toggleable bento tile for preference pickers — dark surface, soft radius,
 * and a bright outline when selected.
 */
export function SelectionTile({
  label,
  selected = false,
  size = "md",
  className,
  ...rest
}: SelectionTileProps) {
  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.tile, styles[size], selected && styles.selected, className)}
      aria-pressed={selected}
      {...rest}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
}
