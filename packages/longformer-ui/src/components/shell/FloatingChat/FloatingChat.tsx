/**
 * Floating chat launcher — a bottom-right FAB that opens a centered chat panel
 * anchored above the bottom edge, usable from any workspace without the side rail.
 */
import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { ConversationPanel, type ConversationPanelProps } from "../../workspaces/chat/ConversationPanel";
import styles from "./FloatingChat.module.css";

export interface FloatingChatProps extends Omit<ConversationPanelProps, "onClose"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Lift the chat when the bottom app drawer is open. */
  appDrawerOpen?: boolean;
  /** Optional label for the launcher control. */
  launcherLabel?: string;
  className?: string;
  /** Override the default centered panel content. */
  children?: ReactNode;
}

/** Bottom-right chat bubble that expands into a centered floating conversation panel. */
export function FloatingChat({
  open,
  onOpenChange,
  appDrawerOpen = false,
  launcherLabel = "Open chat",
  className,
  children,
  ...panelProps
}: FloatingChatProps) {
  const raised = appDrawerOpen;

  return (
    <>
      {open && (
        <div className={cx(styles.panelAnchor, raised && styles.panelAnchorRaised)} role="presentation">
          <div className={styles.panel}>
            {children ?? (
              <ConversationPanel {...panelProps} chromeless emptyStateHeading={panelProps.emptyStateHeading ?? ""} />
            )}
          </div>
        </div>
      )}

      <div className={cx(styles.root, raised && styles.rootRaised, className)}>
        <button
          type="button"
          className={cx(styles.launcher, "lf-focusable", open && styles.launcherOpen)}
          aria-label={open ? "Close chat" : launcherLabel}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => onOpenChange(!open)}
        >
          <Icon name={open ? "close" : "chat"} size={22} />
        </button>
      </div>
    </>
  );
}
