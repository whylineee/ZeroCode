# AGENTS.md

## Project Identity

ZeroCode CLI is a local installer for MCP servers and reusable skills.

This repository is CLI-only.
Do not reintroduce the public landing site, Next.js app, or docs-first frontend here.

## Product Rules

- Focus on local installation flows.
- Prefer clear commands over abstraction.
- Keep supported agent integrations explicit.
- Treat filesystem edits and config writes as safety-sensitive.

## Coding Rules

- Use TypeScript.
- Keep command flows readable and direct.
- Prefer small modules over framework-style layers.
- Do not silently mutate user config when confirmation is needed.
- Preserve backwards-compatible CLI behavior unless the change is intentional.

## Change Workflow

After meaningful changes:

- run `npm run build` in the project root
