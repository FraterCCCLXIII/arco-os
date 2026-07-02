export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  category: "home" | "work" | "favorite";
}

export interface MapDestination {
  id: string;
  name: string;
  description: string;
  eta: string;
  distance: string;
  tone?: "accent" | "success" | "warning";
}

export interface MapRoute {
  pickup: { label: string; address: string };
  dropoff: { label: string; address: string };
  duration: string;
  distance: string;
}
