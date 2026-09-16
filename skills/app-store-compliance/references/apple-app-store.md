# Apple App Store

Policy state as of September 2026. Verify version numbers and dates against
`developer.apple.com/news/upcoming-requirements/` before relying on them.

## Contents

1. Account and program setup
2. Build requirements
3. App Store Connect metadata
4. Account deletion (5.1.1(v))
5. Privacy (5.1.1, 5.1.2, privacy manifests, ATT)
6. Subscriptions and payments (3.1.x)
7. Design and functionality (4.x)
8. User-generated content and age (1.2, age ratings)
9. Review notes and demo access

---

## 1. Account and program setup

- **Apple Developer Program membership**, USD 99/year. Individual or
  Organization. Organization accounts need a D-U-N-S number and take longer to
  verify — start weeks ahead, not days.
- Individual accounts publish under the person's legal name, which is public on
  the product page. People frequently regret this. An Organization account is
  the fix and it cannot be swapped later without transferring the app.
- **Bundle ID** must be registered and unique. Reverse-DNS convention
  (`com.company.app`). Cannot be changed after first submission.
- Distribution certificate and provisioning profile, or Xcode-managed signing.

## 2. Build requirements

**Minimum SDK.** Since 28 April 2026, uploads must be built with Xcode 26 or
later using the iOS 26 / iPadOS 26 SDK (and tvOS 26, visionOS 26, watchOS 26 for
those platforms). Apple has announced the next step: from April 2027, iOS 27 SDK
or later. This ratchets every spring, roughly six months after the fall OS
release. Budget one forced toolchain upgrade per year.

Consequences worth anticipating:
- Xcode 26 requires a recent macOS. CI runner images must be updated too, not
  just developer machines.
- Building against a new SDK can change appearance. Apps built with the iOS 26
  SDK pick up the current design language on native controls by default unless
  explicitly opted out. Budget UI regression testing, not just a rebuild.
- Deployment target is separate from build SDK. Building with the iOS 26 SDK
  does not drop support for older iOS versions — set the deployment target
  independently.

**watchOS** apps must include 64-bit support.

**Export compliance.** Set `ITSAppUsesNonExemptEncryption` in Info.plist. Almost
every app uses HTTPS, which is exempt, but the key must be present or App Store
Connect asks every single upload. Getting this wrong stalls releases rather than
rejecting them.

**Privacy manifests.** Since 1 May 2024, uploads must declare approved reasons
for a defined list of "required reason" APIs used anywhere in the binary —
including inside third-party SDKs. The file is `PrivacyInfo.xcprivacy`.

The commonly-missed category is `NSPrivacyAccessedAPICategoryUserDefaults`,
because nearly every app touches UserDefaults and almost nobody declares it.
Other categories cover file timestamps, disk space, active keyboards, and system
boot time. SDKs on Apple's list of commonly-used SDKs must ship their own
manifest and a signature; if a dependency hasn't, the upload fails and the fix is
to update or replace the dependency.

## 3. App Store Connect metadata

| Field | Limit | Notes |
|---|---|---|
| App name | 30 chars | Keyword stuffing here triggers 2.3.7 |
| Subtitle | 30 chars | |
| Keywords | 100 chars | Comma-separated, not visible to users |
| Description | 4,000 chars | |
| Promotional text | 170 chars | Editable without a new build |
| What's New | 4,000 chars | |
| Support URL | — | Required, must be live |
| Marketing URL | — | Optional |
| Privacy Policy URL | — | **Required** |

**App icon**: 1024×1024 PNG, no alpha channel, no rounded corners (Apple applies
them), no transparency.

**Screenshots**: As of 2026 you only supply the largest size in each device
family and App Store Connect scales down. For iPhone that is the 6.9-inch class
(1320×2868, 1290×2796, or 1260×2736 portrait depending on source device); a
6.5-inch set is also accepted. If the app supports iPad, a 13-inch iPad set is
required separately (2064×2752 or 2048×2732) — iPhone screenshots do not satisfy
the iPad requirement. Dimensions must match exactly; one pixel off is rejected by
the uploader.

Screenshots must show actual app content. Pure marketing frames with no UI get
flagged. Screenshots must not reference other mobile platforms.

**Metadata rejections (2.3)** happen when the description, screenshots, or
preview video promise functionality the app does not have, reference unreleased
features, or mention competitors and other platforms.

## 4. Account deletion — Guideline 5.1.1(v)

