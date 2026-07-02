import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import type {
  MusicContentFilter,
  MusicFeaturedCard,
  MusicImageTone,
  MusicLibraryFilter,
  MusicLibraryItem,
  MusicMixCard,
  MusicNowPlaying,
  MusicQuickAccess,
  MusicUser,
} from "./types";
import styles from "./MusicWorkspace.module.css";

function artClass(tone: MusicImageTone, size: "sm" | "md" | "lg" | "full" = "sm") {
  const sizeClass =
    size === "full" ? styles.artFull : size === "lg" ? styles.artLg : size === "md" ? styles.artMd : styles.artSm;
  const toneClass = styles[`art${tone.charAt(0).toUpperCase()}${tone.slice(1)}` as keyof typeof styles];
  return cx(styles.art, sizeClass, toneClass);
}

const LIBRARY_FILTERS: { id: MusicLibraryFilter; label: string }[] = [
  { id: "playlists", label: "Playlists" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
  { id: "podcasts", label: "Podcasts" },
];

const CONTENT_FILTERS: { id: MusicContentFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "podcasts", label: "Podcasts" },
  { id: "audiobooks", label: "Audiobooks" },
];

export interface MusicTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  user: MusicUser;
}

export function MusicTopBar({ searchQuery, onSearchChange, user }: MusicTopBarProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.logo} aria-hidden="true">
        ♫
      </div>

      <div className={styles.navCluster}>
        <button type="button" className={styles.navBtn} aria-label="Home">
          <Icon name="home" size={18} />
        </button>

        <label className={styles.searchBar}>
          <Icon name="search" size={18} />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className={styles.topActions}>
        <button type="button" className={styles.premiumBtn}>
          Explore Premium
        </button>
        <button type="button" className={styles.installBtn}>
          Install App
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Icon name="bell" size={18} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Friends activity">
          <Icon name="users" size={18} />
        </button>
        <button type="button" className={styles.profileBtn} aria-label={user.name}>
          {user.name
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </button>
      </div>
    </header>
  );
}

export interface MusicLibrarySidebarProps {
  items: MusicLibraryItem[];
  activeItemId?: string;
  onSelectItem: (id: string) => void;
  libraryFilter: MusicLibraryFilter;
  onLibraryFilterChange: (filter: MusicLibraryFilter) => void;
}

