#!/usr/bin/env node

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";
import {
  detectAgents,
  allAgentTargets,
  addMcpToAgent,
  removeMcpFromAgent,
  listInstalledMcp,
} from "./agents.js";
import type { AgentInfo, McpServerEntry } from "./agents.js";
import { mcpRegistry, skillRegistry, findMcp, findSkill } from "./registry.js";
import { banner, heading, success, warn, error, info, item, table, divider, splashDetect, splashDone } from "./ui.js";
import { choose, chooseMultiple, confirm, ask, askEnvVars } from "./prompt.js";

// ── Arg parsing ──────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();
const subCommand = args[1]?.toLowerCase();
const target = args[2]?.toLowerCase();

function printUsage(): void {
  console.log("  Usage:");
  console.log();
  console.log("    zerocode init                    Interactive setup wizard");
  console.log("    zerocode detect                  Detect installed agents");
  console.log("    zerocode configure               Pick an agent and manage it interactively");
  console.log("    zerocode list mcp                List available MCP servers");
  console.log("    zerocode list skills             List available skills");
  console.log("    zerocode add mcp <name>          Install MCP server to an agent");
  console.log("    zerocode add skill <name>        Install a skill to the project");
  console.log("    zerocode remove mcp <name>       Remove MCP server from an agent");
  console.log("    zerocode status                  Show what's installed on each agent");
  console.log("    zerocode doctor                  Check your setup for issues");
  console.log("    zerocode export                  Export config to shareable .zerocode.json");
  console.log("    zerocode import [path]            Import config from .zerocode.json");
  console.log("    zerocode backup                  Backup all agent configs");
  console.log("    zerocode restore                 Restore agent configs from backup");
  console.log();
  console.log("  Examples:");
  console.log();
  console.log("    npx @whylineee/zerocode detect");
  console.log("    npx @whylineee/zerocode add mcp filesystem-mcp");
  console.log("    npx @whylineee/zerocode add mcp github-mcp --agent claude-desktop");
  console.log("    npx @whylineee/zerocode add skill pr-reviewer");
  console.log("    npx @whylineee/zerocode status");
  console.log();
}

// ── Helpers ──────────────────────────────────────────────────────

function getAgentFlag(): string | undefined {
  const idx = args.indexOf("--agent");
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1].toLowerCase();
  }
  return undefined;
}

function resolveEnvPlaceholders(
  entry: McpServerEntry,
  envValues: Record<string, string>
): McpServerEntry {
  const resolvedArgs = entry.args.map((a) => {
    if (a === "{PROJECT_DIR}") return process.cwd();
    for (const [key, value] of Object.entries(envValues)) {
      if (a === `{${key}}`) return value;
    }
    return a;
  });

  let resolvedEnv: Record<string, string> | undefined;
  if (entry.env) {
    resolvedEnv = {};
    for (const [key, val] of Object.entries(entry.env)) {
      resolvedEnv[key] = envValues[key] ?? val;
    }
  }

  return {
    command: entry.command,
    args: resolvedArgs,
    ...(resolvedEnv ? { env: resolvedEnv } : {}),
  };
}

// ── Commands ─────────────────────────────────────────────────────

async function cmdDetect(): Promise<void> {
  heading("Detecting installed agents...");

  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected on this machine.");
    info("Supported: Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Continue.dev, Codex CLI");
    return;
  }

  success(`Found ${detected.length} agent(s):`);
  console.log();
  for (const agent of detected) {
    item(
      `${agent.name}`,
      `${agent.scope} · ${agent.configPath}`
    );
  }
}

async function cmdListMcp(): Promise<void> {
  heading("Available MCP servers");

  const rows: [string, string][] = mcpRegistry.map((m) => [
    m.slug,
    m.description,
  ]);
  table(rows);
  console.log();
  info(`${mcpRegistry.length} servers available. Use: zerocode add mcp <slug>`);
}

async function cmdListSkills(): Promise<void> {
  heading("Available skills");

  const rows: [string, string][] = skillRegistry.map((s) => [
    s.slug,
    s.description,
  ]);
  table(rows);
  console.log();
  info(`${skillRegistry.length} skills available. Use: zerocode add skill <slug>`);
}

