import type { PhoneHomeItem, PhoneHomeLayout } from "../../interactions/PhoneHomeScreen";
import { resolveAppIconHue } from "../../../app-tones/app-tones";
import type { DesktopApp } from "./types";

const APPS_PER_PAGE = 16;

function toPhoneApp(app: DesktopApp): PhoneHomeItem {
  return {
    type: "app",
    app: {
      id: app.id,
      name: app.label,
      icon: app.icon,
      hue: resolveAppIconHue(app.id),
    },
  };
}

/** Maps the desktop app registry into an iOS-style home screen layout. */
export function layoutFromDesktopApps(apps: DesktopApp[]): PhoneHomeLayout {
  const pinned = apps.filter((app) => app.pinned !== false);
  const dockApps = pinned.slice(0, 4);
  const gridApps = apps.filter((app) => !dockApps.some((dockApp) => dockApp.id === app.id));

  const pageItems: PhoneHomeItem[] = gridApps.map((app) => toPhoneApp(app));
  const pages: PhoneHomeItem[][] = [];

  for (let index = 0; index < pageItems.length; index += APPS_PER_PAGE) {
    pages.push(pageItems.slice(index, index + APPS_PER_PAGE));
  }

  if (pages.length === 0) {
    pages.push([]);
  }

  return {
    pages,
    dock: dockApps.map((app) => toPhoneApp(app)),
  };
}
