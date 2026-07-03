import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import type { ResizeEdge } from "../../../surface-manager/useWindowResize";
import type { DesktopShell } from "./types";
import styles from "./WindowFrame.module.css";

export interface WindowFrameProps {
  shell: DesktopShell;
  title: string;
  icon: IconName;
  active?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** Returns to the phone home screen (app tiles). */
  onShowHome?: () => void;
  allowDrag?: boolean;
  allowResize?: boolean;
  onTitlePointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
  onResizePointerDown?: (edge: ResizeEdge, event: React.PointerEvent<HTMLElement>) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Use padded scrollable body for legacy placeholder content. */
  legacyContent?: boolean;
  /** Hide title-bar chrome so in-app adaptive headers can run edge-to-edge. */
  chromeless?: boolean;
}

const RESIZE_EDGES: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

/** A single desktop window with shell-specific title-bar chrome. */
export function WindowFrame({
  shell,
  title,
  icon,
  active = false,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onShowHome,
  allowDrag = false,
  allowResize = false,
  onTitlePointerDown,
  onResizePointerDown,
  children,
  className,
  style,
  legacyContent = false,
  chromeless = false,
}: WindowFrameProps) {
  const isMobile = shell === "ios" || shell === "android";

  return (
    <div
      className={cx(styles.window, styles[shell], active && styles.active, chromeless && styles.chromeless, className)}
      style={style}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      {isMobile && !chromeless ? (
        <div
          className={cx(styles.titleBar, styles.mobileTitleBar, allowDrag && styles.titleBarDraggable)}
          onPointerDown={allowDrag ? onTitlePointerDown : undefined}
        >
          <div className={styles.mobileTitleCenter}>
            <Icon name={icon} size={14} />
            <span className={styles.titleText}>{title}</span>
          </div>
          {onShowHome && (
            <button
              type="button"
              className={styles.mobileHome}
              aria-label="Home screen"
              onClick={onShowHome}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <Icon name="home" size={14} />
            </button>
          )}
          <button
            type="button"
            className={styles.mobileClose}
            aria-label="Close"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ) : (
        <div
          className={cx(styles.titleBar, allowDrag && styles.titleBarDraggable)}
          onPointerDown={allowDrag ? onTitlePointerDown : undefined}
        >
          {shell === "macos" && (
            <div className={styles.trafficLights}>
              <button
                type="button"
                className={cx(styles.light, styles.closeLight)}
                aria-label="Close"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className={cx(styles.light, styles.minLight)}
                aria-label="Minimize"
                onClick={onMinimize}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className={cx(styles.light, styles.maxLight)}
                aria-label="Maximize"
                onClick={onMaximize}
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className={styles.titleCenter}>
            <Icon name={icon} size={13} />
            <span className={styles.titleText}>{title}</span>
          </div>
          {shell === "windows" && (
            <div className={styles.winControls}>
              <button
                type="button"
                className={styles.winControl}
                aria-label="Minimize"
                onClick={onMinimize}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon name="minus" size={12} />
              </button>
              <button
                type="button"
                className={styles.winControl}
                aria-label="Maximize"
                onClick={onMaximize}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon name="maximize" size={11} />
              </button>
              <button
                type="button"
                className={cx(styles.winControl, styles.winClose)}
                aria-label="Close"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon name="close" size={12} />
              </button>
            </div>
          )}
          {shell === "chromeos" && (
            <div className={styles.winControls}>
              <button
                type="button"
                className={styles.winControl}
                aria-label="Minimize"
                onClick={onMinimize}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon name="minus" size={12} />
              </button>
              <button
                type="button"
                className={cx(styles.winControl, styles.winClose)}
                aria-label="Close"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Icon name="close" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
      <div className={cx(styles.content, legacyContent && styles.contentLegacy)}>{children}</div>
      {allowResize &&
        onResizePointerDown &&
        RESIZE_EDGES.map((edge) => (
          <div
            key={edge}
            className={cx(styles.resizeHandle, styles[`resize${edge.toUpperCase()}`])}
            aria-hidden="true"
            onPointerDown={(event) => {
              event.stopPropagation();
              onResizePointerDown(edge, event);
            }}
          />
        ))}
    </div>
  );
}
