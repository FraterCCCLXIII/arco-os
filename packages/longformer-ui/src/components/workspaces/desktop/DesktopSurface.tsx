import { useCallback, useRef } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import {
  computeZIndex,
  useWindowDrag,
  useWindowResize,
  type FormFactor,
  type SurfaceRect,
  type SurfaceWindow,
  type WindowPolicy,
} from "../../../surface-manager";
import type { ResizeEdge } from "../../../surface-manager/useWindowResize";
import { WindowFrame } from "./WindowFrame";
import { WidgetDesktopView, type WidgetTile } from "./WidgetDesktopView";
import { useWindowTransitions } from "./useWindowTransitions";
import type { DesktopIconItem, DesktopShell } from "./types";
import styles from "./DesktopSurface.module.css";

export interface DesktopSurfaceProps {
  shell: DesktopShell;
  formFactor?: FormFactor;
  policy?: WindowPolicy;
  wallpaperLabel?: string;
  icons: DesktopIconItem[];
  windows: SurfaceWindow[];
  activeWindowId?: string;
  onSelectIcon: (iconId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  onMinimizeWindow: (windowId: string) => void;
  onMaximizeWindow?: (windowId: string) => void;
  onMoveWindow?: (windowId: string, rect: SurfaceRect) => void;
  onResizeWindow?: (windowId: string, rect: SurfaceRect) => void;
  onNextGlance?: () => void;
  onPrevGlance?: () => void;
  widgetTiles?: WidgetTile[];
  className?: string;
}

interface SurfaceWindowViewProps {
  shell: DesktopShell;
  window: SurfaceWindow;
  active: boolean;
  allowDrag: boolean;
  allowResize: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  onMove?: (rect: SurfaceRect) => void;
  onResize?: (rect: SurfaceRect) => void;
  inactiveGlance?: boolean;
  transitionClassName?: string;
}

function SurfaceWindowView({
  shell,
  window,
  active,
  allowDrag,
  allowResize,
  containerRef,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  inactiveGlance,
  transitionClassName,
}: SurfaceWindowViewProps) {
  const drag = useWindowDrag({
    rect: window.rect,
    disabled: !allowDrag || !onMove,
    containerRef,
    onMove: onMove ?? (() => undefined),
    onFocus,
  });

  const resizeN = useWindowResize({
    rect: window.rect,
    edge: "n",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeS = useWindowResize({
    rect: window.rect,
    edge: "s",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeE = useWindowResize({
    rect: window.rect,
    edge: "e",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeW = useWindowResize({
    rect: window.rect,
    edge: "w",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeNE = useWindowResize({
    rect: window.rect,
    edge: "ne",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeNW = useWindowResize({
    rect: window.rect,
    edge: "nw",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeSE = useWindowResize({
    rect: window.rect,
    edge: "se",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });
  const resizeSW = useWindowResize({
    rect: window.rect,
    edge: "sw",
    disabled: !allowResize || !onResize,
    containerRef,
    onResize: onResize ?? (() => undefined),
    onFocus,
  });

  const resizeHandlers: Record<ResizeEdge, (event: React.PointerEvent<HTMLElement>) => void> = {
    n: resizeN.onPointerDown,
    s: resizeS.onPointerDown,
    e: resizeE.onPointerDown,
    w: resizeW.onPointerDown,
    ne: resizeNE.onPointerDown,
    nw: resizeNW.onPointerDown,
    se: resizeSE.onPointerDown,
    sw: resizeSW.onPointerDown,
  };

  return (
    <WindowFrame
      shell={shell}
      title={window.title}
      icon={window.icon}
      active={active}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      allowDrag={allowDrag}
      allowResize={allowResize}
      onTitlePointerDown={drag.onPointerDown}
      onResizePointerDown={(edge, event) => resizeHandlers[edge](event)}
      className={cx(
        styles.windowFrame,
        inactiveGlance && styles.inactiveGlance,
        transitionClassName,
      )}
      style={{
        left: `${window.rect.x}%`,
        top: `${window.rect.y}%`,
        width: `${window.rect.width}%`,
        height: `${window.rect.height}%`,
        zIndex: computeZIndex(window.stackOrder, window.layer),
        pointerEvents: inactiveGlance ? "none" : undefined,
        opacity: inactiveGlance ? 0.55 : undefined,
      }}
    >
      {window.content ?? (
        <p>
          {window.title} is open. Wire this window to a real workspace view or agent-generated surface.
        </p>
      )}
    </WindowFrame>
  );
}

/** The desktop canvas: wallpaper, shortcut icons, and floating window frames. */
export function DesktopSurface({
  shell,
  formFactor = "desktop",
  policy,
  wallpaperLabel = "Longformer",
  icons,
  windows,
  activeWindowId,
  onSelectIcon,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onMoveWindow,
  onResizeWindow,
  onNextGlance,
  onPrevGlance,
  widgetTiles = [],
  className,
}: DesktopSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { displayWindows, requestClose, requestMinimize, getTransition } = useWindowTransitions(windows, {
    onClose: onCloseWindow,
    onMinimize: onMinimizeWindow,
  });
  const isMobile = shell === "ios" || shell === "android";
  const allowDrag = policy?.allowDrag ?? (formFactor === "desktop" || formFactor === "tablet");
  const allowResize = policy?.allowResize ?? (formFactor === "desktop" || formFactor === "tablet");

  const handleWatchSwipe = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (formFactor !== "watch") return;
      const startX = event.clientX;
      function onMove(ev: PointerEvent) {
        const delta = ev.clientX - startX;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) onNextGlance?.();
        else onPrevGlance?.();
        cleanup();
      }
      function cleanup() {
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointermove", onMove);
      }
      function onUp() {
        cleanup();
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [formFactor, onNextGlance, onPrevGlance],
  );

  return (
    <div
      ref={containerRef}
      className={cx(
        styles.surface,
        styles[shell],
        formFactor === "watch" && styles.watch,
        formFactor === "widget" && styles.widget,
        className,
      )}
      onPointerDown={formFactor === "watch" ? handleWatchSwipe : undefined}
    >
      <div className={styles.wallpaper} aria-hidden="true">
        <div className={styles.wallpaperGradient} />
        <span className={styles.wallpaperLabel}>{wallpaperLabel}</span>
      </div>

      {!isMobile && formFactor === "desktop" && (
        <div className={styles.iconGrid}>
          {icons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              className={cx("lf-focusable", styles.desktopIcon)}
              onDoubleClick={() => onSelectIcon(icon.id)}
              onClick={() => onSelectIcon(icon.id)}
            >
              <span className={styles.iconTile}>
                <Icon name={icon.icon} size={22} />
              </span>
              <span className={styles.iconLabel}>{icon.label}</span>
            </button>
          ))}
        </div>
      )}

      {formFactor === "widget" && (
        <WidgetDesktopView tiles={widgetTiles} className={styles.widgetBoard} />
      )}

      {formFactor !== "widget" &&
        displayWindows.map((window) => {
          const transition = getTransition(window.id);
          const transitionClassName =
            transition === "enter"
              ? styles.windowEnter
              : transition === "close"
                ? styles.windowClose
                : transition === "minimize"
                  ? styles.windowMinimize
                  : undefined;

          return (
            <SurfaceWindowView
              key={window.id}
              shell={shell}
              window={window}
              active={window.id === activeWindowId}
              allowDrag={allowDrag && transition !== "close" && transition !== "minimize"}
              allowResize={allowResize && transition !== "close" && transition !== "minimize"}
              containerRef={containerRef}
              onFocus={() => onFocusWindow(window.id)}
              onClose={() => requestClose(window)}
              onMinimize={() => requestMinimize(window)}
              onMaximize={onMaximizeWindow ? () => onMaximizeWindow(window.id) : undefined}
              onMove={onMoveWindow ? (rect) => onMoveWindow(window.id, rect) : undefined}
              onResize={onResizeWindow ? (rect) => onResizeWindow(window.id, rect) : undefined}
              inactiveGlance={formFactor === "watch" && window.id !== activeWindowId}
              transitionClassName={transitionClassName}
            />
          );
        })}
    </div>
  );
}