async function cmdAddMcp(): Promise<void> {
  if (!target) {
    error("Missing MCP server name. Usage: zerocode add mcp <name>");
    console.log();
    info("Run 'zerocode list mcp' to see available servers.");
    return;
  }

  const mcp = findMcp(target);
  if (!mcp) {
    error(`MCP server "${target}" not found in registry.`);
    console.log();
    info("Run 'zerocode list mcp' to see available servers.");
    return;
  }

  heading(`Installing ${mcp.name} MCP server`);
  info(mcp.description);
  console.log();

  // Resolve agent target
  const agentFlag = getAgentFlag();
  let agent: AgentInfo | undefined;

  if (agentFlag) {
    const all = allAgentTargets();
    agent = all.find((a) => a.id === agentFlag);
    if (!agent) {
      error(`Agent "${agentFlag}" not found. Detected agents:`);
      for (const a of detectAgents()) {
        item(a.id, a.name);
      }
      return;
    }
  } else {
    // Interactive agent selection
    const detected = detectAgents();
    if (detected.length === 0) {
      warn("No agents detected. Showing all possible targets...");
      const all = allAgentTargets();
      agent = await choose("Select target agent:", all);
    } else {
      agent = await choose("Select target agent:", detected);
    }
  }

  if (!agent) {
    error("No agent selected. Aborting.");
    return;
  }

  // Collect env vars if needed
  let envValues: Record<string, string> = {};
  if (mcp.envVars && mcp.envVars.length > 0) {
    info(`This server requires: ${mcp.envVars.join(", ")}`);
    console.log();
    envValues = await askEnvVars(mcp.envVars);
  }

  // Build final entry
  const entry = resolveEnvPlaceholders(
    { ...mcp.entry },
    envValues
  );

  // Extract server name from slug (remove -mcp suffix for cleaner config)
  const serverName = mcp.slug.replace(/-mcp$/, "");

  // Confirm
  console.log();
  info(`Server:  ${mcp.name}`);
  info(`Agent:   ${agent.name}`);
  info(`Config:  ${agent.configPath}`);
  info(`Key:     ${serverName}`);
  console.log();

  const ok = await confirm("Install this MCP server?");
  if (!ok) {
    warn("Cancelled.");
    return;
  }

  addMcpToAgent(agent, serverName, entry);
  console.log();
  success(`${mcp.name} installed to ${agent.name}`);
  info(`Config written to: ${agent.configPath}`);

  if (mcp.envVars && mcp.envVars.length > 0) {
    const unresolvedVars = mcp.envVars.filter((v) => !envValues[v]);
    if (unresolvedVars.length > 0) {
      console.log();
      warn("Some env vars still have placeholder values:");
      for (const v of unresolvedVars) {
        info(`  ${v} — update in the config file or set as env var`);
      }
    }
  }

  console.log();
  info("Restart your agent to pick up the new MCP server.");
}

async function cmdAddSkill(): Promise<void> {
  if (!target) {
    error("Missing skill name. Usage: zerocode add skill <name>");
    console.log();
    info("Run 'zerocode list skills' to see available skills.");
    return;
  }

  const skill = findSkill(target);
  if (!skill) {
    error(`Skill "${target}" not found in registry.`);
    console.log();
    info("Run 'zerocode list skills' to see available skills.");
    return;
  }

  heading(`Installing ${skill.name} skill`);
  info(skill.description);
  console.log();

  // Write SKILL.md to project .zerocode/skills/<slug>/SKILL.md
  const skillDir = join(process.cwd(), ".zerocode", "skills", skill.slug);
  const skillPath = join(skillDir, "SKILL.md");

  if (existsSync(skillPath)) {
    const overwrite = await confirm(`Skill already exists at ${skillPath}. Overwrite?`);
    if (!overwrite) {
      warn("Cancelled.");
      return;
    }
  }

  if (!existsSync(skillDir)) {
    mkdirSync(skillDir, { recursive: true });
  }

  writeFileSync(skillPath, skill.skillMd + "\n", "utf-8");
  console.log();
  success(`${skill.name} installed to ${skillPath}`);
  info(`Invoke it by referencing the SKILL.md in your agent prompt.`);
  info(`Install command (alternative): ${skill.installCommand}`);
}

