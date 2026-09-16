# Contributing

This started as a personal skills collection, but pull requests are welcome — a new
skill, a fix to an existing one, or a correction to something that's gone stale.

## What makes a good submission

- **Generically useful.** A skill here should work for anyone who reads it, not just
  its author. If it needs to reference a specific person, project, or company, that's
  a sign it belongs in a private skills folder instead of this repo.
- **Actually load-bearing.** It should change what an agent does, not just restate
  what a competent agent would already do. If you can't describe a concrete situation
  where following the skill produces a different (better) outcome than not having it,
  it's not ready yet.
- **Portable.** Stick to the `name` and `description` frontmatter fields from the open
  [Agent Skills](https://agentskills.io) standard, and plain Markdown in the body. A
  skill that only works in one harness is worth less than one that works everywhere.
- **Dogfooded.** Have you actually used this skill, ideally with a real agent, and
  confirmed it produces the behavior you're describing? A skill nobody has run is a
  guess, not a skill.

## Submitting a new skill

1. Fork the repo and create a branch.
2. Create `skills/<skill-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does and when to use it, specific enough that an agent can
     decide relevance without reading the body first.
   ---
   ```
   `name` must match the folder name exactly — the validator checks this.
3. Add any supporting files the skill needs under the same folder:
   - `references/` — material the skill points to but doesn't load every time.
   - `assets/` — standalone artifacts (checklists, templates) meant to be copied out.
   - `README.md` — only if the skill is big enough that a map of its own files helps.
4. Register the skill in two places:
   - Add `./skills/<skill-name>` to the `skills` array in
     [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json).
   - Add a row to the table in [`README.md`](README.md), linking the skill name to its
     `SKILL.md`.
5. Run the validator before committing:
   ```bash
   npm run validate
   ```
   It checks frontmatter, that the folder name matches `name`, and that
   `plugin.json`/`README.md` haven't drifted from what's actually under `skills/`. CI
   runs the same check on every pull request.
6. Open a pull request describing what the skill does and, ideally, an example of it
   in use (a transcript excerpt, or a before/after).

Fixing or improving an existing skill follows the same validate-before-you-push step,
minus the registration — just edit the file and run `npm run validate`.

## Full conventions

[`CLAUDE.md`](CLAUDE.md) is the source of truth for repo layout and maintenance rules
(what optional folders mean, how versioning works, how to remove a skill). Read it if
anything here is ambiguous.

## License

By submitting a pull request, you agree your contribution is licensed under this
repo's [MIT license](LICENSE), unless your `SKILL.md` explicitly declares a different
license in its own frontmatter (as `app-store-compliance` does with CC0-1.0).

## Questions

Open an issue if you're unsure whether an idea fits before writing the whole thing.
