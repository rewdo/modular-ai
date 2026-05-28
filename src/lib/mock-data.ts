import type {
  User,
  Workspace,
  Asset,
  AssetContent,
  Version,
  MergeRequest,
  Evaluation,
  EvaluationRun,
  Activity,
  ModelConfig,
} from "@/types";

// ============================================================
// Users
// ============================================================

export const mockUsers: User[] = [
  { id: "u-001", name: "张明", email: "zhangming@modulai.ai", avatarUrl: undefined },
  { id: "u-002", name: "李雪", email: "lixue@modulai.ai", avatarUrl: undefined },
  { id: "u-003", name: "王磊", email: "wanglei@modulai.ai", avatarUrl: undefined },
  { id: "u-004", name: "陈芳", email: "chenfang@modulai.ai", avatarUrl: undefined },
  { id: "u-005", name: "赵刚", email: "zhaogang@modulai.ai", avatarUrl: undefined },
];

// ============================================================
// Workspace
// ============================================================

export const mockWorkspace: Workspace = {
  id: "ws-001",
  name: "Modulai Demo",
  slug: "modulai-demo",
  type: "team",
  ownerId: "u-001",
  memberCount: 5,
  assetCount: 24,
};

// ============================================================
// Shared Model Configs
// ============================================================

const gpt4oMini: ModelConfig = {
  provider: "OpenAI",
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
};

const claudeSonnet: ModelConfig = {
  provider: "Anthropic",
  model: "claude-sonnet-4-20250514",
  temperature: 0.3,
  maxTokens: 4096,
};

const deepseekV3: ModelConfig = {
  provider: "DeepSeek",
  model: "deepseek-chat",
  temperature: 0.1,
  maxTokens: 8192,
};

const qwenTurbo: ModelConfig = {
  provider: "Alibaba",
  model: "qwen-turbo",
  temperature: 0.5,
  maxTokens: 2048,
};

// ============================================================
// Asset Contents
// ============================================================

const contentCustomerService: AssetContent = {
  systemPrompt:
    "你是一个专业的电商客服助手，负责处理用户的售前咨询、订单查询和售后问题。请始终保持礼貌、耐心和专业。",
  userPromptTemplate:
    "用户问题：{{user_question}}\n\n订单号：{{order_id}}\n用户等级：{{user_level}}\n\n请根据以上信息生成回复：",
  variablesSchema: {
    user_question: { type: "string", required: true, description: "用户提出的问题" },
    order_id: { type: "string", required: false, description: "关联订单号" },
    user_level: {
      type: "string",
      enum: ["普通用户", "VIP", "超级VIP"],
      required: false,
      description: "用户等级",
    },
  },
  modelConfig: gpt4oMini,
  outputSchema: {
    reply: { type: "string", description: "客服回复内容" },
    sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
    suggestedAction: { type: "string", enum: ["回复即可", "转人工", "升级处理"] },
  },
  examples: [
    {
      input: "我的订单什么时候发货？订单号 ORD-20240001",
      output:
        '{"reply": "您好！您的订单 ORD-20240001 预计在1-2个工作日内发货，发货后会通过短信通知您。感谢您的耐心等待！", "sentiment": "neutral", "suggestedAction": "回复即可"}',
    },
    {
      input: "收到的商品有质量问题，我要退货！",
      output:
        '{"reply": "非常抱歉给您带来不便！我已经为您记录了质量问题，请您提供一下商品照片，我会立即为您申请退货处理。", "sentiment": "negative", "suggestedAction": "转人工"}',
    },
  ],
};

const contentCodeReview: AssetContent = {
  systemPrompt:
    "你是一个资深代码审查专家，精通 TypeScript、React、Node.js 等技术栈。请对提供的代码进行全面的审查，重点关注代码质量、安全性、性能、可维护性和最佳实践。",
  userPromptTemplate:
    "## 代码审查请求\n\n**语言/框架：** {{language}}\n**审查重点：** {{focus_areas}}\n\n```{{language}}\n{{code}}\n```\n\n请输出结构化的审查报告。",
  variablesSchema: {
    language: { type: "string", required: true, description: "编程语言" },
    focus_areas: { type: "string", required: false, description: "审查重点（逗号分隔）" },
    code: { type: "string", required: true, description: "待审查代码" },
  },
  modelConfig: claudeSonnet,
  outputSchema: {
    summary: { type: "string" },
    severity: { type: "string", enum: ["低", "中", "高", "严重"] },
    issues: {
      type: "array",
      items: {
        line: "number",
        category: "string",
        description: "string",
        suggestion: "string",
      },
    },
  },
  examples: [
    {
      input: "审查一段 React useState 使用代码",
      output:
        '{"summary": "代码整体结构良好，但存在一个状态更新竞态问题", "severity": "中", "issues": [{"line": 23, "category": "状态管理", "description": "useState 更新依赖旧值，未使用函数式更新", "suggestion": "使用 setCount(prev => prev + 1) 替代 setCount(count + 1)"}]}',
    },
  ],
};

