import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Textarea } from "../../primitives/Textarea";
import { IconButton } from "../../primitives/IconButton";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { Tabs, type TabItem } from "../../primitives/Tabs";
import { ComposerStatusBar } from "./ComposerStatusBar";
import type { UsageStats } from "./UsagePopover";
import styles from "./Composer.module.css";

export interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  model?: string;
  modelOptions?: MenuItemDescriptor[];
  /** Agent / Ask mode switch rendered inside the input controls. */
  navItems?: TabItem[];
  activeNavId?: string;
  onNavChange?: (id: string) => void;
  /** Extra row rendered below the controls, e.g. repo/branch selectors. */
  footer?: ReactNode;
  /** When set, renders a status bar with usage popover below the input. */
  usage?: UsageStats;
  thinkingLevel?: string;
  onPlanUsageClick?: () => void;
  className?: string;
  /** Styles the input surface card (border, radius, padding). */
  surfaceClassName?: string;
}

/** The chat input bar: auto-resizing textarea + attach/model/mic/send controls. */
export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask Longformer to build something…",
  disabled = false,
  model,
  modelOptions,
  navItems,
  activeNavId,
  onNavChange,
  footer,
  usage,
  thinkingLevel,
  onPlanUsageClick,
  className,
  surfaceClassName,
}: ComposerProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim().length > 0) onSubmit();
    }
  }

  const showModeTabs = navItems && navItems.length > 0 && activeNavId && onNavChange;

  return (
    <div className={cx(styles.stack, className)}>
      <div className={cx(styles.composer, surfaceClassName)}>
        <div className={styles.textareaRow}>
          <Textarea
            className={styles.textarea}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxHeight={220}
            aria-label="Message"
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlsLeft}>
            {showModeTabs ? (
              <Tabs
                className={styles.modeTabs}
                items={navItems}
                value={activeNavId}
                onChange={onNavChange}
                aria-label="Conversation mode"
              />
            ) : null}
            <IconButton icon="attach" label="Attach file" size="sm" />
            {model && modelOptions && (
              <Menu
                align="start"
                trigger={
                  <button type="button" className={styles.modelTrigger}>
                    {model}
                    <Icon name="chevron-down" size={13} />
                  </button>
                }
                items={modelOptions}
                aria-label="Choose model"
              />
            )}
          </div>
          <div className={styles.controlsRight}>
            <IconButton icon="mic" label="Voice input" size="sm" />
            <IconButton
              icon="send"
              label="Send message"
              variant="primary"
              size="sm"
              disabled={disabled || value.trim().length === 0}
              onClick={onSubmit}
            />
          </div>
        </div>
        {footer}
      </div>
      {usage && (
        <ComposerStatusBar
          model={model}
          thinkingLevel={thinkingLevel}
          usage={usage}
          onPlanUsageClick={onPlanUsageClick}
        />
      )}
    </div>
  );
}
