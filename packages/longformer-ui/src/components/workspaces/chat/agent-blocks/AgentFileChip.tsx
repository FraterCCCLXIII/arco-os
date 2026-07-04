import { cx } from "../../../../utils/cx";
import type { AgentFileChipProps, AgentFileKind } from "./types";
import styles from "./AgentBlocks.module.css";

const BADGE_LABEL: Record<AgentFileKind, string> = {
  ts: "TS",
  tsx: "TSX",
  css: "CSS",
  other: "FILE",
};

function basename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}

function badgeClass(kind: AgentFileKind): string {
  if (kind === "ts") return styles.fileBadgeTs;
  if (kind === "tsx") return styles.fileBadgeTsx;
  if (kind === "css") return styles.fileBadgeCss;
  return styles.fileBadgeOther;
}

/** Inline file reference pill — colored type badge plus monospaced filename. */
export function AgentFileChip({ path, kind = "other", onClick, className }: AgentFileChipProps) {
  const Tag = onClick ? "button" : "span";
  const filename = basename(path);

  return (
    <Tag
      type={onClick ? "button" : undefined}
      className={cx(styles.fileChip, onClick && styles.fileChipInteractive, className)}
      onClick={onClick}
      title={path}
    >
      <span className={cx(styles.fileBadge, badgeClass(kind))} aria-hidden="true">
        {BADGE_LABEL[kind]}
      </span>
      <span className={styles.fileName}>{filename}</span>
    </Tag>
  );
}
