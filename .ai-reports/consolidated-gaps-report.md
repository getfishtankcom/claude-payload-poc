# FRAS Canada — Consolidated Gaps Report

**Date:** 2026-03-04 (updated 2026-03-05)
**Status:** All gaps identified. PRDs and Build Plans updated (see audit log entries 43-46). Notion sub-page review 100% complete (53/53 pages fetched).
**Sources:** PRD gap analysis (7 open questions) + Notion cross-reference (21 items + 53 sub-pages) + live site browser verification + user input

---

## Executive Summary

Our PRDs and Build Plans cover **17 page templates** across **117 tasks** — but cross-referencing against Notion research docs and live site inspection reveals **23 unincorporated gaps** and **7 architecture corrections** that need to be resolved before implementation begins.

**What's covered:** Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search, Standards Overview, Content Pages, People Listing, Documents for Comment (listing + detail), Effective Dates, Resources, News Listing, Meetings Listing, Committee Index, Contact Form, Authentication (login), Job Opportunities

**What's NOT covered:** See below.

---

## Part 1: Missing Page Types / Templates (7 items)

These exist on the live site or in Notion specs but have NO template in any PRD or build plan.

| # | Page Type | Live URL Example | Description | Priority |
|---|-----------|-----------------|-------------|----------|
| 1 | **Error Pages (404/500)** | `/error-500` | Custom error pages with search + "page has moved" messaging | **High** — every site needs this |
| 2 | **Annual Report Page** | `/en/acsb/about/annual-report` | Linked from board sidebar nav (About > Annual Report). Rich text content page — may be handled by T3 but needs explicit routing | **Medium** |
| 3 | **Event Summary Detail** | `/en/acsb/meetings-and-events/[slug]` | Individual meeting/event detail page with Event Summary Table component. T13 is listing only. | **Medium** |
| 4 | **Volunteer Detail** | Individual volunteer opportunity page | Distinct from volunteer listing (T12 variant) | **Medium** |
| 5 | **Decision Summaries Listing** | — | `decision-summaries` collection exists (Epic 1.8) but no listing page route or template | **Medium** |
| 6 | **Internal/External News Page** | Various — redirects to external links | Sitecore redirect template for external link listings in search results. Items appear in news/search but link externally. | **Low** — can be handled via `externalUrl` field in `news` collection |
| 7 | **RSS Feed Page** | `/news-listings/fras-news-listings-rss` | Sitecore RSS template. Question: is RSS deprecated in redesign? | **Low** — likely deprecated |

---

## Part 2: Missing Forms (6 items)

All member-only forms are behind auth and share the same UI pattern: form submission triggers an email (with attachments where applicable). **No logs, no storage required.**

| # | Form | URL | Auth Required | Description |
|---|------|-----|---------------|-------------|
| 1 | **Register (Create Account)** | `/my-account/register` | No | Separate page from Login. `<AuthLayout />` implies it exists but no page spec or build task. |
| 2 | **Forgot Username** | `/my-account/forgot-username` | No | Separate form page. Currently treated as a link in T16 but is its own page. |
| 3 | **Forgot Password** | `/my-account/forgot-my-password` | No | Same as above. Link + `auth-config` field exist but page not specced. |
| 4 | **Document For Comment Submission** | `/acsb/Submit-Comment` (behind auth) | **Yes** | "No document storage in Sitecore — Email with attachment to email address maintained in CMS." |
| 5 | **Event Registration** | Behind auth | **Yes** | Member-only form. Blank Notion spec — identical UI to Document submission. |
| 6 | **Volunteer Registration of Interest** | Behind auth | **Yes** | "Same UI as Documents for Comment. Visitors upload CV expressing interest." |

**Pattern:** All 3 member-only forms (4, 5, 6) share the same UI. They are form submissions that trigger emails. This can be a single `<MemberActionForm />` component with a `type` prop.

---

## Part 3: Missing Components (3 items)

