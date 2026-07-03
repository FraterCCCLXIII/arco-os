import { cx } from "../../../utils/cx";
import { APP_PORT_VIEWPORT_LABEL, APP_PORT_VIEWPORT_ORDER, type AppPortViewport } from "./types";
import styles from "./AppPortViewportPicker.module.css";

export interface AppPortViewportPickerProps {
  viewport: AppPortViewport;
  onViewportChange: (viewport: AppPortViewport) => void;
  className?: string;
  items?: AppPortViewport[];
}

/** Segmented control for switching how a single app is presented. */
export function AppPortViewportPicker({
  viewport,
  onViewportChange,
  className,
  items = APP_PORT_VIEWPORT_ORDER,
}: AppPortViewportPickerProps) {
  return (
    <div className={cx(styles.picker, className)} role="tablist" aria-label="App viewport">
      {items.map((value) => (
        <button
          key={value}
          type="button"
          role="tab"
          className={cx("lf-focusable", styles.tab, viewport === value && styles.tabActive)}
          aria-selected={viewport === value}
          onClick={() => onViewportChange(value)}
        >
          {APP_PORT_VIEWPORT_LABEL[value]}
        </button>
      ))}
    </div>
  );
}
