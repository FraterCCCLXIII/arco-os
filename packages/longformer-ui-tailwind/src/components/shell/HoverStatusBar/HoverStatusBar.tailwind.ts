/** Tailwind class map — converted from HoverStatusBar.module.css */
const styles: Record<string, string> = {
  bar: "w-full",
  barContainer: "absolute top-0 left-0 right-0 flex flex-col [transform:translateY(calc(-100%_-_8px))] opacity-0 pointer-events-none transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  barContainerOpen: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] [transform:translateY(0)] opacity-100 pointer-events-auto",
  barContainerOpen_peakLine: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] opacity-0 h-[0] mb-0 [transform:scaleX(0.35)]",
  barContainerPeaked: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] [transform:translateY(calc(-100%_+_2px))] opacity-100",
  barContainerPeaked_peakLine: "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] w-[min(240px,_42vw)] opacity-100 [transform:scaleX(1)]",
  hoverZone: "absolute top-0 left-0 right-0 pointer-events-auto",
  peakLine: "[flex-shrink:0] h-[2px] m-[0_auto_var(--lf-space-1)] rounded-lf-pill bg-[linear-gradient(_90deg,_transparent_0%,_var(--lf-border-strong)_18%,_var(--lf-border-strong)_82%,_transparent_100%_)] opacity-0 [transform:scaleX(0.35)] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  wrapper: "fixed [inset:0_0_auto] z-lf-overlay pointer-events-none",
  wrapperOpen: "inset-0",
  wrapperOpen_hoverZone: "inset-0 h-full",
};
export default styles;
