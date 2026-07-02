import { siteMeta } from "../content/site-content";
import shared from "../styles/shared.module.css";
import styles from "./CTASection.module.css";

export function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>Build the integrated AI workspace</h2>
        <p className={styles.body}>
          Start with the UI Experiments demo, then follow the integration path in
          Project-planning — OpenClaw plugin, OpenHands embed, OpenUI streaming.
        </p>
        <div className={styles.actions}>
          <a className={shared.buttonPrimary} href="http://localhost:5173">
            Launch longformer-demo
          </a>
          <a
            className={shared.buttonSecondary}
            href="https://matrix-os.com/"
            target="_blank"
            rel="noreferrer"
          >
            View matrix-os.com reference
          </a>
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
