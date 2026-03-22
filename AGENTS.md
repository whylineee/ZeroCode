# AGENTS.md

## Project Identity

ZeroCode CLI is a local installer for MCP servers and reusable skills for AI agents.

- **Package**: `@whylineee/zerocode`
- **Version**: 0.1.3
- **License**: MIT
- **Node**: >= 18
- **Dependencies**: zero runtime dependencies (only Node.js builtins)

This repository is CLI-only.
Do not reintroduce the public landing site, Next.js app, or docs-first frontend here.

## What It Does

ZeroCode detects AI agents installed on the user's machine, installs MCP servers from a built-in registry, collects API keys interactively, writes valid JSON config to each agent, and manages reusable skill files. The goal is to eliminate hand-editing agent config JSON.

Key capabilities:

- Auto-detect 7 AI agents and their config paths
- Install from a registry of 30+ MCP servers with one command
- Install reusable SKILL.md files into the project
- Sync MCP configs between agents (e.g. Cursor → Claude Desktop)
- Export/import full setup as portable `.zerocode.json` manifests
- Backup/restore all agent configs before experimenting
- Diagnose runtimes, configs, and unresolved env vars

## Architecture

### File Structure

```
src/
├── index.ts       CLI entry point, arg parsing, all command implementations
├── agents.ts      Agent detection, config read/write, MCP add/remove
├── registry.ts    Built-in registry of 30+ MCP servers and 10 skills
├── prompt.ts      Interactive prompts (choose, confirm, ask) — zero deps
└── ui.ts          Terminal colors, banners, formatting helpers
```

### Build

- TypeScript compiled with `tsc` to `dist/`
- Target: ES2022, Module: Node16
- Entry point: `dist/index.js` (bin: `zerocode`)
- No bundler — plain tsc output

### Design Principles

- Zero runtime dependencies — only `node:fs`, `node:os`, `node:path`, `node:readline`, `node:child_process`, `node:https`
- Single binary via `npx` — no install required
- All registry data is bundled in `registry.ts`, no network calls for install flows
- Update check is cached (24h) and fails silently if offline
- Non-JSON agents (Codex CLI) are safely guarded from config writes

## Supported Agents

| Agent | ID | Scope | Config Path | Format |
|---|---|---|---|---|
| Claude Desktop | `claude-desktop` | global | `~/Library/Application Support/Claude/claude_desktop_config.json` | JSON |
| Claude Code | `claude-code` | project | `.mcp.json` | JSON |
| Cursor (project) | `cursor` | project | `.cursor/mcp.json` | JSON |
| Cursor (global) | `cursor-global` | global | `~/.cursor/mcp.json` | JSON |
| Windsurf (project) | `windsurf` | project | `.windsurf/mcp.json` | JSON |
| Windsurf (global) | `windsurf-global` | global | `~/.codeium/windsurf/mcp_config.json` | JSON |
| Cline (VS Code) | `cline` | project | `.vscode/mcp.json` | JSON |
| Continue.dev | `continue` | global | `~/.continue/config.json` | JSON |
| Codex CLI | `codex` | project | `AGENTS.md` | non-JSON (read-only) |

Detection logic: checks for app bundles in `/Applications`, dotfiles in `$HOME`, VS Code extensions, and CLI binaries via `which`.

## Commands

### `zerocode init`

Interactive setup wizard. Detects agents → lets user pick which to configure → offers starter packs (Essential, Web, DevOps, Custom) → collects env vars → installs MCP servers to all selected agents → optionally installs skills.

### `zerocode detect`

Scans the machine for installed AI agents and prints their names, scope, and config paths.

### `zerocode configure`

Interactive agent configurator. Pick an agent, then enter a menu loop: add MCP server, add skill, view installed servers, remove server, or exit.

### `zerocode list mcp`

Prints all 30+ MCP servers available in the built-in registry with slug and description.

### `zerocode list skills`

Prints all available skills with slug and description.

### `zerocode add mcp <name>`

Install an MCP server to a specific agent. Supports `--agent <id>` flag for non-interactive use. Flow: resolve from registry → select agent (interactive or via flag) → collect env vars if needed → confirm → write config JSON → remind to restart agent.

### `zerocode add skill <name>`

Install a reusable SKILL.md file into `.zerocode/skills/<slug>/SKILL.md` in the current project directory. Prompts before overwriting existing skills.

### `zerocode remove mcp <name>`

Remove an MCP server from an agent's config. Supports `--agent <id>` flag.