async function cmdRemoveMcp(): Promise<void> {
  if (!target) {
    error("Missing MCP server name. Usage: zerocode remove mcp <name>");
    return;
  }

  const serverName = target.replace(/-mcp$/, "");

  const agentFlag = getAgentFlag();
  let agent: AgentInfo | undefined;

  if (agentFlag) {
    const all = allAgentTargets();
    agent = all.find((a) => a.id === agentFlag);
  } else {
    const detected = detectAgents();
    agent = await choose("Remove from which agent?", detected);
  }

  if (!agent) {
    error("No agent selected. Aborting.");
    return;
  }

  const removed = removeMcpFromAgent(agent, serverName);
  if (removed) {
    success(`Removed "${serverName}" from ${agent.name}`);
  } else {
    warn(`"${serverName}" was not found in ${agent.name}'s config.`);
  }
}

async function cmdStatus(): Promise<void> {
  heading("Agent status");

  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected.");
    return;
  }

  for (const agent of detected) {
    console.log();
    item(agent.name, `(${agent.scope}) ${agent.configPath}`);
    const installed = listInstalledMcp(agent);
    const keys = Object.keys(installed);
    if (keys.length === 0) {
      info("  No MCP servers configured.");
    } else {
      for (const key of keys) {
        const srv = installed[key];
        info(`  ├─ ${key}: ${srv.command} ${srv.args.join(" ")}`);
      }
    }
    divider();
  }
}

// ── Init ─────────────────────────────────────────────────────────

async function cmdInit(): Promise<void> {
  heading("Interactive Setup Wizard");
  info("Let's set up your AI agent environment.\n");

  // Step 1 — Detect agents
  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected on this machine.");
    info("Install an agent first (Claude Desktop, Cursor, Windsurf, etc.) and re-run.");
    return;
  }

  success(`Found ${detected.length} agent(s) on your machine:`);
  console.log();
  for (const a of detected) {
    item(a.name, a.scope);
  }

  // Step 2 — Pick agents to configure
  const selectedAgents = await chooseMultiple("Which agents do you want to configure?", detected);
  if (selectedAgents.length === 0) {
    warn("No agents selected. Aborting.");
    return;
  }

  // Step 3 — Pick MCP servers to install
  console.log();
  info("Popular MCP starter packs:");
  console.log();
  info("  a) Essential   — filesystem, git, memory");
  info("  b) Web         — fetch, brave-search, firecrawl");
  info("  c) DevOps      — github, docker, sentry");
  info("  d) Custom      — pick your own");
  console.log();

  const pack = await ask("  Choose a pack (a/b/c/d): ");
  let mcpSlugs: string[];

  switch (pack.toLowerCase()) {
    case "a":
      mcpSlugs = ["filesystem-mcp", "git-mcp", "memory-mcp"];
      break;
    case "b":
      mcpSlugs = ["fetch-mcp", "brave-search-mcp", "firecrawl-mcp"];
      break;
    case "c":
      mcpSlugs = ["github-mcp", "docker-mcp", "sentry-mcp"];
      break;
    default: {
      const picked = await chooseMultiple(
        "Select MCP servers to install:",
        mcpRegistry.map((m) => ({ name: m.name, slug: m.slug }))
      );
      mcpSlugs = picked.map((p) => p.slug!);
    }
  }

  if (mcpSlugs.length === 0) {
    warn("No MCP servers selected. Skipping MCP setup.");
  }

  // Step 4 — Collect env vars for all selected MCP servers
  const allEnvValues: Record<string, string> = {};
  for (const slug of mcpSlugs) {
    const mcp = findMcp(slug);
    if (!mcp) continue;
    if (mcp.envVars && mcp.envVars.length > 0) {
      console.log();
      info(`${mcp.name} requires: ${mcp.envVars.join(", ")}`);
      const vals = await askEnvVars(mcp.envVars);
      Object.assign(allEnvValues, vals);
    }
  }

  // Step 5 — Install to all selected agents
  console.log();
  heading("Installing...");

  for (const agent of selectedAgents) {
    for (const slug of mcpSlugs) {
      const mcp = findMcp(slug);
      if (!mcp) continue;
      const entry = resolveEnvPlaceholders({ ...mcp.entry }, allEnvValues);
      const serverName = slug.replace(/-mcp$/, "");
      addMcpToAgent(agent, serverName, entry);
      success(`${mcp.name} → ${agent.name}`);
    }
  }

  // Step 6 — Optionally install skills
  console.log();
  const wantSkills = await confirm("Install some skills too?");
  if (wantSkills) {
    const picked = await chooseMultiple(
      "Select skills:",
      skillRegistry.map((s) => ({ name: s.name, slug: s.slug }))
    );
    for (const s of picked) {
      const skill = findSkill(s.slug!);
      if (!skill) continue;
      const skillDir = join(process.cwd(), ".zerocode", "skills", skill.slug);
      const skillPath = join(skillDir, "SKILL.md");
      if (!existsSync(skillDir)) mkdirSync(skillDir, { recursive: true });
      writeFileSync(skillPath, skill.skillMd + "\n", "utf-8");
      success(`${skill.name} → ${skillPath}`);
    }
  }

  console.log();
  success("Setup complete!");
  info("Restart your agents to pick up the new MCP servers.");
  info("Run 'zerocode status' to verify everything.");
}