const contentTranslation: AssetContent = {
  systemPrompt:
    "你是一个专业的多语言翻译引擎，支持中、英、日、韩、法、德、西等主要语言。翻译时保持原文语义、风格和语气，对于专业术语使用行业标准译法。",
  userPromptTemplate:
    "## 翻译任务\n\n**源语言：** {{source_lang}}\n**目标语言：** {{target_lang}}\n**领域：** {{domain}}\n**风格：** {{tone}}\n\n**原文：**\n{{text}}",
  variablesSchema: {
    source_lang: {
      type: "string",
      enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
      required: true,
      description: "源语言代码",
    },
    target_lang: {
      type: "string",
      enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
      required: true,
      description: "目标语言代码",
    },
    domain: { type: "string", required: false, default: "通用", description: "翻译领域" },
    tone: {
      type: "string",
      enum: ["正式", "口语", "技术", "营销"],
      required: false,
      default: "正式",
    },
    text: { type: "string", required: true, description: "待翻译文本" },
  },
  modelConfig: gpt4oMini,
  outputSchema: {
    translatedText: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    alternatives: { type: "array", items: { type: "string" } },
  },
};

const contentSqlGenerator: AssetContent = {
  systemPrompt:
    "你是一个精通 SQL 的数据库专家，支持 MySQL、PostgreSQL、ClickHouse 等数据库。根据自然语言描述生成高效、安全的 SQL 查询语句。",
  userPromptTemplate:
    "## SQL 生成\n\n**数据库类型：** {{db_type}}\n**表结构：** \n{{schema}}\n\n**查询需求：** {{requirement}}\n\n请生成 SQL 并附带解释。",
  variablesSchema: {
    db_type: {
      type: "string",
      enum: ["MySQL", "PostgreSQL", "ClickHouse", "SQLite"],
      required: true,
    },
    schema: { type: "string", required: true, description: "相关表结构 DDL" },
    requirement: { type: "string", required: true, description: "自然语言查询需求" },
  },
  modelConfig: deepseekV3,
  outputSchema: {
    sql: { type: "string" },
    explanation: { type: "string" },
    estimatedCost: { type: "string" },
  },
};

const contentIntelligentAgent: AssetContent = {
  roleDefinition:
    "你是一个智能数据分析助手 Agent，能够自动理解用户的数据分析需求，选择合适的工具（SQL查询、Python计算、图表生成），并输出完整的分析报告。",
  memoryStrategy: "conversation_buffer_window",
  toolsConfig: {
    tools: [
      {
        name: "sql_query",
        description: "执行 SQL 查询",
        parameters: { query: "string", database: "string" },
      },
      {
        name: "python_exec",
        description: "执行 Python 代码进行数据处理和可视化",
        parameters: { code: "string", timeout: "number" },
      },
      {
        name: "chart_generate",
        description: "根据数据生成图表",
        parameters: { data: "array", chartType: "string", title: "string" },
      },
    ],
  },
  promptRefs: ["ast-sqlgen", "ast-translation"],
  modelConfig: { ...claudeSonnet, temperature: 0.2, maxTokens: 8192 },
};

const contentWorkflowOrder: AssetContent = {
  nodes: [
    {
      id: "node-1",
      type: "trigger",
      label: "订单创建触发器",
      config: { event: "order.created", source: "电商平台" },
      position: { x: 100, y: 50 },
    },
    {
      id: "node-2",
      type: "condition",
      label: "金额判断",
      config: { expression: "order.amount > 500", trueBranch: "node-3", falseBranch: "node-4" },
      position: { x: 300, y: 50 },
    },
    {
      id: "node-3",
      type: "action",
      label: "发送人工审核通知",
      config: { channel: "飞书", template: "大额订单通知模板" },
      position: { x: 500, y: 0 },
    },
    {
      id: "node-4",
      type: "action",
      label: "自动确认订单",
      config: { action: "auto_confirm", delay: "30min" },
      position: { x: 500, y: 120 },
    },
    {
      id: "node-5",
      type: "action",
      label: "发送确认邮件",
      config: { template: "order_confirmation", channel: "email" },
      position: { x: 700, y: 60 },
    },
  ],
  edges: [
    { id: "e-1", source: "node-1", target: "node-2" },
    { id: "e-2", source: "node-2", target: "node-3", label: "金额 > 500" },
    { id: "e-3", source: "node-2", target: "node-4", label: "金额 ≤ 500" },
    { id: "e-4", source: "node-3", target: "node-5" },
    { id: "e-5", source: "node-4", target: "node-5" },
  ],
  triggerConfig: { type: "webhook", method: "POST", auth: "bearer_token" },
  inputSchema: {
    order: {
      type: "object",
      properties: {
        id: { type: "string" },
        amount: { type: "number" },
        customer_email: { type: "string" },
      },
      required: ["id", "amount"],
    },
  },
  referencedAssets: ["ast-customer-service"],
};