Required since 30 June 2022 for **any app that supports account creation**.

What satisfies it:
- A discoverable control inside the app that initiates deletion. Settings or
  profile is the expected location.
- Actual deletion of the account and associated data, not deactivation or
  suspension.
- A flow the reviewer can complete during review.

What does not satisfy it:
- "Email support@ to delete your account."
- A link that dumps the user on a generic web contact form.
- Deactivation that preserves the account.
- Deletion buried behind a support chat.

Nuances:
- Apps in highly regulated fields (banking, healthcare, some government
  services, and — since November 2025 — crypto exchanges) may be permitted to
  require an additional step, such as directing the user to a regulated channel,
  under 5.1.1(ix). This is an exception with a high bar, not a general escape
  hatch. Apps claiming it should explain the regulatory basis in review notes.
- A temporary hold period before permanent deletion is acceptable if disclosed
  to the user.
- Completing deletion in a web view launched from the app has been accepted in
  practice, but a fully in-app flow is lower risk.
- If the app uses Sign in with Apple, deletion must also revoke the Sign in with
  Apple token. Failing to do this leaves a dangling association. Apple documents
  this in TN3194.

**Design note:** the button is never the hard part. The hard part is deciding
what cascades, what must be retained for legal or fraud reasons, and how a
retention period is disclosed. Retrofitting this into a schema with foreign keys
everywhere is genuinely painful. Design it before the schema hardens.

## 5. Privacy

**5.1.1(i) — Privacy policy.** Required for every app. Must be live, public, and
accurate. Must be linked both in App Store Connect and inside the app. A policy
that doesn't mention a data type the app actually collects fails.

**5.1.1(iii) — Data minimization.** The app may not require data it doesn't need
for its core function. Asking for birthdate, full name, or city at signup when
the app doesn't use them is a common trigger, and enforcement tightened in 2026.
Optional fields should be visibly optional.

**5.1.1(ii) — Permission strings.** Every `NS*UsageDescription` must explain the
actual reason in plain language. "This app needs camera access" fails; "Used to
scan receipt barcodes" passes. A missing string causes a crash on first use,
which then also fails 2.1.

**5.1.2(i) — Third-party sharing, including AI.** Clarified in November 2025:
you must clearly disclose where personal data will be shared with third parties,
including third-party AI, and obtain explicit permission before doing so. If the
app sends user text, images, or documents to an external model provider, that
needs disclosure and consent — not a line buried in the policy.

**App Privacy labels.** Completed in App Store Connect. Must cover data
collected by every SDK, not just first-party code. Analytics, crash reporting,
attribution, and ad SDKs all collect things that must be declared.

**App Tracking Transparency.** If the app accesses the IDFA or tracks users
across apps and websites owned by other companies, it must call
`AppTrackingTransparency` and respect the answer. Collecting an identifier for
tracking before or despite a denial is a hard rejection and an account-level
risk.

**Sign in with Apple — 4.8.** If the app offers third-party or social login
(Google, Facebook, and similar) as a primary login option, it must also offer an
equivalent privacy-preserving option. Sign in with Apple satisfies this. Email-
and-password-only apps are not affected.

## 6. Subscriptions and payments

**3.1.1 — In-app purchase.** Digital goods and services consumed inside the app
must use Apple's IAP. Physical goods and real-world services must not. The line
is occasionally subtle: a fitness app selling a training plan is digital; the
same app selling a water bottle is physical.

Regional exceptions have opened up — the US storefront permits external links
and calls to action following a 2025 court decision, the EU permits alternative
payments under DMA-driven terms effective 1 October 2026, and Japan and Brazil
have their own regimes. These are regional carve-outs with their own terms and
fees, not a general relaxation. The global default is unchanged.

**3.1.2 — Auto-renewable subscriptions.** This causes repeat rejection loops
more than any other business rule. The requirements are duplicated across two
places and people usually satisfy only one.

Required **in the binary**, on the purchase screen itself:
- Title of the subscription
- Length of the subscription period
- Price, and price per unit where relevant
- Functional link to the privacy policy
- Functional link to the Terms of Use (EULA)

Required **in App Store Connect metadata**:
- Privacy policy in the Privacy Policy field
- Terms of Use (EULA) either in the App Description or in the custom EULA field

If you use Apple's standard EULA, put a link to it in the App Description. If you
have your own terms, paste them into the custom License Agreement field in App
Store Connect. Having the links only on the paywall, or only in the description,
produces the same rejection message either way.

