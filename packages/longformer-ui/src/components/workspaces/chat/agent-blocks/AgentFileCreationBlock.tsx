import { useState } from "react";
import { cx } from "../../../../utils/cx";
import { Icon } from "../../../../icons";
import type { AgentFileCreationBlockProps } from "./types";
import styles from "./AgentBlocks.module.css";

function fileCountLabel(count: number): string {
  return count === 1 ? "Created 1 file" : `Created ${count} files`;
}

/** Collapsible agent output — grouped file creations with descriptions and filename pills. */
export function AgentFileCreationBlock({
  files,
  title,
  status = "done",
  defaultOpen = true,
  className,
}: AgentFileCreationBlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  const headerLabel = title ?? fileCountLabel(files.length);

  return (
    <div className={cx(styles.fileCreation, className)} role="group" aria-label={String(headerLabel)}>
      <button
        type="button"
        className={cx("lf-focusable", styles.fileCreationHeader)}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.fileCreationTitle}>{headerLabel}</span>
        <span
          className={cx(styles.fileCreationChevron, open ? styles.fileCreationChevronOpen : styles.fileCreationChevronClosed)}
          aria-hidden="true"
        >
          <Icon name="chevron-right" size={13} />
        </span>
      </button>

      {open && (
        <div className={styles.fileCreationBody}>
          <ul className={styles.fileCreationList}>
            {files.map((file, index) => {
              const isLast = index === files.length - 1;
              const tooltip = file.path ?? file.filename;

              return (
                <li
                  key={file.id}
                  className={cx(styles.fileCreationRow, !isLast && styles.fileCreationRowWithConnector)}
                >
                  <span className={styles.fileCreationRail} aria-hidden="true">
                    <span className={styles.fileCreationIcon}>
                      <Icon name="file" size={14} />
                    </span>
                  </span>
                  {file.onClick ? (
                    <button
                      type="button"
                      className={cx("lf-focusable", styles.fileCreationContent, styles.fileCreationRowInteractive)}
                      onClick={file.onClick}
                      title={tooltip}
                    >
                      <span className={styles.fileCreationLabel}>{file.label}</span>
                      <code className={styles.fileCreationFilename}>{file.filename}</code>
                    </button>
                  ) : (
                    <span className={styles.fileCreationContent} title={tooltip}>
                      <span className={styles.fileCreationLabel}>{file.label}</span>
                      <code className={styles.fileCreationFilename}>{file.filename}</code>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {status === "done" ? (
            <div className={styles.fileCreationDone}>
              <span className={styles.fileCreationDoneIcon} aria-hidden="true">
                <Icon name="check" size={11} strokeWidth={2.5} />
              </span>
              <span>Done</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
