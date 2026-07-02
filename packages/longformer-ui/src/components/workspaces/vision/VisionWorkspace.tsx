import { useState } from "react";
import { VisionContentRows, VisionHero, VisionPlayerBar, VisionTopBar } from "./VisionParts";
import type {
  VisionContentRow,
  VisionFeaturedContent,
  VisionNavSection,
  VisionNowPlaying,
  VisionUser,
} from "./types";
import styles from "./VisionWorkspace.module.css";

export interface VisionWorkspaceProps {
  user: VisionUser;
  featured: VisionFeaturedContent;
  rows: VisionContentRow[];
  nowPlaying: VisionNowPlaying;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeSection?: VisionNavSection;
  defaultActiveSection?: VisionNavSection;
  onSectionChange?: (section: VisionNavSection) => void;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

/**
 * Netflix-style video and audio browse surface with a cinematic hero,
 * horizontal content rows, and a persistent playback bar.
 */
export function VisionWorkspace({
  user,
  featured,
  rows,
  nowPlaying,
  searchQuery: controlledSearchQuery,
  defaultSearchQuery = "",
  onSearchChange,
  activeSection: controlledActiveSection,
  defaultActiveSection = "home",
  onSectionChange,
  playing: controlledPlaying,
  defaultPlaying = false,
  onPlayingChange,
}: VisionWorkspaceProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(defaultSearchQuery);
  const [internalActiveSection, setInternalActiveSection] = useState<VisionNavSection>(defaultActiveSection);
  const [internalPlaying, setInternalPlaying] = useState(defaultPlaying);

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const activeSection = controlledActiveSection ?? internalActiveSection;
  const playing = controlledPlaying ?? internalPlaying;

  function handleSearchChange(value: string) {
    if (onSearchChange) onSearchChange(value);
    else setInternalSearchQuery(value);
  }

  function handleSectionChange(section: VisionNavSection) {
    if (onSectionChange) onSectionChange(section);
    else setInternalActiveSection(section);
  }

  function handleTogglePlay() {
    const next = !playing;
    if (onPlayingChange) onPlayingChange(next);
    else setInternalPlaying(next);
  }

  return (
    <div className={styles.workspace}>
      <VisionTopBar
        user={user}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className={styles.browse}>
        <VisionHero featured={featured} />
        <VisionContentRows rows={rows} />
      </div>

      <VisionPlayerBar nowPlaying={nowPlaying} playing={playing} onTogglePlay={handleTogglePlay} />
    </div>
  );
}

export type {
  VisionContentRow,
  VisionContinueItem,
  VisionFeaturedContent,
  VisionImageTone,
  VisionMediaItem,
  VisionMediaKind,
  VisionNavSection,
  VisionNowPlaying,
  VisionTop10Item,
  VisionUser,
} from "./types";
