import { useMemo, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { useColumnResize } from "../../../utils/useColumnResize";
import { ResizeHandle } from "../ResizeHandle";
import styles from "./ResizablePane.module.css";

export interface ResizablePaneProps {
  children: ReactNode;
  /** Controlled width in pixels. */
  width?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  /** Which edge shows the drag grip. */
  handleSide?: "left" | "right";
  collapsed?: boolean;
  /** When false, pane content can extend outside bounds (e.g. dropdown menus). */
  clipOverflow?: boolean;
  className?: string;
  paneClassName?: string;
  handleLabel?: string;
  handleClassName?: string;
}

/** A fixed-width column with an adjacent resize grip — used in shell panes and workspace splits. */
export function ResizablePane({
  children,
  width: widthProp,
  defaultWidth = 260,
  onWidthChange,
  minWidth = 180,
  maxWidth = 520,
  handleSide = "right",
  collapsed = false,
  clipOverflow = true,
  className,
  paneClassName,
  handleLabel,
  handleClassName,
}: ResizablePaneProps) {
  const [internalWidth, setInternalWidth] = useState(defaultWidth);
  const width = widthProp ?? internalWidth;

  const setWidth = useMemo(
    () => onWidthChange ?? setInternalWidth,
    [onWidthChange],
  );

  const { onPointerDown, isResizing } = useColumnResize({
    value: width,
    onChange: setWidth,
    min: minWidth,
    max: maxWidth,
    handleSide,
    disabled: collapsed,
  });

  if (collapsed) return null;

  return (
    <div
      className={cx(styles.wrapper, handleSide === "left" && styles.handleLeft, className)}
      style={{ width: `min(100%, ${width}px)` }}
    >
      {handleSide === "left" && (
        <ResizeHandle
          onPointerDown={onPointerDown}
          active={isResizing}
          label={handleLabel ?? "Resize panel"}
          className={handleClassName}
        />
      )}
      <div className={cx(styles.pane, !clipOverflow && styles.paneOverflowVisible, paneClassName)}>{children}</div>
      {handleSide === "right" && (
        <ResizeHandle
          onPointerDown={onPointerDown}
          active={isResizing}
          label={handleLabel ?? "Resize panel"}
          className={handleClassName}
        />
      )}
    </div>
  );
}
