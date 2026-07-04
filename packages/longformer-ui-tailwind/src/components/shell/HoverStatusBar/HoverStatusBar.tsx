/**
 * HoverStatusBar — reveals the simulated OS menu/status bar when the pointer
 * rests on the top edge, matching the bottom HoverAppTray interaction pattern.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import { getStatusBarHeight, StatusBar, type StatusBarProps } from "../../workspaces/desktop/StatusBar";
import styles from "./HoverStatusBar.tailwind";

export interface HoverStatusBarProps extends StatusBarProps {
  /** When false the bar is not rendered (e.g. while the Desktop workspace is active). */
  enabled?: boolean;
  /** Fires when the hover status bar opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

type BarPhase = "idle" | "peaked" | "open";

/** Narrow top-edge zone — pointer must sit at the very top of the viewport. */
const HOVER_ZONE_HEIGHT_PX = 4;
/** Hold time on the top edge before the bar fully reveals. */
const PEAK_DELAY_MS = 520;

/** Top-edge hover reveal for the desktop StatusBar chrome. */
export function HoverStatusBar({ enabled = true, className, onOpenChange, shell, ...statusBarProps }: HoverStatusBarProps) {
  const [phase, setPhase] = useState<BarPhase>("idle");
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const barRef = useRef<HTMLDivElement>(null);

  function clearOpenTimer() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }

  function handleHoverEnter() {
    if (phase !== "idle") return;

    setPhase("peaked");
    clearOpenTimer();
    openTimerRef.current = setTimeout(() => {
      setPhase("open");
    }, PEAK_DELAY_MS);
  }

  function handleHoverLeave() {
    clearOpenTimer();
    setPhase("idle");
  }

  const dismiss = useCallback(() => {
    clearOpenTimer();
    setPhase("idle");
  }, []);

  useDismissLayer(phase !== "idle", dismiss, barRef);

  useEffect(() => {
    onOpenChange?.(enabled && phase === "open");
  }, [enabled, phase, onOpenChange]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearOpenTimer();
      setPhase("idle");
    }
  }, [enabled]);

  useEffect(() => {
    const root = document.querySelector(".lf-app-root") as HTMLElement | null;
    if (!root) return;

    const offset = enabled && phase === "open" ? getStatusBarHeight(shell) : 0;
    root.style.setProperty("--lf-status-bar-offset", `${offset}px`);

    return () => {
      root.style.removeProperty("--lf-status-bar-offset");
    };
  }, [enabled, phase, shell]);

  if (!enabled) return null;

  return (
    <div
      className={cx(
        styles.wrapper,
        phase === "peaked" && styles.wrapperPeaked,
        phase === "open" && styles.wrapperOpen,
      )}
      onMouseLeave={handleHoverLeave}
    >
      <div
        className={styles.hoverZone}
        style={{ height: HOVER_ZONE_HEIGHT_PX }}
        onMouseEnter={handleHoverEnter}
        aria-hidden="true"
      />
      <div
        ref={barRef}
        className={cx(
          styles.barContainer,
          phase === "peaked" && styles.barContainerPeaked,
          phase === "open" && styles.barContainerOpen,
        )}
      >
        <div className={styles.peakLine} aria-hidden="true" />
        <StatusBar shell={shell} {...statusBarProps} className={cx(styles.bar, className)} />
      </div>
    </div>
  );
}
