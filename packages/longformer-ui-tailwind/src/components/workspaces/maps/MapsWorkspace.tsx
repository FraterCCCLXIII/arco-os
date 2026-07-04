import { useState } from "react";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { RouteCard } from "../../primitives/RouteCard";
import { MediaCard } from "../../primitives/MediaCard";
import { ListItem } from "../../primitives/ListItem";
import { Badge } from "../../primitives/Badge";
import type { MapDestination, MapRoute, SavedPlace } from "./types";
import styles from "./MapsWorkspace.tailwind";

export interface MapsWorkspaceProps {
  locationLabel?: string;
  savedPlaces: SavedPlace[];
  destinations: MapDestination[];
  route?: MapRoute;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (value: string) => void;
  activePlaceId?: string;
  defaultActivePlaceId?: string;
  onSelectPlace?: (id: string) => void;
}

const PLACE_ICON = {
  home: "home" as const,
  work: "layers" as const,
  favorite: "star" as const,
};

/** Simple maps view with a search bar, route card, and nearby destinations. */
export function MapsWorkspace({
  locationLabel = "Current location",
  savedPlaces,
  destinations,
  route,
  searchQuery: controlledSearchQuery,
  defaultSearchQuery = "",
  onSearchChange,
  activePlaceId: controlledActivePlaceId,
  defaultActivePlaceId,
  onSelectPlace,
}: MapsWorkspaceProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(defaultSearchQuery);
  const [internalActivePlaceId, setInternalActivePlaceId] = useState(
    defaultActivePlaceId ?? savedPlaces[0]?.id,
  );

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const activePlaceId = controlledActivePlaceId ?? internalActivePlaceId;

  function handleSearchChange(value: string) {
    if (onSearchChange) onSearchChange(value);
    else setInternalSearchQuery(value);
  }

  function handleSelectPlace(id: string) {
    if (onSelectPlace) onSelectPlace(id);
    else setInternalActivePlaceId(id);
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.mapArea}>
        <div className={styles.mapCanvas}>
          <div className={styles.mapGrid} aria-hidden="true" />
          <div className={styles.mapPin}>
            <span className={styles.pinDot} />
            <span className={styles.pinLabel}>{locationLabel}</span>
          </div>
        </div>
        <div className={styles.searchOverlay}>
          <Input
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search places or addresses"
            startSlot={<Icon name="search" size={16} />}
          />
        </div>
      </div>

      <div className={styles.bottomPanel}>
        <div className={styles.panelHeader}>
          <span>
            <Icon name="globe" size={15} style={{ marginRight: 8, verticalAlign: -2 }} />
            Directions
          </span>
          {route && (
            <Badge tone="accent">{route.duration}</Badge>
          )}
        </div>
        <ScrollArea className={styles.panelScroll}>
          <div className={styles.panelContent}>
            {route && (
              <>
                <RouteCard pickup={route.pickup} dropoff={route.dropoff} />
                <div className={styles.routeMeta}>
                  <span>{route.duration}</span>
                  <span>{route.distance}</span>
                </div>
              </>
            )}

            <div>
              <div className={styles.panelHeader} style={{ padding: "0 0 8px", border: "none" }}>
                Saved
              </div>
              <div className={styles.savedList}>
                {savedPlaces.map((place) => (
                  <ListItem
                    key={place.id}
                    active={place.id === activePlaceId}
                    onClick={() => handleSelectPlace(place.id)}
                    leading={<Icon name={PLACE_ICON[place.category]} size={16} />}
                    label={place.name}
                    description={place.address}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className={styles.panelHeader} style={{ padding: "0 0 8px", border: "none" }}>
                Nearby
              </div>
              <div className={styles.destinations}>
                {destinations.map((destination) => (
                  <MediaCard
                    key={destination.id}
                    tone={destination.tone ?? "accent"}
                    title={destination.name}
                    description={destination.description}
                    badges={[
                      { icon: "clock", label: destination.eta },
                      { icon: "car", label: destination.distance },
                    ]}
                    actionLabel="Directions"
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export type { MapDestination, MapRoute, SavedPlace } from "./types";
