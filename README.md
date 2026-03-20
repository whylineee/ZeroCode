<p align="center">
  <img src="https://img.shields.io/npm/v/@whylineee/zerocode?color=blue&label=npm" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node" />
</p>

# ZeroCode

**One CLI to connect MCP servers and skills to any AI agent on your machine.**

```
    ███████╗███████╗██████╗  ██████╗
    ╚══███╔╝██╔════╝██╔══██╗██╔═══██╗
      ███╔╝ █████╗  ██████╔╝██║   ██║
     ███╔╝  ██╔══╝  ██╔══██╗██║   ██║
    ███████╗███████╗██║  ██║╚██████╔╝
    ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝
       C O D E
```

## Quick Start

```bash
npx @whylineee/zerocode init
```

Or run individual commands:

```bash
npx @whylineee/zerocode detect          # find installed agents
npx @whylineee/zerocode add mcp git-mcp # install an MCP server
npx @whylineee/zerocode doctor          # check your setup
```

## Supported Agents

| Agent | Scope |
|---|---|
| Claude Desktop | global |
| Claude Code | project |
| Cursor | project + global |
| Windsurf | project + global |
| Cline (VS Code) | project |
| Continue.dev | global |
| Codex CLI | project |

## Commands

| Command | Description |
|---|---|
| `zerocode init` | Interactive setup wizard — pick agents, starter packs, install everything |
| `zerocode detect` | Detect installed AI agents |
| `zerocode list mcp` | List 30+ available MCP servers |
| `zerocode list skills` | List available skills |
| `zerocode add mcp <name>` | Install an MCP server to an agent |
| `zerocode add skill <name>` | Install a skill to the project |
| `zerocode remove mcp <name>` | Remove an MCP server from an agent |
| `zerocode status` | Show what's installed on each agent |
| `zerocode doctor` | Check runtimes, configs, and env vars |
| `zerocode backup` | Backup all agent configs |
| `zerocode restore` | Restore configs from backup |

## MCP Starter Packs

The `init` wizard offers quick-start bundles:

- **Essential** — filesystem, git, memory
- **Web** — fetch, brave-search, firecrawl
- **DevOps** — github, docker, sentry
- **Custom** — pick your own from 30+ servers

## Install Globally

```bash
npm install -g @whylineee/zerocode
zerocode detect
```

## Development

```bash
git clone https://github.com/whylineee/ZeroCode.git
cd ZeroCode
npm install
npm run build
node dist/index.js detect
```

## Architecture

```
src/
├── index.ts       # CLI entry, arg parsing, all commands
├── agents.ts      # Agent detection & config read/write
├── registry.ts    # 30+ MCP servers & skills registry
├── prompt.ts      # Interactive prompts (zero dependencies)
└── ui.ts          # Terminal colors, banners, formatting
```

Zero runtime dependencies. Built with Node.js builtins only.

## License

MIT
# ZeroCode
# ZeroCode
