# Mobile App Pre-Submission Checklist

For iOS (App Store) and Android (Google Play). Works for native, React Native /
Expo, Flutter, and Ionic / Capacitor.

Policy state: **September 2026**. Items marked ⏱ change on a fixed annual
schedule — re-verify those every release. Items marked ⚖️ are legal obligations
enforced by regulators, not by store review; the stores will not catch them for
you.

Copy this into your repo. Work through it per release, not per project.

---

## Phase 0 — Before you write code

These are architecture decisions, painful to reverse later.

- [ ] Decided whether the app will have user accounts. If yes, account deletion
      is now a requirement — design the cascade before the schema hardens.
- [ ] Decided what deletion means: which rows cascade, what must be retained for
      legal or fraud reasons, and how long any retention period lasts.
- [ ] Decided whether digital goods will be sold. If yes, platform billing is
      mandatory and revenue share is ~15–30%. This affects the business model,
      not just the code.
- [ ] Listed which markets you will ship to. EU, UK, and US each attach
      obligations. See Phase 6.
- [ ] Listed every SDK you intend to include and what each one collects.
- [ ] Decided whether children are in the target audience. If yes, a much
      stricter regime applies (Apple Kids Category, Google Families policy,
      COPPA) and it constrains which SDKs you may use at all.
- [ ] If the app is a WebView wrapper: confirmed it has enough native capability
      to survive Apple Guideline 4.2, or accepted that it will not ship to the
      App Store.

## Phase 1 — Accounts and program setup

Start this 4–6 weeks before you intend to ship. Most of it is waiting.

**Apple**
- [ ] Apple Developer Program membership active (USD 99/yr).
- [ ] Chosen Individual vs Organization. Individual publishes under your legal
      name, publicly, and cannot be changed later without transferring the app.
- [ ] Organization only: D-U-N-S number obtained and verified.
- [ ] Bundle ID registered. It is permanent.
- [ ] Signing certificates and provisioning profiles in place, including on CI.

**Google**
- [ ] Play Console account created (USD 25 one-time).
- [ ] Identity verification completed. Do not leave this to submission day.
- [ ] Organization only: D-U-N-S obtained (2–4 weeks).
- [ ] ⏱ Package name registered in Play Console for Android developer
      verification. Check the Console home page — do not assume auto-registration
      covered you.
- [ ] Personal accounts created after 13 Nov 2023: closed test running with **12+
      testers opted in continuously for 14 days** before applying for production
      access. Start this as soon as you have an installable build.
- [ ] Play App Signing configured; upload key backed up separately.

## Phase 2 — Build and toolchain

**iOS**
- [ ] ⏱ Built with the currently required Xcode and SDK. As of Sept 2026: Xcode 26
      / iOS 26 SDK. From April 2027: iOS 27 SDK. CI runner images updated too.
- [ ] Deployment target set deliberately (separate from the build SDK).
- [ ] UI regression tested — a new SDK can change native control appearance.
- [ ] `PrivacyInfo.xcprivacy` present at app level, declaring every required-reason
      API. Check `NSPrivacyAccessedAPICategoryUserDefaults` specifically; almost
      every app triggers it.
- [ ] Every dependency that needs its own privacy manifest has one.
- [ ] `ITSAppUsesNonExemptEncryption` set in Info.plist.
- [ ] Every `NS*UsageDescription` written in plain language explaining the real
      reason. A missing one crashes on first use.
- [ ] Bitcode/architecture settings correct; watchOS targets include 64-bit.

**Android**
- [ ] ⏱ `targetSdkVersion` meets the current floor. As of 31 Aug 2026: API 36
      (Android 16) for new apps and updates.
- [ ] Android App Bundle (.aab), not APK.
- [ ] 64-bit support for all native code.
- [ ] ⏱ 16 KB page size support verified in Play Console's App Bundle Explorer.
      Requires AGP 8.5.1+ and NDK r28+. **This is the most common blocker for
      React Native and Flutter apps** — one stale dependency blocks the release.
- [ ] Built `AndroidManifest.xml` inspected (not the config file) for permissions
      injected by plugins you didn't ask for.

**Both**
- [ ] App runs on the oldest and smallest device in your support matrix.
- [ ] First-launch flow tested on a clean install with no network, then with a
      slow network.
- [ ] Bundle size within platform limits; asset thinning / bundle splitting on.

## Phase 3 — The universal gates

- [ ] **Privacy policy live** at a public, non-geofenced, non-login URL.
- [ ] Privacy policy actually describes what the app collects, including every
      third-party SDK.
- [ ] Privacy policy linked in App Store Connect **and** inside the app.
- [ ] Privacy policy linked in Play Console **and** inside the app.
- [ ] **If the app creates accounts:** in-app deletion control, discoverable from
      settings or profile, that actually deletes rather than deactivates.
- [ ] **If the app creates accounts:** web URL where deletion can be requested
      without reinstalling, entered in the Google Data safety form.
- [ ] Deletion flow completable by a reviewer during review.
- [ ] If using Sign in with Apple: deletion also revokes the Sign in with Apple
      token.
- [ ] Retention period, if any, disclosed to the user before they confirm.

## Phase 4 — Declarations

Write these first, then make the code conform. Both stores reject on mismatch,
and mismatch — not collection — is the usual problem.

