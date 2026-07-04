import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import { TaskTray, type TaskTrayProps } from "../../workspaces/desktop/TaskTray";
import styles from "./HoverAppTray.tailwind";

export interface HoverAppTrayProps extends TaskTrayProps {
  /** When false the tray is not rendered (e.g. while the Desktop workspace is active). */
  enabled?: boolean;
  /** Fires when the hover drawer opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

type TrayPhase = "idle" | "peaked" | "open";

const PEAK_DELAY_MS = 480;

/**
 * A bottom-edge hover reveal that surfaces the same `TaskTray` used on the
 * simulated desktop — peeks up first, pauses, then slides fully open.
 */
export function HoverAppTray({ enabled = true, className, onOpenChange, ...trayProps }: HoverAppTrayProps) {
  const [phase, setPhase] = useState<TrayPhase>("idle");
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(enabled && phase === "open");
  }, [enabled, phase, onOpenChange]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      setPhase("idle");
    }
  }, [enabled]);

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

  useDismissLayer(phase !== "idle", dismiss, trayRef);

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
      <div className={styles.hoverZone} onMouseEnter={handleHoverEnter} aria-hidden="true" />
      <div
        ref={trayRef}
        className={cx(
          styles.trayContainer,
          phase === "peaked" && styles.trayContainerPeaked,
          phase === "open" && styles.trayContainerOpen,
        )}
      >
        <div className={styles.peakHandle} aria-hidden="true" />
        <TaskTray {...trayProps} floating className={className} />
      </div>
    </div>
  );
}
