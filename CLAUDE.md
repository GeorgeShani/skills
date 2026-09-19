# Project: George Shanidze's Agent Skills

A flat collection of [Agent Skills](https://agentskills.io) — portable `SKILL.md` files that work in Claude Code, Codex, Cursor, or any other compliant AI agent harness.

## Layout

```
skills/<skill-name>/SKILL.md      required entry point per skill
skills/<skill-name>/README.md     optional, for skills large enough to need one
skills/<skill-name>/references/   optional, loaded on demand by the skill
skills/<skill-name>/assets/       optional, standalone artifacts (checklists, templates)
```

Skills live flat under `skills/`, no category subfolders. Revisit this only if the
collection grows past roughly a dozen skills and a flat list stops being scannable.

## Before adding a new skill folder

Check whether the new content is really a new *topic*, or more depth on a topic an
existing skill already owns. If an existing skill's frontmatter `description` would
already plausibly match the new content's trigger conditions, it's the latter — fold
the new material in as a `references/` file under the existing skill instead of
creating a sibling folder that overlaps it. Two folders that both fire on "the Angular
app" or "the mobile pipeline" just makes triggering ambiguous for no benefit.

`angular-ionic-capacitor` is the working example: it started as one file, then grew a
`references/` split (`stack-and-tooling.md`, `architecture-and-release-engineering.md`)
with `SKILL.md` reduced to a short router, rather than becoming a second
`angular-ionic-capacitor-engineering` folder next to it. When a skill's `SKILL.md` grows
past a page or so of unrelated concerns, that's the signal to split it this way, not to
fork it into a new skill.

## Conventions every skill follows

- `SKILL.md` frontmatter has exactly `name` and `description` at minimum. `name` must
  match its folder name exactly.
- `description` states what the skill does and when to use it, specifically enough that
  an agent can decide relevance without reading the body first.
- A skill may add extra frontmatter fields (e.g. `license`) on top of `name`/`description`
  without breaking portability — those two are the only fields the open Agent Skills spec
  requires.
- Prefer plain Markdown and portable instructions over harness-specific syntax, so a skill
  keeps working outside Claude Code.

## Adding or changing a skill

1. Create `skills/<skill-name>/SKILL.md` (or edit the existing one).
2. Add `./skills/<skill-name>` to the `skills` array in
   [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json).
3. Add a row for it to the table in [`README.md`](README.md), linking the skill name to
   its `SKILL.md`.
4. Add it to the skill dropdown in
   [`.github/ISSUE_TEMPLATE/bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml).
   The validator doesn't check this one; it's easy to forget.
5. Run `npm run validate` before committing — it checks frontmatter, folder-name
   consistency, and that `plugin.json` and `README.md` haven't drifted from what's
   actually in `skills/`.

Removing a skill is the same steps in reverse: delete the folder, drop it from
`plugin.json`, drop its README row.

## Repo-level descriptions

The `description` fields in `package.json`, `.claude-plugin/plugin.json`, and
`.claude-plugin/marketplace.json` describe the collection, not its current member list —
write them so they stay true as skills are added or removed (e.g. "a growing collection
covering X, Y, and more"), not as an enumeration of today's skills by name. The README's
table is where per-skill specifics belong; keep it in sync per skill (see above), but
don't duplicate that specificity into the manifests.

## Versioning

Bump `version` in both `package.json` and `.claude-plugin/plugin.json` together when
publishing a notable change (new skill, breaking change to an existing one's behavior).
Keep the two in sync; there's no automated sync script for a collection this small.
