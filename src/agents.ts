import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";

export interface AgentInfo {
  id: string;
  name: string;
  configPath: string;
  detected: boolean;
  configFormat: "claude-desktop" | "cursor" | "windsurf" | "cline" | "continue" | "claude-code";
  scope: "global" | "project";
}

export interface McpServerEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpConfig {
  mcpServers?: Record<string, McpServerEntry>;
  [key: string]: unknown;
}

const home = homedir();
const cwd = process.cwd();

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function appExists(name: string): boolean {
  return (
    existsSync(`/Applications/${name}.app`) ||
    existsSync(join(home, "Applications", `${name}.app`))
  );
}

function dirHasExtension(extDir: string, prefix: string): boolean {
  if (!existsSync(extDir)) return false;
  try {
    return readdirSync(extDir).some((e) => e.toLowerCase().startsWith(prefix));
  } catch {
    return false;
  }
}

function resolveAgents(): AgentInfo[] {
  const agents: AgentInfo[] = [];

  // ── Claude Desktop ──────────────────────────────────────────────
  const claudeDesktopDir = join(home, "Library", "Application Support", "Claude");
  agents.push({
    id: "claude-desktop",
    name: "Claude Desktop",
    configPath: join(claudeDesktopDir, "claude_desktop_config.json"),
    detected: existsSync(claudeDesktopDir) || appExists("Claude"),
    configFormat: "claude-desktop",
    scope: "global",
  });

  // ── Claude Code (project-level .mcp.json) ───────────────────────
  agents.push({
    id: "claude-code",
    name: "Claude Code",
    configPath: join(cwd, ".mcp.json"),
    detected: commandExists("claude"),
    configFormat: "claude-code",
    scope: "project",
  });

  // ── Cursor (project) ────────────────────────────────────────────
  const cursorDetected = appExists("Cursor") || existsSync(join(home, ".cursor"));
  agents.push({
    id: "cursor",
    name: "Cursor (project)",
    configPath: join(cwd, ".cursor", "mcp.json"),
    detected: cursorDetected,
    configFormat: "cursor",
    scope: "project",
  });

  // ── Cursor (global) ─────────────────────────────────────────────
  agents.push({
    id: "cursor-global",
    name: "Cursor (global)",
    configPath: join(home, ".cursor", "mcp.json"),
    detected: cursorDetected,
    configFormat: "cursor",
    scope: "global",
  });

  // ── Windsurf (project) ──────────────────────────────────────────
  const windsurfDetected =
    appExists("Windsurf") || existsSync(join(home, ".codeium", "windsurf"));
  agents.push({
    id: "windsurf",
    name: "Windsurf (project)",
    configPath: join(cwd, ".windsurf", "mcp.json"),
    detected: windsurfDetected,
    configFormat: "windsurf",
    scope: "project",
  });

  // ── Windsurf (global) ───────────────────────────────────────────
  agents.push({
    id: "windsurf-global",
    name: "Windsurf (global)",
    configPath: join(home, ".codeium", "windsurf", "mcp_config.json"),
    detected: windsurfDetected,
    configFormat: "windsurf",
    scope: "global",
  });

  // ── Cline (VS Code extension) ───────────────────────────────────
  const vscodeExtDir = join(home, ".vscode", "extensions");
  agents.push({
    id: "cline",
    name: "Cline (VS Code)",
    configPath: join(cwd, ".vscode", "mcp.json"),
    detected: dirHasExtension(vscodeExtDir, "saoudrizwan.claude-dev"),
    configFormat: "cline",
    scope: "project",
  });

  // ── Continue.dev ────────────────────────────────────────────────
  agents.push({
    id: "continue",
    name: "Continue.dev",
    configPath: join(home, ".continue", "config.json"),
    detected: existsSync(join(home, ".continue")) ||
      dirHasExtension(vscodeExtDir, "continue.continue"),
    configFormat: "continue",
    scope: "global",
  });

  // ── Codex CLI ───────────────────────────────────────────────────
  agents.push({
    id: "codex",
    name: "Codex CLI",
    configPath: join(cwd, "AGENTS.md"),
    detected: commandExists("codex"),
    configFormat: "claude-code", // reuse format — Codex uses AGENTS.md, handled separately
    scope: "project",
  });

  return agents;
}

export function detectAgents(): AgentInfo[] {
  return resolveAgents().filter((a) => a.detected);
}

export function allAgentTargets(): AgentInfo[] {
  return resolveAgents();
}

export function readAgentConfig(agent: AgentInfo): McpConfig {
  if (!existsSync(agent.configPath)) {
    return {};
  }
  try {
    const raw = readFileSync(agent.configPath, "utf-8");
    return JSON.parse(raw) as McpConfig;
  } catch {
    return {};
  }
}

export function writeAgentConfig(agent: AgentInfo, config: McpConfig): void {
  const dir = dirname(agent.configPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(
    agent.configPath,
    JSON.stringify(config, null, 2) + "\n",
    "utf-8"
  );
}

export function addMcpToAgent(
  agent: AgentInfo,
  serverName: string,
  entry: McpServerEntry
): void {
  const config = readAgentConfig(agent);
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  config.mcpServers[serverName] = entry;
  writeAgentConfig(agent, config);
}

export function removeMcpFromAgent(
  agent: AgentInfo,
  serverName: string
): boolean {
  const config = readAgentConfig(agent);
  if (!config.mcpServers || !config.mcpServers[serverName]) {
    return false;
  }
  delete config.mcpServers[serverName];
  writeAgentConfig(agent, config);
  return true;
}

export function listInstalledMcp(
  agent: AgentInfo
): Record<string, McpServerEntry> {
  const config = readAgentConfig(agent);
  return config.mcpServers ?? {};
}