const contentWorkflowCrawl: AssetContent = {
  nodes: [
    {
      id: "n-1",
      type: "schedule",
      label: "定时触发器",
      config: { cron: "0 */6 * * *", description: "每6小时执行一次" },
      position: { x: 80, y: 100 },
    },
    {
      id: "n-2",
      type: "http_request",
      label: "获取目标页面",
      config: { method: "GET", timeout: 30000, retry: 3 },
      position: { x: 280, y: 100 },
    },
    {
      id: "n-3",
      type: "ai_extract",
      label: "AI 内容提取",
      config: { prompt: "从以下HTML中提取新闻标题、摘要和发布时间", model: "gpt-4o-mini" },
      position: { x: 480, y: 100 },
    },
    {
      id: "n-4",
      type: "condition",
      label: "重复检查",
      config: { expression: "!db.exists(news.url)", trueBranch: "n-5", falseBranch: "n-6" },
      position: { x: 680, y: 100 },
    },
    {
      id: "n-5",
      type: "database",
      label: "存入数据库",
      config: { operation: "insert", table: "news_articles" },
      position: { x: 880, y: 50 },
    },
    {
      id: "n-6",
      type: "noop",
      label: "跳过",
      config: {},
      position: { x: 880, y: 160 },
    },
    {
      id: "n-7",
      type: "notification",
      label: "发送通知",
      config: { channel: "飞书", message: "新闻采集完成，新增 {{count}} 条" },
      position: { x: 1080, y: 100 },
    },
  ],
  edges: [
    { id: "e1", source: "n-1", target: "n-2" },
    { id: "e2", source: "n-2", target: "n-3" },
    { id: "e3", source: "n-3", target: "n-4" },
    { id: "e4", source: "n-4", target: "n-5", label: "新内容" },
    { id: "e5", source: "n-4", target: "n-6", label: "已存在" },
    { id: "e6", source: "n-5", target: "n-7" },
    { id: "e7", source: "n-6", target: "n-7" },
  ],
  triggerConfig: { type: "cron", expression: "0 */6 * * *" },
  referencedAssets: [],
};

const contentKnowledgePack: AssetContent = {
  datasourceMeta: {
    type: "document_store",
    formats: ["pdf", "markdown", "txt", "html"],
    totalDocuments: 156,
    totalChunks: 4823,
    languages: ["zh", "en"],
  },
  chunkingConfig: {
    strategy: "recursive_text_splitter",
    chunkSize: 1024,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", "。", ".", " "],
  },
  retrievalConfig: {
    strategy: "hybrid",
    topK: 8,
    rerankEnabled: true,
    rerankModel: "bge-reranker-v2-m3",
    scoreThreshold: 0.65,
  },
  embeddingModel: "text-embedding-3-large",
  indexMeta: {
    dimensions: 3072,
    indexType: "HNSW",
    lastIndexedAt: "2026-05-27T08:00:00Z",
    totalVectorSize: "4823 × 3072",
  },
};

// ============================================================
// Assets
// ============================================================

export const mockAssets: Asset[] = [
  // --- 4 Prompts ---
  {
    id: "ast-customer-service",
    workspaceId: "ws-001",
    type: "prompt",
    name: "客服自动回复 Prompt",
    slug: "customer-service-auto-reply",
    description:
      "电商场景下的智能客服自动回复模板，支持售前咨询、订单查询和售后问题处理，可根据用户等级提供差异化服务。",
    visibility: "workspace",
    sourceType: "manual",
    tags: ["客服", "电商", "自动化", "RAG"],
    content: contentCustomerService,
    currentVersionId: "ver-cs-003",
    currentVersion: undefined as unknown as Version, // resolved below
    createdBy: "u-002",
    updatedBy: "u-002",
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-05-26T14:30:00Z",
  },
  {
    id: "ast-code-review",
    workspaceId: "ws-001",
    type: "prompt",
    name: "代码审查助手 Prompt",
    slug: "code-review-assistant",
    description:
      "从 Dify 平台导入的代码审查 Prompt，支持多语言代码审查，可自定义审查重点维度，输出结构化报告。",
    visibility: "workspace",
    sourceType: "dify",
    sourceMetadata: { difyAppId: "app-8f3a2b1c", difyVersion: "1.2.0", importedAt: "2026-05-01" },
    tags: ["代码", "审查", "TypeScript", "Dify导入"],
    content: contentCodeReview,
    currentVersionId: "ver-cr-002",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-001",
    updatedBy: "u-001",
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-24T09:00:00Z",
  },
  {
    id: "ast-translation",
    workspaceId: "ws-001",
    type: "prompt",
    name: "多语言翻译 Prompt",
    slug: "multi-lang-translation",
    description:
      "支持中英日韩法德西七大语种互译的专业翻译模板，可按领域和风格定制输出，适用于产品文档、营销文案等场景。",
    visibility: "public",
    sourceType: "manual",
    tags: ["翻译", "多语言", "NLP", "国际化"],
    content: contentTranslation,
    currentVersionId: "ver-tr-004",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-003",
    updatedBy: "u-003",
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-05-25T16:00:00Z",
  },
  {
    id: "ast-sqlgen",
    workspaceId: "ws-001",
    type: "prompt",
    name: "SQL 生成器 Prompt",
    slug: "sql-generator",
    description:
      "从外部文件导入的 SQL 生成 Prompt，支持 MySQL、PostgreSQL、ClickHouse 等主流数据库的自然语言转 SQL。",
    visibility: "private",
    sourceType: "import_file",
    sourceMetadata: {
      importedFrom: "sqlgen_prompt_v2.md",
      importedAt: "2026-04-15",
      originalAuthor: "数据分析团队",
    },
    tags: ["SQL", "数据库", "MySQL", "PostgreSQL"],
    content: contentSqlGenerator,
    currentVersionId: "ver-sql-002",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-004",
    updatedBy: "u-005",
    createdAt: "2026-04-15T11:00:00Z",
    updatedAt: "2026-05-22T10:00:00Z",
  },
  // --- 2 Workflows ---
  {
    id: "ast-order-workflow",
    workspaceId: "ws-001",
    type: "workflow",
    name: "订单处理自动化流程",
    slug: "order-processing-workflow",
    description:
      "电商订单自动处理流程：订单创建 → 金额判断 → 大额人工审核 / 小额自动确认 → 发送通知邮件，全链路自动化。",
    visibility: "workspace",
    sourceType: "n8n",
    sourceMetadata: { n8nWorkflowId: "n8n-wf-4201", n8nVersion: "1.48.0" },
    tags: ["工作流", "订单", "自动化", "电商", "n8n"],
    content: contentWorkflowOrder,
    currentVersionId: "ver-ow-003",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-005",
    updatedBy: "u-005",
    createdAt: "2026-04-20T14:00:00Z",
    updatedAt: "2026-05-27T11:00:00Z",
  },
  {
    id: "ast-crawl-workflow",
    workspaceId: "ws-001",
    type: "workflow",
    name: "智能新闻采集流程",
    slug: "smart-news-crawler",
    description:
      "定时新闻采集与摘要生成流程：定时抓取 → AI 内容提取 → 去重入库 → 飞书通知，支持多源并发采集。",
    visibility: "workspace",
    sourceType: "manual",
    tags: ["工作流", "爬虫", "新闻", "AI", "定时任务"],
    content: contentWorkflowCrawl,
    currentVersionId: "ver-cw-002",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-001",
    updatedBy: "u-001",
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-05-26T16:00:00Z",
  },
  // --- 1 Agent ---
  {
    id: "ast-data-agent",
    workspaceId: "ws-001",
    type: "agent",
    name: "数据分析智能体",
    slug: "data-analysis-agent",
    description:
      "集成 SQL 查询、Python 计算和图表生成能力的智能分析 Agent，可自动理解需求并调用工具完成端到端数据分析报告。",
    visibility: "public",
    sourceType: "coze",
    sourceMetadata: { cozeBotId: "bot_7d2e9f1a", cozeVersion: "3.4.1", importedAt: "2026-05-15" },
    tags: ["Agent", "数据分析", "工具调用", "Coze导入", "Python"],
    content: contentIntelligentAgent,
    currentVersionId: "ver-da-002",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-001",
    updatedBy: "u-002",
    createdAt: "2026-05-15T13:00:00Z",
    updatedAt: "2026-05-27T09:30:00Z",
  },
  // --- 1 Knowledge Pack ---
  {
    id: "ast-knowledge-base",
    workspaceId: "ws-001",
    type: "knowledge_pack",
    name: "企业知识库",
    slug: "enterprise-knowledge-base",
    description:
      "企业内部知识文档集合，包含产品手册、技术文档、FAQ 等 156 篇文档，支持混合检索与重排序。",
    visibility: "private",
    sourceType: "import_file",
    sourceMetadata: {
      importedFrom: "knowledge_export_2026Q1.zip",
      importedAt: "2026-03-01",
      originalSource: "企业文档管理系统",
    },
    tags: ["知识库", "RAG", "检索", "文档", "企业"],
    content: contentKnowledgePack,
    currentVersionId: "ver-kb-002",
    currentVersion: undefined as unknown as Version,
    createdBy: "u-003",
    updatedBy: "u-003",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-05-27T08:00:00Z",
  },
];

