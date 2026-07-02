import { navLinks, siteMeta } from "../content/site-content";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#" aria-label={`${siteMeta.name} home`}>
          <span className={styles.logoMark} aria-hidden="true">
            LF
          </span>
          <span className={styles.wordmark}>{siteMeta.name}</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.navPill}>
            {navLinks.map((link) => (
              <a key={link.href} className={styles.navLink} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.actions}>
          <a className={styles.buttonSoft} href="http://localhost:5173">
            Try demo
          </a>
          <a className={styles.buttonDark} href="#architecture">
            Architecture
          </a>
        </div>
      </div>
    </header>
  );
}
