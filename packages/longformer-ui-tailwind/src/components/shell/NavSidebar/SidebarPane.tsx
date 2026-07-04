import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { ResizablePane } from "../../primitives/ResizablePane";
import styles from "./SidebarPane.tailwind";

export interface SidebarPaneProps {
  children: ReactNode;
  width?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  handleLabel?: string;
  className?: string;
  paneClassName?: string;
}

/** Fixed-width left nav column — wraps sidebar content so NavSidebar can safely use width: 100%. */
export function SidebarPane({
  children,
  width,
  defaultWidth = 260,
  onWidthChange,
  minWidth = 220,
  maxWidth = 360,
  handleLabel = "Resize sidebar",
  className,
  paneClassName,
}: SidebarPaneProps) {
  return (
    <ResizablePane
      width={width}
      defaultWidth={defaultWidth}
      onWidthChange={onWidthChange}
      minWidth={minWidth}
      maxWidth={maxWidth}
      handleSide="right"
      className={cx(styles.resizable, className)}
      paneClassName={cx(styles.pane, paneClassName)}
      handleLabel={handleLabel}
    >
      {children}
    </ResizablePane>
  );
}
