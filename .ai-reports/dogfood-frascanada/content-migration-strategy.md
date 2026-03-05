# FRAS Canada — Content Migration Strategy

| Field | Value |
|-------|-------|
| **Date** | 2026-03-04 |
| **Phase** | Phase 3 — Content Migration |
| **Source System** | Sitecore CMS (ASP.NET WebForms) at https://www.frascanada.ca/ |
| **Target System** | Payload CMS 3.x + Next.js 15 (App Router) + PostgreSQL |
| **Source Documents** | site-discovery-verified.md, url-registry.md, wireframe-vs-live-gap-analysis.md, PRD.md |
| **Status** | Draft — awaiting stakeholder review |

---

## Table of Contents

1. [Migration Scope](#1-migration-scope)
2. [Source System Analysis](#2-source-system-analysis)
3. [Data Extraction Pipeline](#3-data-extraction-pipeline)
4. [Data Transformation](#4-data-transformation)
5. [URL Redirect Strategy](#5-url-redirect-strategy)
6. [Migration Phases](#6-migration-phases)
7. [Risk Register](#7-risk-register)
8. [Tooling](#8-tooling)
9. [Validation & Acceptance Criteria](#9-validation--acceptance-criteria)

---

## 1. Migration Scope

### 1.1 Content Inventory Summary

The live site contains **2,090 discovered URLs** (1,069 EN + 1,015 FR + 6 other) classified into **36 page types**. The following table breaks down the content that must be extracted and migrated.

| Content Type | Estimated Count | Source URL Pattern | Target CMS Collection | Priority |
|-------------|----------------|-------------------|----------------------|----------|
| **News Items** | ~1,010+ | `/en/news-listings`, `/en/{board}/news-listings/{slug}` | `news` | High (largest volume) |
| **Meetings & Events** | ~900+ (180+ per board × 5 boards) | `/en/{board}/meetings-and-events` (paginated, PostBack) | `events` + `decision-summaries` | High |
| **Projects** | ~100+ | `/en/{standard}/projects/{slug}` | `projects` | Critical (Phase 1 page) |
| **Documents for Comment** | ~50+ | `/en/{standard}/documents/{slug}` | `consultations` + `documents` | Critical (Phase 1 page) |
| **Resources** | ~100+ | `/en/{standard}/resources` (paginated) | `documents` | Medium |
| **Members** | ~50+ across boards | `/en/{board}/about/members` | `contacts` (extended) | Medium |
| **Committees** | ~25+ across boards | `/en/{board}/committees`, `/en/{board}/committees/{slug}` | New `committees` collection | Medium |
| **Standards Pages** | 11 sections × ~5 sub-pages each = ~55 | `/en/{standard}`, `/en/{standard}/projects`, `/en/{standard}/documents`, `/en/{standard}/effective-dates`, `/en/{standard}/resources` | `standards` + `pages` | High |
| **Board/Council Pages** | 5 landings + ~40 sub-pages | `/en/{board}`, `/en/{board}/about/*` | `boards` + `pages` | Critical |
| **Static Content Pages** | ~50+ | `/en/about`, `/en/research-program`, `/en/contact-us`, etc. | `pages` | Medium |
| **Job/Volunteer Opportunities** | Variable (currently ~0 jobs, ~5-10 volunteer) | `/en/job-opportunities`, `/en/{board}/volunteer-opportunities` | New `job-postings` + `pages` | Low |
| **Effective Dates Tables** | 11 (one per standard) | `/en/{standard}/effective-dates` | New `effective-dates` collection or embedded in `standards` | Medium |
| **Media Assets** | Unknown (est. 200-500) | Various (images, PDFs, linked docs) | Payload Media library | High (dependency for all content) |

### 1.2 Bilingual Content Scope

Every content item exists in both English and French. The crawler discovered:
- **1,069 EN URLs** under `/en/` paths
- **1,015 FR URLs** under `/fr/` paths
- **6 other URLs** (root, language redirect, etc.)

The ~54 URL discrepancy between EN and FR suggests some content exists in only one language, or FR URLs use different slugs that the crawler missed. Bilingual pairing is a critical part of the extraction pipeline.

**FR URL patterns identified in the classifier:**
- FR board slugs: `ccnid` (CSSB), `cnc` (AcSB), `ccsp` (PSAB), `cnac` (AASB)
- FR council slugs: `cosrf`, `rasoc` (shared)
- FR section slugs: `durabilite`, `normesifrs`, `ncecf`, `obnl`, `regimes-de-retraite`, `secteur-public`, `secteur-public-international`, `ncmc`, `nca`, `ncad`, `autres`
- FR path segments: `projets`, `documents`, `dates-dentree-en-vigueur`, `ressources`, `comites`, `a-propos`, `membres`

### 1.3 Content Not In Scope

The following content is **not** being migrated:
- **User accounts / authentication data** — CPA Canada federated auth; no user data stored in Sitecore
- **Form submissions** — Historical contact form submissions stay in legacy system
- **Analytics / tracking data** — Stays with analytics provider
- **Cookie consent configuration** — OneTrust third-party; reconfigure, not migrate
- **Search index** — Rebuilt from scratch in target system

---

## 2. Source System Analysis

### 2.1 Platform Characteristics

| Characteristic | Details | Migration Impact |
|---------------|---------|-----------------|
| **CMS** | Sitecore CMS | No public API; must scrape rendered HTML |
| **Framework** | ASP.NET WebForms | PostBack pagination — standard HTTP GET crawling will not paginate listings |
| **Server** | IIS behind Cloudflare | Bot protection may block automated scraping |
| **Sitemap** | `sitemap.xml` returns 404 | Cannot rely on sitemap for URL discovery; must crawl links |
| **Content Delivery** | Server-rendered HTML | Content is in the DOM, not loaded via JavaScript APIs |
| **Form State** | `__VIEWSTATE`, `__EVENTVALIDATION`, `__VIEWSTATEGENERATOR` | Required hidden fields for PostBack pagination; must be captured and submitted |
| **URL Structure** | `/en/{board-or-standard}/{section}/{slug}` | Hierarchical, language-prefixed; maps cleanly to content types |
| **Bilingual** | Full EN/FR mirror with `/en/` and `/fr/` prefix | hreflang tags link EN↔FR pairs; use for automatic pairing |

### 2.2 ASP.NET PostBack Pagination

The single largest extraction challenge is that **listing pages use ASP.NET PostBack** for pagination, filtering, and sorting. This means:

1. **You cannot simply increment a page number in the URL.** Pagination is triggered by JavaScript `__doPostBack()` calls that submit hidden form fields back to the server.
2. **Each page navigation requires maintaining session state.** The `__VIEWSTATE` field is a Base64-encoded blob that changes with every page load.
3. **Filter interactions (category pills, sort order, items per page) also use PostBack.** Selecting "All Items" or changing sort order is a form submission, not a URL change.

**Affected listing pages:**
- News Listings (101 pages × 10 items = ~1,010 items) — HIGHEST VOLUME
- Meetings & Events per board (18+ pages per board × 5 boards)
- Resources per standard (varies, paginated)
- Documents for Comment (Open/Closed tabs via `?tab=closed-for-comment` query param — this one uses URL, not PostBack)
- Project Listing (Active/Completed/Deferred pill toggles — likely PostBack)
- Volunteer Opportunities (board tab toggles — likely PostBack)

**Extraction approach:** Playwright browser automation is mandatory. The existing `scripts/crawl-sitemap.mjs` already uses Playwright for link discovery. Per-content-type extraction scripts must:
1. Navigate to the listing page
2. Read the initial page items
3. Locate the pagination control
4. Click each page number (triggering PostBack)
5. Wait for the DOM to update (ASP.NET partial postback or full page reload)
6. Extract items from the updated listing
7. Repeat until all pages are exhausted

### 2.3 Cloudflare Bot Protection

The live site is served through Cloudflare. Observations from the existing crawler:
- Standard Playwright requests with default headers succeed for initial page loads
- Rapid sequential requests may trigger Cloudflare challenge pages
- No Cloudflare Turnstile CAPTCHA has been observed (yet), but rate limiting is possible

**Mitigation strategies:**
- Rate limiting: 1-2 second delay between page navigations
- Realistic User-Agent header (already set in existing scripts)
- Session persistence: reuse Playwright browser context across pages
- Retry with exponential backoff on 403/challenge responses
- If Cloudflare blocks: consider extracting during low-traffic hours, or requesting temporary IP allowlisting from FRAS Canada IT

### 2.4 Content Structure in the DOM

Based on the verified site discovery and inspector v2 findings, content lives in predictable Sitecore-generated DOM structures:

| DOM Element | Sitecore Pattern | Content |
|------------|-----------------|---------|
| `#main-title-container` | Section title block | Board/Standard name |
| `#second-title-container` | Page title | H1 page title |
| `#second-navigation-container` | Tab navigation | Section tabs (Overview, Projects, Documents, etc.) |
| `#breadcrumb-container` | Breadcrumbs | Navigation path |
| `#maincontent_N_fieldName` | Sitecore field controls | Rich text content, dates, labels |
| `.purple-info-container` | CTA blocks | Dark purple call-to-action sections |
| `.new-meetings-news-container` | Listing feeds | Meeting summaries, news items |
| `.rte-wrapper` | Rich text editor output | Body content (HTML with embedded styles) |
| `#biography-container` | Member profiles | Name, credentials, appointment dates |
| `role="presentation"` divs | Non-semantic tables | Documents for Comment, Effective Dates tables |

---

## 3. Data Extraction Pipeline

### 3.1 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Extraction Pipeline                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. URL Discovery (DONE)                                │
│     └── crawl-sitemap.mjs → 2,090 URLs in              │
│         data/sitemap-urls.json                          │
│                                                         │
│  2. Page Classification (DONE)                          │
│     └── classify-pages.mjs → 36 types in               │
│         data/page-types.json                            │
│                                                         │
│  3. Per-Type Content Extraction (NEW)                   │
│     ├── extract-news.mjs                                │
│     ├── extract-projects.mjs                            │
│     ├── extract-documents.mjs                           │
│     ├── extract-meetings.mjs                            │
│     ├── extract-resources.mjs                           │
│     ├── extract-members.mjs                             │
│     ├── extract-committees.mjs                          │
│     ├── extract-standards.mjs                           │
│     ├── extract-static-pages.mjs                        │
│     ├── extract-effective-dates.mjs                     │
│     └── extract-media.mjs                               │
│                                                         │
│  4. Bilingual Pairing                                   │
│     └── pair-bilingual.mjs → matches EN↔FR by           │
│         hreflang tags + URL slug mapping                 │
│                                                         │
│  5. Data Transformation                                 │
│     └── transform-to-payload.mjs → converts raw         │
│         extracted data to Payload CMS import format      │
│                                                         │
│  6. Media Download                                      │
│     └── download-media.mjs → downloads images,          │
│         PDFs, linked documents to local storage          │
│                                                         │
│  7. Payload CMS Import                                  │
│     └── import-to-payload.mjs → uses Payload            │
│         Local API to create collections + upload media   │
│                                                         │
│  8. Validation                                          │
│     └── validate-migration.mjs → compares source        │
│         vs target content counts, link integrity,        │
│         bilingual pairing, media references              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Content Extraction Scripts — Per Content Type

#### 3.2a News Items (`extract-news.mjs`)

**Source:** `/en/news-listings` (global) + `/en/{board}/news-listings` (board-filtered)
**Volume:** ~1,010 items across 101 pages
**Pagination:** ASP.NET PostBack — must click page numbers via Playwright

**Extraction strategy:**
1. Navigate to `/en/news-listings`
2. Set "Items per page" to "All" via PostBack (if available; reduces pagination to 1 page)
3. If "All" not feasible, paginate through all 101 pages clicking page numbers
4. For each item on the listing, extract: date, categories, title, URL, excerpt
5. Visit each item's detail URL to extract: full body HTML, related board, images
6. Extract the FR equivalent via hreflang tag on each detail page

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | `#second-title-container h1` or listing H2 link text | String |
| date | Listing date text (format: "March 4, 2026") | Date |
| categories | Category tag spans on listing item | String[] |
| excerpt | Listing paragraph text | String |
| body | `.rte-wrapper` innerHTML on detail page | Rich Text (HTML) |
| board | Derived from URL path segment or category tags | Relationship |
| external_url | `<a>` href if external link icon present | URL (optional) |
| fr_url | `<link rel="alternate" hreflang="fr">` | String |

#### 3.2b Projects (`extract-projects.mjs`)

**Source:** `/en/{standard}/projects/{slug}` (detail pages) + `/en/{standard}/projects` (listing)
**Volume:** ~100+ projects
**Pagination:** Project listing uses Active/Completed/Deferred pill toggles (likely PostBack)

**Extraction strategy:**
1. For each of the 11 standards, navigate to `/en/{standard}/projects`
2. Click each pill toggle (Active, Completed, Deferred) to get all projects
3. From each listing, extract project URLs
4. Visit each project detail page to extract full data
5. Parse the 5-phase Project Status Timeline from the detail page

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | H1 on detail page | String |
| slug | URL path segment | String |
| summary | H2 "Summary" section paragraphs | Rich Text |
| status | Derived from which pill toggle (Active/Completed/Deferred) | Enum |
| standard | Derived from URL path (`/en/{standard}/`) | Relationship |
| board | Derived from standard → board mapping | Relationship |
| timeline_stages | Project Status Timeline table — 5 phases with status | Array of objects |
| staff_contacts | Staff Contact(s) sidebar | Array of objects |
| related_news | "News" section H2 links | Relationship[] |
| related_meetings | Meeting summaries section links | Relationship[] |
| disclaimer | Disclaimer block text | Rich Text (optional) |
| fr_url | hreflang alternate link | String |

#### 3.2c Documents for Comment (`extract-documents.mjs`)

**Source:** `/en/{standard}/documents` (listing) + `/en/{standard}/documents/{slug}` (detail)
**Volume:** ~50+ documents
**Pagination:** Open/Closed tab via `?tab=closed-for-comment` query param (URL-based, not PostBack)

**Extraction strategy:**
1. For each standard, navigate to `/en/{standard}/documents`
2. Extract all items from the "Open" tab
3. Navigate to `?tab=closed-for-comment` and extract all items from the "Closed" tab
4. Visit each detail page for full content extraction

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | H1 on detail page | String |
| slug | URL path segment | String |
| type | Section header in listing ("Exposure Drafts", "Consultation Papers") | Enum |
| status | Open/Closed (which tab it appears on) | Enum |
| highlights | "Highlights" section content | Rich Text |
| body | Main rich text content | Rich Text |
| deadline_date | "When to Reply" bold date | Date |
| how_to_reply | Dark purple CTA block content | Rich Text |
| support_materials | Support Materials links | Array of {label, url} |
| staff_contacts | Staff Contact(s) sidebar | Array of objects |
| standard | URL path segment | Relationship |
| board | Standard → board mapping | Relationship |
| fr_url | hreflang alternate link | String |

#### 3.2d Meetings & Events (`extract-meetings.mjs`)

**Source:** `/en/{board}/meetings-and-events` (listing, PostBack paginated)
**Volume:** ~900+ across 5 boards (180+ per board × 5)
**Pagination:** ASP.NET PostBack with Upcoming/Past tab toggle

**Extraction strategy:**
1. For each board, navigate to `/en/{board}/meetings-and-events`
2. Click "Past meetings & events" tab (PostBack)
3. Paginate through all pages (18+ pages for AcSB alone)
4. Click "Upcoming meetings & events" tab
5. Extract all items from upcoming
6. For each item, extract: title, date (embedded in title), excerpt, detail URL
7. Visit detail pages for full content (meeting summaries / decision summaries)

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | H2 link text on listing / H1 on detail | String |
| date | Extracted from title text (e.g., "January 22, 2026") or listing date | Date |
| type | Derived: Meeting Summary, Decision Summary, Meeting Minutes (board-specific terminology) | Enum |
| excerpt | Listing paragraph | String |
| body | Detail page rich text | Rich Text |
| board | URL path segment | Relationship |
| is_upcoming | Which tab it appeared on | Boolean |
| fr_url | hreflang alternate link | String |

#### 3.2e Resources (`extract-resources.mjs`)

**Source:** `/en/{standard}/resources` (listing, paginated)
**Volume:** ~100+ items across 11 standards
**Pagination:** ASP.NET PostBack with category pills and sort/filter bar

**Extraction strategy:**
1. For each standard, navigate to `/en/{standard}/resources`
2. Set "Items per page" to "All" via PostBack if available
3. Otherwise paginate through all pages
4. Cycle through category pills if needed (Article, Guidance, In Brief, Other, Webinar) to ensure complete coverage
5. Extract listing data; visit detail pages for full content

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | Listing H2 link / detail H1 | String |
| date | Listing date text | Date |
| categories | Category tag text (Article, Guidance, In Brief, Other, Webinar) | String[] |
| excerpt | Listing paragraph | String |
| body | Detail page rich text (if detail page exists) | Rich Text |
| resource_type | Filter dropdown type (Audio, External Link, PDF, Video, Webpage, Plain Language) | Enum |
| url | External URL or internal detail page | URL |
| standard | URL path segment | Relationship |
| board | Standard → board mapping | Relationship |
| fr_url | hreflang alternate link | String |

#### 3.2f Members (`extract-members.mjs`)

**Source:** `/en/{board}/about/members`
**Volume:** ~50+ members across 5 boards
**Pagination:** None — all members shown on single page per board

**Extraction strategy:**
1. Navigate to each board's members page
2. Extract all member cards from the 2-column grid
3. Parse each card for photo URL, name, credentials, appointment dates, role

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| name | Member card name link text | String |
| credentials | Text after name (e.g., "CPA, CA") | String |
| photo | Member card `<img>` src (205×205px) | Media |
| appointment_date | Appointment date table cell | Date |
| role | Role label text (e.g., "CHAIR") | String |
| board | Derived from URL path | Relationship |
| section_group | Section heading that groups members (e.g., "Board Members", "Ex-Officio Members") | String |
| fr_url | hreflang alternate link | String |

#### 3.2g Committees (`extract-committees.mjs`)

**Source:** `/en/{board}/committees` (index) + `/en/{board}/committees/{slug}` (detail)
**Volume:** ~25+ committees (13 for AcSB alone)
**Pagination:** None — single page per board index

**Extraction strategy:**
1. Navigate to each board's committee index page
2. Extract all committee entries (name, description, URL)
3. Visit each committee detail page for full content

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| name | Committee name (link text on index, H1 on detail) | String |
| slug | URL path segment | String |
| description | Index page paragraph / detail page body | Rich Text |
| board | Derived from URL path | Relationship |
| members | If committee has member listing | Relationship[] (optional) |
| meeting_reports | Sub-pages like `/ifrsdg/ifrsdg-meetings/` | Array of objects (optional) |
| fr_url | hreflang alternate link | String |

#### 3.2h Standards Overview Pages (`extract-standards.mjs`)

**Source:** `/en/{standard}` (11 sections, each with 5-6 tabs)
**Volume:** 11 overview pages + ~44 sub-tab pages
**Pagination:** None on overview; sub-tabs are separate pages

**Extraction strategy:**
1. Navigate to each of the 11 standard overview pages
2. Extract: section name, intro content, active projects table
3. Navigate to each tab page and extract tab-specific content
4. Map each standard to its parent board

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| name | H1 / section title | String |
| slug | URL path segment | String |
| category | Derived: Sustainability, Accounting, Public Sector, Assurance | Enum |
| overview_content | Overview tab rich text | Rich Text |
| active_projects | Data table rows | Relationship[] |
| board | Mapped: CSSB→sustainability, AcSB→ifrsstandards/aspe/nfpos/pensions, PSAB→public-sector/public-sector-international, AASB→csqc/cas/cass/other | Relationship |
| tabs | Array of tab configs | Array |
| fr_url | hreflang alternate link | String |

#### 3.2i Static Content Pages (`extract-static-pages.mjs`)

**Source:** Various — `/en/about`, `/en/research-program`, `/en/{board}/about/*`, etc.
**Volume:** ~50+ pages
**Pagination:** None

**Extraction strategy:**
1. Filter URL registry for page types: `static-page`, `board-about`, `council-about`, `council-subpage`
2. Visit each page
3. Extract title, breadcrumbs, body content, sidebar type (Staff Contact vs Section Nav)

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| title | H1 | String |
| slug | URL path | String |
| body | `.rte-wrapper` or main content area | Rich Text |
| sidebar_type | Presence of Staff Contact vs Section Nav | Enum |
| sidebar_content | Staff contacts or nav links | Object |
| parent_board | Derived from URL path if under a board | Relationship (optional) |
| fr_url | hreflang alternate link | String |

#### 3.2j Effective Dates (`extract-effective-dates.mjs`)

**Source:** `/en/{standard}/effective-dates`
**Volume:** 11 tables (one per standard)
**Pagination:** None — single page per standard

**Extraction strategy:**
1. Navigate to each standard's effective dates page
2. Parse the non-semantic table markup (`role="presentation"` divs)
3. Extract section headers (purple rows), column headers, and cell content
4. Preserve rich text formatting (italic standard names, bullet lists, footnotes)

**Fields to extract:**
| Field | DOM Source | Type |
|-------|-----------|------|
| standard | URL path segment | Relationship |
| disclaimer_text | Intro disclaimer paragraph | Rich Text |
| sections | Purple header rows | Array of {heading, rows[]} |
| section.rows | Table row data | Array of {application, pronouncement} |
| fr_url | hreflang alternate link | String |

#### 3.2k Media Assets (`extract-media.mjs`)

**Source:** Embedded in all content types — images, PDFs, linked documents
**Volume:** Estimated 200-500 assets

**Extraction strategy:**
1. Run after all content extraction is complete
2. Scan all extracted HTML for `<img>` src, `<a>` href pointing to `.pdf`, `.doc`, `.docx`, `.ppt`, etc.
3. Deduplicate URLs
4. Download each asset to local `data/media/` directory
5. Generate a media manifest mapping source URLs to local paths

**Asset types:**
- Member portrait photos (205×205px JPGs)
- Board/section logo SVGs (white, for hero banners)
- PDF documents (Exposure Drafts, Basis for Conclusions, Implementation Guides, etc.)
- External link targets (not downloaded, just catalogued)

### 3.3 Bilingual Content Pairing (`pair-bilingual.mjs`)

Every extracted content item must be paired with its French equivalent. The pairing strategy:

1. **Primary method — hreflang tags:** Each EN page contains `<link rel="alternate" hreflang="fr" href="...">`. Extract this during content extraction for automatic pairing.
2. **Fallback method — URL slug mapping:** Use the known FR slug translations (from `classify-pages.mjs`) to construct the expected FR URL from the EN URL:
   - `/en/acsb/` → `/fr/cnc/`
   - `/en/ifrsstandards/projects/` → `/fr/normesifrs/projets/`
   - `/en/sustainability/documents/` → `/fr/durabilite/documents/`
3. **Validation:** Compare EN and FR content counts per type. Flag mismatches for manual review.

### 3.4 Rate Limiting and Bot Protection Handling

```
Configuration:
  - Base delay between requests: 1500ms
  - Delay between PostBack navigations: 2000ms
  - Max concurrent pages: 1 (sequential to avoid detection)
  - Retry on 403/challenge: 3 attempts with exponential backoff (5s, 15s, 45s)
  - Session persistence: reuse single Playwright browser context
  - User-Agent: realistic Chrome UA string
  - Viewport: 1440x900 (match real desktop)
  - Cookie handling: accept all cookies automatically
  - Circuit breaker: if 5 consecutive 403s, pause 5 minutes then retry
```

---

## 4. Data Transformation

### 4.1 Field Mapping — Projects (Sitecore → Payload CMS)

| Sitecore Source | Payload CMS Field | Transform |
|----------------|-------------------|-----------|
| H1 text | `title` (String) | Trim whitespace |
| URL slug | `slug` (String) | Extract last path segment, lowercase, kebab-case |
| Summary section HTML | `summary` (Rich Text) | Clean ASP.NET markup → sanitized HTML → Payload Slate/Lexical nodes |
| Active/Completed/Deferred pill | `status` (Enum: active, completed, deferred) | Map pill text to enum value |
| Standard URL segment | `standard` (Relationship → standards) | Lookup by slug |
| Standard → Board mapping | `board` (Relationship → boards) | Derived from standard.board |
| Project Status Timeline table | `timeline_stages` (Array) | Parse 5 phases: extract phase name, status (complete/in-progress/future), description, date |
| Staff Contact(s) sidebar | `contacts` (Relationship[] → contacts) | Extract name, credentials, title, phone, email; create/find Contact record |
| News section links | Related news via tag/relationship | Create relationships after news import |
| Disclaimer block text | `disclaimer` (Rich Text, optional) | Preserve black-bg disclaimer text |
| hreflang FR URL | `locale: fr` variant | Import FR version as locale variant |

### 4.2 Field Mapping — News Items (Sitecore → Payload CMS)

| Sitecore Source | Payload CMS Field | Transform |
|----------------|-------------------|-----------|
| H2 link text (listing) / H1 (detail) | `title` (String) | Trim whitespace |
| URL slug | `slug` (String) | Extract last path segment |
| Listing date text | `date` (Date) | Parse "March 4, 2026" → ISO 8601 |
| Category tag spans | `category` (Enum) | Map: "Document for Comment", "International Activity", "Meeting Summary", "News", "Resource" |
| Listing excerpt | `excerpt` (String) | Trim to ~250 chars |
| Detail page `.rte-wrapper` HTML | `body` (Rich Text) | Clean ASP.NET markup |
| URL board segment | `board` (Relationship → boards) | Lookup if board-specific URL; null for global news |
| External link href | `external_url` (URL, optional) | Preserve if present |

### 4.3 Field Mapping — Documents for Comment (Sitecore → Payload CMS)

| Sitecore Source | Payload CMS Field | Transform |
|----------------|-------------------|-----------|
| H1 text | `title` (String) | Trim |
| URL slug | `slug` (String) | Extract last segment |
| Section header in listing | `type` (Enum: exposure-draft, consultation-paper, re-exposure-draft) | Map section header text |
| Open/Closed tab | `status` (Enum: open, closed) | Which tab listing appears on |
| Highlights section | `highlights` (Rich Text) | Clean markup |
| Body content | `body` (Rich Text) | Clean markup, preserve blockquoted questions |
| Bold deadline date | `deadline_date` (Date) | Parse "April 20, 2026" → ISO 8601 |
| Dark purple CTA block | `how_to_reply` (Rich Text) | Preserve mailing address + contact info |
| Support Materials links | `support_materials` (Array of {label, url, type}) | Extract link text + href + file extension |
| Standard URL segment | `standard` (Relationship) | Lookup by slug |
| Standard → Board | `board` (Relationship) | Derived |

### 4.4 Field Mapping — Meetings & Events (Sitecore → Payload CMS)

| Sitecore Source | Payload CMS Field | Transform |
|----------------|-------------------|-----------|
| H2/H1 title | `title` (String) | Trim |
| Date from title or listing | `date` (Date) | Parse embedded date from title text |
| Board meeting terminology | `type` (Enum: meeting-summary, decision-summary, meeting-minutes) | Map per board: AcSB/PSAB/AASB→"Meeting Summary", CSSB→"Decision Summary", RASOC→"Meeting Minutes" |
| Listing excerpt | `excerpt` (String) | Trim |
| Detail page body | `body` (Rich Text) | Clean markup |
| Board URL segment | `board` (Relationship) | Lookup by slug |
| Upcoming/Past tab | `is_upcoming` (Boolean) | True if on Upcoming tab |

### 4.5 Field Mapping — Members (Sitecore → Payload CMS)

| Sitecore Source | Payload CMS Field | Transform |
|----------------|-------------------|-----------|
| Member card name | `name` (String) | Trim |
| Post-name text | `credentials` (String) | e.g., "CPA, CA" |
| Card photo `<img>` src | `photo` (Media) | Download, upload to Payload media library |
| Appointment date cell | `appointment_date` (Date) | Parse date format |
| Role label | `role` (String) | e.g., "CHAIR", "VICE-CHAIR" |
| Board URL segment | `board` (Relationship) | Lookup by slug |
| Section heading | `section_group` (String) | e.g., "Board Members", "Ex-Officio Members" |

### 4.6 Rich Text Cleanup Pipeline

Sitecore ASP.NET WebForms produces HTML with significant cleanup needs:

```
Source HTML (Sitecore)          →  Cleanup Steps                    →  Target (Payload CMS)
───────────────────────────────────────────────────────────────────────────────────────────
ASP.NET __VIEWSTATE fields      →  Strip all hidden form fields     →  Clean HTML
Inline styles (font-family,     →  Strip inline styles; rely on     →  Semantic HTML with
  font-size, color, etc.)          Tailwind/design tokens              CSS classes
Sitecore field wrapper divs     →  Unwrap unnecessary containers    →  Flat HTML structure
  (maincontent_N_*)
Non-semantic table markup       →  Convert role="presentation"      →  Proper <table> or
  (role="presentation" divs)       divs to semantic HTML               structured data
Absolute URLs to frascanada.ca  →  Convert to relative paths or     →  Internal links use
                                   new URL structure                    new routes
Embedded Sitecore references    →  Resolve to actual URLs or        →  Clean href values
  (sc_itemid, etc.)                remove if broken
<br/> tags for spacing          →  Replace with proper paragraphs   →  <p> elements
Empty tags (<p>&nbsp;</p>)      →  Remove empty elements            →  No empty nodes
Mixed quote characters          →  Normalize to standard quotes     →  Consistent typography
```

**Implementation:** Use a library like `sanitize-html` or `rehype` to process the HTML through a configurable pipeline. Define allowlists for elements and attributes.

### 4.7 Relationship Building

Content in Payload CMS is connected through relationships. These must be built in a specific order:

```
1. Boards      (no dependencies — create first)
2. Standards   (depends on: boards)
3. Contacts    (no dependencies)
4. Committees  (depends on: boards)
5. Projects    (depends on: boards, standards, contacts)
6. Documents   (depends on: boards, standards, projects)
7. News        (depends on: boards)
8. Events      (depends on: boards)
9. Decision    (depends on: boards)
   Summaries
10. Resources  (depends on: boards, standards)
11. Pages      (depends on: boards — optional relationship)
```

### 4.8 Date Format Normalization

Sitecore dates appear in multiple formats across the site:

| Source Format | Example | Target (ISO 8601) |
|--------------|---------|-------------------|
| "March 4, 2026" | News listing dates | `2026-03-04` |
| "2021-06-03" | News URL slugs with dates | `2021-06-03` |
| "January 22, 2026" | Meeting title dates | `2026-01-22` |
| "April 20, 2026" | Document deadline dates (bold) | `2026-04-20` |
| "Q1 2026", "H2 2026" | Timeline table columns | `2026-01-01` / `2026-07-01` (approximate) |

### 4.9 Image Path Remapping

All image `src` attributes must be remapped from Sitecore paths to Payload media library paths:

```
Source: https://www.frascanada.ca/-/media/frascanada/images/members/john-doe.jpg
Target: /api/media/[payload-id]/john-doe.jpg

Source: https://www.frascanada.ca/-/media/frascanada/documents/ed-2026-01.pdf
Target: /api/media/[payload-id]/ed-2026-01.pdf
```

The `extract-media.mjs` script generates a manifest mapping old URLs to new Payload media IDs. The `transform-to-payload.mjs` script uses this manifest to rewrite all `src` and `href` attributes in rich text content.

---

## 5. URL Redirect Strategy

### 5.1 URL Structure Changes

The wireframe introduces a new URL structure that differs significantly from the live site:

| Content | Live Site Pattern | New Site Pattern | Change Type |
|---------|------------------|-----------------|-------------|
| Homepage | `/en` | `/` | Simplified |
| Board landing | `/en/{board-code}` | `/boards/{board-slug}` | Restructured |
| Board about pages | `/en/{board}/about/*` | `/boards/{board-slug}/about/*` | Prefix changed |
| Project detail | `/en/{standard}/projects/{slug}` | `/active-projects/{board}/{project-slug}` | **Major change** — standard-centric → board-centric |
| Project listing | `/en/{standard}/projects` | `/active-projects` (filtered by board) | Consolidated |
| Documents for Comment | `/en/{standard}/documents/{slug}` | `/open-consultations/{slug}` or `/consultations/{slug}` | **Major change** — standard → consultations |
| Documents listing | `/en/{standard}/documents` | `/open-consultations` (filtered) | Consolidated |
| Standards overview | `/en/{standard}` | TBD (Phase 2) | Not yet defined |
| News listing | `/en/news-listings` | `/news` (assumed) | Simplified |
| Board news | `/en/{board}/news-listings` | `/news?board={board}` (assumed) | Query param |
| Meetings | `/en/{board}/meetings-and-events` | TBD (Phase 2) | Not yet defined |
| Members | `/en/{board}/about/members` | TBD (Phase 2) | Not yet defined |
| Committees | `/en/{board}/committees/{slug}` | TBD (Phase 2) | Not yet defined |
| Resources | `/en/{standard}/resources` | TBD (Phase 2) | Not yet defined |
| Effective dates | `/en/{standard}/effective-dates` | TBD (Phase 2) | Not yet defined |
| Search | `/en/search-results#q=...` | `/search?q=...` | Hash → query param |
| French mirror | `/fr/{path}` | `/fr/{new-path}` | Same prefix, new paths |

### 5.2 Redirect Mapping Approach

With **2,090 URLs** to potentially redirect (1,069 EN + 1,015 FR + 6 other), manual mapping is not feasible. The approach uses **pattern-based redirect rules** with a fallback catch-all.

#### Tier 1: Pattern-Based Redirects (covers ~80% of URLs)

These rules can be expressed as regex patterns in Next.js config or middleware:

```javascript
// next.config.mjs redirects (evaluated at build time)
const redirects = [
  // Homepage
  { source: '/en', destination: '/', permanent: true },
  { source: '/fr', destination: '/fr', permanent: true },

  // Board landings
  { source: '/en/acsb', destination: '/boards/accounting-standards-board', permanent: true },
  { source: '/en/psab', destination: '/boards/public-sector-accounting-board', permanent: true },
  { source: '/en/aasb', destination: '/boards/auditing-assurance-standards-board', permanent: true },
  { source: '/en/cssb', destination: '/boards/canadian-sustainability-standards-board', permanent: true },
  { source: '/en/rasoc', destination: '/boards/oversight-council', permanent: true },

  // Project details — standard-centric → board-centric
  // Requires a lookup table: standard → board
  { source: '/en/:standard/projects/:slug', destination: '/active-projects/:board/:slug', permanent: true },

  // Documents for Comment
  { source: '/en/:standard/documents/:slug', destination: '/consultations/:slug', permanent: true },
  { source: '/en/:standard/documents', destination: '/open-consultations', permanent: true },

  // News
  { source: '/en/news-listings', destination: '/news', permanent: true },
  { source: '/en/:board/news-listings/:slug', destination: '/news/:slug', permanent: true },
  { source: '/en/:board/news-listings', destination: '/news?board=:board', permanent: true },

  // Board sub-pages (about, members, committees, etc.)
  { source: '/en/:board/about/:path*', destination: '/boards/:board/about/:path*', permanent: true },
  { source: '/en/:board/committees/:path*', destination: '/boards/:board/committees/:path*', permanent: true },
  { source: '/en/:board/meetings-and-events/:path*', destination: '/boards/:board/meetings/:path*', permanent: true },
];
```

#### Tier 2: Dynamic Redirects via Middleware (covers ~15% — slug mismatches)

For URLs where the slug changes between old and new (e.g., project slugs that include standard prefixes), use Next.js middleware with a redirect lookup table stored in the database or a JSON file:

```typescript
// middleware.ts
import redirectMap from './data/redirect-map.json';

export function middleware(request: NextRequest) {
  const oldPath = request.nextUrl.pathname;
  const redirect = redirectMap[oldPath];
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url), 301);
  }
}
```

The `redirect-map.json` is generated during migration by mapping each source URL to its target URL based on the content's new location in Payload CMS.

#### Tier 3: Catch-All Fallback (covers ~5% — unmatched URLs)

For any URL that does not match a pattern or explicit redirect:
1. Serve a custom 404 page with search functionality
2. Log unmatched URLs for manual review
3. Consider a "This page has moved" interstitial with a search link

### 5.3 Redirect Generation Script (`generate-redirects.mjs`)

This script runs after content migration is complete:

1. Load the URL registry (`data/url-registry.json`) — all 2,090 source URLs
2. Load the Payload CMS content — query all collections for their new URLs
3. For each source URL, find the matching Payload content by:
   - Matching on slug
   - Matching on title (fuzzy, for slug changes)
   - Matching on original source URL stored as metadata
4. Generate `redirect-map.json` with `{oldPath: newPath}` entries
5. Generate `next.config.mjs` redirects array for pattern-based rules
6. Report: total redirects, unmatched URLs, redirect chains (A→B→C)

### 5.4 French URL Redirects

French URLs follow the same patterns but with translated path segments:

```
/fr/cnc → /fr/boards/conseil-des-normes-comptables
/fr/normesifrs/projets/{slug} → /fr/projets-actifs/{board}/{slug}
/fr/durabilite/documents/{slug} → /fr/consultations/{slug}
```

The bilingual pairing data from `pair-bilingual.mjs` ensures each redirect has both EN and FR versions.

### 5.5 SEO Considerations

- All redirects must be **301 (permanent)** to transfer link equity
- Redirects must be tested for **redirect chains** (no A→B→C; must be A→C)
- `robots.txt` and `<link rel="canonical">` must reference new URLs
- Submit updated sitemap.xml to Google Search Console after migration
- Monitor Google Search Console for crawl errors for 90 days post-migration

---

## 6. Migration Phases

Migration follows a dependency-driven order. Reference data must exist before content that references it.

### Phase 3a: Reference Data (Boards, Standards, Contacts)

**Duration:** 1-2 days
**Dependencies:** Payload CMS collections must be defined (Phase 1/2)

| Task | Content | Count | Script |
|------|---------|-------|--------|
| 3a.1 | Create Board records | 5 (CSSB, AcSB, PSAB, AASB, RASOC) | Manual or `extract-standards.mjs` |
| 3a.2 | Create Standard records | 11 | `extract-standards.mjs` |
| 3a.3 | Extract and import Staff Contacts | ~20-30 unique | `extract-members.mjs` (contacts subset) |
| 3a.4 | Map Standard → Board relationships | 11 mappings | Manual config |

**Validation:** All boards and standards exist in Payload. Standard.board relationships correct.

### Phase 3b: Core Content (Projects, Consultations, Documents)

**Duration:** 3-5 days
**Dependencies:** Phase 3a complete

| Task | Content | Count | Script |
|------|---------|-------|--------|
| 3b.1 | Extract and import Projects | ~100+ | `extract-projects.mjs` |
| 3b.2 | Extract and import Documents for Comment | ~50+ | `extract-documents.mjs` |
| 3b.3 | Build Project ↔ Document relationships | ~50+ | `transform-to-payload.mjs` |
| 3b.4 | Extract and import Effective Dates | 11 tables | `extract-effective-dates.mjs` |
| 3b.5 | Bilingual pairing for all Phase 3b content | 2× count | `pair-bilingual.mjs` |

**Validation:** All projects have board + standard relationships. All documents have deadline dates parsed. Timeline stages parsed for all active projects.

### Phase 3c: Volume Content (News, Meetings, Resources)

**Duration:** 5-7 days (longest phase — PostBack pagination is slow)
**Dependencies:** Phase 3a complete

| Task | Content | Count | Script |
|------|---------|-------|--------|
| 3c.1 | Extract and import News items | ~1,010+ | `extract-news.mjs` |
| 3c.2 | Extract and import Meetings & Events | ~900+ | `extract-meetings.mjs` |
| 3c.3 | Extract and import Resources | ~100+ | `extract-resources.mjs` |
| 3c.4 | Bilingual pairing for all Phase 3c content | 2× count | `pair-bilingual.mjs` |

**Validation:** News count matches expected ~1,010. Meeting count per board matches expected ~180+. All dates parsed to ISO 8601.

### Phase 3d: People & Organization (Members, Committees)

**Duration:** 1-2 days
**Dependencies:** Phase 3a complete

| Task | Content | Count | Script |
|------|---------|-------|--------|
| 3d.1 | Extract and import Members | ~50+ | `extract-members.mjs` |
| 3d.2 | Download member photos | ~50+ | `extract-media.mjs` (subset) |
| 3d.3 | Extract and import Committees | ~25+ | `extract-committees.mjs` |
| 3d.4 | Build Committee → Board relationships | ~25+ | `transform-to-payload.mjs` |
| 3d.5 | Extract and import Static Content Pages | ~50+ | `extract-static-pages.mjs` |
| 3d.6 | Bilingual pairing | 2× count | `pair-bilingual.mjs` |

**Validation:** All members have photos. All committees linked to correct board. All static pages have body content.

### Phase 3e: Media Assets

**Duration:** 1-2 days
**Dependencies:** Phases 3b-3d complete (need to know all media references)

| Task | Content | Count | Script |
|------|---------|-------|--------|
| 3e.1 | Scan all extracted content for media URLs | — | `extract-media.mjs` |
| 3e.2 | Deduplicate and download all assets | 200-500 | `extract-media.mjs` |
| 3e.3 | Upload to Payload media library | 200-500 | `import-to-payload.mjs` |
| 3e.4 | Rewrite media references in all content | All rich text | `transform-to-payload.mjs` |

**Validation:** No broken image/document links. All media uploaded to Payload. Source→target URL manifest complete.

### Phase 3f: Validation & Redirect Testing

**Duration:** 2-3 days
**Dependencies:** All previous phases complete

| Task | Description | Script |
|------|-------------|--------|
| 3f.1 | Content count comparison (source vs target per type) | `validate-migration.mjs` |
| 3f.2 | Bilingual pairing verification (EN↔FR for all content) | `validate-migration.mjs` |
| 3f.3 | Link integrity check (no broken internal links) | `validate-migration.mjs` |
| 3f.4 | Media reference check (all images/PDFs resolve) | `validate-migration.mjs` |
| 3f.5 | Generate redirect map from URL registry | `generate-redirects.mjs` |
| 3f.6 | Test all 2,090 redirects (source → target returns 200) | `validate-redirects.mjs` |
| 3f.7 | Rich text quality spot-check (10% sample) | Manual review |
| 3f.8 | SEO audit (canonical URLs, sitemap, robots.txt) | Lighthouse / manual |

### Phase Summary Timeline

```
Week 1:  Phase 3a (reference data)    ████
         Phase 3b (core content)       ████████████████
Week 2:  Phase 3c (volume content)     ████████████████████████████
Week 3:  Phase 3c (continued)          ████████████████████████████
         Phase 3d (people & org)       ████████████
Week 4:  Phase 3e (media assets)       ████████████
         Phase 3f (validation)         ████████████████████
```

**Total estimated duration: 3-4 weeks** (assuming one developer, sequential extraction due to bot protection constraints)

---

## 7. Risk Register

| # | Risk | Severity | Likelihood | Impact | Mitigation |
|---|------|----------|-----------|--------|------------|
| R1 | **Cloudflare bot protection blocks scraper** | High | Medium | Extraction halts entirely | Rate limiting, realistic UA, session reuse. Escalation: request IP allowlisting from FRAS Canada IT. |
| R2 | **ASP.NET PostBack state prevents pagination** | High | Medium | Cannot extract paginated content (news, meetings, resources) — these are the largest content sets | Playwright browser automation handles PostBack natively. Fallback: request database export from FRAS Canada IT. |
| R3 | **Rich text contains embedded Sitecore references** | Medium | High | Broken links/images in migrated content — `sc_itemid` parameters, Sitecore media library paths | HTML cleanup pipeline strips Sitecore-specific attributes. Post-migration link validation catches remaining issues. |
| R4 | **Bilingual content mismatch** | Medium | Medium | EN and FR item counts differ; some content missing in one language | hreflang tag pairing as primary method. Mismatch report generated for manual review. |
| R5 | **Stale/broken links in source content** | Low | High | Migrating content that already has broken internal/external links | Link validation during extraction. Flag broken links in extraction report; do not create broken relationships. |
| R6 | **Non-semantic HTML prevents reliable parsing** | Medium | High | Documents for Comment and Effective Dates use `role="presentation"` divs instead of `<table>` elements | Custom parser for each non-semantic table pattern. Verified during site discovery; known patterns. |
| R7 | **Content changes during migration window** | Medium | Medium | Source content updated while migration is running, causing drift | Run extraction in a short window. Do a delta pass comparing extraction timestamps to last-modified dates. Coordinate content freeze with FRAS Canada editorial team. |
| R8 | **Pagination item counts exceed expectations** | Low | Low | More content exists than estimated (behind additional filter combinations) | Set extraction to "All" items per page where possible. Cross-reference total counts from multiple entry points. |
| R9 | **Project timeline phases have inconsistent structure** | Medium | Medium | Not all projects have the same 5-phase timeline; some may be missing phases or have different phase names | Flexible schema: timeline_stages as array, not fixed 5-field structure. Validate during extraction. |
| R10 | **Meeting title dates cannot be reliably parsed** | Medium | Medium | Meeting titles embed dates in inconsistent formats ("AcSB Decision Summary – January 22, 2026" vs "December 2022") | Multiple date parser patterns. Flag unparseable dates for manual review. |
| R11 | **Redirect chains from Sitecore** | Low | Medium | Some Sitecore URLs already redirect to other Sitecore URLs; adding our redirect creates a chain | URL registry includes `sitecore-redirect` page type (identified in classifier). Resolve chains before creating new redirects. |
| R12 | **FR slug translations are incomplete** | Medium | Low | Some FR URLs have unexpected slug patterns not covered by the classifier mappings | hreflang pairing handles unknown slugs. Unmatched FR URLs logged for manual mapping. |
| R13 | **Large media files exceed upload limits** | Low | Medium | Some PDFs may be very large (Exposure Drafts can be 100+ pages) | Check Payload CMS upload size limits. Configure upload limit before migration. Compress if needed. |

---

## 8. Tooling

### 8.1 Existing Scripts (`scripts/` directory)

| Script | Purpose | Status |
|--------|---------|--------|
| `crawl-sitemap.mjs` | Playwright-based link crawler; discovers all URLs on the site. Cap: 2,000 pages. Extracts hreflang links for FR URLs. | **Complete** — discovered 2,090 URLs |
| `classify-pages.mjs` | Classifies URLs into 36 page types based on URL patterns. Includes EN and FR slug mappings for all boards, standards, and councils. | **Complete** — 36 types, zero unclassified |
| `inspect-pages.mjs` | Deep page inspector v2. Extracts DOM scaffold, content zone blocks, heading hierarchy, Sitecore control IDs, CSS classes. | **Complete** — 90 pages inspected |
| `generate-reports.mjs` | Generates markdown reports from inspection data (page types, components, URL registry). | **Complete** |
| `build-url-registry.mjs` | Builds URL registry with batch system (108 batches of ~20 URLs) for parallel agent processing. | **Complete** |
| `run-inventory.sh` | Orchestration script that runs the full pipeline (crawl → classify → inspect → reports → registry). | **Complete** |

### 8.2 New Scripts Needed

| Script | Purpose | Phase | Estimated LOC |
|--------|---------|-------|---------------|
| `extract-news.mjs` | Extract ~1,010 news items via PostBack pagination | 3c | ~300 |
| `extract-projects.mjs` | Extract ~100+ projects with timeline parsing | 3b | ~250 |
| `extract-documents.mjs` | Extract ~50+ documents for comment with detail page scraping | 3b | ~250 |
| `extract-meetings.mjs` | Extract ~900+ meetings via PostBack pagination | 3c | ~300 |
| `extract-resources.mjs` | Extract ~100+ resources with category cycling | 3c | ~250 |
| `extract-members.mjs` | Extract ~50+ member profiles with photo URLs | 3d | ~150 |
| `extract-committees.mjs` | Extract ~25+ committee entries with detail pages | 3d | ~150 |
| `extract-standards.mjs` | Extract 11 standards overview pages with tab content | 3a | ~200 |
| `extract-static-pages.mjs` | Extract ~50+ static content pages | 3d | ~150 |
| `extract-effective-dates.mjs` | Parse 11 non-semantic effective dates tables | 3b | ~200 |
| `extract-media.mjs` | Scan content for media URLs, download assets | 3e | ~200 |
| `pair-bilingual.mjs` | Match EN↔FR content via hreflang + slug mapping | All | ~150 |
| `transform-to-payload.mjs` | Transform extracted data to Payload CMS import format | All | ~400 |
| `import-to-payload.mjs` | Import transformed data via Payload Local API | All | ~300 |
| `generate-redirects.mjs` | Generate redirect map from source→target URL mapping | 3f | ~200 |
| `validate-migration.mjs` | Content count comparison, link integrity, bilingual pairing | 3f | ~250 |
| `validate-redirects.mjs` | Test all 2,090 redirects resolve correctly | 3f | ~150 |
| `clean-html.mjs` | Shared module: ASP.NET HTML → clean HTML → Payload rich text | Shared | ~300 |

**Total new scripts: 18**
**Estimated total LOC: ~4,150**

### 8.3 Dependencies

| Package | Purpose | Existing? |
|---------|---------|-----------|
| `playwright` | Browser automation for PostBack pagination and scraping | Yes (in package.json) |
| `sanitize-html` or `rehype` | HTML cleanup pipeline | **New** |
| `date-fns` or `dayjs` | Date parsing for multiple formats | **New** |
| `p-queue` or `p-limit` | Concurrency control for rate limiting | **New** |
| `payload` | Payload CMS Local API for import | **New** (part of Payload CMS project) |
| `sharp` | Image processing (resize member photos if needed) | **New** |

### 8.4 Data Storage

All extracted data is stored as JSON files in the `data/` directory:

```
data/
├── sitemap-urls.json          # Existing: 2,090 URLs
├── page-types.json            # Existing: 36 type classifications
├── page-inspections.json      # Existing: 90 sample inspections
├── url-registry.json          # Existing: URL registry with batch assignments
├── batch-manifest.json        # Existing: 108 batch definitions
├── batches/                   # Existing: per-batch URL lists
├── extracted/                 # NEW: per-type extracted content
│   ├── news.json              # ~1,010 items
│   ├── projects.json          # ~100 items
│   ├── documents.json         # ~50 items
│   ├── meetings.json          # ~900 items
│   ├── resources.json         # ~100 items
│   ├── members.json           # ~50 items
│   ├── committees.json        # ~25 items
│   ├── standards.json         # 11 items
│   ├── static-pages.json      # ~50 items
│   └── effective-dates.json   # 11 items
├── bilingual/                 # NEW: EN↔FR pairing data
│   └── pairs.json
├── media/                     # NEW: downloaded media assets
│   ├── images/
│   ├── documents/
│   └── manifest.json          # Source URL → local path mapping
├── transformed/               # NEW: Payload CMS import-ready data
│   ├── boards.json
│   ├── standards.json
│   ├── projects.json
│   └── ...
└── redirects/                 # NEW: redirect mapping
    ├── redirect-map.json
    └── next-config-redirects.json
```

---

## 9. Validation & Acceptance Criteria

### 9.1 Content Completeness

| Check | Expected | Tolerance |
|-------|----------|-----------|
| News items imported | ~1,010 | ±5% (some may be duplicates or redirects) |
| Projects imported | ~100+ | 100% — all projects must migrate |
| Documents for Comment imported | ~50+ | 100% — all documents must migrate |
| Meetings imported | ~900+ | ±5% |
| Resources imported | ~100+ | ±5% |
| Members imported | All visible on members pages | 100% |
| Committees imported | All visible on committee pages | 100% |
| Standards configured | 11 | 100% |
| Boards configured | 5 | 100% |
| Static pages imported | ~50+ | 100% |
| Media assets uploaded | All referenced in content | 100% of referenced assets |

### 9.2 Data Quality

| Check | Criteria |
|-------|----------|
| Dates parsed | All dates in ISO 8601 format; no unparsed date strings |
| Rich text cleaned | No ASP.NET hidden fields, no inline styles, no empty tags |
| Relationships built | All project→board, project→standard, document→standard relationships valid |
| Bilingual paired | ≥95% of EN content has FR equivalent linked |
| Media resolved | No broken `<img>` src or `<a>` href to internal media |
| Slugs unique | No duplicate slugs within any collection |

### 9.3 Redirect Coverage

| Check | Criteria |
|-------|----------|
| Total redirects | All 2,090 source URLs have a redirect rule |
| Redirect resolution | All redirects return HTTP 200 at target |
| No chains | No redirect A→B→C; all redirects go directly to final destination |
| French parity | All EN redirects have corresponding FR redirects |

### 9.4 Acceptance Test Procedure

1. **Automated validation script** (`validate-migration.mjs`) produces a report with pass/fail for each check above
2. **Manual spot-check** of 10% of each content type (random sample):
   - Compare source page screenshot vs target page rendering
   - Verify rich text formatting preserved
   - Verify all images display
   - Verify bilingual toggle works
3. **Redirect testing** (`validate-redirects.mjs`) visits all 2,090 source URLs and verifies 301→200 chain
4. **SEO audit**: Lighthouse + Google Search Console after deployment
5. **Stakeholder review**: FRAS Canada team reviews 5 pages per content type for content accuracy

---

*Generated: 2026-03-04 | Source: site-discovery-verified.md, url-registry.md, wireframe-vs-live-gap-analysis.md, PRD.md*
