# Notion Research Cross-Reference — PRD Gap Analysis

> **Date:** 2026-03-04
> **Sources:** 3 Notion pages + 30+ sub-pages
> **Purpose:** Cross-reference Notion research docs against our PRDs to identify missing pages, templates, forms, integrations, and architectural corrections.

---

## Source Documents

### 1. FRAS Search Analysis
- **URL:** https://www.notion.so/82ec52a12e944c0e8c8df2782ddefabb
- **Tags:** Technical
- **Content:** Coveo search implementation details — atomic components, computed fields, indexing strategy

### 2. RAS (Formerly FRAS) Overview
- **URL:** https://www.notion.so/239b4ffdd71e8032b53ac9e2cfc35b32
- **Content:** Complete project overview including page templates, existing forms, existing component library, new wireframe components, new pages, integrations, member content rules

### 3. Analysis: FRAS <> CPAC Template Mapping
- **URL:** https://www.notion.so/32a1620bf89b41f8999ce6f3dd3ccdb6
- **Tags:** Discovery, Analysis, Technical
- **Content:** Mapping of CPA Canada templates to FRAS, new template identification, page-by-page route mapping, redirect inventory

---

## A. Complete Sitecore Template Inventory (from Notion)

The RAS Overview lists **12 Sitecore page templates** under `/sitecore/templates/NLC/Pages/Fras/`:

| # | Template Name | Sitecore Path | Our Coverage |
|---|--------------|---------------|-------------|
| 1 | Homepage | NLC/Pages/Fras/Homepage | Phase 1 PRD ✅ |
| 2 | Standard Page | NLC/Pages/Fras/Standard Page | Phase 2 PRD (T3) ✅ |
| 3 | Standard Page with Side Navigation | NLC/Pages/Fras/Standard Page with Side Nav | Phase 2 PRD (T3 variant) ✅ |
| 4 | News Article | NLC/Pages/Fras/News Article | Phase 2 PRD (T12 content type) ✅ |
| 5 | Internal or External News Page | NLC/Pages/Fras/Internal or External News Page | **MISSING** — redirect template for external links |
| 6 | RSS Listing Feed | NLC/Pages/Fras/RSS Listing feed | **MISSING** — RSS feed page |
| 7 | Meeting Details | NLC/Pages/Fras/Meeting Details | Phase 2 PRD (T13 content type) ✅ |
| 8 | Member | NLC/Pages/Fras/Member | Phase 2 PRD (T4) ✅ |
| 9 | Document for Comment | NLC/Pages/Fras/Document for Comment | Phase 2 PRD (T9) ✅ |
| 10 | Project | NLC/Pages/Fras/Project | Phase 1 PRD ✅ |
| 11 | Annual Report Page | NLC/Pages/Fras/Annual Report Page | **MISSING** — no template in any PRD |
| 12 | Error Page | NLC/Pages/Fras/Error Page | **MISSING** — no 404/500 page template |

**Note from Template Mapping doc:** "Standard Page" templates are highly inconsistent — "they deviate a lot from each other, they almost look 'authored'. Every page using this template will need to be reauthored. Some pages will need a new template."

---

## B. Complete Forms Inventory (from Notion)

The RAS Overview lists **8 existing forms**:

| # | Form | URL | Auth Required | Our Coverage |
|---|------|-----|---------------|-------------|
| 1 | Contact Us | `/en/contact-us` | No | Phase 2 PRD (T15) ✅ |
| 2 | Log In | `/en/my-account/login` | No | Phase 2 PRD (T16) ✅ |
| 3 | Register | `/en/my-account/register` | No | **MISSING** — T16 only covers Login |
| 4 | Forgot Username | `/en/my-account/forgot-username` | No | **MISSING** — treated as link in T16, is separate page |
| 5 | Forgot Password | `/en/my-account/forgot-my-password` | No | **MISSING** — treated as link in T16, is separate page |
| 6 | Document For Comment Submission | Behind auth (`/Submit-Comment`) | **Yes** | **MISSING** — member-only form |
| 7 | Event Registration | Behind auth | **Yes** | **MISSING** — member-only form (blank Notion page) |
| 8 | Volunteer Registration of Interest | Behind auth | **Yes** | **MISSING** — member-only, same UI as Doc submission, upload CV |

