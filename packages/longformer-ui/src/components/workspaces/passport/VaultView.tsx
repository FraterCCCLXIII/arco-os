import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { EmptyState } from "../../primitives/EmptyState";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import {
  PASSPORT_KIND_LABELS,
  filterPassportSecrets,
  type PassportSecret,
  type PassportSecretKind,
  type PassportWorkspaceData,
} from "./types";
import styles from "./PassportPage.module.css";

export interface VaultViewProps {
  data: PassportWorkspaceData;
}

function kindClass(kind: PassportSecretKind) {
  switch (kind) {
    case "password":
      return styles.kindPassword;
    case "api-key":
      return styles.kindApiKey;
    case "secret-key":
      return styles.kindSecretKey;
    case "env-variable":
      return styles.kindEnv;
    default:
      return styles.kindPill;
  }
}

function SecretRow({ secret }: { secret: PassportSecret }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.tableRow}>
      <div className={styles.secretName}>
        <span className={styles.secretTitle}>{secret.name}</span>
        <span className={styles.secretMeta}>
          {[secret.service, secret.username].filter(Boolean).join(" · ") || secret.note}
        </span>
      </div>
      <span className={cx(styles.kindPill, kindClass(secret.kind))}>{PASSPORT_KIND_LABELS[secret.kind]}</span>
      <span className={styles.maskedValue}>{revealed ? "sk_live_••••••••••••••••" : secret.maskedValue}</span>
      <span className={styles.grantCount}>
        {secret.grantedAgentIds.length} agent{secret.grantedAgentIds.length === 1 ? "" : "s"}
      </span>
      <div className={styles.rowActions}>
        <IconButton
          icon={revealed ? "lock" : "globe"}
          label={revealed ? "Hide value" : "Reveal value"}
          size="sm"
          onClick={() => setRevealed((prev) => !prev)}
        />
        <IconButton icon="copy" label="Copy to clipboard" size="sm" />
      </div>
    </div>
  );
}

/** Vault — browse passwords, API keys, secret keys, and env variables. */
export function VaultView({ data }: VaultViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<PassportSecretKind | "all">("all");

  const visibleSecrets = useMemo(
    () => filterPassportSecrets(data.secrets, searchQuery, kindFilter),
    [data.secrets, searchQuery, kindFilter],
  );

  const kindFilters: Array<{ id: PassportSecretKind | "all"; label: string }> = [
    { id: "all", label: "All" },
    { id: "password", label: "Passwords" },
    { id: "api-key", label: "API Keys" },
    { id: "secret-key", label: "Secret Keys" },
    { id: "env-variable", label: "Env Vars" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Vault</h1>
          <p className={styles.subtitle}>
            Store credentials and secrets securely. Values stay masked until you reveal them; agents receive decrypted values only through active grants.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          New secret
        </Button>
      </header>

      <div className={styles.toolbar}>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search secrets, services, tags…"
          aria-label="Search vault"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
        {kindFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={cx(styles.filterChip, kindFilter === filter.id && styles.filterChipActive)}
            onClick={() => setKindFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleSecrets.length === 0 ? (
        <EmptyState
          icon={<Icon name="lock" size={22} />}
          title="No secrets found"
          description="Try a different search term or add a new credential to your vault."
        />
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Name</span>
            <span>Type</span>
            <span>Value</span>
            <span>Grants</span>
            <span aria-hidden="true" />
          </div>
          {visibleSecrets.map((secret) => (
            <SecretRow key={secret.id} secret={secret} />
          ))}
        </div>
      )}
    </div>
  );
}
