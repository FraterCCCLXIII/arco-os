import { useMemo, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Textarea } from "../../primitives/Textarea";
import { IconButton } from "../../primitives/IconButton";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import type { TabItem } from "../../primitives/Tabs";
import { ComposerStatusBar } from "./ComposerStatusBar";
import {
  ComposerFormattingToggle,
  ComposerFormattingToolbar,
} from "./ComposerFormattingToolbar";
import type { UsageStats } from "./UsagePopover";
import { useComposerFormattingToolbar } from "./useComposerFormattingToolbar";
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
  onPlanUsageClick,
  className,
  surfaceClassName,
}: ComposerProps) {
  const { visible: formattingToolbarVisible, toggle: toggleFormattingToolbar } =
    useComposerFormattingToolbar();

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim().length > 0) onSubmit();
    }
  }

  const showModeMenu = navItems && navItems.length > 0 && activeNavId && onNavChange;
  const activeModeLabel = navItems?.find((item) => item.id === activeNavId)?.label;
  const modeMenuItems = useMemo<MenuItemDescriptor[]>(
    () =>
      navItems?.map((item) => ({
        id: item.id,
        label: item.label,
        onSelect: () => onNavChange?.(item.id),
      })) ?? [],
    [navItems, onNavChange],
  );

  return (
    <div className={cx(styles.stack, className)}>
      <div className={cx(styles.composer, surfaceClassName)}>
        <ComposerFormattingToolbar
          visible={formattingToolbarVisible}
          className={styles.formattingToolbar}
        />
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
            <IconButton icon="plus" label="Attach file" size="sm" />
            <ComposerFormattingToggle
              visible={formattingToolbarVisible}
              onToggle={toggleFormattingToolbar}
            />
            {showModeMenu ? (
              <Menu
                align="start"
                trigger={
                  <button type="button" className={styles.modeTrigger}>
                    <span className={styles.modeLabel}>{activeModeLabel}</span>
                    <Icon name="chevron-down" size={13} />
                  </button>
                }
                items={modeMenuItems}
                aria-label="Conversation mode"
              />
            ) : null}
            {model && modelOptions && (
              <Menu
                align="start"
                trigger={
                  <button type="button" className={styles.modelTrigger}>
                    <span className={styles.modelLabel}>{model}</span>
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
        <ComposerStatusBar usage={usage} onPlanUsageClick={onPlanUsageClick} />
      )}
    </div>
  );
}
