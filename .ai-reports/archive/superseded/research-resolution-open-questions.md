---
archived-on: 2026-05-01
archived-reason: superseded
replaces: .ai-reports/consolidated-gaps-report.md
---
# FRAS Canada — Research Resolution: 7 Open Questions

**Date:** 2026-03-04
**Status:** Research complete — action items pending stakeholder decisions
**Source:** PRD.md gap analysis table, live site browser inspection, existing documentation cross-reference

---

## Table of Contents

1. [Q1: Standards Navigation Without Top-Level Nav](#q1-standards-navigation-without-top-level-nav)
2. [Q2: Bilingual (EN/FR) Strategy](#q2-bilingual-enfr-strategy)
3. [Q3: Authentication Strategy](#q3-authentication-strategy)
4. [Q4: Uncovered Pages During Transition](#q4-uncovered-pages-during-transition)
5. [Q5: Save Search Alert — Functional or Placeholder?](#q5-save-search-alert--functional-or-placeholder)
6. [Q6: Browsing 1,010+ News Items Outside Search](#q6-browsing-1010-news-items-outside-search)
7. [Q7: Members, Committees, Jobs in CMS](#q7-members-committees-jobs-in-cms)
8. [Documentation Corrections](#documentation-corrections)
9. [Action Items Summary](#action-items-summary)

---

## Q1: Standards Navigation Without Top-Level Nav

**Impact:** High — largest content area (~50+ pages) loses dedicated navigation
**Status:** Partially resolved — needs design decision

### Current Live Site Behavior

The live site has "Standards" as the 4th mega-menu dropdown with 10 links organized in 4 groups:

| Group | Standards Section | URL |
|-------|------------------|-----|
| **Sustainability** | Canadian Sustainability Disclosure Standards | `/en/sustainability` |
| **Accounting** | Part I: IFRS® Accounting Standards | `/en/ifrsstandards` |
| | Part II: ASPE | `/en/aspe` |
| | Part III: NFP Organizations | `/en/nfpos` |
| | Part IV: Pension Plans | `/en/pensions` |
| **Public Sector** | Public Sector Accounting Standards | `/en/public-sector` |
| | International PSAS Activities | `/en/public-sector-international` |
| **Assurance** | CSQM | `/en/csqc` |
| | CAS/CASS | `/en/cass` |
| | Other Canadian Standards | `/en/other` |

**CORRECTION:** Standards sections use **horizontal tab bars** below the H1 title, NOT left-rail sidebars. Tabs:

- Most sections (5 tabs): `OVERVIEW | PROJECT LISTING | DOCUMENTS FOR COMMENT | EFFECTIVE DATES | RESOURCES`
- IFRS only (6 tabs): adds `IFRIC AGENDA DECISIONS`

### Wireframe Change

The wireframe removes "Standards" entirely from the mega-menu. This is a deliberate IA redesign, not an oversight.

### Three Replacement Mechanisms Proposed

1. **Homepage "Browse by Standard" section** — 4 cards (Sustainability, Accounting, Public Sector, Assurance) linking to `standards-sections` pages
2. **Board Detail sidebar** — links to Consultations/Projects/Resources route to some standards content
3. **Search** — power users search by standard name (e.g., "IFRS 16", "ASPE Section 3856")

### Gap

Standards overview pages (Template T5) are Phase 2. During Phase 1, standards URLs only exist as redirect targets from old Sitecore URLs — **no destination page exists in the new site**.

### Recommendation

Add "Standards" as a secondary nav item (not restoring the mega-menu) linking to a simple index page listing all 11 sections. This bridges the Phase 1→2 gap without reverting the IA redesign. Alternatively, ensure the Homepage "Browse by Standard" cards are functional in Phase 1 with interim landing pages.

### Decision Needed

- [ ] Confirm whether Standards gets any Phase 1 navigation entry point
- [ ] If yes, determine format: nav link to index page vs homepage cards only vs both

---

## Q2: Bilingual (EN/FR) Strategy

**Impact:** High — full FR mirror exists on live site (1,015 FR URLs vs 1,069 EN URLs)
**Status:** Infrastructure defined, FR implementation deferred to Phase 2

### Technical Architecture (Confirmed)

| Layer | Approach | Phase |
|-------|----------|-------|
| Content model | Payload i18n plugin — locale field on all text/richText fields | Phase 1 (model only) |
| Routing | Next.js App Router `[locale]` segment: `/en/...` and `/fr/...` | Phase 2 (Epic 18.1) |
| Default locale | `en` | Phase 1 |
| Language switcher | Header utility bar — shows current language, preserves path | Phase 2 (Epic 18.3) |
| UI strings | `messages/en.json` + `messages/fr.json` | Phase 2 (Epic 18.4) |
| SEO | `hreflang` alternates — fix: add explicit `hreflang="en"` (live site only has `x-default` + `fr`) | Phase 2 (Epic 18.5) |
| Slug mapping | 89 EN→FR pairs documented in `fr-slug-mapping.md` | Complete |

### Key Slug Translations (Reference)

**Boards:** `acsb`→`cnc`, `psab`→`ccsp`, `aasb`→`cnac`, `cssb`→`ccnid`
**Standards:** `ifrsstandards`→`normes-ifrs`, `sustainability`→`durabilite`, `public-sector`→`secteur-public`
**Paths:** `members`→`membres`, `committees`→`comites`, `projects`→`projets`, `news-listings`→`nouvelles`

### Gaps

1. **No FR wireframes exist** — assumption is 1:1 content parity with EN
2. **Translation source not scoped** — who produces French content? Client team? Translation vendor? This affects timeline significantly
3. **~54 URL discrepancy** between EN (1,069) and FR (1,015) — some content exists in only one language. Edge case handling needed (redirect to locale homepage)

### Phase 1 Posture

EN-only with i18n-ready data model. All Payload collections will have locale fields from Day 1, but FR content entry and FR routing are Phase 2.

### Decisions Needed

- [x] ~~Confirm translation source: client team, vendor, or combination~~
- [ ] Confirm whether any FR content is needed before Phase 2 launch
- [ ] Accept 1:1 parity assumption or identify FR-specific layout differences

### RESOLUTION (updated 2026-03-05)

**RESOLVED: AI-assisted translation via Claude API.** See `PRD-translation.md`. Manual trigger + dual approval workflow. Cost: $3.1K-$7.7K vs $50K-$187K vendor.

---

## Q3: Authentication Strategy

**Impact:** High — CPA Canada federated auth
**Status:** ~~Hard blocker for Phase 2 — CPA Canada SSO protocol unknown~~ **RESOLVED** — Aptify DB API confirmed

### Current Live Site Implementation (Verified)

The login page at `/en/my-account/login` is a **native ASP.NET WebForms PostBack form** — NOT a client-side redirect to an external OAuth/SAML provider.

**Form details:**
- Method: `POST` to `https://www.frascanada.ca/en/my-account/login`
- Fields: `User Name (email address)` (`type="text"`), `Password` (`type="password"`)
- Hidden fields: `__VIEWSTATE`, `__VIEWSTATEGENERATOR` (value `31C28C76`), `__EVENTVALIDATION`, `__RequestVerificationToken`
- Button: "Log in" (two words) — purple, triggers `WebForm_DoPostBackWithOptions`
- No CAPTCHA, no "Remember me", no MFA prompt

**CPA Canada federation is server-side** — the form submits locally and the ASP.NET backend validates credentials against CPA Canada's member system (likely shared database or API call). Users are told: "Your CPA Canada Member/Customer Number is required to create a profile."

**Auth URLs on live site:**
| Page | URL |
|------|-----|
| Login | `/en/my-account/login` |
| Register | `/en/my-account/register` |
| Forgot Username | `/en/my-account/forgot-username` |
| Forgot Password | `/en/my-account/forgot-my-password` |
| My Subscriptions | `/en/my-account/mysubscriptions` |

**Support contacts:** `customerservice@cpacanada.ca`, 1-800-268-3793, +1-416-977-0748

### Planned Implementation (Phase 2)

- NextAuth.js or custom JWT for session management
- CPA Canada SSO integration (protocol TBD)
- Rate limiting: 5 attempts / 15 min
- CSRF protection via Next.js server actions
- `auth-config` CMS Global for all labels/URLs/support contacts
- Epic 17 in BUILD_PLAN-phase2.md

### Critical Unknown

**The CPA Canada SSO integration method is unresolved.** Since the current site uses server-side PostBack (not client-side OAuth), CPA Canada may not currently expose a standard SSO endpoint. The rebuild needs to determine:

1. Does CPA Canada have an OAuth 2.0 / SAML 2.0 / OpenID Connect IdP endpoint?
2. Or is the current integration a direct database/API call to CPA Canada's member system?
3. If no standard SSO exists, will CPA Canada build one? Or does FRAS need to implement a proxy auth service?

### Architectural Implication

If CPA Canada only supports direct API/database credential validation (no SSO redirect), the rebuild may need:
- A server-side API route (`/api/auth/login`) that validates credentials against CPA Canada's API
- Session management via encrypted HTTP-only cookies or JWT
- This is simpler than full SSO but requires CPA Canada to provide an authentication API

### Decision Needed

- [x] ~~**Contact CPA Canada IT** to determine: OAuth 2.0, SAML 2.0, OpenID Connect, or direct API?~~
- [x] ~~Obtain integration documentation, endpoint URLs, and API contracts~~
- [x] ~~This blocks Phase 2 Task 16 (Template 16: Authentication Pages)~~

### RESOLUTION (updated 2026-03-05)

**RESOLVED: Aptify DB API.** Confirmed via Notion research docs (RAS Overview). Authentication uses direct API calls to Aptify database for session validation and member verification. Simple True/False membership check — no CPA SSO, no OKTA, no OAuth/SAML. Next.js <> Aptify replicates the current CPA solution. See `dogfood-frascanada/notion-research-cross-reference.md` Section G2.

---

## Q4: Uncovered Pages During Transition

**Impact:** High — SEO + user impact for ~694 pages
**Status:** Redirect infrastructure designed, destination URLs undefined

### The Numbers

- **Total URLs:** 2,090 (1,069 EN + 1,015 FR + 6 other)
- **Phase 1 covers:** ~22% of templates (6 wireframed page types)
- **Phase 2 covers:** ~78% of templates (13 gap templates, ~694 pages)

### Three-Tier Redirect Strategy (Designed)

**Tier 1 — Pattern-based redirects in `next.config.mjs` (~80% of URLs)**
Rules cover: board landings, project details (standard-centric → board-centric URL restructure), documents, news, board sub-pages. Code patterns already written.

**Tier 2 — Dynamic redirects via middleware with `redirect-map.json` (~15%)**
Generated automatically during migration by mapping source URLs to Payload content by slug/title.

**Tier 3 — Catch-all fallback (~5%)**
Custom 404 page with search functionality + logging of unmatched URLs for manual review.

### Gap: Destination URLs Are Undefined

The following Phase 2 URL destinations are all marked "TBD (Phase 2)" in the content migration strategy:
- Standards overview pages
- Meetings pages
- Members pages
- Committees pages
- Resources pages
- Effective dates pages

Without destination URLs, redirects for these pages cannot be implemented — they'll 404 during Phase 1.

### The Proxy Pass Option

PRD.md suggests "consider proxy pass for Phase 2 pages" — the new Next.js site could reverse-proxy requests for uncovered templates directly to the old Sitecore site, preserving content access without requiring migration.

**This is mentioned once with no implementation details.**

### Recommendation

Implement a reverse proxy middleware in Next.js for Phase 2 template URLs during Phase 1:

```
// Conceptual: middleware.ts
if (isPhase2Url(pathname)) {
  return proxyToSitecore(request)
}
```

Benefits:
- All content stays accessible during transition
- No SEO impact (no 301 redirects to wrong destinations)
- Can add `X-Proxied: true` header for monitoring
- Removed incrementally as Phase 2 pages go live

Risk: Requires old Sitecore site to remain running alongside the new site. Confirm with infrastructure team.

### Decisions Needed

- [ ] Confirm proxy pass approach vs accepting 404s during transition
- [ ] Confirm old Sitecore site will remain running during Phase 1→2 transition
- [ ] Define Phase 2 URL patterns so redirect destinations can be finalized

---

## Q5: Save Search Alert — Functional or Placeholder?

**Impact:** Medium
**Status:** RESOLVED — feature does not exist on the live site

### Key Finding

**"Save Search Alert" does NOT exist on the current FRAS Canada site.** This is a wireframe-only invention.

The live search is powered by **Coveo Atomic** (client-side JS web components):
- Organization ID: `charteredprofessionalaccountantsofcanadacpaproductdeccdl4u`
- Results rendering: `atomic-search-interface`, `atomic-search-box`, `atomic-facet`, `atomic-sort-dropdown`, `atomic-pager`
- Left sidebar facets: Page Type (Meeting Summary: 313, News: 108, Resource: 77, Webpage: 52, etc.)
- Sort: Relevancy (default) — not date-based like News Listings
- Language filter injected via `preprocessRequest`: `@language=="English"`

A DOM search for "save search", "notif", and "alert" returned no results. There is no save/subscribe feature on the live site.

### Implication

Since this is a **new feature** (not a migration of existing functionality), it should be treated as a Phase 2+ enhancement, not a Phase 1 requirement.

### Recommendation

**Phase 1:** Show the "Save Search Alert" link in the UI (wireframe accuracy), but clicking it shows a lightweight modal: "Sign in to save search alerts. This feature is coming soon." This sets user expectations without dead-ending.

**Phase 2:** Implement the full feature after authentication is available:
- User auth (Phase 2 prerequisite)
- Email notification service
- `saved-searches` Payload collection (query, user, frequency, lastRun)
- Backend cron job to execute saved searches and send email alerts

### Decision Needed

- [ ] Confirm Phase 1 click behavior: modal message vs disabled/hidden vs dead link

---

## Q6: Browsing 1,010+ News Items Outside Search

**Impact:** Medium — archive pagination
**Status:** Phase 2 fully designed, Phase 1 has a navigation gap

### Live Site News Listing (Verified)

URL: `/en/news-listings` — approximately **1,001–1,010 items** across **101 pages** at 10 items/page.

**Controls (all ASP.NET PostBack):**
- **Category pills:** All Items | Document for Comment | International Activity | Meeting Summary | News | Resource
- **Sort:** Publication date: Newest (default) | Oldest
- **Date range:** Start Date / End Date (mm/dd/yyyy text inputs)
- **Items per page:** 10 (default) | 20 | 30 | All

**Secondary nav on news page:** `ABOUT | RESEARCH PROGRAM | NEWS LISTINGS | CONTACT US | JOB OPPORTUNITIES | VOLUNTEER OPPORTUNITIES | MY ACCOUNT`

### Phase 2 Solution (Template 12 — Fully Designed)

- **Routes:** `/news` (global) + `/boards/:board-slug/news` (board-filtered)
- **Filters:** 6 category pills, date range, items per page (10/20/30/All), sort (newest/oldest)
- **API:** `GET /api/news?board=...&category=...&sort=...&startDate=...&endDate=...&page=...&limit=...`
- **Performance:** Server-side pagination (not client-side filtering of 1,010+ items)
- **Variant:** Volunteer Opportunities (`/volunteer-opportunities`) uses same template with board tabs
- BUILD_PLAN-phase2.md Task 16.5

### Phase 1 Gap

The Phase 1 primary nav includes "News" as a top-level item, but **no news listing page exists in Phase 1 tasks**. The `news` CMS collection is built (Task 1.5), but there's no page route.

Users clicking "News" in Phase 1 navigation would hit a dead end.

### Recommendation

Add a minimal news listing page to Phase 1 scope (~1 additional task):
- Simple paginated list: title (linked), date, 2-line excerpt
- Server-side pagination (10 items/page)
- No filters, no category pills, no date range (defer to Phase 2)
- Route: `/news`
- Estimated effort: 1–2 days

This prevents a broken nav link and provides basic news browsing until the full Phase 2 filtered listing is built.

### Decision Needed

- [ ] Add basic news listing to Phase 1 scope, or accept dead nav link until Phase 2?

---

## Q7: Members, Committees, Jobs in CMS

**Impact:** Medium
**Status:** RESOLVED — fully specified in Phase 2

### Members (`board-members` collection)

| Field | Type | Notes |
|-------|------|-------|
| name | text | Required |
| credentials | text | e.g., "FCPA, FCA, CPA(MI)" |
| photo | upload | 205×205px |
| role | enum | chair, vice-chair, voting-member, non-voting |
| roleLabel | text | Display text (e.g., "CHAIR") |
| appointedDate | date | |
| termExpires | date | |
| bioPage | relationship | → pages collection |
| sortOrder | number | Officers first, then alphabetical |
| board | relationship | belongsTo boards |

**Route:** `/boards/:board-slug/about/members` (Template 4: People Listing)
**Layout:** 70/30 — 2-column card grid + section nav sidebar
**Volume:** ~50+ members across 5 boards (AcSB verified: 15 members — 1 Chair, 1 Vice-Chair, 13 voting)
**Build:** Phase 2, Epic 11.1 + Epic 13.2

### Committees (`committees` collection)

| Field | Type | Notes |
|-------|------|-------|
| name | text | Required |
| slug | text | Auto-generated |
| description | richText | |
| sortOrder | number | |
| detailPageUrl | text | External link if applicable |
| members | array | Embedded: name, role, organization |
| status | enum | active, inactive, archived |
| board | relationship | belongsTo boards |

**Route:** `/boards/:board-slug/committees` (Template 14: Committee Index)
**Layout:** 70/30 — main content + right sidebar with scroll-spy anchor nav
**Volume:** AcSB: 13, PSAB: 3+, AASB: 3, CSSB: 3+, RASOC: 2
**Note:** Live site has a typo: `/en/rasoc/committes` (missing 'e') — documented as bug #8
**Build:** Phase 2, Epic 11.2 + Epic 13.4

### Jobs (`job-postings` collection)

| Field | Type | Notes |
|-------|------|-------|
| title | text | Required |
| department | text | |
| location | text | |
| description | richText | |
| summary | text | |
| postedDate | date | |
| closingDate | date | Null = no deadline |
| externalUrl | text | Link to external application |
| status | enum | draft, published, closed |

**Route:** `/job-opportunities` (Template 17: Simple Content/Empty State)
**Layout:** Full-width, no sidebar
**Empty state:** *"Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!"* (italic, confirmed on live site)
**Query:** `status === 'published'` AND (`closingDate` is null OR in the future), sorted by `postedDate` DESC
**Volume:** Currently 0 open jobs
**Build:** Phase 2, Epic 11.8 + Epic 12.6

### Phase 1 Posture

Placeholder CMS collections (data model only, no UI pages). Phase 2 builds the full UI.

**No decisions needed — this is fully resolved.**

---

## Documentation Corrections

The following corrections to existing documentation were identified during live site research:

### Correction 1: Standards Sections Use Horizontal Tabs, Not Sidebars

**Affected docs:** `site-discovery-verified.md`, `wireframe-specs-phase2.md`
**Previous assumption:** Standards sections have a left-rail sidebar navigation
**Actual:** Standards sections use a **horizontal tab bar** directly below the H1 page title. Tabs: `OVERVIEW | PROJECT LISTING | DOCUMENTS FOR COMMENT | EFFECTIVE DATES | RESOURCES` (IFRS adds `IFRIC AGENDA DECISIONS`). There is no sidebar on standards pages.

### Correction 2: "Save Search Alert" Is a New Feature, Not Migration

**Affected docs:** `wireframe-vs-live-gap-analysis.md` (correctly identifies as "New feature"), `PRD.md`, `BUILD_PLAN.md`
**Clarification:** The live site has NO save/subscribe search feature. The wireframe introduces this as a completely new feature. It should not be treated as a must-have for feature parity.

### Correction 3: Live Site Search Is Coveo Atomic (Client-Side JS)

**Affected docs:** Not previously documented
**Finding:** Search is powered by Coveo Atomic web components with CPA Canada's organization endpoint. The entire search interface renders client-side after ~3 seconds of JS initialization. The rebuild will use a different search implementation (likely Payload's built-in search or a custom solution). Coveo configuration details:
- Org ID: `charteredprofessionalaccountantsofcanadacpaproductdeccdl4u`
- Language filter: `@language=="English"` injected via `preprocessRequest`
- URL sanitization: replaces `cms-prod`/`cms-test` hostnames with `www` in click URIs

### Correction 4: Login Form Is Server-Side PostBack, Not Client-Side OAuth

**Affected docs:** `PRD-phase2.md` references OAuth/SAML as possibilities
**Clarification:** The current login form submits via ASP.NET WebForms PostBack to the same URL (`/en/my-account/login`). There is no client-side redirect to a CPA Canada IdP. The federation is handled entirely server-side. This suggests CPA Canada may use a direct API/database validation model rather than a standard SSO protocol — which changes the rebuild approach.

### Correction 5: AcSB Has 15 Members (Verified Count)

**Affected docs:** `site-discovery-verified.md` (Template 4)
**Finding:** AcSB members page shows exactly 15 members: 1 Chair (Armand Capisciolto), 1 Vice-Chair (Chris Kovalchuk), and 13 voting members. Previous docs estimated "~50+" across 5 boards — this gives a more precise per-board count.

---

## Action Items Summary

| # | Action | Owner | Priority | Blocks |
|---|--------|-------|----------|--------|
| 1 | **Design decision:** Standards nav bridging strategy for Phase 1 (secondary nav link? homepage cards? interim index page?) | Design/PM | High | Phase 1 nav implementation |
| ~~2~~ | ~~**Confirm translation source** for French content~~ | ~~Client/PM~~ | ~~High~~ | **RESOLVED** — AI-assisted (Claude API). See `PRD-translation.md`. |
| ~~3~~ | ~~**Contact CPA Canada IT** for SSO integration docs~~ | ~~Client/PM~~ | ~~High~~ | **RESOLVED** — Aptify DB API confirmed. See Q3 resolution above. |
| 4 | **Decide proxy pass strategy** for uncovered pages during Phase 1→2 transition. Confirm old Sitecore remains running | Engineering/Infra | Medium | Go-live planning |
| 5 | **Decide Phase 1 "Save Search Alert" click behavior** — modal message vs disabled vs hidden | Design | Low | Phase 1 search page |
| 6 | **Add basic news listing page** to Phase 1 scope to prevent broken "News" nav link | Engineering/PM | Medium | Phase 1 nav integrity |
| 7 | **Apply documentation corrections** (5 items above) to affected source docs | Engineering | Low | Documentation accuracy |

### Priority Matrix

```
                    URGENT              NOT URGENT
              ┌─────────────────┬─────────────────┐
  HIGH        │ #1 Standards    │ #2 Translation   │
  IMPACT      │ #3 CPA Canada   │    source        │
              │    auth          │                  │
              ├─────────────────┼─────────────────┤
  MEDIUM      │ #6 News listing │ #4 Proxy pass    │
  IMPACT      │                 │ #5 Save Search   │
              │                 │ #7 Doc corrections│
              └─────────────────┴─────────────────┘
```

---

*Generated 2026-03-04. Cross-references: PRD.md, PRD-phase2.md, BUILD_PLAN.md, BUILD_PLAN-phase2.md, site-discovery-verified.md, wireframe-vs-live-gap-analysis.md, content-migration-strategy.md, fr-slug-mapping.md*