// ── Doctor ───────────────────────────────────────────────────────

function commandExists(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isValidJson(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) return false;
    JSON.parse(readFileSync(filePath, "utf-8"));
    return true;
  } catch {
    return false;
  }
}

async function cmdDoctor(): Promise<void> {
  heading("Diagnostics");

  let issues = 0;

  // Check runtimes
  info("Checking runtimes...");
  console.log();

  const runtimes: [string, string][] = [
    ["node", "Required for npx-based MCP servers"],
    ["npx", "Runs MCP servers from npm"],
    ["uvx", "Runs Python-based MCP servers (git, fetch, sqlite)"],
    ["python3", "Required by some MCP servers"],
  ];

  for (const [cmd, purpose] of runtimes) {
    if (commandExists(cmd)) {
      try {
        const ver = execSync(`${cmd} --version 2>/dev/null`, { encoding: "utf-8" }).trim();
        success(`${cmd} ${ver}  — ${purpose}`);
      } catch {
        success(`${cmd} found  — ${purpose}`);
      }
    } else {
      warn(`${cmd} not found — ${purpose}`);
      issues++;
    }
  }

  // Check agents
  console.log();
  info("Checking agents...");
  console.log();

  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected.");
    issues++;
  } else {
    for (const agent of detected) {
      const configExists = existsSync(agent.configPath);
      const usesJson = agent.configFormat !== "claude-code";
      const configValid = usesJson ? isValidJson(agent.configPath) : configExists;

      if (!configExists) {
        item(agent.name, "config not found (will be created on first add)");
      } else if (!configValid) {
        error(`${agent.name} — config exists but is INVALID JSON: ${agent.configPath}`);
        issues++;
      } else {
        const installed = listInstalledMcp(agent);
        const count = Object.keys(installed).length;
        success(`${agent.name} — ${count} MCP server(s) configured`);

        // Check if configured servers have placeholder env vars
        for (const [key, srv] of Object.entries(installed)) {
          const hasPlaceholder = srv.args.some((a: string) => /^\{.+\}$/.test(a));
          const envPlaceholders = srv.env
            ? Object.values(srv.env).filter((v: string) => /^\{.+\}$/.test(v))
            : [];
          if (hasPlaceholder || envPlaceholders.length > 0) {
            warn(`  └─ ${key}: has unresolved placeholder values`);
            issues++;
          }
        }
      }
    }
  }

  // Summary
  console.log();
  divider();
  if (issues === 0) {
    success("All checks passed! Your setup looks healthy.");
  } else {
    warn(`${issues} issue(s) found. Review the warnings above.`);
  }
}

