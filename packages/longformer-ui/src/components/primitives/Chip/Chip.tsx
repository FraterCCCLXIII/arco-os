import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./Chip.module.css";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconName;
  /** Filled/accent styling for a toggled state, e.g. an applied filter or a saved item. */
  active?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

/** A clickable pill, e.g. a prompt suggestion, an applied filter, or a save toggle. */
export function Chip({ icon, active = false, onRemove, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.chip, active && styles.active, className)}
      aria-pressed={active}
      {...rest}
    >
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={14} />
        </span>
      )}
      {children}
      {onRemove && (
        <span
          className={styles.remove}
          role="button"
          aria-label="Remove"
          tabIndex={-1}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="close" size={12} />
        </span>
      )}
    </button>
  );
}
