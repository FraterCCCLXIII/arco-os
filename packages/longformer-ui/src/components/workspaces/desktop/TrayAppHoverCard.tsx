import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import type { DesktopApp, DesktopWindow } from "./types";
import {
  defaultProfilesForApp,
  TRAY_OPTIONS_ITEMS,
  type TrayAppMenuActionHandlers,
  type TrayAppProfile,
} from "./tray-menu-data";
import styles from "./TrayAppHoverCard.module.css";

const TONE_CLASS = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
} as const;

export interface TrayAppHoverCardProps extends TrayAppMenuActionHandlers {
  app: DesktopApp;
  children: ReactElement;
  running?: boolean;
  active?: boolean;
  activeWindowId?: string;
  windows?: DesktopWindow[];
  profiles?: TrayAppProfile[];
  defaultProfileId?: string;
}

function getMenuStyle(trigger: HTMLElement | null): CSSProperties | undefined {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  return {
    top: rect.top - 8,
    left: rect.left + rect.width / 2,
  };
}

function appWindowCount(appId: string, windows?: DesktopWindow[]): number {
  return windows?.filter((window) => window.appId === appId && !window.minimized).length ?? 0;
}

function MenuSeparator() {
  return <div className={styles.separator} role="separator" />;
}

function MenuRow({
  label,
  checked,
  chevron,
  danger,
  onClick,
  onMouseEnter,
}: {
  label: ReactNode;
  checked?: boolean;
  chevron?: boolean;
  danger?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx(styles.menuRow, danger && styles.menuRowDanger)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <span className={styles.menuRowCheck} aria-hidden="true">
        {checked ? <Icon name="check" size={12} /> : null}
      </span>
      <span className={styles.menuRowLabel}>{label}</span>
      {chevron ? <Icon name="chevron-right" size={12} className={styles.menuRowChevron} /> : null}
    </button>
  );
}

function TrayAppMenuPanel({
  app,
  active,
  running,
  profiles,
  activeProfileId,
  openWindowCount,
  optionsOpen,
  onOptionsEnter,
  onOptionsLeave,
  onSelectProfile,
  handlers,
}: {
  app: DesktopApp;
  active: boolean;
  running: boolean;
  profiles: TrayAppProfile[];
  activeProfileId: string;
  openWindowCount: number;
  optionsOpen: boolean;
  onOptionsEnter: () => void;
  onOptionsLeave: () => void;
  onSelectProfile: (profileId: string) => void;
  handlers: TrayAppMenuActionHandlers;
}) {
  const showProfiles = profiles.length > 0;
  const showAllLabel =
    openWindowCount > 1 ? `Show All Windows (${openWindowCount})` : "Show All Windows";

  return (
    <div className={styles.menu} role="menu" aria-label={`${app.label} menu`}>
      <MenuRow
        label={
          <span className={styles.menuHeaderLabel}>
            <span className={cx(styles.menuHeaderIcon, TONE_CLASS[app.tone ?? "neutral"])}>
              <Icon name={app.icon} size={14} />
            </span>
            {app.label}
          </span>
        }
        checked={active || running}
      />

      {showProfiles && (
        <>
          <MenuSeparator />
          <div className={styles.sectionLabel}>Profiles</div>
          <div className={styles.profileList}>
            {profiles.map((profile) => (
              <MenuRow
                key={profile.id}
                label={profile.label}
                checked={profile.id === activeProfileId}
                onClick={() => {
                  onSelectProfile(profile.id);
                  handlers.onSelectProfile?.(profile.id);
                }}
              />
            ))}
          </div>
        </>
      )}

      <MenuSeparator />

      <MenuRow label="New Window" onClick={handlers.onNewWindow} />
      <MenuRow label="New Incognito Window" onClick={handlers.onNewPrivateWindow ?? handlers.onNewWindow} />

      <div className={styles.submenuWrap} onMouseLeave={onOptionsLeave}>
        <MenuRow label="Options" chevron onMouseEnter={onOptionsEnter} />
        {optionsOpen && (
          <div className={styles.submenu} role="menu" aria-label="Options">
            {TRAY_OPTIONS_ITEMS.map((item) => (
              <MenuRow key={item.id} label={item.label} />
            ))}
          </div>
        )}
      </div>

      <MenuSeparator />

      <MenuRow label={showAllLabel} onClick={handlers.onShowAllWindows} />
      <MenuRow label="Hide" onClick={handlers.onHide} />
      <MenuRow label="Quit" danger onClick={handlers.onQuit} />
    </div>
  );
}