**Key detail from Doc For Comment Submission page:**
- "Must be logged in before being able to access SUBMIT COMMENT page"
- "No document storage in Sitecore — Email with attachment to email address maintained in CMS"

**Key detail from Volunteer Registration page:**
- "Same UI as Documents for Comment"
- "Visitors upload CV expressing interest in Event"
- "Must be logged in to access volunteer interest submission"

---

## C. New Listing Pages (from Listing Pages Overview)

The RAS Overview identifies **9 distinct listing page destinations** navigable via the main header. Each shares a universal template:

| # | Listing Type | Our Coverage |
|---|-------------|-------------|
| 1 | News | Phase 2 PRD (T12) ✅ |
| 2 | Events | Phase 2 PRD (T13 partial) ✅ |
| 3 | Documents for Comment | Phase 2 PRD (T8) ✅ |
| 4 | Volunteer Opportunities | Phase 2 PRD (T12 variant) — **but Notion treats as its own listing** |
| 5 | Committees | Phase 2 PRD (T14) ✅ |
| 6 | Projects | Phase 1 PRD ✅ |
| 7 | Effective Dates | Phase 2 PRD (T10) ✅ |
| 8 | Resources | Phase 2 PRD (T11) ✅ |
| 9 | Decision Summaries | **PARTIALLY MISSING** — collection exists but no listing page template |

**Universal listing template structure:**
- Page Header
- Breadcrumb
- Left rail facet control (customized per content type)
- Listing content
- Universal facets: Board, Content, Date range picker, Sort By (Relevance, Date)
- Pre-faceted to selected Board on arrival, other 4 boards visible for refinement

---

## D. New Detail Pages (from Notion)

| # | Detail Type | Our Coverage |
|---|------------|-------------|
| 1 | Project Detail | Phase 1 PRD ✅ |
| 2 | Exposure Draft (Document for Comment) | Phase 2 PRD (T9) ✅ |
| 3 | News Story | Phase 2 PRD ✅ |
| 4 | Event Summary | **MISSING** — has dedicated "Event Summary Table" component |
| 5 | Volunteer Detail | **MISSING** — individual volunteer opportunity page |
| 6 | Document for Comment | Phase 2 PRD (T9) ✅ |
| 7 | Annual Report | **MISSING** — no template |

---

## E. New Components Inventory (from Notion)

The RAS Overview lists **25 new components**. Cross-reference against our component inventories:

| # | Component | Our Coverage |
|---|-----------|-------------|
| 1 | Header Navigation | Phase 1 PRD ✅ |
| 2 | Footer | Phase 1 PRD ✅ |
| 3 | Sitewide Search | Phase 1 PRD ✅ |
| 4 | Left Rail Navigation | Phase 1 PRD ✅ |
| 5 | Right Rail - Quick Links | Phase 1 PRD ✅ |
| 6 | Right Rail - Project Actions | Phase 1 PRD ✅ |
| 7 | Right Rail - Events List | Phase 1 PRD ✅ |
| 8 | Right Rail - Resource List | Phase 1 PRD ✅ |
| 9 | Right Rail - Staff Contact | Phase 1 PRD ✅ |
| 10 | Hero Banner | Phase 1 PRD ✅ |
| 11 | CTA Banner | Phase 1 PRD ✅ |
| 12 | Card Grid | Phase 1 PRD ✅ |
| 13 | News Card | Phase 1 PRD ✅ |
| 14 | Drafts Card | Phase 1 PRD ✅ |
| 15 | Events Card | Phase 1 PRD ✅ |
| 16 | Subscribe Banner | Phase 1 PRD ✅ |
| 17 | Promo Card Grid + Cards | Phase 1 PRD ✅ |
| 18 | Page Header (+ Breadcrumb) | Phase 1 PRD ✅ |
| 19 | Project Timeline | Phase 1 PRD ✅ |
| 20 | Projects List | Phase 1 PRD ✅ |
| 21 | News List | Phase 1 PRD ✅ |
| 22 | Rich Text | Phase 2 PRD ✅ |
| 23 | Events Listing | **PARTIALLY** — we have UpcomingEvents sidebar but not a full Events Listing component |
| 24 | Event Summary Table | **MISSING** — "Replica of existing Summary Table from current site" |
| 25 | Component Summary | N/A — documentation page |

