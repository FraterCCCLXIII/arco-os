import { FacebookLayout, TwitterLayout } from "./SocialLayouts";
import { SocialWorkspaceRail } from "./SocialParts";
import type {
  SocialBirthdayNotice,
  SocialContactOnline,
  SocialNavItem,
  SocialNetworkId,
  SocialNetworkItem,
  SocialNewsItem,
  SocialPost,
  SocialShortcut,
  SocialStory,
  SocialSuggestion,
  SocialTrend,
} from "./types";
import styles from "./SocialWorkspace.module.css";

export interface SocialWorkspaceProps {
  networks: SocialNetworkItem[];
  activeNetworkId: SocialNetworkId;
  onSelectNetwork: (id: SocialNetworkId) => void;
  twitterNavItems: SocialNavItem[];
  facebookShortcuts: SocialShortcut[];
  facebookStories: SocialStory[];
  posts: SocialPost[];
  trends: SocialTrend[];
  news: SocialNewsItem[];
  suggestions: SocialSuggestion[];
  birthdays: SocialBirthdayNotice;
  contactsOnline: SocialContactOnline[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onComposerSubmit: () => void;
  feedTab: string;
  onFeedTabChange: (tab: string) => void;
  currentUser: { name: string; handle: string; avatarSrc?: string };
}

/**
 * Social network workspace with a Groups-style rail to switch between
 * Twitter/X and Facebook layouts while sharing feed primitives.
 */
export function SocialWorkspace({
  networks,
  activeNetworkId,
  onSelectNetwork,
  twitterNavItems,
  facebookShortcuts,
  facebookStories,
  posts,
  trends,
  news,
  suggestions,
  birthdays,
  contactsOnline,
  composerValue,
  onComposerChange,
  onComposerSubmit,
  feedTab,
  onFeedTabChange,
  currentUser,
}: SocialWorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <SocialWorkspaceRail
        networks={networks}
        activeNetworkId={activeNetworkId}
        onSelectNetwork={(id) => onSelectNetwork(id as SocialNetworkId)}
      />

      {activeNetworkId === "twitter" ? (
        <TwitterLayout
          navItems={twitterNavItems}
          posts={posts}
          trends={trends}
          news={news}
          suggestions={suggestions}
          composerValue={composerValue}
          onComposerChange={onComposerChange}
          onComposerSubmit={onComposerSubmit}
          feedTab={feedTab}
          onFeedTabChange={onFeedTabChange}
          currentUser={currentUser}
        />
      ) : (
        <FacebookLayout
          shortcuts={facebookShortcuts}
          stories={facebookStories}
          posts={posts}
          birthdays={birthdays}
          contactsOnline={contactsOnline}
          suggestions={suggestions}
          composerValue={composerValue}
          onComposerChange={onComposerChange}
          onComposerSubmit={onComposerSubmit}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
