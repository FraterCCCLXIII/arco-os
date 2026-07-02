import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import styles from "./TopBar.module.css";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface TopBarProps {
  breadcrumb?: BreadcrumbItem[];
  /** Collaborator avatars shown as an overlapping stack, e.g. on a Notes doc. */
  collaborators?: { name: string; src?: string }[];
  actions?: ReactNode;
  className?: string;
}

/** Breadcrumb + collaborators + actions bar used atop Notes and Email panes. */
export function TopBar({ breadcrumb, collaborators, actions, className }: TopBarProps) {
  return (
    <div className={cx(styles.topBar, className)}>
      {breadcrumb && (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <span key={index} style={{ display: "flex", alignItems: "center", gap: "inherit", minWidth: 0 }}>
                {index > 0 && (
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    <Icon name="chevron-right" size={13} />
                  </span>
                )}
                {item.onClick ? (
                  <button
                    type="button"
                    className={cx(styles.breadcrumbItem, isLast && styles.breadcrumbCurrent)}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={cx(styles.breadcrumbItem, isLast && styles.breadcrumbCurrent)}>{item.label}</span>
                )}
              </span>
            );
          })}
        </nav>
      )}
      <div className={styles.right}>
        {collaborators && collaborators.length > 0 && (
          <div className={styles.avatarStack} aria-label={`${collaborators.length} collaborators`}>
            {collaborators.map((person) => (
              <Avatar key={person.name} name={person.name} src={person.src} size="sm" />
            ))}
          </div>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
