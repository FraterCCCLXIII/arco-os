import { useState } from "react";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { Chip } from "../../primitives/Chip";
import { BrowserToolbar } from "../desktop/BrowserToolbar";
import styles from "./ContextBrowserPane.tailwind";

export interface ContextBrowserQuickLink {
  label: string;
  url: string;
}

export interface ContextBrowserPaneProps {
  initialUrl?: string;
  quickLinks?: ContextBrowserQuickLink[];
}

const DEFAULT_QUICK_LINKS: ContextBrowserQuickLink[] = [
  { label: "Longformer docs", url: "https://docs.meridian.dev" },
  { label: "Design tokens", url: "https://docs.meridian.dev/tokens" },
  { label: "Component gallery", url: "https://docs.meridian.dev/components" },
];

/** Compact browser surface for the chat context drawer — toolbar plus a new-tab style page. */
export function ContextBrowserPane({
  initialUrl = "",
  quickLinks = DEFAULT_QUICK_LINKS,
}: ContextBrowserPaneProps) {
  const [url, setUrl] = useState(initialUrl);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className={styles.pane}>
      <BrowserToolbar
        url={url}
        onUrlChange={setUrl}
        canGoBack={Boolean(url)}
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((value) => !value)}
        secure={url.length === 0 || url.startsWith("https://")}
        className={styles.toolbar}
      />
      <div className={styles.page}>
        {url ? (
          <div className={styles.preview}>
            <Icon name="globe" size={20} />
            <div className={styles.previewUrl}>{url}</div>
            <p className={styles.previewHint}>Agent browser preview — wire to a real webview or iframe.</p>
          </div>
        ) : (
          <div className={styles.searchBlock}>
            <div className={styles.logo}>
              <Icon name="globe" size={22} />
            </div>
            <Input
              wrapperClassName={styles.search}
              startSlot={<Icon name="search" size={14} />}
              placeholder="Search or enter address"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <div className={styles.quickLinks}>
              {quickLinks.map((link) => (
                <Chip key={link.url} icon="external-link" onClick={() => setUrl(link.url)}>
                  {link.label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
