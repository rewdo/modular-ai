// ============================================================
// ModularAI — Shared Types
// ============================================================

// ---- Enums / Unions ----

export type AssetType = "prompt" | "agent" | "workflow" | "knowledge_pack";
export type AssetTypeLabel = "Prompt" | "Agent" | "Workflow" | "Knowledge Pack";
export type TagColor = "default" | "primary" | "success" | "warning" | "danger";
export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

// ---- Model Config ----

export interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
}

// ---- User ----

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// ---- Workspace ----

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: "personal" | "team";
  ownerId: string;
  memberCount: number;
  assetCount: number;
}

// ---- Asset Content ----

export interface AssetContent {
  systemPrompt?: string;
  userPromptTemplate?: string;
  variablesSchema?: Record<string, unknown>;
  modelConfig?: ModelConfig;
  outputSchema?: Record<string, unknown>;
  examples?: { input: string; output: string }[];
  roleDefinition?: string;
  memoryStrategy?: string;
  toolsConfig?: { tools: unknown[] };
  promptRefs?: string[];
  nodes?: unknown[];
  edges?: unknown[];
  triggerConfig?: Record<string, unknown>;
  inputSchema?: Record<string, unknown>;
  datasourceMeta?: Record<string, unknown>;
  chunkingConfig?: Record<string, unknown>;
  retrievalConfig?: Record<string, unknown>;
  embeddingModel?: string;
  indexMeta?: Record<string, unknown>;
  referencedAssets?: string[];
}

// ---- Version ----

export interface Version {
  id: string;
  assetId: string;
  versionNumber: number;
  branchName: string;
  parentVersionId?: string;
  contentJson: AssetContent;
  changeSummary: string;
  aiChangeSummary?: string;
  isStable: boolean;
  createdBy: string;
  createdAt: string;
}

// ---- Asset (main model from lib/mock-data) ----

export interface Asset {
  id: string;
  workspaceId: string;
  type: AssetType;
  name: string;
  slug: string;
  description: string;
  visibility: "private" | "workspace" | "public";
  sourceType: "manual" | "dify" | "coze" | "n8n" | "import_file";
  sourceMetadata?: Record<string, unknown>;
  tags: string[];
  content: AssetContent;
  currentVersionId: string;
  currentVersion: Version;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Merge Request ----

export interface MergeRequest {
  id: string;
  assetId: string;
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
  sourceVersionId: string;
  targetVersionId: string;
  sourceVersion: Version;
  targetVersion: Version;
  status: "open" | "merged" | "closed";
  createdBy: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  mergedAt?: string;
  costChange?: number;
  scoreChange?: number;
}

// ---- Evaluation ----

export interface Evaluation {
  id: string;
  workspaceId: string;
  assetId: string;
  name: string;
  description?: string;
  caseCount: number;
  createdBy: string;
  createdAt: string;
}

export interface EvaluationRun {
  id: string;
  evaluationId: string;
  assetVersionId: string;
  status: "pending" | "running" | "completed" | "failed";
  avgScore: number;
  avgCost: number;
  avgLatency: number;
  summary?: string;
  createdBy: string;
  createdAt: string;
}

// ---- Activity ----

export interface Activity {
  id: string;
  actorId: string;
  actorName: string;
  entityType: "asset" | "merge_request" | "evaluation_run";
  entityId: string;
  actionType: string;
  actionLabel: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================
// Dashboard-specific simplified types
// ============================================================

export interface AssetTag {
  id: string;
  label: string;
  color: TagColor;
}

export interface DashboardStats {
  totalAssets: number;
  weeklyNewVersions: number;
  pendingMRs: number;
  weeklyTestCost: number;
}

// ============================================================
// Helpers
// ============================================================

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return formatDate(iso);
}

export function getAssetTypeLabel(type: AssetType): AssetTypeLabel {
  const map: Record<AssetType, AssetTypeLabel> = {
    prompt: "Prompt",
    agent: "Agent",
    workflow: "Workflow",
    knowledge_pack: "Knowledge Pack",
  };
  return map[type];
}

export const typeColors: Record<AssetType, BadgeVariant> = {
  prompt: "primary",
  agent: "success",
  workflow: "warning",
  knowledge_pack: "danger",
};

export const typeOptions: { label: AssetTypeLabel; value: AssetType | "all" }[] = [
  { label: "Prompt", value: "prompt" },
  { label: "Agent", value: "agent" },
  { label: "Workflow", value: "workflow" },
  { label: "Knowledge Pack", value: "knowledge_pack" },
];
