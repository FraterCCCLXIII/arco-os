import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Button } from "../Button";
import { Card } from "../Card";
import styles from "./WebinarCtaCard.tailwind";

export interface WebinarCtaCardProps {
  title?: string;
  description?: string;
  date?: string;
  duration?: string;
  actionLabel?: string;
  className?: string;
}

/** Promotional CTA card — hero illustration, event metadata, and full-width action. */
export function WebinarCtaCard({
  title = "Upcoming Webinar",
  description = "Join our live session on dashboard design patterns and data visualization.",
  date = "17 Nov 24",
  duration = "32 min",
  actionLabel = "Join The Event",
  className,
}: WebinarCtaCardProps) {
  return (
    <Card padding="none" className={cx(styles.card, className)}>
      <div className={styles.hero} aria-hidden="true">
        <div className={styles.illustration}>
          <span className={styles.laptop} />
          <span className={styles.person} />
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Icon name="calendar" size={14} />
            <div>
              <div className={styles.metaLabel}>Date</div>
              <div className={styles.metaValue}>{date}</div>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Icon name="clock" size={14} />
            <div>
              <div className={styles.metaLabel}>Duration</div>
              <div className={styles.metaValue}>{duration}</div>
            </div>
          </div>
        </div>
        <Button variant="primary" className={styles.action}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
