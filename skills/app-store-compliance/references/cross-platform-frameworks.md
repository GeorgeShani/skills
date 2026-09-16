# Cross-platform frameworks

The store rules are identical regardless of framework. What differs is *which*
rules a given framework is likely to fall foul of, and how the fix is applied.

Read the section that matches the stack in use.

---

## The two framework-specific risks

Almost everything framework-specific reduces to one of these:

**1. Native library compliance (Android).** Google's 16 KB page-size requirement
and 64-bit requirement apply to every `.so` file in the bundle. Cross-platform
apps ship many native libraries via dependencies, most of which the developer
never chose deliberately. One unmaintained package blocks the whole release.

**2. Minimum functionality and executing un-reviewed code (iOS).** Apple's 4.2
and 2.5.2 exist partly to filter thin web wrappers and runtime-loaded code. How
exposed you are depends heavily on the framework's rendering model.

---

## React Native and Expo

**Android 16 KB alignment.** React Native itself has shipped compatible versions
since 2025, but individual community packages lag. The libraries that have
historically caused problems are PDF viewers, image processing, video players,
SQLite wrappers, ML/vision packages, and older maps SDKs. Play Console's App
Bundle Explorer names the exact `.so` files — start there rather than auditing
`package.json` by hand.

Fix order: upgrade React Native → upgrade the offending package → check whether
the maintainer has an open issue → replace the package. There is no workaround
short of removing or rebuilding the library.

**iOS privacy manifests.** Every native module that touches a required-reason
API needs a `PrivacyInfo.xcprivacy`. Mature packages ship one; abandoned ones do
not. `react-native-async-storage` and anything wrapping `UserDefaults` is the
usual culprit. You also need your own app-level manifest declaring the app's own
usage — including `NSPrivacyAccessedAPICategoryUserDefaults`, which nearly every
RN app triggers indirectly.

**Expo specifics.**
- EAS Build handles Xcode and SDK versions for you, which means the *real*
  compliance action is staying on a recent Expo SDK. An Expo SDK that predates
  Apple's current minimum Xcode cannot produce an acceptable upload.
- `app.json` / `app.config.js` is where `infoPlist` usage descriptions and
  Android permissions are declared. Config plugins from dependencies inject
  permissions you did not ask for. Build, then inspect the generated
  `AndroidManifest.xml` and `Info.plist` before submitting — not the config.
  Phantom permissions from a plugin cause Google permission-declaration blocks
  that are baffling until you look at the built manifest.
- **Expo Updates / OTA and Guideline 2.5.2.** Apple permits JavaScript bundle
  updates that do not change the app's primary purpose, add features outside
  what was reviewed, or change the app in ways review would have caught. Bug
  fixes and content updates are fine. Shipping a new feature or a different
  monetization flow over the air is not, and doing it is an account-level risk,
  not a rejection. Treat OTA as a patch channel, not a release channel.
- Expo Go is not a distribution mechanism. Store builds must be standalone.

**Minimum functionality.** RN apps render native components, so a real RN app
rarely trips 4.2 on rendering grounds. It trips it on *thinness* — an app that
only fetches and displays remote content is exposed regardless of framework.

---

## Flutter

**Android 16 KB alignment.** Flutter has shipped compatible versions, but the
Flutter engine plus plugins means several `.so` files per build. Plugins wrapping
native SDKs (payments, maps, ML Kit, video, database engines like ObjectBox or
Realm) are the usual laggards. Same diagnosis path: App Bundle Explorer names
the file.

**iOS privacy manifests.** Flutter's own manifest is handled by the framework on
recent versions. Plugins are your responsibility to audit. `shared_preferences`
and any plugin touching file timestamps or disk space needs declarations.

**Gradle and AGP.** Flutter projects often carry an older AGP than the 8.5.1
minimum for 16 KB alignment. Upgrading AGP in a Flutter project frequently
cascades into Kotlin version and Gradle wrapper upgrades. Budget more time than
the one-line change suggests.

**Minimum functionality.** Flutter renders its own widgets rather than native
controls. This is not itself a violation, but it raises the chance of a 4.0
design-quality flag if the UI ignores platform conventions — non-standard
navigation, wrong back-button behavior, iOS screens that look like Android.
Using Cupertino widgets on iOS and respecting platform navigation patterns is
worth the effort specifically for review.

**Accessibility.** Flutter's custom rendering means semantic labels must be
supplied explicitly via `Semantics` widgets. Screen readers get nothing useful
otherwise. This matters for the EU Accessibility Act if the app is in scope —
see `legal-and-regional.md`.

---

## Ionic, Capacitor, and Angular

**This stack carries the highest Guideline 4.2 risk of the three.** Ionic renders
in a WebView. If the app is substantially a wrapper around an existing website,
Apple will reject it, and no amount of polish changes that. This is the single
most important thing to tell someone choosing Ionic for a store-bound app.

What moves an Ionic app out of the danger zone:
- Offline functionality that works with no network.
- Push notifications.
- Native device capability actually integrated: camera, biometrics, geolocation,
  Bluetooth, health data, file system, share sheets.
- Home screen widgets, App Clips, Siri shortcuts, or equivalent.
- Content and workflows that do not exist on the website.

What does not help:
- A native splash screen over the same web content.
- A bottom tab bar that navigates between the same web pages.
- A slightly restyled mobile site.

If the honest answer is "it's our website in an app," the choice is to build
real native capability or not ship to the App Store. Google Play is more
permissive here, but Google's own policy 4.3 enforcement on webview apps has
tightened.

**Capacitor plugin permissions.** Same phantom-permission problem as Expo:
plugins inject entries into `AndroidManifest.xml` and `Info.plist`. Inspect the
built native projects, not the config.

**16 KB alignment** applies to Capacitor's native plugins too, though the surface
is usually smaller than RN or Flutter.

**Angular-specific:** nothing store-relevant. Angular is the web layer; the
store cares about the Capacitor shell.

---

## Framework-agnostic traps

**Bundle size.** Apple enforces cellular-download thresholds and per-architecture
uncompressed limits. Cross-platform apps are heavier by default. Enable
Android's App Bundle splitting and iOS app thinning; strip unused assets and
locales.

**Analytics and crash SDKs.** Every framework's default template tends to
include something. Whatever it is, it must appear in the App Privacy label, the
Data safety form, and the privacy policy. The most common "we collect no data"
mistake is an app that ships Firebase Crashlytics.

**Deep links and universal links.** Misconfigured association files
(`apple-app-site-association`, `assetlinks.json`) don't cause rejection but do
cause reviewer-visible broken flows that get logged as 2.1 bugs.

**Test on the reviewer's device, not yours.** Reviewers frequently use older or
smaller hardware. Cross-platform apps degrade on low-end Android and older iPhone
SE-class devices more than native ones. Run the first-launch flow on the oldest
device in your support matrix before submitting.
