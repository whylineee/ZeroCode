import type { McpServerEntry } from "./agents.js";

export interface McpRegistryEntry {
  slug: string;
  name: string;
  description: string;
  npmPackage: string;
  entry: McpServerEntry;
  envVars?: string[];
}

export interface SkillRegistryEntry {
  slug: string;
  name: string;
  description: string;
  installCommand: string;
  skillMd: string;
}

// ── MCP Server Registry ──────────────────────────────────────────

export const mcpRegistry: McpRegistryEntry[] = [
  {
    slug: "filesystem-mcp",
    name: "Filesystem",
    description: "Read, write, and inspect project files safely.",
    npmPackage: "@modelcontextprotocol/server-filesystem",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "{PROJECT_DIR}"],
    },
  },
  {
    slug: "git-mcp",
    name: "Git",
    description: "Inspect history, diffs, and safe commit workflows.",
    npmPackage: "mcp-server-git (uvx)",
    entry: {
      command: "uvx",
      args: ["mcp-server-git", "--repository", "{PROJECT_DIR}"],
    },
  },
  {
    slug: "fetch-mcp",
    name: "Fetch",
    description: "Pull web content into cleaner text for agent use.",
    npmPackage: "mcp-server-fetch (uvx)",
    entry: {
      command: "uvx",
      args: ["mcp-server-fetch"],
    },
  },
  {
    slug: "memory-mcp",
    name: "Memory",
    description: "Persist useful facts across sessions.",
    npmPackage: "@modelcontextprotocol/server-memory",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
    },
  },
  {
    slug: "sequential-thinking-mcp",
    name: "Sequential Thinking",
    description: "Dynamic multi-step problem-solving through thought sequences.",
    npmPackage: "@modelcontextprotocol/server-sequential-thinking",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
  {
    slug: "brave-search-mcp",
    name: "Brave Search",
    description: "Web and local search via Brave Search API.",
    npmPackage: "@modelcontextprotocol/server-brave-search",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-brave-search"],
      env: { BRAVE_API_KEY: "{BRAVE_API_KEY}" },
    },
    envVars: ["BRAVE_API_KEY"],
  },
  {
    slug: "puppeteer-mcp",
    name: "Puppeteer",
    description: "Headless browser automation and screenshot capture.",
    npmPackage: "@modelcontextprotocol/server-puppeteer",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-puppeteer"],
    },
  },
  {
    slug: "playwright-mcp",
    name: "Playwright",
    description: "Cross-browser automation with Chromium, Firefox, WebKit.",
    npmPackage: "@playwright/mcp",
    entry: {
      command: "npx",
      args: ["-y", "@playwright/mcp"],
    },
  },
  {
    slug: "github-mcp",
    name: "GitHub",
    description: "Manage repos, issues, PRs via GitHub API.",
    npmPackage: "@modelcontextprotocol/server-github",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: { GITHUB_PERSONAL_ACCESS_TOKEN: "{GITHUB_TOKEN}" },
    },
    envVars: ["GITHUB_PERSONAL_ACCESS_TOKEN"],
  },
  {
    slug: "postgres-mcp",
    name: "PostgreSQL",
    description: "Read-only querying of PostgreSQL databases.",
    npmPackage: "@modelcontextprotocol/server-postgres",
    entry: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-postgres", "{DATABASE_URL}"],
    },
    envVars: ["DATABASE_URL"],
  },
  {
    slug: "sqlite-mcp",
    name: "SQLite",
    description: "Query and analyze local SQLite databases.",
    npmPackage: "mcp-server-sqlite (uvx)",
    entry: {
      command: "uvx",
      args: ["mcp-server-sqlite", "--db-path", "{DB_PATH}"],
    },
    envVars: ["DB_PATH"],
  },
  {
    slug: "slack-mcp",
    name: "Slack",
    description: "Read channels, search messages, post to Slack.",
    npmPackage: "slack-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "slack-mcp-server"],
      env: { SLACK_BOT_TOKEN: "{SLACK_BOT_TOKEN}" },
    },
    envVars: ["SLACK_BOT_TOKEN"],
  },
  {
    slug: "notion-mcp",
    name: "Notion",
    description: "Search, read, and update Notion pages and databases.",
    npmPackage: "notion-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "notion-mcp-server"],
      env: { NOTION_API_KEY: "{NOTION_API_KEY}" },
    },
    envVars: ["NOTION_API_KEY"],
  },
  {
    slug: "linear-mcp",
    name: "Linear",
    description: "Create, search, and manage Linear issues.",
    npmPackage: "linear-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "linear-mcp-server"],
      env: { LINEAR_API_KEY: "{LINEAR_API_KEY}" },
    },
    envVars: ["LINEAR_API_KEY"],
  },
  {
    slug: "sentry-mcp",
    name: "Sentry",
    description: "Query error reports and stack traces from Sentry.",
    npmPackage: "@sentry/mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "@sentry/mcp-server"],
      env: { SENTRY_AUTH_TOKEN: "{SENTRY_AUTH_TOKEN}" },
    },
    envVars: ["SENTRY_AUTH_TOKEN"],
  },
  {
    slug: "docker-mcp",
    name: "Docker",
    description: "Manage containers, images, and compose stacks.",
    npmPackage: "docker-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "docker-mcp-server"],
    },
  },
  {
    slug: "stripe-mcp",
    name: "Stripe",
    description: "Query payments, customers, and subscriptions.",
    npmPackage: "@stripe/agent-toolkit",
    entry: {
      command: "npx",
      args: ["-y", "@stripe/agent-toolkit", "mcp"],
      env: { STRIPE_SECRET_KEY: "{STRIPE_SECRET_KEY}" },
    },
    envVars: ["STRIPE_SECRET_KEY"],
  },
  {
    slug: "cloudflare-mcp",
    name: "Cloudflare",
    description: "Manage Workers, KV, R2, and DNS.",
    npmPackage: "@cloudflare/mcp-server-cloudflare",
    entry: {
      command: "npx",
      args: ["-y", "@cloudflare/mcp-server-cloudflare"],
      env: { CLOUDFLARE_API_TOKEN: "{CLOUDFLARE_API_TOKEN}", CLOUDFLARE_ACCOUNT_ID: "{CLOUDFLARE_ACCOUNT_ID}" },
    },
    envVars: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
  },
  {
    slug: "redis-mcp",
    name: "Redis",
    description: "Inspect and query Redis instances.",
    npmPackage: "redis-mcp",
    entry: {
      command: "npx",
      args: ["-y", "redis-mcp"],
      env: { REDIS_URL: "{REDIS_URL}" },
    },
    envVars: ["REDIS_URL"],
  },
  {
    slug: "firecrawl-mcp",
    name: "Firecrawl",
    description: "Crawl web pages and convert to clean markdown.",
    npmPackage: "firecrawl-mcp",
    entry: {
      command: "npx",
      args: ["-y", "firecrawl-mcp"],
      env: { FIRECRAWL_API_KEY: "{FIRECRAWL_API_KEY}" },
    },
    envVars: ["FIRECRAWL_API_KEY"],
  },
  {
    slug: "mongodb-mcp",
    name: "MongoDB",
    description: "Query and inspect MongoDB collections.",
    npmPackage: "mongodb-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "mongodb-mcp-server"],
      env: { MONGODB_URI: "{MONGODB_URI}" },
    },
    envVars: ["MONGODB_URI"],
  },
  {
    slug: "jira-mcp",
    name: "Jira",
    description: "Search, create, and update Jira issues.",
    npmPackage: "jira-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "jira-mcp-server"],
      env: { JIRA_URL: "{JIRA_URL}", JIRA_EMAIL: "{JIRA_EMAIL}", JIRA_API_TOKEN: "{JIRA_API_TOKEN}" },
    },
    envVars: ["JIRA_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"],
  },
  {
    slug: "google-drive-mcp",
    name: "Google Drive",
    description: "Search, read, and organize Google Drive files.",
    npmPackage: "google-drive-mcp",
    entry: {
      command: "npx",
      args: ["-y", "google-drive-mcp"],
      env: { GOOGLE_APPLICATION_CREDENTIALS: "{CREDENTIALS_PATH}" },
    },
    envVars: ["GOOGLE_APPLICATION_CREDENTIALS"],
  },
  {
    slug: "supabase-mcp",
    name: "Supabase",
    description: "Query Supabase databases, storage, and auth.",
    npmPackage: "supabase-mcp",
    entry: {
      command: "npx",
      args: ["-y", "supabase-mcp"],
      env: { SUPABASE_URL: "{SUPABASE_URL}", SUPABASE_ANON_KEY: "{SUPABASE_ANON_KEY}" },
    },
    envVars: ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
  },
  {
    slug: "vercel-mcp",
    name: "Vercel",
    description: "Manage deployments and project settings.",
    npmPackage: "vercel-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "vercel-mcp-server"],
      env: { VERCEL_TOKEN: "{VERCEL_TOKEN}" },
    },
    envVars: ["VERCEL_TOKEN"],
  },
  {
    slug: "youtube-mcp",
    name: "YouTube",
    description: "Search videos and retrieve transcripts.",
    npmPackage: "youtube-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "youtube-mcp-server"],
      env: { YOUTUBE_API_KEY: "{YOUTUBE_API_KEY}" },
    },
    envVars: ["YOUTUBE_API_KEY"],
  },
  {
    slug: "todoist-mcp",
    name: "Todoist",
    description: "Create and manage tasks in Todoist.",
    npmPackage: "todoist-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "todoist-mcp-server"],
      env: { TODOIST_API_TOKEN: "{TODOIST_API_TOKEN}" },
    },
    envVars: ["TODOIST_API_TOKEN"],
  },
  {
    slug: "twilio-mcp",
    name: "Twilio",
    description: "Send SMS and manage messaging workflows.",
    npmPackage: "twilio-mcp",
    entry: {
      command: "npx",
      args: ["-y", "twilio-mcp"],
      env: { TWILIO_ACCOUNT_SID: "{TWILIO_ACCOUNT_SID}", TWILIO_AUTH_TOKEN: "{TWILIO_AUTH_TOKEN}" },
    },
    envVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
  },
  {
    slug: "elasticsearch-mcp",
    name: "Elasticsearch",
    description: "Search and analyze data in Elasticsearch.",
    npmPackage: "elasticsearch-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "elasticsearch-mcp-server"],
      env: { ELASTICSEARCH_URL: "{ELASTICSEARCH_URL}" },
    },
    envVars: ["ELASTICSEARCH_URL"],
  },
  {
    slug: "aws-s3-mcp",
    name: "AWS S3",
    description: "List, read, and manage S3 bucket objects.",
    npmPackage: "aws-s3-mcp-server",
    entry: {
      command: "npx",
      args: ["-y", "aws-s3-mcp-server"],
      env: { AWS_ACCESS_KEY_ID: "{AWS_ACCESS_KEY_ID}", AWS_SECRET_ACCESS_KEY: "{AWS_SECRET_ACCESS_KEY}", AWS_REGION: "{AWS_REGION}" },
    },
    envVars: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"],
  },
];

