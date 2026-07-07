import { Icon } from "longformer-ui";
import { getLongformerDesktop, isLongformerDesktop } from "../lib/desktopBridge";
import styles from "./ElectronTitleBar.module.css";

export interface ElectronTitleBarProps {
  title: string;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

/** Native-style window chrome for the Electron shell — always visible at the top. */
export function ElectronTitleBar({
  title,
  sidebarVisible,
  onToggleSidebar,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}: ElectronTitleBarProps) {
  if (!isLongformerDesktop()) return null;

  const desktop = getLongformerDesktop();
  const platform = desktop?.platform ?? "";
  const platformClass =
    platform === "darwin" ? styles.darwin : platform === "win32" ? styles.win32 : platform ? styles.linux : "";

  return (
    <header className={`${styles.bar} ${platformClass}`.trim()} aria-label="Window title bar">
      <div className={styles.leading}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          aria-pressed={sidebarVisible}
          title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          onClick={onToggleSidebar}
        >
          <Icon name="panel-right" size={15} className={styles.sidebarIcon} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Go back"
          title="Go back"
          disabled={!canGoBack}
          onClick={onBack}
        >
          <Icon name="chevron-left" size={15} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Go forward"
          title="Go forward"
          disabled={!canGoForward}
          onClick={onForward}
        >
          <Icon name="chevron-right" size={15} />
        </button>
      </div>
      <span className={styles.title}>{title}</span>
      {platform && platform !== "darwin" && desktop && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            aria-label="Minimize window"
            onClick={() => void desktop.minimizeWindow()}
          >
            <Icon name="minus" size={12} />
          </button>
          <button
            type="button"
            className={styles.control}
            aria-label="Maximize window"
            onClick={() => void desktop.maximizeWindow()}
          >
            <Icon name="maximize" size={11} />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.controlClose}`}
            aria-label="Close window"
            onClick={() => void desktop.closeWindow()}
          >
            <Icon name="close" size={12} />
          </button>
        </div>
      )}
    </header>
  );
}
