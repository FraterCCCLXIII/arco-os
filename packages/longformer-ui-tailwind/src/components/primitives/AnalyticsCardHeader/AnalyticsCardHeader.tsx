import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./AnalyticsCardHeader.tailwind";

export interface AnalyticsCardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  externalLink?: boolean;
  className?: string;
}

/** Shared header row for light analytics dashboard cards. */
export function AnalyticsCardHeader({
  title,
  subtitle,
  icon,
  action,
  externalLink,
  className,
}: AnalyticsCardHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.lead}>
        {icon && (
          <span className={styles.icon}>
            <Icon name={icon} size={14} />
          </span>
        )}
        <div>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      {action}
      {externalLink && !action && (
        <span className={styles.external}>
          <Icon name="external-link" size={14} />
        </span>
      )}
    </div>
  );
}
