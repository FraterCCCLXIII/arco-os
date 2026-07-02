import { useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../primitives/IconButton";
import { EditorToolbar, type BlockFormat, type TextAlign, type TextMark } from "../notes/EditorToolbar";
import styles from "./EmailReplyComposer.module.css";

export interface EmailReplyComposerProps {
  placeholder?: string;
  onSend?: (body: string) => void;
  className?: string;
}

/**
 * Gmail-style reply surface: formatting toolbar plus a contenteditable body.
 * Toolbar state is local demo wiring — same pattern as the Notes workspace.
 */
export function EmailReplyComposer({
  placeholder = "Write a reply…",
  onSend,
  className,
}: EmailReplyComposerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState("");
  const [blockFormat, setBlockFormat] = useState<BlockFormat>("paragraph");
  const [marks, setMarks] = useState<TextMark[]>([]);
  const [align, setAlign] = useState<TextAlign>("left");

  function handleToggleMark(mark: TextMark) {
    setMarks((prev) => (prev.includes(mark) ? prev.filter((m) => m !== mark) : [...prev, mark]));
  }

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setBody("");
    if (editorRef.current) editorRef.current.textContent = "";
  }

  return (
    <div className={cx(styles.composer, className)}>
      <EditorToolbar
        blockFormat={blockFormat}
        onBlockFormatChange={setBlockFormat}
        activeMarks={marks}
        onToggleMark={handleToggleMark}
        onInsertLink={() => undefined}
        align={align}
        onAlignChange={setAlign}
      />
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Reply body"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={(event) => setBody(event.currentTarget.textContent ?? "")}
      />
      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <IconButton icon="attach" label="Attach file" size="sm" />
        </div>
        <IconButton
          icon="send"
          label="Send reply"
          variant="primary"
          size="sm"
          disabled={body.trim().length === 0}
          onClick={handleSend}
        />
      </div>
    </div>
  );
}
