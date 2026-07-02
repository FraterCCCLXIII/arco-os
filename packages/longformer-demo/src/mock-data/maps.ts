import type { MapDestination, MapRoute, SavedPlace } from "longformer-ui";

export const mapsSavedPlaces: SavedPlace[] = [
  { id: "home", name: "Home", address: "742 Evergreen Terrace", category: "home" },
  { id: "work", name: "Work", address: "1 Longformer Way, San Francisco", category: "work" },
  { id: "cafe", name: "Blue Bottle", address: "66 Mint St", category: "favorite" },
];

export const mapsDestinations: MapDestination[] = [
  {
    id: "park",
    name: "Golden Gate Park",
    description: "Large urban park",
    eta: "12 min",
    distance: "3.2 mi",
    tone: "success",
  },
  {
    id: "museum",
    name: "SFMOMA",
    description: "Modern art museum",
    eta: "18 min",
    distance: "4.1 mi",
    tone: "accent",
  },
  {
    id: "beach",
    name: "Ocean Beach",
    description: "Pacific coast",
    eta: "22 min",
    distance: "5.8 mi",
    tone: "warning",
  },
];

export const mapsRoute: MapRoute = {
  pickup: { label: "Current location", address: "Market St & 5th" },
  dropoff: { label: "Golden Gate Park", address: "Music Concourse Dr" },
  duration: "12 min",
  distance: "3.2 mi",
};
