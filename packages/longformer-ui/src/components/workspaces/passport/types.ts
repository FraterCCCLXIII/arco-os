import type { IconName } from "../../../icons";

export type PassportView = "dashboard" | "vault" | "env-sets" | "grants" | "audit";

export type PassportSecretKind = "password" | "api-key" | "secret-key" | "env-variable";

export interface PassportNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: PassportView;
  badge?: string;
}

export interface PassportMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  icon?: IconName;
  tone?: "accent" | "success" | "warning" | "neutral";
}

export interface PassportSecret {
  id: string;
  name: string;
  kind: PassportSecretKind;
  /** Masked display value — never shown in full unless revealed. */
  maskedValue: string;
  service?: string;
  username?: string;
  tags: string[];
  /** Agent IDs currently granted access. */
  grantedAgentIds: string[];
  lastUsed?: string;
  updatedAt: string;
  /** Optional note shown in the vault detail row. */
  note?: string;
}

export interface PassportEnvSet {
  id: string;
  name: string;
  description: string;
  environment: "development" | "staging" | "production" | "local";
  variableCount: number;
  secretIds: string[];
  grantedAgentIds: string[];
  updatedAt: string;
}

export interface PassportAgent {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  /** Total secrets this agent may read at runtime. */
  grantedSecretCount: number;
  lastAccess?: string;
  status: "active" | "paused";
}

export interface PassportGrant {
  id: string;
  agentId: string;
  secretId: string;
  grantedAt: string;
  grantedBy: string;
  /** When the agent last read this secret. */
  lastAccessed?: string;
}

export interface PassportAuditEntry {
  id: string;
  agentName: string;
  secretName: string;
  action: "read" | "grant" | "revoke" | "create" | "update";
  timestamp: string;
  context?: string;
}

export interface PassportWorkspaceData {
  workspaceName: string;
  userName: string;
  tagline: string;
  navItems: PassportNavItem[];
  overviewMetrics: PassportMetric[];
  secrets: PassportSecret[];
  envSets: PassportEnvSet[];
  agents: PassportAgent[];
  grants: PassportGrant[];
  auditLog: PassportAuditEntry[];
}

export const PASSPORT_KIND_LABELS: Record<PassportSecretKind, string> = {
  password: "Password",
  "api-key": "API Key",
  "secret-key": "Secret Key",
  "env-variable": "Env Variable",
};

export function filterPassportSecrets(
  secrets: PassportSecret[],
  query: string,
  kind?: PassportSecretKind | "all",
): PassportSecret[] {
  const normalized = query.trim().toLowerCase();
  return secrets.filter((secret) => {
    if (kind && kind !== "all" && secret.kind !== kind) return false;
    if (!normalized) return true;
    return (
      secret.name.toLowerCase().includes(normalized) ||
      secret.service?.toLowerCase().includes(normalized) ||
      secret.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });
}

export function countSecretsByKind(secrets: PassportSecret[]): Record<PassportSecretKind, number> {
  return secrets.reduce(
    (counts, secret) => {
      counts[secret.kind] += 1;
      return counts;
    },
    { password: 0, "api-key": 0, "secret-key": 0, "env-variable": 0 },
  );
}