| # | Component | Description | Where Used |
|---|-----------|-------------|------------|
| 1 | **Event Summary Table** | Tabular meeting/event summary — "replica of existing Summary Table from current site" | Event Summary detail pages |
| 2 | **Meeting Topics Table** | Separate from Effective Dates Table — meeting agenda/discussion topics | Meeting detail pages |
| 3 | **Events Listing (full)** | Board-scoped, up to 3 upcoming events, date-ranked. We have sidebar variant only — need full standalone version. | Board pages, standards pages |

---

## Part 4: Architecture Corrections (7 items)

These are factual corrections from Notion research that have NOT been incorporated into PRDs.

| # | Area | Current PRD Says | Should Be | Impact | Decision Needed? |
|---|------|-----------------|-----------|--------|-------------------|
| 1 | **Search** | Custom-built (5 tasks, Epic 5) | **Meilisearch** (MIT, self-hosted Docker) — RESOLVED | **HIGH** | No — Meilisearch selected. See `research-search-solutions.md` |
| 2 | **Auth** | CPA Canada OAuth/SAML | **Aptify DB API** — direct API calls, Next.js <> Aptify. "We will not leverage the CPA SSO work." | **HIGH** | No — Aptify confirmed in Notion |
| 3 | **Members** | Complex/undefined | **Simple True/False** — member actions are form submissions → email only. No user profiles, no content gating beyond forms. | **MEDIUM** | No — confirmed in Notion |
| 4 | **Newsletter** | Generic email input + Subscribe | **HubSpot** CRM integration | **MEDIUM** | No — HubSpot confirmed |
| 5 | **CAPTCHA** | Custom image CAPTCHA with refresh | **ReCaptcha** (Google reCAPTCHA) | **LOW** | No — ReCaptcha confirmed |
| 6 | **Cookie Consent** | Not in PRD | **OneTrust** Cookie Manager | **LOW** | No — OneTrust confirmed |
| 7 | **Analytics** | Not in PRD | Needs specification — **GA4? Adobe Analytics?** | **LOW** | Yes — platform TBD |

---

## Part 5: Open Questions (21 total — 14 original + 7 from component review)

### Resolved Questions (from research + live site verification)

| # | Question | Resolution |
|---|----------|------------|
| 3 | What is the authentication strategy? | **Aptify DB API** — direct API calls for session validation + member verification. Simple True/False membership. (Source: Notion) |
| 5 | Is "Save Search Alert" functional or placeholder? | **Does NOT exist on live site** — wireframe invention. Phase 2 new feature. (Source: live site browser inspection) |
| 7 | Where do Members, Committees, Jobs live in CMS? | **Fully specified** in Phase 2. `board-members`, `committees`, `job-postings` collections. (Source: BUILD_PLAN-phase2.md) |
| 8 | Coveo vs Custom Search? | **RESOLVED: Meilisearch selected.** MIT-licensed, self-hosted Docker, faceted bilingual search with React InstantSearch widgets. See `research-search-solutions.md`. |

### Partially Resolved Questions

| # | Question | Status | Remaining Decision |
|---|----------|--------|--------------------|
| 1 | How do users access 11 Standards sections without top-level nav? | Workarounds proposed (homepage cards + board sidebar + search) | Design team must confirm Phase 1 bridging strategy |
| 2 | What is the bilingual (EN/FR) strategy? | Infrastructure defined | Who produces French translations? |
| 4 | What happens to ~694 uncovered pages during transition? | 3-tier redirect strategy designed | Proxy pass vs 404s during Phase 1→2? |
| 6 | How will 1,010+ news items be browsed outside search? | Phase 2 fully designed | Add basic news listing to Phase 1? |

### New Questions (from Notion cross-reference)