// ── Backup / Restore ─────────────────────────────────────────────

const BACKUP_DIR = join(process.cwd(), ".zerocode");
const BACKUP_FILE = join(BACKUP_DIR, "backup.json");

interface BackupData {
  timestamp: string;
  agents: {
    id: string;
    name: string;
    configPath: string;
    configFormat: string;
    content: string;
  }[];
}

async function cmdBackup(): Promise<void> {
  heading("Backing up agent configs");

  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected. Nothing to back up.");
    return;
  }

  const backup: BackupData = {
    timestamp: new Date().toISOString(),
    agents: [],
  };

  for (const agent of detected) {
    if (existsSync(agent.configPath)) {
      const content = readFileSync(agent.configPath, "utf-8");
      backup.agents.push({
        id: agent.id,
        name: agent.name,
        configPath: agent.configPath,
        configFormat: agent.configFormat,
        content,
      });
      success(`${agent.name} — backed up`);
    } else {
      info(`${agent.name} — no config file yet, skipping`);
    }
  }

  if (backup.agents.length === 0) {
    warn("No configs found to back up.");
    return;
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2), "utf-8");
  console.log();
  success(`Backup saved to ${BACKUP_FILE}`);
  info(`${backup.agents.length} agent config(s) stored.`);
}

async function cmdRestore(): Promise<void> {
  heading("Restoring agent configs");

  if (!existsSync(BACKUP_FILE)) {
    error(`No backup found at ${BACKUP_FILE}`);
    info("Run 'zerocode backup' first.");
    return;
  }

  const raw = readFileSync(BACKUP_FILE, "utf-8");
  let backup: BackupData;
  try {
    backup = JSON.parse(raw);
  } catch {
    error("Backup file is corrupted.");
    return;
  }

  info(`Backup from: ${backup.timestamp}`);
  info(`Contains: ${backup.agents.length} agent config(s)`);
  console.log();

  for (const entry of backup.agents) {
    item(entry.name, entry.configPath);
  }

  console.log();
  const ok = await confirm("Restore all configs? This will overwrite current configs.");
  if (!ok) {
    warn("Cancelled.");
    return;
  }

  for (const entry of backup.agents) {
    const dir = dirname(entry.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(entry.configPath, entry.content, "utf-8");
    success(`${entry.name} — restored`);
  }

  console.log();
  success("All configs restored!");
  info("Restart your agents to apply.");
}

// ── Export / Import ──────────────────────────────────────────────

const EXPORT_FILE = join(process.cwd(), ".zerocode.json");

interface ExportManifest {
  version: 1;
  timestamp: string;
  mcpServers: {
    slug: string;
    name: string;
    envVars?: string[];
  }[];
  skills: string[];
  source: {
    agents: string[];
  };
}

async function cmdExport(): Promise<void> {
  heading("Exporting configuration");

  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected. Nothing to export.");
    return;
  }

  // Collect all unique MCP server slugs across agents
  const mcpMap = new Map<string, { slug: string; name: string; envVars?: string[] }>();
  const agentNames: string[] = [];

  for (const agent of detected) {
    const installed = listInstalledMcp(agent);
    const keys = Object.keys(installed);
    if (keys.length > 0) {
      agentNames.push(agent.name);
    }
    for (const key of keys) {
      if (mcpMap.has(key)) continue;
      // Try to match back to registry for metadata
      const regEntry = mcpRegistry.find(
        (m) => m.slug.replace(/-mcp$/, "") === key
      );
      mcpMap.set(key, {
        slug: regEntry?.slug ?? key,
        name: regEntry?.name ?? key,
        envVars: regEntry?.envVars,
      });
    }
  }

  // Collect installed skills
  const skillsSlugs: string[] = [];
  const skillsDir = join(process.cwd(), ".zerocode", "skills");
  if (existsSync(skillsDir)) {
    try {
      const dirs = readdirSync(skillsDir, { withFileTypes: true });
      for (const d of dirs) {
        if (d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md"))) {
          skillsSlugs.push(d.name);
        }
      }
    } catch { /* ignore */ }
  }

  if (mcpMap.size === 0 && skillsSlugs.length === 0) {
    warn("No MCP servers or skills found. Nothing to export.");
    return;
  }

  const manifest: ExportManifest = {
    version: 1,
    timestamp: new Date().toISOString(),
    mcpServers: Array.from(mcpMap.values()),
    skills: skillsSlugs,
    source: { agents: agentNames },
  };

  // Show summary
  if (manifest.mcpServers.length > 0) {
    success(`${manifest.mcpServers.length} MCP server(s):`);
    for (const m of manifest.mcpServers) {
      item(m.name, m.slug);
    }
  }
  if (manifest.skills.length > 0) {
    console.log();
    success(`${manifest.skills.length} skill(s):`);
    for (const s of manifest.skills) {
      item(s, "");
    }
  }

  console.log();
  const ok = await confirm(`Export to ${EXPORT_FILE}?`);
  if (!ok) {
    warn("Cancelled.");
    return;
  }

  writeFileSync(EXPORT_FILE, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log();
  success(`Exported to ${EXPORT_FILE}`);
  info("Share this file with your team or copy it to another machine.");
  info("Import with: zerocode import");
}

async function cmdImport(): Promise<void> {
  heading("Importing configuration");

  const importPath = args[1] || EXPORT_FILE;

  if (!existsSync(importPath)) {
    error(`No manifest found at ${importPath}`);
    info("Usage: zerocode import [path-to-.zerocode.json]");
    info("Or run 'zerocode export' on the source machine first.");
    return;
  }

  let manifest: ExportManifest;
  try {
    manifest = JSON.parse(readFileSync(importPath, "utf-8"));
  } catch {
    error("Manifest file is invalid JSON.");
    return;
  }

  if (!manifest.version || !manifest.mcpServers) {
    error("Invalid manifest format.");
    return;
  }

  info(`Manifest from: ${manifest.timestamp}`);
  info(`Source agents: ${manifest.source.agents.join(", ") || "unknown"}`);
  console.log();

  if (manifest.mcpServers.length > 0) {
    success(`${manifest.mcpServers.length} MCP server(s) to install:`);
    for (const m of manifest.mcpServers) {
      item(m.name, m.slug);
    }
  }
  if (manifest.skills.length > 0) {
    console.log();
    success(`${manifest.skills.length} skill(s) to install:`);
    for (const s of manifest.skills) {
      item(s, "");
    }
  }

  // Pick target agents
  console.log();
  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected on this machine.");
    info("Install an agent first, then re-run.");
    return;
  }

  const selectedAgents = await chooseMultiple("Install to which agents?", detected);
  if (selectedAgents.length === 0) {
    warn("No agents selected. Aborting.");
    return;
  }

  // Collect all required env vars
  const allRequiredEnvVars: string[] = [];
  for (const m of manifest.mcpServers) {
    if (m.envVars) {
      for (const v of m.envVars) {
        if (!allRequiredEnvVars.includes(v)) {
          allRequiredEnvVars.push(v);
        }
      }
    }
  }

  let envValues: Record<string, string> = {};
  if (allRequiredEnvVars.length > 0) {
    console.log();
    info(`Some servers require env vars: ${allRequiredEnvVars.join(", ")}`);
    envValues = await askEnvVars(allRequiredEnvVars);
  }

  // Install MCP servers
  console.log();
  heading("Installing MCP servers...");

  for (const agent of selectedAgents) {
    for (const m of manifest.mcpServers) {
      const regEntry = findMcp(m.slug);
      if (regEntry) {
        const entry = resolveEnvPlaceholders({ ...regEntry.entry }, envValues);
        const serverName = m.slug.replace(/-mcp$/, "");
        addMcpToAgent(agent, serverName, entry);
        success(`${m.name} → ${agent.name}`);
      } else {
        warn(`${m.slug} not found in registry — skipped`);
      }
    }
  }

  // Install skills
  if (manifest.skills.length > 0) {
    console.log();
    heading("Installing skills...");

    for (const slug of manifest.skills) {
      const skill = findSkill(slug);
      if (skill) {
        const skillDir = join(process.cwd(), ".zerocode", "skills", skill.slug);
        const skillPath = join(skillDir, "SKILL.md");
        if (!existsSync(skillDir)) mkdirSync(skillDir, { recursive: true });
        writeFileSync(skillPath, skill.skillMd + "\n", "utf-8");
        success(`${skill.name} → ${skillPath}`);
      } else {
        warn(`Skill "${slug}" not found in registry — skipped`);
      }
    }
  }

  console.log();
  success("Import complete!");
  info("Restart your agents to pick up the new MCP servers.");
}