export function MusicLibrarySidebar({
  items,
  activeItemId,
  onSelectItem,
  libraryFilter,
  onLibraryFilterChange,
}: MusicLibrarySidebarProps) {
  const filteredItems = items.filter((item) => {
    if (libraryFilter === "playlists") return item.kind === "playlist";
    if (libraryFilter === "artists") return item.kind === "artist";
    if (libraryFilter === "albums") return item.kind === "album";
    return item.kind === "podcast";
  });

  return (
    <aside className={styles.libraryPane} aria-label="Your Library">
      <div className={styles.libraryHeader}>
        <h2 className={styles.libraryTitle}>Your Library</h2>
        <div className={styles.libraryHeaderActions}>
          <button type="button" className={styles.iconBtn} aria-label="Create">
            <Icon name="plus" size={18} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Expand library">
            <Icon name="panel-right" size={18} />
          </button>
        </div>
      </div>

      <div className={styles.libraryFilters}>
        {LIBRARY_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={cx(styles.filterChip, libraryFilter === filter.id && styles.filterChipActive)}
            onClick={() => onLibraryFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.libraryToolbar}>
        <button type="button" className={styles.iconBtn} aria-label="Search library">
          <Icon name="search" size={16} />
        </button>
        <button type="button" className={styles.librarySort}>
          Recents
          <Icon name="list" size={14} />
        </button>
      </div>

      <div className={styles.libraryList}>
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx(styles.libraryItem, activeItemId === item.id && styles.libraryItemActive)}
            onClick={() => onSelectItem(item.id)}
          >
            <span className={artClass(item.imageTone, item.kind === "artist" ? "sm" : "sm")} aria-hidden="true" />
            <span className={styles.libraryItemMeta}>
              <span className={styles.libraryItemTitle}>{item.title}</span>
              <span className={styles.libraryItemSubtitle}>{item.subtitle}</span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export interface MusicHomeContentProps {
  userName: string;
  quickAccess: MusicQuickAccess[];
  featured: MusicFeaturedCard;
  mixes: MusicMixCard[];
  contentFilter: MusicContentFilter;
  onContentFilterChange: (filter: MusicContentFilter) => void;
}

export function MusicHomeContent({
  userName,
  quickAccess,
  featured,
  mixes,
  contentFilter,
  onContentFilterChange,
}: MusicHomeContentProps) {
  return (
    <main className={styles.mainPane}>
      <div className={styles.mainScroll}>
        <div className={styles.contentFilters}>
          {CONTENT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={cx(styles.filterChip, contentFilter === filter.id && styles.filterChipActive)}
              onClick={() => onContentFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.quickGrid}>
          {quickAccess.map((item) => (
            <button key={item.id} type="button" className={styles.quickCard}>
              <span className={artClass(item.imageTone, "md")} aria-hidden="true" />
              <span className={styles.quickCardTitle}>{item.title}</span>
            </button>
          ))}
        </div>

        <section className={styles.section} aria-labelledby="featured-heading">
          <div className={styles.sectionHeader}>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              {featured.sectionTitle}
            </h2>
          </div>
          <article className={styles.featuredCard}>
            <span className={artClass(featured.imageTone, "lg")} aria-hidden="true" />
            <div className={styles.featuredMeta}>
              <p className={styles.featuredLabel}>{featured.label}</p>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <p className={styles.featuredDescription}>{featured.description}</p>
              <div className={styles.featuredActions}>
                <button type="button" className={styles.playBtn} aria-label={`Play ${featured.title}`}>
                  <Icon name="play" size={22} />
                </button>
                <button type="button" className={styles.addBtn} aria-label={`Save ${featured.title}`}>
                  <Icon name="plus" size={18} />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="mixes-heading">
          <div className={styles.sectionHeader}>
            <h2 id="mixes-heading" className={styles.sectionTitle}>
              Made For {userName}
            </h2>
          </div>
          <div className={styles.mixRow}>
            {mixes.map((mix) => (
              <button key={mix.id} type="button" className={styles.mixCard}>
                <div className={styles.mixArtWrap}>
                  <span className={artClass(mix.imageTone, "full")} aria-hidden="true" />
                  <span className={styles.mixPlay} aria-hidden="true">
                    <Icon name="play" size={18} />
                  </span>
                </div>
                <p className={styles.mixNumber}>Daily Mix {mix.number}</p>
                <h3 className={styles.mixTitle}>{mix.title}</h3>
                <p className={styles.mixArtists}>{mix.artists.join(", ")}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export interface MusicNowPlayingPanelProps {
  nowPlaying: MusicNowPlaying;
}

export function MusicNowPlayingPanel({ nowPlaying }: MusicNowPlayingPanelProps) {
  const { track, queueTitle, relatedVideos } = nowPlaying;

  return (
    <aside className={styles.nowPlayingPane} aria-label="Now playing">
      <div className={styles.nowPlayingHeader}>{queueTitle ?? track.title}</div>
      <div className={styles.nowPlayingScroll}>
        <div className={styles.nowPlayingArt}>
          <span className={artClass(track.albumArtTone, "full")} aria-hidden="true" />
          <button type="button" className={styles.videoSwitch}>
            Switch to video
          </button>
        </div>

        <div className={styles.nowPlayingTrack}>
          <div>
            <h2 className={styles.nowPlayingTitle}>{track.title}</h2>
            <p className={styles.nowPlayingArtists}>{track.artists}</p>
          </div>
          <button type="button" className={styles.addBtn} aria-label={`Save ${track.title}`}>
            <Icon name="plus" size={18} />
          </button>
        </div>

        <section aria-labelledby="related-videos-heading">
          <h3 id="related-videos-heading" className={styles.relatedSectionTitle}>
            Related music videos
          </h3>
          <div className={styles.relatedList}>
            {relatedVideos.map((video) => (
              <button key={video.id} type="button" className={styles.relatedItem}>
                <span className={artClass(video.imageTone, "sm")} aria-hidden="true" />
                <span className={styles.relatedMeta}>
                  <span className={styles.relatedTitle}>{video.title}</span>
                  <span className={styles.relatedArtists}>{video.artists}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

export interface MusicPlayerBarProps {
  nowPlaying: MusicNowPlaying;
  playing: boolean;
  onTogglePlay: () => void;
}

export function MusicPlayerBar({ nowPlaying, playing, onTogglePlay }: MusicPlayerBarProps) {
  const { track, progress, elapsed } = nowPlaying;

  return (
    <footer className={styles.playerBar} aria-label="Playback controls">
      <div className={styles.playerTrack}>
        <span className={artClass(track.albumArtTone, "sm")} aria-hidden="true" />
        <div className={styles.playerTrackMeta}>
          <span className={styles.playerTrackTitle}>{track.title}</span>
          <span className={styles.playerTrackArtists}>{track.artists}</span>
          {track.hasVideo && <span className={styles.videoTag}>Music video</span>}
        </div>
        <button type="button" className={styles.iconBtn} aria-label="Save track">
          <Icon name="heart" size={16} />
        </button>
      </div>

      <div className={styles.playerControls}>
        <div className={styles.controlRow}>
          <button type="button" className={styles.controlBtn} aria-label="Shuffle">
            <Icon name="shuffle" size={16} />
          </button>
          <button type="button" className={styles.controlBtn} aria-label="Previous">
            <Icon name="skip-back" size={18} />
          </button>
          <button type="button" className={styles.playPauseBtn} aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
            <Icon name={playing ? "pause" : "play"} size={18} />
          </button>
          <button type="button" className={styles.controlBtn} aria-label="Next">
            <Icon name="skip-forward" size={18} />
          </button>
          <button type="button" className={cx(styles.controlBtn, styles.controlBtnActive)} aria-label="Repeat">
            <Icon name="repeat" size={16} />
          </button>
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
        <button type="button" className={styles.iconBtn} aria-label="Now playing view">
          <Icon name="panel-right" size={16} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Lyrics">
          <Icon name="mic" size={16} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Queue">
          <Icon name="list" size={16} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Connect to a device">
          <Icon name="monitor" size={16} />
        </button>
        <div className={styles.volumeRow}>
          <Icon name="volume" size={16} />
          <div className={styles.volumeTrack} aria-hidden="true">
            <span className={styles.volumeFill} />
          </div>
        </div>
        <button type="button" className={styles.iconBtn} aria-label="Mini player">
          <Icon name="square" size={14} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Full screen">
          <Icon name="maximize" size={16} />
        </button>
      </div>
    </footer>
  );
}
