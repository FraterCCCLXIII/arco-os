import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./InsightCard.module.css";

export interface InsightCardProps {
  label?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** When set, the whole card becomes a link that opens in a new tab. */
  href?: string;
  className?: string;
}

/** A dark recommendation card with uppercase label and supporting copy. */
export function InsightCard({ label, title, description, href, className }: InsightCardProps) {
  const body = (
    <>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </>
  );
  if (href) {
    return (
      <a
        className={cx("lf-focusable", styles.card, styles.cardLink, className)}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {body}
      </a>
    );
  }
  return <div className={cx(styles.card, className)}>{body}</div>;
}