| # | Question | Impact | Notes |
|---|----------|--------|-------|
| ~~8~~ | ~~**Coveo vs Custom Search?**~~ | ~~**High**~~ | **RESOLVED** — Meilisearch selected. See `research-search-solutions.md`. Moved to Resolved Questions above. |
| 9 | **Are webinar/event/news fields consistent enough for a unified collection?** | **Medium** | User flagged: "if data is same then won't have any issue." Need field parity check during content extraction. |
| 10 | What is the Annual Report page template? | Low | Content page with rich text? Or dedicated template? |
| 11 | Do we need RSS feed output? | Low | Likely deprecated in redesign |
| 12 | What analytics platform? GA4, Adobe Analytics? | Low | |
| 13 | What is the Sitecore "Standard Page" reauthoring strategy? | Medium | Template mapping shows these pages are highly inconsistent — "they almost look authored" |
| 14 | What happens to pages that currently 404/500? | Low | `/FAQs`, `/accessibility-policy`, etc. already broken on live site |

---

## Part 6: Webinar / News / Event Field Parity

**User concern:** "Any webinar page is using the event template with its own news. Check webinar & news page fields — if consistent/data is same then won't have any issue, ideally we can ensure the data is seamless for a singular data source."

**Current state:**
- Our PRDs have separate collections: `news` (Phase 1) and `meetings`/`events` (Phase 1/2)
- Notion's Listing Pages Overview treats News and Events as separate listing destinations
- But the card UI patterns are identical: Title, Description/Excerpt, Date, Type Badge, Board association

**Assessment:** Events Listing component spec confirms events and news share similar card patterns. If Sitecore fields are consistent across webinar events, meeting events, and news items, a unified collection with a `type` enum (News, Meeting Summary, Webinar, International Activity, Document for Comment, Resource) would work.

**Recommendation:** Keep separate collections (`news` and `events`) but ensure:
1. Both have consistent card rendering fields (title, date, excerpt, type, board)
2. Combined listing views (like Board Detail "Recent Activity") can query both collections and merge results
3. Field parity verification during Phase 3 content extraction

---

## Part 7: Consolidated Action Items

### Blocking Decisions (must resolve before implementation)

| # | Decision | Owner | Blocks |
|---|----------|-------|--------|
| ~~1~~ | ~~**Coveo vs Custom Search** — keep Coveo or build Payload search?~~ | ~~Engineering + PM~~ | **RESOLVED** — Meilisearch selected. See `research-search-solutions.md` |
| 2 | **Standards nav bridging** for Phase 1 | Design + PM | Phase 1 nav implementation |
| ~~3~~ | ~~**French translation source**~~ | ~~Client + PM~~ | **RESOLVED** — AI-assisted (Claude API) + manual trigger + dual approval (CMS + external). See `PRD-translation.md` |

### Architecture Updates (confirmed, just need PRD incorporation)

| # | Update | Impact |
|---|--------|--------|
| 4 | Auth → Aptify DB API (not OAuth/SAML) | Update PRD-phase2.md Section 3.12, Section 8 |
| 5 | Members → Simple True/False (not complex usergroups) | Simplifies auth collection |
| 6 | Newsletter → HubSpot integration | Update PRD.md Section 6.6, BUILD_PLAN.md Task 3.5 |
| 7 | CAPTCHA → ReCaptcha (not image CAPTCHA) | Update PRD-phase2.md Section 3.11 |
| 8 | Add OneTrust cookie consent to PRD integrations | Add integration section to PRDs |
| 9 | Add analytics platform to PRD integrations | Add pending platform decision |

### PRD Additions (pages, forms, components to add)

| # | Addition | Phase | Effort |
|---|----------|-------|--------|
| 10 | Error Pages (404/500) template | Phase 1 | Small (1-2 days) |
| 11 | Register, Forgot Username, Forgot Password page specs | Phase 2 | Small (share `<AuthLayout />`) |
| 12 | 3 member-only forms (Doc Comment Submission, Event Registration, Volunteer Registration) | Phase 2 | Medium (single `<MemberActionForm />` component) |
| 13 | Event Summary detail page template | Phase 2 | Small (content page + Event Summary Table) |
| 14 | Decision Summaries listing page | Phase 2 | Small (reuse listing template) |
| 15 | Annual Report page routing | Phase 2 | Minimal (T3 variant with explicit route) |
| 16 | Event Summary Table + Meeting Topics Table components | Phase 2 | Medium |
| 17 | Basic news listing page (Phase 1 gap fix) | Phase 1 | Small (1-2 days) |
| 18 | Internal/External News handling (externalUrl field logic) | Phase 2 | Minimal |

