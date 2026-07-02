import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./ListItem.module.css";

export interface ListItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Leading icon or avatar. */
  leading?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  /** Trailing content, e.g. a timestamp, count badge, or unread dot. */
  trailing?: ReactNode;
  active?: boolean;
}

/**
 * The recurring "icon + label + trailing meta" row used across every
 * sidebar / list in the reference apps (conversations, channels, mail,
 * templates, settings nav).
 */
export const ListItem = forwardRef<HTMLButtonElement, ListItemProps>(function ListItem(
  { leading, label, description, trailing, active = false, className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx("lf-focusable", styles.item, active && styles.active, className)}
      aria-current={active ? "true" : undefined}
      {...rest}
    >
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </button>
  );
});
