import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { computeZIndex, type SurfaceWindow } from "../../../surface-manager";
import { WindowFrame } from "./WindowFrame";
import type { DesktopShell } from "./types";
import styles from "./MobileWindowCarousel.tailwind";

export interface MobileWindowCarouselProps {
  shell: DesktopShell;
  windows: SurfaceWindow[];
  activeWindowId?: string;
  onFocusWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  onMinimizeWindow: (windowId: string) => void;
  renderWindowContent?: (window: SurfaceWindow) => ReactNode;
  getTransitionClassName?: (windowId: string) => string | undefined;
  onRequestClose?: (window: SurfaceWindow) => void;
  onRequestMinimize?: (window: SurfaceWindow) => void;
  onShowHome?: () => void;
}

function nearestSlideIndex(track: HTMLElement): number {
  const slides = Array.from(track.querySelectorAll<HTMLElement>(`[data-carousel-slide="true"]`));
  if (slides.length === 0) return 0;

  const center = track.scrollLeft + track.clientWidth / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(slideCenter - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

/** Horizontal, scroll-snapping carousel for iOS/Android phone windows. */
export function MobileWindowCarousel({
  shell,
  windows,
  activeWindowId,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  renderWindowContent,
  getTransitionClassName,
  onRequestClose,
  onRequestMinimize,
  onShowHome,
}: MobileWindowCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScroll: number } | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const snapToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const slide = track.querySelector<HTMLElement>(`[data-carousel-slide-index="${index}"]`);
      if (!slide) return;

      slide.scrollIntoView({ behavior, inline: "center", block: "nearest" });
      const window = windows[index];
      if (window && window.id !== activeWindowId) {
        onFocusWindow(window.id);
      }
    },
    [activeWindowId, onFocusWindow, windows],
  );

  const snapToNearest = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      snapToIndex(nearestSlideIndex(track), behavior);
    },
    [snapToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || windows.length === 0) return;

    const activeIndex = Math.max(
      0,
      windows.findIndex((window) => window.id === activeWindowId),
    );
    snapToIndex(activeIndex, "auto");
  }, [activeWindowId, snapToIndex, windows]);

  const handleScroll = useCallback(() => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(() => snapToNearest("smooth"), 80);
  }, [snapToNearest]);

  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag || drag.pointerId !== event.pointerId) return;

    track.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  }, []);

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      const drag = dragRef.current;
      if (!track || !drag || drag.pointerId !== event.pointerId) return;

      dragRef.current = null;
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      snapToNearest("smooth");
    },
    [snapToNearest],
  );

  const handleTitlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      handlePointerDown(event as unknown as React.PointerEvent<HTMLDivElement>);
    },
    [handlePointerDown],
  );

  if (windows.length === 0) return null;

  return (
    <div className={cx(styles.viewport, styles[shell])}>
      <div
        ref={trackRef}
        className={styles.track}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {windows.map((window, index) => {
          const active = window.id === activeWindowId;
          const transitionClassName = getTransitionClassName?.(window.id);
          const resolvedContent = renderWindowContent?.(window) ?? window.content;
          const legacyContent = !renderWindowContent && !window.content;

          return (
            <div
              key={window.id}
              className={styles.slide}
              data-carousel-slide="true"
              data-carousel-slide-index={index}
              data-active={active ? "true" : "false"}
            >
              <WindowFrame
                shell={shell}
                title={window.title}
                icon={window.icon}
                active={active}
                onFocus={() => onFocusWindow(window.id)}
                onClose={() => (onRequestClose ? onRequestClose(window) : onCloseWindow(window.id))}
                onMinimize={() => (onRequestMinimize ? onRequestMinimize(window) : onMinimizeWindow(window.id))}
                onShowHome={onShowHome}
                allowDrag
                onTitlePointerDown={handleTitlePointerDown}
                className={cx(styles.windowFrame, transitionClassName)}
                style={{ zIndex: computeZIndex(window.stackOrder, window.layer) }}
                legacyContent={legacyContent}
                chromeless
              >
                {resolvedContent ?? (
                  <p>
                    {window.title} is open. Wire this window to a real workspace view or agent-generated surface.
                  </p>
                )}
              </WindowFrame>
            </div>
          );
        })}
      </div>
    </div>
  );
}