// ── Configure (agent-centric interactive) ────────────────────────

async function cmdConfigure(): Promise<void> {
  heading("Agent Configurator");

  // Step 1 — Detect agents
  const detected = detectAgents();
  if (detected.length === 0) {
    warn("No agents detected on this machine.");
    info("Install an agent first (Claude Desktop, Cursor, Windsurf, etc.) and re-run.");
    return;
  }

  success(`Found ${detected.length} agent(s):`);
  console.log();
  for (const a of detected) {
    item(a.name, `${a.scope} · ${a.configPath}`);
  }

  // Step 2 — Pick an agent
  const agent = await choose("Select an agent to configure:", detected);
  if (!agent) {
    warn("No agent selected. Aborting.");
    return;
  }

  console.log();
  success(`Selected: ${agent.name}`);

  // Step 3 — Interactive menu loop
  const actions = [
    { name: "Add MCP server" },
    { name: "Add skill" },
    { name: "View installed MCP servers" },
    { name: "Remove MCP server" },
    { name: "Exit" },
  ];

  while (true) {
    console.log();
    divider();
    const action = await choose(`What do you want to do with ${agent.name}?`, actions);
    if (!action || action.name === "Exit") {
      info("Done configuring.");
      break;
    }

    if (action.name === "Add MCP server") {
      await configureAddMcp(agent);
    } else if (action.name === "Add skill") {
      await configureAddSkill();
    } else if (action.name === "View installed MCP servers") {
      configureViewInstalled(agent);
    } else if (action.name === "Remove MCP server") {
      await configureRemoveMcp(agent);
    }
  }
}

