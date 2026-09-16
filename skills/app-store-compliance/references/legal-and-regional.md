# Legal and regional requirements

These sit outside the store guidelines but are enforced through them — both
stores will remove an app for failing a legal obligation in a market it ships
to. Some are also enforced directly by regulators with fines.

**This is not legal advice.** It is a map of what to ask a lawyer about. Anything
involving children, health data, financial services, or an actual regulatory
notice warrants professional review.

---

## EU Digital Services Act — trader status

Required for App Store distribution in the EU. Apps without verified trader
status are removed from the EU App Store until status is provided and verified.
Google Play has an equivalent requirement.

You declare whether you are a trader (acting for purposes relating to your trade
or profession) and, if so, provide contact details and a registration number,
which appear publicly on the product page.

Selling anything, running ads, or operating commercially generally makes you a
trader. A genuinely free hobby app with no monetization generally does not.
Getting this wrong in either direction has consequences: false non-trader
declarations violate the DSA; unnecessary trader declarations publish your home
address if you're an individual.

Applies regardless of where the developer is based. A developer in Georgia,
India, or the US shipping to EU storefronts is in scope.

## EU Accessibility Act (Directive 2019/882)

Enforceable since **28 June 2025**. Extends accessibility obligations to the
private sector.

**In scope:** e-commerce, consumer banking, e-books, electronic communications,
transport booking (air, bus, rail, waterborne), audiovisual media access
services, and the consumer-facing digital services supporting them.

**Technical standard:** EN 301 549, which incorporates WCAG 2.1 Level AA and
adds native-app-specific requirements beyond it. Version 4.1.1 (incorporating
WCAG 2.2) was published in September 2026; check whether it has been cited in
the Official Journal before treating it as the operative version.

**Extraterritorial.** Any company placing covered products or services on the EU
market must comply, regardless of where it is headquartered.

**Exemptions:** microenterprises — under 10 employees *and* under €2 million
turnover — have limited exemptions. Most funded startups do not qualify.
Services contracted before 28 June 2025 have until 28 June 2027; some existing
services have until 2030.

**Enforcement:** per member state. France (ARCOM, DGCCRF), Germany (Federal
Network Agency, penalties up to €100,000 per violation), Italy (AGID), the
Netherlands (ACM), Sweden and Denmark all have active programs. Early enforcement
has favored remediation over immediate fines, but escalation is built in.

**Practical minimum for a mobile app:**
- Screen reader support with meaningful labels on every interactive element.
  In Flutter this means explicit `Semantics` widgets; in React Native,
  `accessibilityLabel` and `accessibilityRole`; in Ionic, correct ARIA on the
  web layer.
- Dynamic type / font scaling that doesn't break layouts.
- Contrast ratios meeting WCAG AA (4.5:1 for body text).
- Full keyboard and switch-control operability.
- Touch targets at least 44×44 pt (iOS) / 48×48 dp (Android).
- No information conveyed by color alone.
- An accessibility statement published for the service.

Automated tooling catches perhaps a third of real barriers. Manual testing with
VoiceOver and TalkBack is the only reliable check.

Neither store checks accessibility at review time. This is a regulator-enforced
obligation, not a submission gate — which is exactly why teams miss it.

## GDPR and privacy law

Applies to processing personal data of people in the EU/EEA, regardless of where
you are.

- **Lawful basis** for each processing purpose. Consent, contract, legitimate
  interest — decide explicitly per purpose rather than defaulting to consent.
- **Consent for non-essential tracking** must be freely given, specific,
  informed, unambiguous, and as easy to withdraw as to give. Pre-ticked boxes
  and cookie-wall patterns fail. A consent management platform is the normal
  answer if you run ads or third-party analytics.
- **Data subject rights**: access, rectification, erasure, portability,
  objection. The store account-deletion requirements overlap with erasure but do
  not fully satisfy it — erasure covers data you hold about someone who may not
  have an account.
- **Privacy policy contents**: identity and contact details of the controller,
  purposes and lawful bases, recipients, transfers outside the EEA and their
  safeguards, retention periods, and the full list of data subject rights
  including the right to complain to a supervisory authority.
- **International transfers**: if data leaves the EEA, you need a transfer
  mechanism (adequacy decision or Standard Contractual Clauses). Relevant to any
  app using US-hosted infrastructure or a US AI provider.
