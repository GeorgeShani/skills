# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[SemVer](https://semver.org/).

Bump the version in both `package.json` and `.claude-plugin/plugin.json` when you cut
an entry here — see [`CLAUDE.md`](CLAUDE.md#versioning).

## Unreleased

## 0.2.0 - 2026-09-19

### Added

- `angular-ionic-capacitor` gained architecture, CI/CD pipeline design, git branch
  strategy, versioning, Fastlane, and mobile store release guidance
  (`references/architecture-and-release-engineering.md`)

### Changed

- `angular-ionic-capacitor/SKILL.md` is now a short router pointing at two reference
  files (`stack-and-tooling.md` and the new `architecture-and-release-engineering.md`)
  instead of one file covering everything, to keep the always-loaded entry point lean
- Repo-level descriptions (`package.json`, `.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json`) now describe the collection generically instead of
  enumerating each skill by name, so they don't need editing every time a skill is added

## [0.1.0] - 2026-09-16

### Added

- Initial skills: `engineering-partner`, `app-store-compliance`, `angular-ionic-capacitor`
- Claude Code plugin manifest and self-serve marketplace
  (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`)
- Structural validator (`scripts/validate-skills.mjs`) and CI (`.github/workflows/validate.yml`)
- `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Pull request template and issue templates (bug report, new skill proposal)

[0.1.0]: https://github.com/GeorgeShani/skills/tree/8de0af0
