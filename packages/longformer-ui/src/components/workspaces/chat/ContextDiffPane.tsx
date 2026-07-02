import { ScrollArea } from "../../primitives/ScrollArea";
import { cx } from "../../../utils/cx";
import styles from "./ContextDiffPane.module.css";

export type DiffLineKind = "add" | "remove" | "context" | "header";

export interface DiffLine {
  kind: DiffLineKind;
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffHunk {
  id: string;
  filePath: string;
  lines: DiffLine[];
}

export interface ContextDiffPaneProps {
  hunks: DiffHunk[];
  activeHunkId?: string;
}

/** Unified diff viewer for agent edits in the chat context drawer. */
export function ContextDiffPane({ hunks, activeHunkId }: ContextDiffPaneProps) {
  const activeHunk = hunks.find((hunk) => hunk.id === activeHunkId) ?? hunks[0];

  if (!activeHunk) {
    return (
      <div className={styles.empty}>
        <p>No diffs yet</p>
        <span>Changes the agent makes will appear here.</span>
      </div>
    );
  }

  return (
    <div className={styles.pane}>
      <div className={styles.fileHeader}>{activeHunk.filePath}</div>
      <ScrollArea className={styles.scroll}>
        <pre className={styles.diff}>
          {activeHunk.lines.map((line, index) => (
            <div
              key={`${line.kind}-${index}`}
              className={cx(
                styles.line,
                line.kind === "add" && styles.lineAdd,
                line.kind === "remove" && styles.lineRemove,
                line.kind === "header" && styles.lineHeader,
              )}
            >
              <span className={styles.gutterOld}>{line.oldLineNumber ?? ""}</span>
              <span className={styles.gutterNew}>{line.newLineNumber ?? ""}</span>
              <span className={styles.marker}>
                {line.kind === "add" ? "+" : line.kind === "remove" ? "-" : line.kind === "header" ? "@" : " "}
              </span>
              <span className={styles.content}>{line.content}</span>
            </div>
          ))}
        </pre>
      </ScrollArea>
    </div>
  );
}