**Apple**
- [ ] App Privacy labels completed, covering all SDK-collected data.
- [ ] Age rating questionnaire answered in full, including the 2025–26 additions
      (in-app controls, capabilities, medical/wellness, violence, social media
      capabilities). Unanswered questions block update submissions.
- [ ] AI features factored into the age rating if a model can produce mature
      content.
- [ ] Health & Fitness / Medical apps: regulated-medical-device status declared
      for EEA / UK / US.

**Google** — all of Policy → App content:
- [ ] Data safety form completed, including for apps that collect nothing.
- [ ] Data safety form consistent with the privacy policy, line by line.
- [ ] Content rating questionnaire submitted.
- [ ] Ads declaration.
- [ ] App access instructions / credentials.
- [ ] Target audience and content.
- [ ] Any applicable category declaration: news, financial features, health,
      government.
- [ ] Permissions Declaration Form submitted for any sensitive permission, with
      demo video where required.

## Phase 5 — Store listing

**Apple**
- [ ] Name ≤30 chars, subtitle ≤30, keywords ≤100, description ≤4000.
- [ ] Icon 1024×1024 PNG, no alpha, no rounded corners.
- [ ] Screenshots: 6.9" iPhone set (1320×2868 / 1290×2796 / 1260×2736). Exact
      dimensions — one pixel off is rejected.
- [ ] 13" iPad set (2064×2752 or 2048×2732) if the app supports iPad. iPhone
      screenshots do not satisfy this.
- [ ] Screenshots show real app content, not marketing-only frames.
- [ ] Support URL live.
- [ ] No references to other platforms, competitors, or unreleased features.

**Google**
- [ ] Title ≤30 chars, short description ≤80, full description ≤4000.
- [ ] Icon 512×512 32-bit PNG with alpha, ≤1024 KB, no rounded corners added.
- [ ] Feature graphic 1024×500.
- [ ] 2–8 phone screenshots, ≥1080 px short side, 16:9 or 9:16.
- [ ] 4+ tablet screenshots if tablet support is declared.
- [ ] No keyword stuffing, fake urgency, or trademark misuse.

## Phase 6 — Legal and regional ⚖️

Neither store checks most of these at review. Regulators do.

- [ ] **EU:** DSA trader status declared and verified in App Store Connect and
      Play Console. Apps without it are removed from EU storefronts.
- [ ] **EU:** GDPR lawful basis identified per processing purpose.
- [ ] **EU:** consent mechanism for non-essential tracking — freely given,
      specific, as easy to withdraw as to give.
- [ ] **EU:** international transfer mechanism in place if data leaves the EEA
      (including to a US-hosted AI provider).
- [ ] **EU:** Article 27 representative appointed if you have no EU
      establishment but target EU users.
- [ ] **EU Accessibility Act** — if the app is in a covered category
      (e-commerce, banking, e-books, transport booking, telecoms, AV media):
      conforms to EN 301 549 / WCAG 2.1 AA, accessibility statement published.
      Enforceable since 28 June 2025.
- [ ] **Accessibility basics regardless:** screen reader labels on every
      interactive element, dynamic type, 4.5:1 contrast, 44pt/48dp touch targets,
      no meaning conveyed by color alone. Tested manually with VoiceOver and
      TalkBack.
- [ ] **Minors:** age assurance implemented if required in your markets (Texas,
      Utah, Louisiana, Australia, Brazil, Singapore, Vietnam, EU/UK).
- [ ] **Regulated category:** licensing verified per market for finance,
      lending, crypto, gambling, health, or pharmacy.
- [ ] **AI features:** users told they are interacting with an AI system;
      third-party sharing disclosed with explicit consent before first transfer.

## Phase 7 — Submission

- [ ] Demo credentials created fresh and **verified working today**.
- [ ] Bypass path provided for SMS/OTP/2FA that a reviewer cannot complete.
- [ ] All backend services live and staying live through the review window.
- [ ] Feature flags default-on for the reviewed build.
- [ ] IAP products submitted alongside the binary; purchase flow tested in
      sandbox on a real device.
- [ ] Review notes describe new features **with specificity** — generic notes
      can be rejected on their own.
- [ ] Navigation path documented for anything hard to find, especially the
      account deletion control.
- [ ] Subscriptions only: title, length, price, privacy policy link, and Terms of
      Use link all present **on the paywall**; privacy policy in the App Store
      Connect field; Terms of Use in the App Description or custom EULA field.
      Both halves, not one.
- [ ] Displayed price matches App Store Connect exactly, including currency
      formatting; billed amount is the most prominent pricing element.

## Phase 8 — After submission

- [ ] Someone is monitoring the review inbox and Resolution Center daily.
- [ ] Rollout plan decided: staged (Android) or phased release (iOS).
- [ ] Crash monitoring live before rollout widens.
- [ ] Calendar reminders set for the next ⏱ deadlines:
      - Apple SDK floor — typically enforced each April
      - Google target API floor — typically enforced each 31 August
      - Any dated policy deadline currently open for your app

---

## Verify against primary sources

Everything above drifts. Before trusting a version number or a date:

- Apple dated requirements — `developer.apple.com/news/upcoming-requirements/`
- Apple review guidelines — `developer.apple.com/app-store/review/guidelines/`
- Google policy deadlines —
  `support.google.com/googleplay/android-developer/table/12921780`
- Google target API — `developer.android.com/google/play/requirements/target-sdk`
