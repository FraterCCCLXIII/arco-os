import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { Button } from "../../primitives/Button";
import { Chip } from "../../primitives/Chip";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Tabs } from "../../primitives/Tabs";
import { NavSidebar } from "../../shell/NavSidebar";
import { Composer as ChatComposer } from "../chat/Composer";
import type {
  ComposerArtTone,
  ComposerMode,
  ComposerModelVersion,
  ComposerNavItem,
  ComposerNavView,
  ComposerNowPlaying,
  ComposerTrack,
} from "./types";
import styles from "./ComposerWorkspace.module.css";

function artClass(tone: ComposerArtTone, size: "sm" | "md" | "full" = "sm") {
  const sizeClass = size === "full" ? styles.artFull : size === "md" ? styles.artMd : styles.artSm;
  const toneClass = styles[`art${tone.charAt(0).toUpperCase()}${tone.slice(1)}` as keyof typeof styles];
  return cx(styles.art, sizeClass, toneClass);
}

const MODE_TABS = [
  { id: "simple", label: "Simple" },
  { id: "advanced", label: "Advanced" },
  { id: "sounds", label: "Sounds" },
] as const;

const MODEL_OPTIONS: { id: ComposerModelVersion; label: string }[] = [
  { id: "v3.5", label: "v3.5" },
  { id: "v4", label: "v4" },
  { id: "v4.5", label: "v4.5" },
];

export interface ComposerNavSidebarProps {
  navItems: ComposerNavItem[];
  activeView: ComposerNavView;
  onViewChange: (view: ComposerNavView) => void;
  onNew?: () => void;
}

export function ComposerNavSidebar({
  navItems,
  activeView,
  onViewChange,
  onNew,
}: ComposerNavSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNavItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(query));
  }, [navItems, searchQuery]);

  return (
    <NavSidebar
      className={styles.navSidebar}
      header={
        <Input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search composer"
          startSlot={<Icon name="search" size={14} />}
          className={styles.navSearchField}
          wrapperClassName={styles.navSearchInput}
        />
      }
      primaryAction={{ label: "New", icon: "plus", onClick: onNew }}
      quickLinks={filteredNavItems.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        active: activeView === item.id,
        onClick: () => onViewChange(item.id),
      }))}
      sections={[]}
    />
  );
}

export interface ComposerCreationPanelProps {
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
  model: ComposerModelVersion;
  onModelChange: (model: ComposerModelVersion) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  styleSuggestions: string[];
  activeStyles: string[];
  onToggleStyle: (style: string) => void;
  instrumental: boolean;
  onInstrumentalChange: (value: boolean) => void;
  onCreate: () => void;
  creating?: boolean;
}

