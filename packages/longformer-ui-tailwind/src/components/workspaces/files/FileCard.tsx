import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { FILE_KIND_ICON, FILE_KIND_TONE, type FileItem } from "./types";
import styles from "./FileCard.tailwind";

export interface FileCardProps {
  file: FileItem;
  selected?: boolean;
  compact?: boolean;
  onOpen?: () => void;
  onSelect?: () => void;
  onToggleStar?: () => void;
}

/** Grid/gallery tile for a file or folder — Drive-style card with type icon and metadata. */
export function FileCard({ file, selected = false, compact = false, onOpen, onSelect, onToggleStar }: FileCardProps) {
  const tone = FILE_KIND_TONE[file.kind];

  function handleClick() {
    onSelect?.();
    if (file.kind === "folder") {
      onOpen?.();
    }
  }

  function handleDoubleClick() {
    onOpen?.();
  }

  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.card, selected && styles.selected, compact && styles.compact)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className={cx(styles.preview, styles[tone])}>
        <Icon name={FILE_KIND_ICON[file.kind]} size={compact ? 22 : 28} />
      </div>
      <div className={styles.body}>
        <span className={styles.name}>{file.name}</span>
        {!compact && (
          <span className={styles.meta}>
            {file.modifiedLabel}
            {file.sizeLabel ? ` · ${file.sizeLabel}` : file.itemCount !== undefined ? ` · ${file.itemCount} items` : ""}
          </span>
        )}
      </div>
      {onToggleStar && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={file.starred ? "Unstar" : "Star"}
          className={cx(styles.starButton, file.starred && styles.starActive)}
          onClick={(event) => {
            event.stopPropagation();
            onToggleStar();
          }}
        >
          <Icon name="star" size={14} />
        </span>
      )}
    </button>
  );
}
