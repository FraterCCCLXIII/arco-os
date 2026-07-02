import { siteMeta } from "../content/site-content";
import shared from "../styles/shared.module.css";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={shared.sectionNarrow}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Presentation OS · UI Experiments</p>
          <h1 className={styles.title}>{siteMeta.tagline}</h1>
          <p className={styles.description}>{siteMeta.description}</p>
          <div className={styles.actions}>
            <a className={shared.buttonPrimary} href="http://localhost:5173">
              Try the demo
              <span aria-hidden="true">→</span>
            </a>
            <a className={shared.buttonSecondary} href="#architecture">
              Read the architecture
            </a>
          </div>
          <p className={styles.note}>
            Inspired by matrix-os.com — warm editorial marketing for an AI-native
            workspace story.
          </p>
        </div>
      </div>

      <div className={styles.previewWrap}>
        <div className={styles.previewCard} aria-label="Longformer shell preview">
          <div className={styles.previewChrome}>
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewDot} />
            <span className={styles.previewLabel}>longformer-demo · AppShell</span>
          </div>
          <div className={styles.previewBody}>
            <aside className={styles.previewRail}>
              <span />
              <span />
              <span />
              <span />
            </aside>
            <div className={styles.previewMain}>
              <div className={styles.previewSidebar} />
              <div className={styles.previewWorkspace}>
                <div className={styles.previewChatLine} />
                <div className={styles.previewChatLineShort} />
                <div className={styles.previewBlock} />
              </div>
              <div className={styles.previewContext}>
                <div className={styles.previewContextLine} />
                <div className={styles.previewContextLine} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
