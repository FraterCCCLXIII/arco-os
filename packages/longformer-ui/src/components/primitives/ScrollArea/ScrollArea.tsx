import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./ScrollArea.module.css";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal" | "both";
}

/** A scrollable region with the kit's thin, theme-aware scrollbar styling. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { direction = "vertical", className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx("lf-scrollbar", styles.scrollArea, direction !== "both" && styles[direction], className)}
      {...rest}
    />
  );
});
