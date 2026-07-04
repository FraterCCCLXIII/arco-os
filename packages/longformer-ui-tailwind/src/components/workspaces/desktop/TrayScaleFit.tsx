import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./TrayScaleFit.tailwind";

export interface TrayScaleFitProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Lower bound so icons stay tappable when many apps are pinned. */
  minScale?: number;
  /** Bumps measurement when the number of tray items changes. */
  itemCount?: number;
}

/** Scales tray icon rows down so every pinned app fits within the available width. */
export function TrayScaleFit({
  children,
  className,
  contentClassName,
  minScale = 0.42,
  itemCount = 0,
}: TrayScaleFitProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, width: 0, height: 0 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const update = () => {
      const available = viewport.clientWidth;
      const naturalWidth = content.scrollWidth;
      const naturalHeight = content.scrollHeight;

      if (!available || !naturalWidth) {
        setFit({ scale: 1, width: 0, height: 0 });
        return;
      }

      const scale = Math.max(minScale, Math.min(1, available / naturalWidth));
      setFit({
        scale,
        width: naturalWidth * scale,
        height: naturalHeight * scale,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  }, [minScale, itemCount]);

  const scaled = fit.scale < 0.999;

  return (
    <div ref={viewportRef} className={cx(styles.viewport, className)}>
      <div
        className={styles.sizer}
        style={
          scaled && fit.width > 0
            ? { width: fit.width, height: fit.height }
            : undefined
        }
      >
        <div
          ref={contentRef}
          className={cx(styles.content, contentClassName)}
          style={
            scaled
              ? {
                  transform: `scale(${fit.scale})`,
                  transformOrigin: "top left",
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
