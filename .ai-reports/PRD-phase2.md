# FRAS Canada — Phase 2 Product Requirements Document (PRD)

> **Version:** 1.0
> **Date:** 2026-03-04
> **Status:** Draft — awaiting stakeholder review
> **Source Documents:** wireframe-specs-phase2.md, site-discovery-verified.md, wireframe-vs-live-gap-analysis.md, PRD.md (Phase 1)
> **Prerequisite:** Phase 1 PRD (Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search, Global Nav/Footer)

---

## 1. Executive Summary

Phase 2 completes the FRAS Canada site rebuild by delivering the **13 remaining page templates** that Phase 1 deferred. Where Phase 1 focused on the stakeholder engagement layer (projects, consultations, search, boards), Phase 2 addresses the **reference content, administrative, and transactional layers** — standards taxonomy pages, document comment workflows, effective dates tables, resource libraries, news archives, meeting archives, member directories, committee indices, contact forms, authentication, and job listings.

**Key scope facts:**
- **Phase 2 covers:** 13 page templates (T3, T4, T5, T8-T17) representing ~694 pages (~78% of site content). Note: T1 (Homepage), T2 (Board Detail), T6 (Project Listing), and T7 (Project Detail) are covered by Phase 1 PRD. Phase 2 covers the remaining 13 templates.
- **Phase 2 adds to Phase 1:** 12 new CMS collections, 2 extended collections, 1 new global, 34 new components
- **New capabilities:** Standards tabbed navigation, document comment workflow, effective dates reference tables, resource taxonomy with filtering, meeting archives with upcoming/past toggle, member photo directories, committee scroll-spy index, contact form with ReCaptcha, Aptify DB API authentication (member True/False), job listings with empty state
- **Critical IA integration:** Standards pages must be accessible despite removal of "Standards" from top-level navigation in Phase 1's redesigned header
- **Technology stack:** Same as Phase 1 — Next.js 15 (App Router), Payload CMS 3.x, PostgreSQL, Tailwind CSS v4, Meilisearch

---

## 2. Phasing Context

### Phase 1 (complete/in progress — see PRD.md)
6 wireframed page types + global navigation/footer + CMS infrastructure. Stakeholder engagement layer: Homepage, Board Detail, Project Detail, Active Projects Listing, Open Consultations Listing, Search.

### Phase 2 (this PRD)
13 gap templates covering reference content, administrative pages, and transactional features. These pages use the Phase 1 navigation shell (3-row header, redesigned footer, mobile menu) but introduce new layout patterns, components, and CMS collections.

### Phase 3 (future PRD)
Content migration of ~2,090 URLs (1,069 EN + 1,015 FR), 1,010+ news items, 100+ projects, and all associated media from Sitecore to Payload CMS.

---

## 3. Page Specifications

### 3.1 Template 3: Content Page + Right Sidebar

**Route:** `/about`, `/boards/:board-slug/about`, `/research-program`, `/boards/:board-slug/about/due-process`, etc.
**Page Count:** ~50+ pages
**Layout:** ~70% main content / ~30% right sidebar

**Two variants:**

#### 3.1a — Staff Contact Sidebar Variant (T3A)

**Used by:** Research Program, project detail pages, document detail pages

**Sections:**
1. **Breadcrumbs** — path trail (e.g., Home / About / Research Program)
2. **Section Tabs** — horizontal tab bar (e.g., About, Research Program, Oversight Council, Jobs). Up to 7 tabs, active tab has bottom border highlight.
3. **Page Title** — H1, plain text
4. **Rich Text Body** — full rich text: H2, H3, paragraphs, bullet/ordered lists, tables, inline links, embedded PDFs, images
5. **Optional CTA Block** — dark purple background block with heading, description, and arrow button (e.g., "Submit a Research Proposal"). Research Program page only.
6. **Optional News Section** — H2 "News" with 3 most recent date + title items. Research Program page only.
7. **Staff Contact Sidebar (right)** — purple H2 "Staff Contact(s)" with 1-2 contact cards: bold name with credentials, job title, phone (tel link), email (mailto link). Sidebar is sticky on desktop.

**Mobile:** Sidebar drops below main content, full width. Section tabs become horizontally scrollable.

**CMS:** Uses `pages` collection with `sidebarType: 'staff-contact'`, `staffContacts` array, optional `ctaBlock` group, optional `newsSection` boolean, `board` relationship.

---

#### 3.1b — Section Nav Sidebar Variant (T3B)

**Used by:** About pages, Committees, Members section-level navigation

**Sections:**
1. **Breadcrumbs** — same pattern as 3A
2. **Section Tabs** — same pattern as 3A
3. **Page Title** — H1
4. **Rich Text Body** — same capabilities as 3A
5. **Section Nav Sidebar (right)** — vertical link list with 4-8 sibling page links. Active link = bold + underline. Plain gray text label above divider (no heading tag). No "In this section" heading — just links under a thin divider.

**Mobile:** Sidebar drops below main content as vertical link list. Section tabs horizontal scroll.

**CMS:** Uses `pages` collection with `sidebarType: 'section-nav'`, `sectionNavLinks` array of {label, href, isActive}.

---

### 3.2 Template 4: People Listing (Members)

**Route:** `/boards/:board-slug/about/members`
**Page Count:** ~5 pages (one per board)
**Layout:** ~70% main (2-column card grid) + ~30% section nav sidebar

**Sections:**
1. **Breadcrumbs** — Home / [Board] / About / Members
2. **Section Tabs** — board-level tabs (Overview, About, Consultations, Projects, Resources)
3. **Page Title** — H1 "Members"
4. **Member Sections** — grouped by role with uppercase gray section labels:
   - **CHAIR** — 1-2 cards in 2-column grid
   - **VICE-CHAIR** — 1 card
   - **VOTING MEMBERS** — multiple cards in 2-column grid
5. **Section Nav Sidebar (right)** — same as T3B (About, Due Process, International Activities, Members, IRCSS Recommendations)

