# FRAS Canada — Product Requirements Document (PRD)

> **Version:** 1.0
> **Date:** 2026-03-04
> **Status:** Draft — awaiting stakeholder review
> **Source Documents:** wireframe-specs.md, dogfood-frascanada/site-discovery-verified.md, dogfood-frascanada/wireframe-vs-live-gap-analysis.md

---

## 1. Executive Summary

FRAS Canada is rebuilding frascanada.ca from a legacy Sitecore ASP.NET WebForms CMS to **Payload CMS + Next.js**. The wireframe deliverables (Figma file FRAS-2025-07-22) define a **Phase 1 selective redesign** covering the stakeholder engagement layer — projects, consultations, search, and board overview pages.

**Key scope facts:**
- **Phase 1 wireframes cover:** 6 unique page types (Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search) + global navigation/footer
- **Phase 1 does NOT cover:** 13 of 17 live site templates (~76% of pages)
- **New features in Phase 1:** Faceted search, consultation countdown timers, project timeline stepper, content type badges
- **Technology stack:** Next.js 15 (App Router), Payload CMS 3.x, PostgreSQL, Tailwind CSS v4, Meilisearch

---

## 2. Phasing Strategy

### Phase 1: Wireframed Pages (this PRD)
Build the 6 wireframed page types + global components + CMS infrastructure. This is the stakeholder engagement layer — the most visible, interactive part of the site.

### Phase 2: Remaining Templates (future PRD)
Design and build the 13 uncovered templates: Standards Overview, Content Pages, Members, Committees, Documents for Comment, Effective Dates, Resources, News Listing, Meetings, Contact, Auth, Jobs, Simple Content.

### Phase 3: Content Migration (future PRD)
Migrate ~894 pages, 1,010+ news items, 100+ projects, and all associated media from Sitecore to Payload CMS.

---

## 3. Information Architecture

### 3.1 Navigation Redesign

The live site uses an entity-centric mega-menu (FRAS, Council, Boards, Standards). The wireframe introduces a **function-centric** navigation:

**Desktop Header (3 rows):**
1. **Utility bar:** About Us ▾ | Boards ▾ | Contact | Newsletter | Volunteer | FR | Sign In
2. **Brand bar:** FRAS Canada logo + persistent search input ("Projects, standards, and more...")
3. **Primary nav:** Active Projects ▾ | Open Consultations | News

**Mega-menu dropdowns:**
- About Us: About FRAS Canada, Oversight Council, Research Program, Jobs
- Boards: 4-column layout — CSSB, AcSB, PSAB, AASB — each with 7 sub-pages
  > **Note:** RASOC (Regulatory Authority and Standards Oversight Council) is an oversight body, not a standards board — it appears in the About Us mega-menu as "Oversight Council" and in the footer, but does not have its own Board Detail page, active projects, or search facet entry.
- Active Projects: 4 board links (full names)

**Mobile Header:** Logo + search icon + hamburger → full-screen menu overlay

**Footer (4 columns):**
- FRAS Canada (org name, description, LinkedIn)
- Boards (5 boards including RASOC, using full names)
- Quick Links (About Us, Research Program, News, Jobs, Volunteer, Contact, Newsletter | Site Map, Privacy Policy, Cookie Policy)
- Account (Login, Français)
- Newsletter CTA row
- Copyright bar

### 3.2 URL Structure (Proposed)

| Page | Proposed Route | Live Site Route |
|------|---------------|-----------------|
| Homepage | `/` | `/en` |
| Board Detail | `/boards/:board-slug` | `/en/:board-code` |
| Active Projects | `/active-projects` | `/en/:board/projects` |
| Project Detail | `/active-projects/:board/:project-slug` | `/en/:standard/projects/:slug` |
| Open Consultations | `/open-consultations` | N/A (new) |
| Search Results | `/search?q=...` | `/en/search-results#q=...` |

**Risk:** ~894 URLs need redirect mapping. Recommend building redirect middleware early.

---

## 4. Page Specifications

### 4.1 Homepage

**Route:** `/`
**Layout:** Full-width, 5 sections stacked vertically

**Sections:**
1. **Hero** — H1 "Canada's Official Hub for Financial Reporting Standards" + subtitle + search bar
   > **Note:** Per Notion component specs, this hero search is scoped to Projects only (not sitewide). The sitewide search is accessible via the header search icon. Placeholder text should be updated to reflect project-only scope.
