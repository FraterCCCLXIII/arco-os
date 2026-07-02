import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render at a fixed square size with no horizontal padding, for icon-only buttons. */
  iconOnly?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", iconOnly = false, fullWidth = false, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cx(
        "lf-focusable",
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
