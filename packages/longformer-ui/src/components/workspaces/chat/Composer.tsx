import { useMemo, useRef, type ReactNode } from "react";
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
import { ComposerEmojiPicker, insertTextAtCursor } from "./ComposerEmojiPicker";
import { ComposerAttachMenu, type ComposerDrawerToggle } from "./ComposerAttachMenu";
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
  /** Docked panel above the input surface — pair with `ComposerDrawer`. */
  drawer?: ReactNode;
  /** Docked banner below the input surface — pair with `ComposerNotice`. */
  notice?: ReactNode;
  /** When set, renders a status bar with usage popover below the input. */
  usage?: UsageStats;
  onPlanUsageClick?: () => void;
  className?: string;
  /** Styles the input surface card (border, radius, padding). */
  surfaceClassName?: string;
  /** Accessible name for the textarea; defaults to "Message". */
  inputAriaLabel?: string;
  /** Plus-button menu: attach files and toggle composer drawer panels. */
  onAddFile?: () => void;
  drawerToggles?: ComposerDrawerToggle[];
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
  drawer,
  notice,
  usage,
  onPlanUsageClick,
  className,
  surfaceClassName,
  inputAriaLabel = "Message",
  onAddFile,
  drawerToggles,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { visible: formattingToolbarVisible, toggle: toggleFormattingToolbar } =
    useComposerFormattingToolbar();

  function handleInsertEmoji(emoji: string) {
    insertTextAtCursor(textareaRef, value, emoji, onChange);
  }

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
      {drawer && <div className={styles.drawerSlot}>{drawer}</div>}
      <div className={cx(styles.composer, (drawer || notice) && styles.composerDocked, surfaceClassName)}>
        <ComposerFormattingToolbar
          visible={formattingToolbarVisible}
          className={styles.formattingToolbar}
        />
        <div className={styles.textareaRow}>
          <Textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxHeight={220}
            aria-label={inputAriaLabel}
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlsLeft}>
            <ComposerAttachMenu
              disabled={disabled}
              onAddFile={onAddFile}
              drawerToggles={drawerToggles}
            />
            <ComposerEmojiPicker disabled={disabled} onSelect={handleInsertEmoji} />
            <ComposerFormattingToggle
              visible={formattingToolbarVisible}
              onToggle={toggleFormattingToolbar}
            />
            {showModeMenu ? (
              <Menu
                align="start"
                side="top"
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
                side="top"
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
      {notice && <div className={styles.noticeSlot}>{notice}</div>}
      {usage && (
        <ComposerStatusBar usage={usage} onPlanUsageClick={onPlanUsageClick} />
      )}
    </div>
  );
}