2. **"New to FRAS?" CTA** — intro text + "Get Started" button
3. **Important News & Events** — 3-column grid:
   - Top News (3 items with date, title, board, description)
   - Exposure Drafts (ED numbers, titles, dates)
   - Upcoming Events (date, title, type badge)
4. **Newsletter / Trust** — "Trusted by 3,000+ finance professionals" + email subscribe + LinkedIn CTA
5. **Browse by Standard** — 4-column cards: Sustainability, Accounting, Public Sector, Assurance

**Mobile:** All sections stack vertically. News & Events becomes 3 separate stacked sections. Browse by Standard becomes expandable list cards.

**CMS Global:** `homepage` with editable hero text, CTA content, newsletter text

---

### 4.2 Board Detail Page

**Route:** `/boards/:board-slug`
**Layout:** 3-column — section nav sidebar | main content | right sidebar

**Left Sidebar — Section Nav (7 items):**
Overview (default), Consultations, Projects & Initiatives, Resources, Meetings & Decision Summaries, Committees, Volunteer

**Main Content:**
- **Active Projects** — "View All →" + All Standards filter dropdown + project cards (title, badges, description, stage indicator, action buttons)
- **Most Recent News** — "View All →" + 4 news items (date, title, excerpt, Read More →)

**Right Sidebar:**
- **Quick Actions:** CPA Canada Handbook, View Implementation Tools, Explore Webinars
- **Upcoming Events:** 3 items with date + title + type badge (Webinar, Meeting, Deadline)
- **Resources:** Document links with file type icons (Basis for Conclusions, Implementation Guide, Illustrative Examples)

**Mobile:** 3-column → single column. Section nav → dropdown. Right sidebar content moves below main content.

**CMS Collection:** `boards` with fields: name, slug, description, tabs configuration, quick actions, resources

---

### 4.3 Project Detail Page

**Route:** `/active-projects/:board/:project-slug`
**Layout:** 3-column — section nav sidebar | main content | right sidebar

**Main Content:**
- Breadcrumb: Home / Active Projects / [Board] / [Project Name]
- Board badge + H1 title
- Summary section
- Key Proposals section
- **Configurable Timeline Stepper (up to 7 stages; wireframe shows 5 representative stages):**
  1. Research & Consultation
  2. Engaging Communities
  3. Deliberating Feedback
  4. Approved & Published
  5. Post-Implementation Review
  - Each stage: date, title, description, inline CTA buttons
- Recent Events section
- Recent News section
- Staff Contacts section

**Right Sidebar:**
- Quick Actions (same `<QuickActions />` component as Board Detail, with project-specific content: View Exposure Draft, Submit Comment, etc.)
- Upcoming Events (3 items)
- Resources (document links)

**Mobile:** 3-column → stacked. Timeline stepper becomes vertical. Right sidebar → bottom sections with sticky CTA for Submit Comment.

**CMS Collection:** `projects` with fields: title, slug, board (relationship), standard (relationship), summary, key_proposals (rich text), timeline_stages (array of {phase, date, title, description, ctas}), status, related_documents

---

### 4.4 Active Projects Listing

**Route:** `/active-projects`
**Layout:** 2-column — board nav sidebar | project list

**Left Sidebar — Board Nav:**
- Canadian Sustainability Standards Board
- Accounting Standards Board
- Public Sector Accounting Board (selected)
- Auditing and Assurance Standards Board
> **Note:** RASOC is excluded from Active Projects board nav — it is an oversight body without its own active projects. See Section 3.1 note.

**Project List:**
- Filter bar: "Filter projects by name..." + "All Standards" dropdown
- Projects grouped under collapsible standard headers
- Separate collapsible section: "International Public Sector Accounting Standards Activities"

**Each Project Card:**
- Title (linked)
- Type badges (Exposure Draft, Public Comment, Survey, Research, Re-exposure, Feedback Analysis, Webinar, Initial Research, Implementation, International Coordination, International Input)
- Description text
- Stage indicator: "Stage N: [Stage Name]"
- Action buttons (View Exposure Draft, Comment Summary, View Survey, etc.)

**Mobile:** Board sidebar → dropdown selector. Project cards stack full-width.

**CMS:** Projects filtered by board relationship. Standards grouped via standard relationship.

---

### 4.5 Open Consultations Listing

