import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./InsightCard.module.css";

export interface InsightCardProps {
  label?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

/** A dark recommendation card with uppercase label and supporting copy. */
export function InsightCard({ label, title, description, className }: InsightCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}
