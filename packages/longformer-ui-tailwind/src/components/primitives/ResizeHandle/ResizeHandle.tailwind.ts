/** Tailwind class map — converted from ResizeHandle.module.css */
const styles: Record<string, string> = {
  active: "before:before:bg-lf-accent-muted",
  active_grip: "bg-lf-accent",
  grip: "block rounded-lf-pill bg-lf-divider transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  handle: "relative [flex-shrink:0] flex items-center justify-center z-[2] [touch-action:none] hover:bg-lf-accent focus-visible:bg-lf-accent before:before:[content:\"\"] before:before:absolute before:before:inset-0 before:before:rounded-lf-sm before:before:bg-transparent before:before:transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] before:before:hover:bg-lf-accent-muted before:before:focus-visible:bg-lf-accent-muted",
  horizontal: "h-[10px] w-full m-[-4px_0] [cursor:row-resize] hover:h-[2px] focus-visible:h-[2px]",
  horizontal_active_grip: "h-[2px]",
  horizontal_grip: "w-full h-[1px]",
  vertical: "w-[10px] m-[0_-4px] [cursor:col-resize] self-stretch hover:w-[2px] focus-visible:w-[2px]",
  vertical_active_grip: "w-[2px]",
  vertical_grip: "w-[1px] self-stretch",
};
export default styles;