**Route:** `/open-consultations`
**Layout:** Single column with filter bar

**Filter Bar:** "Filter consultations by name..." text input + "All Boards" dropdown + "All Standards" dropdown

**Each Consultation Card:**
- Title (linked)
- Type badges (Exposure Draft, Survey, Re-exposure Draft)
- Deadline date
- Board full name • Standard name
- Description paragraph
- Action buttons (View Exposure Draft, Basis for Conclusions, Submit Comment, Complete Survey, Background Paper, Implementation Guide, Summary of Changes, View Re-exposure Draft)
- Countdown: "Comments due in X days" (right-aligned)

**Mobile:** Filter bar stacks. Cards full-width.

**CMS Collection:** `consultations` with fields: title, slug, type, deadline_date, board (relationship), standard (relationship), description, action_documents (array of {label, url, type}), related_project (relationship)

---

### 4.6 Search Experience

**Powered by Meilisearch** (self-hosted, MIT license). The front-end uses React InstantSearch via the `instant-meilisearch` adapter, giving access to the full InstantSearch widget ecosystem (SearchBox, RefinementList, Pagination, SortBy, Stats, HitsPerPage).

**Bilingual strategy:** Separate indexes per language (`documents_en`, `documents_fr`, `news_en`, `news_fr`, `events_en`, `events_fr`, `members`, `committees`).

**PDF/Word indexing:** Text extracted via `pdf-parse` (PDF) and `mammoth` (Word) in Payload CMS `afterChange` hooks before indexing to Meilisearch.

**Key features:** Typo-tolerant fuzzy matching, query suggestions, did-you-mean, facet counts, configurable relevance tuning.

**Three components:**

#### 4.6a Search Modal
**Trigger:** Click search input in header
**Overlay:** Full-screen with search input + Recent tags (IFRS 16, Sustainability Standards, ASB Meeting, Public Sector) + Popular tags (IFRS 17, Lease Accounting, ESG Reporting, ASPE Updates, Revenue Recognition) + Search/Cancel buttons

#### 4.6b Search Filters (Facets)
**5-category facet panel** (rendered via `<RefinementList>` InstantSearch widgets):
1. By Board (checkboxes): CSSB, AcSB, PSAB, AASB
   > **Note:** RASOC is excluded from search facets — it is an oversight body, not a standards board. See Section 3.1 note.
2. By Standard (grouped): Sustainability, Accounting (Part I-IV), Public Sector, Assurance
3. Files & Media: All, PDF Files, Word Documents, Video
4. Content Type: Project, News, Document for Comment, Resource, Guidance, Articles, Roundtable, Decision Summaries, Webinar
5. Date Range: Last 30 days, Last 3 months, Last year, All time (via `<RangeInput>` or custom date picker with Meilisearch filters)

#### 4.6c Search Results Page
**Route:** `/search?q=...`
**Layout:** 2-column — filter sidebar (left) + results (right)

**Features:**
- `<SearchBox>` widget with pre-filled query + Meilisearch query suggestions
- Collapsible filter accordion sidebar with facet count badges (via `<RefinementList>`)
- Result cards with: content type badge, board name, date, title, description, file info, CTA link
- Content type badges: Standard (purple), News (dark), Webinar (teal), Meeting Summary (gray), Guidance (dark outline)
- `<Pagination>` widget: "Showing 1-5 of N results" + numbered pages
- `<SortBy>` widget: Relevance (default), Date Ascending, Date Descending
- `<HitsPerPage>` widget for results-per-page control
- Built-in did-you-mean / typo tolerance via Meilisearch

**Mobile:** Filter sidebar → collapsible accordion above results.

**CMS Global:** `search-config` with Meilisearch configuration (host URL, search API key, index names), popular tags, default filters

---

## 5. CMS Architecture

### Meilisearch Integration

Payload CMS syncs collections to Meilisearch via the `payload-meilisearch` plugin (NouanceLabs) with `afterChange` hooks. The plugin handles real-time sync on create/update/delete operations.

**Computed fields synced to Meilisearch:**
- `topicAreaName` — board association label (purple tag), computed from the board relationship during metadata construction
- `toplevelcategory` — content category label, computed from the content type and template metadata

**PDF/Word extraction pipeline:** Upload to Payload → `afterChange` hook → `pdf-parse`/`mammoth` text extraction → push extracted text + metadata to Meilisearch index.

