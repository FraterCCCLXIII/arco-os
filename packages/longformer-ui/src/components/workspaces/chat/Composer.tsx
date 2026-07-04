import { useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Textarea } from "../../primitives/Textarea";
import { type MenuItemDescriptor } from "../../primitives/Menu";
import type { TabItem } from "../../primitives/Tabs";
import { ComposerStatusBar } from "./ComposerStatusBar";
import { ComposerFormattingToolbar } from "./ComposerFormattingToolbar";
import { insertTextAtCursor } from "./ComposerEmojiPicker";
import { type ComposerDrawerToggle } from "./ComposerAttachMenu";
import { ComposerControlsRow } from "./ComposerControlsRow";
import { ComposerTypeahead } from "./ComposerTypeahead";
import { filterTypeaheadItems, type ComposerTypeaheadItem } from "./ComposerTypeahead.types";
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
  /** Full-text suggestions shown in a bottom drawer while typing. */
  typeaheadItems?: ComposerTypeaheadItem[];
  typeaheadMinLength?: number;
  onTypeaheadSelect?: (item: ComposerTypeaheadItem) => void;
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
  typeaheadItems,
  typeaheadMinLength = 12,
  onTypeaheadSelect,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTypeaheadIndex, setActiveTypeaheadIndex] = useState(-1);
  const { visible: formattingToolbarVisible, toggle: toggleFormattingToolbar } =
    useComposerFormattingToolbar();

  const visibleTypeaheadItems = useMemo(() => {
    if (!typeaheadItems?.length || value.trim().length < typeaheadMinLength) return [];
    return filterTypeaheadItems(value, typeaheadItems);
  }, [typeaheadItems, typeaheadMinLength, value]);

  const typeaheadOpen = visibleTypeaheadItems.length > 0;

  function handleTypeaheadSelect(item: ComposerTypeaheadItem) {
    if (onTypeaheadSelect) {
      onTypeaheadSelect(item);
    } else {
      onChange(item.text);
    }
    setActiveTypeaheadIndex(-1);
    textareaRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (typeaheadOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveTypeaheadIndex((prev) => (prev + 1) % visibleTypeaheadItems.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveTypeaheadIndex((prev) =>
          prev <= 0 ? visibleTypeaheadItems.length - 1 : prev - 1,
        );
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveTypeaheadIndex(-1);
        return;
      }
      if (event.key === "Enter" && !event.shiftKey && activeTypeaheadIndex >= 0) {
        event.preventDefault();
        const item = visibleTypeaheadItems[activeTypeaheadIndex];
        if (item) handleTypeaheadSelect(item);
        return;
      }
      if (event.key === "Tab" && !event.shiftKey && activeTypeaheadIndex >= 0) {
        event.preventDefault();
        const item = visibleTypeaheadItems[activeTypeaheadIndex];
        if (item) handleTypeaheadSelect(item);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim().length > 0) onSubmit();
    }
  }

  function handleChange(nextValue: string) {
    onChange(nextValue);
    setActiveTypeaheadIndex(-1);
  }

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
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxHeight={220}
            aria-label={inputAriaLabel}
          />
        </div>
        <ComposerControlsRow
          disabled={disabled}
          onAddFile={onAddFile}
          drawerToggles={drawerToggles}
          onInsertEmoji={(emoji) => insertTextAtCursor(textareaRef, value, emoji, onChange)}
          formattingVisible={formattingToolbarVisible}
          onToggleFormatting={toggleFormattingToolbar}
          navItems={navItems}
          activeNavId={activeNavId}
          onNavChange={onNavChange}
          model={model}
          modelOptions={modelOptions}
          onSubmit={onSubmit}
          canSubmit={value.trim().length > 0}
        />
        {typeaheadOpen ? (
          <ComposerTypeahead
            value={value}
            items={visibleTypeaheadItems}
            activeIndex={activeTypeaheadIndex}
            onSelect={handleTypeaheadSelect}
          />
        ) : null}
        {footer}
      </div>
      {notice && <div className={styles.noticeSlot}>{notice}</div>}
      {usage && (
        <ComposerStatusBar usage={usage} onPlanUsageClick={onPlanUsageClick} />
      )}
    </div>
  );
}
