import { cx } from "../../../utils/cx";
import styles from "./ResizeHandle.tailwind";

export interface ResizeHandleProps {
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  active?: boolean;
  /** Vertical splits resize width; horizontal splits resize height. */
  orientation?: "vertical" | "horizontal";
  className?: string;
  label?: string;
}

/** A hover-reactive drag grip for resizing adjacent columns or rows. */
export function ResizeHandle({
  onPointerDown,
  active = false,
  orientation = "vertical",
  className,
  label = "Resize",
}: ResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      tabIndex={0}
      className={cx(
        "lf-focusable",
        styles.handle,
        styles[orientation],
        active && styles.active,
        className,
      )}
      onPointerDown={onPointerDown}
    >
      <span className={styles.grip} aria-hidden="true" />
    </div>
  );
}
