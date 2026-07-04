import { cx } from "../../../utils/cx";
import { WidgetRenderer } from "./WidgetRenderer";
import type { WidgetTile } from "./widget-types";
import styles from "./MobileHomeWidgetColumn.tailwind";

export interface MobileHomeWidgetColumnProps {
  widgets: WidgetTile[];
  variant?: "ios" | "android";
  className?: string;
}

/** One swipeable column of stacked widgets on a phone home screen. */
export function MobileHomeWidgetColumn({
  widgets,
  variant = "ios",
  className,
}: MobileHomeWidgetColumnProps) {
  return (
    <div className={cx(styles.column, styles[variant], className)}>
      {widgets.map((widget) => (
        <div key={widget.id} className={styles.slot}>
          <WidgetRenderer content={widget.content} />
        </div>
      ))}
    </div>
  );
}
