import { useRef, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import type {
  VisionContinueItem,
  VisionContentRow,
  VisionFeaturedContent,
  VisionImageTone,
  VisionMediaItem,
  VisionNavSection,
  VisionNowPlaying,
  VisionTop10Item,
  VisionUser,
} from "./types";
import styles from "./VisionWorkspace.tailwind";

function posterClass(tone: VisionImageTone, size: "sm" | "md" | "lg" | "hero" = "md") {
  const sizeClass =
    size === "hero"
      ? styles.posterHero
      : size === "lg"
        ? styles.posterLg
        : size === "sm"
          ? styles.posterSm
          : styles.posterMd;
  const toneClass = styles[`poster${tone.charAt(0).toUpperCase()}${tone.slice(1)}` as keyof typeof styles];
  return cx(styles.poster, sizeClass, toneClass);
}

const NAV_ITEMS: { id: VisionNavSection; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "tv", label: "TV Shows" },
  { id: "movies", label: "Movies" },
  { id: "podcasts", label: "Podcasts" },
  { id: "my-list", label: "My List" },
];

export interface VisionTopBarProps {
  user: VisionUser;
  activeSection: VisionNavSection;
  onSectionChange: (section: VisionNavSection) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function VisionTopBar({
  user,
  activeSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
}: VisionTopBarProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarInner}>
        <div className={styles.brandCluster}>
          <div className={styles.logo} aria-label="Vision">
            V
          </div>
          <nav className={styles.primaryNav} aria-label="Browse">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx(styles.navLink, activeSection === item.id && styles.navLinkActive)}
                onClick={() => onSectionChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.topActions}>
          <label className={styles.searchToggle}>
            <Icon name="search" size={18} />
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
          <button type="button" className={styles.iconBtn} aria-label="Notifications">
            <Icon name="bell" size={18} />
          </button>
          <button type="button" className={styles.profileBtn} aria-label={user.name}>
            {user.name
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
            <Icon name="chevron-down" size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

export interface VisionHeroProps {
  featured: VisionFeaturedContent;
}

export function VisionHero({ featured }: VisionHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="vision-hero-title">
      <span className={posterClass(featured.imageTone, "hero")} aria-hidden="true" />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.heroContent}>
        {featured.badge && <p className={styles.heroBadge}>{featured.badge}</p>}
        <h1 id="vision-hero-title" className={styles.heroTitle}>
          {featured.title}
        </h1>
        {featured.rankLabel && (
          <p className={styles.heroRank}>
            <span className={styles.top10Badge}>TOP 10</span>
            {featured.rankLabel}
          </p>
        )}
        <p className={styles.heroDescription}>{featured.description}</p>
        <div className={styles.heroActions}>
          <button type="button" className={styles.playBtn}>
            <Icon name="play" size={22} />
            Play
          </button>
          <button type="button" className={styles.infoBtn}>
            <span className={styles.infoIcon} aria-hidden="true">
              i
            </span>
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}

interface RowScrollProps {
  children: ReactNode;
}

function RowScroll({ children }: RowScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
  }

  return (
    <div className={styles.rowScrollWrap}>
      <button type="button" className={cx(styles.rowArrow, styles.rowArrowLeft)} aria-label="Scroll left" onClick={() => scrollBy(-1)}>
        <Icon name="chevron-left" size={28} />
      </button>
      <div className={styles.rowTrack} ref={trackRef}>
        {children}
      </div>
      <button type="button" className={cx(styles.rowArrow, styles.rowArrowRight)} aria-label="Scroll right" onClick={() => scrollBy(1)}>
        <Icon name="chevron-right" size={28} />
      </button>
    </div>
  );
}

function DefaultTile({ item }: { item: VisionMediaItem }) {
  return (
    <button type="button" className={styles.mediaTile}>
      <span className={posterClass(item.imageTone, "md")} aria-hidden="true" />
      {item.badge && <span className={styles.tileBadge}>{item.badge}</span>}
      {item.rating && <span className={styles.tileRating}>{item.rating}</span>}
      <span className={styles.tileMeta}>
        <span className={styles.tileTitle}>{item.title}</span>
        {item.duration && <span className={styles.tileDuration}>{item.duration}</span>}
      </span>
    </button>
  );
}