The displayed price must match App Store Connect exactly, including currency
formatting. The billed amount must be the most prominent pricing element on the
paywall — burying the real price under a "free trial" headline fails.

**Terms of Service generally.** Outside subscriptions and a few regulated
categories, a separate ToS is **not** an App Store requirement. Apple's standard
EULA applies by default. This is one of the most widely repeated false
requirements.

## 7. Design and functionality

**4.2 — Minimum functionality.** The app must do enough to justify existing.
This is the rule Apple uses against web wrappers, brochure apps, and single-
purpose shells that open a URL or a form. A WebView with a native splash screen
is the canonical failure. The fix is genuine native capability: offline
behavior, push notifications, camera or biometrics, share extensions, widgets —
something that could not be a bookmark.

**4.3 — Spam and duplicates.** Fires on apps that duplicate an existing concept
without differentiation, on multiple near-identical bundles from one developer,
and on output that looks templated. Also, since 2026, the guideline covers apps
that are no longer maintained or attracting users. This is the hardest rejection
to recover from, because the reviewer is questioning why the app exists, not
pointing at a bug.

**4.1 — Copycats.** Since November 2025, you may not use another developer's
icon, brand, or product name in your app's icon or name without their approval.

**4.7 — Mini apps and embedded software.** HTML5/JavaScript mini apps and mini
games are in scope. Apps hosting software not embedded in the binary may not
expose native platform APIs to that software without Apple's permission, and
must provide age-restriction mechanisms for hosted content.

**2.5.2 — Executing un-reviewed code.** The app may not download and execute
code App Review has not inspected. Relevant to any architecture that ships
JavaScript bundles or plugin systems — see `cross-platform-frameworks.md` for
how this interacts with over-the-air updates.

**4.0 — Design quality.** Unfinished UI, non-standard navigation, low-resolution
assets, and layouts that break on specific screen sizes get flagged. Reviewers
test on real hardware, often an older or smaller device than the developer used.

## 8. User-generated content and age

**1.2 — UGC.** Apps with user-generated content need a content filter, a
mechanism to report objectionable content, the ability to block abusive users,
published contact information, and a stated commitment to act on reports
promptly. "Report" and "Block" are not optional features. As of February 2026,
apps with random or anonymous chat are explicitly in scope for this guideline.

**1.2.1(a) — Creator apps.** Must let users identify content that exceeds the
app's age rating, and must gate access by verified or declared age.

**Age ratings.** Apple rebuilt the system in 2025–26, adding 13+, 16+, and 18+
to the existing 4+ and 9+. Answering the questionnaire is mandatory — unanswered
questions block update submissions. Newer additions cover in-app controls,
capabilities, medical and wellness topics, violent themes, and (since July 2026)
social media capabilities, which feed the Time Allowances feature parents use to
limit app time by category.

AI assistants and chatbots count toward content frequency for rating purposes.
An app whose model can produce mature content needs a rating that reflects that.

Region-specific ratings exist and shift: Korea (GRAC), Brazil, Australia,
Vietnam each have their own values and their own periodic adjustments.

**Kids Category (1.3).** Stricter: no third-party analytics or advertising
beyond contextual, no external links or purchases without a parental gate, and
compliance with children's privacy law worldwide.

**Regulated medical device apps.** Since March 2026, apps in Health & Fitness or
Medical categories, or flagged for frequent medical/treatment references, must
declare regulated-medical-device status in App Store Connect to distribute in the
EEA, UK, or US. New apps need it now; existing apps must declare by early 2027 or
lose the ability to submit updates.

## 9. Review notes and demo access

Guideline 2.1 rejections are the single largest category, and a meaningful share
are avoidable with better review notes.

- Provide working demo credentials for anything behind a login. Verify them the
  day you submit. Expired or rate-limited test accounts read as a broken app.
- If login requires SMS or an authenticator, the reviewer cannot receive it.
  Provide a bypass account, a fixed test OTP, or a fully featured demo mode.
- Keep backend services live through the entire review window, including staging
  dependencies the app touches.
- Guideline 2.3.1 requires new features and product changes to be described with
  specificity in Notes for Review. Generic descriptions can be rejected on their
  own.
- If a feature is hard to find, say where it is. Reviewers do not hunt.
- For anything that has been rejected before, explain what changed and where to
  verify it. Resolution Center replies are read by humans.
