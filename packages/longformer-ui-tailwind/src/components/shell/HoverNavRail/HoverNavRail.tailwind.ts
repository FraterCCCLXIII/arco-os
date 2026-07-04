/** Tailwind class map — converted from HoverNavRail.module.css */
const styles: Record<string, string> = {
  hoverZone: "absolute top-[var(--lf-status-bar-offset,_0px)] bottom-0 left-0 w-[28px] pointer-events-auto",
  rail: "h-full min-h-0",
  railContainer: "absolute top-[var(--lf-status-bar-offset,_0px)] bottom-0 left-0 flex flex-col border-r border-lf-divider bg-lf-surface-canvas shadow-lf-lg [transform:translateX(calc(-100%_-_8px))] opacity-0 pointer-events-none transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  railContainerOpen: "[transform:translateX(0)] opacity-100 pointer-events-auto transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  wrapper: "fixed [inset:0_auto_0_0] z-lf-overlay pointer-events-none",
  wrapperOpen: "inset-0",
  wrapperOpen_hoverZone: "inset-0 top-0 w-full",
};
export default styles;
