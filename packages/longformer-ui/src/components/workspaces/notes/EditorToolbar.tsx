import type { ReactElement } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { Divider } from "../../primitives/Divider";
import { Tooltip } from "../../primitives/Tooltip";
import styles from "./EditorToolbar.module.css";

export type TextMark = "bold" | "italic" | "underline" | "strikethrough" | "code";
export type BlockFormat = "paragraph" | "heading1" | "heading2" | "heading3" | "bulletList" | "numberedList" | "quote";
export type TextAlign = "left" | "center" | "right";

const BLOCK_FORMAT_META: Record<BlockFormat, { label: string; icon: IconName }> = {
  paragraph: { label: "Paragraph", icon: "paragraph" },
  heading1: { label: "Heading 1", icon: "heading-1" },
  heading2: { label: "Heading 2", icon: "heading-2" },
  heading3: { label: "Heading 3", icon: "heading-3" },
  bulletList: { label: "Bulleted list", icon: "list" },
  numberedList: { label: "Numbered list", icon: "list-ordered" },
  quote: { label: "Quote", icon: "quote" },
};

const BLOCK_FORMAT_ORDER: BlockFormat[] = [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bulletList",
  "numberedList",
  "quote",
];

const MARK_META: { mark: TextMark; icon: IconName; label: string }[] = [
  { mark: "bold", icon: "bold", label: "Bold" },
  { mark: "italic", icon: "italic", label: "Italic" },
  { mark: "underline", icon: "underline", label: "Underline" },
  { mark: "strikethrough", icon: "strikethrough", label: "Strikethrough" },
  { mark: "code", icon: "code", label: "Inline code" },
];

const ALIGN_META: { align: TextAlign; icon: IconName; label: string }[] = [
  { align: "left", icon: "align-left", label: "Align left" },
  { align: "center", icon: "align-center", label: "Align center" },
  { align: "right", icon: "align-right", label: "Align right" },
];

function ToolbarButton({
  icon,
  label,
  pressed,
  disabled,
  onClick,
}: {
  icon: IconName;
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        className={cx("lf-focusable", styles.toolButton, pressed && styles.toolButtonPressed)}
        aria-label={label}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon name={icon} size={15} />
      </button>
    </Tooltip>
  );
}

export interface EditorToolbarProps {
  blockFormat?: BlockFormat;
  onBlockFormatChange?: (format: BlockFormat) => void;
  activeMarks?: ReadonlySet<TextMark> | TextMark[];
  onToggleMark?: (mark: TextMark) => void;
  onInsertLink?: () => void;
  align?: TextAlign;
  onAlignChange?: (align: TextAlign) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  className?: string;
}

/** A Notion/Docs-style formatting toolbar for a rich text document: block type, marks, link, align, undo/redo. */
export function EditorToolbar({
  blockFormat = "paragraph",
  onBlockFormatChange,
  activeMarks,
  onToggleMark,
  onInsertLink,
  align = "left",
  onAlignChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  className,
}: EditorToolbarProps) {
  const marks = activeMarks instanceof Set ? activeMarks : new Set(activeMarks ?? []);
  const formatMeta = BLOCK_FORMAT_META[blockFormat];

  const blockFormatItems: MenuItemDescriptor[] = BLOCK_FORMAT_ORDER.map((format) => ({
    id: format,
    label: BLOCK_FORMAT_META[format].label,
    icon: BLOCK_FORMAT_META[format].icon,
    onSelect: () => onBlockFormatChange?.(format),
  }));

  const trigger = (
    <button type="button" className={cx("lf-focusable", styles.formatTrigger)}>
      <Icon name={formatMeta.icon} size={15} />
      <span className={styles.formatLabel}>{formatMeta.label}</span>
      <Icon name="chevron-down" size={13} />
    </button>
  ) as ReactElement;

  return (
    <div className={cx(styles.toolbar, className)} role="toolbar" aria-label="Formatting">
      <Menu trigger={trigger} items={blockFormatItems} aria-label="Block type" />

      <Divider orientation="vertical" />

      <div className={styles.group}>
        {MARK_META.map(({ mark, icon, label }) => (
          <ToolbarButton
            key={mark}
            icon={icon}
            label={label}
            pressed={marks.has(mark)}
            onClick={() => onToggleMark?.(mark)}
          />
        ))}
      </div>

      <Divider orientation="vertical" />

      <ToolbarButton icon="link" label="Link" onClick={onInsertLink} />

      <Divider orientation="vertical" />

      <div className={styles.group}>
        {ALIGN_META.map(({ align: value, icon, label }) => (
          <ToolbarButton
            key={value}
            icon={icon}
            label={label}
            pressed={align === value}
            onClick={() => onAlignChange?.(value)}
          />
        ))}
      </div>

      <div className={styles.spacer} />

      <div className={styles.group}>
        <ToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={onUndo} />
        <ToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={onRedo} />
      </div>
    </div>
  );
}