### `zerocode status`

Show all detected agents and what MCP servers are currently configured on each one.

### `zerocode doctor`

Diagnostic command. Checks:

- Runtimes: `node`, `npx`, `uvx`, `python3` — prints versions
- Agent configs: validates JSON, counts installed servers
- Env vars: flags unresolved `{PLACEHOLDER}` values in configs
- Summary: total issues found

### `zerocode sync`

Copy MCP servers from one agent to another. Flow: pick source agent → show installed servers → pick which to copy (all or selective) → pick target agents → confirm → write configs.

Requires at least 2 detected agents with JSON config support.

### `zerocode export`

Export current setup to a portable `.zerocode.json` manifest. Collects all unique MCP servers across agents and installed skills, then writes a versioned manifest file.

### `zerocode import [path]`

Import a `.zerocode.json` manifest. Reads the manifest → shows what will be installed → pick target agents → collect env vars → install MCP servers and skills.

### `zerocode backup`

Snapshot all agent configs to `.zerocode/backup.json`. Reads raw file content from each detected agent's config path and stores it.

### `zerocode restore`

Restore agent configs from a previous backup. Shows what's in the backup, confirms, then overwrites current configs.

### `zerocode create`

Interactive config builder. Pick MCP servers from the registry → optionally pick skills → saves a `.zerocode.json` file. Does not install anything — just builds the config. Aliases: `new`.

### `zerocode apply [path]`

Reads a `.zerocode.json` file → shows contents → detects agents on the machine with current MCP count → user picks target agents → collects env vars → confirms → installs MCP servers and skills. Aliases: `push`.

Typical workflow:

```
zerocode create        # build your config
zerocode apply         # push it to detected agents
```

### `zerocode remember [text]`

Save a cross-agent note. Creates a SKILL.md in `.zerocode/skills/note-<slug>/` so all AI agents in the project can read it. If text is provided inline, uses it directly; otherwise prompts interactively. Asks for a short title (or auto-generates one).

Use case: you work with multiple agents (Claude Code, Codex, Cursor, etc.) and want to store a note that all of them can see without patching AGENTS.md or CLAUDE.md manually.

### `zerocode notes`

List all saved cross-agent notes with title, preview, and creation date.

### `zerocode forget`

Delete a saved note. Shows a numbered list of existing notes, lets you pick one, confirms before deleting.

### `zerocode version` / `--version` / `-v`

Print current version.

### `zerocode help` / `--help` / `-h`

Print usage with all commands and examples.

## MCP Server Registry (30+)

| Slug | Name | Env Vars Required |
|---|---|---|
| `filesystem-mcp` | Filesystem | — |
| `git-mcp` | Git | — |
| `fetch-mcp` | Fetch | — |
| `memory-mcp` | Memory | — |
| `sequential-thinking-mcp` | Sequential Thinking | — |
| `brave-search-mcp` | Brave Search | `BRAVE_API_KEY` |
| `puppeteer-mcp` | Puppeteer | — |
| `playwright-mcp` | Playwright | — |
| `github-mcp` | GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| `postgres-mcp` | PostgreSQL | `DATABASE_URL` |
| `sqlite-mcp` | SQLite | `DB_PATH` |
| `slack-mcp` | Slack | `SLACK_BOT_TOKEN` |
| `notion-mcp` | Notion | `NOTION_API_KEY` |
| `linear-mcp` | Linear | `LINEAR_API_KEY` |
| `sentry-mcp` | Sentry | `SENTRY_AUTH_TOKEN` |
| `docker-mcp` | Docker | — |
| `stripe-mcp` | Stripe | `STRIPE_SECRET_KEY` |
| `cloudflare-mcp` | Cloudflare | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| `redis-mcp` | Redis | `REDIS_URL` |
| `firecrawl-mcp` | Firecrawl | `FIRECRAWL_API_KEY` |
| `mongodb-mcp` | MongoDB | `MONGODB_URI` |
| `jira-mcp` | Jira | `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |
| `elasticsearch-mcp` | Elasticsearch | `ELASTICSEARCH_URL` |
| `aws-s3-mcp` | AWS S3 | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| `twilio-mcp` | Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` |

Starter packs for `init`:

- **Essential**: filesystem, git, memory
- **Web**: fetch, brave-search, firecrawl
- **DevOps**: github, docker, sentry
- **Custom**: pick your own

## Skills Registry (10)

