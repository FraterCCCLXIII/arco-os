/** Tailwind class map — converted from MapsWorkspace.module.css */
const styles: Record<string, string> = {
  bottomPanel: "[flex-shrink:0] max-h-[42%] flex flex-col border-t border-lf-divider bg-lf-surface-1",
  destinations: "grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-lf-3",
  mapArea: "relative flex-1 min-h-0 overflow-hidden",
  mapCanvas: "w-full h-full bg-[radial-gradient(circle_at_30%_40%,_rgba(59,_130,_246,_0.15),_transparent_50%),_radial-gradient(circle_at_70%_60%,_rgba(16,_185,_129,_0.12),_transparent_45%),_linear-gradient(160deg,_var(--lf-surface-2)_0%,_var(--lf-surface-sunken)_100%)]",
  mapGrid: "absolute inset-0 opacity-[0.08] [background-image:linear-gradient(var(--lf-divider)_1px,_transparent_1px),_linear-gradient(90deg,_var(--lf-divider)_1px,_transparent_1px)] [background-size:48px_48px]",
  mapPin: "absolute top-[42%] left-[50%] [transform:translate(-50%,_-100%)] flex flex-col items-center gap-lf-1",
  panelContent: "p-lf-4 flex flex-col gap-lf-4",
  panelHeader: "[flex-shrink:0] flex items-center justify-between p-[var(--lf-space-3)_var(--lf-space-4)] border-b border-lf-divider font-semibold text-lf-text-primary",
  panelScroll: "flex-1",
  pinDot: "w-[14px] h-[14px] rounded-full bg-lf-accent [border:3px_solid_var(--lf-surface-1)] shadow-[0_2px_8px_rgba(0,_0,_0,_0.25)]",
  pinLabel: "p-[var(--lf-space-1)_var(--lf-space-2)] rounded-lf-sm bg-lf-surface-glass [backdrop-filter:blur(8px)] text-lf-sm font-semibold text-lf-text-primary",
  routeMeta: "flex gap-lf-3 text-lf-sm text-lf-text-secondary",
  savedList: "flex flex-col gap-lf-1",
  searchOverlay: "absolute top-[var(--lf-space-4)] left-[var(--lf-space-4)] right-[var(--lf-space-4)] max-w-[420px]",
  workspace: "h-full flex flex-col min-h-0 bg-lf-surface-canvas",
};
export default styles;
