#!/usr/bin/env node
// Structural guard for this skill repo. Zero dependencies, stdlib only.
// Run: node scripts/validate-skills.mjs   (exit 1 on any violation)
//
// Checks:
//  1. Every folder under skills/ has a SKILL.md.
//  2. SKILL.md has YAML frontmatter with non-empty `name` and `description`.
//  3. Frontmatter `name` matches its folder name.
//  4. .claude-plugin/plugin.json's `skills` array lists every skill folder,
//     and nothing else.
//  5. README.md links every skill by name (catches a listed-but-undocumented
//     or documented-but-removed skill).

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILLS_DIR = join(ROOT, "skills");
const violations = [];

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

function frontmatterField(fm, field) {
  const m = fm.match(new RegExp(`^${field}:\\s*"?(.*?)"?\\s*$`, "m"));
  return m ? m[1] : "";
}

const skillDirs = readdirSync(SKILLS_DIR).filter((entry) =>
  statSync(join(SKILLS_DIR, entry)).isDirectory()
);

if (skillDirs.length === 0) {
  violations.push("skills/ has no skill folders");
}

for (const dir of skillDirs) {
  const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    violations.push(`skills/${dir}: missing SKILL.md`);
    continue;
  }

  const text = readFileSync(skillPath, "utf8");
  const fm = frontmatter(text);
  if (!fm) {
    violations.push(`skills/${dir}/SKILL.md: missing YAML frontmatter`);
    continue;
  }

  const name = frontmatterField(fm, "name");
  const description = frontmatterField(fm, "description");

  if (!name) {
    violations.push(`skills/${dir}/SKILL.md: frontmatter missing \`name\``);
  } else if (name !== dir) {
    violations.push(
      `skills/${dir}/SKILL.md: frontmatter name "${name}" does not match folder name "${dir}"`
    );
  }

  if (!description) {
    violations.push(`skills/${dir}/SKILL.md: frontmatter missing \`description\``);
  }
}

// plugin.json skills array should exactly match the skill folders on disk.
const pluginPath = join(ROOT, ".claude-plugin", "plugin.json");
if (existsSync(pluginPath)) {
  const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
  const declared = (plugin.skills || []).map((p) => p.replace(/^\.\/skills\//, ""));
  for (const dir of skillDirs) {
    if (!declared.includes(dir)) {
      violations.push(`.claude-plugin/plugin.json: missing entry for skills/${dir}`);
    }
  }
  for (const entry of declared) {
    if (!skillDirs.includes(entry)) {
      violations.push(`.claude-plugin/plugin.json: lists "${entry}", which does not exist under skills/`);
    }
  }
} else {
  violations.push(".claude-plugin/plugin.json is missing");
}

// README.md should link every skill.
const readmePath = join(ROOT, "README.md");
if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, "utf8");
  for (const dir of skillDirs) {
    if (!readme.includes(`skills/${dir}/SKILL.md`)) {
      violations.push(`README.md: no link to skills/${dir}/SKILL.md`);
    }
  }
} else {
  violations.push("README.md is missing");
}

if (violations.length > 0) {
  console.error(`Validation FAILED (${violations.length}):\n` + violations.map((v) => "  - " + v).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validation passed — ${skillDirs.length} skill(s) checked: ${skillDirs.join(", ")}`);
}
