# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[SemVer](https://semver.org/).

Bump the version in both `package.json` and `.claude-plugin/plugin.json` when you cut
an entry here — see [`CLAUDE.md`](CLAUDE.md#versioning).

## [Unreleased]

## [0.1.0] - 2026-09-16

### Added

- Initial skills: `engineering-partner`, `app-store-compliance`, `angular-ionic-capacitor`
- Claude Code plugin manifest and self-serve marketplace
  (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`)
- Structural validator (`scripts/validate-skills.mjs`) and CI (`.github/workflows/validate.yml`)
- `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Pull request template and issue templates (bug report, new skill proposal)

[unreleased]: https://github.com/GeorgeShani/skills/compare/8de0af0...HEAD
[0.1.0]: https://github.com/GeorgeShani/skills/tree/8de0af0