// ============================================================
// Versions
// ============================================================

export const mockVersions: Version[] = [
  // 客服自动回复 Prompt (3 versions)
  {
    id: "ver-cs-001",
    assetId: "ast-customer-service",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentCustomerService,
    changeSummary: "初始版本：基础客服回复模板",
    isStable: false,
    createdBy: "u-002",
    createdAt: "2026-04-10T09:00:00Z",
  },
  {
    id: "ver-cs-002",
    assetId: "ast-customer-service",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-cs-001",
    contentJson: {
      ...contentCustomerService,
      modelConfig: { ...gpt4oMini, temperature: 0.5 },
      systemPrompt:
        "你是一个专业的电商客服助手，负责处理用户的售前咨询、订单查询和售后问题。请始终保持礼貌、耐心和专业。对于投诉类问题，优先安抚用户情绪。",
    },
    changeSummary: "降低 temperature 至 0.5，优化投诉场景处理逻辑",
    aiChangeSummary: "调整模型温度参数从 0.7 降至 0.5，使回复更加稳定；在 system prompt 中增加了投诉场景的优先级处理规则",
    isStable: false,
    createdBy: "u-002",
    createdAt: "2026-05-10T14:00:00Z",
  },
  {
    id: "ver-cs-003",
    assetId: "ast-customer-service",
    versionNumber: 3,
    branchName: "main",
    parentVersionId: "ver-cs-002",
    contentJson: {
      ...contentCustomerService,
      modelConfig: { ...gpt4oMini, temperature: 0.3, maxTokens: 4096 },
      systemPrompt:
        "你是一个专业的电商客服助手，负责处理用户的售前咨询、订单查询和售后问题。请始终保持礼貌、耐心和专业。对于投诉类问题，优先安抚用户情绪。支持多轮对话上下文理解。",
      variablesSchema: {
        ...contentCustomerService.variablesSchema!,
        conversation_history: {
          type: "array",
          required: false,
          description: "历史对话记录",
          items: { role: "string", content: "string" },
        },
      },
    },
    changeSummary: "增加 maxTokens，支持多轮对话上下文",
    aiChangeSummary: "将 maxTokens 从 2048 提升至 4096 以支持更长回复；新增 conversation_history 变量，支持传入历史对话实现多轮上下文理解",
    isStable: true,
    createdBy: "u-002",
    createdAt: "2026-05-26T14:30:00Z",
  },
  // 代码审查助手 (2 versions)
  {
    id: "ver-cr-001",
    assetId: "ast-code-review",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentCodeReview,
    changeSummary: "从 Dify 导入初始版本",
    isStable: false,
    createdBy: "u-001",
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "ver-cr-002",
    assetId: "ast-code-review",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-cr-001",
    contentJson: {
      ...contentCodeReview,
      modelConfig: { ...claudeSonnet, temperature: 0.1 },
      systemPrompt:
        "你是一个资深代码审查专家，精通 TypeScript、React、Node.js、Python、Go 等技术栈。请对提供的代码进行全面的审查，重点关注代码质量、安全性、性能、可维护性、最佳实践和测试覆盖。",
    },
    changeSummary: "扩展支持 Python/Go，降低 temperature 提升审查一致性",
    aiChangeSummary: "在 system prompt 中新增 Python 和 Go 语言支持；temperature 从 0.3 降至 0.1 使审查输出更加一致；新增测试覆盖率审查维度",
    isStable: true,
    createdBy: "u-001",
    createdAt: "2026-05-24T09:00:00Z",
  },
  // 多语言翻译 (4 versions)
  {
    id: "ver-tr-001",
    assetId: "ast-translation",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentTranslation,
    changeSummary: "初始版本：支持中英日韩四语种",
    isStable: false,
    createdBy: "u-003",
    createdAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "ver-tr-002",
    assetId: "ast-translation",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-tr-001",
    contentJson: {
      ...contentTranslation,
      modelConfig: qwenTurbo,
    },
    changeSummary: "切换模型到 qwen-turbo，降低推理成本约 60%",
    aiChangeSummary: "模型从 gpt-4o-mini 切换为 qwen-turbo，单次推理成本降低约 60%，翻译质量在通用场景下持平",
    isStable: false,
    createdBy: "u-003",
    createdAt: "2026-04-05T10:00:00Z",
  },
  {
    id: "ver-tr-003",
    assetId: "ast-translation",
    versionNumber: 3,
    branchName: "main",
    parentVersionId: "ver-tr-002",
    contentJson: {
      ...contentTranslation,
      modelConfig: { ...qwenTurbo, temperature: 0.3 },
      variablesSchema: {
        ...contentTranslation.variablesSchema!,
        source_lang: {
          ...contentTranslation.variablesSchema!.source_lang,
          enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
        },
        target_lang: {
          ...contentTranslation.variablesSchema!.target_lang,
          enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
        },
      },
    },
    changeSummary: "新增法语、德语、西语支持，优化翻译稳定性",
    aiChangeSummary: "扩展语言支持到 7 种，将 temperature 从 0.5 调至 0.3 以提升翻译一致性",
    isStable: false,
    createdBy: "u-003",
    createdAt: "2026-05-10T11:00:00Z",
  },
  {
    id: "ver-tr-004",
    assetId: "ast-translation",
    versionNumber: 4,
    branchName: "main",
    parentVersionId: "ver-tr-003",
    contentJson: {
      ...contentTranslation,
      modelConfig: gpt4oMini,
      variablesSchema: {
        ...contentTranslation.variablesSchema!,
        source_lang: {
          ...contentTranslation.variablesSchema!.source_lang,
          enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
        },
        target_lang: {
          ...contentTranslation.variablesSchema!.target_lang,
          enum: ["zh", "en", "ja", "ko", "fr", "de", "es"],
        },
        glossary: {
          type: "object",
          required: false,
          description: "术语表，key 为源语言术语，value 为目标语言翻译",
        },
      },
    },
    changeSummary: "切回 gpt-4o-mini 提升翻译质量，新增术语表功能",
    aiChangeSummary: "质量优先策略：切回 gpt-4o-mini 模型；新增 glossary 变量支持自定义术语表，确保专有名词翻译一致性",
    isStable: true,
    createdBy: "u-003",
    createdAt: "2026-05-25T16:00:00Z",
  },
  // SQL 生成器 (2 versions)
  {
    id: "ver-sql-001",
    assetId: "ast-sqlgen",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentSqlGenerator,
    changeSummary: "从文件导入初始版本，支持 MySQL 和 PostgreSQL",
    isStable: false,
    createdBy: "u-004",
    createdAt: "2026-04-15T11:00:00Z",
  },
  {
    id: "ver-sql-002",
    assetId: "ast-sqlgen",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-sql-001",
    contentJson: {
      ...contentSqlGenerator,
      modelConfig: { ...deepseekV3, temperature: 0.0, maxTokens: 8192 },
      variablesSchema: {
        ...contentSqlGenerator.variablesSchema!,
        db_type: {
          ...contentSqlGenerator.variablesSchema!.db_type,
          enum: ["MySQL", "PostgreSQL", "ClickHouse", "SQLite"],
        },
      },
    },
    changeSummary: "新增 ClickHouse 和 SQLite 支持，temperature 降至 0 确保确定性输出",
    aiChangeSummary: "扩展数据库类型支持至 4 种；temperature 设为 0 确保 SQL 生成的确定性；提升 maxTokens 以支持复杂查询生成",
    isStable: true,
    createdBy: "u-005",
    createdAt: "2026-05-22T10:00:00Z",
  },
  // 订单处理流程 (3 versions)
  {
    id: "ver-ow-001",
    assetId: "ast-order-workflow",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentWorkflowOrder,
    changeSummary: "初始版本：基础订单处理流程",
    isStable: false,
    createdBy: "u-005",
    createdAt: "2026-04-20T14:00:00Z",
  },
  {
    id: "ver-ow-002",
    assetId: "ast-order-workflow",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-ow-001",
    contentJson: {
      ...contentWorkflowOrder,
      nodes: contentWorkflowOrder.nodes!.map((n) =>
        n.id === "node-2"
          ? { ...n, config: { ...n.config, expression: "order.amount > 1000" } }
          : n
      ),
    },
    changeSummary: "大额阈值从 500 调整到 1000 元",
    aiChangeSummary: "将金额判断阈值从 500 元提高至 1000 元，减少不必要的工审核触发",
    isStable: false,
    createdBy: "u-005",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "ver-ow-003",
    assetId: "ast-order-workflow",
    versionNumber: 3,
    branchName: "main",
    parentVersionId: "ver-ow-002",
    contentJson: {
      ...contentWorkflowOrder,
      nodes: [
        ...contentWorkflowOrder.nodes!.map((n) =>
          n.id === "node-2"
            ? { ...n, config: { ...n.config, expression: "order.amount > 1000" } }
            : n
        ),
        {
          id: "node-6",
          type: "action",
          label: "记录日志",
          config: { target: "analytics_db", fields: ["order_id", "amount", "action", "timestamp"] },
          position: { x: 900, y: 60 },
        },
      ],
      edges: [
        ...contentWorkflowOrder.edges!,
        { id: "e-6", source: "node-5", target: "node-6" },
      ],
    },
    changeSummary: "新增分析日志节点，记录处理决策用于数据复盘",
    aiChangeSummary: "在流程末尾新增「记录日志」节点，将所有订单处理决策写入分析数据库，便于后续运营分析和模型优化",
    isStable: true,
    createdBy: "u-005",
    createdAt: "2026-05-27T11:00:00Z",
  },
  // 新闻采集流程 (2 versions)
  {
    id: "ver-cw-001",
    assetId: "ast-crawl-workflow",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentWorkflowCrawl,
    changeSummary: "初始版本：单源新闻采集流程",
    isStable: false,
    createdBy: "u-001",
    createdAt: "2026-05-10T09:00:00Z",
  },
  {
    id: "ver-cw-002",
    assetId: "ast-crawl-workflow",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-cw-001",
    contentJson: {
      ...contentWorkflowCrawl,
      nodes: contentWorkflowCrawl.nodes!.map((n) =>
        n.id === "n-1"
          ? { ...n, config: { ...n.config, cron: "0 */3 * * *", description: "每3小时执行一次（支持多源并发）" } }
          : n.id === "n-2"
            ? {
                ...n,
                config: {
                  ...n.config,
                  urls: ["https://news.source-a.com", "https://news.source-b.com", "https://news.source-c.com"],
                },
              }
            : n
      ),
    },
    changeSummary: "采集频率从 6 小时提升到 3 小时，支持多源并发采集",
    aiChangeSummary: "将定时频率从每 6 小时调整为每 3 小时；HTTP 请求节点从单 URL 扩展为多源数组，实现并发采集三个新闻源",
    isStable: true,
    createdBy: "u-001",
    createdAt: "2026-05-26T16:00:00Z",
  },
  // 数据分析 Agent (2 versions)
  {
    id: "ver-da-001",
    assetId: "ast-data-agent",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentIntelligentAgent,
    changeSummary: "从 Coze 导入初始版本",
    isStable: false,
    createdBy: "u-001",
    createdAt: "2026-05-15T13:00:00Z",
  },
  {
    id: "ver-da-002",
    assetId: "ast-data-agent",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-da-001",
    contentJson: {
      ...contentIntelligentAgent,
      memoryStrategy: "conversation_summary_buffer",
      modelConfig: { ...claudeSonnet, temperature: 0.1, maxTokens: 16384 },
      toolsConfig: {
        tools: [
          ...(contentIntelligentAgent.toolsConfig as { tools: unknown[] }).tools,
          {
            name: "rag_search",
            description: "从知识库中检索相关信息",
            parameters: { query: "string", topK: "number", collection: "string" },
          },
          {
            name: "email_send",
            description: "发送分析报告邮件",
            parameters: { to: "string", subject: "string", body: "string", attachments: "array" },
          },
        ],
      },
      promptRefs: ["ast-sqlgen", "ast-translation", "ast-knowledge-base"],
    },
    changeSummary: "新增 RAG 检索和邮件工具，关联知识库 Prompt，升级记忆策略",
    aiChangeSummary: "工具集从 3 个扩展到 5 个（新增 RAG 检索和邮件发送）；记忆策略从 conversation_buffer_window 升级为 conversation_summary_buffer 以更好地处理长对话；关联企业知识库和 SQL 生成 Prompt 增强分析能力",
    isStable: true,
    createdBy: "u-002",
    createdAt: "2026-05-27T09:30:00Z",
  },
  // 企业知识库 (2 versions)
  {
    id: "ver-kb-001",
    assetId: "ast-knowledge-base",
    versionNumber: 1,
    branchName: "main",
    contentJson: contentKnowledgePack,
    changeSummary: "初始版本：导入企业文档",
    isStable: false,
    createdBy: "u-003",
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "ver-kb-002",
    assetId: "ast-knowledge-base",
    versionNumber: 2,
    branchName: "main",
    parentVersionId: "ver-kb-001",
    contentJson: {
      ...contentKnowledgePack,
      datasourceMeta: {
        ...contentKnowledgePack.datasourceMeta!,
        totalDocuments: 203,
        totalChunks: 6215,
      },
      retrievalConfig: {
        ...contentKnowledgePack.retrievalConfig!,
        topK: 12,
        scoreThreshold: 0.60,
      },
      indexMeta: {
        ...contentKnowledgePack.indexMeta!,
        lastIndexedAt: "2026-05-27T08:00:00Z",
        totalVectorSize: "6215 × 3072",
      },
    },
    changeSummary: "新增 47 份文档，优化检索参数",
    aiChangeSummary: "文档总量从 156 增至 203，chunks 增至 6215；topK 从 8 提升至 12，scoreThreshold 从 0.65 降至 0.60 以召回更多相关结果",
    isStable: true,
    createdBy: "u-003",
    createdAt: "2026-05-27T08:00:00Z",
  },
];