/** macOS-style dock menu popover — profiles, window actions, and nested options. */
export function TrayAppHoverCard({
  app,
  children,
  running = false,
  active = false,
  windows,
  profiles: profilesProp,
  defaultProfileId,
  onNewWindow,
  onNewPrivateWindow,
  onShowAllWindows,
  onHide,
  onQuit,
  onSelectProfile,
}: TrayAppHoverCardProps) {
  const profiles = profilesProp ?? defaultProfilesForApp(app.id);
  const [open, setOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState(defaultProfileId ?? profiles[0]?.id ?? "default");
  const [style, setStyle] = useState<CSSProperties>();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const menuId = useId();

  const handlers: TrayAppMenuActionHandlers = {
    onNewWindow,
    onNewPrivateWindow,
    onShowAllWindows,
    onHide,
    onQuit,
    onSelectProfile,
  };

  const dismiss = useCallback(() => {
    setOpen(false);
    setOptionsOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      dismiss();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dismiss]);

  function clearOpenTimer() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }

  function clearHideTimer() {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = undefined;
    }
  }

  function showMenu() {
    clearOpenTimer();
    clearHideTimer();
    setStyle(getMenuStyle(wrapperRef.current));
    setOpen(true);
  }

  function scheduleShowMenu() {
    clearOpenTimer();
    openTimerRef.current = setTimeout(showMenu, 420);
  }

  function scheduleHideMenu() {
    clearHideTimer();
    hideTimerRef.current = setTimeout(dismiss, 140);
  }

  function cancelHideMenu() {
    clearHideTimer();
  }

  useEffect(() => () => {
    clearOpenTimer();
    clearHideTimer();
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    function updatePosition() {
      setStyle(getMenuStyle(wrapperRef.current));
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const openWindowCount = appWindowCount(app.id, windows);

  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        onMouseEnter: (event: React.MouseEvent) => {
          (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(event);
          cancelHideMenu();
          scheduleShowMenu();
        },
        onMouseLeave: (event: React.MouseEvent) => {
          (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(event);
          clearOpenTimer();
          scheduleHideMenu();
        },
        onContextMenu: (event: React.MouseEvent) => {
          (children.props as { onContextMenu?: (e: React.MouseEvent) => void }).onContextMenu?.(event);
          event.preventDefault();
          showMenu();
        },
      } as Partial<unknown>)
    : children;

  const panel =
    open && style ? (
      <div
        ref={popoverRef}
        id={menuId}
        className={cx(styles.popover, styles.popoverVisible)}
        style={style}
        role="presentation"
        onMouseEnter={cancelHideMenu}
        onMouseLeave={scheduleHideMenu}
      >
        <TrayAppMenuPanel
          app={app}
          active={active}
          running={running}
          profiles={profiles}
          activeProfileId={activeProfileId}
          openWindowCount={openWindowCount}
          optionsOpen={optionsOpen}
          onOptionsEnter={() => setOptionsOpen(true)}
          onOptionsLeave={() => setOptionsOpen(false)}
          onSelectProfile={setActiveProfileId}
          handlers={handlers}
        />
      </div>
    ) : null;

  return (
    <span className={styles.wrapper} ref={wrapperRef}>
      {child}
      {panel ? createPortal(panel, getPortalContainer()) : null}
    </span>
  );
}

export type { TrayAppProfile, TrayAppMenuActionHandlers } from "./tray-menu-data";