export function ComposerCreationPanel({
  mode,
  onModeChange,
  model,
  onModelChange,
  prompt,
  onPromptChange,
  styleSuggestions,
  activeStyles,
  onToggleStyle,
  instrumental,
  onInstrumentalChange,
  onCreate,
  creating = false,
}: ComposerCreationPanelProps) {
  const modelMenuItems: MenuItemDescriptor[] = MODEL_OPTIONS.map((option) => ({
    id: option.id,
    label: option.label,
    onSelect: () => onModelChange(option.id),
  }));

  return (
    <section className={styles.creationPanel} aria-label="Create music">
      <div className={styles.creationHeader}>
        <Tabs
          items={[...MODE_TABS]}
          value={mode}
          onChange={(id) => onModeChange(id as ComposerMode)}
          variant="pill"
          className={styles.modeTabs}
          aria-label="Creation mode"
        />
        <Menu
          align="end"
          trigger={
            <button type="button" className={styles.modelTrigger}>
              {model}
              <Icon name="chevron-down" size={14} />
            </button>
          }
          items={modelMenuItems}
          aria-label="Model version"
        />
      </div>

      <div className={styles.inputTypes}>
        <Button variant="secondary" size="sm" className={styles.inputTypeBtn}>
          <Icon name="attach" size={14} />
          Audio
        </Button>
        <Button variant="secondary" size="sm" className={styles.inputTypeBtn}>
          <Icon name="mic" size={14} />
          Voice
          <span className={styles.newBadge}>New</span>
        </Button>
        <Button variant="secondary" size="sm" className={styles.inputTypeBtn}>
          <Icon name="sparkles" size={14} />
          Inspo
        </Button>
      </div>

      <div className={styles.promptSection}>
        <div className={styles.promptHeader}>
          <span className={styles.promptLabel}>Song Description</span>
          <IconButton icon="refresh" label="Randomize prompt" size="sm" />
        </div>
        <ChatComposer
          className={styles.promptComposer}
          surfaceClassName={styles.promptComposerSurface}
          value={prompt}
          onChange={onPromptChange}
          onSubmit={onCreate}
          placeholder="Describe the song you want to create…"
          disabled={creating}
          inputAriaLabel="Song description"
          footer={
            <div className={styles.promptActions}>
              <Button variant="secondary" size="sm" className={styles.lyricsBtn}>
                <Icon name="plus" size={14} />
                Lyrics
              </Button>
              <button
                type="button"
                className={cx(styles.instrumentalToggle, instrumental && styles.instrumentalToggleActive)}
                aria-pressed={instrumental}
                onClick={() => onInstrumentalChange(!instrumental)}
              >
                Instrumental
              </button>
            </div>
          }
        />
      </div>

      <ScrollArea className={styles.suggestionScroll}>
        <div className={styles.suggestions}>
          {styleSuggestions.map((style) => (
            <Chip
              key={style}
              active={activeStyles.includes(style)}
              onClick={() => onToggleStyle(style)}
            >
              {style}
            </Chip>
          ))}
        </div>
      </ScrollArea>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={creating || prompt.trim().length === 0}
        onClick={onCreate}
      >
        <Icon name="sparkles" size={18} />
        {creating ? "Creating…" : "Create"}
      </Button>
    </section>
  );
}

export interface ComposerLibraryPanelProps {
  tracks: ComposerTrack[];
  activeTrackId?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectTrack: (id: string) => void;
}