### 5.1 Payload CMS Collections

| Collection | Fields | Relationships |
|-----------|--------|---------------|
| `pages` | title, slug, content (rich text), sidebar_type, meta | — |
| `boards` | name, slug, abbreviation, description, tabs, quick_actions, resources | standards (hasMany) |
| `standards` | name, slug, category (enum), parts | board (belongsTo) |
| `projects` | title, slug, summary, key_proposals, timeline_stages, status, badges, type (enum: Active/Completed), frasIdNumber | board, standard, documents, contacts |
| `consultations` | title, slug, type, deadline_date, description, action_documents, commentPeriodStart (date), commentPeriodEnd (date), frasIdNumber | board, standard, project |
| `news` | title, slug, date, category, excerpt, body, board, frasIdNumber | board |
| `events` | title, slug, date, publishedDate, type (Webinar/Meeting/Deadline), description, registration_url | board |
| `documents` | title, slug, type (ED/Guide/Paper), file, description | board, standard, project |
| `decision-summaries` | title, slug, date, body | board | *(Phase 1 collection definition — listing page template deferred to Phase 2, Epic 20.4)* |
| `contacts` | name, credentials, title, phone, email, photo | — |

### 5.2 Payload CMS Globals

| Global | Purpose | Fields |
|--------|---------|--------|
| `navigation` | Site header + mega-menu config | utility_links, primary_nav, mega_menu_boards |
| `footer` | Footer columns + newsletter | columns, boards_links, quick_links, newsletter_config |
| `homepage` | Homepage content blocks | hero_heading, hero_subtitle, cta_block, newsletter_text |
| `search-config` | Search + Meilisearch configuration | meilisearch_host, meilisearch_search_api_key, index_names (documents_en, documents_fr, news_en, news_fr, events_en, events_fr, members, committees), popular_tags, recent_tags_enabled, default_filters |

---

## 6. Component Architecture

### 6.1 Shared Layout Components
- `<SiteHeader />` — 3-row header with mega-menu
- `<SiteFooter />` — 4-column footer with newsletter
- `<MobileMenu />` — Full-screen mobile nav overlay
- `<Breadcrumb />` — Path-based breadcrumb nav

### 6.2 Search Components
- `<SearchModal />` — Overlay with tags
- `<SearchBar />` — Reusable search input
- `<FilterSidebar />` — 5-category filter panel (desktop) / accordion (mobile)
- `<SearchResultCard />` — Typed result card with badge

### 6.3 Content Components
- `<ProjectCard />` — Title, badges, description, stage, buttons
- `<ConsultationCard />` — Title, badges, deadline, countdown, buttons
- `<ProjectTimeline />` — Configurable vertical stepper (up to 7 stages) with dates and CTAs
- `<NewsItem />` — Date + title + excerpt + Read More
- `<ContentTypeBadge />` — Colored badge (Standard, News, Webinar, etc.)
- `<BrowseByStandard />` — 4-column card grid linking to standards sections (homepage-only)
- `<NewToFRAS />` — CTA block for first-time visitors
- `<CountdownTimer />` — "Comments due in X days" countdown display (Open Consultations)
- `<StaffContacts />` — Staff contact card(s) with name, credentials, title, phone, email (Project Detail, Content Pages)
- `<CollapsibleSection />` — Collapsible/accordion section header for grouping projects by standard (Active Projects)
- `<PromoCardGrid />` — 4-column promotional links to boards (homepage-only one-off component)

### 6.4 Navigation Components
- `<MegaMenu />` — Dropdown variants (single column, 4-column boards)
- `<SectionNav />` — Left sidebar nav for Board/Project detail
- `<BoardNav />` — Left sidebar board selector for Active Projects

### 6.5 Sidebar Components
- `<QuickActions />` — Button list (CPA Handbook, Tools, Webinars)
- `<UpcomingEvents />` — Event cards with date + type badge
- `<ResourcesList />` — Document links with file icons
- `<RecentNews />` — News items with "View All →"

### 6.6 Utility Components
- `<Pagination />` — "Showing X-Y of Z" + page buttons
- `<TagChip />` — Pill/chip for search tags
- `<NewsletterCTA />` — Newsletter email subscribe CTA. Homepage variant includes trust text + LinkedIn social link. Footer variant is simplified (email input + subscribe button only). Both submit to HubSpot CRM.
- `<PageHeader />` — Icon + H1 title pattern

