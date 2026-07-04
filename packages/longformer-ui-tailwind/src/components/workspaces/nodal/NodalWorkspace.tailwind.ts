/** Tailwind class map — converted from NodalWorkspace.module.css */
const styles: Record<string, string> = {
  canvas: "absolute inset-0 bg-lf-surface-canvas [background-image:radial-gradient(circle,_var(--nodal-grid-dot)_1px,_transparent_1px)] [background-size:16px_16px]",
  canvasWrap: "flex-1 min-h-0 relative overflow-hidden",
  connector: "[fill:none] [stroke:var(--lf-text-primary)] [stroke-width:2] [marker-end:url(#nodal-arrow)]",
  connectorLayer: "absolute inset-0 pointer-events-none overflow-visible",
  contextDivider: "w-[1px] h-[20px] m-[0_2px] bg-lf-border-default",
  contextToolbar: "absolute flex items-center gap-[2px] p-[var(--lf-space-1)_var(--lf-space-2)] rounded-lf-md bg-lf-surface-3 text-lf-text-primary border border-solid border-lf-border-default shadow-lf-md [transform:translate(-50%,_-100%)] z-[2]",
  fileMeta: "flex items-center gap-lf-2 min-w-0 hidden",
  fileName: "m-0 text-lf-sm font-medium whitespace-nowrap",
  node: "absolute box-border [border:2px_solid_var(--lf-border-strong)] bg-lf-surface-1 cursor-grab select-none active:[cursor:grabbing]",
  nodeCircle: "rounded-full flex items-center justify-center",
  nodeLabel: "text-lf-sm text-lf-text-secondary text-center p-lf-2",
  nodeRectangle: "rounded-lf-lg",
  nodeSelected: "[outline:2px_solid_var(--lf-accent)] [outline-offset:2px]",
  nodeSticky: "rounded-lf-sm bg-lf-warning-muted border-lf-warning",
  timer: "p-[4px_10px] rounded-lf-pill bg-lf-accent-muted text-lf-accent text-lf-xs font-medium",
  toolAccent: "w-[14px] h-[14px] rounded-lf-sm border border-solid border-lf-border-default",
  workspace: "[--nodal-grid-dot:color-mix(in_srgb,_var(--lf-text-tertiary)_35%,_transparent)]",
  zoomLevel: "min-w-[36px] p-[0_var(--lf-space-1)] text-lf-xs text-lf-text-secondary text-center",
  zoomWidget: "absolute right-[var(--lf-space-4)] bottom-[var(--lf-space-4)] flex items-center gap-[2px] p-lf-1 rounded-lf-md bg-lf-surface-overlay border border-solid border-lf-border-default shadow-lf-md z-[3]",
};
export default styles;
