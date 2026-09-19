# Architecture and Release Engineering

For current framework versions, project scaffolding, and tooling choices, see
[`stack-and-tooling.md`](stack-and-tooling.md). This file covers frontend architecture,
CI/CD pipeline design, and mobile store distribution for the same stack.

## Priorities

When making architectural decisions for a project like this, always prioritize, in this order:

1. One shared codebase
2. Maximum code reuse
3. Production-grade mobile development practices
4. Maintainability
5. Automated CI/CD with clear separation between testing and production releases

## Architecture

```
Angular Application
        │
        ├────────────── Web
        │
        └────────────── Capacitor
                        │
                 ┌──────┴──────┐
                 │             │
             Android         iOS
```

**Angular owns:** components, routing, business logic, auth, state management, forms, services, API communication, localization.

**Ionic provides:** mobile UI components, navigation, mobile UX primitives, safe areas, gestures.

**Capacitor provides:** native shell, camera, biometrics, push notifications, filesystem, deep links, native plugins. Capacitor is not responsible for UI.

## Code-sharing philosophy

Prefer sharing: components, services, models, validation, business logic, state management, API layer.

Platform-specific code should exist only when unavoidable — e.g. biometrics, camera, push notifications, native permissions, native share sheet, deep links. Never duplicate application logic across platforms to work around a platform quirk; isolate the quirk instead.

## UI philosophy

One codebase does **not** mean identical UI. Adapt layout per platform:

- **Desktop/web:** sidebars, tables, dense layouts, hover states
- **Mobile:** cards, bottom navigation, native gestures, touch-first targets

Use Ionic as UI infrastructure, not as the entire design system. The mobile app should not feel like a website inside a WebView.

## Development workflow

**Browser (fastest iteration):**
```
ng serve
```

**Android:**
```
ng build
npx cap sync android
npx cap open android   # then run from Android Studio
```

**iOS (requires macOS + Xcode — the simulator cannot run on Windows):**
```
ng build
npx cap sync ios
npx cap open ios        # then run from Xcode
```

⚠️ **Native config gotcha:** `cap sync` copies web assets and updates native dependencies, but it does **not** reliably propagate every native-side config change. After adding or changing a Capacitor plugin's permissions or capabilities, manually verify:
- iOS: `Info.plist` entries (usage descriptions, entitlements)
- Android: `AndroidManifest.xml` permissions

Treat this as a required manual checklist item in PRs that touch native plugin config — CI will not catch a missing permission string.

## Git branch strategy

```
feature/*
      │
      ▼
   develop
      │
      ▼
    main
```

- **feature/\***: isolated development, never deployed directly.
- **develop**: integration, QA, internal testing. Every push should produce installable mobile builds, sent to TestFlight and Google Play Internal Testing.
- **main**: stable releases. Every release from `main` is intended for real users, sent to the App Store and Google Play Production.

## CI vs. CD

- **CI answers:** "Can this code be released?" — install deps, lint, type-check, unit tests, Angular production build, Capacitor sync.
- **CD answers:** "Where should this release go?" — takes the build artifact and distributes it.

Keep validation logic and deployment logic in separate jobs/workflows.

## Mobile build pipeline

```
Angular source
      │
      ▼
Production build
      │
      ▼
Capacitor sync
      │
      ▼
Native build
      │
      ▼
  IPA / AAB
```

## Testing pipeline (trigger: push to `develop`)

```
Git push → install deps → lint → tests → Angular build → cap sync → fastlane beta → TestFlight / Play Internal Testing
```

Testers install directly from TestFlight or a Play Internal Testing link. They should never need to clone the repo, install Node, or open Android Studio/Xcode.

## Production pipeline (trigger: push to `main`)

```
Git push → validation → production build → version increment → fastlane release → App Store Connect + Google Play Console
```

Prefer a manual approval gate before a production upload runs, even though the pipeline itself is automated.

**Manual review is not symmetric between stores** — don't assume Android is "fully automatic" and only iOS needs a human:
- **iOS → App Store:** Apple review is always required before a build goes live to end users. This gate cannot be automated away, no matter how good the CI/CD is.
- **Android → Google Play:** routine updates to an already-approved app on Internal/Closed/Open/Production tracks are typically near-instant, but new apps, and updates that touch sensitive permissions or policy-flagged areas (e.g. background location, SMS, accessibility services), can also trigger manual Play review with real delay. Don't design the pipeline assuming Android production pushes are always instant.

## Versioning

Maintain independent version and build values, e.g. `Version: 1.5.0`, `Build: 42`.

- Auto-increment the build number in CI/CD; avoid manual version bumps.
- **Build numbers must be strictly increasing and never reset** — both Apple and Google reject a build number that isn't higher than the last one. Prefer deriving it from the CI run number or a timestamp, not from a value tracked by hand in a file that can drift or get reverted.

## Fastlane

Fastlane owns platform-specific release mechanics: code signing, certificates, provisioning profiles, build number bumps, store uploads. GitHub Actions should orchestrate the workflow; Fastlane should execute the platform-specific steps within it.

## Secrets

Store all sensitive values in GitHub Secrets — never commit them.

- **Android:** keystore, keystore password, key alias, Google Play service account JSON.
- **iOS:** App Store Connect API key, issuer ID, private key, Apple Team ID, certificates, provisioning profiles.

## AI decision rules

When assisting with a project like this:

1. Prefer Angular-native solutions; maximize shared code between web and mobile.
2. Avoid unnecessary native implementations — only go native when the capability genuinely requires it (camera, biometrics, push, etc.).
3. Keep architecture platform-agnostic wherever possible; isolate platform-specific code at clear boundaries.
4. Separate validation (CI) from deployment (CD) — don't let one workflow do both jobs.
5. Recommend automation over manual processes, but keep human approval gates before production store submissions.
6. Treat TestFlight and Google Play Internal Testing as deployment targets for real testers, not as development environments.
7. Assume testers receive installable builds, never source code or dev-tool instructions.
8. Flag the App Store review gate (and possible Play policy review) as a fixed, non-automatable step — don't imply full CD for production mobile releases.
9. When touching Capacitor plugin config, always call out the manual native-file check (Info.plist / AndroidManifest) alongside `cap sync`.
10. Use strictly increasing, CI-derived build numbers — never a hand-maintained counter.
11. Explain architectural trade-offs before introducing new tools or dependencies.
12. Follow production-grade mobile engineering practices, not tutorial-level shortcuts.
