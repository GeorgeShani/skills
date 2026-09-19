---
name: angular-ionic-capacitor
description: Guidance for a single Angular + Ionic + Capacitor codebase shipping to Web, iOS, and Android — from initial project setup through architecture and store release. Use this whenever scaffolding a new Ionic/Capacitor project, adding Capacitor or Ionic UI to an existing Angular app, choosing an initialization approach, picking state management or testing tools, deciding where code should live (shared vs. platform-specific), designing or editing CI/CD pipelines, discussing branch strategy, or handling mobile store distribution (TestFlight, Google Play Internal Testing, App Store, Google Play Production). Also covers Capacitor plugins, native permission/config syncing, Fastlane, versioning/build numbers, and GitHub Actions workflows for this stack. Trigger even if the user just says "the mobile pipeline," "the release process," or "the app" without naming Ionic or Capacitor directly, once the stack is Angular/Ionic/Capacitor.
---

# Angular + Ionic + Capacitor

One Angular codebase, built once, deployed as a web app and wrapped natively for iOS/Android via Capacitor. Ionic supplies the UI component layer; Capacitor supplies the native runtime. They're independent of each other — you can use either without the other — but together they're the standard combo for this stack. Don't suggest a second codebase for "the mobile app"; that's what Capacitor is for.

This skill is split into two references — read whichever matches the question, or both if it spans setup and shipping:

| Read this | When the question is about |
|---|---|
| [`references/stack-and-tooling.md`](references/stack-and-tooling.md) | Current framework versions, scaffolding a new project, MCP servers, related Agent Skills, state management, testing tools |
| [`references/architecture-and-release-engineering.md`](references/architecture-and-release-engineering.md) | Frontend architecture, code-sharing philosophy, CI/CD pipeline design, git branch strategy, Fastlane, versioning/build numbers, store distribution |
