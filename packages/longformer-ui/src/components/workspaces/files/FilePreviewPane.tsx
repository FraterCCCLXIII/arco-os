import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import { EmptyState } from "../../primitives/EmptyState";
import { FILE_KIND_ICON, FILE_KIND_TONE, type FileItem } from "./types";
import styles from "./FilePreviewPane.module.css";

const PREVIEW_COPY: Partial<Record<FileItem["kind"], string>> = {
  doc: "This document captures planning notes and product requirements. Select Open to edit in the full workspace.",
  sheet: "Spreadsheet with quarterly metrics, forecasts, and scenario tabs.",
  slides: "Presentation deck with title slide, agenda, and appendix charts.",
  pdf: "Signed agreement PDF — preview only in this demo.",
  code: `export function connectGateway(url: string) {\n  return new WebSocket(url);\n}`,
  image: "Image preview would render here when connected to real file storage.",
  video: "Video preview and playback controls would appear here.",
  archive: "Compressed archive containing exported assets and build artifacts.",
};

export interface FilePreviewPaneProps {
  file: FileItem;
  onClose?: () => void;
  onOpen?: () => void;
}

/** Quick Look / Drive preview pane for the selected non-folder file. */
export function FilePreviewPane({ file, onClose, onOpen }: FilePreviewPaneProps) {
  const tone = FILE_KIND_TONE[file.kind];
  const previewText = file.previewText ?? PREVIEW_COPY[file.kind] ?? "No preview available for this file type.";

  return (
    <div className={styles.pane}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={cx(styles.icon, styles[tone])}>
            <Icon name={FILE_KIND_ICON[file.kind]} size={16} />
          </span>
          <span className={styles.fileName}>{file.name}</span>
        </div>
        <div className={styles.headerActions}>
          <IconButton icon="download" label="Download" size="sm" />
          <IconButton icon="more-vertical" label="More options" size="sm" />
          {onClose && <IconButton icon="close" label="Close preview" size="sm" onClick={onClose} />}
        </div>
      </div>

      <ScrollArea className={styles.scroll}>
        <div className={styles.previewArea}>
          {file.previewImageSrc ? (
            <img src={file.previewImageSrc} alt="" className={styles.previewImage} />
          ) : file.kind === "image" ? (
            <div className={cx(styles.previewPlaceholder, styles[tone])}>
              <Icon name="image" size={42} />
              <span>Image preview</span>
            </div>
          ) : file.kind === "video" ? (
            <div className={cx(styles.previewPlaceholder, styles[tone])}>
              <Icon name="play" size={42} />
              <span>Video preview</span>
            </div>
          ) : file.kind === "code" ? (
            <pre className={styles.codePreview}>{previewText}</pre>
          ) : (
            <div className={cx(styles.previewPlaceholder, styles[tone])}>
              <Icon name={FILE_KIND_ICON[file.kind]} size={42} />
              <span>{file.kind.toUpperCase()} preview</span>
            </div>
          )}
        </div>

        <div className={styles.metaSection}>
          <h3 className={styles.sectionTitle}>Details</h3>
          <dl className={styles.metaList}>
            <div className={styles.metaRow}>
              <dt>Type</dt>
              <dd>{file.kind}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>Size</dt>
              <dd>{file.sizeLabel ?? "—"}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>Modified</dt>
              <dd>{file.modifiedLabel ?? "—"}</dd>
            </div>
            {file.owner && (
              <div className={styles.metaRow}>
                <dt>Owner</dt>
                <dd className={styles.ownerValue}>
                  <Avatar name={file.owner.name} src={file.owner.avatarSrc} size="sm" />
                  {file.owner.name}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {file.kind !== "folder" && (
          <div className={styles.textSection}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <p className={styles.previewText}>{previewText}</p>
          </div>
        )}
      </ScrollArea>

      <div className={styles.footer}>
        <Button variant="primary" size="sm" onClick={onOpen}>
          <Icon name="external-link" size={14} />
          Open
        </Button>
        <Button variant="secondary" size="sm">
          <Icon name="users" size={14} />
          Share
        </Button>
      </div>
    </div>
  );
}

export function FilePreviewEmpty() {
  return (
    <div className={styles.pane}>
      <EmptyState
        className={styles.empty}
        icon={<Icon name="file" size={28} />}
        title="Select a file"
        description="Choose a file from the list to preview it here — like Finder Quick Look or Drive's details pane."
      />
    </div>
  );
}
