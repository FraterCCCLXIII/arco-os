import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { CountBadge } from "../../primitives/Badge";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { Textarea } from "../../primitives/Textarea";
import { Tabs } from "../../primitives/Tabs";
import {
  NavSidebar,
  SidebarUserFooterBar,
} from "../../shell/NavSidebar";
import { ScrollArea } from "../../primitives/ScrollArea";
import type {
  SocialBirthdayNotice,
  SocialContactOnline,
  SocialNavItem,
  SocialNetworkItem,
  SocialNewsItem,
  SocialPost,
  SocialShortcut,
  SocialStory,
  SocialSuggestion,
  SocialTrend,
} from "./types";
import styles from "./SocialWorkspace.module.css";

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}

/* ── Workspace rail (network switcher) ── */

export interface SocialWorkspaceRailProps {
  networks: SocialNetworkItem[];
  activeNetworkId: string;
  onSelectNetwork: (id: string) => void;
}

export function SocialWorkspaceRail({ networks, activeNetworkId, onSelectNetwork }: SocialWorkspaceRailProps) {
  return (
    <aside className={styles.rail} aria-label="Social networks">
      <div className={styles.railNetworks}>
        {networks.map((network) => (
          <button
            key={network.id}
            type="button"
            className={cx(styles.railNetwork, network.id === activeNetworkId && styles.railNetworkActive)}
            style={network.accent ? ({ ["--social-accent" as string]: network.accent } as React.CSSProperties) : undefined}
            title={network.label}
            aria-label={network.label}
            aria-current={network.id === activeNetworkId ? "true" : undefined}
            onClick={() => onSelectNetwork(network.id)}
          >
            {network.initials}
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ── Shared post composer ── */

export interface SocialComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  variant?: "twitter" | "facebook";
  currentUser: { name: string; avatarSrc?: string };
  feedTab?: string;
  onFeedTabChange?: (tab: string) => void;
}

export function SocialComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "What's happening?",
  variant = "twitter",
  currentUser,
  feedTab = "for-you",
  onFeedTabChange,
}: SocialComposerProps) {
  const canPost = value.trim().length > 0;

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && canPost) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className={cx(styles.composerBlock, variant === "facebook" && styles.composerBlockFacebook)}>
      {variant === "twitter" && onFeedTabChange && (
        <Tabs
          items={[
            { id: "for-you", label: "For you" },
            { id: "following", label: "Following" },
          ]}
          value={feedTab}
          onChange={onFeedTabChange}
          variant="underline"
          className={styles.feedTabs}
          aria-label="Feed"
        />
      )}

      <div className={cx(styles.composer, variant === "facebook" && styles.composerFacebook)}>
        <Avatar name={currentUser.name} src={currentUser.avatarSrc} size="md" />
        <div className={styles.composerBody}>
          <Textarea
            className={styles.composerInput}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxHeight={120}
            aria-label="Compose post"
          />
          <div className={styles.composerFooter}>
            <div className={styles.composerActions}>
              <IconButton icon="image" label="Add photo" size="sm" />
              <IconButton icon="file" label="Add GIF" size="sm" />
              <IconButton icon="layers" label="Add poll" size="sm" />
              <IconButton icon="globe" label="Add emoji" size="sm" />
              {variant === "twitter" && <IconButton icon="calendar" label="Schedule" size="sm" />}
              {variant === "facebook" && <IconButton icon="video" label="Live video" size="sm" />}
            </div>
            <Button variant="primary" size="sm" disabled={!canPost} onClick={onSubmit}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared post card ── */

export interface SocialPostCardProps {
  post: SocialPost;
  variant?: "twitter" | "facebook";
}

export function SocialPostCard({ post, variant = "twitter" }: SocialPostCardProps) {
  return (
    <article className={cx(styles.post, variant === "facebook" && styles.postFacebook)}>
      <Avatar name={post.authorName} src={post.authorAvatarSrc} size="md" />
      <div className={styles.postBody}>
        <header className={styles.postHeader}>
          <div className={styles.postIdentity}>
            <span className={styles.postAuthor}>{post.authorName}</span>
            {post.verified && (
              <span className={styles.verifiedBadge} aria-label="Verified">
                <Icon name="check" size={12} />
              </span>
            )}
            <span className={styles.postHandle}>{post.authorHandle}</span>
            <span className={styles.postDot} aria-hidden="true">
              ·
            </span>
            <time className={styles.postTime}>{post.timestamp}</time>
            {variant === "facebook" && post.visibility === "public" && (
              <Icon name="globe" size={12} className={styles.postVisibility} />
            )}
          </div>
          <IconButton icon="more-horizontal" label="Post options" size="sm" />
        </header>

        <div className={styles.postContent}>{post.content}</div>

        {post.mediaType && (
          <div className={cx(styles.postMedia, post.mediaTone && styles[`media-${post.mediaTone}`])}>
            {post.mediaType === "video" ? (
              <div className={styles.mediaVideo}>
                <button type="button" className={styles.mediaPlay} aria-label="Play video">
                  <Icon name="play" size={28} />
                </button>
                {post.mediaLabel && <div className={styles.mediaLabel}>{post.mediaLabel}</div>}
              </div>
            ) : (
              <div className={styles.mediaImage}>
                {post.mediaLabel && <div className={styles.mediaImageLabel}>{post.mediaLabel}</div>}
              </div>
            )}
          </div>
        )}

        <SocialReactionBar stats={post.stats} variant={variant} />
      </div>
    </article>
  );
}

export interface SocialReactionBarProps {
  stats: SocialPost["stats"];
  variant?: "twitter" | "facebook";
}

export function SocialReactionBar({ stats, variant = "twitter" }: SocialReactionBarProps) {
  const items: { icon: IconName; label: string; count?: number }[] =
    variant === "twitter"
      ? [
          { icon: "message-square", label: "Reply", count: stats.replies },
          { icon: "repeat", label: "Repost", count: stats.reposts },
          { icon: "heart", label: "Like", count: stats.likes },
          ...(stats.views ? [{ icon: "layers" as IconName, label: "Views", count: stats.views }] : []),
          { icon: "bookmark", label: "Bookmark" },
          { icon: "external-link", label: "Share" },
        ]
      : [
          { icon: "thumbs-up", label: "Like", count: stats.likes },
          { icon: "message-square", label: "Comment", count: stats.replies },
          { icon: "external-link", label: "Share", count: stats.reposts },
        ];

  return (
    <div className={cx(styles.reactions, variant === "facebook" && styles.reactionsFacebook)}>
      {items.map((item) => (
        <button key={item.label} type="button" className={styles.reactionButton} aria-label={item.label}>
          <Icon name={item.icon} size={16} />
          {item.count !== undefined && <span>{formatCount(item.count)}</span>}
        </button>
      ))}
    </div>
  );
}

/* ── Shared feed list ── */

export interface SocialFeedProps {
  posts: SocialPost[];
  variant?: "twitter" | "facebook";
}

export function SocialFeed({ posts, variant = "twitter" }: SocialFeedProps) {
  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <SocialPostCard key={post.id} post={post} variant={variant} />
      ))}
    </div>
  );
}

