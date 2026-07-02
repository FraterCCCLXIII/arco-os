import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AppIconTile } from "../../../app-tones/AppIconTile";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { MobileHomeWidgetColumn } from "./MobileHomeWidgetColumn";
import type { WidgetTile } from "./widget-types";
import type { DesktopApp } from "./types";
import styles from "./AndroidHomeScreen.module.css";

export interface AndroidHomeScreenProps {
  apps: DesktopApp[];
  widgetColumns?: WidgetTile[][];
  onLaunchApp: (appId: string) => void;
  className?: string;
}

/** Android-style launcher — swipeable widget columns plus a scrollable app grid. */
export function AndroidHomeScreen({
  apps,
  widgetColumns = [],
  onLaunchApp,
  className,
}: AndroidHomeScreenProps) {
  const widgetPageCount = widgetColumns.length;
  const totalPageCount = widgetPageCount + 1;
  const [activePage, setActivePage] = useState(widgetPageCount);
  const swipeStartX = useRef<number | null>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    swipeStartX.current = event.clientX;
  }, []);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (swipeStartX.current === null) return;

      const delta = event.clientX - swipeStartX.current;
      if (Math.abs(delta) > 48) {
        setActivePage((page) => {
          if (delta < 0) return Math.min(totalPageCount - 1, page + 1);
          return Math.max(0, page - 1);
        });
      }
      swipeStartX.current = null;
    },
    [totalPageCount],
  );

  return (
    <div className={cx(styles.screen, className)}>
      <div
        className={styles.carousel}
        style={{ "--active-page": activePage } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {widgetColumns.map((column, columnIndex) => (
          <section key={`widgets-${columnIndex}`} className={cx(styles.page, styles.widgetPage)}>
            <MobileHomeWidgetColumn widgets={column} variant="android" className={styles.widgetColumn} />
          </section>
        ))}

        <section className={cx(styles.page, styles.appsPage)}>
          <div className={styles.searchRow}>
            <Icon name="search" size={16} />
            <span>Search apps</span>
          </div>
          <ul className={styles.grid}>
            {apps.map((app) => (
              <li key={app.id}>
                <button type="button" className={styles.tile} onClick={() => onLaunchApp(app.id)}>
                  <AppIconTile appId={app.id} icon={app.icon} size="xl" className={styles.icon} />
                  <span className={styles.label}>{app.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {totalPageCount > 1 && (
        <div className={styles.pagination} role="tablist" aria-label="Home screen pages">
          {Array.from({ length: totalPageCount }, (_, pageIndex) => (
            <button
              key={`dot-${pageIndex}`}
              type="button"
              role="tab"
              aria-selected={pageIndex === activePage}
              aria-label={pageIndex < widgetPageCount ? `Widgets ${pageIndex + 1}` : "Apps"}
              className={cx(styles.pageDot, pageIndex === activePage && styles.pageDotActive)}
              onClick={() => setActivePage(pageIndex)}
            >
              <span />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
