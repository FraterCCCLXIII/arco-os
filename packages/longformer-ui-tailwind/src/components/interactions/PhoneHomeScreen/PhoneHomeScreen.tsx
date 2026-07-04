/**
 * PhoneHomeScreen — a self-contained iOS-style launcher interaction.
 *
 * Supports multi-page grids, dock icons, folder open/close with backdrop
 * blur, and drag-one-icon-onto-another to create or grow folders.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cx } from "../../../utils/cx";
import { AppIconTile } from "../../../app-tones/AppIconTile";
import { MobileHomeWidgetColumn } from "../../workspaces/desktop/MobileHomeWidgetColumn";
import {
  createDefaultPhoneHomeLayout,
  folderOpenTransform,
  gradientForApp,
  mergeHomeItems,
  phoneAppHue,
} from "./utils";
import type {
  PhoneApp,
  PhoneHomeItem,
  PhoneHomeLayout,
  PhoneHomeLocation,
  PhoneHomeScreenProps,
} from "./types";
import styles from "./PhoneHomeScreen.tailwind";

const DRAG_THRESHOLD = 8;

interface DragState {
  source: PhoneHomeLocation;
  item: PhoneHomeItem;
  pointerId: number;
  startX: number;
  startY: number;
  ghostX: number;
  ghostY: number;
  active: boolean;
}

interface OpenFolderState extends PhoneHomeLocation {}

function locationKey(location: PhoneHomeLocation) {
  return location.zone === "page"
    ? `page-${location.pageIndex}-${location.itemIndex}`
    : `dock-${location.itemIndex}`;
}

function AppIconView({
  app,
  className,
  dragging,
}: {
  app: PhoneApp;
  className?: string;
  dragging?: boolean;
}) {
  if (app.icon) {
    return (
      <AppIconTile
        appId={app.id}
        icon={app.icon}
        hue={phoneAppHue(app)}
        size="xl"
        surface="solid"
        className={cx(styles.appIcon, dragging && styles.dragging, className)}
      />
    );
  }

  return (
    <div
      className={cx(styles.appIcon, dragging && styles.dragging, className)}
      style={{ backgroundImage: gradientForApp(app) }}
      aria-hidden="true"
    />
  );
}

function HomeItemView({
  item,
  location,
  openFolder,
  dropTarget,
  draggingSource,
  onOpenFolder,
  onCloseFolder,
  onPointerDown,
  dragActive,
  onAppLaunch,
}: {
  item: PhoneHomeItem;
  location: PhoneHomeLocation;
  openFolder: OpenFolderState | null;
  dropTarget: PhoneHomeLocation | null;
  draggingSource: PhoneHomeLocation | null;
  onOpenFolder: (location: PhoneHomeLocation) => void;
  onCloseFolder: () => void;
  onPointerDown: (event: ReactPointerEvent, location: PhoneHomeLocation, item: PhoneHomeItem) => void;
  dragActive: boolean;
  onAppLaunch?: (appId: string) => void;
}) {
  const key = locationKey(location);
  const isOpen =
    openFolder &&
    openFolder.zone === location.zone &&
    openFolder.itemIndex === location.itemIndex &&
    (location.zone === "dock" || openFolder.pageIndex === location.pageIndex);

  const isDropTarget =
    dropTarget &&
    dropTarget.zone === location.zone &&
    dropTarget.itemIndex === location.itemIndex &&
    (location.zone === "dock" || dropTarget.pageIndex === location.pageIndex);

  const isDraggingSource =
    draggingSource &&
    draggingSource.zone === location.zone &&
    draggingSource.itemIndex === location.itemIndex &&
    (location.zone === "dock" || draggingSource.pageIndex === location.pageIndex);

  const openStyle = isOpen ? folderOpenTransform(location) : null;

  if (item.type === "app") {
    return (
      <div
        className={cx(styles.app, isDropTarget && styles.dropTarget, isDraggingSource && styles.draggingSource)}
        data-home-item={key}
      >
        <button
          type="button"
          className={styles.appIconButton}
          aria-label={item.app.name}
          onPointerDown={(event) => onPointerDown(event, location, item)}
        >
          <AppIconView app={item.app} />
        </button>
        <div className={styles.appName}>{item.app.name}</div>
      </div>
    );
  }

  return (
    <div
      className={cx(styles.folder, isDropTarget && styles.dropTarget, isDraggingSource && styles.draggingSource)}
      data-home-item={key}
      style={
        isOpen
          ? ({
              "--folder-x": `${openStyle?.x ?? 0}px`,
              "--folder-y": `${openStyle?.y ?? 0}px`,
              "--folder-name-y": `${openStyle?.nameY ?? 0}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <button
        type="button"
        className={cx(styles.folderApps, isOpen && styles.folderAppsOpen)}
        aria-label={`${item.folder.name}, ${item.folder.apps.length} apps`}
        aria-expanded={Boolean(isOpen)}
        onClick={() => {
          if (dragActive) return;
          isOpen ? onCloseFolder() : onOpenFolder(location);
        }}
        onPointerDown={(event) => onPointerDown(event, location, item)}
      >
        {item.folder.apps.map((app) => (
          <div key={app.id} className={styles.folderMiniApp}>
            <button
              type="button"
              className={styles.folderMiniButton}
              aria-label={app.name}
              onClick={(event) => {
                event.stopPropagation();
                if (dragActive) return;
                onAppLaunch?.(app.id);
              }}
            >
              <AppIconView app={app} className={styles.folderMiniIcon} />
              <div className={styles.folderMiniName}>{app.name}</div>
            </button>
          </div>
        ))}
      </button>
      <div
        className={cx(styles.bgBlur, isOpen && styles.bgBlurVisible)}
        onClick={onCloseFolder}
        aria-hidden="true"
      />
      <div className={cx(styles.folderName, isOpen && styles.folderNameOpen)}>{item.folder.name}</div>
    </div>
  );
}

export function PhoneHomeScreen({
  layout: layoutProp,
  pageCount = 2,
  widgetColumns = [],
  carrier = "No Service",
  wallpaperUrl,
  className,
  fill = false,
  hideStatusBar = false,
  showHint = true,
  onLayoutChange,
  onAppLaunch,
}: PhoneHomeScreenProps) {
  const [layout, setLayout] = useState<PhoneHomeLayout>(
    () => layoutProp ?? createDefaultPhoneHomeLayout(pageCount),
  );
  const widgetPageCount = widgetColumns.length;
  const totalPageCount = widgetPageCount + layout.pages.length;
  const [activePage, setActivePage] = useState(widgetPageCount);
  const [openFolder, setOpenFolder] = useState<OpenFolderState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<PhoneHomeLocation | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);

  const clock = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    [],
  );

  useEffect(() => {
    if (layoutProp) setLayout(layoutProp);
  }, [layoutProp]);

  useEffect(() => {
    setActivePage((page) => Math.min(Math.max(widgetPageCount, page), totalPageCount - 1));
  }, [totalPageCount, widgetPageCount]);

  const onWidgetPage = activePage < widgetPageCount;

  const updateLayout = useCallback(
    (next: PhoneHomeLayout) => {
      setLayout(next);
      onLayoutChange?.(next);
    },
    [onLayoutChange],
  );

  const resolveDropTarget = useCallback((clientX: number, clientY: number, sourceKey: string) => {
    const element = document.elementFromPoint(clientX, clientY);
    const host = element?.closest<HTMLElement>("[data-home-item]");
    if (!host || !screenRef.current?.contains(host)) {
      return null;
    }

    const key = host.dataset.homeItem;
    if (!key || key === sourceKey) return null;

    if (key.startsWith("page-")) {
      const [, pageIndex, itemIndex] = key.split("-");
      return { zone: "page", pageIndex: Number(pageIndex), itemIndex: Number(itemIndex) } satisfies PhoneHomeLocation;
    }

    const itemIndex = Number(key.replace("dock-", ""));
    return { zone: "dock", itemIndex } satisfies PhoneHomeLocation;
  }, []);

  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    dragRef.current = dragState;
  }, [dragState]);

  const finishDrag = useCallback(
    (state: DragState, clientX: number, clientY: number) => {
      const sourceKey = locationKey(state.source);
      const target = resolveDropTarget(clientX, clientY, sourceKey);

      if (target && state.active) {
        const next = mergeHomeItems(layout, state.source, target);
        if (next) {
          updateLayout(next);
          setOpenFolder(null);
        }
      }

      setDragState(null);
      setDropTarget(null);
      document.body.style.userSelect = "";
    },
    [layout, resolveDropTarget, updateLayout],
  );

  const onItemPointerDown = useCallback(
    (event: ReactPointerEvent, location: PhoneHomeLocation, item: PhoneHomeItem) => {
      if (event.button !== 0) return;

      setOpenFolder(null);

      const initial: DragState = {
        source: location,
        item,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        ghostX: event.clientX,
        ghostY: event.clientY,
        active: false,
      };

      setDragState(initial);
      dragRef.current = initial;

      const target = event.currentTarget;

      function onPointerMove(ev: PointerEvent) {
        const current = dragRef.current;
        if (!current || ev.pointerId !== current.pointerId) return;

        const dx = ev.clientX - current.startX;
        const dy = ev.clientY - current.startY;
        const distance = Math.hypot(dx, dy);

        if (!current.active && distance >= DRAG_THRESHOLD) {
          document.body.style.userSelect = "none";
        }

        const sourceKey = locationKey(current.source);
        const drop = distance >= DRAG_THRESHOLD ? resolveDropTarget(ev.clientX, ev.clientY, sourceKey) : null;

        const next: DragState = {
          ...current,
          active: distance >= DRAG_THRESHOLD,
          ghostX: ev.clientX,
          ghostY: ev.clientY,
        };

        dragRef.current = next;
        setDragState(next);
        setDropTarget(drop);
      }

      function onPointerUp(ev: PointerEvent) {
        const current = dragRef.current;
        if (!current || ev.pointerId !== current.pointerId) return;

        if (!current.active && current.item.type === "app") {
          onAppLaunch?.(current.item.app.id);
        }

        if (current.active) {
          ev.preventDefault();
          ev.stopPropagation();
        }

        finishDrag(current, ev.clientX, ev.clientY);
        dragRef.current = null;
        target.releasePointerCapture(ev.pointerId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }

      target.setPointerCapture(event.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [finishDrag, onAppLaunch, resolveDropTarget],
  );

  const onPagesPointerDown = useCallback((event: ReactPointerEvent) => {
    if (dragState?.active) return;
    swipeStartX.current = event.clientX;
  }, [dragState?.active]);

  const onPagesPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (dragState?.active || swipeStartX.current === null) return;

      const delta = event.clientX - swipeStartX.current;
      if (Math.abs(delta) > 48) {
        setActivePage((page) => {
          if (delta < 0) return Math.min(totalPageCount - 1, page + 1);
          return Math.max(0, page - 1);
        });
        setOpenFolder(null);
      }
      swipeStartX.current = null;
    },
    [dragState?.active, totalPageCount],
  );

  const screenStyle = {
    "--active-page": activePage,
    ...(wallpaperUrl ? { "--phone-wallpaper": `url(${wallpaperUrl})` } : {}),
  } as CSSProperties;

  const ghostApp =
    dragState?.item.type === "app"
      ? dragState.item.app
      : dragState?.item.type === "folder"
        ? dragState.item.folder.apps[0]
        : null;

  return (
    <div
      ref={screenRef}
      className={cx(styles.screen, fill && styles.fill, className)}
      style={screenStyle}
    >
      {!hideStatusBar && (
        <div className={styles.status} aria-hidden="true">
          <div className={styles.carrier}>{carrier}</div>
          <div className={styles.clock}>{clock}</div>
          <div className={styles.batteryMeter}>
            <div className={styles.batteryMeterInner} />
          </div>
        </div>
      )}

      <div
        className={styles.pages}
        onPointerDown={onPagesPointerDown}
        onPointerUp={onPagesPointerUp}
      >
        {widgetColumns.map((column, columnIndex) => (
          <div key={`widgets-${columnIndex}`} className={cx(styles.page, styles.widgetPage)}>
            <MobileHomeWidgetColumn widgets={column} />
          </div>
        ))}
        {layout.pages.map((page, pageIndex) => (
          <div key={`page-${pageIndex}`} className={styles.page}>
            {page.map((item, itemIndex) => (
              <HomeItemView
                key={locationKey({ zone: "page", pageIndex, itemIndex })}
                item={item}
                location={{ zone: "page", pageIndex, itemIndex }}
                openFolder={openFolder}
                dropTarget={dropTarget}
                draggingSource={dragState?.active ? dragState.source : null}
                onOpenFolder={setOpenFolder}
                onCloseFolder={() => setOpenFolder(null)}
                onPointerDown={onItemPointerDown}
                dragActive={Boolean(dragState?.active)}
                onAppLaunch={onAppLaunch}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.pagination} role="tablist" aria-label="Home screen pages">
        {Array.from({ length: totalPageCount }, (_, pageIndex) => (
          <button
            key={`dot-${pageIndex}`}
            type="button"
            role="tab"
            aria-selected={pageIndex === activePage}
            aria-label={pageIndex < widgetPageCount ? `Widgets ${pageIndex + 1}` : `Page ${pageIndex - widgetPageCount + 1}`}
            className={cx(styles.pageDot, pageIndex === activePage && styles.pageDotActive)}
            onClick={() => {
              setActivePage(pageIndex);
              setOpenFolder(null);
            }}
          >
            <span />
          </button>
        ))}
      </div>

      <div className={styles.bottomBar}>
        {layout.dock.map((item, itemIndex) => (
          <HomeItemView
            key={locationKey({ zone: "dock", itemIndex })}
            item={item}
            location={{ zone: "dock", itemIndex }}
            openFolder={openFolder}
            dropTarget={dropTarget}
            draggingSource={dragState?.active ? dragState.source : null}
            onOpenFolder={setOpenFolder}
            onCloseFolder={() => setOpenFolder(null)}
            onPointerDown={onItemPointerDown}
            dragActive={Boolean(dragState?.active)}
            onAppLaunch={onAppLaunch}
          />
        ))}
      </div>

      {dragState?.active && ghostApp && (
        <div
          className={styles.dragGhost}
          style={{ left: dragState.ghostX, top: dragState.ghostY }}
          aria-hidden="true"
        >
          <AppIconView app={ghostApp} className={styles.dragGhostIcon} dragging />
        </div>
      )}

      {showHint && !onWidgetPage && (
        <div className={styles.hint}>Drag an icon onto another to create a folder</div>
      )}
    </div>
  );
}

export type { PhoneApp, PhoneFolder, PhoneHomeItem, PhoneHomeLayout, PhoneHomeScreenProps } from "./types";
export { createDefaultPhoneHomeLayout } from "./utils";
