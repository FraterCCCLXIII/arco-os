import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import styles from "./Tooltip.tailwind";

export type TooltipPlacement = "top" | "right";

export interface TooltipProps {
  label: string;
  children: ReactElement;
  placement?: TooltipPlacement;
}

function getRightPlacementStyle(trigger: HTMLElement | null): CSSProperties | undefined {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;
  return {
    top: rect.top + rect.height / 2,
    left: rect.right + 6,
  };
}

/** Simple hover/focus tooltip. Adds aria-describedby to the wrapped element. */
export function Tooltip({ label, children, placement = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  const show = () => {
    if (placement === "right") {
      setStyle(getRightPlacementStyle(wrapperRef.current));
    }
    setVisible(true);
  };

  const hide = () => setVisible(false);

  useLayoutEffect(() => {
    if (!visible || placement !== "right") return;

    function updatePosition() {
      setStyle(getRightPlacementStyle(wrapperRef.current));
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible, placement]);

  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": id,
        onMouseEnter: (event: React.MouseEvent) => {
          (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(event);
          show();
        },
        onMouseLeave: (event: React.MouseEvent) => {
          (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(event);
          hide();
        },
        onFocus: show,
        onBlur: hide,
      } as Partial<unknown>)
    : children;

  const bubble =
    visible && (placement !== "right" || style) ? (
      <span
        id={id}
        role="tooltip"
        className={cx(styles.bubble, placement === "right" ? styles.bubbleRight : styles.bubbleTop)}
        style={placement === "right" ? style : undefined}
      >
        {label}
      </span>
    ) : null;

  return (
    <span className={styles.wrapper} ref={wrapperRef}>
      {child}
      {placement === "right" && bubble ? createPortal(bubble, getPortalContainer()) : bubble}
    </span>
  );
}
