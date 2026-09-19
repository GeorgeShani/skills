# Stack and Tooling

## Current versions

This ecosystem moves fast — check npm/release notes before trusting an older tutorial.

- **Angular 22** (active). Zoneless change detection is the default since v21 — new apps don't need `provideZonelessChangeDetection()` called manually. Signal Forms are stable. Standalone components only for new code.
- **Ionic Framework 9** — supports Angular 18–22 natively, defaults to zoneless, and made standalone the default import path (`@ionic/angular` *is* the standalone API now; NgModule/lazy imports move to `@ionic/angular/lazy`). `IonicModule` still works but is deprecated — use `provideIonicAngular()`.
- **Capacitor 8.5.x** (active, v9 in alpha). Needs Node 22+, Xcode 26+, Android Studio 2025.2.1+.
- TypeScript: Angular 21 needs 5.9+, Angular 22 needs 6.0+.

## Project setup

Two valid approaches — pick based on how much control is wanted over the Angular baseline.

### Option A — `ionic start` (fast, inherits template lag)

```bash
ionic start myApp tabs --type=angular --standalone
```

Generates a full workspace with Ionic + Capacitor pre-wired. Convenient, but the boilerplate reflects whatever Angular baseline the Ionic team last froze into the template, and that has historically lagged behind Angular's actual current defaults (zoneless, flat ESLint config, Vitest vs. Karma have all needed manual migration on CLI-generated apps before).

### Option B — compose it from a plain Angular CLI app (recommended for a current baseline)

```bash
# 1. Fresh Angular app on current defaults (standalone + zoneless already)
ng new my-app --routing --style=scss
cd my-app

# 2. Capacitor: native runtime + CLI
ng add @capacitor/angular
npm i @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 3. Ionic UI component library
npm i @ionic/angular ionicons
```

Wire Ionic into the bootstrap (`main.ts`):

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
});
```

**Caveat:** `ng add @ionic/angular` also exists as a schematic, but it has a history of friction on standalone-generated Angular projects (mismatched project keys, assumptions about `app.module.ts`). The manual install above is what Ionic's own docs show for standalone apps and is more predictable.

After native code changes or a new build: `npx cap sync`, then `npx cap open ios` / `npx cap open android`.

Only reach for an Nx monorepo if the user is building genuinely separate apps that share code (e.g. a marketing site *and* the Ionic app) — a single project already covers "web app + mobile app" via Capacitor.

## MCP servers

| Server | Covers | Setup |
|---|---|---|
| Official Angular CLI MCP | Angular docs search, best-practices guide, workspace analysis | Built into `@angular/cli` — `npx @angular/cli mcp` (add `--read-only` to disable mutating tools) |
| `Tommertom/awesome-ionic-mcp` (mirror: `tbachir/ionicframework-mcp`) | Ionic component APIs, Capacitor plugin docs (official + community + Capawesome + CapGo), 28 CLI tools (build/sync/run) | Clone from GitHub and follow its README for Claude config — runs as a local stdio server |
| Capawesome's hosted Ionic Framework MCP | Ionic docs/components only, no CLI execution | Zero-install — add `https://ionic-framework-mcp.capawesome.io/mcp` as a custom connector |
| Context7 | Fallback for any of the 9,000+ libraries it indexes, including Angular | `npx -y @upstash/context7-mcp` |

## Agent Skills for this stack

- **`angular/skills`** (official, Angular team) — `angular-developer` (signals, `linkedSignal`, `resource`, forms, DI, routing, SSR, a11y, testing) and `angular-new-app` (scaffolding). Install: `npx skills add https://github.com/angular/skills`.
- **`Cap-go/capgo-skills`** (~49 skills) — `capacitor-plugins`, `capacitor-best-practices`, `debugging-capacitor`, `capacitor-app-store`, `capacitor-ci-cd-automation`, live-update workflows. Install: `bunx skills add Cap-go/capgo-skills`.

## State management

- Component-local UI state: plain `signal()`.
- Feature-scoped state (a screen's data, filters, pagination): `@ngrx/signals` `SignalStore` — co-locates state, computed values, and methods per feature; fits Ionic's page-based navigation.
- Global/cross-cutting state with heavy auditing or synchronization needs: classic NgRx Store — most Ionic apps don't need this.
- Async data tied to a signal input: `resource()`.

## Testing

- Unit: **Vitest** (Ionic's own team moved off Karma to this).
- Web E2E: **Playwright** (Ionic's own team moved off Cypress to this).
- Native/on-device E2E: **Appium 2.x** (cross-platform). Detox is React Native-only — doesn't apply here.

## CI/CD & release tooling options

- DIY: GitHub Actions + **Fastlane** — `match` for iOS signing, `gym`/`pilot` for TestFlight, `supply` for Play Store.
- Managed alternative (no hand-rolled signing/keystore management): **Capawesome Cloud** or **Capgo Build**, both built for Capacitor specifically.
- OTA updates (ship JS/HTML/CSS fixes without an app-store review cycle): **Capgo** or **Capawesome Live Update** — compare the two, don't build a custom one.

For pipeline design, branch strategy, versioning, and the actual store-submission process, see [`architecture-and-release-engineering.md`](architecture-and-release-engineering.md).

## Native plugins

Check the `capacitor-community` org and the Capawesome/CapGo plugin catalogs before writing a custom native plugin — coverage is broad (biometrics, SQLite, background geolocation, IAP, etc.).

## Reference lists

- `Cap-go/awesome-ionic` and `Cap-go/awesome-capacitor` — curated, actively maintained.
- Ionic Forum (`forum.ionicframework.com`) — best source for version-migration edge cases.
