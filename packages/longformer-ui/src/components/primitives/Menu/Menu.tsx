import {
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import { Icon, type IconName } from "../../../icons";
import styles from "./Menu.module.css";

export interface MenuItemDescriptor {
  id: string;
  label: ReactNode;
  icon?: IconName;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separatorAbove?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  trigger: ReactElement;
  items: MenuItemDescriptor[];
  align?: "start" | "end";
  /** Which edge of the trigger the panel opens from. */
  side?: "top" | "bottom";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
}

/** A lightweight, dependency-free dropdown menu (model pickers, filters, row "more" menus). */
export function Menu({
  trigger,
  items,
  align = "start",
  side = "bottom",
  open: openProp,
  onOpenChange,
  ...aria
}: MenuProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  useDismissLayer(open, () => setOpen(false), wrapperRef);

  const enabledIds = useMemo(() => items.filter((item) => !item.disabled).map((item) => item.id), [items]);

  function select(item: MenuItemDescriptor) {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const dir = event.key === "ArrowDown" ? 1 : -1;
      const currentPos = enabledIds.indexOf(items[highlighted]?.id ?? enabledIds[0]);
      const nextPos = (currentPos + dir + enabledIds.length) % enabledIds.length;
      const nextId = enabledIds[nextPos];
      setHighlighted(items.findIndex((item) => item.id === nextId));
    } else if (event.key === "Enter") {
      const item = items[highlighted];
      if (item) select(item);
    }
  }

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (event: React.MouseEvent) => {
          (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(event);
          setOpen(!open);
        },
        "aria-haspopup": "menu",
        "aria-expanded": open,
      } as Partial<unknown>)
    : trigger;

  return (
    <div className={styles.wrapper} ref={wrapperRef} onKeyDown={handleKeyDown}>
      {triggerElement}
      {open && (
        <div
          role="menu"
          aria-label={aria["aria-label"]}
          className={cx(
            styles.panel,
            side === "top" ? styles.panelTop : styles.panelBottom,
            align === "end" ? styles.alignEnd : styles.alignStart,
          )}
        >
          {items.map((item, index) => (
            <div key={item.id}>
              {item.separatorAbove && <div className={styles.separator} role="separator" />}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cx(
                  styles.item,
                  item.danger && styles.itemDanger,
                  highlighted === index && styles.itemHighlighted
                )}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => select(item)}
              >
                {item.icon && (
                  <span className={styles.itemIcon}>
                    <Icon name={item.icon} size={15} />
                  </span>
                )}
                <span className={styles.itemLabel}>{item.label}</span>
                {item.shortcut && <span className={styles.itemShortcut}>{item.shortcut}</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