### Lower Priority / Decisions TBD

| # | Item | Notes |
|---|------|-------|
| 19 | RSS feed — keep or deprecate? | Likely deprecate |
| 20 | Analytics platform — GA4? | Needs client input |
| 21 | Standard Page reauthoring strategy | Affects content migration |
| 22 | Proxy pass for uncovered pages during transition | Engineering + infra |
| 23 | Webinar/event/news field parity verification | Phase 3 content extraction |

---

## Revised Scope Impact

If all gaps are incorporated:

| | Phase 1 | Phase 2 | Total |
|---|---------|---------|-------|
| **Current tasks** | 54 | 63 | 117 |
| **New tasks (estimated)** | +3 (error pages, basic news listing, OneTrust) | +12 (auth forms, member forms, event detail, decision summaries listing, components, integrations) | +15 |
| **Revised total** | 57 | 75 | **132** |

---

## Part 8: Component Spec Corrections (from Notion sub-page review, 2026-03-05)

All 53 Notion sub-pages from the RAS Overview have been fetched. Full specs in `dogfood-frascanada/notion-component-specs.md`. Key corrections/additions:

| # | Finding | Impact | Action |
|---|---------|--------|--------|
| 1 | **Hero Banner search is PROJECT-ONLY** — "Limited to just Projects", not sitewide search | Medium | Update PRD hero search scope |
| 2 | **Right Rail Project Actions = Quick Links** — explicitly "See Quick Links", same component | Low | Merge into single component, remove duplicate build task |
| 3 | **Events Card Start Time is WEBINAR-ONLY** — conditional field display | Low | Add conditional logic to Events Card spec |
| 4 | **Promo Card Grid is HOMEPAGE-ONLY** — not reusable | Low | Document as homepage-specific, not a shared component |
| 5 | **Subscribe Banner → HubSpot** confirmed at component level | None | Already captured in architecture corrections |
| 6 | **Project Timeline: up to 7 stages** with tri-state (complete/in-progress/not-started) | Low | Update T2 Project Detail spec with stage limit |
| 7 | **Search modal under debate** — Notion questions its purpose | Medium | Flag for design team: modal vs direct results page |

### New Open Design Questions (from component sub-pages)

| # | Question | Component |
|---|----------|-----------|
| 15 | Need nested/expandable links in left rail? | Left Rail Navigation |
| 16 | External links? Icons? Hover state? Character limits for Quick Links? | Right Rail Quick Links |
| 17 | Are right rail events dynamic or manually curated? | Right Rail Events List |
| 18 | Card height constraints or auto-sizing? | Card Grid |
| 19 | Page title from content tree name or authored field? | Page Header |
| 20 | Drop search modal for direct results page? | Sitewide Search |
| 21 | What defines "Light" vs "Dark" CTA Banner theme? | CTA Banner |

### Notion Sub-Page Coverage Status

| Category | Total | With Content | Blank/Stubs |
|----------|-------|-------------|-------------|
| New Components | 25 | 24 | 1 (Component Summary = meta page) |
| Existing Components | 21 | 6 (screenshots only) | 15 |
| Page Templates | 7 | 2 (Homepage screenshots) | 5 (Sitecore paths only) |
| Forms | 8 | 6 | 2 (Event Reg blank, screenshots-only) |
| New Pages | 4 | 4 | 0 |
| **Total** | **53** | **42** | **23** |

**Conclusion:** All Notion research sub-pages have been reviewed. The 15 blank existing component stubs and 5 stub page templates contain no actionable specs — they are placeholder references to current Sitecore components. All field-level specs and design details have been extracted and documented.

---

## Part 9: Stakeholder Requirements (from kickoff/discovery meeting notes)

