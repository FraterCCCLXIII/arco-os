import { IconButton } from "../../primitives/IconButton";
import { RichTextEditor, type RichTextContent } from "./RichTextEditor";

export type { RichTextContent as EmailBodyContent };

export interface EmailReplyComposerProps {
  placeholder?: string;
  onSend?: (content: RichTextContent) => void;
  className?: string;
}

/** Gmail-style reply surface with a wired rich text editor and formatting toolbar. */
export function EmailReplyComposer({
  placeholder = "Write a reply…",
  onSend,
  className,
}: EmailReplyComposerProps) {
  return (
    <RichTextEditor
      className={className}
      placeholder={placeholder}
      ariaLabel="Reply body"
      sendLabel="Send reply"
      onSend={onSend}
      footerActions={<IconButton icon="attach" label="Attach file" size="sm" />}
    />
  );
}
