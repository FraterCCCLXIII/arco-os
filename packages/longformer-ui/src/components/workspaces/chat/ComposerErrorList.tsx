import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./ComposerErrorList.module.css";

export interface ComposerErrorItem {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
}

export interface ComposerErrorListProps {
  items: ComposerErrorItem[];
  className?: string;
}

/** Compact list of agent or tool failures shown in a `ComposerDrawer`. */
export function ComposerErrorList({ items, className }: ComposerErrorListProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map((item) => (
        <li key={item.id} className={styles.row}>
          <span className={styles.indicator} aria-hidden="true">
            <Icon name="close" size={14} />
          </span>
          <span className={styles.rowContent}>
            <span className={styles.rowLabel}>{item.label}</span>
            {item.detail ? <span className={styles.rowDetail}>{item.detail}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
