import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "../../../utils/cx";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grows with content up to this many pixels tall before scrolling. */
  maxHeight?: number;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { maxHeight = 200, autoResize = true, className, value, onChange, ...rest },
  ref
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, autoResize, maxHeight]);

  return (
    <textarea
      ref={innerRef}
      className={cx("lf-focusable", styles.textarea, className)}
      value={value}
      onChange={onChange}
      rows={1}
      {...rest}
    />
  );
});