// ── Skills Registry ──────────────────────────────────────────────

export const skillRegistry: SkillRegistryEntry[] = [
  {
    slug: "pr-reviewer",
    name: "PR Reviewer",
    description: "Scan diffs for regressions, missing tests, and unclear logic.",
    installCommand: "npx skills add zerocode/skills@pr-reviewer",
    skillMd: `# Skill: PR Reviewer

## Trigger
Run when reviewing a pull request or code diff.

## Workflow
1. Read the full diff.
2. Identify regressions, edge cases, and missing tests.
3. Check for unclear logic or naming.
4. Produce findings ordered by severity.

## Output
- Findings ordered by severity
- Open questions
- Residual risk assessment`,
  },
  {
    slug: "research-condenser",
    name: "Research Condenser",
    description: "Turn multi-source research into structured comparisons.",
    installCommand: "npx skills add zerocode/skills@research-condenser",
    skillMd: `# Skill: Research Condenser

## Trigger
Run when synthesizing research from multiple sources.

## Workflow
1. Gather all source materials.
2. Extract key claims and evidence.
3. Identify consensus, disagreement, and gaps.
4. Produce a structured comparison.

## Output
- Key findings with source attribution
- Areas of consensus and disagreement
- Open questions and research gaps`,
  },
  {
    slug: "docker-best-practices",
    name: "Docker Best Practices",
    description: "Efficient Dockerfiles, multi-stage builds, and security.",
    installCommand: "npx skills add docker/labs@docker-best-practices",
    skillMd: `# Skill: Docker Best Practices

## Trigger
Run when writing or reviewing Dockerfiles and container configs.

## Workflow
1. Check for multi-stage build patterns.
2. Verify layer caching optimization.
3. Enforce non-root user and minimal base image.
4. Review .dockerignore completeness.

## Output
- Optimized Dockerfile
- Security findings
- Image size reduction suggestions`,
  },
  {
    slug: "api-design-guidelines",
    name: "API Design Guidelines",
    description: "RESTful conventions, versioning, and error handling.",
    installCommand: "npx skills add zerocode/skills@api-design-guidelines",
    skillMd: `# Skill: API Design Guidelines

## Trigger
Run when designing or reviewing REST API endpoints.

## Workflow
1. Review endpoint naming and HTTP method usage.
2. Check error response format consistency.
3. Verify versioning strategy.
4. Validate request/response schemas.

## Output
- API design review
- Suggested improvements
- Schema validation results`,
  },
  {
    slug: "typescript-best-practices",
    name: "TypeScript Best Practices",
    description: "Strict types, utility types, and common patterns.",
    installCommand: "npx skills add zerocode/skills@typescript-best-practices",
    skillMd: `# Skill: TypeScript Best Practices

## Trigger
Run when writing or reviewing TypeScript code.

## Workflow
1. Check for proper use of strict mode features.
2. Review type definitions for completeness.
3. Identify any usage patterns.
4. Suggest utility types where appropriate.

## Output
- Type safety assessment
- Improvement suggestions
- Pattern recommendations`,
  },
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    description: "Write clear, structured prompts with constraints and examples.",
    installCommand: "npx skills add zerocode/skills@prompt-engineering",
    skillMd: `# Skill: Prompt Engineering

## Trigger
Run when creating or improving prompts for AI agents.

## Workflow
1. Define the task clearly with constraints.
2. Add positive and negative examples.
3. Specify output format and evaluation criteria.
4. Test with edge cases.

## Output
- Refined prompt with clear structure
- Example inputs and expected outputs
- Evaluation criteria`,
  },
  {
    slug: "git-workflow",
    name: "Git Workflow",
    description: "Branch strategy, commit messages, and merge hygiene.",
    installCommand: "npx skills add zerocode/skills@git-workflow",
    skillMd: `# Skill: Git Workflow

## Trigger
Run when setting up or reviewing git workflows.

## Workflow
1. Define branch naming convention.
2. Set commit message format.
3. Establish merge/rebase strategy.
4. Configure branch protection rules.

## Output
- Branch strategy document
- Commit convention guide
- PR template`,
  },
  {
    slug: "ci-cd-pipeline",
    name: "CI/CD Pipeline",
    description: "Build, test, and deploy automation patterns.",
    installCommand: "npx skills add zerocode/skills@ci-cd-pipeline",
    skillMd: `# Skill: CI/CD Pipeline

## Trigger
Run when setting up or reviewing CI/CD pipelines.

## Workflow
1. Define build stages and dependencies.
2. Configure test automation.
3. Set up deployment stages with approvals.
4. Add monitoring and rollback steps.

## Output
- Pipeline configuration file
- Stage definitions
- Deployment checklist`,
  },
  {
    slug: "database-migration",
    name: "Database Migration",
    description: "Safe schema changes, rollback plans, and data migration.",
    installCommand: "npx skills add zerocode/skills@database-migration",
    skillMd: `# Skill: Database Migration

## Trigger
Run when planning or reviewing database schema changes.

## Workflow
1. Review the migration for data safety.
2. Check for rollback capability.
3. Verify index and constraint changes.
4. Test on a copy before production.

## Output
- Migration review
- Rollback plan
- Performance impact assessment`,
  },
  {
    slug: "tailwind-css",
    name: "Tailwind CSS",
    description: "Utility-first patterns, responsive design, and custom themes.",
    installCommand: "npx skills add zerocode/skills@tailwind-css",
    skillMd: `# Skill: Tailwind CSS

## Trigger
Run when writing or reviewing Tailwind CSS code.

## Workflow
1. Check for proper utility class usage.
2. Review responsive breakpoint patterns.
3. Verify custom theme token consistency.
4. Identify redundant or conflicting classes.

## Output
- Style review
- Responsive design assessment
- Theme consistency check`,
  },
  {
    slug: "openai-frontend-skill",
    name: "OpenAI Frontend Skill",
    description: "Restrained composition, image-led hierarchy, tasteful motion for production-ready frontends.",
    installCommand: "$skill-installer frontend-skill",
    skillMd: `# Skill: OpenAI Frontend Skill

## Trigger
Use when the task asks for a visually strong landing page, website, app, prototype, demo, or game UI.

## Working Model
Before building, write three things:
- visual thesis: one sentence describing mood, material, and energy
- content plan: hero, support, detail, final CTA
- interaction thesis: 2-3 motion ideas that change the feel of the page

## Beautiful Defaults
- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy short enough to scan in seconds.
- Default to cardless layouts. Use sections, columns, dividers, lists, and media blocks instead.
- Treat the first viewport as a poster, not a document.
- Limit the system: two typefaces max, one accent color by default.

## Landing Pages
1. Hero: brand or product, promise, CTA, and one dominant visual
2. Support: one concrete feature, offer, or proof point
3. Detail: atmosphere, workflow, product depth, or story
4. Final CTA: convert, start, visit, or contact

## Motion
Ship at least 2-3 intentional motions:
- one entrance sequence in the hero
- one scroll-linked, sticky, or depth effect
- one hover, reveal, or layout transition that sharpens affordance

## Hard Rules
- No cards by default.
- No more than one dominant idea per section.
- No headline should overpower the brand on branded pages.
- No filler copy.
- No more than two typefaces without a clear reason.
- No more than one accent color unless the product already has a strong system.

## Litmus Checks
- Is the brand or product unmistakable in the first screen?
- Is there one strong visual anchor?
- Can the page be understood by scanning headlines only?
- Does each section have one job?
- Are cards actually necessary?
- Does motion improve hierarchy or atmosphere?`,
  },
  {
    slug: "remotion-best-practices",
    name: "Remotion Best Practices",
    description: "Programmatic video with React — composition, timing, rendering, deployment.",
    installCommand: "npx skills add remotion-dev/skills@remotion-best-practices",
    skillMd: `# Skill: Remotion Best Practices

## Trigger
Use when creating or reviewing Remotion video compositions.

## Workflow
1. Structure compositions with proper sequence and timing.
2. Use input props for dynamic content.
3. Configure the rendering pipeline for consistent output.
4. Test frame-accurate transitions before deploying.

## Output
- Composition review
- Timing and transition assessment
- Rendering pipeline validation`,
  },
  {
    slug: "vercel-composition-patterns",
    name: "Vercel Composition Patterns",
    description: "Advanced React composition — compound components, render props, context modules.",
    installCommand: "npx skills add vercel-labs/agent-skills@vercel-composition-patterns",
    skillMd: `# Skill: Vercel Composition Patterns

## Trigger
Use when building reusable component systems or reviewing React architecture.

## Workflow
1. Identify components that should be compound instead of monolithic.
2. Apply render prop and context module patterns.
3. Eliminate prop drilling with scoped context.
4. Validate reusability across different layouts.

## Output
- Component architecture review
- Composition pattern recommendations
- Prop drilling elimination plan`,
  },
  {
    slug: "vercel-react-native-skills",
    name: "React Native Skills",
    description: "React Native patterns — navigation, native modules, performance, Expo workflows.",
    installCommand: "npx skills add vercel-labs/agent-skills@vercel-react-native-skills",
    skillMd: `# Skill: React Native Skills

## Trigger
Use when building or reviewing React Native applications.

## Workflow
1. Structure navigation with typed routes.
2. Integrate native modules correctly per platform.
3. Optimize performance for both iOS and Android.
4. Follow Expo workflow best practices.

## Output
- Navigation structure review
- Platform-specific component assessment
- Performance optimization plan`,
  },
  {
    slug: "brainstorming",
    name: "Brainstorming",
    description: "Structured brainstorming — diverge, cluster, evaluate, converge.",
    installCommand: "npx skills add obra/superpowers@brainstorming",
    skillMd: `# Skill: Brainstorming

## Trigger
Use when the agent needs to generate and evaluate ideas systematically.

## Workflow
1. Diverge: generate 10+ ideas without filtering.
2. Cluster: group related ideas into themes.
3. Evaluate: score clusters on impact and feasibility.
4. Converge: pick top 2-3 and define next actions.

## Output
- Idea clusters with themes
- Impact/feasibility scores
- Ranked next steps`,
  },
  {
    slug: "seo-audit",
    name: "SEO Audit",
    description: "Structured SEO audits — technical SEO, content, meta tags, performance.",
    installCommand: "npx skills add coreyhaines31/marketingskills@seo-audit",
    skillMd: `# Skill: SEO Audit

## Trigger
Use when auditing or optimizing a website for search engines.

## Workflow
1. Check technical SEO: crawlability, indexing, sitemaps.
2. Review meta tags: title, description, OG, structured data.
3. Assess content quality: headings, keywords, readability.
4. Measure performance: Core Web Vitals, page speed.

## Output
- Technical SEO findings
- Content quality assessment
- Prioritized fix list`,
  },
  {
    slug: "pdf-skill",
    name: "PDF",
    description: "Read, extract, and generate PDF documents with proper structure.",
    installCommand: "npx skills add anthropics/skills@pdf",
    skillMd: `# Skill: PDF

## Trigger
Use when the workflow involves reading or creating PDF files.

## Workflow
1. Extract text with structure preserved.
2. Handle tables and lists correctly.
3. Maintain heading hierarchy.
4. Output clean markdown or structured data.

## Output
- Structured text extraction
- Table and list parsing
- Formatted PDF generation`,
  },
  {
    slug: "copywriting-skill",
    name: "Copywriting",
    description: "Persuasive copy — headlines, CTAs, product descriptions, brand voice.",
    installCommand: "npx skills add coreyhaines31/marketingskills@copywriting",
    skillMd: `# Skill: Copywriting

## Trigger
Use when writing marketing copy, product pages, or ad text.

## Workflow
1. Define brand voice and target audience.
2. Lead with benefits, not features.
3. Keep headlines to one clear idea.
4. End every section with a reason to act.

## Output
- Brand-consistent headlines
- Benefits-focused body copy
- Clear calls to action`,
  },
  {
    slug: "audit-website",
    name: "Audit Website",
    description: "Website audits — security headers, performance, accessibility, SEO.",
    installCommand: "npx skills add squirrelscan/skills@audit-website",
    skillMd: `# Skill: Audit Website

## Trigger
Use before launching or auditing a production website.

## Workflow
1. Check security headers: CSP, HSTS, X-Frame-Options.
2. Review SSL/TLS configuration.
3. Measure performance: load time, asset optimization.
4. Verify accessibility and SEO basics.

## Output
- Security header report
- Performance bottleneck list
- Accessibility and SEO findings`,
  },
  {
    slug: "writing-plans",
    name: "Writing Plans",
    description: "Implementation plans — scope, task breakdown, dependencies, milestones.",
    installCommand: "npx skills add obra/superpowers@writing-plans",
    skillMd: `# Skill: Writing Plans

## Trigger
Use when the agent needs to break down complex work into an actionable plan.

## Workflow
1. Define scope and constraints.
2. Break into concrete tasks (max 2h each).
3. Map dependencies between tasks.
4. Sequence milestones and identify risks.

## Output
- Scoped task breakdown
- Dependency map
- Milestone sequence with risks`,
  },
  {
    slug: "better-auth-best-practices",
    name: "Better Auth Best Practices",
    description: "Auth with Better Auth — sessions, OAuth, MFA, security hardening.",
    installCommand: "npx skills add better-auth/skills@better-auth-best-practices",
    skillMd: `# Skill: Better Auth Best Practices

## Trigger
Use when building or reviewing authentication with Better Auth.

## Workflow
1. Implement session management: creation, refresh, revocation.
2. Configure OAuth provider integration.
3. Set up MFA for sensitive operations.
4. Apply CSRF and rate limiting protections.

## Output
- Session management review
- OAuth configuration assessment
- Security hardening checklist`,
  },
  {
    slug: "subagent-driven-development",
    name: "Subagent-Driven Development",
    description: "Multi-agent orchestration — task decomposition, parallel dispatch, error recovery.",
    installCommand: "npx skills add obra/superpowers@subagent-driven-development",
    skillMd: `# Skill: Subagent-Driven Development

## Trigger
Use when the workflow benefits from splitting work across multiple agent instances.

## Workflow
1. Decompose the task into independent units.
2. Define input/output contracts for each sub-agent.
3. Dispatch sub-agents in parallel where possible.
4. Aggregate results with conflict resolution.
5. Handle partial failures gracefully.

## Output
- Task decomposition plan
- Sub-agent contracts
- Aggregation and error recovery strategy`,
  },
  {
    slug: "web-accessibility",
    name: "Web Accessibility",
    description: "WCAG-aligned a11y — semantic HTML, ARIA, keyboard nav, contrast.",
    installCommand: "npx skills add supercent-io/skills-template@web-accessibility",
    skillMd: `# Skill: Web Accessibility

## Trigger
Use before building or reviewing UI for accessibility compliance.

## Workflow
1. Use semantic HTML elements (nav, main, article, section).
2. Add ARIA roles and labels where needed.
3. Ensure keyboard navigation and focus management.
4. Check color contrast (minimum 4.5:1 for text).

## Output
- Semantic HTML review
- Keyboard navigation assessment
- Color contrast report`,
  },
];

export function findMcp(slug: string): McpRegistryEntry | undefined {
  return mcpRegistry.find((m) => m.slug === slug || m.name.toLowerCase() === slug.toLowerCase());
}

export function findSkill(slug: string): SkillRegistryEntry | undefined {
  return skillRegistry.find((s) => s.slug === slug || s.name.toLowerCase() === slug.toLowerCase());
}
