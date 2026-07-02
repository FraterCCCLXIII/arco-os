import styles from "./WikiLink.module.css";

export interface WikiLinkProps {
  label: string;
  onClick?: () => void;
}

/** Internal wikilink styled like Obsidian / Publish. */
export function WikiLink({ label, onClick }: WikiLinkProps) {
  return (
    <button type="button" className={styles.link} onClick={onClick}>
      {label}
    </button>
  );
}

export interface NoteTagProps {
  label: string;
}

/** Tag pill rendered beneath note titles. */
export function NoteTag({ label }: NoteTagProps) {
  return <span className={styles.tag}>#{label}</span>;
}
