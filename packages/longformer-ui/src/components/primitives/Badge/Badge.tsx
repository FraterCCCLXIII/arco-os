import type { HTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Shows a small leading dot, useful for status badges like "Active". */
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

export interface CountBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
}

/** Small filled numeric badge, e.g. unread counts in a sidebar list. */
export function CountBadge({ count, max = 99, className, ...rest }: CountBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className={cx(styles.count, className)} {...rest}>
      {count > max ? `${max}+` : count}
    </span>
  );
}
