import { useState } from "react";
import {
  MusicHomeContent,
  MusicLibrarySidebar,
  MusicNowPlayingPanel,
  MusicPlayerBar,
  MusicTopBar,
} from "./MusicParts";
import type {
  MusicContentFilter,
  MusicFeaturedCard,
  MusicLibraryFilter,
  MusicLibraryItem,
  MusicMixCard,
  MusicNowPlaying,
  MusicQuickAccess,
  MusicUser,
} from "./types";
import styles from "./MusicWorkspace.tailwind";

export interface MusicWorkspaceProps {
  user: MusicUser;
  libraryItems: MusicLibraryItem[];
  quickAccess: MusicQuickAccess[];
  featured: MusicFeaturedCard;
  mixes: MusicMixCard[];
  nowPlaying: MusicNowPlaying;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeLibraryItemId?: string;
  defaultActiveLibraryItemId?: string;
  onSelectLibraryItem?: (id: string) => void;
  libraryFilter?: MusicLibraryFilter;
  defaultLibraryFilter?: MusicLibraryFilter;
  onLibraryFilterChange?: (filter: MusicLibraryFilter) => void;
  contentFilter?: MusicContentFilter;
  defaultContentFilter?: MusicContentFilter;
  onContentFilterChange?: (filter: MusicContentFilter) => void;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

/**
 * Spotify-style music library with a persistent library sidebar, home feed,
 * now-playing panel, and bottom transport bar.
 */
export function MusicWorkspace({
  user,
  libraryItems,
  quickAccess,
  featured,
  mixes,
  nowPlaying,
  searchQuery: controlledSearchQuery,
  defaultSearchQuery = "",
  onSearchChange,
  activeLibraryItemId: controlledActiveLibraryItemId,
  defaultActiveLibraryItemId,
  onSelectLibraryItem,
  libraryFilter: controlledLibraryFilter,
  defaultLibraryFilter = "playlists",
  onLibraryFilterChange,
  contentFilter: controlledContentFilter,
  defaultContentFilter = "all",
  onContentFilterChange,
  playing: controlledPlaying,
  defaultPlaying = true,
  onPlayingChange,
}: MusicWorkspaceProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(defaultSearchQuery);
  const [internalActiveLibraryItemId, setInternalActiveLibraryItemId] = useState(
    defaultActiveLibraryItemId ?? libraryItems[0]?.id,
  );
  const [internalLibraryFilter, setInternalLibraryFilter] = useState<MusicLibraryFilter>(defaultLibraryFilter);
  const [internalContentFilter, setInternalContentFilter] = useState<MusicContentFilter>(defaultContentFilter);
  const [internalPlaying, setInternalPlaying] = useState(defaultPlaying);

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const activeLibraryItemId = controlledActiveLibraryItemId ?? internalActiveLibraryItemId;
  const libraryFilter = controlledLibraryFilter ?? internalLibraryFilter;
  const contentFilter = controlledContentFilter ?? internalContentFilter;
  const playing = controlledPlaying ?? internalPlaying;

  function handleSearchChange(value: string) {
    if (onSearchChange) onSearchChange(value);
    else setInternalSearchQuery(value);
  }

  function handleSelectLibraryItem(id: string) {
    if (onSelectLibraryItem) onSelectLibraryItem(id);
    else setInternalActiveLibraryItemId(id);
  }

  function handleLibraryFilterChange(filter: MusicLibraryFilter) {
    if (onLibraryFilterChange) onLibraryFilterChange(filter);
    else setInternalLibraryFilter(filter);
  }

  function handleContentFilterChange(filter: MusicContentFilter) {
    if (onContentFilterChange) onContentFilterChange(filter);
    else setInternalContentFilter(filter);
  }

  function handleTogglePlay() {
    const next = !playing;
    if (onPlayingChange) onPlayingChange(next);
    else setInternalPlaying(next);
  }

  return (
    <div className={styles.workspace}>
      <MusicTopBar searchQuery={searchQuery} onSearchChange={handleSearchChange} user={user} />

      <div className={styles.body}>
        <MusicLibrarySidebar
          items={libraryItems}
          activeItemId={activeLibraryItemId}
          onSelectItem={handleSelectLibraryItem}
          libraryFilter={libraryFilter}
          onLibraryFilterChange={handleLibraryFilterChange}
        />

        <MusicHomeContent
          userName={user.name}
          quickAccess={quickAccess}
          featured={featured}
          mixes={mixes}
          contentFilter={contentFilter}
          onContentFilterChange={handleContentFilterChange}
        />

        <MusicNowPlayingPanel nowPlaying={nowPlaying} />
      </div>

      <MusicPlayerBar nowPlaying={nowPlaying} playing={playing} onTogglePlay={handleTogglePlay} />
    </div>
  );
}

export type {
  MusicContentFilter,
  MusicFeaturedCard,
  MusicImageTone,
  MusicLibraryFilter,
  MusicLibraryItem,
  MusicMixCard,
  MusicNowPlaying,
  MusicQuickAccess,
  MusicRelatedVideo,
  MusicTrack,
  MusicUser,
} from "./types";
