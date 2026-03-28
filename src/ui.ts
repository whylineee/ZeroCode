// ── Terminal UI helpers (zero dependencies) ──────────────────────

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const ITALIC = "\x1b[3m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const BG_NONE = "";

const C1 = "\x1b[38;5;51m";   // bright cyan
const C2 = "\x1b[38;5;45m";   // mid cyan
const C3 = "\x1b[38;5;39m";   // blue-cyan
const C4 = "\x1b[38;5;33m";   // blue
const P1 = "\x1b[38;5;177m";  // soft purple
const P2 = "\x1b[38;5;141m";  // mid purple
const G1 = "\x1b[38;5;250m";  // light gray
const G2 = "\x1b[38;5;244m";  // mid gray
const G3 = "\x1b[38;5;238m";  // dark gray

export function banner(version?: string): void {
  const ver = version ?? "0.0.0";
  console.log();
  console.log(`${C1}${BOLD}    ███████╗${C2}███████╗${C3}██████╗  ${C4}██████╗ ${RESET}`);
  console.log(`${C1}${BOLD}    ╚══███╔╝${C2}██╔════╝${C3}██╔══██╗${C4}██╔═══██╗${RESET}`);
  console.log(`${C1}${BOLD}      ███╔╝ ${C2}█████╗  ${C3}██████╔╝${C4}██║   ██║${RESET}`);
  console.log(`${C1}${BOLD}     ███╔╝  ${C2}██╔══╝  ${C3}██╔══██╗${C4}██║   ██║${RESET}`);
  console.log(`${C1}${BOLD}    ███████╗${C2}███████╗${C3}██║  ██║${C4}╚██████╔╝${RESET}`);
  console.log(`${C1}${BOLD}    ╚══════╝${C2}╚══════╝${C3}╚═╝  ╚═╝${C4} ╚═════╝ ${RESET}`);
  console.log(`${G3}${DIM}              made by whylineee${RESET}`);
  console.log();
  console.log(`${G3}    ──────────────────────────────────${RESET}`);
  console.log(`${P1}${BOLD}       C O D E${RESET}  ${G2}${DIM}v${ver}${RESET}`);
  console.log(`${G2}       MCP · Skills · Agents CLI${RESET}`);
  console.log(`${G3}    ──────────────────────────────────${RESET}`);
  console.log();
}

export function splashDetect(): void {
  console.log();
  console.log(`${C2}${BOLD}    ⟐  ${WHITE}Scanning for AI agents...${RESET}`);
  console.log(`${G3}    ──────────────────────────────────${RESET}`);
}

export function splashDone(count: number): void {
  if (count > 0) {
    console.log(`${G3}    ──────────────────────────────────${RESET}`);
    console.log(`${C1}${BOLD}    ⟐  ${GREEN}${count} agent(s) ready${RESET}`);
  }
  console.log();
}

export function heading(text: string): void {
  console.log(`\n${BOLD}${CYAN}▸ ${text}${RESET}\n`);
}

export function success(text: string): void {
  console.log(`  ${GREEN}✔${RESET} ${text}`);
}

export function warn(text: string): void {
  console.log(`  ${YELLOW}⚠${RESET} ${text}`);
}

export function error(text: string): void {
  console.log(`  ${RED}✖${RESET} ${text}`);
}

export function info(text: string): void {
  console.log(`  ${DIM}${text}${RESET}`);
}

export function item(label: string, value: string): void {
  console.log(`  ${BOLD}${label}${RESET}  ${DIM}${value}${RESET}`);
}

export function table(rows: [string, string][]): void {
  const maxLabel = Math.max(...rows.map(([l]) => l.length));
  for (const [label, value] of rows) {
    console.log(`  ${BOLD}${label.padEnd(maxLabel)}${RESET}  ${DIM}${value}${RESET}`);
  }
}

export function divider(): void {
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);
}
