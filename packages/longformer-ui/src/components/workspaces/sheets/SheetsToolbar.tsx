import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Divider } from "../../primitives/Divider";
import { Tooltip } from "../../primitives/Tooltip";
import { Input } from "../../primitives/Input";
import { SHEETS_TOOLBAR_GROUPS } from "./types";
import styles from "./SheetsToolbar.module.css";

export interface SheetsToolbarProps {
  canUndo?: boolean;
  canRedo?: boolean;
  activeFormats?: ReadonlySet<string>;
  onToolAction?: (toolId: string) => void;
  className?: string;
}

function ToolbarButton({
  icon,
  label,
  pressed,
  disabled,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        className={cx("lf-focusable", styles.toolButton, pressed && styles.toolButtonPressed)}
        aria-label={label}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon name={icon} size={15} />
      </button>
    </Tooltip>
  );
}

/** Spreadsheet formatting toolbar — undo/redo, number formats, text styles, and alignment. */
export function SheetsToolbar({
  canUndo = true,
  canRedo = false,
  activeFormats,
  onToolAction,
  className,
}: SheetsToolbarProps) {
  const formats = activeFormats ?? new Set<string>();

  return (
    <div className={cx(styles.toolbar, className)} role="toolbar" aria-label="Spreadsheet formatting">
      <div className={styles.searchWrap}>
        <Input
          aria-label="Search menus"
          placeholder="Menus"
          startSlot={<Icon name="search" size={14} />}
          className={styles.searchInput}
          wrapperClassName={styles.searchField}
        />
      </div>

      <Divider orientation="vertical" />

      {SHEETS_TOOLBAR_GROUPS.map((group, groupIndex) => (
        <div key={group.id} className={styles.groupWrap}>
          <div className={styles.group}>
            {group.items.map((item) => (
              <ToolbarButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                pressed={formats.has(item.id)}
                disabled={
                  (item.id === "undo" && !canUndo) ||
                  (item.id === "redo" && !canRedo)
                }
                onClick={() => onToolAction?.(item.id)}
              />
            ))}
          </div>
          {groupIndex < SHEETS_TOOLBAR_GROUPS.length - 1 && <Divider orientation="vertical" />}
        </div>
      ))}

      <div className={styles.spacer} />

      <button type="button" className={cx("lf-focusable", styles.zoomTrigger)}>
        100%
        <Icon name="chevron-down" size={13} />
      </button>
    </div>
  );
}
