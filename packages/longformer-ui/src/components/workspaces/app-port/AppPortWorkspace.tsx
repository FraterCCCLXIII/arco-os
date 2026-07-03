import { useState } from "react";
import { Icon } from "../../../icons";
import { AppPortFrame } from "./AppPortFrame";
import { AppPortThemePicker } from "./AppPortThemePicker";
import { AppPortViewportPicker } from "./AppPortViewportPicker";
import { SampleAppPortApp } from "./SampleAppPortApp";
import type { AppPortViewport } from "./types";
import styles from "./AppPortWorkspace.module.css";

export interface AppPortWorkspaceProps {
  title?: string;
  initialViewport?: AppPortViewport;
}

/**
 * Preview a single app across desktop, tablet, modal, phone, and watch viewports.
 * Uses shared adaptive layout primitives so navigation and panes reflow correctly.
 */
export function AppPortWorkspace({ title = "App Port", initialViewport = "desktop" }: AppPortWorkspaceProps) {
  const [viewport, setViewport] = useState<AppPortViewport>(initialViewport);

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.titleIcon}>
            <Icon name="app-window" size={18} />
          </span>
          <div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>
              Preview one app as it reflows across desktop, tablet, modal, phone, and watch using shared navigation and
              pane components.
            </p>
          </div>
        </div>

        <div className={styles.headerControls}>
          <AppPortThemePicker />
          <AppPortViewportPicker viewport={viewport} onViewportChange={setViewport} />
        </div>
      </header>

      <AppPortFrame viewport={viewport} windowTitle="Projects" windowIcon="layers">
        <SampleAppPortApp viewport={viewport} />
      </AppPortFrame>
    </div>
  );
}
