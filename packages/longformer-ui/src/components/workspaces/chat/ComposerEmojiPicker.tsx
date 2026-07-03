import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { emojiCategories, filterEmojiCategories } from "./emoji-data";
import styles from "./ComposerEmojiPicker.module.css";

export interface ComposerEmojiPickerProps {
  disabled?: boolean;
  onSelect: (emoji: string) => void;
  className?: string;
}

function getPanelPosition(trigger: HTMLButtonElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  const panelWidth = 320;
  const left = Math.min(Math.max(12, rect.left), window.innerWidth - panelWidth - 12);

  return {
    bottom: window.innerHeight - rect.top + 8,
    left,
  };
}

/** Emoji trigger + searchable, scrollable popover for chat composers. */
export function ComposerEmojiPicker({ disabled = false, onSelect, className }: ComposerEmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(emojiCategories[0]?.id ?? "");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [panelStyle, setPanelStyle] = useState<{ bottom: number; left: number }>();

  const filteredCategories = useMemo(() => filterEmojiCategories(query), [query]);
  const showCategoryNav = query.trim().length === 0;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(undefined);
      return;
    }

    function updatePosition() {
      setPanelStyle(getPanelPosition(triggerRef.current));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    searchRef.current?.focus();
  }, [open]);

  function handleToggle() {
    if (disabled) return;
    setOpen((value) => !value);
  }

  function handleSelect(emoji: string) {
    onSelect(emoji);
    setOpen(false);
  }

  function scrollToCategory(categoryId: string) {
    setActiveCategoryId(categoryId);
    const container = scrollRef.current;
    const section = sectionRefs.current[categoryId];
    if (!container || !section) return;

    container.scrollTo({
      top: section.offsetTop - container.offsetTop,
      behavior: "smooth",
    });
  }

  function handleScroll() {
    if (!showCategoryNav) return;
    const container = scrollRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    let nextActive = emojiCategories[0]?.id ?? "";

    for (const category of emojiCategories) {
      const section = sectionRefs.current[category.id];
      if (!section) continue;
      if (section.offsetTop - container.offsetTop - 8 <= scrollTop) {
        nextActive = category.id;
      }
    }

    setActiveCategoryId(nextActive);
  }

  const resolvedPanelStyle = open ? panelStyle ?? getPanelPosition(triggerRef.current) : undefined;

  const panel =
    open && resolvedPanelStyle ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Emoji picker"
        className={styles.panel}
        style={{ bottom: resolvedPanelStyle.bottom, left: resolvedPanelStyle.left }}
      >
        <div className={styles.searchRow}>
          <Input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search emoji…"
            aria-label="Search emoji"
            className={styles.searchInput}
            startSlot={<Icon name="search" size={14} />}
            endSlot={
              query ? (
                <button
                  type="button"
                  className="lf-focusable"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <Icon name="close" size={12} />
                </button>
              ) : undefined
            }
          />
        </div>

        {showCategoryNav ? (
          <div className={styles.categories} role="tablist" aria-label="Emoji categories">
            {emojiCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategoryId === category.id}
                className={cx(
                  styles.categoryButton,
                  activeCategoryId === category.id && styles.categoryButtonActive,
                )}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        ) : null}

        <ScrollArea
          ref={scrollRef}
          className={styles.scroll}
          onScroll={handleScroll}
        >
          {filteredCategories.length === 0 ? (
            <div className={styles.empty}>No emoji match your search.</div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                ref={(node) => {
                  sectionRefs.current[category.id] = node;
                }}
                className={styles.section}
              >
                {showCategoryNav ? (
                  <h3 className={styles.sectionHeader}>{category.label}</h3>
                ) : null}
                <div className={styles.grid} role="list">
                  {category.emojis.map((entry) => (
                    <button
                      key={`${category.id}-${entry.emoji}`}
                      type="button"
                      role="listitem"
                      className={cx("lf-focusable", styles.emojiButton)}
                      aria-label={entry.keywords[0] ?? entry.emoji}
                      onClick={() => handleSelect(entry.emoji)}
                    >
                      {entry.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    ) : null;

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={cx("lf-focusable", styles.trigger)}
        aria-label="Insert emoji"
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span aria-hidden="true">😊</span>
      </button>

      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}

/** Inserts text at the textarea caret, or appends when no selection is available. */
export function insertTextAtCursor(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  insert: string,
  onChange: (next: string) => void,
) {
  const el = textareaRef.current;
  if (!el) {
    onChange(value + insert);
    return;
  }

  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;
  const next = value.slice(0, start) + insert + value.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    el.focus();
    const pos = start + insert.length;
    el.setSelectionRange(pos, pos);
  });
}