**Events Listing component spec (from Notion):**
- Summary of Events associated with a particular Board (defined by page it's on)
- Up to 3 next upcoming events or decision summaries ranked by date nearest to furthest
- Fields: Heading, View All CTA, Event Title, Event Description (truncated), Event Type (Badge), Event Date

**Event Summary Table component spec (from Notion):**
- "Replica of existing Summary Table from current site"
- (Screenshot reference — appears to be a tabular meeting/event summary format)

---

## F. Existing Component Library (from Notion)

The RAS Overview also lists **20 existing components** from the current Sitecore site:

| # | Component | Notes |
|---|-----------|-------|
| 1 | Banner | Existing |
| 2 | Breadcrumb | Existing |
| 3 | Section Title | Existing |
| 4 | Page Title | Existing |
| 5 | Committee Members List | Existing |
| 6 | Document Comment Section | Existing — form component for comment submission |
| 7 | Generic CTA | Existing |
| 8 | Meeting Page Details | Existing |
| 9 | Meeting Summary Rollup | Existing |
| 10 | Meetings Listing | Existing |
| 11 | News Listing | Existing |
| 12 | Upcoming Meetings Rollup | Existing |
| 13 | Secondary Navigation | Existing — "pulls sibling landing pages, needs custom GraphQL" |
| 14 | Side Navigation | Existing |
| 15 | Effective Dates Table | Existing |
| 16 | Meeting Topics Table | Existing |
| 17 | Project Overview | Existing |
| 18 | Project Table | Existing |
| 19 | Project Status Table | Existing |
| 20 | Staff Contact | Existing |
| 21 | Rich Text | Existing |

**Note:** "Meeting Topics Table" is a component we haven't inventoried. It's separate from the Effective Dates Table and the Event Summary Table.

---

## G. Integration Corrections

### G1. Search: Coveo (NOT Custom) — RESOLVED

> **RESOLVED: Meilisearch selected as Coveo replacement.** See `research-search-solutions.md` for full analysis. Meilisearch (MIT license, self-hosted Docker) provides faceted search, typo tolerance, query suggestions, did-you-mean, bilingual support (separate EN/FR indexes), and React InstantSearch compatibility via `instant-meilisearch` adapter. PRD.md Section 4.6 and Section 10 updated accordingly.

**What our PRD says (updated):** Search powered by Meilisearch with React InstantSearch widgets, `payload-meilisearch` plugin for CMS sync, PDF/Word extraction via `pdf-parse`/`mammoth`.

**What Notion originally said:** Search was **Coveo-powered** using Coveo's atomic web components:
- `atomic-search-box` + `atomic-search-box-query-suggestions`
- `atomic-sort-dropdown`
- `atomic-query-summary`
- `atomic-facet` (currently only 1 facet: Page Type)
- `atomic-pager`
- `atomic-results-per-page`
- `atomic-did-you-mean`
- `atomic-no-results`

**Coveo indexing details (retained for migration reference):**
- Source: sitemap (requires public domain or ngrok for local)
- Omit from index: header, #breadcrumb-container, footer, #onetrust-consent-sdk
- Date: computed field based on template ID (bug: empty date shows wrong date)
- `topicAreaName`: computed field for purple tags (board association) — computed in metadata construction, not Coveo extension
- `toplevelcategory`: computed field for title metadata category label
- Grid layout can be ported from phase 1 site

**Sitewide Search component additional specs (from Notion):**
- Left rail facet categories: Board, Content Type, Date Range picker
- Sort By: "Relevance" default, Date Ascending, Date Descending in dropdown
- **Modal questioned:** "What purpose does a modal serve beyond an unnecessary step?" — suggests modal may be dropped

**Resolution:** Meilisearch replaces Coveo. The computed fields (`topicAreaName`, `toplevelcategory`) are synced to Meilisearch via `payload-meilisearch` plugin hooks. Facet categories (Board, Content Type, Date Range, Standard, Files & Media) mapped to `<RefinementList>` InstantSearch widgets.

### G2. Authentication: Aptify (NOT OAuth/SAML)

**What our PRD says:** "Payload auth plugin + CPA Canada OAuth/SAML integration" (Phase 2)

**What Notion says:**
- "We will not leverage the CPA SSO work and instead member verification & profile management will be handled via **secure API calls to Aptify DB**"
- "Essentially, we will be replicating the current solution employed by CPA (Next.js <> Aptify)"
- "While CPA adopts the SSO solution leveraging OKTA"
- Login page: "Aptify integration to validate session and allow access"

**Impact:** HIGH — Auth is NOT federated SSO. It's direct API calls to Aptify database for:
- Session validation
- Member verification
- Profile management

### G3. Members: Simple Boolean (NOT Complex Usergroups)

**What our PRD says:** Not specified (Open Question #3)

**What Notion says:**
- "Unlike CPA, no geo-restrictions and no multiple usergroups are required (Only Member? True/False)"
- "Access is controlled in CMS"
- Member privileges:
  1. Register interest for Volunteer Opportunities (form → email)
  2. Submit Documents for Comment (form → email with attachment)
  3. Register Interest to an event/webinar/zoom session (form → email)
- "All of these are by way of a form submission, all with the same UI"
- "The form submission triggers an email (with attachments where applicable)"
- **"No logs or info or storage is required"**
- "All other content is freely available to both members and non-members alike"

**Impact:** MEDIUM — Significantly simplifies auth. Member actions are just protected form submissions that trigger emails. No user profiles, no content gating beyond the forms.

### G4. Newsletter: HubSpot (NOT Generic Email)

**What our PRD says:** Generic `<NewsletterCTA />` with email input + Subscribe

**What Notion says:** "HubSpot — Newsletter DB/CRM"

**Impact:** MEDIUM — Need HubSpot API integration for newsletter subscription, not a generic form.

### G5. CAPTCHA: ReCaptcha (NOT Image CAPTCHA)

**What our PRD says (Phase 2 T15):** "Image CAPTCHA with refresh button"

**What Notion says:** "ReCaptcha — Contact Form submission"

**Impact:** LOW — ReCaptcha is easier to implement than custom image CAPTCHA. Update T15 spec.

### G6. Cookie Consent: OneTrust

**What our PRD says:** Not explicitly mentioned in PRD (exists in site-discovery-verified.md)

**What Notion says:** "OneTrust (Cookie Manager)"

**Impact:** LOW — Already documented in site-discovery. Should be added to PRD integrations section.

### G7. Analytics

**What our PRD says:** Not mentioned

**What Notion says:** "Analytics" listed as integration

**Impact:** LOW — Need to add analytics integration (likely Google Analytics or similar) to PRD.

---

## H. Template Mapping Findings (from FRAS <> CPAC doc)

### H1. Full Route-to-Template Mapping

The mapping doc provides page-by-page template assignments. Key findings:

**Pages that need NEW templates (marked RED in Notion):**
- `/contact-us` → NEW TEMPLATE 2 (Contact Form)
- `…/Meetings-and-Events` (across all boards) → NEW TEMPLATE 1 (Meetings Listing)
- `…/Documents` (across standards) → NEW TEMPLATE 1
- `…/Documents/[doc-slug]` → NEW TEMPLATE 3 (Document for Comment detail)
- `…/Projects` (across standards) → NEW TEMPLATE 4 (Projects listing)
- `…/Projects/[project-slug]` → NEW TEMPLATE 5 (Project detail)
- `/public-sector-international` → NEW TEMPLATE 4

**New Template Descriptions:**
| Template | Description | Our Equivalent |
|----------|-------------|----------------|
| New Template 1 | Meetings/Documents listing with tab navigation | Phase 2 T8/T13 ✅ |
| New Template 2 | Contact form page | Phase 2 T15 ✅ |
| New Template 3 | Document for Comment detail — "weird functionality, links to AUTH area, lots of custom styling" | Phase 2 T9 ✅ |
| New Template 4 | Projects listing — "similar to Template 1 but doesn't refresh page or add content details" | Phase 1 Active Projects ✅ |
| New Template 5 | Project detail — "lots of weirdly designed areas, might be easier to create new template" | Phase 1 Project Detail ✅ |

### H2. Problematic Areas

- **Standard Page inconsistency:** About page uses Standard Page template but has Side Navigation. It doesn't use the "Standard Page with Side Nav" template. Template assignment is unreliable.
- **My Account area:** Marked ORANGE/unknown — `/my-account` needs investigation
- **Volunteer pages:** `/cssb/volunteer` marked UNKNOWN — no content
- **Submit Comment pages:** Behind auth — e.g., `/acsb/Submit-Comment` redirects to login
- **Effective Dates:** "They have a weird table thing under the sitecore item tho {D116BE22-5628-4297-91AF-53EDCA09D117}"
- **RSS Feed:** `/news-listings/fras-news-listings-rss` — needs new template

### H3. Redirects

- 20 redirects in a Sitecore redirects folder under the home node
- "We did not count/investigate any item level redirects"
- Links missing Sitecore items: e.g., `/cssb/meetings-and-events/issb-consultations`

### H4. Pages that 404/500

- `/FAQs` → 404
- `/accessibility-policy` → 500
- `/independent-standard-setting-review` → 500
- Various `/Research-Program`, `/CSSB/implementation-committee` subpages → 404

---

## I. Architecture & Risk Notes

### I1. Technology Stack (from Notion)

**Notion says:** Site will be maintained in **Sitecore XM (SXA Headless)** and rendered through a **Next.js** front-end framework. "Currently on Non-headless MVC — with C# to render."

**Our PRD says:** Payload CMS + Next.js

**Note:** This is a discrepancy. The Notion doc predates the Payload decision. The Notion doc describes the original plan (Sitecore XM headless + Next.js). Our PRD reflects the updated direction (Payload CMS + Next.js). **The original Sitecore plan may affect migration strategy** — some field structures and content models may have been designed around Sitecore's content tree.

### I2. Risks (from Notion)

- "Cloudflare and WAF issues (Continual challenge with CPA work)" — relevant for scraping/migration
- "SAST and DAST scans (and subsequent remediation) have proven to be a challenge for previous CPA/FRAS projects: Infosec team wanting to meet certain thresholds of vulnerability alleviation that simply weren't possible with specific marketing requirements"

### I3. Design Assumptions (from Notion)

- "Comprehensive Designs based on existing wireframes will be included in scope to ensure alignment of requirements prior to commencing dev work"
- "We are assuming that Bryan/Leigh will build on the approved wireframes and build out detailed designs based on the new RAS branding, style guide"
- "Alternatively, the client may wish to take this in-house and build these with their design agency"

### I4. Development Environment (from Notion)

- "We will promote completed work to a new Node ('RAS') in the CPA Test Environment"

### I5. User Note: News/Webinar Field Parity

User flagged: "Any webinar page, etc. is using the event template with its own news. Check webinar & news page fields — if consistent/data is same then won't have any issue, ideally we can ensure the data is seamless for a singular data source."

**Assessment:** Events Listing component spec confirms events and news share similar card patterns (Title, Description, Type Badge, Date). If Sitecore fields are consistent across webinar events, meeting events, and news items, a unified `events` collection with a `type` enum (Webinar, Meeting, Deadline, etc.) would work. Need field parity verification during content extraction.

---

## J. Summary of ALL Gaps

### Missing Page Types/Templates (not in any PRD)

| # | Template | Description |
|---|----------|-------------|
| 1 | Annual Report Page | Sitecore template — linked from board sidebar nav (About > Annual Report) |
| 2 | Error Pages (404/500) | No error page template anywhere |
| 3 | RSS Feed Page | Sitecore template — e.g., `/news-listings/fras-news-listings-rss` |
| 4 | Internal/External News Page | Redirect template — used for external link listings in search |
| 5 | Event Summary Detail | Individual event/meeting summary pages with Event Summary Table component |
| 6 | Volunteer Detail Page | Individual volunteer opportunity detail page |
| 7 | Decision Summaries Listing | Collection exists but no listing page template built |

### Missing Forms (not in any PRD)

| # | Form | Notes |
|---|------|-------|
| 1 | Register (Create Account) | Separate page from Login (`/my-account/register`) |
| 2 | Forgot Username | Separate form page (`/my-account/forgot-username`) |
| 3 | Forgot Password | Separate form page (`/my-account/forgot-my-password`) |
| 4 | Document For Comment Submission | Member-only, email + attachment, no storage |
| 5 | Event Registration | Member-only form, blank Notion spec |
| 6 | Volunteer Registration of Interest | Member-only, same UI as Doc submission, upload CV |

### Missing Components

| # | Component | Description |
|---|-----------|-------------|
| 1 | Event Summary Table | Tabular meeting/event summary — "replica of existing" |
| 2 | Meeting Topics Table | Separate from Effective Dates Table |
| 3 | Events Listing (full) | Board-scoped, 3 items, date-ranked (we have sidebar variant only) |

### Architecture Corrections Needed

| # | Area | Current PRD | Should Be |
|---|------|------------|-----------|
| 1 | Search | Custom-built | **Meilisearch** (MIT, self-hosted) — RESOLVED. Replaces Coveo. |
| 2 | Auth | CPA Canada OAuth/SAML | **Aptify DB API** — direct API calls, Next.js <> Aptify |
| 3 | Members | Complex/undefined | **Simple True/False** — form submissions → email only, no storage |
| 4 | Newsletter | Generic email | **HubSpot** CRM integration |
| 5 | CAPTCHA | Image CAPTCHA | **ReCaptcha** |
| 6 | Cookie Consent | Not in PRD | **OneTrust** |
| 7 | Analytics | Not in PRD | Needs specification (GA4 or similar) |

---

## K. Updated Open Questions

Original 7 + new questions surfaced by this cross-reference:

| # | Question | Impact | Source |
|---|----------|--------|--------|
| 1 | How do users access 11 Standards sections without top-level nav? | High | PRD |
| 2 | What is the bilingual (EN/FR) strategy? | High | PRD |
| 3 | ~~What is the authentication strategy?~~ → **ANSWERED: Aptify DB API, simple True/False membership** | High | Notion |
| 4 | What happens to ~694 uncovered pages during transition? | High | PRD |
| 5 | Is "Save Search Alert" functional or placeholder? | Medium | PRD |
| 6 | How will 1,010+ news items be browsed outside search? | Medium | PRD |
| 7 | Where do Members, Committees, Jobs live in CMS? | Medium | PRD |
| **8** | ~~**Coveo vs Custom Search — which direction?**~~ **RESOLVED: Meilisearch (MIT, self-hosted) replaces Coveo.** See `research-search-solutions.md`. | **High** | Notion |
| **9** | **Are webinar/event/news fields consistent enough for a unified events collection?** | **Medium** | User + Notion |
| **10** | **What is the Annual Report page template?** Content page with rich text? Dedicated template? | **Low** | Notion |
| **11** | **Do we need RSS feed output?** Or is RSS deprecated in the redesign? | **Low** | Notion |
| **12** | **What analytics platform?** GA4, Adobe Analytics, other? | **Low** | Notion |
| **13** | **What is the Sitecore "Standard Page" reauthoring strategy?** Many pages use this template inconsistently. | **Medium** | Template Mapping |
| **14** | **What happens to pages that currently 404/500?** (FAQs, accessibility-policy, etc.) | **Low** | Template Mapping |
