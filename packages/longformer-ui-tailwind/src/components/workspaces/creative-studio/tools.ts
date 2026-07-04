import type { StudioModeDescriptor, StudioTool } from "./types";

export const STUDIO_MODES: StudioModeDescriptor[] = [
  { id: "vector", label: "Vector", icon: "edit" },
  { id: "raster", label: "Pixel", icon: "image" },
  { id: "layout", label: "Layout", icon: "layers" },
];

export const STUDIO_TOOLS: StudioTool[] = [
  { id: "select", label: "Move", icon: "arrow-up-right", modes: ["vector", "raster", "layout"] },
  { id: "node", label: "Node", icon: "target", modes: ["vector"] },
  { id: "pen", label: "Pen", icon: "edit", modes: ["vector"] },
  { id: "pencil", label: "Pencil", icon: "edit", modes: ["vector", "raster"] },
  { id: "brush", label: "Brush", icon: "edit", modes: ["raster"] },
  { id: "eraser", label: "Eraser", icon: "delete", modes: ["raster"] },
  { id: "clone", label: "Clone", icon: "copy", modes: ["raster"] },
  { id: "blur", label: "Blur", icon: "sun", modes: ["raster"] },
  { id: "rectangle", label: "Rectangle", icon: "square", modes: ["vector", "layout"] },
  { id: "ellipse", label: "Ellipse", icon: "target", modes: ["vector"] },
  { id: "frame", label: "Frame", icon: "hash", modes: ["layout"] },
  { id: "image-frame", label: "Image frame", icon: "image", modes: ["layout"] },
  { id: "margins", label: "Margins", icon: "grid", modes: ["layout"] },
  { id: "text", label: "Frame text", icon: "paragraph", modes: ["vector", "layout"] },
  { id: "eyedropper", label: "Color picker", icon: "sun", modes: ["vector", "raster"] },
  { id: "fill", label: "Fill", icon: "square", modes: ["vector", "raster", "layout"] },
  { id: "transparency", label: "Transparency", icon: "layers", modes: ["vector", "raster", "layout"] },
  { id: "hand", label: "Hand", icon: "globe", modes: ["vector", "raster", "layout"] },
];
