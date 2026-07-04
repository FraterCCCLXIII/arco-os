import { ScrollArea } from "../../primitives/ScrollArea";
import {
  FacebookShortcuts,
  FacebookTopBar,
  SocialBirthdaysWidget,
  SocialComposer,
  SocialContactsWidget,
  SocialFeed,
  SocialNewsWidget,
  SocialPremiumWidget,
  SocialSearchWidget,
  SocialSponsoredWidget,
  SocialStoriesRow,
  SocialSuggestionsWidget,
  SocialTrendsWidget,
  TwitterNav,
} from "./SocialParts";
import type {
  SocialBirthdayNotice,
  SocialContactOnline,
  SocialNavItem,
  SocialNewsItem,
  SocialPost,
  SocialShortcut,
  SocialStory,
  SocialSuggestion,
  SocialTrend,
} from "./types";
import styles from "./SocialWorkspace.tailwind";

export interface TwitterLayoutProps {
  navItems: SocialNavItem[];
  posts: SocialPost[];
  trends: SocialTrend[];
  news: SocialNewsItem[];
  suggestions: SocialSuggestion[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onComposerSubmit: () => void;
  feedTab: string;
  onFeedTabChange: (tab: string) => void;
  currentUser: { name: string; handle: string; avatarSrc?: string };
}

export function TwitterLayout({
  navItems,
  posts,
  trends,
  news,
  suggestions,
  composerValue,
  onComposerChange,
  onComposerSubmit,
  feedTab,
  onFeedTabChange,
  currentUser,
}: TwitterLayoutProps) {
  return (
    <>
      <TwitterNav navItems={navItems} currentUser={currentUser} />

      <main className={styles.twitterMain}>
        <ScrollArea className={styles.twitterFeedScroll}>
          <SocialComposer
            variant="twitter"
            value={composerValue}
            onChange={onComposerChange}
            onSubmit={onComposerSubmit}
            feedTab={feedTab}
            onFeedTabChange={onFeedTabChange}
            currentUser={currentUser}
          />
          <SocialFeed posts={posts} variant="twitter" />
        </ScrollArea>
      </main>

      <aside className={styles.twitterRight}>
        <ScrollArea className={styles.twitterRightScroll}>
          <div className={styles.widgetStack}>
            <SocialSearchWidget />
            <SocialPremiumWidget />
            <SocialNewsWidget items={news} />
            <SocialTrendsWidget trends={trends} />
            <SocialSuggestionsWidget suggestions={suggestions} />
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

export interface FacebookLayoutProps {
  shortcuts: SocialShortcut[];
  stories: SocialStory[];
  posts: SocialPost[];
  birthdays: SocialBirthdayNotice;
  contactsOnline: SocialContactOnline[];
  suggestions: SocialSuggestion[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onComposerSubmit: () => void;
  currentUser: { name: string; avatarSrc?: string };
}

export function FacebookLayout({
  shortcuts,
  stories,
  posts,
  birthdays,
  contactsOnline,
  suggestions,
  composerValue,
  onComposerChange,
  onComposerSubmit,
  currentUser,
}: FacebookLayoutProps) {
  return (
    <div className={styles.facebookShell}>
      <FacebookTopBar />

      <div className={styles.facebookBody}>
        <FacebookShortcuts shortcuts={shortcuts} currentUser={currentUser} />

        <main className={styles.facebookMain}>
          <ScrollArea className={styles.facebookFeedScroll}>
            <SocialComposer
              variant="facebook"
              value={composerValue}
              onChange={onComposerChange}
              onSubmit={onComposerSubmit}
              placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
              currentUser={currentUser}
            />
            <SocialStoriesRow stories={stories} />
            <SocialFeed posts={posts} variant="facebook" />
          </ScrollArea>
        </main>

        <aside className={styles.facebookRight}>
          <ScrollArea className={styles.facebookRightScroll}>
            <div className={styles.widgetStack}>
              <SocialSponsoredWidget />
              <SocialBirthdaysWidget notice={birthdays} />
              <SocialContactsWidget contacts={contactsOnline} title="Contacts" />
              <SocialSuggestionsWidget suggestions={suggestions} title="People you may know" />
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
