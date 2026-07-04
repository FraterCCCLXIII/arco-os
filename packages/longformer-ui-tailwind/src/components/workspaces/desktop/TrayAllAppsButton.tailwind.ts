/** Tailwind class map — converted from TrayAllAppsButton.module.css */
const styles: Record<string, string> = {
  allAppsButton: "relative inline-flex items-center justify-center [flex-shrink:0] border-none bg-transparent text-lf-text-secondary cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] hover:text-lf-text-primary",
  allAppsButtonDock: "w-[44px] h-[44px] rounded-[12px] hover:[transform:translateY(-2px)]",
  allAppsButtonOpen: "text-lf-accent",
  allAppsButtonStart: "w-[40px] h-[40px] rounded-lf-sm hover:bg-[var(--lf-desktop-chrome-hover)]",
  allAppsButtonTaskbar: "w-[44px] h-[40px] rounded-lf-sm hover:bg-[var(--lf-desktop-chrome-hover)]",
  allAppsCount: "absolute top-[4px] right-[4px] min-w-[14px] h-[14px] p-[0_3px] rounded-lf-pill bg-lf-accent text-lf-text-on-accent text-[9px] font-semibold leading-[14px] text-center",
  empty: "p-[var(--lf-space-4)_var(--lf-space-3)] text-lf-sm text-lf-text-tertiary text-center",
  header: "[flex-shrink:0] p-[var(--lf-space-3)_var(--lf-space-3)_var(--lf-space-2)] border-b border-lf-divider",
  list: "flex-1 min-h-0 overflow-y-auto p-lf-2 flex flex-col gap-[2px]",
  panel: "fixed z-lf-overlay w-[260px] max-h-[min(420px,_calc(100vh_-_24px))] flex flex-col rounded-lf-lg border border-solid border-lf-border-default bg-lf-surface-overlay shadow-lf-lg overflow-hidden",
  pinButton: "inline-flex items-center justify-center w-[28px] h-[28px] [flex-shrink:0] border-none rounded-lf-sm bg-transparent text-lf-text-tertiary cursor-pointer hover:bg-lf-surface-3 hover:text-lf-accent",
  row: "flex items-center gap-[2px]",
  rowActive: "bg-lf-accent-muted text-lf-text-primary",
  rowDragging: "opacity-0",
  rowIcon: "flex [flex-shrink:0]",
  rowLabel: "flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-lf-sm",
  rowMain: "flex items-center gap-lf-2 flex-1 min-w-0 min-h-[36px] p-[0_var(--lf-space-2)] border-none rounded-lf-md bg-transparent text-lf-text-secondary cursor-grab text-left [touch-action:none] hover:bg-lf-surface-2 hover:text-lf-text-primary active:[cursor:grabbing]",
  searchInput: "text-lf-sm",
  startMark: "w-[14px] h-[14px] rounded-[1px] bg-[linear-gradient(to_right,_#0078d4_0_50%,_#50a0e8_50%_100%)_top_/_100%_50%_no-repeat,_linear-gradient(to_right,_#0078d4_0_50%,_#50a0e8_50%_100%)_bottom_/_100%_50%_no-repeat]",
  wrapper: "relative flex [flex-shrink:0]",
};
export default styles;
