import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import type { TabItem } from "../../primitives/Tabs";
import { ComposerAttachMenu, type ComposerDrawerToggle } from "./ComposerAttachMenu";
import { ComposerEmojiPicker } from "./ComposerEmojiPicker";
import { ComposerFormattingToggle } from "./ComposerFormattingToolbar";
import styles from "./ComposerControlsRow.tailwind";

type ControlId = "attach" | "emoji" | "formatting" | "mode" | "model";

interface ScrollFade {
  left: boolean;
  right: boolean;
}

const CONTROL_GAP = 4;
const OVERFLOW_DOCK_WIDTH = 36;

export interface ComposerControlsRowProps {
  disabled?: boolean;
  onAddFile?: () => void;
  drawerToggles?: ComposerDrawerToggle[];
  onInsertEmoji: (emoji: string) => void;
  formattingVisible: boolean;
  onToggleFormatting: () => void;
  navItems?: TabItem[];
  activeNavId?: string;
  onNavChange?: (id: string) => void;
  model?: string;
  modelOptions?: MenuItemDescriptor[];
  onSubmit: () => void;
  canSubmit: boolean;
  sendButton?: ReactNode;
}

/** Single-row composer controls: scrollable left actions, overflow menu, docked send/mic. */
export function ComposerControlsRow({
  disabled = false,
  onAddFile,
  drawerToggles,
  onInsertEmoji,
  formattingVisible,
  onToggleFormatting,
  navItems,
  activeNavId,
  onNavChange,
  model,
  modelOptions,
  onSubmit,
  canSubmit,
  sendButton,
}: ComposerControlsRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Partial<Record<ControlId, HTMLDivElement | null>>>({});
  const itemWidthsRef = useRef<Partial<Record<ControlId, number>>>({});
  const [overflowIds, setOverflowIds] = useState<ControlId[]>([]);
  const [scrollFade, setScrollFade] = useState<ScrollFade>({ left: false, right: false });

  const showModeMenu = Boolean(navItems && navItems.length > 0 && activeNavId && onNavChange);
  const activeModeLabel = navItems?.find((item) => item.id === activeNavId)?.label;
  const showModelMenu = Boolean(model && modelOptions);

  const modeMenuItems = useMemo<MenuItemDescriptor[]>(
    () =>
      navItems?.map((item) => ({
        id: item.id,
        label: item.label,
        onSelect: () => onNavChange?.(item.id),
      })) ?? [],
    [navItems, onNavChange],
  );

  const controlIds = useMemo<ControlId[]>(() => {
    const ids: ControlId[] = ["attach", "emoji", "formatting"];
    if (showModeMenu) ids.push("mode");
    if (showModelMenu) ids.push("model");
    return ids;
  }, [showModeMenu, showModelMenu]);

  const updateScrollFade = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const hasOverflow = element.scrollWidth > element.clientWidth + 1;
    setScrollFade({
      left: hasOverflow && element.scrollLeft > 4,
      right: hasOverflow && element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    });
  }, []);

  const measureOverflow = useCallback(() => {
    const row = rowRef.current;
    const right = rightRef.current;
    if (!row || !right) return;

    controlIds.forEach((id) => {
      const element = itemRefs.current[id];
      if (element && element.offsetWidth > 0) {
        itemWidthsRef.current[id] = element.offsetWidth;
      }
    });

    const rowGap = 8;
    const maxLeftWidth = Math.max(0, row.clientWidth - right.offsetWidth - rowGap);

    function widthFor(ids: ControlId[], reserveOverflowDock: boolean) {
      let total = reserveOverflowDock ? OVERFLOW_DOCK_WIDTH : 0;
      ids.forEach((id, index) => {
        total += itemWidthsRef.current[id] ?? 0;
        if (index > 0) total += CONTROL_GAP;
      });
      return total;
    }

    let hidden: ControlId[] = [];
    let visible = [...controlIds];

    while (visible.length > 0 && widthFor(visible, hidden.length > 0) > maxLeftWidth) {
      const removed = visible.pop();
      if (!removed) break;
      hidden.unshift(removed);
    }

    if (hidden.length > 0 && widthFor(visible, true) > maxLeftWidth) {
      while (visible.length > 0 && widthFor(visible, true) > maxLeftWidth) {
        const removed = visible.pop();
        if (!removed) break;
        hidden.unshift(removed);
      }
    }

    setOverflowIds((current) =>
      current.length === hidden.length && current.every((id, index) => id === hidden[index])
        ? current
        : hidden,
    );
    updateScrollFade();
  }, [controlIds, updateScrollFade]);

  useLayoutEffect(() => {
    measureOverflow();
  }, [measureOverflow, formattingVisible, activeModeLabel, model, disabled]);

  useEffect(() => {
    const row = rowRef.current;
    const scroller = scrollRef.current;
    if (!row) return;

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(row);
    if (scroller?.firstElementChild) {
      observer.observe(scroller.firstElementChild);
    }

    return () => observer.disconnect();
  }, [controlIds.length, measureOverflow]);

  const overflowMenuItems = useMemo<MenuItemDescriptor[]>(() => {
    const items: MenuItemDescriptor[] = [];

    if (overflowIds.includes("attach")) {
      if (onAddFile) {
        items.push({
          id: "overflow-attach-file",
          label: "Add File",
          icon: "attach",
          onSelect: onAddFile,
        });
      }
      drawerToggles?.forEach((toggle) => {
        items.push({
          id: `overflow-panel-${toggle.id}`,
          label: toggle.label,
          onSelect: () => toggle.onVisibleChange(!toggle.visible),
        });
      });
    }

    if (overflowIds.includes("emoji")) {
      items.push({
        id: "overflow-emoji",
        label: "Insert emoji",
        separatorAbove: items.length > 0,
        onSelect: () => {
          itemRefs.current.emoji?.querySelector<HTMLButtonElement>("button")?.click();
        },
      });
    }

    if (overflowIds.includes("formatting")) {
      items.push({
        id: "overflow-formatting",
        label: formattingVisible ? "Hide formatting toolbar" : "Show formatting toolbar",
        icon: "paragraph",
        separatorAbove: items.length > 0,
        onSelect: onToggleFormatting,
      });
    }

    if (overflowIds.includes("mode") && modeMenuItems.length > 0) {
      modeMenuItems.forEach((item, index) => {
        items.push({
          ...item,
          id: `overflow-mode-${item.id}`,
          separatorAbove: items.length > 0 && index === 0,
        });
      });
    }

    if (overflowIds.includes("model") && modelOptions && modelOptions.length > 0) {
      modelOptions.forEach((item, index) => {
        items.push({
          ...item,
          id: `overflow-model-${item.id}`,
          separatorAbove: items.length > 0 && index === 0,
        });
      });
    }

    return items;
  }, [
    overflowIds,
    onAddFile,
    drawerToggles,
    formattingVisible,
    onToggleFormatting,
    modeMenuItems,
    modelOptions,
  ]);

  const showOverflowDock = overflowIds.length > 0 && overflowMenuItems.length > 0;

  function setItemRef(id: ControlId) {
    return (node: HTMLDivElement | null) => {
      itemRefs.current[id] = node;
    };
  }

  return (
    <div ref={rowRef} className={styles.controls}>
      <div
        className={cx(styles.controlsLeft, showOverflowDock && styles.controlsLeftWithOverflow)}
        data-overflow-left={scrollFade.left || undefined}
        data-overflow-right={scrollFade.right || undefined}
      >
        {scrollFade.left ? <span className={cx(styles.fade, styles.fadeLeft)} aria-hidden="true" /> : null}

        <div
          ref={scrollRef}
          className={cx("lf-scrollbar-hidden", styles.scroller)}
          onScroll={updateScrollFade}
        >
          <div className={styles.track}>
            <div
              ref={setItemRef("attach")}
              className={cx(
                styles.controlItem,
                overflowIds.includes("attach") && styles.controlItemHidden,
              )}
              data-control-id="attach"
              aria-hidden={overflowIds.includes("attach") || undefined}
            >
              <ComposerAttachMenu
                disabled={disabled}
                onAddFile={onAddFile}
                drawerToggles={drawerToggles}
              />
            </div>
            <div
              ref={setItemRef("emoji")}
              className={cx(
                styles.controlItem,
                overflowIds.includes("emoji") && styles.controlItemHidden,
              )}
              data-control-id="emoji"
              aria-hidden={overflowIds.includes("emoji") || undefined}
            >
              <ComposerEmojiPicker disabled={disabled} onSelect={onInsertEmoji} />
            </div>
            <div
              ref={setItemRef("formatting")}
              className={cx(
                styles.controlItem,
                overflowIds.includes("formatting") && styles.controlItemHidden,
              )}
              data-control-id="formatting"
              aria-hidden={overflowIds.includes("formatting") || undefined}
            >
              <ComposerFormattingToggle
                visible={formattingVisible}
                onToggle={onToggleFormatting}
              />
            </div>
            {showModeMenu ? (
              <div
                ref={setItemRef("mode")}
                className={cx(
                  styles.controlItem,
                  overflowIds.includes("mode") && styles.controlItemHidden,
                )}
                data-control-id="mode"
                aria-hidden={overflowIds.includes("mode") || undefined}
              >
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
              </div>
            ) : null}
            {showModelMenu ? (
              <div
                ref={setItemRef("model")}
                className={cx(
                  styles.controlItem,
                  overflowIds.includes("model") && styles.controlItemHidden,
                )}
                data-control-id="model"
                aria-hidden={overflowIds.includes("model") || undefined}
              >
                <Menu
                  align="start"
                  side="top"
                  trigger={
                    <button type="button" className={styles.modelTrigger}>
                      <span className={styles.modelLabel}>{model}</span>
                      <Icon name="chevron-down" size={13} />
                    </button>
                  }
                  items={modelOptions ?? []}
                  aria-label="Choose model"
                />
              </div>
            ) : null}
          </div>
        </div>

        {showOverflowDock ? (
          <div className={styles.overflowDock}>
            <span className={styles.overflowDockFade} aria-hidden="true" />
            <Menu
              side="top"
              align="end"
              aria-label="More composer actions"
              items={overflowMenuItems}
              trigger={
                <IconButton
                  icon="more-horizontal"
                  label="More actions"
                  size="sm"
                  aria-haspopup="menu"
                />
              }
            />
          </div>
        ) : null}

        {scrollFade.right && !showOverflowDock ? (
          <span className={cx(styles.fade, styles.fadeRight)} aria-hidden="true" />
        ) : null}
      </div>

      <div ref={rightRef} className={styles.controlsRight}>
        <IconButton icon="mic" label="Voice input" size="sm" />
        {sendButton ?? (
          <IconButton
            icon="send"
            label="Send message"
            variant="primary"
            size="sm"
            disabled={disabled || !canSubmit}
            onClick={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
