import { useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "../../../icons";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import styles from "./WorkspacePicker.tailwind";

export interface WorkspacePickerOption {
  id: string;
  name: string;
  planLabel?: string;
  icon?: IconName;
}

export interface WorkspacePickerProps {
  value: string;
  options: WorkspacePickerOption[];
  onChange?: (id: string) => void;
  /** Icon shown when the selected option has no icon. */
  defaultIcon?: IconName;
  className?: string;
  side?: "top" | "bottom";
  "aria-label"?: string;
}

/** Team / workspace switcher for app headers and sidebars — icon, name, plan tag, and dropdown. */
export function WorkspacePicker({
  value,
  options,
  onChange,
  defaultIcon = "terminal",
  className,
  side = "bottom",
  "aria-label": ariaLabel = "Switch workspace",
}: WorkspacePickerProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.id === value) ?? options[0];

  useDismissLayer(open, () => setOpen(false), wrapperRef);

  function select(id: string) {
    onChange?.(id);
    setOpen(false);
  }

  function handleToggle() {
    setOpen((current) => !current);
    if (!open) {
      const selectedIndex = options.findIndex((option) => option.id === value);
      setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
        const selectedIndex = options.findIndex((option) => option.id === value);
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const dir = event.key === "ArrowDown" ? 1 : -1;
      setHighlighted((current) => (current + dir + options.length) % options.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[highlighted];
      if (option) select(option.id);
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlighted(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlighted(options.length - 1);
    }
  }

  if (!selected) return null;

  const triggerIcon = selected.icon ?? defaultIcon;

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={cx("lf-focusable", styles.trigger, open && styles.triggerOpen)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <span className={styles.triggerIcon}>
          <Icon name={triggerIcon} size={14} />
        </span>
        <span className={styles.triggerLabel}>
          <span className={styles.triggerName}>{selected.name}</span>
          {selected.planLabel && <span className={styles.planTag}>{selected.planLabel}</span>}
        </span>
        <span className={cx(styles.triggerChevron, open && styles.triggerChevronOpen)} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cx(styles.panel, side === "top" ? styles.panelTop : styles.panelBottom)}
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;
            const isHighlighted = highlighted === index;
            const optionIcon = option.icon ?? defaultIcon;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cx(
                  styles.item,
                  isSelected && styles.itemSelected,
                  isHighlighted && styles.itemHighlighted,
                )}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => select(option.id)}
              >
                <span className={styles.itemIcon}>
                  <Icon name={optionIcon} size={14} />
                </span>
                <span className={styles.itemBody}>
                  <span className={styles.itemName}>{option.name}</span>
                  {option.planLabel && <span className={styles.planTag}>{option.planLabel}</span>}
                </span>
                {isSelected && (
                  <span className={styles.itemCheck} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
