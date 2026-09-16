---
name: app-store-compliance
description: Audit a mobile app against Apple App Store and Google Play publication requirements before submission, and diagnose rejections after them. Covers privacy policy and account-deletion requirements, SDK and target-API floors, store-listing metadata, data-disclosure forms, permissions policy, age ratings, and regional law (GDPR, EU Accessibility Act, DSA trader status, age assurance). Use this whenever someone is preparing to publish or update an iOS or Android app, asks what is needed to get an app approved, got a rejection from App Review or Play Console, is adding accounts / subscriptions / login / analytics / AI features to a mobile app, or is starting a React Native, Expo, Flutter, Ionic, or Capacitor project that will eventually ship to a store — even if they do not mention "compliance," "review," or "rejection" by name. Also use it when reviewing backend or data-model design for a mobile app, because account deletion and data disclosure are far cheaper to design in than to retrofit.
license: CC0-1.0
---

# App Store & Google Play Compliance

Get an app approved on the first submission, or diagnose why it wasn't.

Most rejections are not policy disputes. They are missing artifacts (a privacy
policy URL, a working demo account), mismatched declarations (the data-safety
form says one thing, the SDKs do another), or stale toolchains (last year's
SDK). All three are cheap to fix before submitting and expensive to fix after,
because each round trip through review costs days.

## Before anything else: check freshness

**This skill was written against policy as of September 2026.** Both stores
change requirements several times a year, and two of them — Apple's minimum SDK
and Google's target API level — ratchet upward on a fixed annual schedule.

Treat every dated fact in this skill as a starting hypothesis, not ground truth.
If the current date is more than ~3 months past September 2026, or if a specific
version number matters to the answer, verify against the primary sources before
advising:

| What | Where |
|---|---|
| Apple dated submission requirements | `developer.apple.com/news/upcoming-requirements/` |
| Apple App Review Guidelines | `developer.apple.com/app-store/review/guidelines/` |
| Apple policy announcements | `developer.apple.com/news/` |
| Google Play policy deadlines | `support.google.com/googleplay/android-developer/table/12921780` |
| Google Play target API levels | `developer.android.com/google/play/requirements/target-sdk` |
| Google Play Developer Program Policy | `play.google.com/about/developer-content-policy/` |

If no web access is available, say so plainly and flag which specific numbers
(SDK versions, API levels, deadline dates) the person should confirm themselves.
Do not present a possibly-stale version number as current.

## How to use this skill

Identify which of three modes applies, then follow it.

**Mode 1 — Pre-submission audit.** Someone is preparing to ship. Work through
`assets/pre-submission-checklist.md` with them. Ask about the app's actual
features first (accounts? subscriptions? location? user-generated content?
children? EU users? AI?), because roughly half the requirements are conditional
and asking up front avoids irrelevant advice.

**Mode 2 — Rejection triage.** Someone has a rejection notice. Go straight to
`references/rejection-playbook.md`. The guideline number in the notice is a
structured diagnosis, not a hint — Apple's 5.1.1(v) and 5.1.1(iii) have
completely different fixes despite sharing a number. Get the exact subletter.

**Mode 3 — Design review.** Someone is building, not yet shipping. Focus on the
decisions that are painful to reverse: account deletion cascades, data
minimization at signup, where authentication lives, whether digital goods flow
through platform billing. Flag these early; they are architecture, not polish.

## Reference files

Read the ones that apply. Don't load all of them.

- `references/apple-app-store.md` — Apple account setup, build requirements,
  metadata, and the guidelines that actually cause rejections.
- `references/google-play.md` — Play Console gates, target API and packaging,
  Data safety, permissions policy, listing assets.
- `references/cross-platform-frameworks.md` — React Native/Expo, Flutter,
  Ionic/Capacitor. Read when the app is built with any of these; each has
  distinct failure modes that native apps don't hit.
- `references/legal-and-regional.md` — GDPR, EU Accessibility Act, DSA trader
  status, age assurance laws, COPPA/children. Read when the app ships to the EU,
  the UK, or the US, or when minors may use it.
- `references/rejection-playbook.md` — Rejection code → diagnosis → fix.

`assets/pre-submission-checklist.md` is a standalone artifact. It can be copied
into a repository and worked through per release without the rest of this skill.

## The five gates that block nearly everyone

Verify these before anything else. In rough order of how often they bite:

1. **A working build that doesn't crash.** Performance failures under Apple's
   Guideline 2.1 cause more rejections than any other category. Reviewers open
   the app, do the obvious thing, and it breaks. Dead demo credentials and a
   backend that's down during review count as crashes for this purpose.

2. **A live privacy policy URL.** Required by both stores, unconditionally, even
   for apps that collect nothing. Must be publicly reachable — no login wall, no
   geo-block, no placeholder text. Apple wants it in App Store Connect *and*
   linked inside the app.

3. **In-app account deletion, if the app creates accounts.** Apple requires
   deletion initiated from inside the app. Google requires in-app deletion *plus*
   a web URL where users can request deletion without reinstalling. Deactivation
   does not satisfy either. If the app has no signup, this gate does not apply.

4. **A current toolchain.** Apple enforces a minimum SDK; Google enforces a
   minimum target API level. Both ratchet annually. A CI image pinned to last
   year's version produces an upload that is rejected at the door, before human
   review.

5. **Declarations that match reality.** Apple triangulates the App Privacy
   label, the privacy manifest, and runtime behavior, and rejects on any
   disagreement. Google audits the Data safety form the same way. The data
   collection itself is rarely the problem — the mismatch is. Write the
   declarations first, then make the code conform.

## Output format for an audit

When auditing an app, produce findings in this shape rather than prose, so the
person can act on them directly:

```
## Blockers (submission will be rejected)
- [area] What is wrong → what to do about it

## Risks (may be rejected, depends on reviewer)
- [area] What is questionable → how to reduce the risk

## Deadlines ahead
- [date] What changes and what it requires

## Not applicable
- Brief note on conditional requirements that were checked and ruled out
```

Include the "Not applicable" section. It tells the person you considered the
conditional requirements rather than skipped them, and it prevents them from
re-litigating the same questions next release.

## Judgment notes

**Conditional beats universal.** Most "you must have X" advice circulating
online is conditional advice stated unconditionally. A Terms of Service is the
clearest example: widely described as mandatory, actually required only for
auto-renewable subscriptions and a few regulated categories. Check whether a
requirement's trigger condition is met before flagging it. False blockers waste
as much time as missed ones.

**Reviewers test the flow, not the code.** Most human-review rejections come
from someone tapping through the app on real hardware. The paywall that doesn't
respond, the login that requires an SMS code the reviewer can't receive, the
"Delete account" button buried three screens deep — these fail review even when
the implementation is technically correct. Walk the flows as a reviewer would.

**Rejections are round trips, not verdicts.** Roughly a quarter of submissions
get rejected, and a large share of those are approved after a fix. If someone is
panicking about a rejection, that framing is worth giving them. Resolution
Center replies are read by humans; a clear explanation of what changed and where
to find it resolves many disputes without a new build.