// Cross-link: resolve currentVersion for each asset
for (const asset of mockAssets) {
  const ver = mockVersions.find((v) => v.id === asset.currentVersionId);
  if (ver) {
    asset.currentVersion = ver;
  }
}

// ============================================================
// Merge Requests
// ============================================================

export const mockMergeRequests: MergeRequest[] = [
  {
    id: "mr-001",
    assetId: "ast-translation",
    title: "翻译 Prompt 多语种扩展",
    description:
      "在 v4 分支新增法语、德语、西班牙语支持，并添加自定义术语表功能。当前已完成开发和初步测试，请求合入 main 分支。",
    sourceBranch: "feat/multilang-v4",
    targetBranch: "main",
    sourceVersionId: "ver-tr-004",
    targetVersionId: "ver-tr-003",
    sourceVersion: mockVersions.find((v) => v.id === "ver-tr-004")!,
    targetVersion: mockVersions.find((v) => v.id === "ver-tr-003")!,
    status: "open",
    createdBy: "u-003",
    reviewedBy: "u-001",
    createdAt: "2026-05-25T16:30:00Z",
    updatedAt: "2026-05-28T10:00:00Z",
    costChange: -12.5, // 切回 gpt-4o 比 qwen-turbo 贵，但评测分数提升
    scoreChange: 8.3,
  },
  {
    id: "mr-002",
    assetId: "ast-sqlgen",
    title: "SQL 生成器数据库类型扩展",
    description: "扩展支持 ClickHouse 和 SQLite，temperature 降至 0 确保确定性输出，提升 maxTokens。",
    sourceBranch: "feat/sql-db-types",
    targetBranch: "main",
    sourceVersionId: "ver-sql-002",
    targetVersionId: "ver-sql-001",
    sourceVersion: mockVersions.find((v) => v.id === "ver-sql-002")!,
    targetVersion: mockVersions.find((v) => v.id === "ver-sql-001")!,
    status: "merged",
    createdBy: "u-005",
    reviewedBy: "u-004",
    createdAt: "2026-05-22T10:00:00Z",
    updatedAt: "2026-05-22T14:00:00Z",
    mergedAt: "2026-05-22T14:00:00Z",
    costChange: -3.2,
    scoreChange: 5.1,
  },
];

