import { siteMeta } from "../content/site-content";
import shared from "../styles/shared.module.css";
import styles from "./CTASection.module.css";

type CTAAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type CTASectionProps = {
  title?: string;
  body?: string;
  actions?: readonly CTAAction[];
};

const defaultActions: readonly CTAAction[] = [
  { label: "Launch longformer-demo", href: "http://localhost:5173", variant: "primary" },
  {
    label: "View matrix-os.com reference",
    href: "https://matrix-os.com/",
    variant: "secondary",
    external: true,
  },
];

export function CTASection({
  title = "Build the integrated AI workspace",
  body = "Start with the UI Experiments demo, then follow the integration path in Project-planning — OpenClaw plugin, OpenHands embed, OpenUI streaming.",
  actions = defaultActions,
}: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          {actions.map((action) => (
            <a
              key={action.href}
              className={
                action.variant === "secondary"
                  ? shared.buttonSecondary
                  : shared.buttonPrimary
              }
              href={action.href}
              {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerBrand}>{siteMeta.name}</p>
        <p className={styles.footerCopy}>
          Presentation OS prototype · UI Experiments monorepo
        </p>
        <nav className={styles.footerNav} aria-label="Footer">
          <a href="https://matrix-os.com/" target="_blank" rel="noreferrer">
            matrix-os.com
          </a>
          <a href="https://github.com/HamedMP/matrix-os" target="_blank" rel="noreferrer">
            Matrix OS repo
          </a>
        </nav>
      </div>
    </footer>
  );
}
