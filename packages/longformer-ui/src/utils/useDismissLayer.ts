import { useEffect, type RefObject } from "react";

/**
 * Closes a floating layer (menu/modal/tooltip) on outside pointer-down or
 * Escape. Shared by every overlay primitive so the dismiss behavior stays
 * consistent across the kit.
 *
 * Accepts one ref or several: portaled overlays live in two DOM subtrees
 * (trigger in place, panel in the portal root), and a pointer-down inside
 * either one must not dismiss.
 */
export function useDismissLayer(
  active: boolean,
  onDismiss: () => void,
  containerRef: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event: PointerEvent) {
      const refs = Array.isArray(containerRef) ? containerRef : [containerRef];
      const target = event.target as Node;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) onDismiss();
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
