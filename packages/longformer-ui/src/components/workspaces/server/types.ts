import type { IconName } from "../../../icons";

export type ServerView =
  | "dashboard"
  | "deployments"
  | "storage"
  | "servers"
  | "sources"
  | "domains";

export type AppKind = "frontend" | "backend" | "fullstack" | "docker" | "static" | "worker";

export type DeployStatus = "ready" | "building" | "error" | "stopped";

export interface ServerNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: ServerView;
  badge?: string;
}

export interface UsageMetric {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
  exceeded?: boolean;
}

export interface RecentPreview {
  id: string;
  branch: string;
  commitMessage: string;
  author: string;
  timeAgo: string;
}

export interface ServerProject {
  id: string;
  name: string;
  url: string;
  kind: AppKind;
  status: DeployStatus;
  repo: string;
  commitMessage: string;
  deployedAt: string;
  branch: string;
  icon?: string;
  iconBg?: string;
}

export interface ServerDeployment {
  id: string;
  projectName: string;
  status: DeployStatus;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  duration: string;
  timeAgo: string;
  environment: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  description: string;
  status: "online" | "offline" | "maintenance";
  ip?: string;
  region?: string;
  cpu: number;
  memory: number;
  disk: number;
  apps: number;
}

export interface StorageVolume {
  id: string;
  name: string;
  mountPath: string;
  projectName: string;
  usedGb: number;
  totalGb: number;
  type: "persistent" | "tmpfs" | "bind";
}

export interface StorageBucket {
  id: string;
  name: string;
  provider: "s3" | "r2" | "minio" | "gcs";
  endpoint: string;
  usedGb: number;
  totalGb: number;
  objects: number;
  status: "connected" | "error" | "syncing";
}

export interface DatabaseStorage {
  id: string;
  name: string;
  engine: "postgres" | "mysql" | "redis" | "mongodb";
  projectName: string;
  usedGb: number;
  totalGb: number;
  connections: number;
}

export interface ServerWorkspaceOption {
  id: string;
  name: string;
  planLabel?: string;
  icon?: IconName;
}

export interface ServerWorkspaceData {
  teamId: string;
  teams: ServerWorkspaceOption[];
  userName: string;
  navItems: ServerNavItem[];
  usageMetrics: UsageMetric[];
  usageExceeded: boolean;
  recentPreviews: RecentPreview[];
  projects: ServerProject[];
  deployments: ServerDeployment[];
  servers: ServerInstance[];
  volumes: StorageVolume[];
  buckets: StorageBucket[];
  databases: DatabaseStorage[];
}