/* ── Twitter nav sidebar ── */

export interface TwitterNavProps {
  navItems: SocialNavItem[];
  currentUser: { name: string; handle: string; avatarSrc?: string };
}

export function TwitterNav({ navItems, currentUser }: TwitterNavProps) {
  return (
    <NavSidebar
      className={styles.twitterNav}
      sections={[
        {
          id: "primary",
          items: navItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={22} />,
            trailing: item.badgeCount ? <CountBadge count={item.badgeCount} /> : undefined,
            active: item.active,
            className: styles.twitterNavItem,
          })),
        },
      ]}
      footer={
        <>
          <Button variant="primary" size="lg" fullWidth className={styles.twitterPostButton}>
            Post
          </Button>
          <SidebarUserFooterBar
            name={currentUser.name}
            meta={currentUser.handle}
            avatarSrc={currentUser.avatarSrc}
            status="online"
            actions={<IconButton icon="more-horizontal" label="Account menu" size="sm" />}
          />
        </>
      }
    />
  );
}

/* ── Facebook shortcuts sidebar ── */

export interface FacebookShortcutsProps {
  shortcuts: SocialShortcut[];
  currentUser: { name: string; avatarSrc?: string };
}

function shortcutInitials(label: string): string {
  const parts = label.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return label.slice(0, 2).toUpperCase();
}

