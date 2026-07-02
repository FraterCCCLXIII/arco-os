/** Default desktop wallpaper — Talisker Bay, Isle of Skye (Aaron Mridha / Pexels). */
export const DEFAULT_DESKTOP_WALLPAPER_URL =
  "https://images.pexels.com/photos/34650936/pexels-photo-34650936.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function desktopWallpaperBackground(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return `url("${url}")`;
}
