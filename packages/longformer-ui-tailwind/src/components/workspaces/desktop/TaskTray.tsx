import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { AppIconTile } from "../../../app-tones/AppIconTile";
import { Icon } from "../../../icons";
import { Tooltip } from "../../primitives/Tooltip";
import { TrayAllAppsButton } from "./TrayAllAppsButton";
import { TrayAppHoverCard, type TrayAppMenuActionHandlers } from "./TrayAppHoverCard";
import { TrayScaleFit } from "./TrayScaleFit";
import { useTrayPinDrag } from "./useTrayPinDrag";
import { getTrayPinShift, getTrayReorderShift, useTrayReorder } from "./useTrayReorder";
import type { FormFactor } from "../../../surface-manager";
import type { DesktopApp, DesktopShell, DesktopWindow } from "./types";
import styles from "./TaskTray.tailwind";

export interface TaskTrayProps {
  shell: DesktopShell;
  formFactor?: FormFactor;
  apps: DesktopApp[];
  /** Apps removed from the tray — shown in the all-apps launcher. */
  overflowApps?: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  onLaunchApp: (appId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onMinimizeWindow?: (windowId: string) => void;
  onCloseWindow?: (windowId: string) => void;
  /** Opens the create-app flow — rendered as a trailing plus control in the dock. */
  onCreateApp?: () => void;
  /** Reorder pinned tray icons after hold-and-drag. */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** Pull an icon off the tray into the all-apps launcher. */
  onUndock?: (fromIndex: number) => void;
  /** Pin an overflow app back onto the tray. */
  onMoveToTray?: (id: string, index?: number) => void;
  onPopPhoneStack?: () => void;
  onMinimizeAll?: () => void;
  onNextGlance?: () => void;
  onPrevGlance?: () => void;
  /** Phone launcher is visible — hide duplicate dock/shelf chrome. */
  homeVisible?: boolean;
  /** Overlay mode for the global hover dock — drops full-bleed taskbar chrome. */
  floating?: boolean;
  className?: string;
}

function trayMenuHandlers(
  appId: string,
  windows: DesktopWindow[],
  onLaunchApp: (appId: string) => void,
  onFocusWindow: (windowId: string) => void,
  onMinimizeWindow?: (windowId: string) => void,
  onCloseWindow?: (windowId: string) => void,
): TrayAppMenuActionHandlers {
  const appWindows = () => windows.filter((window) => window.appId === appId);
  const openWindows = () => appWindows().filter((window) => !window.minimized);

  return {
    onNewWindow: () => onLaunchApp(appId),
    onNewPrivateWindow: () => onLaunchApp(appId),
    onShowAllWindows: () => {
      const visible = openWindows();
      if (visible[0]) onFocusWindow(visible[0].id);
      else onLaunchApp(appId);
    },
    onHide: () => {
      openWindows().forEach((window) => onMinimizeWindow?.(window.id));
    },
    onQuit: () => {
      appWindows().forEach((window) => onCloseWindow?.(window.id));
    },
  };
}

/** Bottom dock / taskbar / navigation tray — shell-specific layout and chrome. */
export function TaskTray({
  shell,
  formFactor = "desktop",
  apps,
  overflowApps = [],
  windows,
  activeWindowId,
  onLaunchApp,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onCreateApp,
  onReorder,
  onUndock,
  onMoveToTray,
  onPopPhoneStack,
  onMinimizeAll,
  onNextGlance,
  onPrevGlance,
  homeVisible = false,
  floating = false,
  className,
}: TaskTrayProps) {
  const openAppIds = new Set(windows.filter((w) => !w.minimized).map((w) => w.appId));
  const pinnedApps = apps.filter((app) => app.pinned !== false);
  const trayItemCount =
    pinnedApps.length + (onCreateApp ? 1 : 0) + (onMoveToTray || overflowApps.length > 0 ? 1 : 0);
  const isPhone = formFactor === "phone";
  const showAppDock = !isPhone && !homeVisible;
  const showPhoneHomeButton = isPhone && !homeVisible && Boolean(onMinimizeAll);
  const activeAppId = windows.find((window) => window.id === activeWindowId)?.appId;

  if (shell === "android") {
    return (
      <footer
        className={cx(styles.tray, styles.android, floating && styles.floating, className)}
        role="contentinfo"
      >
        <div className={styles.androidNav}>
          <button
            type="button"
            className={styles.androidNavButton}
            aria-label="Back"
            onClick={formFactor === "phone" ? onPopPhoneStack : undefined}
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <button
            type="button"
            className={styles.androidNavButton}
            aria-label="Home"
            onClick={formFactor === "phone" ? onMinimizeAll : undefined}
          >
            <Icon name="home" size={18} />
          </button>
          <button type="button" className={styles.androidNavButton} aria-label="Recents">
            <Icon name="layers" size={18} />
          </button>
        </div>
        {showAppDock && (
        <div className={styles.androidShelf}>
          {pinnedApps.slice(0, 5).map((app) => {
            const running = openAppIds.has(app.id);
            const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
            return (
            <TrayAppHoverCard
              key={app.id}
              app={app}
              running={running}
              active={active}
              windows={windows}
              activeWindowId={activeWindowId}
              {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
            >
              <button
                type="button"
                className={styles.trayIcon}
                aria-label={app.label}
                onClick={() => onLaunchApp(app.id)}
              >
                <AppIconTile appId={app.id} icon={app.icon} size="dock" surface="solid" />
              </button>
            </TrayAppHoverCard>
            );
          })}
          <TrayCreateButton iconSize={18} onCreateApp={onCreateApp} />
        </div>
        )}
      </footer>
    );
  }

  if (shell === "ios") {
    return (
      <footer
        className={cx(styles.tray, styles.ios, floating && styles.floating, className)}
        role="contentinfo"
      >
        {showAppDock && (
        <div className={styles.iosDock}>
          {pinnedApps.slice(0, 4).map((app) => {
            const running = openAppIds.has(app.id);
            const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
            return (
            <TrayAppHoverCard
              key={app.id}
              app={app}
              running={running}
              active={active}
              windows={windows}
              activeWindowId={activeWindowId}
              {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
            >
              <button
                type="button"
                className={cx(styles.trayIcon, styles.iosIcon)}
                aria-label={app.label}
                onClick={() => onLaunchApp(app.id)}
              >
                <AppIconTile appId={app.id} icon={app.icon} size="dockMac" surface="solid" />
              </button>
            </TrayAppHoverCard>
            );
          })}
          <TrayCreateButton iconSize={20} ios onCreateApp={onCreateApp} />
        </div>
        )}
        {formFactor === "watch" && (
          <div className={styles.watchNav}>
            <button type="button" className={styles.androidNavButton} aria-label="Previous glance" onClick={onPrevGlance}>
              <Icon name="chevron-left" size={16} />
            </button>
            <button type="button" className={styles.androidNavButton} aria-label="Next glance" onClick={onNextGlance}>
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        )}
        {showPhoneHomeButton && (
          <button
            type="button"
            className={styles.phoneHomeButton}
            aria-label="Home screen"
            onClick={onMinimizeAll}
          >
            <Icon name="home" size={18} />
          </button>
        )}
        <button
          type="button"
          className={styles.homeIndicator}
          aria-label="Home"
          onClick={isPhone ? onMinimizeAll : undefined}
        />
      </footer>
    );
  }

  if (shell === "windows") {
    return (
      <WindowsTaskTray
        apps={pinnedApps}
        overflowApps={overflowApps}
        windows={windows}
        activeWindowId={activeWindowId}
        activeAppId={activeAppId}
        openAppIds={openAppIds}
        floating={floating}
        className={className}
        onLaunchApp={onLaunchApp}
        onFocusWindow={onFocusWindow}
        onMinimizeWindow={onMinimizeWindow}
        onCloseWindow={onCloseWindow}
        onCreateApp={onCreateApp}
        onReorder={onReorder}
        onUndock={onUndock}
        onMoveToTray={onMoveToTray}
      />
    );
  }

  // macOS dock + Chrome OS shelf share a centered icon row
  return (
    <footer
      className={cx(styles.tray, styles[shell], floating && styles.floating, className)}
      role="contentinfo"
    >
      <TrayScaleFit itemCount={trayItemCount}>
        <ReorderableTrayDock
          shell={shell}
          apps={pinnedApps}
          overflowApps={overflowApps}
          windows={windows}
          activeWindowId={activeWindowId}
          activeAppId={activeAppId}
          openAppIds={openAppIds}
          onLaunchApp={onLaunchApp}
          onFocusWindow={onFocusWindow}
          onMinimizeWindow={onMinimizeWindow}
          onCloseWindow={onCloseWindow}
          onCreateApp={onCreateApp}
          onReorder={onReorder}
          onUndock={onUndock}
          onMoveToTray={onMoveToTray}
          dockClassName={shell === "macos" ? styles.macosDock : styles.chromeShelf}
        />
      </TrayScaleFit>
    </footer>
  );
}

interface ReorderableTrayDockProps {
  shell: "macos" | "chromeos" | "windows";
  apps: DesktopApp[];
  overflowApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  activeAppId?: string;
  openAppIds: Set<string>;
  onLaunchApp: (appId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onMinimizeWindow?: (windowId: string) => void;
  onCloseWindow?: (windowId: string) => void;
  onCreateApp?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onUndock?: (fromIndex: number) => void;
  onMoveToTray?: (id: string, index?: number) => void;
  dockClassName: string;
}

function ReorderableTrayDock({
  shell,
  apps,
  overflowApps,
  windows,
  activeWindowId,
  activeAppId,
  openAppIds,
  onLaunchApp,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onCreateApp,
  onReorder,
  onUndock,
  onMoveToTray,
  dockClassName,
}: ReorderableTrayDockProps) {
  const trayBoundsRef = useRef<HTMLDivElement>(null);
  const canCustomize = Boolean(onUndock && onMoveToTray);
  const canReorder = Boolean(onReorder && apps.length > 1);
  const showAllApps = Boolean(onMoveToTray);
  const isMacos = shell === "macos";
  const isWindows = shell === "windows";

  const { dragState, pendingIndex, itemRefs, createItemPointerDown, shouldSuppressClick } = useTrayReorder({
    enabled: canReorder || canCustomize,
    itemCount: apps.length,
    trayBoundsRef,
    onReorder,
    onUndock,
  });

  const { pinDrag, pinDropIndex, createOverflowDragStart, shouldSuppressOverflowClick } = useTrayPinDrag({
    enabled: canCustomize,
    itemCount: apps.length,
    itemRefs,
    onPin: onMoveToTray,
  });

  const overflowItems = overflowApps.map((app) => ({
    id: app.id,
    label: app.label,
    icon: app.icon,
  }));

  const isDragging = Boolean(dragState || pinDrag);
  const [slotStride, setSlotStride] = useState(0);

  useLayoutEffect(() => {
    if (!isDragging) {
      setSlotStride(0);
      return;
    }

    const slots = itemRefs.current.filter((slot): slot is HTMLDivElement => Boolean(slot));
    if (slots.length >= 2) {
      setSlotStride(slots[1]!.getBoundingClientRect().left - slots[0]!.getBoundingClientRect().left);
      return;
    }

    if (slots.length === 1) {
      const rect = slots[0]!.getBoundingClientRect();
      const parent = slots[0]!.parentElement;
      const gap = parent ? Number.parseFloat(getComputedStyle(parent).columnGap || getComputedStyle(parent).gap) || 8 : 8;
      setSlotStride(rect.width + gap);
    }
  }, [isDragging, dragState?.dropIndex, dragState?.fromIndex, pinDropIndex, apps.length]);

  function getItemShift(index: number): number {
    if (dragState && !dragState.isUndocking) {
      return getTrayReorderShift(index, dragState.fromIndex, dragState.dropIndex);
    }

    if (pinDrag) {
      return getTrayPinShift(index, pinDropIndex);
    }

    return 0;
  }

  function renderAppIcon(app: DesktopApp, index: number) {
    const running = openAppIds.has(app.id);
    const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
    const isPendingHold = pendingIndex === index;
    const isDraggingSource = dragState?.fromIndex === index;
    const isUndockingSource = isDraggingSource && dragState?.isUndocking;
    const shift = getItemShift(index);
    const itemPointerDown =
      canReorder || canCustomize ? createItemPointerDown(index, app.id, app.label, app.icon) : undefined;

    const iconButton = isWindows ? (
      <button
        type="button"
        className={cx(
          styles.taskButton,
          "lf-focusable",
        )}
        aria-label={app.label}
        aria-pressed={active}
        onPointerDown={itemPointerDown}
        onClick={() => {
          if (shouldSuppressClick()) return;
          const win = windows.find((w) => w.appId === app.id && !w.minimized);
          if (win) onFocusWindow(win.id);
          else onLaunchApp(app.id);
        }}
      >
        <AppIconTile appId={app.id} icon={app.icon} size="taskbar" surface="solid" />
      </button>
    ) : (
      <button
        type="button"
        className={cx(
          styles.trayIcon,
          isMacos && styles.macosIcon,
        )}
        aria-label={app.label}
        onPointerDown={itemPointerDown}
        onClick={() => {
          if (shouldSuppressClick()) return;
          onLaunchApp(app.id);
        }}
      >
        <AppIconTile
          appId={app.id}
          icon={app.icon}
          size={isMacos ? "dockMac" : "dock"}
          surface="solid"
        />
        {running && isMacos && <span className={styles.dockDot} aria-hidden="true" />}
      </button>
    );

    const slot = (
      <div
        ref={(element) => {
          itemRefs.current[index] = element;
        }}
        className={cx(
          styles.itemSlot,
          (canReorder || canCustomize) && styles.itemSlotReorderable,
          isPendingHold && styles.itemSlotPending,
          isDraggingSource && styles.itemSlotDragging,
          isUndockingSource && styles.itemSlotUndocking,
          isDragging && !isDraggingSource && styles.itemSlotShifting,
        )}
        style={
          shift !== 0 && slotStride > 0
            ? { transform: `translateX(${shift * slotStride}px)` }
            : undefined
        }
      >
        <TrayAppHoverCard
          app={app}
          running={running}
          active={active}
          windows={windows}
          activeWindowId={activeWindowId}
          {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
        >
          {iconButton}
        </TrayAppHoverCard>
      </div>
    );

    return <div key={app.id}>{slot}</div>;
  }

  return (
    <>
      <div
        ref={trayBoundsRef}
        className={cx(
          dockClassName,
          dragState?.isUndocking && styles.dockUndocking,
          dragState && styles.dockReordering,
          pinDrag && styles.dockReordering,
        )}
      >
        {dragState?.isUndocking ? <span className={styles.undockHint} aria-hidden="true" /> : null}
        {showAllApps && onMoveToTray && (
          <>
            <TrayAllAppsButton
              items={overflowItems}
              activeAppId={activeAppId}
              variant={isWindows ? "taskbar" : "dock"}
              onSelect={onLaunchApp}
              onMoveToTray={(id) => onMoveToTray(id)}
              onRowPointerDown={createOverflowDragStart}
              shouldSuppressRowClick={shouldSuppressOverflowClick}
              draggingItemId={pinDrag?.id ?? null}
            />
            <span className={cx(styles.trayDivider, isWindows && styles.trayDividerWindows)} aria-hidden="true" />
          </>
        )}
        {apps.map((app, index) => renderAppIcon(app, index))}
        <TrayCreateButton
          iconSize={isMacos ? 22 : isWindows ? 14 : 18}
          macos={isMacos}
          windows={isWindows}
          onCreateApp={onCreateApp}
        />
      </div>

      {dragState || pinDrag
        ? createPortal(
            <div
              className={cx(styles.dragGhost, dragState?.isUndocking && styles.dragGhostUndocking)}
              style={{
                left: (dragState ?? pinDrag)!.ghostX,
                top: (dragState ?? pinDrag)!.ghostY,
              }}
              aria-hidden="true"
            >
              <AppIconTile
                appId={dragState?.appId ?? pinDrag!.id}
                icon={(dragState ?? pinDrag)!.icon}
                size={isMacos ? "dockMac" : isWindows ? "taskbar" : "dock"}
                surface="solid"
                className={styles.dragGhostIcon}
              />
            </div>,
            getPortalContainer(),
          )
        : null}
    </>
  );
}

interface WindowsTaskTrayProps {
  apps: DesktopApp[];
  overflowApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  activeAppId?: string;
  openAppIds: Set<string>;
  floating?: boolean;
  className?: string;
  onLaunchApp: (appId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onMinimizeWindow?: (windowId: string) => void;
  onCloseWindow?: (windowId: string) => void;
  onCreateApp?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onUndock?: (fromIndex: number) => void;
  onMoveToTray?: (id: string, index?: number) => void;
}

function formatWindowsTrayClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatWindowsTrayDate(date: Date): string {
  return date.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });
}

/** Windows 11–style taskbar — centered pinned apps, accent running pills, tray clock. */
function WindowsTaskTray({
  apps,
  overflowApps,
  windows,
  activeWindowId,
  activeAppId,
  openAppIds,
  floating,
  className,
  onLaunchApp,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onCreateApp,
  onReorder,
  onUndock,
  onMoveToTray,
}: WindowsTaskTrayProps) {
  const [now, setNow] = useState(() => new Date());
  const overflowItems = overflowApps.map((app) => ({
    id: app.id,
    label: app.label,
    icon: app.icon,
  }));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className={cx(styles.tray, styles.windows, floating && styles.floating, className)} role="contentinfo">
      {onMoveToTray ? (
        <TrayAllAppsButton
          items={overflowItems}
          activeAppId={activeAppId}
          variant="start"
          onSelect={onLaunchApp}
          onMoveToTray={(id) => onMoveToTray(id)}
        />
      ) : (
        <Tooltip label="Start">
          <button type="button" className={cx(styles.startButton, "lf-focusable")} aria-label="Start">
            <span className={styles.startMark} aria-hidden="true" />
          </button>
        </Tooltip>
      )}

      <div className={styles.taskList}>
        <TrayScaleFit itemCount={apps.length + (onCreateApp ? 1 : 0)}>
          <ReorderableTrayDock
            shell="windows"
            apps={apps}
            overflowApps={overflowApps}
            windows={windows}
            activeWindowId={activeWindowId}
            activeAppId={activeAppId}
            openAppIds={openAppIds}
            onLaunchApp={onLaunchApp}
            onFocusWindow={onFocusWindow}
            onMinimizeWindow={onMinimizeWindow}
            onCloseWindow={onCloseWindow}
            onCreateApp={onCreateApp}
            onReorder={onReorder}
            onUndock={onUndock}
            onMoveToTray={onMoveToTray}
            dockClassName={styles.taskListInner}
          />
        </TrayScaleFit>
      </div>

      <div className={styles.systemTray}>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Network">
          <Icon name="wifi" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Volume">
          <Icon name="volume" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Battery">
          <Icon name="battery" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayClock, "lf-focusable")} aria-label="Date and time">
          <span className={styles.systemTrayTime}>{formatWindowsTrayClock(now)}</span>
          <span className={styles.systemTrayDate}>{formatWindowsTrayDate(now)}</span>
        </button>
      </div>
    </footer>
  );
}

interface TrayCreateButtonProps {
  iconSize: number;
  onCreateApp?: () => void;
  macos?: boolean;
  ios?: boolean;
  windows?: boolean;
}

/** Trailing plus control shared across shell-specific tray layouts. */
function TrayCreateButton({ iconSize, onCreateApp, macos, ios, windows }: TrayCreateButtonProps) {
  if (!onCreateApp) return null;

  return (
    <>
      <span className={cx(styles.trayDivider, windows && styles.trayDividerWindows)} aria-hidden="true" />
      <button
        type="button"
        className={cx(
          styles.createButton,
          "lf-focusable",
          macos && styles.macosIcon,
          ios && styles.iosIcon,
          windows && styles.createButtonWindows,
        )}
        aria-label="Create new app"
        onClick={onCreateApp}
      >
        <Icon name="plus" size={iconSize} />
      </button>
    </>
  );
}
