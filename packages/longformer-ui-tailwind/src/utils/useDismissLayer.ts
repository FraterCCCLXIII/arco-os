import { useEffect, type RefObject } from "react";

/**
 * Closes a floating layer (menu/modal/tooltip) on outside pointer-down or
 * Escape. Shared by every overlay primitive so the dismiss behavior stays
 * consistent across the kit.
 */
export function useDismissLayer(
  active: boolean,
  onDismiss: () => void,
  containerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onDismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onDismiss, containerRef]);
}
