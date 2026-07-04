import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./TimelineStepCard.tailwind";

export interface TimelineStepCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
  completed?: boolean;
  /** Draw the dotted connector below this step's indicator. */
  showConnector?: boolean;
}

/**
 * A pill-shaped step row in a vertical flow — check indicator on the left,
 * label in the middle, chevron on the right.
 */
export function TimelineStepCard({
  label,
  completed = true,
  showConnector = true,
  className,
  ...rest
}: TimelineStepCardProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rail}>
        <span className={cx(styles.indicator, completed && styles.indicatorComplete)} aria-hidden="true">
          {completed && <Icon name="check" size={12} />}
        </span>
        {showConnector && <span className={styles.connector} aria-hidden="true" />}
      </div>

      <button type="button" className={cx("lf-focusable", styles.card, className)} {...rest}>
        <span className={styles.label}>{label}</span>
        <Icon name="chevron-right" size={16} className={styles.chevron} />
      </button>
    </div>
  );
}
