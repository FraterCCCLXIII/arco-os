/** Tailwind class map — converted from HoverAssistantBubble.module.css */
const styles: Record<string, string> = {
  bubble: "inline-flex items-center justify-center w-[44px] h-[44px] border border-solid border-lf-border-default rounded-full bg-lf-surface-overlay text-lf-accent shadow-lf-lg cursor-default [flex-shrink:0] transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] hover:[transform:translateX(-2px)] hover:bg-lf-surface-2 hover:shadow-lf-overlay focus-visible:[transform:translateX(-2px)] focus-visible:bg-lf-surface-2 focus-visible:shadow-lf-overlay",
  bubbleContainer: "absolute top-[50%] right-0 flex items-center justify-end p-[0_var(--lf-space-3)_0_0] [transform:translate(calc(100%_-_14px),_-50%)] opacity-[0.72] pointer-events-auto transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  bubbleContainerOpen: "[transform:translate(0,_-50%)] opacity-100 pointer-events-auto transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  header: "p-[var(--lf-space-2)_var(--lf-space-2)_var(--lf-space-1)] text-lf-xs font-semibold [letter-spacing:0.04em] uppercase text-lf-text-tertiary",
  hoverZone: "absolute top-0 right-0 bottom-0 w-[28px] pointer-events-auto",
  panel: "fixed z-lf-overlay min-w-[220px] max-w-[280px] bg-lf-surface-overlay border border-solid border-lf-border-default rounded-lf-md shadow-lf-lg p-lf-1 flex flex-col gap-[1px] [transform:translateY(-50%)]",
  wrapper: "fixed [inset:0_0_0_auto] z-[calc(var(--lf-z-overlay)_-_1)] w-[48px] pointer-events-none",
  wrapperOpen: "w-[320px]",
  wrapperOpen_hoverZone: "inset-0 w-auto",
};
export default styles;
