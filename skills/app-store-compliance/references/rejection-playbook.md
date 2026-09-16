# Rejection playbook

Diagnosis and fix for the rejections that actually occur. Roughly a quarter of
App Store submissions are rejected, and a large share are approved after a fix —
a rejection is a round trip, not a verdict.

**First step, always: get the exact guideline number including the subletter.**
Apple's 5.1.1(i), 5.1.1(iii), and 5.1.1(v) share a number and have nothing in
common as fixes. If someone reports "rejected for 5.1.1," ask for the full
notice before advising.

---

## Apple

### 2.1 — Performance / App Completeness

The largest rejection category by volume. The reviewer opened the app and it did
not work.

| Symptom in the notice | Likely cause | Fix |
|---|---|---|
| "crashed on launch" | Device-specific crash, missing permission string, cold-start race | Test on the exact device named. A missing `NS*UsageDescription` crashes on first permission use |
| "unable to sign in" | Dead demo credentials, SMS OTP the reviewer can't receive, rate limiting, IP geo-blocking | Fresh credentials verified the day of submission; bypass account or fixed test OTP; allowlist review traffic |
| "feature did not respond" | Backend down, staging dependency, feature-flagged off | Keep all services live through the review window. Check flags default-on for the review build |
| "in-app purchase did not complete" | IAP products not submitted with the binary, sandbox misconfiguration | Submit IAP products alongside the build. Test in sandbox on a real device |
| "we were unable to locate [feature]" | Feature exists but is not discoverable | Say exactly where it is in review notes with a screenshot |

Also: 2.3.1 requires new features to be described *with specificity* in Notes for
Review. A generic description alone can cause rejection.

### 2.3 — Inaccurate metadata

Description, screenshots, or preview show features that don't exist, reference
unreleased functionality, mention competitors or other platforms, or stuff
keywords. Fix by aligning the listing with the shipped build. Screenshots showing
a feature behind a flag count as inaccurate.

### 3.1.1 — In-app purchase

Digital goods sold outside Apple's IAP. Fix: route digital goods through IAP, or
establish that the goods are physical or a real-world service. Regional
exceptions (US external links, EU alternative payments, Japan, Brazil) have their
own terms and do not apply globally.

### 3.1.2 — Subscriptions

The most common repeat-rejection loop. The notice specifies whether the missing
item is in the **binary** or the **metadata** — read which one.

Binary, on the purchase screen: subscription title, length, price (and per-unit
price where relevant), functional link to privacy policy, functional link to
Terms of Use.

Metadata: privacy policy in the App Store Connect Privacy Policy field; Terms of
Use either as a link in the App Description or in the custom EULA field.

If using Apple's standard EULA, a link to it in the App Description satisfies the
metadata half. Satisfying only the paywall, or only the description, produces the
same message. Also check: displayed price exactly matches App Store Connect, and
the billed amount is the most prominent pricing element on the paywall.

### 4.2 — Minimum functionality

The app is a web wrapper or too thin to justify a store listing. This is a
structural rejection; it is not fixed by resubmitting.

Fix by adding capability that could not exist as a bookmark: offline mode, push
notifications, camera/biometrics/geolocation integration, widgets, share
extensions, background sync. Then explain the native integrations explicitly in
review notes — reviewers do not go looking.

Highest risk for Ionic/Capacitor apps. See `cross-platform-frameworks.md`.

### 4.3 — Spam / duplicate

The reviewer is questioning why the app exists. The hardest rejection to
overcome. Fix by differentiating substantively — distinct feature set, original
content, an underserved niche — and arguing the case in Resolution Center. Also
fires on multiple near-identical bundles from one developer; consolidate them
into one app with configuration instead.

Since 2026 this guideline also reaches apps that are no longer maintained or
attracting users.

### 4.8 — Login services

Third-party or social login offered without an equivalent privacy-preserving
option. Fix: add Sign in with Apple. Does not apply to email-and-password-only
apps.

### 5.1.1(i) — Privacy policy

Missing, unreachable, behind a login, geo-blocked, or doesn't disclose something
the app collects. Fix: live public URL, linked in both App Store Connect and
inside the app, listing every data point and every third-party SDK that receives
data.

