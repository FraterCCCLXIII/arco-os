import { useCallback, useRef } from "react";
import { Icon } from "../../../icons";
import { usePointerGesture } from "../../../surface-manager/usePointerGesture";
import { cx } from "../../../utils/cx";
import { WidgetRenderer } from "../desktop/WidgetRenderer";
import { clampItemToGrid, canPlaceItem, deltaToGridSpan, gridMetricsFromElement, pointerToGridCell } from "./grid-utils";
import type { BentoItem } from "./types";
import styles from "./BentoTile.module.css";

export interface BentoTileProps {
  item: BentoItem;
  active?: boolean;
  dragging?: boolean;
  onFocus: (id: string) => void;
  onMove: (id: string, next: Pick<BentoItem, "col" | "row">) => void;
  onResize: (id: string, next: Pick<BentoItem, "colSpan" | "rowSpan">) => void;
  gridRef: React.RefObject<HTMLElement | null>;
  allItems: BentoItem[];
}

export function BentoTile({
  item,
  active = false,
  dragging = false,
  onFocus,
  onMove,
  onResize,
  gridRef,
  allItems,
}: BentoTileProps) {
  const startItemRef = useRef(item);

  const dragGesture = usePointerGesture({
    cursor: "grabbing",
    onStart: () => {
      startItemRef.current = item;
      onFocus(item.id);
    },
    onMove: (_deltaX, _deltaY, event) => {
      const grid = gridRef.current;
      if (!grid) return;

      const metrics = gridMetricsFromElement(grid);
      const gridRect = grid.getBoundingClientRect();
      const { col, row } = pointerToGridCell(event.clientX, event.clientY, gridRect, metrics);
      const start = startItemRef.current;
      const candidate = clampItemToGrid({
        ...start,
        col: col - Math.floor(start.colSpan / 2),
        row: row - Math.floor(start.rowSpan / 2),
      });

      if (canPlaceItem(candidate, allItems, item.id, metrics.cols)) {
        onMove(item.id, { col: candidate.col, row: candidate.row });
      }
    },
  });

  const resizeGesture = usePointerGesture({
    cursor: "nwse-resize",
    onStart: () => {
      startItemRef.current = item;
      onFocus(item.id);
    },
    onMove: (deltaX, deltaY) => {
      const grid = gridRef.current;
      if (!grid) return;

      const metrics = gridMetricsFromElement(grid);
      const { dCol, dRow } = deltaToGridSpan(deltaX, deltaY, metrics);
      const start = startItemRef.current;
      const candidate = clampItemToGrid({
        ...start,
        colSpan: start.colSpan + dCol,
        rowSpan: start.rowSpan + dRow,
      });

      if (canPlaceItem(candidate, allItems, item.id, metrics.cols)) {
        onResize(item.id, { colSpan: candidate.colSpan, rowSpan: candidate.rowSpan });
      }
    },
  });

  const handleTilePointerDown = useCallback(() => {
    onFocus(item.id);
  }, [item.id, onFocus]);

  return (
    <article
      className={cx(styles.tile, active && styles.tileActive, dragging && styles.tileDragging)}
      style={{
        gridColumn: `${item.col} / span ${item.colSpan}`,
        gridRow: `${item.row} / span ${item.rowSpan}`,
      }}
      onPointerDown={handleTilePointerDown}
    >
      <header className={styles.header}>
        <button
          type="button"
          className={cx("lf-focusable", styles.dragHandle)}
          aria-label={`Move ${item.label}`}
          onPointerDown={dragGesture.onPointerDown}
        >
          <Icon name="more-vertical" size={14} />
          <span className={styles.label}>{item.label}</span>
        </button>
      </header>

      <div className={styles.content}>
        <WidgetRenderer content={item.content} />
      </div>

      <button
        type="button"
        className={cx("lf-focusable", styles.resizeHandle)}
        aria-label={`Resize ${item.label}`}
        onPointerDown={resizeGesture.onPointerDown}
      />
    </article>
  );
}
