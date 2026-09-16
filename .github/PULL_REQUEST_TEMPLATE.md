## What kind of change is this?

- [ ] New skill
- [ ] Fix or improvement to an existing skill
- [ ] Repo tooling / docs (validator, CI, README, etc.)

## What does it do, and why

<!--
For a new skill: what situation does it help with, and what does an agent do
differently once it has this skill that it wouldn't do otherwise?
For a fix: what was wrong, and what changed?
-->

## Have you actually run this?

<!--
CONTRIBUTING.md asks for a skill to be dogfooded, not just written. A transcript
excerpt or a short before/after is the easiest way to show it.
-->

## Checklist

- [ ] `SKILL.md` frontmatter has `name` and `description`, and `name` matches the folder name
- [ ] Body uses plain Markdown and portable instructions (no harness-specific syntax)
- [ ] New skill is registered in `.claude-plugin/plugin.json` and has a row in `README.md` (skip if this PR isn't adding a skill)
- [ ] `npm run validate` passes locally
- [ ] I've read [CONTRIBUTING.md](../CONTRIBUTING.md) and this follows it
