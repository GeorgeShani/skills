# app-store-compliance

A portable knowledge pack for getting mobile apps approved on the Apple App
Store and Google Play. Plain Markdown, no scripts, no runtime dependencies, no
vendor lock-in.

## What's in here

```
app-store-compliance/
├── SKILL.md                                  entry point + routing
├── README.md                                 this file
├── references/
│   ├── apple-app-store.md                    Apple rules and gotchas
│   ├── google-play.md                        Play Console rules and gotchas
│   ├── cross-platform-frameworks.md          RN/Expo, Flutter, Ionic specifics
│   ├── legal-and-regional.md                 GDPR, EAA, DSA, age assurance
│   └── rejection-playbook.md                 rejection code → diagnosis → fix
└── assets/
    └── pre-submission-checklist.md           standalone, copy into your repo
```

Total reading time if you read everything: about 40 minutes. You shouldn't need
to — `SKILL.md` routes you to the two or three files that apply.

## Using it with an agent

**Agent Skills format (Claude, and anything else that reads the open format).**
Drop the folder into your skills directory, or install the packaged `.skill`
file. `SKILL.md` has the standard YAML frontmatter (`name`, `description`) and
the agent loads it automatically when the description matches what you're doing.

**Cursor, Windsurf, Continue, or similar.** Point a rule file at `SKILL.md`, or
paste its contents into your rules. The reference files are loaded on demand by
path.

**Claude Code, Codex, Gemini CLI, Aider, or any CLI agent.** Put the folder in
your repo — `docs/app-store-compliance/` works fine — and reference it from
`AGENTS.md`, `CLAUDE.md`, or whatever convention your tool uses:

```markdown
Before any release work, read docs/app-store-compliance/SKILL.md.
```

**Any chat interface.** Paste `SKILL.md` and the one or two reference files that
apply. They're written to be readable standalone.

**No agent at all.** `assets/pre-submission-checklist.md` is a human artifact.
Copy it into your repository and work through it per release.

## The one thing to know before trusting it

Policy state is **September 2026**, and both stores change requirements several
times a year. Two requirements ratchet on a fixed annual schedule:

- Apple's minimum SDK — enforced each April
- Google's target API level — enforced each 31 August

Items marked ⏱ in the checklist are the ones that go stale. `SKILL.md` includes
the primary-source URLs and instructs the agent to verify before advising. If
you're reading this well after September 2026, check those URLs first.

## Scope

Covers: submission requirements, store policy, build and packaging constraints,
metadata specs, data disclosure, and the regional law that gets apps pulled.

Does not cover: ASO and growth, monetization strategy, app architecture, or
anything that counts as legal advice. Regulated categories — finance, health,
gambling, children's apps — get a map of what to ask about, not an answer.

## License

CC0-1.0. Public domain. Use it, fork it, strip the attribution, ship it inside
a product. No conditions.