These are client requirements from the FRAS discovery meetings. Cross-referenced against existing PRDs below.

### 9.1 Project Context

- **What is FRAS:** Financial Reporting and Standards — the standard-setting body for all accountants across Canada. 2 boards (AcSB, AASB) + 2 councils (PSAB, CSSB), with RASOC as oversight council. "The umbrella for a ton of boards and councils."
- **Original scope:** Only homepage was to be modified with new designs & components. Full site redesign came later.
- **Our PRDs reflect the expanded scope** (full redesign across 17 templates). This is correct.

### 9.2 Homepage Goals & Success Criteria

| Requirement | PRD Status | Gap? |
|-------------|-----------|------|
| **Reduce homepage bounce rate** — currently massive | Not documented as a metric | **Yes** — add to NFRs as measurable success criterion |
| **Content author flexibility** — ability to curate what appears on homepage to drive traffic | Covered — Promo Card Grid, Card Grid, Hero Banner are author-curatable | No |
| **Highlight top news stories and content** — flexible approach to curating content | Covered — News Card component auto-populates 3 most recent | Partial — see carousel below |
| **Carousel component with News Stories** — nice-to-have, could replace alert banner at top | **NOT in PRD** — we have static card grid, no carousel | **Yes** — new component needed |
| **Links to different standards** — client likes these | Covered — Promo Card Grid links to board/standards pages | No |
| **Drive traffic to resources & stories** — homepage as navigation hub | Covered by overall homepage design | No |

### 9.3 Carousel Component Gap

**Client wants:** A carousel/slider for featured news stories that could replace the alert banner at the top of the page.

**Current PRD has:** Static 3-card "Top Stories" grid (News Card component) + Hero Banner. No carousel.

**Complication:** "No visual component to News Stories" — FRAS has image fields in their templates but hasn't been adding images to content. Carousel would need images.

**Action needed:**
1. Add `<FeaturedCarousel />` component to PRD (homepage-only or reusable?)
2. Decide: Does carousel replace Hero Banner, alert banner, or sit between them?
3. Image strategy: require images for featured items? Fallback for items without images?
4. Content authoring: how many carousel items? Auto-populated or manually curated?

### 9.4 Traffic & User Context

| Insight | Impact on PRD |
|---------|--------------|
| **Traffic is mostly direct links** (from social/newsletter), not organic | Homepage is navigation hub, not SEO landing page. Search and internal linking matter more than SEO for homepage. |
| **Homepage isn't the most important page** — linked-to content pages are | Validates Phase 1 focus on Board Detail + Project Detail + Search alongside Homepage |
| **Users:** Financial reporting professionals, auditors, students, anyone interested in standards setting | Already reflected in PRD user personas |
| **Sustainability standards** are a new dimension for FRAS | Already covered — CSSB board + sustainability standards section |

### 9.5 Login Use Cases (confirmed)

| Use Case | Auth Required | PRD Status |
|----------|--------------|-----------|
| Submit comments to "Document for Comment Process" | **Yes** | Phase 2 PRD (T9 + member form) ✅ |
| Newsletter signup & notification preferences (linked to CRM) | **Yes** (for preferences) | Phase 1 Subscribe Banner + HubSpot ✅ (but preferences page NOT specced) |
| Login location should stay as-is (users are familiar) | N/A | Phase 2 PRD (T16) ✅ |

**Gap:** Newsletter notification preferences management page — user can sign up via Subscribe Banner (no auth), but managing preferences requires login + a preferences UI page. **Not specced anywhere.**

### 9.6 Visual & Brand Constraints

| Constraint | PRD Status | Gap? |
|-----------|-----------|------|
| No major visual changes or deviations from brand standards | Design tokens doc reflects current brand | No |
| **Logo removal from homepage** — Megan to confirm if logos can be removed and users can still navigate to standards | **Decision pending** | **Yes** — Promo Card Grid currently has board logos. Need confirmation. |
| Better category tagging/visuals on news stories (badge, subheading, Coveo facets) | Covered — News Card has Type Badge field | No |
| WCAG 2.1 AA compliance | Already in NFRs | No |