**Each Member Card:**
- Portrait photo (205 x 205px, square)
- Name as purple link (navigates to bio page)
- Credentials in gray text (e.g., "FCPA, FCA, CPA(MI)")
- Role label in uppercase bold (officers only: CHAIR, VICE-CHAIR)
- "Appointed: [date]" and "Term Expires: [date]"

**Card ordering:** Officers first (Chair, Vice-Chair), then alphabetical within Voting Members.

**Mobile:** 2-column grid becomes single column stack. Section nav sidebar drops below cards.

**CMS Collection:** `board-members` with fields: name, credentials, photo (205x205), role (enum: chair/vice-chair/voting-member/non-voting), roleLabel, appointedDate, termExpires, board (relationship), bioPage (relationship to pages), sortOrder.

---

### 3.3 Template 5: Standards Overview (Tabbed)

**Route:** `/standards/:standard-slug` (maps from live `/en/ifrsstandards`, `/en/aspe`, `/en/sustainability`, etc.)
**Page Count:** 11 standards sections
**Layout:** Full-width with section tab navigation

**Sections:**
1. **Board Logo Hero** — board crest/wordmark centered, full board name below, brand color background
2. **Breadcrumbs** — Home / [Board] / [Standard Name]
3. **Section Title** — H1 (e.g., "IFRS Accounting Standards")
4. **Tab Navigation** — 5-6 tabs per standard:
   - Standard tabs: Overview, Project Listing, Documents for Comment, Effective Dates, Resources
   - IFRS adds 6th tab: IFRIC Agenda Decisions
   - Active tab = bottom border highlight (purple/brand color), bold text
   - Each tab is its own page route (server-side navigation, not client-side tab switch)
5. **Active Projects Table** — 2-column table (Project Name as purple link, Description). Rows display all active projects for this standard.
6. **Feature CTA Block** — 1-2 side-by-side CTA cards:
   - Light gray variant (e.g., "CPA Canada Handbook" — Access Handbook button)
   - Dark purple variant (e.g., "Submit an Issue" — Submit an Issue button)
7. **News Feed** — H2 "News" with 3 most recent items as cards (date, title, excerpt, "Read More" link)

**Mobile:** Table becomes stacked cards (name above description). CTA cards stack vertically. News cards stack single column. Tabs horizontal scroll.

**CMS Collection:** `standards-sections` with fields: title, slug, board (relationship), boardLogo (upload), boardName, tabs (array of {label, href, isActive}), activeProjects (relationship to projects), featureCTAs (array of {heading, description, buttonLabel, buttonHref, variant: light/dark-purple}).

---

### 3.4 Template 8: Documents for Comment Listing

**Route:** `/standards/:standard-slug/documents`
**Page Count:** 11 sections (one per standard)
**Layout:** Full-width tabbed listing