export function ComposerLibraryPanel({
  tracks,
  activeTrackId,
  searchQuery,
  onSearchChange,
  onSelectTrack,
}: ComposerLibraryPanelProps) {
  const filteredTracks = tracks.filter((track) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      track.title.toLowerCase().includes(query) ||
      track.description.toLowerCase().includes(query)
    );
  });

  const trackMenuItems = (track: ComposerTrack): MenuItemDescriptor[] => [
    { id: "open", label: "Open in Studio", icon: "layers", onSelect: () => onSelectTrack(track.id) },
    { id: "extend", label: "Extend", icon: "plus", onSelect: () => undefined },
    { id: "download", label: "Download", icon: "download", onSelect: () => undefined },
    { id: "delete", label: "Delete", icon: "trash", danger: true, onSelect: () => undefined },
  ];

  return (
    <section className={styles.libraryPanel} aria-label="Workspace library">
      <header className={styles.libraryHeader}>
        <div className={styles.breadcrumbs}>
          <span className={styles.breadcrumbMuted}>Workspaces</span>
          <Icon name="chevron-right" size={14} />
          <span>My Workspace</span>
        </div>

        <div className={styles.libraryToolbar}>
          <Input
            className={styles.searchInput}
            wrapperClassName={styles.searchWrapper}
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            startSlot={<Icon name="search" size={16} />}
          />
          <Button variant="secondary" size="sm" className={styles.filterBtn}>
            Filters (3)
          </Button>
          <button type="button" className={styles.sortBtn}>
            Newest
            <Icon name="chevron-down" size={14} />
          </button>
          <button type="button" className={styles.viewBtn} aria-label="List view">
            <Icon name="list" size={16} />
          </button>
          <div className={styles.pagination}>
            <IconButton icon="chevron-left" label="Previous page" size="sm" />
            <IconButton icon="chevron-right" label="Next page" size="sm" />
          </div>
        </div>
      </header>

      <ScrollArea className={styles.trackList}>
        <div className={styles.trackListInner}>
          {filteredTracks.map((track) => (
            <article
              key={track.id}
              className={cx(styles.trackRow, activeTrackId === track.id && styles.trackRowActive)}
            >
              <button
                type="button"
                className={styles.trackMain}
                onClick={() => onSelectTrack(track.id)}
              >
                <span className={artClass(track.artTone, "md")} aria-hidden="true" />
                <span className={styles.trackMeta}>
                  <span className={styles.trackTitleRow}>
                    <span className={styles.trackTitle}>{track.title}</span>
                    <span className={styles.trackVersion}>{track.version}</span>
                  </span>
                  <span className={styles.trackDescription}>{track.description}</span>
                </span>
              </button>
              <span className={styles.trackDuration}>{track.duration}</span>
              <div className={styles.trackActions}>
                <IconButton
                  icon="thumbs-up"
                  label={track.liked ? "Unlike" : "Like"}
                  size="sm"
                  className={track.liked ? styles.actionActive : undefined}
                />
                <IconButton icon="star" label="Dislike" size="sm" />
                <IconButton icon="external-link" label="Share" size="sm" />
                <Menu
                  align="end"
                  trigger={
                    <button type="button" className={styles.moreBtn} aria-label={`More actions for ${track.title}`}>
                      <Icon name="more-vertical" size={16} />
                    </button>
                  }
                  items={trackMenuItems(track)}
                />
              </div>
            </article>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}

export interface ComposerPlayerBarProps {
  nowPlaying: ComposerNowPlaying;
  playing: boolean;
  onTogglePlay: () => void;
}

export function ComposerPlayerBar({ nowPlaying, playing, onTogglePlay }: ComposerPlayerBarProps) {
  const { track, progress, elapsed, creator } = nowPlaying;

  return (
    <footer className={styles.playerBar} aria-label="Playback controls">
      <div className={styles.playerTrack}>
        <span className={artClass(track.artTone, "sm")} aria-hidden="true" />
        <div className={styles.playerTrackMeta}>
          <span className={styles.playerTrackTitle}>{track.title}</span>
          <span className={styles.playerTrackCreator}>{creator}</span>
        </div>
        <IconButton icon="heart" label="Save track" size="sm" className={track.liked ? styles.actionActive : undefined} />
      </div>

      <div className={styles.playerControls}>
        <div className={styles.controlRow}>
          <IconButton icon="shuffle" label="Shuffle" size="sm" />
          <IconButton icon="skip-back" label="Previous" size="sm" />
          <button type="button" className={styles.playPauseBtn} aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
            <Icon name={playing ? "pause" : "play"} size={18} />
          </button>
          <IconButton icon="skip-forward" label="Next" size="sm" />
          <IconButton icon="repeat" label="Repeat" size="sm" className={styles.actionActive} />
        </div>
        <div className={styles.progressRow}>
          <span className={styles.timeLabel}>{elapsed}</span>
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.timeLabel}>{track.duration}</span>
        </div>
      </div>

      <div className={styles.playerExtras}>
        <IconButton icon="list" label="Queue" size="sm" />
        <IconButton icon="thumbs-up" label="Like" size="sm" />
        <IconButton icon="external-link" label="Share" size="sm" />
        <IconButton icon="more-horizontal" label="More" size="sm" />
        <div className={styles.volumeRow}>
          <Icon name="volume" size={16} />
          <div className={styles.volumeTrack} aria-hidden="true">
            <span className={styles.volumeFill} />
          </div>
        </div>
      </div>
    </footer>
  );
}
