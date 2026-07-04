/** Tailwind class map — converted from CameraWorkspace.module.css */
const styles: Record<string, string> = {
  controls: "[flex-shrink:0] flex flex-col gap-lf-3 p-lf-4 border-t border-lf-divider bg-lf-surface-1",
  gallery: "flex gap-lf-2 [overflow-x:auto] pb-lf-1",
  galleryCard: "[flex:0_0_100px] h-[120px]",
  gridLines: "absolute inset-0 pointer-events-none opacity-[0.2] bg-[linear-gradient(rgba(255,_255,_255,_0.5)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,_255,_255,_0.5)_1px,_transparent_1px)] [background-size:33.33%_33.33%]",
  modeRow: "flex justify-center gap-lf-2",
  recordingBadge: "inline-flex items-center gap-lf-2 p-[var(--lf-space-1)_var(--lf-space-2)] rounded-lf-pill bg-[rgba(0,_0,_0,_0.5)] text-[#fff] text-lf-sm font-semibold",
  recordingDot: "w-[8px] h-[8px] rounded-full bg-lf-danger [animation:pulse_1.2s_ease-in-out_infinite]",
  shutter: "w-[64px] h-[64px] rounded-full [border:4px_solid_var(--lf-border-strong)] bg-transparent cursor-pointer flex items-center justify-center transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)] active:[transform:scale(0.94)]",
  shutterInner: "w-[52px] h-[52px] rounded-full bg-lf-surface-1 [border:2px_solid_var(--lf-text-primary)]",
  shutterRecording: "",
  shutterRecording_shutterInner: "w-[28px] h-[28px] rounded-lf-sm bg-lf-danger border-lf-danger",
  shutterRow: "flex items-center justify-center gap-lf-5",
  topBar: "flex items-center justify-between",
  viewfinder: "relative flex-1 min-h-0 flex items-center justify-center bg-[#0a0a0a]",
  viewfinderFrame: "relative w-[min(100%,_720px)] aspect-[4_/_3] m-lf-4 rounded-lf-md overflow-hidden bg-[radial-gradient(ellipse_at_60%_30%,_rgba(255,_255,_255,_0.08),_transparent_55%),_linear-gradient(180deg,_#1a1a1a_0%,_#0d0d0d_100%)] border border-solid border-[rgba(255,_255,_255,_0.12)]",
  viewfinderOverlay: "absolute inset-0 flex flex-col justify-between p-lf-4",
  workspace: "h-full flex flex-col min-h-0 bg-lf-surface-canvas",
};
export default styles;
