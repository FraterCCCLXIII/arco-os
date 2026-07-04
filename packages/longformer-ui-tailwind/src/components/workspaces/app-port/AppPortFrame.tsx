import { useRef, type ReactNode } from "react";
import { Icon, type IconName } from "../../../icons";
import { cx } from "../../../utils/cx";
import { APP_PORT_FRAME, appPortUsesFixedFrame } from "./viewport-frame";
import type { AppPortViewport } from "./types";
import { RESIZE_EDGES, useAppPortModalResize } from "./useAppPortModalResize";
import styles from "./AppPortFrame.tailwind";

const RESIZE_HANDLE_CLASS = {
  n: styles.resizeN,
  s: styles.resizeS,
  e: styles.resizeE,
  w: styles.resizeW,
  ne: styles.resizeNE,
  nw: styles.resizeNW,
  se: styles.resizeSE,
  sw: styles.resizeSW,
} as const;

export interface AppPortFrameProps {
  viewport: AppPortViewport;
  children: ReactNode;
  className?: string;
  windowTitle?: string;
  windowIcon?: IconName;
}

/** Frames a single app for desktop, modal, phone, or watch presentation. */
export function AppPortFrame({
  viewport,
  children,
  className,
  windowTitle = "App",
  windowIcon = "app-window",
}: AppPortFrameProps) {
  const frame = APP_PORT_FRAME[viewport];
  const fixedFrame = appPortUsesFixedFrame(viewport);
  const stageRef = useRef<HTMLDivElement>(null);
  const isModal = viewport === "modal";
  const { size: modalSize, resetSize, getResizeHandler } = useAppPortModalResize(stageRef, isModal);

  if (isModal) {
    return (
      <div ref={stageRef} className={cx(styles.stage, className)}>
        <div className={styles.modalScrim}>
          <div
            className={styles.modalWindow}
            style={{ width: modalSize.width, height: modalSize.height }}
            role="dialog"
            aria-modal="true"
            aria-label={windowTitle}
          >
            <header className={styles.modalTitleBar}>
              <div className={styles.modalTrafficLights} aria-hidden="true">
                <span className={styles.modalTrafficClose} />
                <span className={styles.modalTrafficMinimize} />
                <span className={styles.modalTrafficMaximize} />
              </div>
              <div className={styles.modalTitle}>
                <Icon name={windowIcon} size={14} />
                <span>{windowTitle}</span>
                <span className={styles.modalDimensions}>
                  {modalSize.width}×{modalSize.height}
                </span>
              </div>
              <div className={styles.modalTitleActions}>
                <button type="button" className={styles.modalResetButton} onClick={resetSize}>
                  Reset
                </button>
                <button type="button" className={styles.modalCloseButton} aria-label="Close window">
                  <Icon name="close" size={14} />
                </button>
              </div>
            </header>
            <div className={styles.modalBody}>{children}</div>
            {RESIZE_EDGES.map((edge) => (
              <span
                key={edge}
                className={cx(styles.resizeHandle, RESIZE_HANDLE_CLASS[edge])}
                onPointerDown={getResizeHandler(edge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.stage, className)}>
      <div
        className={cx(styles.screen, fixedFrame && styles.screenFixed, viewport === "watch" && styles.screenWatch)}
        data-viewport={viewport}
        style={
          fixedFrame
            ? {
                width: frame.width,
                height: frame.height,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
