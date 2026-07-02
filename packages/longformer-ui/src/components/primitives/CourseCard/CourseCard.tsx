import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Button } from "../Button";
import styles from "./CourseCard.module.css";

export type CourseCardVariant = "pill" | "tile" | "hero";

export interface CourseCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  variant?: CourseCardVariant;
  title: ReactNode;
  subtitle?: ReactNode;
  instructor?: ReactNode;
  progress?: string;
  actionLabel?: ReactNode;
  tone?: "accent" | "neutral" | "warning";
}

/**
 * A learning course card — horizontal pill, compact tile, or featured hero layout.
 */
export function CourseCard({
  variant = "tile",
  title,
  subtitle,
  instructor,
  progress,
  actionLabel,
  tone = "accent",
  className,
  ...rest
}: CourseCardProps) {
  if (variant === "pill") {
    return (
      <button type="button" className={cx("lf-focusable", styles.pill, styles[`pill-${tone}`], className)} {...rest}>
        <span className={styles.pillIcon}>
          <Icon name="notebook" size={16} />
        </span>
        <span className={styles.pillBody}>
          <span className={styles.pillTitle}>{title}</span>
          {subtitle && <span className={styles.pillSubtitle}>{subtitle}</span>}
        </span>
        <span className={styles.pillChevron}>
          <Icon name="chevron-right" size={16} />
        </span>
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cx(styles.hero, styles[`tone-${tone}`], className)}>
        <div className={styles.heroTop}>
          <span className={styles.heroIcon}>
            <Icon name="sparkles" size={16} />
          </span>
          {progress && <span className={styles.progress}>{progress}</span>}
        </div>
        <div className={styles.heroTitle}>{title}</div>
        {instructor && <div className={styles.heroInstructor}>{instructor}</div>}
        {actionLabel && (
          <Button variant="primary" size="sm" className={styles.heroAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <button type="button" className={cx("lf-focusable", styles.tile, styles[`tone-${tone}`], className)} {...rest}>
      <div className={styles.tileTop}>
        <span className={styles.tileIcon}>
          <Icon name="layers" size={14} />
        </span>
        {progress && <span className={styles.progress}>{progress}</span>}
      </div>
      {instructor && <div className={styles.tileInstructor}>{instructor}</div>}
      <div className={styles.tileTitle}>{title}</div>
      {subtitle && <div className={styles.tileSubtitle}>{subtitle}</div>}
    </button>
  );
}
