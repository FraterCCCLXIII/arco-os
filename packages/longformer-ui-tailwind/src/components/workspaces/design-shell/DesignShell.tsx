import type { ReactNode } from "react";
import type { IconName } from "../../../icons";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../primitives/IconButton";
import shellStyles from "./DesignShell.tailwind";

export interface ToolDockItem {
  id: string;
  label: string;
  icon: IconName;
  /** Optional swatch shown instead of an icon (e.g. marker color). */
  swatch?: string;
}

export interface ToolDockProps {
  items: ToolDockItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Insert a divider before these item indices. */
  dividersBefore?: number[];
  trailing?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/** Floating bottom tool dock shared by design workspaces. */
export function ToolDock({
  items,
  activeId,
  onSelect,
  dividersBefore = [],
  trailing,
  className,
  ...aria
}: ToolDockProps) {
  const dividerSet = new Set(dividersBefore);

  return (
    <div className={cx(shellStyles.toolDock, className)} role="toolbar" aria-label={aria["aria-label"]}>
      <div className={shellStyles.toolDockGroup}>
        {items.map((item, index) => (
          <span key={item.id} style={{ display: "contents" }}>
            {dividerSet.has(index) ? <span className={shellStyles.toolDockDivider} aria-hidden /> : null}
            {item.swatch ? (
              <button
                type="button"
                className={cx(
                  "lf-focusable",
                  shellStyles.fillSwatch,
                  activeId === item.id && shellStyles.toolDockActive,
                )}
                style={{ background: item.swatch, width: 32, height: 32, marginTop: 0 }}
                aria-label={item.label}
                aria-pressed={activeId === item.id}
                title={item.label}
                onClick={() => onSelect(item.id)}
              />
            ) : (
              <IconButton
                icon={item.icon}
                label={item.label}
                variant={activeId === item.id ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={activeId === item.id}
                onClick={() => onSelect(item.id)}
              />
            )}
          </span>
        ))}
      </div>
      {trailing ? (
        <>
          <span className={shellStyles.toolDockDivider} aria-hidden />
          {trailing}
        </>
      ) : null}
    </div>
  );
}

export interface CanvasRulersProps {
  horizontalTicks: (string | number)[];
  verticalTicks: (string | number)[];
  children: ReactNode;
  canvasClassName?: string;
}

/** Canvas region with horizontal and vertical ruler chrome. */
export function CanvasRulers({ horizontalTicks, verticalTicks, children, canvasClassName }: CanvasRulersProps) {
  return (
    <div className={shellStyles.canvasArea}>
      <div className={shellStyles.rulerRow}>
        <div className={shellStyles.rulerCorner} />
        <div className={shellStyles.rulerHorizontal} aria-hidden>
          {horizontalTicks.map((tick, index) => (
            <span
              key={`${tick}-${index}`}
              className={cx(shellStyles.rulerTick, shellStyles.rulerTickH)}
              style={{ left: `${6 + index * (84 / Math.max(horizontalTicks.length - 1, 1))}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
      <div className={shellStyles.canvasRow}>
        <div className={shellStyles.rulerVertical} aria-hidden>
          {verticalTicks.map((tick, index) => (
            <span
              key={`${tick}-${index}`}
              className={cx(shellStyles.rulerTick, shellStyles.rulerTickV)}
              style={{ top: `${6 + index * (84 / Math.max(verticalTicks.length - 1, 1))}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div className={cx(shellStyles.canvas, canvasClassName)}>{children}</div>
      </div>
    </div>
  );
}

export interface SideListProps {
  items: { id: string; label: string; prefix?: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  "aria-label": string;
}

/** Scrollable selectable list for pages, layers, or history. */
export function SideList({ items, activeId, onSelect, "aria-label": ariaLabel }: SideListProps) {
  return (
    <div className={shellStyles.sectionBody} role="listbox" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="option"
          aria-selected={activeId === item.id}
          className={cx(shellStyles.listItem, activeId === item.id && shellStyles.listItemActive)}
          onClick={() => onSelect(item.id)}
        >
          {item.prefix ? <span aria-hidden>{item.prefix}</span> : null}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { shellStyles as designShellStyles };
