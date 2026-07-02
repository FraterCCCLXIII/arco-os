/**
 * HoverNavRail — reveals the workspace NavRail when the pointer rests on the
 * left edge, used while the Desktop workspace is in full-screen mode.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import styles from "./HoverNavRail.module.css";

const COLLAPSED_RAIL_WIDTH = 56;
const EXPANDED_RAIL_WIDTH = 208;

export interface HoverNavRailProps {
  /** When false the rail overlay is not rendered. */
  enabled?: boolean;
  /** Match the inline NavRail expanded state for overlay width. */
  expanded?: boolean;
  children: ReactNode;
  /** Fires when the hover rail opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/** Left-edge hover reveal for the workspace NavRail. */
export function HoverNavRail({
  enabled = true,
  expanded = false,
  children,
  onOpenChange,
}: HoverNavRailProps) {
  const [hovering, setHovering] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const railWidth = expanded ? EXPANDED_RAIL_WIDTH : COLLAPSED_RAIL_WIDTH;

  const dismiss = useCallback(() => {
    setHovering(false);
  }, []);

  useDismissLayer(hovering, dismiss, railRef);

  useEffect(() => {
    onOpenChange?.(enabled ? hovering : false);
  }, [enabled, hovering, onOpenChange]);

  useEffect(() => {
    if (!enabled) setHovering(false);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={cx(styles.wrapper, hovering && styles.wrapperOpen)} onMouseLeave={() => setHovering(false)}>
      <div className={styles.hoverZone} onMouseEnter={() => setHovering(true)} aria-hidden="true" />
      <div
        ref={railRef}
        className={cx(styles.railContainer, hovering && styles.railContainerOpen)}
        style={{ width: railWidth }}
      >
        <div className={styles.rail}>{children}</div>
      </div>
    </div>
  );
}
