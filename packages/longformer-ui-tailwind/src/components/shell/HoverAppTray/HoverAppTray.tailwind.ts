/** Tailwind class map — converted from HoverAppTray.module.css */
const styles: Record<string, string> = {
  hoverZone: "absolute bottom-0 left-0 right-0 h-[28px] pointer-events-auto",
  peakHandle: "w-[44px] h-[5px] mb-lf-2 rounded-lf-pill bg-lf-border-strong opacity-0 [transform:scaleX(0.5)] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  trayContainer: "absolute bottom-0 left-0 right-0 flex flex-col items-center p-[0_var(--lf-space-4)_var(--lf-space-3)] [transform:translateY(calc(100%_+_12px))] opacity-0 pointer-events-none transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  trayContainerOpen: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] [transform:translateY(0)] opacity-100 pointer-events-auto",
  trayContainerOpen_peakHandle: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] opacity-0 h-[0] mb-0 [transform:scaleX(0.5)]",
  trayContainerPeaked: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] [transform:translateY(calc(100%_-_18px))]",
  trayContainerPeaked_peakHandle: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] opacity-100 [transform:scaleX(1)]",
  wrapper: "fixed [inset:auto_0_0] z-lf-overlay pointer-events-none",
  wrapperOpen: "inset-0",
  wrapperOpen_hoverZone: "inset-0 h-full",
  wrapperPeaked: "h-[112px]",
  wrapperPeaked_hoverZone: "inset-0 h-auto",
};
export default styles;
