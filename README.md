<div align="center">

```
    ███████╗███████╗██████╗  ██████╗
    ╚══███╔╝██╔════╝██╔══██╗██╔═══██╗
      ███╔╝ █████╗  ██████╔╝██║   ██║
     ███╔╝  ██╔══╝  ██╔══██╗██║   ██║
    ███████╗███████╗██║  ██║╚██████╔╝
    ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝
               C O D E
```

### One command to wire MCP servers and skills into any AI agent on your machine.

<br>

[![npm version](https://img.shields.io/npm/v/@whylineee/zerocode?style=flat-square&color=00d4ff&labelColor=0a0a0a)](https://www.npmjs.com/package/@whylineee/zerocode)
[![license](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=0a0a0a)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-white?style=flat-square&labelColor=0a0a0a)](https://nodejs.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-00d4ff?style=flat-square&labelColor=0a0a0a)](./package.json)

<br>

</div>

---

<br>

## Why ZeroCode?

You install a new MCP server. Then you open Claude's config JSON. Copy-paste the entry. Repeat for Cursor. Repeat for Windsurf. Forget which env vars you set. Break the JSON. Spend 20 minutes debugging a missing comma.

**ZeroCode replaces all of that with one command.**

```bash
npx @whylineee/zerocode init
```

It detects your agents, lets you pick MCP servers from a curated registry, collects API keys, and writes correct configs to every agent at once.

<br>

## Quick Start

```bash
# Interactive wizard — detects agents, picks servers, installs everything
npx @whylineee/zerocode init

# Or go surgical
npx @whylineee/zerocode add mcp github-mcp --agent cursor
npx @whylineee/zerocode add skill pr-reviewer
```

<br>

## What It Does

| | Feature | |
|:---:|---|---|
| **01** | **Auto-detect agents** | Finds Claude Desktop, Cursor, Windsurf, Cline, Continue.dev, Claude Code, Codex CLI |
| **02** | **30+ MCP servers** | Filesystem, Git, GitHub, Slack, Notion, PostgreSQL, Docker, Stripe, and more |
| **03** | **Reusable skills** | PR review, prompt engineering, Docker best practices — as installable SKILL.md files |
| **04** | **Agent configurator** | Pick an agent, then add/remove/inspect servers interactively |
| **05** | **Export / Import** | Share your entire setup as a portable `.zerocode.json` — onboard teammates in seconds |
| **06** | **Doctor** | Checks runtimes, validates configs, flags broken env vars |
| **07** | **Backup / Restore** | Snapshot all agent configs before you experiment |
| **08** | **Zero dependencies** | Pure Node.js builtins. Nothing to install. Nothing to break. |

<br>

## Supported Agents

<table>
<tr>
<td width="200"><b>Claude Desktop</b></td>
<td><code>global</code></td>
<td>macOS Application Support config</td>
</tr>
<tr>
<td><b>Claude Code</b></td>
<td><code>project</code></td>
<td>.mcp.json in project root</td>
</tr>
<tr>
<td><b>Cursor</b></td>
<td><code>project + global</code></td>
<td>.cursor/mcp.json or ~/.cursor/mcp.json</td>
</tr>
<tr>
<td><b>Windsurf</b></td>
<td><code>project + global</code></td>
<td>.windsurf/mcp.json or ~/.codeium config</td>
</tr>
<tr>
<td><b>Cline (VS Code)</b></td>
<td><code>project</code></td>
<td>.vscode/mcp.json</td>
</tr>
<tr>
<td><b>Continue.dev</b></td>
<td><code>global</code></td>
<td>~/.continue/config.json</td>
</tr>
<tr>
<td><b>Codex CLI</b></td>
<td><code>project</code></td>
<td>AGENTS.md in project root</td>
</tr>
</table>

<br>

## MCP Server Registry (30+)

<details>
<summary><b>Essential</b> — filesystem, git, memory, sequential-thinking</summary>

| Server | What it does |
|---|---|
| `filesystem-mcp` | Read, write, and inspect project files safely |
| `git-mcp` | Inspect history, diffs, and safe commit workflows |
| `memory-mcp` | Persist useful facts across sessions |
| `sequential-thinking-mcp` | Dynamic multi-step problem-solving |

</details>

<details>
<summary><b>Web & Search</b> — fetch, brave-search, firecrawl, puppeteer, playwright</summary>

| Server | What it does |
|---|---|
| `fetch-mcp` | Pull web content into cleaner text for agent use |
| `brave-search-mcp` | Web and local search via Brave Search API |
| `firecrawl-mcp` | Crawl web pages and convert to clean markdown |
| `puppeteer-mcp` | Headless browser automation and screenshots |
| `playwright-mcp` | Cross-browser automation (Chromium, Firefox, WebKit) |

</details>

<details>
<summary><b>DevOps & Infra</b> — github, docker, sentry, cloudflare, vercel, aws-s3</summary>

| Server | What it does |
|---|---|
| `github-mcp` | Manage repos, issues, PRs via GitHub API |
| `docker-mcp` | Manage containers, images, and compose stacks |
| `sentry-mcp` | Query error reports and stack traces |
| `cloudflare-mcp` | Manage Workers, KV, R2, and DNS |
| `vercel-mcp` | Manage deployments and project settings |
| `aws-s3-mcp` | List, read, and manage S3 bucket objects |

</details>

<details>
<summary><b>Databases</b> — postgres, sqlite, mongodb, redis, elasticsearch, supabase</summary>

| Server | What it does |
|---|---|
| `postgres-mcp` | Read-only querying of PostgreSQL databases |
| `sqlite-mcp` | Query and analyze local SQLite databases |
| `mongodb-mcp` | Query and inspect MongoDB collections |
| `redis-mcp` | Inspect and query Redis instances |
| `elasticsearch-mcp` | Search and analyze data in Elasticsearch |
| `supabase-mcp` | Query Supabase databases, storage, and auth |

</details>

<details>
<summary><b>SaaS & Productivity</b> — slack, notion, linear, jira, todoist, google-drive, stripe, and more</summary>

| Server | What it does |
|---|---|
| `slack-mcp` | Read channels, search messages, post to Slack |
| `notion-mcp` | Search, read, and update Notion pages |
| `linear-mcp` | Create, search, and manage Linear issues |
| `jira-mcp` | Search, create, and update Jira issues |
| `todoist-mcp` | Create and manage tasks in Todoist |
| `google-drive-mcp` | Search, read, and organize Drive files |
| `stripe-mcp` | Query payments, customers, and subscriptions |
| `youtube-mcp` | Search videos and retrieve transcripts |
| `twilio-mcp` | Send SMS and manage messaging workflows |

</details>

<br>

## Starter Packs

The `init` wizard offers quick-start bundles so you don't pick from 30 servers one by one:

```
 a) Essential   — filesystem, git, memory
 b) Web         — fetch, brave-search, firecrawl
 c) DevOps      — github, docker, sentry
 d) Custom      — pick your own
```

<br>

## All Commands

```
  zerocode init                  Interactive setup wizard
  zerocode detect                Detect installed agents
  zerocode configure             Pick an agent, manage it interactively
  zerocode list mcp              List available MCP servers
  zerocode list skills           List available skills
  zerocode add mcp <name>        Install MCP server to an agent
  zerocode add skill <name>      Install a skill to the project
  zerocode remove mcp <name>     Remove MCP server from an agent
  zerocode status                Show what's installed on each agent
  zerocode doctor                Check runtimes, configs, and env vars
  zerocode export                Export setup to shareable .zerocode.json
  zerocode import [path]         Import setup from .zerocode.json
  zerocode backup                Backup all agent configs
  zerocode restore               Restore agent configs from backup
```

<br>

## Install

```bash
# Run once with npx (no install needed)
npx @whylineee/zerocode init

# Or install globally
npm install -g @whylineee/zerocode
zerocode detect
```

<br>

## Architecture

```
src/
├── index.ts       CLI entry, arg parsing, all commands
├── agents.ts      Agent detection & config read/write
├── registry.ts    30+ MCP servers & skills registry
├── prompt.ts      Interactive prompts (zero dependencies)
└── ui.ts          Terminal colors, banners, formatting
```

**Zero runtime dependencies.** Built with Node.js builtins only.

<br>

## Development

```bash
git clone https://github.com/whylineee/ZeroCode.git
cd ZeroCode
npm install
npm run build
node dist/index.js detect
```

<br>

## Star History

<a href="https://star-history.com/#whylineee/ZeroCode&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=whylineee/ZeroCode&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=whylineee/ZeroCode&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=whylineee/ZeroCode&type=Date" />
 </picture>
</a>

<br>

## License

MIT