**Sections:**
1. **Page Title** — H1 "Documents for Comment"
2. **Tab Pills** — two pill-style toggles: "Open for Comment" (default active) / "Closed for Comment". Active = filled dark background, white text. Inactive = outline/ghost. Switching uses query param `?tab=closed-for-comment`, full page reload.
3. **Grouped Document Table** — rows grouped under gray banner section headers:
   - Group headers: "Exposure Drafts", "Consultation Papers", "Re-exposure Drafts", "Discussion Papers"
   - Groups only render if they contain documents
   - Gray background row (~#f0f0f0), bold heading text
4. **Document Rows:**
   - Title as purple link (navigates to document detail page)
   - Alternating white / light gray (#f9f9f9) row backgrounds
   - Dashed border between rows within same group
   - **Open tab:** "Submit comment" button (dark purple fill, white text) right-aligned
   - **Closed tab:** Optional "View Comments" PDF link; some rows have no action
   - No comment deadline dates shown on listing

**Mobile:** Rows stack with button below title text. Gray section headers span full width. Table-like layout collapses to single-column stacked cards.

**CMS Collection:** `document-for-comment` with fields: title, slug, standard (relationship), board (relationship), group (enum: exposure-draft/consultation-paper/re-exposure-draft/discussion-paper), status (enum: open/closed), documentUrl, commentSubmitUrl, commentsPdfUrl, sortOrder, publishedDate.

---

### 3.5 Template 9: Document Detail (Exposure Draft)

**Route:** `/standards/:standard-slug/documents/:document-slug`
**Page Count:** ~50+ pages
**Layout:** ~70% main content + ~30% Staff Contact sidebar

**Sections:**
1. **Page Title** — H1 (e.g., "Exposure Draft — Proposed Amendments to Section 3856, Financial Instruments")
2. **Highlights Section** — bold purple heading "Highlights" (color: rgb(96, 31, 91)), summary paragraphs, horizontal rule separator
3. **Rich Body Content** — multiple sections with subheadings:
   - External links as purple arrow links (e.g., "[View IASB Exposure Draft ->]")
   - "Comments Requested" section with blockquoted questions in bordered boxes with light background
   - Standard rich text: paragraphs, bold, italic, bullet lists, links
4. **When to Reply** — heading "When to Reply" with bold deadline date inline. Horizontal rules above and below.
5. **How to Reply — Dark Purple CTA Block** — dark purple/near-black background:
   - H3 "How to Reply", instruction paragraph, full mailing address (name, title, street, city, province, postal code)
   - Email as mailto link, "Submit comment" button (white on dark)
   - Intentionally duplicates sidebar contact info for in-flow accessibility
6. **Support Materials** — heading "Support Materials", chain-link icon + labeled document links (PDF, Basis for Conclusions, Snapshot)
7. **Staff Contact Sidebar (right)** — same pattern as T3A. Sticky on desktop, drops below on mobile.

**Mobile:** Sidebar drops below all main content. CTA block full width. Blockquotes reduce horizontal padding.

**CMS Collection:** `document-detail` with fields: title, slug, standard (relationship), board (relationship), highlights (rich text), bodyContent (rich text blocks), commentQuestions (array of {questionNumber, questionText}), replyDeadline (date), howToReply (object: heading, body, ctaLabel, ctaHref, contactName, contactTitle, contactAddress, contactEmail), supportMaterials (array of {label, url, fileType}), staffContacts (relationship to contacts).

---

### 3.6 Template 10: Effective Dates Table

**Route:** `/standards/:standard-slug/effective-dates`
**Page Count:** 11 sections (one per standard)
**Layout:** Full-width, single long-scroll page

**Sections:**
1. **Page Title** — H1 "Effective Dates"
2. **Intro Disclaimer** — italic paragraph explaining table purpose. Contains links to "CPA Canada Handbook" and "Knotia.ca" (open in new tab).
3. **Data Table:**
   - **Column headers:** "Application" (~65% width) and "Pronouncement" (~35% width)
   - **Purple Section Header Rows** — full-width purple background (rgb(96, 31, 91)) with white text: "Effective for annual periods beginning on or after [Date]". 13 total sections (13 date-group header rows within a single effective dates page — distinct from the 11 standards section pages). Groups data rows by effective date.
   - **Data Rows:**
     - Application column: italic standard name, optional bullet lists of changes, optional footnote references (superscript)
     - Pronouncement column: transition method text (e.g., "Prospective", "Retrospective", "Modified retrospective")
     - Alternating white/light gray row backgrounds, dashed borders within groups
   - **Footnotes** — superscript references with explanatory text at bottom
   - **Ordering note:** Non-chronological ordering preserved (e.g., 2018 before 2019 in live site — intentional)

**Mobile:** 2-column table collapses to stacked single column. Each row shows Application content first, then "Pronouncement: [value]" as labeled field below. Purple headers span full width.

**Static content:** No interactive elements, no filtering, no sorting, no pagination. All 13 sections render on single page. Consider `@media print` styles.

**CMS Collection:** `effective-dates-table` with fields: standard (relationship), introText (rich text), sections (array of {headerLabel, headerDate, sortOrder, rows[]}) where rows contain {application (rich text), pronouncement (string), footnoteRef}. Separate `effective-dates-footnote` collection for footnotes (marker, text, table relationship).

---

### 3.7 Template 11: Resources Listing

**Route:** `/boards/:board-slug/resources` (maps from live `/en/{standard}/resources`)
**Page Count:** 11 sections
**Layout:** Full-width with filter bar + paginated listing

**Sections:**
1. **Breadcrumbs** — Home / [Board] / Resources
2. **Page Title** — H1 "Resources"
3. **Category Filter Pills** — horizontal pill/tab row: All Items, Article, Guidance, In Brief, Other, Webinar. Active = filled/dark background, white text. Inactive = outline/ghost. Mobile collapses to `<select>` dropdown.
4. **Sort/Filter Bar:**
   - Filters dropdown: "All Types" default, options: Audio, External Link, PDF, Video, Webpage, Plain Language
   - Sort by: "Publication date: Newest" (default) / "Publication date: Oldest"
   - Items per page: 10 (default) / 20 / 30 / All
   - Start date / End date: date inputs with calendar picker (mm/dd/yyyy)
5. **Resource Listing Items** — each item shows:
   - Date (format: "Month DD, YYYY")
   - Category tags as badges (one or more)
   - Title as purple linked text
   - 2-3 sentence excerpt
   - No PDF icons on listing items (confirmed via live site verification)
6. **Pagination** — Previous / numbered pages / Next

**Mobile:** Category pills collapse to `<select>` dropdown. Filter bar fields stack vertically.

**CMS Collection:** `resources` with fields: title, slug, date, category (multi-select enum: Article/Guidance/In Brief/Other/Webinar), resourceType (enum: Audio/External Link/PDF/Video/Webpage/Plain Language), excerpt, content (rich text), board (relationship), standard (relationship, optional), externalUrl, file (upload), status (draft/published/archived).

---

### 3.8 Template 12: Filtered News/Event Listing

**Route:** `/news`, `/boards/:board-slug/news`, `/volunteer-opportunities`
**Page Count:** ~10+ listing pages
**Layout:** Full-width with filter pills + paginated listing

**Two variants:**

#### News Variant
**Category Pills:** All Items, Document for Comment, International Activity, Meeting Summary, News, Resource. Mobile collapses to `<select>` dropdown.

#### Volunteer Opportunities Variant
**Category Tabs:** AASB, CSSB, PSAB, RASOC, AcSB (board-based tabs instead of content type categories).

**Shared Filter Bar:**
- Items per page: 10 (default) / 20 / 30 / All
- Sort by: "Publication date: Newest" / "Publication date: Oldest"
- Start date / End date: date inputs (mm/dd/yyyy)
- Note: No "All Types" dropdown (simpler than T11)

**Each Listing Item:**
- Date (format: "Month DD, YYYY")
- Single category badge
- Title as purple linked text
- External link icon (when linking externally)
- 2-3 sentence excerpt (text only, no thumbnails)

**Pagination:** Previous / numbered pages / Next. No total results count displayed. AcSB news has 101+ pages.

**Mobile:** Category pills collapse to `<select>`. Filter fields stack vertically.

**CMS Collection:** Extends existing `news` collection with new fields: externalUrl (URL), isVolunteerOpportunity (boolean), category (enum: Document for Comment/International Activity/Meeting Summary/News/Resource).

**Variant routing:**
- `/news` — all boards, all categories
- `/boards/:board-slug/news` — pre-filtered to specific board
- `/volunteer-opportunities` — pre-filtered to `isVolunteerOpportunity=true`, tabs filter by board

---

### 3.9 Template 13: Meetings & Events Listing

**Route:** `/boards/:board-slug/meetings-and-events`
**Page Count:** ~5 pages (one per board)
**Layout:** Full-width, simplest listing template

**Sections:**
1. **Breadcrumbs** — Home / [Board] / Meetings & Events
2. **Page Title** — H1 "Meetings & Events"
3. **Tab Toggle** — two-state toggle: "Upcoming meetings & events" / "Past meetings & events". Default active: **Past** (not upcoming). Active = filled/dark background, white text.
4. **Items Per Page** — dropdown: 10 (default) / 20 / 30 / All. No other filters, no sort, no date range.
5. **Meeting/Event Items** — each item:
   - Title as H2, purple linked text (typically includes date: "AcSB Meeting Summary — February 27, 2025")
   - 2-3 sentence excerpt
   - Links to meeting detail / decision summary page
6. **Pagination** — Previous / numbered pages / Next. AcSB has ~180+ items (~18 pages at 10/page). Server-side pagination recommended.

**Tab logic:**
- Upcoming: items where `date >= today`, sorted ascending (soonest first)
- Past: items where `date < today`, sorted descending (most recent first)

**Mobile:** Tab toggle remains as two side-by-side tabs (does not collapse to dropdown). Items stack full-width.

**CMS Collection:** `meetings` with fields: title, slug, date, excerpt, content (rich text), board (relationship), type (enum: meeting/event/webinar/decision-summary), status (draft/published/archived).

---

### 3.10 Template 14: Committee Index / Directory

**Route:** `/boards/:board-slug/committees`
**Page Count:** ~5 pages (one per board)
**Layout:** ~70% main content + ~30% right sidebar

**Sections:**
1. **Breadcrumbs** — Home / [Board] / Committees
2. **Page Title** — H1 "Committees"
3. **Committee Entries** — vertically stacked, each entry:
   - H2 committee name (anchor target for sidebar)
   - 2-4 sentence description paragraph
   - Optional "Learn more ->" link to dedicated committee detail page
4. **Anchor Nav Sidebar (right)** — "On this page" heading, vertical list of all committee names as anchor links.
   - Scroll-spy: active sidebar item updates as user scrolls past each committee heading
   - Sticky on desktop — follows viewport on scroll
   - AcSB has 13 committees

**Mobile:** Sidebar moves above content as collapsible "On this page" accordion or sticky jump-to dropdown.

**No pagination, no filters, no search** — static directory, all committees render on single page.

**CMS Collection:** `committees` with fields: name, slug, description (rich text), board (relationship), sortOrder, detailPageUrl, members (array of {name, role, organization}), status (active/inactive/archived).

---

### 3.11 Template 15: Contact / Form Page

**Route:** `/contact-us`
**Page Count:** 1 page (+ potentially comment submit forms)
**Layout:** Full-width, no sidebar

**Sections:**
1. **Page Title** — H1 "Contact Us"
2. **Intro Text** — rich text paragraph describing how to reach FRAS Canada
3. **Contact Form** — stacked vertical form:
   - Full Name (text, required)
   - Title (text, optional)
   - Organization (text, optional)
   - Email Address (email, required)
   - Business Phone (tel, optional)
   - Comments (textarea, required, ~6 rows)
4. **ReCaptcha** — Google ReCaptcha integration for bot prevention. Replaces legacy image CAPTCHA from current Sitecore site. Validation server-side.
5. **Submit Button** — purple filled, label "SUBMIT"
6. **Media Inquiries Block** — contact card: name (Daniella Girgenti, CMP), title (Director of Communications), email, phone

**Form behavior:**
- Client-side validation: highlight empty required fields, validate email format
- ReCaptcha: loads asynchronously, validates server-side
- Success: confirmation message or redirect to thank-you page
- Failure: scroll to first error, reset ReCaptcha

**Mobile:** ReCaptcha widget renders responsively. All form fields stretch full width.

**CMS Collections:**
- `form-submissions` — stores: fullName, title, organization, email, businessPhone, comments, submittedAt, status (new/read/replied)
- `pages` — stores page content: title, introText, formConfig.captchaEnabled, mediaInquiries group (heading, contactName, contactTitle, contactEmail, contactPhone)

---

### 3.12 Template 16: Authentication Page

**Route:** `/my-account/login`
**Page Count:** 1 page (login) + registration + password reset flows
**Layout:** Full-width, centered ~480px card, no sidebar

**Sections:**
1. **Login Form** — centered card container:
   - User Name (email address) — text input, required. Note: `type="text"` not `type="email"` (matches legacy behavior)
   - Password — password input, required
   - "Forgot your User Name?" link
   - "Forgot your Password?" link
   - "Log in" button — full-width purple filled. Note: "Log in" (two words, not "Login")
2. **Registration CTA** — "Not registered yet?" text + "Create My account" link. Note: capital "M", lowercase "a".
3. **CPA Canada Explanation** — rich text paragraph explaining authentication via Aptify DB API (member verification), includes link to cpacanada.ca/en/login
4. **Support Contact Block** — email: customerservice@cpacanada.ca, toll-free: 1 (800) 268-3793, international: +1 (416) 977-0748

**Design constraints:** No CAPTCHA on login. No "Remember me" checkbox.

**Auth implementation (application-level, not CMS):**
- Session management: Custom JWT session management (HTTP-only cookie)
- Aptify DB API integration — direct API calls for member verification (True/False membership check), session validation, and profile management. Replicates existing CPA solution (Next.js ↔ Aptify).
- Member privileges: protected form submissions only (Volunteer Registration, Document Comment Submission, Event Registration). All other content is freely available.
- Rate limiting: 5 attempts per 15 min
- CSRF: Next.js built-in via server actions

**Mobile:** Card stretches to full width with padding. Already single-column.

**CMS Global:** `auth-config` with fields for all labels, URLs, explanation text, support contact details.

---

### 3.13 Template 17: Simple Content / Empty State

**Route:** `/job-opportunities`
**Page Count:** 1 page (+ potentially other conditional-content pages)
**Layout:** Full-width, no sidebar, single column

**Sections:**
1. **Page Title** — H1 (e.g., "Become a part of something special!")
2. **Intro Prose** — 2 body paragraphs (rich text) + italic funding note: "FRAS Canada is funded by CPA Canada."
3. **Visual Divider** — horizontal rule
4. **Dynamic Listing Section:**
   - **"Open Positions" heading** — bold, always visible (even when empty)
   - **Populated state:** job listing cards stacked vertically, each with title, department/location, posted date, summary, "View Details ->" CTA
   - **Empty state:** italic message: "Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!"

**Design constraints:** No filtering, no sorting, no pagination. No fallback CTA when empty. The empty state is the default/expected state.

**Mobile:** Already single-column. Job cards stretch full-width. Posted date stacks below department/location.

**CMS Collections:**
- `pages` — stores heading, introContent, listingHeading, emptyStateMessage, layout ('simple-content')
- `job-postings` (new) — title, department, location, description (rich text), summary, postedDate, closingDate, externalUrl, status (draft/published/closed)

**Query logic:** Fetch `job-postings` where `status === 'published'` and `closingDate` is null or in the future. If count === 0, render empty state. Otherwise render cards sorted by `postedDate` descending.

---

### 3.14 Additional Page Types (from Notion Cross-Reference)

The following page types were identified in the Notion research cross-reference and are missing from the Phase 2 scope. They should be designed and built as part of Phase 2:

| # | Page Type | Route | Description |
|---|-----------|-------|-------------|
| 1 | ~~Annual Report Page~~ | `/[board]/about/annual-report` | **RESOLVED:** Reuse T3B content page pattern (content + section nav sidebar). Added as Epic 20.1 in Build Plan Phase 2. |
| 2 | ~~Error Pages (404/500)~~ | `/404`, `/500` | **RESOLVED:** Custom 404 page added as Epic 20.2 in Build Plan Phase 2. Pages with no equivalent (`/FAQs`, `/accessibility-policy`) get redirected to closest relevant page or homepage. Custom 404 handles remaining dead links. |
| 3 | ~~RSS Feed Page~~ | `/api/rss`, `/api/rss/[board]` | **RESOLVED:** Yes, build RSS feed endpoint. Added as Epic 20.3 in Build Plan Phase 2. Generates XML feed from news, meetings, document-for-comment collections. |
| 4 | ~~Internal/External News Page~~ | N/A | **RESOLVED:** Handled by `news` collection `externalUrl` field (added in Phase 2 extended `news` collection). News items with `externalUrl` render as external links with icon in listings. No separate redirect template needed. |
| 5 | Event Summary Detail | `/boards/:board-slug/meetings-and-events/:event-slug` | Individual event/meeting summary pages with Event Summary Table component. |
| 6 | ~~Volunteer Detail Page~~ | `/volunteer-opportunities/[slug]` | **RESOLVED:** Individual volunteer opportunity pages reuse the news/event detail pattern — rich text body with sidebar. `news` collection with `isVolunteerOpportunity: true` filter. |
| 7 | Decision Summaries Listing | `/boards/:board-slug/decision-summaries` | Collection exists in Phase 1 CMS but no listing page template is built. |

### 3.15 Additional Forms (from Notion Cross-Reference)

The following forms were identified in the Notion research and are missing from the Phase 2 scope:

| # | Form | Route | Auth Required | Description |
|---|------|-------|---------------|-------------|
| 1 | Register (Create Account) | `/my-account/register` | No | Separate registration page from Login. T16 only references it as a link. |
| 2 | Forgot Username | `/my-account/forgot-username` | No | Separate form page — not just a link from the login form. |
| 3 | Forgot Password | `/my-account/forgot-my-password` | No | Separate form page — not just a link from the login form. |
| 4 | Document For Comment Submission | `/submit-comment` (behind auth) | **Yes** | Member-only form. Email with attachment to CMS-maintained email address. No document storage in CMS. Same UI pattern as Volunteer Registration. |
| 5 | Event Registration | Behind auth | **Yes** | Member-only form. Triggers email notification. Blank Notion spec — needs design. |
| 6 | Volunteer Registration of Interest | Behind auth | **Yes** | Member-only form. Same UI as Document Comment Submission. Visitors upload CV expressing interest. Triggers email with attachment. |

**Key implementation notes for member-only forms:**
- All use the same UI pattern (form → email with optional attachment)
- "No logs or info or storage is required" — form submissions trigger emails only
- Must be logged in (Aptify DB API member verification) before accessing the form
- All member content access is freely available — only these form submissions require auth

### 3.16 Additional Components (from Notion Cross-Reference)

| # | Component | Description | Used In |
|---|-----------|-------------|---------|
| 1 | `<EventSummaryTable />` | Tabular meeting/event summary — "replica of existing Summary Table from current site" | Event Summary Detail page |
| 2 | `<MeetingTopicsTable />` | Separate from Effective Dates Table. Tabular display of meeting agenda topics. | Meeting Detail pages |

---

## 4. CMS Architecture

### 4.1 New Payload CMS Collections (Phase 2)

| Collection | Templates | Key Fields | Relationships |
|---|---|---|---|
| `board-members` | T4 | name, credentials, photo (205x205), role (enum), roleLabel, appointedDate, termExpires, sortOrder | board, bioPage (pages) |
| `standards-sections` | T5 | title, slug, boardLogo, boardName, tabs (array), featureCTAs (array with variant) | board, activeProjects (projects) |
| `document-for-comment` | T8 | title, slug, group (enum), status (open/closed), documentUrl, commentSubmitUrl, commentsPdfUrl, sortOrder, publishedDate | standard, board |
| `document-detail` | T9 | title, slug, highlights (richText), bodyContent (richText blocks), commentQuestions (array), replyDeadline, howToReply (object), supportMaterials (array) | standard, board, staffContacts (contacts) |
| `effective-dates-table` | T10 | introText (richText), sections (array of {headerLabel, headerDate, sortOrder, rows[]}) | standard |
| `effective-dates-footnote` | T10 | marker, text (richText) | table (effective-dates-table) |
| `contacts` | T9, shared | name, title, phone, email, photo (optional) | — (standalone) |
| `resources` | T11 | title, slug, date, category (multi-enum), resourceType (enum), excerpt, content, externalUrl, file, status | board, standard |
| `meetings` | T13 | title, slug, date, excerpt, content, type (enum), status | board |
| `committees` | T14 | name, slug, description (richText), sortOrder, detailPageUrl, members (array), status | board |
| `form-submissions` | T15 | fullName, title, organization, email, businessPhone, comments, submittedAt, status (new/read/replied) | — (standalone) |
| `job-postings` | T17 | title, department, location, description, summary, postedDate, closingDate, externalUrl, status (draft/published/closed) | — (standalone) |

### 4.2 Extended Collections (from Phase 1)

| Collection | Changes | New/Modified Fields |
|---|---|---|
| `pages` | Add sidebar configuration, form config, simple-listing support | sidebarType (select: staff-contact/section-nav/none), staffContacts (array), sectionNavLinks (array), ctaBlock (group), newsSection (boolean), board (relationship), formConfig (group), mediaInquiries (group), listingHeading, emptyStateMessage, layout |
| `news` | Add volunteer opportunity support and external link field | externalUrl (URL), isVolunteerOpportunity (boolean), category (enum: Document for Comment/International Activity/Meeting Summary/News/Resource) |

### 4.3 New Globals (Phase 2)

| Global | Purpose | Key Fields |
|---|---|---|
| `auth-config` | Authentication page content | login.usernameLabel, login.passwordLabel, login.buttonLabel, login.forgotUsernameLabel/Url, login.forgotPasswordLabel/Url, login.registerPrompt, login.registerLinkLabel/Url, login.cpaExplanation, login.cpaLoginUrl, login.supportHeading/Email/PhoneTollFree/PhoneIntl |

### 4.4 Enum Definitions

| Enum | Collection | Values |
|---|---|---|
| `board-members.role` | `board-members` | chair, vice-chair, voting-member, non-voting |
| `document-for-comment.group` | `document-for-comment` | exposure-draft, consultation-paper, re-exposure-draft, discussion-paper |
| `document-for-comment.status` | `document-for-comment` | open, closed |
| `standards-sections.featureCTAs.variant` | `standards-sections` | light, dark-purple |
| `resources.category` | `resources` | Article, Guidance, In Brief, Other, Webinar |
| `resources.resourceType` | `resources` | Audio, External Link, PDF, Video, Webpage, Plain Language |
| `news.category` | `news` | Document for Comment, International Activity, Meeting Summary, News, Resource |
| `meetings.type` | `meetings` | meeting, event, webinar, decision-summary |
| `committees.status` | `committees` | active, inactive, archived |
| `form-submissions.status` | `form-submissions` | new, read, replied |
| `job-postings.status` | `job-postings` | draft, published, closed |
| `pages.sidebarType` | `pages` | staff-contact, section-nav, none |

### 4.5 Relationship Diagram

```
pages (T3, T15, T17)
  +-- board -> boards
  +-- staffContacts[] (embedded)
  +-- sectionNavLinks[] (embedded)
  +-- sectionTabs[] -> pages (siblings)

board-members (T4)
  +-- board -> boards
  +-- bioPage -> pages

standards-sections (T5)
  +-- board -> boards
  +-- activeProjects[] -> projects

document-for-comment (T8)
  +-- standard -> standards
  +-- board -> boards

document-detail (T9)
  +-- standard -> standards
  +-- board -> boards
  +-- staffContacts[] -> contacts

effective-dates-table (T10)
  +-- standard -> standards

effective-dates-footnote (T10)
  +-- table -> effective-dates-table

contacts (shared: T9, Project Detail)
  (standalone, no outbound relationships)

resources (T11)
  +-- board -> boards
  +-- standard -> standards

news (T5, T12)
  +-- board -> boards

meetings (T13)
  +-- board -> boards

committees (T14)
  +-- board -> boards

form-submissions (T15)
  (standalone — stores form data)

job-postings (T17)
  (standalone — no relationships)
```

---

## 5. Component Architecture

### 5.1 Content Page Components (T3, T4, T5)

| Component | Used In | Description |
|---|---|---|
| `<StaffContactCard />` | T3A, T9 | Sidebar card: purple H2 heading, name with credentials, job title, phone (tel link), email (mailto link) |
| `<SectionNavSidebar />` | T3B, T4 | Vertical link list with active state (bold + underline), plain gray section label above divider |
| `<SectionTabs />` | T3, T4, T5 | Horizontal tab bar for board-level navigation. 5-7 tabs, active = bottom border highlight. Mobile = horizontal scroll. |
| `<MemberCard />` | T4 | 205x205 portrait photo + purple linked name + gray credentials + uppercase role label + appointment dates |
| `<BoardLogoHero />` | T5 | Board crest/wordmark centered on brand-color background with full board name |
| `<FeatureCTABlock />` | T5 | 1-2 side-by-side CTA cards (light gray or dark purple variants) with heading, description, arrow button |

### 5.2 Document & Reference Components (T8, T9, T10)

| Component | Used In | Description |
|---|---|---|
| `<TabPills />` | T8 | Two-pill toggle (Open/Closed) with URL query param switching, filled/outline states |
| `<GroupedTable />` | T8 | Table-like layout with gray banner (~#f0f0f0) section headers grouping document rows |
| `<DocumentRow />` | T8 | Title as purple link + optional action button (Submit comment / View Comments) |
| `<DarkPurpleCTA />` | T9 | Dark purple/near-black bg block with H3, body text, full mailing address, mailto, submit button |
| `<BlockquoteQuestion />` | T9 | Bordered question box with light background, used in "Comments Requested" sections |
| `<SupportMaterialsList />` | T9 | Chain-link icon + labeled document links (PDF, Basis for Conclusions, Snapshot) |
| `<EffectiveDatesTable />` | T10 | Full data table with purple section headers, 2-column layout, rich text cells, footnotes |
| `<PurpleSectionHeader />` | T10 | Full-width purple bg row with white text — table group divider by effective date |

### 5.3 Listing & Filter Components (T11, T12, T13, T14)

| Component | Used In | Description |
|---|---|---|
| `<CategoryPills />` | T11, T12 | Horizontal pill/tab row for category filtering. Active = filled. Mobile collapses to `<select>`. |
| `<SortFilterBar />` | T11, T12 | Dropdown controls for sort, items-per-page, date range. Stacks vertically on mobile. |
| `<ListingItem />` | T11, T12, T13 | Date + category badge + purple linked title + excerpt. Text-only, no thumbnails. |
| `<TabToggle />` | T13 | Two-state toggle for upcoming/past content. Remains as tabs on mobile. |
| `<AnchorNav />` | T14 | Sticky sidebar with "On this page" heading, scroll-spy highlighting, anchor links mirroring H2s |
| `<DateRangePicker />` | T11, T12 | Start/end date inputs with calendar picker (mm/dd/yyyy format) |
| `<ItemsPerPage />` | T11, T12, T13 | Dropdown selector for pagination size: 10, 20, 30, All |

### 5.4 Form & Auth Components (T15, T16, T17)

| Component | Used In | Description |
|---|---|---|
| `<ContactForm />` | T15 | Full contact form with labeled fields, client-side validation, server action submit |
| `<ReCaptcha />` | T15 | Google ReCaptcha widget for bot prevention. Replaces legacy image CAPTCHA from Sitecore site. |
| `<MediaInquiriesBlock />` | T15 | Contact card: name, title, email, phone for media/press inquiries |
| `<LoginForm />` | T16 | Username/password form with "forgot" links, full-width purple submit button |
| `<AuthLayout />` | T16 | Centered ~480px card wrapper for auth pages (login, register, forgot-password) |
| `<SupportContactBlock />` | T16 | Email + phone support contact block (CPA Canada customer service) |
| `<CpaExplanationBlock />` | T16 | Rich text block explaining CPA Canada shared authentication and funding model |
| `<SimpleContentPage />` | T17 | Layout wrapper: heading + rich text prose + visual divider + dynamic listing section |
| `<JobListings />` | T17 | Conditional renderer: job cards (populated) or empty state message (empty) |
| `<JobCard />` | T17 | Job posting card: title, department/location, posted date, summary, "View Details" CTA |
| `<EmptyState />` | T17 (+ reusable) | Italic message component for empty dynamic lists. Reusable across templates. |

### 5.5 Shared Components (reused from Phase 1)

| Component | Reused In | Notes |
|---|---|---|
| `<SiteHeader />` | All templates | Phase 1 3-row navigation header |
| `<SiteFooter />` | All templates | Phase 1 redesigned footer |
| `<Breadcrumb />` | T3, T4, T5, T11, T12, T13, T14 | Phase 1 path navigation trail |
| `<Pagination />` | T11, T12, T13 | Phase 1 "Previous / page numbers / Next" controls |
| `<PageHeader />` | All templates | Phase 1 H1 heading pattern |
| `<ContentTypeBadge />` | T11, T12 | Phase 1 colored badge component (reused for category tags) |

---

## 6. Design Considerations

### 6.1 Standards Navigation Gap

Phase 1's redesigned navigation **removes "Standards" from top-level navigation**. The live site has Standards as one of 4 mega-menu items, providing direct access to 11 standards sections (~50+ pages). The wireframe replaces this with:

1. **Homepage "Browse by Standard" section** — 4 cards (Sustainability, Accounting, Public Sector, Assurance) as the primary discovery mechanism
2. **Board Detail sidebar** — 7-item section nav includes "Consultations", "Projects & Initiatives", "Resources" which link to standards content
3. **Boards mega-menu** — 4-column dropdown with 7 items per board, some of which lead to standards pages

**RESOLVED:** Three access paths confirmed: (1) Homepage "Browse by Standard" card grid linking to standards overview pages, (2) Board Detail sidebar tabs linking to per-board standards, (3) Search with "Standard" facet filter. No dedicated top-level nav item needed. Power users who know specific standard names (e.g., "IFRS 16", "ASPE Section 3856") use search, which indexes standard names prominently via Meilisearch.

### 6.2 Phase 1 Nav Integration

All Phase 2 pages use the Phase 1 `<SiteHeader />` and `<SiteFooter />` components. The section-level navigation (breadcrumbs, section tabs) provides the intra-board wayfinding that the old mega-menu previously offered. This is consistent across T3, T4, T5 and integrates with the Board Detail page's sidebar nav.

### 6.3 Design Token Consistency

Phase 2 introduces additional design tokens that must align with Phase 1:

| Token | Value | Usage |
|---|---|---|
| Brand purple | `rgb(96, 31, 91)` / `#601f5b` | Headings, links, active states, CTA backgrounds — same as Phase 1 |
| Dark purple CTA bg | `~rgb(50, 20, 50)` | "How to Reply" block (T9), dark CTA variants (T5) |
| Light gray card bg | `#f0f0f0` | Group headers (T8, T10), light card backgrounds (T5) |
| Row alt bg | `#f9f9f9` | Alternating table rows (T8, T10) |
| Member photo size | 205 x 205px | Square portrait, consistent across all member cards |
| Auth card max-width | ~480px | Centered login form container |
| Empty state text | `font-style: italic` | Visually distinct from normal body text |

---

## 7. Critical Questions (All Resolved)

| # | Question | Impact | Suggested Resolution |
|---|----------|--------|---------------------|
| 1 | ~~How do users navigate to specific standards pages without top-level Standards nav?~~ | **Critical** | **RESOLVED:** (Same as PRD.md Q1.) Three access paths: (1) Homepage "Browse by Standard" card grid linking to standards overview pages, (2) Board Detail sidebar tabs linking to per-board standards, (3) Search with "Standard" facet filter. No dedicated top-level nav item needed. |
| 2 | ~~Should `document-for-comment` and `document-detail` be separate collections or a single collection with different views?~~ | **Medium** | **RESOLVED: Keep as two separate collections.** `document-for-comment` for listing data (title, slug, standard, group, status, deadline) and `document-detail` for full page content (body, highlights, replyInfo, supportMaterials, staffContacts). This avoids field bloat in the listing collection and simplifies admin panel UX. Listing pages query `document-for-comment`, detail pages query `document-detail` with a relationship to the listing item. |
| 3 | ~~What replaces the image CAPTCHA on the contact form?~~ | **Medium** | **RESOLVED:** ReCaptcha. Confirmed via Notion research — current site uses ReCaptcha, not image CAPTCHA. Keep CMS toggle (`formConfig.captchaEnabled`) for flexibility. |
| 4 | ~~What is the CPA Canada SSO integration method?~~ | **High** | **RESOLVED:** Aptify DB API — direct API calls to Aptify database (Next.js ↔ Aptify). Simple True/False membership check. No OAuth/SAML. Replicates existing CPA solution while CPA adopts SSO via Okta separately. |
| 5 | ~~Are the 5 tabs in standards-sections configurable per standard, or are they fixed?~~ | **Medium** | **RESOLVED:** Configurable tab array in CMS via `standards-sections.tabs` field. IFRS gets 6 tabs, all others get 5. Content editors can add/remove/reorder tabs per standard section. |
| 6 | ~~How should the effective dates table handle the non-chronological ordering (2018 before 2019)?~~ | **Low** | **RESOLVED:** Use `sortOrder` number field (not date) for section ordering within effective dates tables. Preserves intentional editorial non-chronological ordering. |
| 7 | ~~Where does the volunteer opportunities page live in the new IA?~~ | **Medium** | **RESOLVED:** Reuse T12 (Filtered News/Event Listing) with `isVolunteerOpportunity` pre-filter. Route: `/volunteer-opportunities`. Linked from utility bar "Volunteer" link and footer Quick Links. |
| 8 | ~~How will 1,010+ news items perform with client-side filtering?~~ | **Medium** | **RESOLVED:** Server-side pagination via API routes (`/api/news?page=...&limit=...`). Client-side filtering only manages active filter state and triggers new API calls. Server returns paginated results. Default 10 items per page with 20/30/All options. |
| 9 | ~~Should committee detail pages (linked from T14 "Learn more") be separate pages or anchor sections?~~ | **Low** | **RESOLVED:** Anchor-only on T14 index page. Each committee is an H2 section with auto-generated anchor ID. `<AnchorNav />` sidebar provides jump navigation. No separate detail pages — stretch goal only if committees have substantial standalone content. |
| 10 | ~~How do Phase 2 pages handle the bilingual (EN/FR) requirement?~~ | **High** | **RESOLVED:** Same strategy as Phase 1. All Phase 2 CMS collections get locale fields via Payload i18n plugin. FR URL routing follows `[locale]` pattern. FR translation strings added to `messages/fr.json`. No separate FR wireframes needed — assume 1:1 content parity. |

---

## 8. Non-Functional Requirements

All Phase 1 NFRs apply, plus:

- **Performance:** Core Web Vitals passing (LCP < 2.5s, INP < 200ms, CLS < 0.1). Effective dates tables and meeting archives (180+ items) must use server-side pagination and/or virtual scrolling.
- **Accessibility:** WCAG 2.1 AA compliance. Specific concerns: form field labels and error messages (T15), CAPTCHA alternative for screen readers (T15), keyboard navigation for scroll-spy anchor nav (T14), focus management on tab toggles (T8, T13).
- **SEO:** Server-rendered pages, semantic HTML, structured data. Standards pages need `BreadcrumbList` and potentially `FAQPage` schema for comment questions (T9). Job postings need `JobPosting` schema (T17).
- **Responsive:** 390px (mobile) to 1440px (desktop), fluid breakpoints. Key adaptation patterns: sidebar drops below content (T3, T4, T9, T14), pills collapse to `<select>` (T11, T12), tables collapse to stacked cards (T5, T10).
- **Browser support:** Latest 2 versions of Chrome, Firefox, Safari, Edge
- **Bilingual (i18n):** All Phase 2 CMS collections support locale field. FR routing planned. Content model must accommodate parallel EN/FR content from Day 1.
- **Authentication integration:** Aptify DB API (direct API calls, member True/False). Session management via custom JWT session management (HTTP-only cookie). Rate limiting on login (5 attempts/15 min). CSRF protection via Next.js server actions.
- **Form security:** Contact form ReCaptcha. Server-side validation. XSS prevention on form submission storage. Email notification on new submissions.
- **Print support:** Effective dates tables (T10) should be print-friendly with `@media print` styles to avoid breaking rows across pages.

---

## 9. Mobile Adaptation Summary

| Template | Desktop Layout | Mobile Adaptations |
|---|---|---|
| T3A: Content + Staff Contact Sidebar | 70/30 main + sidebar | Sidebar drops below main content, full width |
| T3B: Content + Section Nav Sidebar | 70/30 main + sidebar | Sidebar drops below main content as vertical link list |
| T4: People Listing (Members) | 70/30, 2-col card grid + sidebar | Cards stack 1-column; sidebar drops below |
| T5: Standards Overview (Tabbed) | Full-width, tabs + table + CTAs + news | Table becomes stacked cards; CTAs stack; news cards stack 1-col; tabs horizontal scroll |
| T8: Documents for Comment | Full-width, pill toggle + grouped rows | Rows stack with button below title; headers span full width |
| T9: Document Detail | 70/30 main + contact sidebar | Sidebar drops below; CTA block full width; blockquotes reduce padding |
| T10: Effective Dates Table | Full-width, 2-col data table | Columns stack (Application above Pronouncement); purple headers span full width |
| T11: Resources Listing | Full-width, pills + filter bar + paginated list | Pills become `<select>` dropdown; filter fields stack vertically |
| T12: Filtered News/Event Listing | Full-width, 6 pills + filter bar + paginated list | Pills become `<select>` dropdown; filter fields stack vertically |
| T13: Meetings & Events Listing | Full-width, tab toggle + items-per-page + paginated list | Tab toggle remains as tabs; items stack full-width |
| T14: Committee Index / Directory | 70/30 main + sidebar | Sidebar moves above content as collapsible "On this page" accordion |
| T15: Contact / Form Page | Full-width, stacked form | CAPTCHA stacks vertically; all fields full-width; media block stacks below |
| T16: Authentication Page | Centered ~480px card | Card stretches to full width with padding; already single-column |
| T17: Simple Content / Empty State | Full-width, single column | Already single-column; text reflows naturally; job cards stretch full-width |

---

*Generated: 2026-03-04 | Source: wireframe-specs-phase2.md + site-discovery-verified.md + wireframe-vs-live-gap-analysis.md + PRD.md (Phase 1)*
