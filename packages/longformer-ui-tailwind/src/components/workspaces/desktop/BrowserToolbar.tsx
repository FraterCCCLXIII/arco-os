import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import styles from "./BrowserToolbar.tailwind";

export interface BrowserToolbarProps {
  url: string;
  onUrlChange?: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onReload?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  secure?: boolean;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  className?: string;
}

/** The nav-buttons + address-bar row used inside `BrowserApp`'s window content. */
export function BrowserToolbar({
  url,
  onUrlChange,
  onBack,
  onForward,
  onReload,
  canGoBack = true,
  canGoForward = false,
  secure = true,
  bookmarked = false,
  onToggleBookmark,
  className,
}: BrowserToolbarProps) {
  return (
    <div className={cx(styles.toolbar, className)}>
      <div className={styles.nav}>
        <IconButton icon="chevron-left" label="Back" size="sm" disabled={!canGoBack} onClick={onBack} />
        <IconButton icon="chevron-right" label="Forward" size="sm" disabled={!canGoForward} onClick={onForward} />
        <IconButton icon="refresh" label="Reload" size="sm" onClick={onReload} />
      </div>
      <Input
        wrapperClassName={styles.address}
        startSlot={<Icon name={secure ? "lock" : "external-link"} size={13} />}
        endSlot={
          <button
            type="button"
            className={styles.bookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={bookmarked}
            onClick={onToggleBookmark}
          >
            <Icon name="star" size={14} style={{ opacity: bookmarked ? 1 : 0.35 }} />
          </button>
        }
        value={url}
        onChange={(event) => onUrlChange?.(event.target.value)}
        aria-label="Address"
      />
    </div>
  );
}