| Slug | Name |
|---|---|
| `pr-reviewer` | PR Reviewer |
| `research-condenser` | Research Condenser |
| `docker-best-practices` | Docker Best Practices |
| `api-design-guidelines` | API Design Guidelines |
| `typescript-best-practices` | TypeScript Best Practices |
| `prompt-engineering` | Prompt Engineering |
| `git-workflow` | Git Workflow |
| `ci-cd-pipeline` | CI/CD Pipeline |
| `database-migration` | Database Migration |
| `tailwind-css` | Tailwind CSS |
| `openai-frontend-skill` | OpenAI Frontend Skill |
| `remotion-best-practices` | Remotion Best Practices |
| `vercel-composition-patterns` | Vercel Composition Patterns |
| `vercel-react-native-skills` | React Native Skills |
| `brainstorming` | Brainstorming |
| `seo-audit` | SEO Audit |
| `pdf-skill` | PDF |
| `copywriting-skill` | Copywriting |
| `audit-website` | Audit Website |
| `writing-plans` | Writing Plans |
| `better-auth-best-practices` | Better Auth Best Practices |
| `subagent-driven-development` | Subagent-Driven Development |
| `web-accessibility` | Web Accessibility |

Skills are installed as `SKILL.md` files in `.zerocode/skills/<slug>/SKILL.md`. Each skill contains a trigger, workflow steps, and expected output format.

## Modules

### `agents.ts`

- `AgentInfo` — type for detected agents (id, name, configPath, detected, configFormat, scope)
- `McpServerEntry` — type for MCP config entries (command, args, env)
- `detectAgents()` — returns only agents found on the machine
- `allAgentTargets()` — returns all possible agents regardless of detection
- `supportsJsonConfig(agent)` — returns false only for Codex CLI
- `readAgentConfig(agent)` / `writeAgentConfig(agent, config)` — safe JSON read/write with directory creation
- `addMcpToAgent(agent, serverName, entry)` — adds an MCP server to agent config
- `removeMcpFromAgent(agent, serverName)` — removes an MCP server from agent config
- `listInstalledMcp(agent)` — returns all configured MCP servers

### `registry.ts`

- `mcpRegistry` — array of all MCP server definitions with slug, name, description, npm package, entry config, and required env vars
- `skillRegistry` — array of all skill definitions with slug, name, description, install command, and SKILL.md content
- `findMcp(slug)` — lookup by slug or name (case-insensitive)
- `findSkill(slug)` — lookup by slug or name (case-insensitive)

### `prompt.ts`

- `ask(question)` — single-line text input
- `choose(label, items)` — numbered single-select (auto-selects if only 1 item)
- `chooseMultiple(label, items)` — numbered multi-select with comma-separated input or "all"
- `confirm(question)` — y/N confirmation
- `askEnvVars(vars)` — collects env var values, uses existing `process.env` when available

### `ui.ts`

- `banner(version)` — ASCII art splash with version
- `heading(text)` / `success(text)` / `warn(text)` / `error(text)` / `info(text)` — colored terminal output
- `item(label, value)` / `table(rows)` / `divider()` — formatted display helpers

### `index.ts`

- Arg parsing: `command`, `subCommand`, `target`, `--agent` flag
- All command implementations as async functions
- `resolveEnvPlaceholders()` — replaces `{VAR}` tokens in MCP entries with collected values
- Update check: fetches latest version from npm registry, caches for 24h in `~/.zerocode/update-check.json`
- `main()` — routes commands via switch statement

## Product Rules

- Focus on local installation flows.
- Prefer clear commands over abstraction.
- Keep supported agent integrations explicit.
- Treat filesystem edits and config writes as safety-sensitive.
- Always confirm before writing to agent configs.
- Never silently upgrade or mutate config without user confirmation.

## Coding Rules

- Use TypeScript.
- Keep command flows readable and direct.
- Prefer small modules over framework-style layers.
- Do not silently mutate user config when confirmation is needed.
- Preserve backwards-compatible CLI behavior unless the change is intentional.
- Zero runtime dependencies — only Node.js builtins.
- All registry data bundled in source, no external fetches during install flows.

## Change Workflow

After meaningful changes:

- run `npm run build` in the project root

## npm Scripts

- `npm run build` — compile TypeScript (`tsc`)
- `npm run dev` — watch mode (`tsc --watch`)
- `npm start` — run compiled CLI (`node dist/index.js`)
- `npm run prepublishOnly` — build before publish