- **EU representative** (Article 27) may be required if you have no EU
  establishment but target EU users.
- **Breach notification** within 72 hours to the supervisory authority.

Other regimes with app-relevant obligations: UK GDPR, CCPA/CPRA (California),
Brazil's LGPD, and a growing set of US state laws. The practical approach is to
build to the strictest applicable standard rather than maintaining per-region
behavior.

## Children and age assurance

This area is changing faster than any other and is worth re-verifying every
release cycle.

**COPPA (US)** — verifiable parental consent for collecting personal data from
children under 13. Applies to apps directed at children and to apps with actual
knowledge of child users.

**Apple Kids Category** — no third-party analytics or advertising beyond
contextual, parental gates on external links and purchases, no behavioral
targeting.

**Google Play Families policy** — declaring children in the target audience
triggers SDK restrictions (only Google-approved ads SDKs), content restrictions,
and data-collection limits. As of 2026, anonymous chat apps are prohibited from
targeting children.

**US state age-assurance laws.** Texas SB 2420 took effect 4 June 2026 after a
court lifted its injunction; similar laws are in effect or coming in Utah and
Louisiana. These require age assurance and parental consent for downloads,
in-app purchases, and "significant changes" to an app. Apple provides the
Declared Age Range API, a Significant Change API under PermissionKit, a StoreKit
age-rating property, and App Store server notifications for consent revocation.
Google provides an Age Signals API, with a restriction that data from it may only
be used to provide age-appropriate experiences in the receiving app.

**Australia** — since 10 December 2025, certain social media platforms must
prevent under-16s from holding accounts, including deactivating existing ones.

**Other jurisdictions** with active or imminent age requirements: Brazil,
Singapore, Vietnam (Decree 147), the EU under the DSA, and the UK Online Safety
Act's age-assurance duties.

If the app has any social, chat, or UGC surface and ships broadly, assume age
assurance work is coming and build the plumbing to accept an age signal now.

## Content and safety law

- **EU Digital Services Act** beyond trader status: notice-and-action mechanisms,
  transparency reporting, and restrictions on targeting minors with advertising.
- **UK Online Safety Act**: illegal content duties and children's risk
  assessments for user-to-user services.
- **Terrorist Content Online Regulation (EU)**: one-hour removal orders.

## Sector-specific licensing

An app that needs a license to operate offline needs it to operate in an app
store too, and both stores verify:

- **Financial services, lending, payments, crypto exchanges** — licensing per
  market. Apple added crypto exchanges to its highly-regulated-fields list in
  November 2025. Loan apps face APR caps (Apple: no more than 36% including fees;
  no repayment-in-full demands within 60 days).
- **Gambling and betting** — licensed only, per country. Brazil requires an SPA
  fixed-odds betting license submitted through App Review.
- **Health and medical devices** — Apple requires a regulated-medical-device
  declaration for EEA, UK, and US distribution for apps in Health & Fitness or
  Medical categories. FDA, MDR, and UKCA obligations are separate and
  independent of the store.
- **Pharmacy, telemedicine, and controlled substances** — heavily restricted on
  both stores.

## AI features

A distinct and growing compliance surface:

- **Disclosure and consent.** Apple requires clear disclosure where personal
  data is shared with third parties including third-party AI, with explicit
  permission first. Google's User Data requirements apply equally to third-party
  AI integrations.
- **Age rating.** A model capable of producing mature content affects the app's
  rating on both stores. Apple explicitly requires considering AI assistant and
  chatbot functionality when answering the rating questionnaire.
- **Content moderation.** If users can prompt a model and share output, the app
  has user-generated content and needs reporting and blocking under Apple's 1.2.
- **International transfers.** Sending EU user data to a US model provider is a
  GDPR transfer requiring a mechanism.
- **EU AI Act.** High-risk obligations began applying in August 2026. Most
  consumer apps are minimal-risk, but transparency obligations (telling users
  they are interacting with an AI system) apply broadly. Check classification
  before assuming you are out of scope.

## A note on jurisdiction

Where the developer is incorporated affects tax, payout, and trader declarations
but does not limit which laws apply. Obligations follow the *user's* location.
A solo developer anywhere in the world shipping a free app to EU users is subject
to GDPR, the DSA, and — if the app is in a covered category — the EAA.
