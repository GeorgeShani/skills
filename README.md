# skills

My [Agent Skills](https://agentskills.io) — portable `SKILL.md` files that work in Claude Code, Codex, Cursor, or any other compliant AI agent harness. Plain Markdown, no build step, no vendor lock-in.

## What's in here

| Skill | Description |
|---|---|
| [`engineering-partner`](skills/engineering-partner/SKILL.md) | An engineering mentor and reviewer with two modes: **Build Mode** for production-quality implementation with explained trade-offs and honest pushback, and **Learn Mode** for going deep on a concept (mechanism-level, primary sources, a hands-on next step) rather than just shipping. |
| [`app-store-compliance`](skills/app-store-compliance/SKILL.md) | Audits a mobile app against Apple App Store and Google Play publication requirements before submission, and diagnoses rejections after them — privacy policy, account deletion, SDK/target-API floors, data-disclosure forms, and regional law (GDPR, EAA, DSA, age assurance). |
| [`angular-ionic-capacitor`](skills/angular-ionic-capacitor/SKILL.md) | Guidance for building and shipping production-grade Angular + Ionic + Capacitor apps: one codebase for web, iOS, and Android. Covers current framework versions, project setup, MCP servers, state management, testing, and native CI/CD. |

## Installing

### Claude Code (as a plugin)

This repo is its own plugin marketplace ([`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)):

```
/plugin marketplace add GeorgeShani/skills
/plugin install georgeshani-skills
```

Updates arrive by pulling this repo's latest and re-running the marketplace add.

### Any agent, via `npx skills`

Uses the [`skills` CLI](https://github.com/vercel-labs/skills) to copy editable skill files straight into your project — pick which skills and which agents to install for:

```bash
npx skills@latest add GeorgeShani/skills
```

This writes the skills into your repo as ordinary files you own and can edit. Nothing updates behind your back; re-run the command to pull the latest.

### Manual

Copy the folder you want straight into your agent's skills directory, e.g.:

```bash
cp -r skills/engineering-partner ~/.claude/skills/
```

Every `SKILL.md` here uses only the portable `name`/`description` frontmatter fields from the open Agent Skills standard, so a plain copy works in any compliant harness.

## Layout

```
skills/
├── engineering-partner/
│   └── SKILL.md
├── app-store-compliance/
│   ├── SKILL.md
│   ├── README.md
│   ├── references/          apple, google play, cross-platform, legal, rejection playbook
│   └── assets/               pre-submission-checklist.md (standalone, copy into your repo)
└── angular-ionic-capacitor/
    └── SKILL.md
```

See [`CLAUDE.md`](CLAUDE.md) for the conventions this repo follows and how to add a new skill.

## Validating

```bash
npm run validate
```

Checks that every skill has well-formed frontmatter, that folder names match their
declared `name`, and that `.claude-plugin/plugin.json` and this README haven't drifted
from what's actually under `skills/`. Runs in CI on every push and pull request.

## License

MIT, see [`LICENSE`](LICENSE). Individual skills may declare a more permissive license
in their own frontmatter (`app-store-compliance` is CC0-1.0, public domain) — check the
skill's `SKILL.md` if you need to know precisely.
