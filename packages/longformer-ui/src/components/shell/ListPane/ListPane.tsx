import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./ListPane.module.css";

export interface ListPaneProps {
  /** Simple title row; ignored when `header` is provided. */
  title?: ReactNode;
  /** Fully custom header row (replaces the default title row). */
  header?: ReactNode;
  headerActions?: ReactNode;
  /** Optional toolbar below the header (e.g. search). */
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Resizable master-detail list column shared by Messages, Email, and Contacts. */
export function ListPane({
  title,
  header,
  headerActions,
  toolbar,
  children,
  className,
  bodyClassName,
}: ListPaneProps) {
  const showDefaultHeader = !header && (title || headerActions);

  return (
    <div className={cx(styles.pane, className)}>
      {header}
      {showDefaultHeader && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {headerActions}
        </div>
      )}
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
      <div className={cx(styles.body, bodyClassName)}>{children}</div>
    </div>
  );
}
