import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Kbd.tailwind";

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

/** Inline keyboard key badge for shortcut hints. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, children, ...rest }, ref) {
  return (
    <kbd ref={ref} className={cx(styles.kbd, className)} {...rest}>
      {children}
    </kbd>
  );
});
