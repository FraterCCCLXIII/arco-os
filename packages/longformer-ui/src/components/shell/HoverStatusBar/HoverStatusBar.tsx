/**
 * HoverStatusBar — reveals the simulated OS menu/status bar when the pointer
 * nears the top edge, matching the bottom HoverAppTray interaction pattern.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import { getStatusBarHeight, StatusBar, type StatusBarProps } from "../../workspaces/desktop/StatusBar";
import styles from "./HoverStatusBar.module.css";

export interface HoverStatusBarProps extends StatusBarProps {
  /** When false the bar is not rendered (e.g. while the Desktop workspace is active). */
  enabled?: boolean;
  /** Fires when the hover status bar opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/** Top-edge hover reveal for the desktop StatusBar chrome. */
export function HoverStatusBar({ enabled = true, className, onOpenChange, shell, ...statusBarProps }: HoverStatusBarProps) {
  const [hovering, setHovering] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setHovering(false);
  }, []);

  useDismissLayer(hovering, dismiss, barRef);

  useEffect(() => {
    onOpenChange?.(enabled ? hovering : false);
  }, [enabled, hovering, onOpenChange]);

  useEffect(() => {
    if (!enabled) setHovering(false);
  }, [enabled]);

  useEffect(() => {
    const root = document.querySelector(".lf-app-root") as HTMLElement | null;
    if (!root) return;

    const offset = enabled && hovering ? getStatusBarHeight(shell) : 0;
    root.style.setProperty("--lf-status-bar-offset", `${offset}px`);

    return () => {
      root.style.removeProperty("--lf-status-bar-offset");
    };
  }, [enabled, hovering, shell]);

  if (!enabled) return null;

  return (
    <div className={cx(styles.wrapper, hovering && styles.wrapperOpen)} onMouseLeave={() => setHovering(false)}>
      <div className={styles.hoverZone} onMouseEnter={() => setHovering(true)} aria-hidden="true" />
      <div ref={barRef} className={cx(styles.barContainer, hovering && styles.barContainerOpen)}>
        <StatusBar shell={shell} {...statusBarProps} className={cx(styles.bar, className)} />
      </div>
    </div>
  );
}
