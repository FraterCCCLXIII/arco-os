/** Tailwind class map — converted from SheetGridView.module.css */
const styles: Record<string, string> = {
  cell: "relative flex items-center min-w-0 p-[0_var(--lf-space-2)] border-r border-lf-divider border-b border-lf-divider bg-lf-surface-1 text-lf-text-primary text-lf-sm [cursor:cell]",
  cellAlignCenter: "justify-center text-center",
  cellAlignRight: "justify-end text-right",
  cellBold: "font-semibold",
  cellFillAccent: "bg-lf-accent-muted",
  cellFillMuted: "bg-lf-surface-sunken",
  cellInput: "w-full border-none p-0 bg-transparent text-[inherit] [font:inherit] outline-none",
  cellItalic: "[font-style:italic]",
  cellSelected: "[outline:2px_solid_var(--lf-accent)] [outline-offset:-2px] z-[1] before:after:[content:\"\"] before:after:absolute before:after:right-[-3px] before:after:bottom-[-3px] before:after:w-[6px] before:after:h-[6px] before:after:border border-solid border-lf-accent before:after:bg-lf-accent",
  cellStrikethrough: "",
  cellStrikethrough_cellText: "[text-decoration:line-through]",
  cellText: "overflow-hidden text-ellipsis whitespace-nowrap w-full",
  columnHeader: "sticky top-0 z-[3]",
  cornerCell: "sticky top-0 left-0 z-[4]",
  grid: "grid w-[max-content] min-w-[100%] bg-lf-surface-1",
  gridScroll: "w-full h-full overflow-auto",
  gridViewport: "flex-1 min-h-0 min-w-0 bg-lf-surface-canvas outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--lf-accent-muted)]",
  headerActive: "bg-lf-surface-3 text-lf-text-primary",
  headerCell: "sticky z-[2] flex items-center justify-center border-r border-lf-divider border-b border-lf-divider bg-lf-surface-sunken text-lf-text-secondary text-lf-xs font-medium select-none",
  rowHeader: "sticky left-0 z-[3] justify-center",
};
export default styles;