async function configureAddMcp(agent: AgentInfo): Promise<void> {
  // Let user pick from the full registry
  const items = mcpRegistry.map((m) => ({ name: `${m.name}  \x1b[2m${m.slug}\x1b[0m`, slug: m.slug }));
  const picked = await choose("Select MCP server to install:", items);
  if (!picked) {
    warn("Nothing selected.");
    return;
  }

  const mcp = findMcp(picked.slug!);
  if (!mcp) return;

  info(mcp.description);

  // Collect env vars
  let envValues: Record<string, string> = {};
  if (mcp.envVars && mcp.envVars.length > 0) {
    console.log();
    info(`Requires: ${mcp.envVars.join(", ")}`);
    envValues = await askEnvVars(mcp.envVars);
  }

  const entry = resolveEnvPlaceholders({ ...mcp.entry }, envValues);
  const serverName = mcp.slug.replace(/-mcp$/, "");

  console.log();
  info(`Server:  ${mcp.name}`);
  info(`Agent:   ${agent.name}`);
  info(`Key:     ${serverName}`);
  console.log();

  const ok = await confirm("Install this MCP server?");
  if (!ok) {
    warn("Cancelled.");
    return;
  }

  addMcpToAgent(agent, serverName, entry);
  success(`${mcp.name} installed to ${agent.name}`);
  info("Restart your agent to pick up the new MCP server.");
}