function ContinueTile({ item }: { item: VisionContinueItem }) {
  return (
    <button type="button" className={styles.continueTile}>
      <span className={posterClass(item.imageTone, "md")} aria-hidden="true" />
      <span className={styles.continueProgressTrack} aria-hidden="true">
        <span className={styles.continueProgressFill} style={{ width: `${item.progress}%` }} />
      </span>
      <span className={styles.tileMeta}>
        <span className={styles.tileTitle}>{item.title}</span>
        {item.episodeLabel && <span className={styles.tileDuration}>{item.episodeLabel}</span>}
      </span>
    </button>
  );
}

function Top10Tile({ item }: { item: VisionTop10Item }) {
  return (
    <button type="button" className={styles.top10Tile}>
      <span className={styles.top10Rank} aria-hidden="true">
        {item.rank}
      </span>
      <span className={posterClass(item.imageTone, "md")} aria-hidden="true" />
      {item.badge && <span className={styles.tileBadge}>{item.badge}</span>}
      <span className={styles.tileMeta}>
        <span className={styles.tileTitle}>{item.title}</span>
      </span>
    </button>
  );
}

export interface VisionContentRowsProps {
  rows: VisionContentRow[];
}

export function VisionContentRows({ rows }: VisionContentRowsProps) {
  return (
    <div className={styles.rows}>
      {rows.map((row) => (
        <section key={row.id} className={styles.rowSection} aria-labelledby={`row-${row.id}`}>
          <div className={styles.rowHeader}>
            <h2 id={`row-${row.id}`} className={styles.rowTitle}>
              {row.title}
            </h2>
            {row.exploreLabel && (
              <button type="button" className={styles.exploreLink}>
                {row.exploreLabel}
                <Icon name="chevron-right" size={16} />
              </button>
            )}
          </div>

          <RowScroll>
            {row.variant === "continue" &&
              (row.items as VisionContinueItem[]).map((item) => <ContinueTile key={item.id} item={item} />)}
            {row.variant === "top10" &&
              (row.items as VisionTop10Item[]).map((item) => <Top10Tile key={item.id} item={item} />)}
            {row.variant === "default" &&
              (row.items as VisionMediaItem[]).map((item) => <DefaultTile key={item.id} item={item} />)}
          </RowScroll>
        </section>
      ))}
    </div>
  );
}

export interface VisionPlayerBarProps {
  nowPlaying: VisionNowPlaying;
  playing: boolean;
  onTogglePlay: () => void;
}

export function VisionPlayerBar({ nowPlaying, playing, onTogglePlay }: VisionPlayerBarProps) {
  const kindLabel =
    nowPlaying.kind === "podcast"
      ? "Podcast"
      : nowPlaying.kind === "music-video"
        ? "Music video"
        : nowPlaying.kind === "series"
          ? "Series"
          : "Movie";

  return (
    <footer className={styles.playerBar} aria-label="Playback controls">
      <div className={styles.playerTrack}>
        <span className={posterClass(nowPlaying.imageTone, "sm")} aria-hidden="true" />
        <div className={styles.playerTrackMeta}>
          <span className={styles.playerTrackTitle}>{nowPlaying.title}</span>
          <span className={styles.playerTrackSubtitle}>{nowPlaying.subtitle}</span>
          <span className={styles.playerKindTag}>{kindLabel}</span>
        </div>
      </div>

      <div className={styles.playerControls}>
        <div className={styles.controlRow}>
          <button type="button" className={styles.controlBtn} aria-label="Previous">
            <Icon name="skip-back" size={18} />
          </button>
          <button type="button" className={styles.playPauseBtn} aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
            <Icon name={playing ? "pause" : "play"} size={18} />
          </button>
          <button type="button" className={styles.controlBtn} aria-label="Next">
            <Icon name="skip-forward" size={18} />
          </button>
        </div>
        <div className={styles.progressRow}>
          <span className={styles.timeLabel}>{nowPlaying.elapsed}</span>
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressFill} style={{ width: `${nowPlaying.progress}%` }} />
          </div>
          <span className={styles.timeLabel}>{nowPlaying.duration}</span>
        </div>
      </div>

      <div className={styles.playerExtras}>
        <button type="button" className={styles.iconBtn} aria-label="Captions">
          <Icon name="paragraph" size={16} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Volume">
          <Icon name="volume" size={16} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Full screen">
          <Icon name="maximize" size={16} />
        </button>
      </div>
    </footer>
  );
}
