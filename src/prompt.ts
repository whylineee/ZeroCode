import { createInterface } from "node:readline";

const rl = () =>
  createInterface({ input: process.stdin, output: process.stdout });

export function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    const r = rl();
    r.question(question, (answer) => {
      r.close();
      resolve(answer.trim());
    });
  });
}

export async function choose<T extends { name: string }>(
  label: string,
  items: T[]
): Promise<T | undefined> {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];

  console.log(`\n  ${label}\n`);
  for (let i = 0; i < items.length; i++) {
    console.log(`  ${i + 1}) ${items[i].name}`);
  }
  console.log();

  const answer = await ask("  Select (number): ");
  const idx = parseInt(answer, 10) - 1;
  if (idx < 0 || idx >= items.length || isNaN(idx)) {
    return undefined;
  }
  return items[idx];
}

export async function confirm(question: string): Promise<boolean> {
  const answer = await ask(`  ${question} (y/N): `);
  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

export async function chooseMultiple<T extends { name: string; slug?: string }>(
  label: string,
  items: T[]
): Promise<T[]> {
  if (items.length === 0) return [];

  console.log(`\n  ${label}\n`);
  for (let i = 0; i < items.length; i++) {
    const tag = (items[i] as { slug?: string }).slug ?? items[i].name;
    console.log(`  ${String(i + 1).padStart(2)}) ${items[i].name}  \x1b[2m${tag}\x1b[0m`);
  }
  console.log();

  const answer = await ask("  Select (comma-separated numbers, or 'all'): ");
  if (answer.toLowerCase() === "all") return [...items];

  const indices = answer
    .split(",")
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < items.length && !isNaN(i));

  return indices.map((i) => items[i]);
}

export async function askEnvVars(
  vars: string[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const v of vars) {
    const existing = process.env[v];
    if (existing) {
      console.log(`  Using existing env ${v}`);
      result[v] = existing;
    } else {
      const value = await ask(`  Enter ${v}: `);
      if (value) {
        result[v] = value;
      }
    }
  }
  return result;
}
