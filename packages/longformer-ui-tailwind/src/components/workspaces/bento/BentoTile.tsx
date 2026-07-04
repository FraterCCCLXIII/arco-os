import { useCallback, useRef } from "react";
import { usePointerGesture } from "../../../surface-manager/usePointerGesture";
import { cx } from "../../../utils/cx";
import { WidgetRenderer } from "../desktop/WidgetRenderer";
import {
  applyResizeDelta,
  clampItemToGrid,
  canPlaceItem,
  deltaToGridSpan,
  gridMetricsFromElement,
  pointerToGridCell,
  resizeCursor,
  type BentoResizeHandle,
} from "./grid-utils";
import type { BentoItem } from "./types";
import styles from "./BentoTile.tailwind";

const RESIZE_HANDLES: BentoResizeHandle[] = ["n", "s", "e", "w", "nw", "ne", "sw", "se"];

export interface BentoTileProps {
  item: BentoItem;
  active?: boolean;
  onFocus: (id: string) => void;
  onMove: (id: string, next: Pick<BentoItem, "col" | "row">) => void;
  onResize: (id: string, next: Pick<BentoItem, "col" | "row" | "colSpan" | "rowSpan">) => void;
  gridRef: React.RefObject<HTMLElement | null>;
  allItems: BentoItem[];
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("button, a, input, textarea, select, [role='button'], [data-bento-no-drag]"));
}

function useResizeGesture(
  handle: BentoResizeHandle,
  item: BentoItem,
  startItemRef: React.MutableRefObject<BentoItem>,
  gridRef: React.RefObject<HTMLElement | null>,
  allItems: BentoItem[],
  onFocus: (id: string) => void,
  onResize: BentoTileProps["onResize"],
) {
  return usePointerGesture({
    cursor: resizeCursor(handle),
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
      const next = applyResizeDelta(start, dCol, dRow, handle);
      const candidate = clampItemToGrid({ ...start, ...next });

      if (canPlaceItem(candidate, allItems, item.id, metrics.cols)) {
        onResize(item.id, {
          col: candidate.col,
          row: candidate.row,
          colSpan: candidate.colSpan,
          rowSpan: candidate.rowSpan,
        });
      }
    },
  });
}

export function BentoTile({ item, active = false, onFocus, onMove, onResize, gridRef, allItems }: BentoTileProps) {
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

  const resizeN = useResizeGesture("n", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeS = useResizeGesture("s", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeE = useResizeGesture("e", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeW = useResizeGesture("w", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeNW = useResizeGesture("nw", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeNE = useResizeGesture("ne", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeSW = useResizeGesture("sw", item, startItemRef, gridRef, allItems, onFocus, onResize);
  const resizeSE = useResizeGesture("se", item, startItemRef, gridRef, allItems, onFocus, onResize);

  const resizeGestures: Record<BentoResizeHandle, ReturnType<typeof usePointerGesture>> = {
    n: resizeN,
    s: resizeS,
    e: resizeE,
    w: resizeW,
    nw: resizeNW,
    ne: resizeNE,
    sw: resizeSW,
    se: resizeSE,
  };

  const handleTilePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (isInteractiveTarget(event.target)) return;
      onFocus(item.id);
      dragGesture.onPointerDown(event);
    },
    [dragGesture, item.id, onFocus],
  );

  return (
    <article
      className={cx(styles.tile, active && styles.tileActive, dragGesture.active && styles.tileDragging)}
      style={{
        gridColumn: `${item.col} / span ${item.colSpan}`,
        gridRow: `${item.row} / span ${item.rowSpan}`,
      }}
      onPointerDown={handleTilePointerDown}
    >
      <div className={styles.content}>
        <WidgetRenderer content={item.content} />
      </div>

      {RESIZE_HANDLES.map((handle) => (
        <span
          key={handle}
          className={cx(styles.resizeHandle, styles[`handle${handle.toUpperCase()}`])}
          data-handle={handle}
          onPointerDown={resizeGestures[handle].onPointerDown}
        />
      ))}
    </article>
  );
}
