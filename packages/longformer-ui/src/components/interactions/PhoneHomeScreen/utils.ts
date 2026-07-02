import type { PhoneApp, PhoneFolder, PhoneHomeItem, PhoneHomeLayout, PhoneHomeLocation } from "./types";
import { APP_ICON_HUES, resolveAppIconHue, type AppIconHue } from "../../../app-tones/app-tones";

/** @deprecated Demo-only gradients — prefer `AppIconTile` with canonical hues. */
export const ICON_GRADIENTS: readonly [string, string][] = [
  ["#eddf44", "#ecba45"],
  ["#82e8d1", "#25ce93"],
  ["#ff9eed", "#e06bfe"],
  ["#c5ca6c", "#4ebf63"],
  ["#be75ff", "#a43ffd"],
  ["#ffaa44", "#ff8f44"],
  ["#ff7074", "#fe5242"],
  ["#70e4ff", "#0aa5ff"],
];

const GRID_COLS = 4;
const GRID_STEP_X = 76;
const GRID_ORIGIN_X = -8;
const GRID_STEP_Y = 87;
const GRID_ORIGIN_Y = 106;
const DOCK_ORIGIN_Y = -359;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let idCounter = 0;

export function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function demoHue(seed: number): AppIconHue {
  return APP_ICON_HUES[seed % APP_ICON_HUES.length] ?? "blue";
}

function createApp(colorSeed: number): PhoneApp {
  return {
    id: nextId("app"),
    name: "App",
    icon: "app-window",
    hue: demoHue(colorSeed),
    colorIndex: colorSeed % ICON_GRADIENTS.length,
  };
}

function createFolder(colorSeed: number): PhoneHomeItem {
  const apps = Array.from({ length: rand(2, 9) }, (_, index) => createApp(colorSeed + index));
  return {
    type: "folder",
    folder: {
      id: nextId("folder"),
      name: "Folder",
      apps,
    },
  };
}

/** Builds a demo layout matching the original CodePen structure. */
export function createDefaultPhoneHomeLayout(pageCount = 2): PhoneHomeLayout {
  idCounter = 0;
  const pages: PhoneHomeItem[][] = [];

  for (let page = 0; page < pageCount; page += 1) {
    const items: PhoneHomeItem[] = [];
    for (let app = 0; app < rand(4, 10); app += 1) {
      items.push({ type: "app", app: createApp(page * 20 + app) });
    }
    for (let folder = 0; folder < rand(4, 10); folder += 1) {
      items.push(createFolder(page * 20 + folder + 10));
    }
    pages.push(items);
  }

  const dock: PhoneHomeItem[] = [];
  const dockFolders = rand(1, 2);
  for (let folder = 0; folder < dockFolders; folder += 1) {
    dock.push(createFolder(100 + folder));
  }
  for (let app = 0; app < 4 - dockFolders; app += 1) {
    dock.push({ type: "app", app: createApp(200 + app) });
  }

  return { pages, dock };
}

/** Legacy gradient helper for demo apps without icon metadata. */
export function gradientForApp(app: PhoneApp) {
  if (app.hue) {
    return `linear-gradient(155deg, var(--lf-app-hue-${app.hue}-from), var(--lf-app-hue-${app.hue}-to))`;
  }
  const pair = ICON_GRADIENTS[(app.colorIndex ?? 0) % ICON_GRADIENTS.length];
  return `linear-gradient(${pair[0]}, ${pair[1]})`;
}

export function phoneAppHue(app: PhoneApp): AppIconHue {
  return app.hue ?? resolveAppIconHue(app.id);
}

export function folderOpenTransform(location: PhoneHomeLocation) {
  const index = location.itemIndex;
  const col = index % GRID_COLS;
  const row = Math.floor(index / GRID_COLS);
  const x = GRID_ORIGIN_X - GRID_STEP_X * col;
  const y =
    location.zone === "dock"
      ? DOCK_ORIGIN_Y
      : GRID_ORIGIN_Y - GRID_STEP_Y * row;

  return { x, y, nameY: y - 376 };
}

export function getItemAt(layout: PhoneHomeLayout, location: PhoneHomeLocation): PhoneHomeItem | undefined {
  if (location.zone === "dock") {
    return layout.dock[location.itemIndex];
  }
  return layout.pages[location.pageIndex ?? 0]?.[location.itemIndex];
}

function cloneLayout(layout: PhoneHomeLayout): PhoneHomeLayout {
  return {
    pages: layout.pages.map((page) => page.map((item) => structuredClone(item))),
    dock: layout.dock.map((item) => structuredClone(item)),
  };
}

function removeAt<T>(list: T[], index: number): T {
  const [removed] = list.splice(index, 1);
  return removed;
}

function appsFromItem(item: PhoneHomeItem): PhoneApp[] {
  return item.type === "app" ? [item.app] : [...item.folder.apps];
}

function folderFromApps(apps: PhoneApp[], name = "Folder"): PhoneFolder {
  return {
    id: nextId("folder"),
    name,
    apps,
  };
}

/**
 * Drag one icon onto another to create or grow a folder. Returns null when
 * the drop is invalid (same item, empty target, etc.).
 */
export function mergeHomeItems(
  layout: PhoneHomeLayout,
  source: PhoneHomeLocation,
  target: PhoneHomeLocation,
): PhoneHomeLayout | null {
  const sameLocation =
    source.zone === target.zone &&
    source.itemIndex === target.itemIndex &&
    (source.zone === "dock" || source.pageIndex === target.pageIndex);

  if (sameLocation) return null;

  const next = cloneLayout(layout);
  const sourceList =
    source.zone === "dock" ? next.dock : next.pages[source.pageIndex ?? 0];
  const targetList =
    target.zone === "dock" ? next.dock : next.pages[target.pageIndex ?? 0];

  if (!sourceList || !targetList) return null;

  const sourceItem = sourceList[source.itemIndex];
  const targetItem = targetList[target.itemIndex];
  if (!sourceItem || !targetItem) return null;

  const mergedApps = [...appsFromItem(targetItem), ...appsFromItem(sourceItem)];
  const folderName = targetItem.type === "folder" ? targetItem.folder.name : "Folder";
  const mergedFolder: PhoneHomeItem = {
    type: "folder",
    folder: folderFromApps(mergedApps, folderName),
  };

  const sameList =
    source.zone === target.zone &&
    (source.zone === "dock" || source.pageIndex === target.pageIndex);

  if (sameList) {
    let targetIndex = target.itemIndex;
    const sourceIndex = source.itemIndex;

    if (sourceIndex < targetIndex) {
      removeAt(sourceList, sourceIndex);
      targetIndex -= 1;
    } else {
      removeAt(sourceList, sourceIndex);
    }

    sourceList[targetIndex] = mergedFolder;
  } else {
    targetList[target.itemIndex] = mergedFolder;
    removeAt(sourceList, source.itemIndex);
  }

  return next;
}
