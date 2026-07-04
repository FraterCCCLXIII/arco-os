/** Tailwind class map — converted from KanbanBoard.module.css */
const styles: Record<string, string> = {
  board: "grid grid-cols-[repeat(3,_minmax(220px,_1fr))] gap-lf-3 h-full min-h-0 p-lf-3",
  card: "flex flex-col items-start gap-lf-2 w-full p-lf-3 border border-solid border-lf-border-default rounded-lf-md bg-lf-surface-1 text-left cursor-pointer transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] hover:border-lf-border-strong hover:shadow-lf-sm",
  cardMeta: "flex flex-wrap items-center gap-lf-2",
  cards: "flex flex-col gap-lf-2 p-lf-3",
  cardTitle: "text-lf-sm font-semibold text-lf-text-primary leading-[1.35]",
  column: "flex flex-col min-h-0 rounded-lf-lg border border-solid border-lf-border-default bg-lf-surface-sunken",
  columnHeader: "flex items-center justify-between gap-lf-2 p-[var(--lf-space-3)_var(--lf-space-4)] border-b border-lf-divider text-lf-sm font-semibold text-lf-text-primary",
  columnScroll: "flex-1 min-h-0",
  projectDot: "w-[8px] h-[8px] rounded-[2px] [flex-shrink:0]",
  projectName: "text-[10px] text-lf-text-tertiary",
  projectRow: "flex items-center gap-lf-2",
};
export default styles;
