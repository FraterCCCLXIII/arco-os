export type CameraMode = "photo" | "video";

export interface GalleryItem {
  id: string;
  label: string;
  duration?: string;
  tone?: "accent" | "success" | "warning";
}
