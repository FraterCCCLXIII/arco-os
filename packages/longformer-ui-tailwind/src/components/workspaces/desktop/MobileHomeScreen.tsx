import { useMemo } from "react";
import { PhoneHomeScreen } from "../../interactions/PhoneHomeScreen";
import { AndroidHomeScreen } from "./AndroidHomeScreen";
import { layoutFromDesktopApps } from "./mobileHomeLayout";
import { splitWidgetsIntoColumns } from "./mobileHomeWidgets";
import type { WidgetTile } from "./widget-types";
import type { DesktopApp, DesktopShell } from "./types";
import styles from "./MobileHomeScreen.tailwind";

export interface MobileHomeScreenProps {
  shell: DesktopShell;
  apps: DesktopApp[];
  widgetTiles?: WidgetTile[];
  onLaunchApp: (appId: string) => void;
}

/** Platform-specific phone launcher shown when no app is in the foreground. */
export function MobileHomeScreen({ shell, apps, widgetTiles = [], onLaunchApp }: MobileHomeScreenProps) {
  const iosLayout = useMemo(() => layoutFromDesktopApps(apps), [apps]);
  const widgetColumns = useMemo(() => splitWidgetsIntoColumns(widgetTiles), [widgetTiles]);

  if (shell === "android") {
    return (
      <AndroidHomeScreen
        apps={apps}
        widgetColumns={widgetColumns}
        onLaunchApp={onLaunchApp}
        className={styles.home}
      />
    );
  }

  return (
    <PhoneHomeScreen
      layout={iosLayout}
      widgetColumns={widgetColumns}
      className={styles.home}
      fill
      hideStatusBar
      showHint={false}
      onAppLaunch={onLaunchApp}
    />
  );
}