// ============================================================
// Evaluations
// ============================================================

export const mockEvaluations: Evaluation[] = [
  {
    id: "eval-001",
    workspaceId: "ws-001",
    assetId: "ast-customer-service",
    name: "客服回复质量评测集",
    description: "针对电商客服场景的 50 条真实用户问题，人工标注期望回复，用于评估客服 Prompt 的准确性和用户满意度。",
    caseCount: 50,
    createdBy: "u-002",
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "eval-002",
    workspaceId: "ws-001",
    assetId: "ast-translation",
    name: "多语种翻译质量评测",
    description: "包含 200 条中英日韩法德西多语种翻译测试用例，覆盖通用、技术、营销三个领域，人工标注参考译文。",
    caseCount: 200,
    createdBy: "u-003",
    createdAt: "2026-05-22T09:00:00Z",
  },
];

export const mockEvalRuns: EvaluationRun[] = [
  {
    id: "run-001",
    evaluationId: "eval-001",
    assetVersionId: "ver-cs-003",
    status: "completed",
    avgScore: 87.5,
    avgCost: 0.0023,
    avgLatency: 1240,
    summary: "综合评分 87.5/100。售前咨询场景表现优秀（92分），售后投诉场景有提升空间（81分），建议优化情绪安抚话术。",
    createdBy: "u-002",
    createdAt: "2026-05-26T15:00:00Z",
  },
  {
    id: "run-002",
    evaluationId: "eval-001",
    assetVersionId: "ver-cs-002",
    status: "completed",
    avgScore: 82.1,
    avgCost: 0.0018,
    avgLatency: 980,
    summary: "综合评分 82.1/100。较上一版本下降 5.4 分，主要因为 temperature=0.5 导致回复多样性不足，部分场景回答生硬。",
    createdBy: "u-002",
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "run-003",
    evaluationId: "eval-002",
    assetVersionId: "ver-tr-004",
    status: "completed",
    avgScore: 91.3,
    avgCost: 0.0041,
    avgLatency: 1800,
    summary: "综合评分 91.3/100。7语种翻译均达到商用标准，法语和德语翻译质量突出（95+），术语表功能显著提升专业文档翻译一致性。",
    createdBy: "u-003",
    createdAt: "2026-05-26T09:00:00Z",
  },
  {
    id: "run-004",
    evaluationId: "eval-002",
    assetVersionId: "ver-tr-003",
    status: "completed",
    avgScore: 85.7,
    avgCost: 0.0012,
    avgLatency: 1100,
    summary: "综合评分 85.7/100。qwen-turbo 在通用场景表现不错但技术文档翻译准确率偏低，切回 gpt-4o-mini 后质量提升明显。",
    createdBy: "u-003",
    createdAt: "2026-05-12T14:00:00Z",
  },
];

