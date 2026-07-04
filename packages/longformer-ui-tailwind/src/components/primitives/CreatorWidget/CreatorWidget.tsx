import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { CreatorWidgetShell } from "./CreatorWidgetShell";
import styles from "./CreatorWidget.tailwind";
import type { CreatorWidgetBackground, CreatorWidgetProps } from "./types";

const DEFAULT_WAVEFORM = [18, 42, 28, 56, 34, 48, 22, 62, 38, 52, 30, 44, 26, 58, 36, 50, 24, 46];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className={styles.verified} aria-label="Verified">
      <Icon name="check" size={8} />
    </span>
  );
}

function AuthorHeader({
  name,
  verified,
  subtitle,
  avatarName,
  trailing,
  light,
}: {
  name: string;
  verified?: boolean;
  subtitle?: string;
  avatarName?: string;
  trailing?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={styles.authorRow}>
      <span className={cx(styles.avatar, light && styles.light)} aria-hidden="true">
        {initialsFor(avatarName ?? name)}
      </span>
      <div className={styles.authorMeta}>
        <div className={styles.authorName}>
          {name}
          {verified && <VerifiedBadge />}
        </div>
        {subtitle && <div className={styles.authorSub}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}

function AvatarStack({ names }: { names: string[] }) {
  return (
    <span className={styles.avatarStack} aria-hidden="true">
      {names.slice(0, 4).map((name) => (
        <span key={name} className={styles.stackAvatar}>
          {initialsFor(name)}
        </span>
      ))}
    </span>
  );
}

function Waveform({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className={styles.waveform} aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          className={styles.waveBar}
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function defaultBackground(variant: CreatorWidgetProps["variant"]): CreatorWidgetBackground {
  switch (variant) {
    case "consultantProfile":
      return "magenta";
    case "quoteArticle":
      return "sky";
    case "streamEpisode":
      return "studio";
    case "videoCourse":
      return "lavender";
    case "liveCourse":
      return "teal";
    case "audioPlayer":
      return "frost";
    case "workshopEvent":
      return "sunset";
    case "masterclass":
      return "emerald";
    case "newsletterSignup":
      return "frost";
    case "coachingSlot":
      return "coral";
    default:
      return "studio";
  }
}

function isLightBackground(background: CreatorWidgetBackground) {
  return background === "sky" || background === "frost";
}

/** Rich media creator cards — consultation profiles, podcasts, courses, and audio. */
export function CreatorWidget(props: CreatorWidgetProps) {
  const { className } = props;
  const background = props.background ?? defaultBackground(props.variant);
  const light = isLightBackground(background);

  switch (props.variant) {
    case "consultantProfile":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <div>
              <div className={styles.pillRow}>
                {props.available && <span className={cx(styles.pill, styles.pillAvail)}>AVAIL</span>}
                {props.priceTier && <span className={cx(styles.pill, styles.pillPrice)}>{props.priceTier}</span>}
              </div>
              <AuthorHeader name={props.name} verified={props.verified} avatarName={props.name} />
            </div>
            <Metric value={props.durationValue} label={props.durationLabel} />
          </div>
          <div className={styles.body}>
            <div className={styles.statsRow}>
              {props.memberNames && <AvatarStack names={props.memberNames} />}
              {props.followerCount && <span className={styles.statItem}>{props.followerCount}</span>}
              <span className={styles.statItem}>
                <Icon name="chat" size={12} />
              </span>
              {props.rating && (
                <span className={styles.rating}>
                  <Icon name="star" size={12} />
                  {props.rating}
                </span>
              )}
            </div>
            {props.bio && <p className={styles.bio}>{props.bio}</p>}
            <div className={styles.footerActions}>
              <button type="button" className={styles.glassBtn}>
                {props.primaryAction ?? "Book a consultation"}
              </button>
              <button type="button" className={cx(styles.glassBtn, styles.glassBtnPrimary)}>
                {props.secondaryAction ?? "Request"}
              </button>
            </div>
          </div>
        </CreatorWidgetShell>
      );

    case "quoteArticle":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.showName}
              verified={props.verified}
              subtitle={props.subtitle}
              avatarName={props.showName}
              light={light}
            />
            <Metric value={props.dateValue} label={props.dateLabel} />
          </div>
          <div className={styles.body}>
            <div className={styles.quoteMark} aria-hidden="true">
              "
            </div>
            <p className={styles.quoteText}>{props.quote}</p>
            <div className={styles.footer}>
              <button type="button" className={styles.pdfBtn}>
                {props.downloadLabel ?? "PDF"}
                <Icon name="download" size={14} />
              </button>
              <button type="button" className={cx(styles.glassBtn, styles.glassBtnSolid)}>
                {props.readAction ?? "Read More"}
              </button>
            </div>
          </div>
        </CreatorWidgetShell>
      );

    case "streamEpisode":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.hostName}
              verified={props.verified}
              avatarName={props.hostName}
              trailing={
                props.donateLabel ? (
                  <span className={cx(styles.pill, styles.pillDonate)}>{props.donateLabel}</span>
                ) : undefined
              }
            />
            <Metric value={props.durationValue} label={props.durationLabel} />
          </div>
          <div className={styles.body}>
            {props.rating && (
              <span className={styles.rating}>
                <Icon name="star" size={12} />
                {props.rating}
              </span>
            )}
            <h3 className={styles.title}>{props.title}</h3>
            <div className={styles.footer}>
              <div className={styles.statsRow}>
                {props.memberNames && <AvatarStack names={[props.memberNames]} />}
                {props.extraMembers && <span className={styles.statItem}>{props.extraMembers}</span>}
              </div>
              <button type="button" className={styles.glassBtn}>
                {props.actionLabel ?? "Book a consultation"}
              </button>
            </div>
          </div>
        </CreatorWidgetShell>
      );

    case "videoCourse":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <div>
              <div className={styles.pillRow}>
                {props.available && <span className={cx(styles.pill, styles.pillAvail)}>AVAIL</span>}
                {props.priceTier && <span className={cx(styles.pill, styles.pillPrice)}>{props.priceTier}</span>}
              </div>
              <AuthorHeader
                name={props.showName}
                verified={props.verified}
                subtitle={props.episodeCount}
                avatarName={props.showName}
              />
            </div>
            <div>
              <Metric value={props.durationValue} label={props.durationLabel} />
              {props.adFree && <span className={cx(styles.pill, styles.pillAdFree)}>Ad-free</span>}
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.statsRow}>
              {props.viewCount && (
                <span className={styles.statItem}>
                  <Icon name="users" size={12} />
                  {props.viewCount}
                </span>
              )}
              {props.memberNames && <AvatarStack names={props.memberNames} />}
              {props.rating && (
                <span className={styles.rating}>
                  <Icon name="star" size={12} />
                  {props.rating}
                </span>
              )}
            </div>
            <div className={styles.footer}>
              <div className={styles.footerActions}>
                {props.phoneAction && (
                  <button type="button" className={styles.iconBtn} aria-label="Call">
                    <Icon name="phone" size={16} />
                  </button>
                )}
                <button type="button" className={styles.glassBtn}>
                  {props.actionLabel ?? "Book Podcast"}
                </button>
              </div>
            </div>
          </div>
        </CreatorWidgetShell>
      );

    case "liveCourse":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.withSideActions}>
            <div className={styles.mainColumn}>
              <div className={styles.topRow}>
                <AuthorHeader
                  name={props.hostName}
                  verified={props.verified}
                  avatarName={props.hostName}
                  trailing={
                    props.donateLabel ? (
                      <span className={cx(styles.pill, styles.pillDonate)}>{props.donateLabel}</span>
                    ) : undefined
                  }
                />
              </div>
              <div className={styles.statsRow}>
                {props.memberNames && <AvatarStack names={props.memberNames} />}
                {props.viewerCount && (
                  <span className={styles.statItem}>
                    <Icon name="chat" size={12} />
                    {props.viewerCount}
                  </span>
                )}
                {props.live && (
                  <span className={cx(styles.pill, styles.pillLive)}>
                    <Icon name="dot" size={8} />
                    LIVE
                  </span>
                )}
                {props.sessionCount && <span className={styles.statItem}>{props.sessionCount}</span>}
              </div>
              <h3 className={styles.title}>{props.title}</h3>
              <div className={styles.footerActions}>
                <button type="button" className={styles.glassBtn}>
                  {props.primaryAction ?? "Join Course"}
                </button>
                <button type="button" className={cx(styles.glassBtn, styles.glassBtnPrimary)}>
                  {props.secondaryAction ?? "Book a consultation"}
                </button>
              </div>
            </div>
            <div className={styles.actionColumn} aria-label="Actions">
              {(["users", "bookmark", "thumbs-up", "external-link", "phone"] as const).map((icon) => (
                <button key={icon} type="button" className={styles.actionColumnBtn} aria-label={icon}>
                  <Icon name={icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        </CreatorWidgetShell>
      );

    case "audioPlayer":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.title}
              subtitle={props.subtitle}
              avatarName={props.title}
              light={light}
              trailing={
                <span className={styles.statItem}>
                  <Icon name="volume" size={14} />
                </span>
              }
            />
            <Metric value={props.timeValue} label={props.timeLabel ?? "hh / mm"} />
          </div>
          <Waveform values={props.waveform ?? DEFAULT_WAVEFORM} />
          <div className={styles.audioMeta}>
            <div>
              {props.chapterCount && (
                <div className={styles.chapterRow}>
                  <Icon name="notebook" size={14} />
                  {props.chapterCount}
                </div>
              )}
              {props.description && <p className={styles.audioInfo}>{props.description}</p>}
            </div>
            <button type="button" className={styles.playBtn} aria-label="Play">
              <Icon name="play" size={20} />
            </button>
          </div>
        </CreatorWidgetShell>
      );

    case "workshopEvent":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader name={props.hostName} verified={props.verified} avatarName={props.hostName} />
            <Metric value={props.countdownValue} label={props.countdownLabel} />
          </div>
          <div className={styles.body}>
            <h3 className={styles.title}>{props.eventTitle}</h3>
            <div className={styles.statsRow}>
              {props.memberNames && <AvatarStack names={props.memberNames} />}
              {props.spotsLeft && <span className={styles.statItem}>{props.spotsLeft}</span>}
            </div>
            <button type="button" className={cx(styles.glassBtn, styles.glassBtnPrimary)}>
              {props.actionLabel ?? "Reserve spot"}
            </button>
          </div>
        </CreatorWidgetShell>
      );

    case "masterclass":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.instructorName}
              verified={props.verified}
              subtitle={props.lessonCount}
              avatarName={props.instructorName}
            />
            <Metric value={props.durationValue} label={props.durationLabel} />
          </div>
          <div className={styles.body}>
            <h3 className={styles.title}>{props.courseTitle}</h3>
            <div className={styles.statsRow}>
              {props.price && <span className={styles.priceTag}>{props.price}</span>}
              {props.rating && (
                <span className={styles.rating}>
                  <Icon name="star" size={12} />
                  {props.rating}
                </span>
              )}
            </div>
            <button type="button" className={cx(styles.glassBtn, styles.glassBtnPrimary)}>
              {props.actionLabel ?? "Enroll now"}
            </button>
          </div>
        </CreatorWidgetShell>
      );

    case "newsletterSignup":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.publisherName}
              verified={props.verified}
              subtitle={props.subscriberCount}
              avatarName={props.publisherName}
              light={light}
            />
            <Metric value={props.issueValue} label={props.issueLabel} />
          </div>
          <div className={styles.body}>
            <h3 className={styles.title}>{props.headline}</h3>
            <button type="button" className={cx(styles.glassBtn, styles.glassBtnSolid)}>
              {props.actionLabel ?? "Subscribe free"}
            </button>
          </div>
        </CreatorWidgetShell>
      );

    case "coachingSlot":
      return (
        <CreatorWidgetShell className={className} background={background}>
          <div className={styles.topRow}>
            <AuthorHeader
              name={props.coachName}
              verified={props.verified}
              subtitle={props.specialty}
              avatarName={props.coachName}
            />
            <Metric value={props.slotTime} label={props.slotDate} />
          </div>
          <div className={styles.body}>
            <div className={styles.statsRow}>
              {props.timezone && <span className={styles.statItem}>{props.timezone}</span>}
              {props.rating && (
                <span className={styles.rating}>
                  <Icon name="star" size={12} />
                  {props.rating}
                </span>
              )}
              {props.price && <span className={styles.priceTag}>{props.price}</span>}
            </div>
            <button type="button" className={cx(styles.glassBtn, styles.glassBtnPrimary)}>
              {props.actionLabel ?? "Book session"}
            </button>
          </div>
        </CreatorWidgetShell>
      );

    default:
      return null;
  }
}
