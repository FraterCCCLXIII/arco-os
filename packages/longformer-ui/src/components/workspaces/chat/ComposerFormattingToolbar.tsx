import { cx } from "../../../utils/cx";
import { IconButton } from "../../primitives/IconButton";
import styles from "./ComposerFormattingToolbar.module.css";

export interface ComposerFormattingToolbarProps {
  visible?: boolean;
  className?: string;
}

/** Slack-style inline formatting controls for chat composers. */
export function ComposerFormattingToolbar({ visible = true, className }: ComposerFormattingToolbarProps) {
  return (
    <div
      className={cx(styles.toolbar, !visible && styles.toolbarHidden, className)}
      role="toolbar"
      aria-label="Text formatting"
      hidden={!visible}
    >
      <IconButton icon="bold" label="Bold" size="sm" />
      <IconButton icon="italic" label="Italic" size="sm" />
      <IconButton icon="strikethrough" label="Strikethrough" size="sm" />
      <IconButton icon="link" label="Insert link" size="sm" />
      <IconButton icon="list-ordered" label="Numbered list" size="sm" />
      <IconButton icon="list" label="Bulleted list" size="sm" />
      <IconButton icon="quote" label="Quote" size="sm" />
      <IconButton icon="code" label="Code block" size="sm" />
    </div>
  );
}

export interface ComposerFormattingToggleProps {
  visible: boolean;
  onToggle: () => void;
}

/** Footer control that shows or hides the composer formatting toolbar. */
export function ComposerFormattingToggle({ visible, onToggle }: ComposerFormattingToggleProps) {
  return (
    <IconButton
      icon="paragraph"
      label={visible ? "Hide formatting toolbar" : "Show formatting toolbar"}
      size="sm"
      aria-pressed={visible}
      onClick={onToggle}
    />
  );
}
