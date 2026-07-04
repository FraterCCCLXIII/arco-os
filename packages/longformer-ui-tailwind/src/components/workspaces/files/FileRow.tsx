import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { FILE_KIND_ICON, FILE_KIND_TONE, type FileItem } from "./types";
import styles from "./FileRow.tailwind";

export interface FileRowProps {
  file: FileItem;
  selected?: boolean;
  onOpen?: () => void;
  onSelect?: () => void;
  onToggleStar?: () => void;
}

export function FileRow({ file, selected = false, onOpen, onSelect, onToggleStar }: FileRowProps) {
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
      className={cx("lf-focusable", styles.row, selected && styles.selected)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <span className={styles.nameCell}>
        <span className={cx(styles.icon, styles[tone])}>
          <Icon name={FILE_KIND_ICON[file.kind]} size={15} />
        </span>
        <span className={styles.name}>{file.name}</span>
      </span>
      <span className={styles.metaCell}>
        {file.owner && <Avatar name={file.owner.name} src={file.owner.avatarSrc} size="sm" />}
        {file.owner?.name}
      </span>
      <span className={styles.modifiedCell}>{file.modifiedLabel}</span>
      <span className={styles.sizeCell}>
        {file.kind === "folder"
          ? file.itemCount !== undefined && `${file.itemCount} item${file.itemCount === 1 ? "" : "s"}`
          : file.sizeLabel}
      </span>
      <span
        role="button"
        tabIndex={-1}
        aria-label={file.starred ? "Unstar" : "Star"}
        className={cx(styles.starButton, file.starred && styles.starActive)}
        onClick={(event) => {
          event.stopPropagation();
          onToggleStar?.();
        }}
      >
        <Icon name="star" size={14} />
      </span>
    </button>
  );
}
