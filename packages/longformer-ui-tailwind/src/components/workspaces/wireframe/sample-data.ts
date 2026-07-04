import type { WireframeWorkspaceData } from "./types";

export const WIREFRAME_SAMPLE_DATA: WireframeWorkspaceData = {
  projectName: "Meridian Launch Kit",
  workspaceName: "Meridian Studio",
  tabs: [
    { id: "tab-1", label: "Meridian Launch Kit" },
    { id: "tab-2", label: "Harbor App Shell" },
    { id: "tab-3", label: "Northwind Brand" },
  ],
  pages: [
    { id: "page-social", label: "Launch Screens" },
    { id: "page-blog", label: "Product Tiles" },
    { id: "page-logos", label: "Brand Marks" },
  ],
  layers: [
    { id: "layer-1", label: "Hero Banner", kind: "frame" },
    { id: "layer-2", label: "Icon Set", kind: "vector" },
    { id: "layer-3", label: "Palette", kind: "group" },
    { id: "layer-4", label: "Landing — Riley", kind: "frame" },
    { id: "layer-5", label: "Landing — Jordan", kind: "frame" },
    { id: "layer-6", label: "Pricing Card", kind: "frame" },
    { id: "layer-7", label: "Feature Grid", kind: "frame" },
    { id: "layer-8", label: "Testimonial Row", kind: "frame" },
    { id: "layer-9", label: "Signup Modal", kind: "frame" },
    { id: "layer-10", label: "Dashboard Shell", kind: "frame" },
    { id: "layer-11", label: "Settings Panel", kind: "frame" },
    { id: "layer-12", label: "Mobile Nav", kind: "frame" },
    { id: "layer-13", label: "Footer Block", kind: "frame" },
    { id: "layer-14", label: "Case Study — Sam", kind: "frame" },
    { id: "layer-15", label: "Case Study — Casey", kind: "frame" },
    { id: "layer-16", label: "Press Kit", kind: "frame" },
  ],
};
