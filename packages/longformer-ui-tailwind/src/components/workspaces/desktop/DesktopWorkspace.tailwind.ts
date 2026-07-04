/** Tailwind class map — converted from DesktopWorkspace.module.css */
const styles: Record<string, string> = {
  deviceScreen: "flex flex-col w-full h-full max-w-full max-h-[100%] overflow-hidden rounded-lf-lg border border-solid border-lf-border-default shadow-lf-md bg-lf-surface-sunken bg-transparent rounded-[24px] rounded-[36px] rounded-[40px]",
  deviceScreenFullscreen: "w-full h-full max-w-[none] max-h-[none] border-none rounded-none shadow-none",
  deviceStage: "flex-1 min-h-0 flex items-center justify-center p-lf-4",
  deviceStageFullscreen: "p-0",
  toolbar: "[flex-shrink:0] grid grid-cols-[auto_1fr_auto] items-center gap-lf-3 p-[var(--lf-space-2)_var(--lf-space-4)] border-b border-lf-divider bg-lf-surface-1",
  toolbarPickers: "flex-1 flex flex-wrap items-center justify-center gap-lf-2 min-w-0",
  widgetToggle: "[flex-shrink:0] appearance-none border border-solid border-lf-border-subtle rounded-lf-md p-[4px_var(--lf-space-3)] bg-lf-surface-2 text-lf-text-tertiary font-sans text-[11px] font-medium cursor-pointer whitespace-nowrap hover:text-lf-text-secondary hover:bg-lf-surface-3",
  widgetToggleActive: "border-lf-accent-border bg-lf-accent-muted text-lf-accent",
  workspace: "h-full flex flex-col min-h-0 bg-lf-surface-canvas",
  workspaceFullscreen: "bg-lf-surface-sunken",
};
export default styles;
