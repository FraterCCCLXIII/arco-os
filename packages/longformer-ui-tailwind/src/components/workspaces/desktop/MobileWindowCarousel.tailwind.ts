/** Tailwind class map — converted from MobileWindowCarousel.module.css */
const styles: Record<string, string> = {
  android: "",
  android_slide: "pt-0",
  ios: "",
  ios_slide: "pt-0",
  slide: "[flex:0_0_var(--carousel-slide-width)] [scroll-snap-align:start] [scroll-snap-stop:always] h-full p-0 flex min-w-0 opacity-100 transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]",
  track: "[--carousel-slide-width:100%] [--carousel-edge-inset:0] flex items-stretch h-full [overflow-x:auto] overflow-y-hidden [scroll-snap-type:x_mandatory] [scroll-behavior:smooth] [scroll-padding-inline:var(--carousel-edge-inset)] [-webkit-overflow-scrolling:touch] scrollbar-none cursor-grab [touch-action:pan-x] before:before:[content:\"\"] before:before:[flex:0_0_var(--carousel-edge-inset)] before:after:[content:\"\"] before:after:[flex:0_0_var(--carousel-edge-inset)] active:[cursor:grabbing] [scroll-behavior:auto]",
  viewport: "absolute inset-0 z-[2] overflow-hidden [touch-action:pan-y] bg-lf-surface-sunken",
  windowFrame: "relative w-full h-full min-h-0",
};
export default styles;
