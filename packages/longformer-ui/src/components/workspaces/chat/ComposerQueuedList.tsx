import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./ComposerQueuedList.module.css";

export interface ComposerQueuedItem {
  id: string;
  label: ReactNode;
}

export interface ComposerQueuedListProps {
  items: ComposerQueuedItem[];
  className?: string;
}

/** Compact list of user messages waiting to be sent or processed. */
export function ComposerQueuedList({ items, className }: ComposerQueuedListProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map((item) => (
        <li key={item.id} className={styles.row}>
          <span className={styles.indicator} aria-hidden="true">
            <Icon name="clock" size={13} />
          </span>
          <span className={styles.rowLabel}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