export function FacebookShortcuts({ shortcuts, currentUser }: FacebookShortcutsProps) {
  return (
    <NavSidebar
      className={styles.facebookSidebar}
      sections={[
        {
          id: "shortcuts",
          title: "Your shortcuts",
          items: shortcuts.map((shortcut) => ({
            id: shortcut.id,
            label: shortcut.label,
            leading: shortcut.avatarSrc ? (
              <Avatar name={shortcut.label} src={shortcut.avatarSrc} size="sm" />
            ) : (
              <span
                className={styles.shortcutAvatar}
                style={{ background: shortcut.avatarColor ?? "var(--lf-surface-3)" }}
                aria-hidden="true"
              >
                {shortcutInitials(shortcut.avatarName ?? shortcut.label)}
              </span>
            ),
          })),
        },
      ]}
      footer={
        <SidebarUserFooterBar
          name={currentUser.name}
          meta="Active now"
          avatarSrc={currentUser.avatarSrc}
          status="online"
        />
      }
    />
  );
}

/* ── Facebook top bar ── */

export function FacebookTopBar() {
  return (
    <header className={styles.facebookTopBar}>
      <div className={styles.facebookTopLeft}>
        <span className={styles.facebookLogo} aria-hidden="true">
          f
        </span>
        <Input
          placeholder="Search Facebook"
          startSlot={<Icon name="search" size={16} />}
          wrapperClassName={styles.facebookSearch}
          aria-label="Search Facebook"
        />
      </div>
      <nav className={styles.facebookTopNav} aria-label="Primary">
        {[
          { id: "home", icon: "home" as IconName, active: true },
          { id: "video", icon: "video" as IconName },
          { id: "users", icon: "users" as IconName },
          { id: "grid", icon: "grid" as IconName },
          { id: "game", icon: "layers" as IconName },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx(styles.facebookTopNavItem, item.active && styles.facebookTopNavItemActive)}
            aria-label={item.id}
            aria-current={item.active ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </nav>
      <div className={styles.facebookTopRight}>
        <IconButton icon="grid" label="Menu" size="sm" />
        <IconButton icon="message-square" label="Messenger" size="sm" />
        <IconButton icon="bell" label="Notifications" size="sm" />
        <Avatar name="Alex Morgan" size="sm" />
      </div>
    </header>
  );
}

/* ── Facebook stories row ── */

export interface SocialStoriesRowProps {
  stories: SocialStory[];
}

export function SocialStoriesRow({ stories }: SocialStoriesRowProps) {
  return (
    <ScrollArea direction="horizontal" className={styles.storiesScroll}>
      <div className={styles.storiesRow}>
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            className={cx(styles.storyCard, story.isCreate && styles.storyCardCreate)}
            aria-label={story.isCreate ? "Create story" : `${story.authorName}'s story`}
          >
            {story.isCreate ? (
              <>
                <div className={styles.storyCreateBg} />
                <span className={styles.storyCreatePlus}>
                  <Icon name="plus" size={18} />
                </span>
              </>
            ) : (
              <>
                <div className={styles.storyThumb} />
                <span className={styles.storyAvatarWrap}>
                  <Avatar name={story.authorName} src={story.avatarSrc} size="sm" />
                </span>
              </>
            )}
            <span className={styles.storyLabel}>{story.isCreate ? "Create story" : story.authorName}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

/* ── Right-rail widgets ── */

export interface SocialSearchWidgetProps {
  placeholder?: string;
}

export function SocialSearchWidget({ placeholder = "Search" }: SocialSearchWidgetProps) {
  return (
    <Input
      placeholder={placeholder}
      startSlot={<Icon name="search" size={16} />}
      wrapperClassName={styles.widgetSearch}
      aria-label={placeholder}
    />
  );
}

export function SocialPremiumWidget() {
  return (
    <Card padding="lg" className={styles.widgetCard}>
      <div className={styles.widgetTitle}>Subscribe to Premium</div>
      <p className={styles.widgetCopy}>Unlock new features and share revenue with creators.</p>
      <Button variant="primary" size="sm">
        Subscribe
      </Button>
    </Card>
  );
}

export interface SocialNewsWidgetProps {
  items: SocialNewsItem[];
}

export function SocialNewsWidget({ items }: SocialNewsWidgetProps) {
  return (
    <Card padding="none" className={styles.widgetCard}>
      <div className={styles.widgetHeader}>Today&apos;s News</div>
      <ul className={styles.newsList}>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className={styles.newsItem}>
              <div className={cx(styles.newsThumb, item.imageTone && styles[`media-${item.imageTone}`])} />
              <div className={styles.newsBody}>
                <div className={styles.newsHeadline}>{item.headline}</div>
                <div className={styles.newsMeta}>
                  {item.timeAgo} · {item.category} · {item.postCount}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export interface SocialTrendsWidgetProps {
  trends: SocialTrend[];
}

export function SocialTrendsWidget({ trends }: SocialTrendsWidgetProps) {
  return (
    <Card padding="none" className={styles.widgetCard}>
      <div className={styles.widgetHeader}>What&apos;s happening</div>
      <ul className={styles.trendsList}>
        {trends.map((trend) => (
          <li key={trend.id}>
            <button type="button" className={styles.trendItem}>
              <div className={styles.trendCategory}>{trend.category}</div>
              <div className={styles.trendTopic}>{trend.topic}</div>
              {trend.postCount && <div className={styles.trendMeta}>{trend.postCount}</div>}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export interface SocialSuggestionsWidgetProps {
  suggestions: SocialSuggestion[];
  title?: string;
}

export function SocialSuggestionsWidget({ suggestions, title = "Who to follow" }: SocialSuggestionsWidgetProps) {
  return (
    <Card padding="none" className={styles.widgetCard}>
      <div className={styles.widgetHeader}>{title}</div>
      <ul className={styles.suggestionsList}>
        {suggestions.map((person) => (
          <li key={person.id} className={styles.suggestionItem}>
            <Avatar name={person.name} src={person.avatarSrc} size="md" />
            <div className={styles.suggestionBody}>
              <div className={styles.suggestionName}>{person.name}</div>
              <div className={styles.suggestionHandle}>{person.handle}</div>
              {person.bio && <div className={styles.suggestionBio}>{person.bio}</div>}
            </div>
            <Button variant="secondary" size="sm">
              Follow
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export interface SocialBirthdaysWidgetProps {
  notice: SocialBirthdayNotice;
}

export function SocialBirthdaysWidget({ notice }: SocialBirthdaysWidgetProps) {
  return (
    <Card padding="lg" className={styles.widgetCard}>
      <div className={styles.birthdayRow}>
        <Icon name="sparkles" size={18} />
        <span>
          {notice.names} and {notice.count} others have birthdays today.
        </span>
      </div>
    </Card>
  );
}

export interface SocialContactsWidgetProps {
  contacts: SocialContactOnline[];
  title?: string;
}

export function SocialContactsWidget({ contacts, title = "Contacts" }: SocialContactsWidgetProps) {
  return (
    <Card padding="none" className={styles.widgetCard}>
      <div className={styles.widgetHeader}>{title}</div>
      <ul className={styles.contactsList}>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button type="button" className={styles.contactItem}>
              <Avatar name={contact.name} src={contact.avatarSrc} size="sm" status={contact.status} />
              <span>{contact.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SocialSponsoredWidget() {
  return (
    <Card padding="lg" className={styles.widgetCard}>
      <div className={styles.widgetHeaderInline}>Sponsored</div>
      <div className={cx(styles.sponsoredThumb, styles["media-neutral"])} />
      <div className={styles.sponsoredCopy}>Discover tools for your next creative project.</div>
    </Card>
  );
}
