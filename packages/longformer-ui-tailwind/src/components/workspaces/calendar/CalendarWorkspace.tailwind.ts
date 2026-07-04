/** Tailwind class map — converted from CalendarWorkspace.module.css */
const styles: Record<string, string> = {
  container: "flex-1 min-h-0 flex flex-col rounded-lf-lg overflow-hidden border border-solid border-lf-border-default bg-lf-surface-1 shadow-lf-md",
  grid: "flex-1 min-h-0",
  header: "[flex-shrink:0] grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] items-center gap-lf-3 h-[56px] p-[0_var(--lf-space-5)] border-b border-lf-divider",
  headerActions: "flex items-center justify-end gap-lf-2",
  headerCenter: "flex justify-center",
  headerLeft: "flex items-center gap-lf-3",
  main: "flex-1 min-w-0 min-h-0 flex flex-col p-lf-3",
  nav: "flex items-center gap-[2px]",
  sidebarPane: "h-full min-w-0 overflow-hidden bg-lf-surface-sunken",
  sidebarResizable: "[flex-shrink:0] hidden",
  sidebarScroll: "h-full p-[var(--lf-space-4)_var(--lf-space-3)]",
  title: "text-lf-lg font-semibold text-lf-text-primary min-w-[160px]",
  workspace: "h-full flex flex-row min-h-0",
};
export default styles;