### 5.1.1(iii) — Data minimization

Requiring data the app doesn't need — birthdate, full name, city, phone — at
signup. Enforcement tightened in 2026. Fix: make non-essential fields optional
and visibly so, or remove them.

### 5.1.1(v) — Account deletion

No in-app deletion, or deletion that is really deactivation, or deletion routed
through an email to support. Fix: a discoverable in-app control that actually
deletes. If the app uses Sign in with Apple, also revoke the token on deletion.

### 5.1.2(i) — Third-party data sharing

Sharing personal data without clear disclosure and explicit permission,
including with third-party AI providers. Fix: disclose the specific recipient and
purpose, obtain consent before the first transfer, update the privacy policy and
App Privacy label.

### Privacy manifest failures

Upload rejected before human review. The message names the API category. Most
often `NSPrivacyAccessedAPICategoryUserDefaults`. Fix: add or complete
`PrivacyInfo.xcprivacy` at app level, and update any dependency that lacks its
own.

### 1.2 — User-generated content

Missing moderation infrastructure. Fix: content filtering, a report mechanism, a
block mechanism, published contact info, and a stated commitment to act on
reports. Since February 2026 this explicitly covers random and anonymous chat.

### SDK / build rejections

Rejected at upload with a version message. Fix: rebuild with the current required
Xcode and SDK. Check CI runner images, not just local machines.

---

## Google Play

### App rejected — Data safety inaccuracy

The form does not match observed behavior. Fix: audit every SDK, correct the
form, ensure the privacy policy agrees. Repeated inaccuracy escalates to
suspension.

### App rejected — Permissions

A high-risk permission without an approved declaration, or a permission with no
demonstrated core-functionality need. Fix: remove the permission if possible; if
not, complete the Permissions Declaration Form with a clear core-functionality
justification and, for location or accessibility, a demo video.

Note the release-blocking behavior: a pending permissions declaration prevents
publishing *any* change to the app, including store listing edits. If a hotfix is
urgent, ship a build with the permission removed.

### Update blocked — target API level

Below the current floor. Fix: raise `targetSdkVersion` and re-test the behavior
changes that version introduced. An extension may be available in Play Console.

### Update blocked — 16 KB page size

Play Console reports "Memory page size: does not support 16 KB" and names the
offending `.so` files. Fix: AGP 8.5.1+, NDK r28+, update or replace the named
libraries. There is no configuration workaround — the library itself must be
rebuilt.

### App removed — package not registered

Package name not registered for Android developer verification. Fix: register in
Play Console. Check the Play Console home page rather than assuming
auto-registration covered you.

### Production access denied

The closed test did not satisfy the 12-tester/14-day requirement, or tester
engagement was judged insufficient. Fix: real testers on real devices using real
features over the full window. Meeting the numeric threshold makes you eligible
to apply; it does not guarantee approval. Shipping updates during the test based
on tester feedback is what Google wants to see.

### Metadata policy violation

Keyword stuffing, fake urgency, misleading claims, trademark misuse, or
references to other stores. Fix: rewrite the listing.

### Account suspension / termination

A different severity class. Common causes: repeated policy violations, deceptive
behavior, malware in a bundled SDK, accessibility-service abuse, or fake
engagement. Appeals exist and are worth filing promptly with specific evidence,
but the bar is high. Treat any policy warning email as urgent rather than
informational.

---

## Writing a Resolution Center or appeal reply

Humans read these. A good reply:

1. States plainly what was changed, or why the app already complies.
2. Gives the exact navigation path to the relevant screen —
   "Profile → Settings → Delete Account" — and a screenshot if useful.
3. Provides fresh credentials if the previous ones were the problem.
4. Addresses the specific subletter cited, not the general area.
5. Stays factual. Arguing about fairness does not move reviewers; a clear
   demonstration of compliance does.

If the rejection appears to be a factual error by the reviewer, say so calmly
with evidence rather than resubmitting an unchanged build. A resubmission with no
explanation usually gets the same result from a different reviewer.