async function configureAddSkill(): Promise<void> {
  const items = skillRegistry.map((s) => ({ name: `${s.name}  \x1b[2m${s.slug}\x1b[0m`, slug: s.slug }));
  const picked = await choose("Select skill to install:", items);
  if (!picked) {
    warn("Nothing selected.");
    return;
  }

  const skill = findSkill(picked.slug!);
  if (!skill) return;

  info(skill.description);

  const skillDir = join(process.cwd(), ".zerocode", "skills", skill.slug);
  const skillPath = join(skillDir, "SKILL.md");

  if (existsSync(skillPath)) {
    const overwrite = await confirm(`Skill already exists at ${skillPath}. Overwrite?`);
    if (!overwrite) {
      warn("Cancelled.");
      return;
    }
  }

  if (!existsSync(skillDir)) {
    mkdirSync(skillDir, { recursive: true });
  }

  writeFileSync(skillPath, skill.skillMd + "\n", "utf-8");
  success(`${skill.name} installed to ${skillPath}`);
}

function configureViewInstalled(agent: AgentInfo): void {
  const installed = listInstalledMcp(agent);
  const keys = Object.keys(installed);

  console.log();
  if (keys.length === 0) {
    info("No MCP servers configured on this agent.");
  } else {
    success(`${keys.length} MCP server(s) on ${agent.name}:`);
    console.log();
    for (const key of keys) {
      const srv = installed[key];
      item(key, `${srv.command} ${srv.args.join(" ")}`);
    }
  }
}

async function configureRemoveMcp(agent: AgentInfo): Promise<void> {
  const installed = listInstalledMcp(agent);
  const keys = Object.keys(installed);

  if (keys.length === 0) {
    info("No MCP servers to remove.");
    return;
  }

  const items = keys.map((k) => ({ name: k }));
  const picked = await choose("Select MCP server to remove:", items);
  if (!picked) {
    warn("Nothing selected.");
    return;
  }

  const ok = await confirm(`Remove "${picked.name}" from ${agent.name}?`);
  if (!ok) {
    warn("Cancelled.");
    return;
  }

  const removed = removeMcpFromAgent(agent, picked.name);
  if (removed) {
    success(`Removed "${picked.name}" from ${agent.name}`);
  } else {
    warn(`"${picked.name}" was not found.`);
  }
}

// ── Main ─────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Show splash on every run except version
  const isVersion = command === "version" || command === "--version" || command === "-v";
  if (!isVersion) {
    banner();
  }

  if (!command) {
    printUsage();
    return;
  }

  switch (command) {
    case "detect":
      await cmdDetect();
      break;

    case "list":
      if (subCommand === "mcp") {
        await cmdListMcp();
      } else if (subCommand === "skills" || subCommand === "skill") {
        await cmdListSkills();
      } else {
        error(`Unknown list target: ${subCommand}`);
        info("Use: zerocode list mcp | zerocode list skills");
      }
      break;

    case "add":
      if (subCommand === "mcp") {
        await cmdAddMcp();
      } else if (subCommand === "skill") {
        await cmdAddSkill();
      } else {
        error(`Unknown add target: ${subCommand}`);
        info("Use: zerocode add mcp <name> | zerocode add skill <name>");
      }
      break;

    case "remove":
      if (subCommand === "mcp") {
        await cmdRemoveMcp();
      } else {
        error(`Unknown remove target: ${subCommand}`);
        info("Use: zerocode remove mcp <name>");
      }
      break;

    case "status":
      await cmdStatus();
      break;

    case "init":
      await cmdInit();
      break;

    case "doctor":
      await cmdDoctor();
      break;

    case "backup":
      await cmdBackup();
      break;

    case "restore":
      await cmdRestore();
      break;

    case "configure":
    case "config":
      await cmdConfigure();
      break;

    case "export":
      await cmdExport();
      break;

    case "import":
      await cmdImport();
      break;

    case "help":
    case "--help":
    case "-h":
      printUsage();
      break;

    case "version":
    case "--version":
    case "-v":
      console.log("zerocode 0.1.1");
      break;

    default:
      error(`Unknown command: ${command}`);
      printUsage();
  }
}

main().catch((err) => {
  error(String(err));
  process.exit(1);
});
