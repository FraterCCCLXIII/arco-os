import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./DashboardCardHeader.tailwind";

export interface DashboardCardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  menu?: boolean;
  className?: string;
}

/** Vuexy-style card header — title, optional subtitle, and overflow menu. */
export function DashboardCardHeader({ title, subtitle, menu = false, className }: DashboardCardHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {menu && (
        <button type="button" className={styles.menu} aria-label="More options">
          <Icon name="more-vertical" size={16} />
        </button>
      )}
    </div>
  );
}
