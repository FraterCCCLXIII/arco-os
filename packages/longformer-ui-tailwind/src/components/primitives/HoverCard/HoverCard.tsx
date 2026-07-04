import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import styles from "./HoverCard.tailwind";

export type HoverCardPlacement = "top" | "bottom" | "right";

export interface HoverCardProps {
  content: ReactNode;
  children: ReactElement;
  placement?: HoverCardPlacement;
  /** Delay before the card appears on hover/focus. */
  openDelay?: number;
  className?: string;
}

function getPlacementStyle(trigger: HTMLElement | null, placement: HoverCardPlacement): CSSProperties | undefined {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;

  if (placement === "right") {
    return {
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    };
  }

  if (placement === "bottom") {
    return {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    };
  }

  return {
    top: rect.top - 8,
    left: rect.left + rect.width / 2,
  };
}

/** Rich hover preview card — portaled and positioned to avoid tray overflow clipping. */
export function HoverCard({
  content,
  children,
  placement = "top",
  openDelay = 180,
  className,
}: HoverCardProps) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();

  function clearOpenTimer() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }

  function show() {
    clearOpenTimer();
    openTimerRef.current = setTimeout(() => {
      setStyle(getPlacementStyle(wrapperRef.current, placement));
      setVisible(true);
    }, openDelay);
  }

  function hide() {
    clearOpenTimer();
    setVisible(false);
  }

  useEffect(() => {
    return () => clearOpenTimer();
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;

    function updatePosition() {
      setStyle(getPlacementStyle(wrapperRef.current, placement));
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
        "aria-describedby": visible ? id : undefined,
        onMouseEnter: (event: React.MouseEvent) => {
          (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(event);
          show();
        },
        onMouseLeave: (event: React.MouseEvent) => {
          (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(event);
          hide();
        },
        onFocus: (event: React.FocusEvent) => {
          (children.props as { onFocus?: (e: React.FocusEvent) => void }).onFocus?.(event);
          show();
        },
        onBlur: (event: React.FocusEvent) => {
          (children.props as { onBlur?: (e: React.FocusEvent) => void }).onBlur?.(event);
          hide();
        },
      } as Partial<unknown>)
    : children;

  const card =
    visible && style ? (
      <div
        id={id}
        role="tooltip"
        className={cx(
          styles.card,
          placement === "bottom" && styles.cardBottom,
          placement === "right" && styles.cardRight,
          styles.cardVisible,
          className,
        )}
        style={style}
      >
        {content}
      </div>
    ) : null;

  return (
    <span className={styles.wrapper} ref={wrapperRef}>
      {child}
      {card ? createPortal(card, getPortalContainer()) : null}
    </span>
  );
}