### 9.7 Cross-Reference Summary: New Gaps from Stakeholder Notes

| # | Gap | Priority | Phase |
|---|-----|----------|-------|
| 1 | **Carousel/Featured News component** — not in any PRD | Medium | Phase 1 (homepage) |
| 2 | **Homepage bounce rate** — no measurable success criterion in NFRs | Low | Phase 1 |
| 3 | **Newsletter preferences page** — signup exists but preferences management doesn't | Medium | Phase 2 |
| 4 | **Logo removal decision** — pending Megan confirmation | Low | Phase 1 (blocks Promo Card Grid final design) |
| 5 | **News image strategy** — carousel needs images but content doesn't have them | Medium | Phase 1 (blocks carousel) |

---

## Part 10: Sitecore Dump & UX Research Findings (2026-03-04)

Full analysis in `sitecore-dump-analysis.md`. Sources: Architecture XLSX, Website Survey (~75 respondents), 6 Journey Map PDFs, Opportunity Mapping PDF, Branding Guidelines PDF (Feb 2017).

### 10.1 Journey Map Personas (6 total)

| Persona | Role | Usage | Top Pain Point |
|---------|------|-------|---------------|
| Amanda | PSAB board member/vice-chair | Regular | Site inaccessible for non-experts, no onboarding |
| Chris | AcSB board member/vice-chair | Regular | Uses Google instead of FRAS search, 403 errors |
| Melissa | Manager, National Account Standards | Weekly | Unreliable comment submission, scattered docs |
| Mohamed | Accountant, 10+ years policy | Monthly | Prefers Deloitte IAS Plus layout, dead pages |
| Philip | CFO, 30+ years | Regular | Buried CTAs (dark purple area = "page is over") |
| Shari | Lecturer, U of Waterloo, 20+ years | Frequent | Resources scattered, avoids search, prefers IFRS layout |

### 10.2 New Gaps from UX Research

| # | Gap | Source | Priority | Phase |
|---|-----|--------|----------|-------|
| 1 | **"Start Here" onboarding section** — glossary, acronyms, simplified explanations | Amanda | Medium | Phase 1 |
| 2 | **PDF file-type filter in search** | Chris | Low | Phase 1 |
| 3 | **"Recently Published" sort on news** — sort by post date not meeting date | Melissa | Medium | Phase 2 |
| 4 | **Project completion announcements** | Mohamed | Low | Phase 2 |
| 5 | **Quick-share / copy-link feature** | Amanda | Low | Phase 1 |
| 6 | **Board-specific brand colors** — blue #00438C (councils), red-brown #983232 (boards) not in tokens | Branding Guide | Medium | Phase 1 |
| 7 | **French logo names** — NIFC, CNAC, CCSP, CNC, CSNAC, CSNC | Branding Guide | Medium | Phase 1 |
| 8 | **AASOC/AcSOC → RASOC reconciliation** — 2017 guide shows 2 councils, site has 1 | Branding Guide | Low | Clarification |

### 10.3 Brand Font Decision (New Data Point)

Official brand font is **Arial** (2017 guidelines). Live site uses **Roboto**. Wireframes use **Inter**. Three-way conflict — design team decision needed.

### 10.4 Key Validation: Our PRDs Address Core Pain Points

All 6 personas' top frustrations (broken search, confusing navigation, scattered documents, unreliable forms, buried CTAs) are directly addressed by our Phase 1 + Phase 2 design. The rebuild fundamentally fixes the universal pain points.

---

*Generated 2026-03-04, updated 2026-03-05. Cross-references: PRD.md, PRD-phase2.md, BUILD_PLAN.md, BUILD_PLAN-phase2.md, notion-research-cross-reference.md, research-resolution-open-questions.md, site-discovery-verified.md, dogfood-frascanada/notion-component-specs.md, sitecore-dump-analysis.md*
