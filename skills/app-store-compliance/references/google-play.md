# Google Play

Policy state as of September 2026. Verify version numbers and dates against
`support.google.com/googleplay/android-developer/table/12921780` before relying
on them.

## Contents

1. Account setup and the gates before production
2. Build and packaging requirements
3. App content declarations
4. Data safety and account deletion
5. Permissions policy
6. Store listing assets
7. Category-specific policies

---

## 1. Account setup and the gates before production

**Developer account**: USD 25, one-time. Personal or Organization.

**Identity verification** is mandatory. Personal accounts verify with government
ID; organization accounts need a D-U-N-S number and take 2–4 weeks. Do this well
before you intend to ship, not on submission day.

**The 12-tester gate.** Personal accounts created after 13 November 2023 must run
a closed test with at least 12 testers opted in *continuously* for the preceding
14 days before they can even apply for production access. Then Google reviews
the application, typically within 7 days.

Details that trip people up:
- The 14-day window is measured backwards from the moment you apply. It is not
  "14 days at some point" — it is the most recent 14 days, unbroken.
- "Opted in" means the tester clicked your opt-in link and joined through the
  Play Store. An email address sitting in your tester list that never clicked
  does not count.
- It applies **per app**. Testers carry over as people; opt-ins do not.
- Emulators, duplicate accounts, and bot farms are detected via Play Integrity
  and behavioral signals. Using them risks permanent account suspension.
- Organization accounts verified with a D-U-N-S number are exempt. For a solo
  developer the tradeoff is real: 2–4 weeks of business verification versus ~3
  weeks of closed testing. Neither is fast.
- The number was 20 until December 2024. Guides saying 20 are stale.

Practical planning: a first Android release from a new personal account is a
**three-to-four week** process minimum, most of it waiting. Start the closed
test as soon as you have something installable, not when the app is finished.

**Package name registration.** Effective 30 September 2026, all Play packages
must be registered to meet Android developer verification requirements, and
unregistered apps are removed from Play. Around 99% of existing apps were
auto-registered in March 2026, but check the Play Console home page rather than
assuming. Registration binds a package name to one developer account and to the
SHA-256 fingerprint of its signing key.

Separately, from 30 September 2026, apps installed on certified Android devices
in Brazil, Indonesia, Singapore, and Thailand must be registered to a verified
developer regardless of distribution channel — Play, another store, or a direct
APK. Global rollout is stated for 2027. Local `adb install` for development is
unaffected. The practical exposure for most teams is not the Play build but the
**gap in between**: APKs handed to QA over a link, beta distribution services,
and client demo builds.

## 2. Build and packaging requirements

**Android App Bundle (.aab)** is required for new apps. Play App Signing manages
the app signing key; you keep the upload key. Losing the upload key is
recoverable; understand the distinction before you generate them.

**Target API level.** From 31 August 2026, new apps and updates must target
Android 16 (API 36) or higher. Existing apps must target Android 15 (API 35) or
higher to remain available to new users on devices running a newer OS than the
app targets. An extension to 1 November 2026 is available through Play Console.
This ratchets every August — expect a new floor annually.

Note the asymmetry: falling behind doesn't remove your app, it makes it
invisible to new users on newer devices, which is a slow, quiet failure rather
than a loud one.

**64-bit** support required for any app with native code.

**16 KB page sizes.** Since 1 November 2025, all new apps and updates targeting
Android 15+ must support 16 KB memory page sizes on 64-bit devices. Pure
Kotlin/Java apps are compliant automatically. Anything shipping `.so` files is
not automatically compliant.

To comply:
- Android Gradle Plugin 8.5.1 or higher, NDK r28 or higher.
- Rebuild native libraries with 16 KB ELF alignment.
- Update third-party SDKs that ship native code.
- Verify in Play Console's App Bundle Explorer, which names the specific
  offending `.so` files.

This is the single most common technical blocker for React Native and Flutter
apps, because both ship a lot of native libraries via dependencies. See
`cross-platform-frameworks.md`.

## 3. App content declarations

Everything under **Policy → App content** in Play Console is a release gate, not
paperwork. The app cannot publish — and in some cases cannot publish *any*
change, including store listing edits — until these are complete.

- **Privacy policy URL.** Must be on a secure, accessible, non-geofenced URL.
- **Ads.** Declare whether the app contains ads.
- **App access.** Provide credentials or instructions for anything behind a
  login, same reasoning as Apple's demo account.
- **Content rating.** Completed via questionnaire, issued by official rating
  authorities. Unrated apps are not allowed on Play.
- **Target audience and content.** If children are in the target audience, the
  Families policy applies with substantially stricter rules on ads, SDKs, and
  data collection.
- **Data safety.** See below. Required even for apps that collect nothing.
- **Government apps, news apps, financial features, health apps** each have
  their own declaration. News and magazine apps in particular have been removed
  for failing to self-declare.

Mismatches between a declaration, observed SDK behavior, and the actual
interface create review risk. Google audits the Data safety form against real
traffic.

