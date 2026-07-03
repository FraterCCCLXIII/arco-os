import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./ComposerFileChangeList.module.css";

export type ComposerFileChangeKind = "tsx" | "css" | "ts" | "other";

export interface ComposerFileChangeItem {
  id: string;
  path: string;
  additions: number;
  deletions?: number;
  kind?: ComposerFileChangeKind;
}

export interface ComposerFileChangeListProps {
  items: ComposerFileChangeItem[];
  onSelect?: (item: ComposerFileChangeItem) => void;
  className?: string;
}

export interface ComposerFileChangeActionsProps {
  onStop?: () => void;
  onReview?: () => void;
  className?: string;
}

const KIND_ICON: Record<ComposerFileChangeKind, IconName> = {
  tsx: "code",
  ts: "code",
  css: "hash",
  other: "file",
};

function basename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}

/** Agent file-change rows for the composer drawer — path, icon, and diff counts. */
export function ComposerFileChangeList({ items, onSelect, className }: ComposerFileChangeListProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map((item) => {
        const kind = item.kind ?? "other";
        const RowTag = onSelect ? "button" : "li";

        return (
          <RowTag
            key={item.id}
            type={onSelect ? "button" : undefined}
            className={styles.row}
            onClick={onSelect ? () => onSelect(item) : undefined}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon name={KIND_ICON[kind]} size={14} />
            </span>
            <span className={styles.path}>{basename(item.path)}</span>
            {item.additions > 0 ? (
              <span className={styles.additions}>+{item.additions}</span>
            ) : null}
            {item.deletions && item.deletions > 0 ? (
              <span className={styles.deletions}>-{item.deletions}</span>
            ) : null}
          </RowTag>
        );
      })}
    </ul>
  );
}

/** Stop / Review controls shown in the file-changes drawer header. */
export function ComposerFileChangeActions({ onStop, onReview, className }: ComposerFileChangeActionsProps) {
  return (
    <div className={cx(styles.actions, className)}>
      {onStop ? (
        <button type="button" className={cx("lf-focusable", styles.stopButton)} onClick={onStop}>
          Stop
        </button>
      ) : null}
      {onReview ? (
        <button type="button" className={cx("lf-focusable", styles.reviewButton)} onClick={onReview}>
          Review
        </button>
      ) : null}
    </div>
  );
}
