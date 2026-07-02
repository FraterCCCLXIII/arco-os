import { cx } from "../../../utils/cx";
import { Textarea } from "../../primitives/Textarea";
import { IconButton } from "../../primitives/IconButton";
import styles from "./MessageComposer.module.css";

export interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A compact, pill-shaped composer for 1:1/group messaging threads — deliberately
 * lighter than the AI Chat `Composer` (no model picker), matching Messenger/iMessage/Skype.
 */
export function MessageComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Message…",
  disabled = false,
  className,
}: MessageComposerProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim().length > 0) onSubmit();
    }
  }

  return (
    <div className={cx(styles.composer, className)}>
      <IconButton icon="attach" label="Attach file" size="sm" />
      <div className={styles.textareaRow}>
        <Textarea
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxHeight={140}
          aria-label="Message"
        />
      </div>
      <IconButton icon="mic" label="Voice message" size="sm" />
      <IconButton
        icon="send"
        label="Send message"
        variant="primary"
        size="sm"
        disabled={disabled || value.trim().length === 0}
        onClick={onSubmit}
      />
    </div>
  );
}