---

## 7. Design Tokens

| Token | Value |
|-------|-------|
| Desktop width | 1440px |
| Mobile width | 390px |
| Font family | Inter |
| Primary button | Dark fill |
| Secondary button | Bordered/outline |
| Ghost button | Text + arrow icon |
| Card style | White bg, subtle border |
| Section bg | Light gray/blue tint |
| Badge: Standard | Purple |
| Badge: News | Dark |
| Badge: Webinar | Teal |
| Badge: Meeting Summary | Gray |
| Badge: Guidance | Dark outline |

---

## 8. Questions (All Resolved)

These must be resolved before or during implementation:

| # | Question | Impact | Suggested Resolution |
|---|----------|--------|---------------------|
| 1 | ~~How do users access 11 Standards sections without top-level nav?~~ | High | **RESOLVED:** Three access paths: (1) Homepage "Browse by Standard" card grid linking to standards overview pages, (2) Board Detail sidebar tabs linking to per-board standards, (3) Search with "Standard" facet filter. No dedicated top-level nav item needed. |
| 2 | ~~What is the bilingual (EN/FR) strategy?~~ | High | **RESOLVED:** Payload CMS i18n plugin (`localization: { locales: ['en', 'fr'], defaultLocale: 'en' }`) + Next.js App Router `[locale]` segment (`app/[locale]/...`). All text/richtext fields localized. FR URL routing via locale prefix. Translation strings in `messages/en.json` and `messages/fr.json`. |
| 3 | ~~What is the authentication strategy?~~ | High | **RESOLVED:** Aptify DB API — direct API calls to Aptify database, simple True/False membership check, form submissions trigger emails, no storage required. Phase 2 implementation. |
| 4 | ~~What happens to ~694 uncovered pages during transition?~~ | High | **RESOLVED:** Next.js middleware redirect map. Create `redirects.ts` config file mapping ~694 old Sitecore URLs to new routes. Use `next.config.js` `redirects()` for static mappings, middleware for pattern-based redirects (e.g., `/en/acsb/*` → `/acsb/*`). 301 permanent redirects for SEO. |
| 5 | ~~Is "Save Search Alert" functional or placeholder?~~ | Medium | **RESOLVED:** Does not exist on live site. Wireframe invention — defer to Phase 2+ as new feature if desired. Requires email service + user accounts. Tracked as potential Phase 2+ feature — not in current build plans. |
| 6 | ~~How will 1,010+ news items be browsed outside search?~~ | Medium | **RESOLVED:** Phase 1 provides basic news listing on Board Detail pages (3 recent items + "View All" link to search with board filter). Phase 2 T12 provides full filtered news listing with server-side pagination via API routes, category pills, sort/date controls. 1,010+ items handled server-side. |
| 7 | ~~Where do Members, Committees, Jobs live in CMS?~~ | Medium | **RESOLVED:** Phase 1 creates placeholder collections (`contacts` only). Phase 2 adds `board-members`, `committees`, `job-postings` collections. No Phase 1 UI needed. |
| 8 | ~~Search solution?~~ | High | **RESOLVED:** Meilisearch (MIT license, self-hosted Docker) replaces Coveo. See Section 4.6 and `research-search-solutions.md` for full analysis. |
| 9 | ~~Are webinar/event/news fields consistent enough for a unified events collection?~~ | Medium | **RESOLVED:** Events and news share similar card patterns. Unified approach: `news` collection for articles, `events` collection for meetings/webinars/deadlines. Both share: title, date, excerpt, board relationship, type badge. Field parity verified — no structural conflict. |
| 10 | ~~What is the Annual Report page template?~~ | Low | **RESOLVED:** Reuse T3B content page pattern (content + section nav sidebar). Route: `/[board]/about/annual-report`. Added as Epic 20.1 in Build Plan Phase 2. (Epic 20 was added to BUILD_PLAN-phase2.md to cover gap pages identified during Notion cross-reference) |
| 11 | ~~Do we need RSS feed output?~~ | Low | **RESOLVED:** Yes, build RSS feed endpoint. Route: `/api/rss` and `/api/rss/[board]`. Added as Epic 20.3 in Build Plan Phase 2. Generates XML feed from news, meetings, documents-for-comment collections. |
| 12 | ~~What analytics platform?~~ | Low | **RESOLVED:** GA4 (Google Analytics 4) via `@next/third-parties` package. Script loaded via `next/script` with `afterInteractive` strategy. Event tracking for search queries, form submissions, document downloads. GTM container as optional wrapper for future tag management. |
| 13 | ~~Standard Page reauthoring strategy?~~ | Medium | **RESOLVED:** Content migration task. Each Standard Page will be audited during content extraction. Pages with side nav get T3B template. Pages without get T3A or basic content page. Reauthoring happens during CMS seed/migration phase, not as a separate template. |