## 4. Data safety and account deletion

**Data safety form.** Declares, per data type: what is collected, the purpose,
whether it leaves the device, whether it is shared with third parties, whether
it is encrypted in transit, and whether users can request deletion.

Audit every SDK before answering — analytics, advertising, crash reporting,
authentication, payment, push, and support SDKs all collect things. Firebase
alone touches several categories. As of 2026, the User Data requirements
explicitly extend to third-party AI integrations, and the developer remains
responsible for limited use, disclosure, and consent.

The form must be consistent with the privacy policy. Inconsistency is a
suspension risk, not just a rejection risk.

**Account deletion requirement.** If the app enables account creation, you must
provide **both**:

1. An in-app path to delete the account and associated data, readily
   discoverable from within the app.
2. A **web link** where users can request account and data deletion without
   reinstalling the app. This URL goes in the designated field of the Data
   safety form and appears on the store listing.

The web requirement exists because a user who already uninstalled the app has no
in-app route. The page does not need a one-click delete button — it must clearly
explain how to initiate a deletion request, specify what data is deleted versus
retained, and state any additional retention period.

Deactivation does not satisfy this. If you provide partial data deletion without
full account deletion, that needs its own link.

This is stricter than Apple in one respect (the web URL) and looser in another
(Google accepts a web flow where Apple insists on in-app initiation). Build for
Apple's stricter in-app requirement plus Google's web URL and both are satisfied.

## 5. Permissions policy

Request the minimum. Unnecessary or poorly justified permissions are among the
most common rejection causes.

**Permissions Declaration Form.** Triggered automatically during release when
the bundle requests high-risk or sensitive permissions. Until it's addressed,
you cannot publish *any* change to the app, including store listing edits.
Approval can take days. Urgent releases require removing the permission.

Specific policies worth knowing:

- **SMS and Call Log.** The app must be the default handler for SMS, Phone, or
  Assistant. Apps without default-handler capability may not even declare these
  in the manifest, including as placeholder text. As of 2026, account
  verification by phone call is no longer an accepted use case for
  `READ_CALL_LOG` — use the Digital Credentials API or SMS Retriever API
  instead.
- **Photos and videos.** Apps targeting API 33+ may request `READ_MEDIA_IMAGES`
  or `READ_MEDIA_VIDEO` only if the Android Photo Picker is genuinely
  insufficient, and must submit a declaration explaining why.
- **Contacts.** A Contacts Permissions policy was introduced in 2026. Apps that
  don't need broad access must use the Android Contact Picker.
- **Location.** Background location requires a separate declaration and usually
  a demo video. As of 2026, Google recommends the location button as the minimum
  scope for precise location.
- **All files access** (`MANAGE_EXTERNAL_STORAGE`), **package queries**
  (`QUERY_ALL_PACKAGES`), **accessibility services**, **exact alarms**, and
  **`REQUEST_INSTALL_PACKAGES`** each have narrow permitted use cases.
  Accessibility service APIs used for anything other than accessibility is a
  reliable suspension.
- **Foreground services** require a declared type and an approved use case.
  Geofencing was removed as an approved use case in August 2026.

## 6. Store listing assets

| Asset | Spec |
|---|---|
| App title | 30 characters |
| Short description | 80 characters |
| Full description | 4,000 characters |
| App icon | 512×512, 32-bit PNG with alpha, max 1024 KB |
| Feature graphic | 1024×500, JPEG or 24-bit PNG |
| Phone screenshots | Min 2, max 8. JPEG or 24-bit PNG, max 8 MB each, 16:9 or 9:16, minimum 1080 px on the short side |
| Tablet screenshots | Minimum 4 if you declare tablet support |
| Promo video | Optional, YouTube URL |

Do not add rounded corners or drop shadows to the icon — Google applies them.

Metadata policy prohibits keyword stuffing, fake urgency, misleading
performance claims, unauthorized use of trademarks, and references to other
stores or platforms.

Play Console includes free A/B testing for icon, feature graphic, screenshots,
and descriptions. Title changes require a full app update.

## 7. Category-specific policies

These carry extra requirements and disproportionate enforcement:

- **Financial services**: licensing declarations per market. Personal loan apps
  face interest-rate caps and specific disclosure requirements, which vary by
  country and have been tightened repeatedly.
- **Health**: declarations for health-related functionality; restrictions on
  health claims.
- **Gambling and real-money gaming**: licensed only, per-country allowlist.
- **VPN apps**: must use the `VpnService` base and cannot use VPN to collect or
  redirect user traffic for other purposes.
- **Anonymous and random chat**: from August 2026, subject to age-restricted
  content requirements; Families policy prohibits such apps from targeting
  children.
- **Crypto and blockchain**: regional licensing requirements.
- **News**: self-declaration in Play Console, enforced by removal.
- **Device and network abuse, deceptive behavior, malware**: these produce
  account-level termination, not app-level rejection. Third-party SDKs that
  quietly do something the policy forbids make the *developer* liable.
