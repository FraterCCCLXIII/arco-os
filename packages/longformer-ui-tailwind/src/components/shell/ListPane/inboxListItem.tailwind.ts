/** Tailwind class map — converted from inboxListItem.module.css */
const styles: Record<string, string> = {
  body: "flex-1 min-w-0 overflow-hidden flex flex-col",
  preview: "block min-w-0 mt-[3px] text-lf-sm text-lf-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap leading-[var(--lf-line-height-tight)]",
  primary: "flex-1 min-w-0 text-lf-md font-semibold text-lf-text-primary overflow-hidden text-ellipsis whitespace-nowrap",
  row: "relative flex items-start gap-lf-3 w-full min-w-0 p-lf-3 border-none rounded-lf-lg bg-transparent text-left cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] hover:bg-lf-surface-2",
  rowActive: "bg-lf-surface-2 shadow-[inset_0_0_0_1px_var(--lf-border-default)]",
  rowUnread: "bg-lf-accent-muted hover:bg-[color-mix(in_srgb,_var(--lf-accent-muted)_70%,_var(--lf-surface-2))]",
  rowUnread_preview: "text-lf-text-secondary",
  rowUnread_primary: "font-bold",
  rowUnread_rowActive: "bg-[color-mix(in_srgb,_var(--lf-accent-muted)_70%,_var(--lf-surface-2))]",
  rowUnread_timestamp: "text-lf-accent font-semibold",
  timestamp: "[flex-shrink:0] text-lf-xs text-lf-text-tertiary",
  topRow: "flex items-baseline justify-between gap-lf-2 min-w-0",
  trailing: "[flex-shrink:0] flex items-center self-center",
  unreadDot: "block w-[8px] h-[8px] rounded-lf-pill bg-lf-accent shadow-[0_0_0_2px_var(--lf-accent-muted)]",
  unreadMarker: "[flex-shrink:0] w-[8px] mt-[7px]",
};
export default styles;