---

## 9. Non-Functional Requirements

- **Performance:** Core Web Vitals passing (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- **Accessibility:** WCAG 2.1 AA compliance
- **SEO:** Server-rendered pages, semantic HTML, structured data (Organization, BreadcrumbList)
- **Responsive:** 390px (mobile) → 1440px (desktop), fluid breakpoints
- **Browser support:** Latest 2 versions of Chrome, Firefox, Safari, Edge
- **i18n:** Payload CMS i18n plugin (`localization: { locales: ['en', 'fr'], defaultLocale: 'en' }`) + Next.js App Router `[locale]` segment. All text/richtext fields localized. Translation strings in `messages/en.json` and `messages/fr.json`.

---

## 10. Integrations

| Integration | Solution | Details |
|---|---|---|
| Search | Meilisearch (self-hosted Docker, MIT license) | React InstantSearch via `instant-meilisearch` adapter. Separate EN/FR indexes. PDF/Word text extraction via `pdf-parse`/`mammoth`. Payload sync via `payload-meilisearch` plugin. |
| Auth | Aptify DB API | Next.js ↔ Aptify direct API calls. Simple member True/False check. Form submissions trigger emails, no storage required. |
| Newsletter | HubSpot CRM | HubSpot API integration for newsletter subscription. |
| CAPTCHA | ReCaptcha | Used on Contact Form and other form submissions. Not image CAPTCHA. |
| Cookie Consent | OneTrust | Cookie consent manager, existing integration from current site. |
| Analytics | GA4 (Google Analytics 4) | GA4 via `@next/third-parties` package. `next/script` with `afterInteractive` strategy. Event tracking for search, forms, downloads. GTM container optional for future tag management. |

---

## 11. Sitecore Dump Cross-Reference

Source: `.ai-reports/sitecore-dump/SYNTHESIS.md` (full analysis of Sitecore 10.2 package exports)

### Collection Field Validation

| Our Collection | Sitecore Template | Status | Notes |
|---|---|---|---|
| `projects` | Project | Confirmed + enriched | Added `frasIdNumber`, `type` (active/completed). Sitecore `timeline_stages` uses child items — we flatten to array. |
| `consultations` | Document for Comment | Confirmed + enriched | Added `frasIdNumber`, `commentPeriodStart`, `commentPeriodEnd`. |
| `news` | Internal/External News Page | Confirmed + enriched | Added `frasIdNumber`. Sitecore has External News variant with URL instead of body. |
| `events` | Meeting Page | Confirmed + enriched | Added `publishedDate` (separate from event date — survey feedback). |
| `contacts` | Staff Contact (Data) | Confirmed | Exact field match. 64 items in Sitecore. |
| `boards` | (tree structure) | Confirmed | 7 boards/councils in Sitecore tree. |
| `standards` | (tree structure) | Confirmed | 9 standards sections in xlsx (we have 11 on live site — 2 additions post-xlsx). |

### Content Volume (from 1GB dump)

~430 news, ~236 projects, ~200 meetings, ~133 documents for comment, ~95 board members, 64 staff contacts, ~52 volunteer opportunities. Total ~1,400+ items excluding Page-Components children.

### Key Sitecore Patterns to Preserve

1. **Single editable zone** — Sitecore's `mainContent` is the only author-editable placeholder (11 allowed controls). Aligns with our template-first page builder.
2. **Board-scoped content** — Content lives under board tree nodes. Board ownership = tree position.
3. **Workflow emails** — Transitions send to `communications@frascanada.ca` + `webtranslation@cpacanada.ca`. Replicate in Epic 22.
4. **Two-layer content** — Pages combine parent item fields + Page-Components child items. Migration must merge these.
5. **Per-locale media** — Single blob, separate alt text per language. Replicate in Payload media collection.
