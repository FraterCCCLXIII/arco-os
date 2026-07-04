import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../primitives/IconButton";
import { EditorToolbar, type BlockFormat, type TextAlign, type TextMark } from "../notes/EditorToolbar";
import {
  ComposerFormattingToggle,
} from "../chat/ComposerFormattingToolbar";
import { useComposerFormattingToolbar } from "../chat/useComposerFormattingToolbar";
import {
  applyAlign,
  applyBlockFormat,
  applyMark,
  clearEditor,
  insertLink,
  isEditorEmpty,
  readEditorContent,
  readToolbarState,
  redoEdit,
  undoEdit,
  type RichTextContent,
} from "./richTextCommands";
import styles from "./RichTextEditor.tailwind";

export type { RichTextContent };

export interface RichTextEditorProps {
  placeholder?: string;
  ariaLabel?: string;
  minHeight?: number;
  maxHeight?: number;
  footerActions?: ReactNode;
  sendLabel?: string;
  onSend?: (content: RichTextContent) => void;
  className?: string;
}

/** Contenteditable rich text surface wired to the shared notes formatting toolbar. */
export function RichTextEditor({
  placeholder = "Write something…",
  ariaLabel = "Message body",
  minHeight = 120,
  maxHeight = 280,
  footerActions,
  sendLabel = "Send",
  onSend,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { visible: formattingToolbarVisible, toggle: toggleFormattingToolbar } =
    useComposerFormattingToolbar();
  const [blockFormat, setBlockFormat] = useState<BlockFormat>("paragraph");
  const [marks, setMarks] = useState<TextMark[]>([]);
  const [align, setAlign] = useState<TextAlign>("left");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const syncState = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const toolbar = readToolbarState();
    setBlockFormat(toolbar.blockFormat);
    setMarks(toolbar.marks);
    setAlign(toolbar.align);
    setCanUndo(toolbar.canUndo);
    setCanRedo(toolbar.canRedo);
    setIsEmpty(isEditorEmpty(editor));
  }, []);

  useEffect(() => {
    function handleSelectionChange() {
      const editor = editorRef.current;
      if (!editor) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      if (!editor.contains(selection.anchorNode)) return;
      syncState();
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [syncState]);

  const withEditor = useCallback(
    (action: (editor: HTMLDivElement) => void) => {
      const editor = editorRef.current;
      if (!editor) return;
      action(editor);
      syncState();
    },
    [syncState],
  );

  const handleSend = () => {
    const editor = editorRef.current;
    if (!editor || isEditorEmpty(editor)) return;
    onSend?.(readEditorContent(editor));
    clearEditor(editor);
    syncState();
  };

  return (
    <div className={cx(styles.shell, className)}>
      {formattingToolbarVisible ? (
        <EditorToolbar
          blockFormat={blockFormat}
          onBlockFormatChange={(format) => withEditor((editor) => applyBlockFormat(format, editor))}
          activeMarks={marks}
          onToggleMark={(mark) => withEditor((editor) => applyMark(mark, editor))}
          onInsertLink={() => withEditor(insertLink)}
          align={align}
          onAlignChange={(value) => withEditor((editor) => applyAlign(value, editor))}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => withEditor(undoEdit)}
          onRedo={() => withEditor(redoEdit)}
        />
      ) : null}
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{ minHeight, maxHeight }}
        onInput={syncState}
        onBlur={syncState}
      />
      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <ComposerFormattingToggle
            visible={formattingToolbarVisible}
            onToggle={toggleFormattingToolbar}
          />
          {footerActions}
        </div>
        {onSend && (
          <IconButton
            icon="send"
            label={sendLabel}
            variant="primary"
            size="sm"
            disabled={isEmpty}
            onClick={handleSend}
          />
        )}
      </div>
    </div>
  );
}