// ============================================================
// Activities
// ============================================================

export const mockActivities: Activity[] = [
  {
    id: "act-001",
    actorId: "u-002",
    actorName: "李雪",
    entityType: "asset",
    entityId: "ast-customer-service",
    actionType: "version.create",
    actionLabel: "发布了客服自动回复 Prompt v3",
    metadata: { versionNumber: 3, changeSummary: "增加 maxTokens，支持多轮对话上下文" },
    createdAt: "2026-05-28T12:00:00Z",
  },
  {
    id: "act-002",
    actorId: "u-005",
    actorName: "赵刚",
    entityType: "asset",
    entityId: "ast-order-workflow",
    actionType: "version.create",
    actionLabel: "更新了订单处理自动化流程",
    metadata: { versionNumber: 3, changeSummary: "新增分析日志节点" },
    createdAt: "2026-05-28T10:30:00Z",
  },
  {
    id: "act-003",
    actorId: "u-003",
    actorName: "王磊",
    entityType: "merge_request",
    entityId: "mr-001",
    actionType: "mr.create",
    actionLabel: "创建了合并请求：翻译 Prompt 多语种扩展",
    metadata: { mrTitle: "翻译 Prompt 多语种扩展" },
    createdAt: "2026-05-28T09:00:00Z",
  },
  {
    id: "act-004",
    actorId: "u-001",
    actorName: "张明",
    entityType: "evaluation_run",
    entityId: "run-003",
    actionType: "eval.run",
    actionLabel: "完成了多语种翻译质量评测",
    metadata: { avgScore: 91.3, runId: "run-003" },
    createdAt: "2026-05-27T18:00:00Z",
  },
  {
    id: "act-005",
    actorId: "u-002",
    actorName: "李雪",
    entityType: "asset",
    entityId: "ast-data-agent",
    actionType: "version.create",
    actionLabel: "发布了数据分析智能体 v2",
    metadata: { versionNumber: 2, changeSummary: "新增 RAG 检索和邮件工具" },
    createdAt: "2026-05-27T09:30:00Z",
  },
  {
    id: "act-006",
    actorId: "u-003",
    actorName: "王磊",
    entityType: "asset",
    entityId: "ast-knowledge-base",
    actionType: "version.create",
    actionLabel: "更新了企业知识库",
    metadata: { versionNumber: 2, changeSummary: "新增 47 份文档，优化检索参数" },
    createdAt: "2026-05-27T08:00:00Z",
  },
  {
    id: "act-007",
    actorId: "u-002",
    actorName: "李雪",
    entityType: "evaluation_run",
    entityId: "run-001",
    actionType: "eval.run",
    actionLabel: "完成了客服回复质量评测",
    metadata: { avgScore: 87.5, runId: "run-001" },
    createdAt: "2026-05-26T15:00:00Z",
  },
  {
    id: "act-008",
    actorId: "u-001",
    actorName: "张明",
    entityType: "asset",
    entityId: "ast-crawl-workflow",
    actionType: "version.create",
    actionLabel: "更新了智能新闻采集流程",
    metadata: { versionNumber: 2, changeSummary: "采集频率提升到 3 小时，支持多源并发" },
    createdAt: "2026-05-26T16:00:00Z",
  },
  {
    id: "act-009",
    actorId: "u-005",
    actorName: "赵刚",
    entityType: "merge_request",
    entityId: "mr-002",
    actionType: "mr.merge",
    actionLabel: "合并了 SQL 生成器数据库类型扩展",
    metadata: { mrTitle: "SQL 生成器数据库类型扩展", mergedAt: "2026-05-22T14:00:00Z" },
    createdAt: "2026-05-22T14:00:00Z",
  },
  {
    id: "act-010",
    actorId: "u-004",
    actorName: "陈芳",
    entityType: "asset",
    entityId: "ast-sqlgen",
    actionType: "asset.create",
    actionLabel: "从文件导入了 SQL 生成器 Prompt",
    metadata: { sourceType: "import_file", fileName: "sqlgen_prompt_v2.md" },
    createdAt: "2026-05-20T11:00:00Z",
  },
];

// ============================================================
// Dashboard Stats
// ============================================================

export const mockDashboardStats = {
  totalAssets: 24,
  newVersionsThisWeek: 7,
  pendingMRs: 1,
  weeklyCost: 18.72,
};

// ============================================================
// Recent Items
// ============================================================

export const mockRecentItems = {
  recentAssets: mockAssets.slice(0, 4),
  recentEvalRuns: mockEvalRuns.slice(0, 3),
};
