import { useMemo } from "react";
import { PhoneHomeScreen } from "../../interactions/PhoneHomeScreen";
import { AndroidHomeScreen } from "./AndroidHomeScreen";
import { layoutFromDesktopApps } from "./mobileHomeLayout";
import type { DesktopApp, DesktopShell } from "./types";
import styles from "./MobileHomeScreen.module.css";

export interface MobileHomeScreenProps {
  shell: DesktopShell;
  apps: DesktopApp[];
  onLaunchApp: (appId: string) => void;
}

/** Platform-specific phone launcher shown when no app is in the foreground. */
export function MobileHomeScreen({ shell, apps, onLaunchApp }: MobileHomeScreenProps) {
  const iosLayout = useMemo(() => layoutFromDesktopApps(apps), [apps]);

  if (shell === "android") {
    return <AndroidHomeScreen apps={apps} onLaunchApp={onLaunchApp} className={styles.home} />;
  }

  return (
    <PhoneHomeScreen
      layout={iosLayout}
      className={styles.home}
      fill
      hideStatusBar
      showHint={false}
      onAppLaunch={onLaunchApp}
    />
  );
}
