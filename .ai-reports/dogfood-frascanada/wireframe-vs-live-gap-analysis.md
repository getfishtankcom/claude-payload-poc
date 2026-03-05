# FRAS Canada — Wireframe vs. Live Site Gap Analysis

**Status: This analysis is from Phase 1 wireframe review. All 13 templates marked 'NOT COVERED' below now have Phase 2 wireframe specs in `wireframe-specs-phase2.md`. Coverage is now 17/17 templates (100%).**

| Field | Value |
|-------|-------|
| **Date** | 2026-03-04 |
| **Sources** | Wireframe Specs (`wireframe-specs.md`) / Live Site Discovery (`site-discovery-verified.md`) |
| **Wireframe Source** | Figma file `FRAS-2025-07-22`, Page "Wireframe Deliverables 07-21-25" |
| **Live Site** | https://www.frascanada.ca/ (Sitecore CMS, ASP.NET WebForms) |
| **Purpose** | Reconcile wireframe deliverables against verified live site inventory to determine scope, gaps, and build strategy |

---

## Table of Contents

1. [Navigation Changes](#1-navigation-changes)
2. [Template Mapping](#2-template-mapping)
3. [Component Mapping](#3-component-mapping)
4. [Content Type Mapping](#4-content-type-mapping)
5. [Feature Changes](#5-feature-changes)
6. [Scope Determination](#6-scope-determination)

---

## 1. Navigation Changes

The wireframe introduces a fundamentally restructured navigation architecture. The live site uses a 4-dropdown mega-menu organized by organizational entity (FRAS Canada, Council, Boards, Standards). The wireframe replaces this with a 3-row header organized by function (utility links, brand + search, content categories).

### 1.1 Header Structure Comparison

| Aspect | Live Site | Wireframe | Change Type |
|--------|-----------|-----------|-------------|
| **Overall structure** | Single nav bar with 4 mega-menu dropdowns | 3-row header (utility bar, main bar, primary nav) | **Redesign** |
| **Row 1 / Utility** | Login, Language toggle (displays language name), Search icon | About Us (dropdown), Boards (dropdown), Contact, Newsletter, Volunteer, FR toggle, Sign In | **Redesign** — utility bar absorbs secondary/institutional links |
| **Row 2 / Main bar** | Logo + 4 mega-menu items (FRAS Canada, Council, Boards, Standards) | Logo + persistent search input ("Projects, standards, and more...") | **Redesign** — mega-menu items removed from main bar; search promoted to persistent visibility |
| **Row 3 / Primary nav** | _(does not exist)_ | Active Projects (dropdown), Open Consultations, News | **New** — dedicated content-focused nav row |
| **Login placement** | Utility nav (always visible) | Utility bar row 1 as "Sign In" with user icon | **Moved** — same visibility, different label |
| **Language toggle** | Utility nav, displays current language name (e.g., "English") | Utility bar row 1 as "FR" abbreviation | **Simplified** — shorter label |
| **Search trigger** | Icon in utility nav, opens overlay | Persistent search input in row 2 + search modal on click | **Elevated** — search is now always visible, not hidden behind icon |

### 1.2 Mega-Menu / Dropdown Comparison

| Dropdown | Live Site | Wireframe | Change Type |
|----------|-----------|-----------|-------------|
| **FRAS Canada** | Mega-menu: About, Research Program, News, Jobs, Volunteer, Contact | Replaced by "About Us" dropdown in utility bar: About FRAS Canada, Oversight Council, Research Program, Jobs | **Restructured** — fewer items, Council moved here |
| **Council (RASOC)** | Mega-menu: About, Members, Meetings, News, Committees (Governance, Nominating), Volunteer | Absorbed into "About Us" dropdown as "Oversight Council" single link | **Reduced** — RASOC sub-pages lose dedicated mega-menu; accessed via About Us or Board detail |
| **Boards** | Mega-menu sub-sections for CSSB, AcSB, PSAB, AASB with: About, Members, ToR, Due Process, FAQs, SOP, Meetings, Committees, News, Volunteer | Utility bar "Boards" dropdown: 4-column mega-menu with 7 items per board (Overview, Consultations, Projects & Initiatives, Resources, Meetings & Decision Summaries, Committees, Volunteer) | **Simplified** — consolidated from ~10 sub-pages per board to 7 standardized sections |
| **Standards** | 11 sub-sections (Sustainability, IFRS, ASPE, NFP, Pensions, Public Sector, IPSAS, CSQM, CAS, CASS, Other) each with 5-6 tabs | Removed as top-level nav item — standards accessed via "Browse by Standard" homepage section or board pages | **Removed from nav** — standards no longer have dedicated top-level navigation |
| **Active Projects** | _(does not exist as nav item)_ | Primary nav row 3: dropdown listing all 4 boards | **New** — dedicated project-focused navigation |
| **Open Consultations** | _(does not exist as nav item)_ | Primary nav row 3: direct link | **New** |
| **News** | Nested under FRAS Canada mega-menu | Primary nav row 3: direct link | **Elevated** — promoted to top-level |

### 1.3 Footer Comparison

| Aspect | Live Site | Wireframe | Change Type |
|--------|-----------|-----------|-------------|
| **Column structure** | 2-column link groups + bottom bar | 4 columns (Org info, Boards, Quick Links, Account) + Newsletter CTA row + Copyright bar | **Redesign** |
| **Org info** | FRAS Canada full name | FRAS Canada + full name + LinkedIn icon | Similar |
| **Board links** | CSSB, AcSB, PSAB, AASB | CSSB, AcSB, PSAB, AASB, RASOC (5 total, full names) | **Added** RASOC |
| **Quick links** | About, Research, News, Jobs, Volunteer, Contact | About Us, Research Program, News, Jobs, Volunteer, Contact, Newsletter + Site Map, Privacy Policy, Cookie Policy | **Expanded** |
| **Account section** | _(not in footer)_ | Login, Francais (language toggle) | **New** |
| **Newsletter CTA** | Receive Enewsletter link in bottom bar | Dedicated row with heading, description, email input, Subscribe button | **Elevated** — inline subscription form |
| **Social links** | LinkedIn, Twitter, YouTube in bottom bar | LinkedIn only (in org column) | **Reduced** — Twitter/YouTube dropped |
| **Legal links** | Cookie Policy, Privacy, Terms of Use | Privacy Policy, Cookie Policy, Terms of Use | Similar (minor label change) |

### 1.4 Mobile Navigation Comparison

| Aspect | Live Site | Wireframe | Change Type |
|--------|-----------|-----------|-------------|
| **Mobile menu** | Assumed responsive collapse of mega-menu | Full-screen overlay with expandable sections, search input at top, FR + Sign In | **Redesign** — purpose-built mobile menu |
| **Hierarchy** | 4 mega-menu sections | Active Projects > Boards > About Us (expandable), Open Consultations, News, Contact, Newsletter, Volunteer | **Restructured** to match new IA |

### 1.5 Navigation Impact Summary

- **11 Standards sections** lose dedicated top-level navigation — this is a major IA change affecting ~50+ standards pages
- **RASOC/Council** loses its own mega-menu dropdown — reduced to a sub-link under "About Us"
- **Active Projects and Open Consultations** gain first-class nav status — reflects a shift toward stakeholder engagement as the primary use case
- **Search** is elevated from a hidden icon to a persistent, always-visible input bar

---

## 2. Template Mapping

### 2.1 Live Site Templates → Wireframe Coverage

| # | Live Template | Live URL Pattern | Wireframe Frame | Coverage |
|---|--------------|------------------|-----------------|----------|
| T1 | Homepage | `/en` | `Homepage` (1440x2968) + `Homepage Mobile` (390px) | **Covered — Redesigned** |
| T2 | Board/Council Landing (Dashboard) | `/en/acsb`, `/en/rasoc`, etc. | `Boards` (1440x2542) | **Covered — Redesigned** |
| T3 | Content Page + Right Sidebar | `/en/about`, `/en/acsb/about`, etc. | _(no wireframe frame)_ | **NOT COVERED** |
| T4 | People Listing (Members) | `/en/acsb/about/members`, etc. | _(no wireframe frame)_ | **NOT COVERED** |
| T5 | Standards Overview (Tabbed) | `/en/ifrsstandards`, `/en/aspe`, etc. | _(no wireframe frame)_ | **NOT COVERED** |
| T6 | Project Listing (Timeline Table) | `/en/{standard}/projects` | `Active Projects` (1440x2682) | **Partially Covered** — wireframe uses card-based listing grouped by board, not timeline table grouped by standard |
| T7 | Project Detail | `/en/{standard}/projects/{slug}` | `Project` (1440x3116) | **Covered — Redesigned** |
| T8 | Documents for Comment Listing | `/en/{standard}/documents` | _(no wireframe frame)_ | **NOT COVERED** |
| T9 | Document Detail (Exposure Draft) | `/en/{standard}/documents/{slug}` | _(no wireframe frame)_ | **NOT COVERED** |
| T10 | Effective Dates Table | `/en/{standard}/effective-dates` | _(no wireframe frame)_ | **NOT COVERED** |
| T11 | Resources Listing | `/en/{standard}/resources` | _(no wireframe frame)_ | **NOT COVERED** |
| T12 | Filtered News/Event Listing | `/en/news-listings`, board news | _(no wireframe frame)_ | **NOT COVERED** (News is in primary nav but no listing wireframe) |
| T13 | Meetings & Events Listing | `/en/acsb/meetings-and-events` | _(no wireframe frame)_ | **NOT COVERED** |
| T14 | Committee Index / Directory | `/en/acsb/committees` | _(no wireframe frame)_ | **NOT COVERED** |
| T15 | Contact / Form Page | `/en/contact-us` | _(no wireframe frame)_ | **NOT COVERED** |
| T16 | Authentication Page | `/en/my-account/login` | _(no wireframe frame)_ | **NOT COVERED** |
| T17 | Simple Content / Empty State | `/en/job-opportunities` | _(no wireframe frame)_ | **NOT COVERED** |

### 2.2 Wireframe Frames → Live Site Mapping

| # | Wireframe Frame | Route | Live Equivalent | Status |
|---|----------------|-------|-----------------|--------|
| W1 | Homepage (Desktop) | `/` | T1: Homepage | **Replaces** — full redesign |
| W2 | Homepage (Mobile) | `/` | T1: Homepage (responsive) | **Replaces** — mobile-specific |
| W3 | Search Modal | _(overlay)_ | Global search overlay | **Replaces** — adds Recent/Popular tags |
| W4 | Search Filters | _(panel)_ | _(no equivalent — live site search is basic)_ | **NEW** |
| W5 | Search Results | `/search?q=...` | _(no equivalent — live site has no search results page)_ | **NEW** |
| W6 | Project Detail | `/active-projects/:board/:project-slug` | T7: Project Detail | **Replaces** — redesigned with 3-column layout |
| W7 | Active Projects Listing | `/active-projects/:board` | T6: Project Listing (Timeline Table) | **Replaces** — card-based replaces timeline table |
| W8 | Open Consultations Listing | `/open-consultations` | T8: Documents for Comment (partial) | **NEW** — dedicated consultation page (live site has no equivalent aggregate view) |
| W9 | Board Detail | `/boards/:board-slug` | T2: Board/Council Landing | **Replaces** — redesigned |
| W10 | Mobile Menu Collapse | _(overlay)_ | _(responsive nav)_ | **NEW** — purpose-built mobile menu |
| W11 | Mobile Menu Expand | _(overlay)_ | _(responsive nav)_ | **NEW** — purpose-built mobile menu |
| W12 | Navigation & Footer (Components) | _(global)_ | Global header/footer | **Replaces** — redesigned |
| W13 | Search Filters Mobile | _(panel)_ | _(no equivalent)_ | **NEW** |
| W14 | Search Modal Mobile | _(overlay)_ | _(no equivalent)_ | **NEW** |
| W15 | Search Results Mobile | `/search?q=...` | _(no equivalent)_ | **NEW** |

### 2.3 Coverage Summary

| Metric | Count | Details |
|--------|-------|---------|
| **Live templates with wireframe coverage** | 4 of 17 | Homepage, Board Landing, Project Detail, Project Listing (partial) |
| **Live templates with NO wireframe coverage** | 13 of 17 | Content Page, Members, Standards Overview, Documents for Comment, Document Detail, Effective Dates, Resources, News Listing, Meetings Listing, Committee Index, Contact, Auth, Empty State |
| **Wireframe frames introducing NEW pages** | 3 | Search Results, Open Consultations (aggregate), Search Filters |
| **Wireframe coverage rate** | ~24% | Only 4 of 17 live templates are addressed |

### 2.4 Critical Uncovered Templates

The following live templates have significant content volume and **no wireframe coverage**:

| Template | Content Volume | Impact |
|----------|---------------|--------|
| Standards Overview (Tabbed) | 11 sections, ~50+ sub-pages | **Critical** — core content taxonomy |
| Documents for Comment Listing | 11 sections | **High** — stakeholder engagement |
| Document Detail (Exposure Draft) | ~50+ pages | **High** — primary stakeholder interaction |
| Filtered News/Event Listing | ~1,010 items | **High** — largest content set |
| Meetings & Events Listing | ~180+ items per board | **Medium** |
| Content Page + Right Sidebar | ~50+ pages | **Medium** — most common template |
| People Listing (Members) | ~5 pages | **Low** — small count but board governance |
| Authentication Page | Login, Register, Password reset | **Medium** — CPA Canada integration |

---

## 3. Component Mapping

### 3.1 Wireframe Components → Live Site Components

| # | Wireframe Component | Live Equivalent | Mapping |
|---|-------------------|----------------|---------|
| 1 | `<SiteHeader />` (3-row) | Header Nav Bar (single bar) | **Replaces** — completely new structure |
| 2 | `<SiteFooter />` (4-col + newsletter) | Footer (2-col + bottom bar) | **Replaces** — redesigned layout |
| 3 | `<MobileMenu />` | _(responsive collapse)_ | **New** — purpose-built overlay |
| 4 | `<SearchModal />` | Search overlay (basic) | **Replaces** — adds Recent/Popular tags |
| 5 | `<SearchBar />` | _(search icon trigger only)_ | **New** — persistent search input |
| 6 | `<Breadcrumb />` | Breadcrumbs | **1:1 equivalent** |
| 7 | `<PageHeader />` (icon + title) | Section Title Block | **Replaces** — adds icon/board context |
| 8 | `<FilterSidebar />` | _(no equivalent)_ | **New** — multi-faceted search filters |
| 9 | `<SearchResultCard />` | _(no equivalent)_ | **New** — typed search results |
| 10 | `<ProjectCard />` | _(no direct equivalent; closest is Data Table row)_ | **New** — card-based project display |
| 11 | `<ConsultationCard />` | _(no equivalent)_ | **New** — consultation-specific card |
| 12 | `<ProjectTimeline />` (5-stage stepper) | Project Status Timeline (5 phases) | **Replaces** — same concept, redesigned visual |
| 13 | `<SectionNav />` | Section Nav Sidebar | **1:1 equivalent** |
| 14 | `<QuickActions />` | _(no equivalent)_ | **New** — board quick-action buttons |
| 15 | `<UpcomingEvents />` | _(no equivalent as sidebar widget)_ | **New** — sidebar event list |
| 16 | `<ResourcesList />` | Support Materials | **Replaces** — expanded to general resources |
| 17 | `<RecentNews />` | News List Item (in listing context) | **Replaces** — compact sidebar/section variant |
| 18 | `<NewsEventsGrid />` | Feature Card (Top Stories) | **Replaces** — 3-column grid replaces feature cards |
| 19 | `<BrowseByStandard />` | _(no equivalent)_ | **New** — homepage standards navigation |
| 20 | `<NewsletterCTA />` | Newsletter CTA Block (AcSB/RASOC only) | **Replaces + Universalized** — now in footer + homepage |
| 21 | `<TagChip />` | _(no equivalent)_ | **New** — search tag pills |
| 22 | `<ContentTypeBadge />` | Category Tags (text-only) | **Replaces** — styled badge vs plain text |
| 23 | `<Pagination />` | Pagination | **1:1 equivalent** |
| 24 | `<MegaMenu />` | Mega Menu Dropdown | **Replaces** — restructured for new nav |

### 3.2 Live Site Components → Wireframe Coverage

| # | Live Component | Wireframe Equivalent | Status |
|---|---------------|---------------------|--------|
| 1 | Header Nav Bar | `<SiteHeader />` | **Covered** (redesigned) |
| 2 | Mega Menu Dropdown | `<MegaMenu />` | **Covered** (restructured) |
| 3 | Hero Banner (purple gradient + dotted pattern + board logo) | _(no equivalent)_ | **DROPPED** — wireframe homepage uses white bg hero with text + search |
| 4 | Breadcrumbs | `<Breadcrumb />` | **Covered** (1:1) |
| 5 | Section Title Block | `<PageHeader />` | **Covered** (enhanced) |
| 6 | Section Tab Navigation (5-7 tabs) | `<SectionNav />` (left sidebar) | **Changed** — horizontal tabs replaced by vertical sidebar nav |
| 7 | Footer | `<SiteFooter />` | **Covered** (redesigned) |
| 8 | Cookie Consent Banner (OneTrust) | _(not in wireframes)_ | **NOT COVERED** — assumed to persist as third-party integration |
| 9 | Cookie Preferences Button | _(not in wireframes)_ | **NOT COVERED** — assumed to persist |
| 10 | Feature Card (Top Stories) | `<NewsEventsGrid />` | **Replaced** by 3-column news/events/consultations grid |
| 11 | News List Item | `<RecentNews />` | **Covered** (variant) |
| 12 | Meeting Summary Item | _(no dedicated component)_ | **NOT COVERED** — meetings not explicitly wireframed |
| 13 | Staff Contact Card (H2 + name/email/phone) | Contacts section (project detail bottom) | **Partially Covered** — appears in project detail but not as reusable sidebar card |
| 14 | Section Nav Sidebar | `<SectionNav />` | **Covered** (1:1) |
| 15 | Category Filter Pills | _(no equivalent)_ | **DROPPED** — replaced by checkbox/dropdown filters |
| 16 | Sort/Filter Bar (dropdowns + date range) | _(no equivalent)_ | **DROPPED** — replaced by `<FilterSidebar />` for search; simpler filter bar for listings |
| 17 | Pagination | `<Pagination />` | **Covered** (1:1) |
| 18 | Tab Toggle (Upcoming/Past, Open/Closed, Active/Completed/Deferred) | _(no equivalent)_ | **DROPPED** — not present in wireframes |
| 19 | Data Table (Active Projects — 2-column) | _(no equivalent)_ | **DROPPED** — replaced by `<ProjectCard />` |
| 20 | Timeline Table (Q1/Q2/H2 milestone badges) | _(no equivalent)_ | **DROPPED** — replaced by card-based listing |
| 21 | Project Status Timeline (5 phases, green checkmarks) | `<ProjectTimeline />` (5-stage stepper) | **Covered** (redesigned) |
| 22 | Effective Dates Table | _(no equivalent)_ | **NOT COVERED** |
| 23 | Documents Table | _(no equivalent)_ | **NOT COVERED** |
| 24 | Dark Purple CTA Block | _(no equivalent)_ | **DROPPED** — wireframe uses different CTA patterns |
| 25 | Flexible Promotional Content Zone | _(no equivalent)_ | **NOT COVERED** — board detail wireframe uses fixed layout |
| 26 | 2-Column Feature Block | _(no equivalent)_ | **DROPPED** |
| 27 | Newsletter CTA Block (AcSB/RASOC-specific) | `<NewsletterCTA />` | **Covered** (redesigned, universalized) |
| 28 | Disclaimer Block (black bg, legal text) | _(no equivalent)_ | **NOT COVERED** |
| 29 | Member Card (205x205 photo + credentials) | _(no equivalent)_ | **NOT COVERED** |
| 30 | Contact Form (with image CAPTCHA) | _(no equivalent)_ | **NOT COVERED** |
| 31 | Login Form | _(no equivalent)_ | **NOT COVERED** |
| 32 | Empty State Message | _(no equivalent)_ | **NOT COVERED** |
| 33 | External Link Icon | _(no equivalent)_ | **NOT COVERED** |
| 34 | "Read more" / "Read now" Button variants | Ghost button pattern ("Get Started ->", "View All ->") | **Partially Covered** — different styling |
| 35 | "Back to projects" Link | _(breadcrumbs serve this role)_ | **Replaced** by breadcrumbs |

### 3.3 Component Coverage Summary

| Metric | Count |
|--------|-------|
| **Wireframe components total** | 24 |
| **Wireframe components that are NEW (no live equivalent)** | 10 |
| **Wireframe components replacing live components** | 11 |
| **Wireframe components that are 1:1 matches** | 3 |
| **Live components total** | ~35 |
| **Live components covered by wireframe** | 15 (~43%) |
| **Live components NOT covered (dropped or missing)** | 20 (~57%) |
| **Live components explicitly dropped/redesigned** | 9 |
| **Live components with no wireframe coverage (gap)** | 11 |

---

## 4. Content Type Mapping

### 4.1 Wireframe Payload CMS Collections vs. Live Content Types

| # | Wireframe Collection | Live Content Type | Mapping | Notes |
|---|---------------------|-------------------|---------|-------|
| 1 | `pages` | Page | **1:1** | Static content pages |
| 2 | `boards` | Board/Council | **1:1** | Includes RASOC |
| 3 | `standards` | Standard | **1:1** | 11 standards mapped to board relationships |
| 4 | `projects` | Project | **1:1** | Active/Completed/Deferred status, timeline phases |
| 5 | `consultations` | _(no direct equivalent)_ | **NEW** | Live site handles consultations as Documents for Comment — wireframe creates a separate entity |
| 6 | `news` | News Item | **1:1** | Title, date, board, category, content |
| 7 | `events` | Meeting/Event | **Partial** | Wireframe separates events from meetings; live site combines them under Meeting/Event with board-specific terminology |
| 8 | `documents` | Document for Comment + Resources (partial) | **Merged/Simplified** | Wireframe combines EDs, guides, and uploads into one `documents` collection |
| 9 | `decision-summaries` | Meeting/Event (subtype) | **Split out** | Live site treats decision summaries as a Meeting/Event type; wireframe creates a separate collection |
| 10 | `contacts` | _(embedded in Staff Contact Card)_ | **NEW as collection** | Live site embeds contact info inline; wireframe externalizes into a reusable collection |

### 4.2 Live Content Types → Wireframe Collection Coverage

| # | Live Content Type | Wireframe Collection | Status |
|---|------------------|---------------------|--------|
| 1 | News Item | `news` | **Covered** |
| 2 | Project | `projects` | **Covered** |
| 3 | Document for Comment | `consultations` + `documents` | **Covered** (split across two collections) |
| 4 | Resource | `documents` (partial) | **Partially Covered** — wireframe `documents` handles uploads but no dedicated Resource collection with type taxonomy (Article, Guidance, In Brief, Webinar, etc.) |
| 5 | Meeting/Event | `events` + `decision-summaries` | **Covered** (split into two collections) |
| 6 | Member | _(no collection)_ | **NOT COVERED** — no `members` collection defined |
| 7 | Committee | _(no collection)_ | **NOT COVERED** — no `committees` collection defined |
| 8 | Board/Council | `boards` | **Covered** |
| 9 | Standard | `standards` | **Covered** |
| 10 | Job Opportunity | _(no collection)_ | **NOT COVERED** — no jobs collection defined |
| 11 | Volunteer Opportunity | _(no collection)_ | **NOT COVERED** — wireframe nav includes "Volunteer" link but no collection |
| 12 | Page | `pages` | **Covered** |

### 4.3 Wireframe Globals vs. Live Site Needs

| # | Wireframe Global | Live Equivalent | Status |
|---|-----------------|----------------|--------|
| 1 | `navigation` | Header nav config | **Covered** |
| 2 | `footer` | Footer config | **Covered** |
| 3 | `homepage` | Homepage content | **Covered** |
| 4 | `search-config` | _(no equivalent — search is basic)_ | **NEW** |

### 4.4 Content Type Gap Summary

| Metric | Count |
|--------|-------|
| **Live content types covered** | 8 of 12 |
| **Live content types NOT covered** | 4 (Member, Committee, Job Opportunity, Volunteer Opportunity) |
| **Wireframe collections that are NEW** | 2 (`consultations`, `contacts`) |
| **Wireframe collections that split live types** | 2 (`events` + `decision-summaries` from Meeting/Event) |
| **Missing Resource taxonomy** | Yes — wireframe has no equivalent to the Article/Guidance/In Brief/Webinar/Other resource type system |

---

## 5. Feature Changes

### 5.1 New Features in Wireframes (Not on Live Site)

| # | Feature | Wireframe Location | Description | Impact |
|---|---------|-------------------|-------------|--------|
| 1 | **Search Modal with Tags** | Search Modal frame | Full-screen overlay with Recent and Popular tag chips | Significant UX improvement |
| 2 | **Faceted Search Filters** | Search Filters frame | 5-category filter panel: By Board, By Standard, Files & Media, Content Type, Date | Major new feature — live site has no faceted search |
| 3 | **Search Results Page** | Search Results frame | Dedicated `/search` route with typed result cards, filter sidebar, pagination, "Save Search Alert" | Major new feature — live site has no search results page |
| 4 | **Open Consultations Listing** | Open Consultations frame | Aggregate view of all open consultations across all boards with filter bar and countdown timers | New page type — live site only has per-standard Documents for Comment listings |
| 5 | **Active Projects by Board** | Active Projects frame | Board-centric project listing with sidebar board nav, card-based display, stage indicators | Replaces standard-centric timeline table with board-centric card view |
| 6 | **Project Detail 3-Column Layout** | Project frame | Left sidebar nav + main content + right sidebar (actions, events, resources) | Significant redesign from current 2-column layout |
| 7 | **Board Detail 3-Column Layout** | Boards frame | Left sidebar nav + active projects + right sidebar (quick actions, events, resources) | Significant redesign from current tabbed layout |
| 8 | **Browse by Standard** | Homepage | 4-column card grid categorizing all standards by domain (Sustainability, Accounting, Public Sector, Assurance) | New homepage section |
| 9 | **"New to FRAS?" CTA** | Homepage | Onboarding prompt with "Get Started" button | New engagement feature |
| 10 | **Newsletter CTA (universal)** | Homepage + Footer | Email input + subscribe in both homepage body and footer | Expanded from 2 board landings to site-wide |
| 11 | **Project Timeline Stepper** | Project Detail | Visual 5-stage stepper with status indicators and inline CTAs (Take Survey, Submit Comment) | Redesign of existing 5-phase timeline |
| 12 | **Content Type Badges** | Search Results, Active Projects | Colored label badges (Standard, News, Webinar, Guidance, etc.) | Replaces plain-text category tags |
| 13 | **Consultation Countdown** | Open Consultations | "Comments due in X days" countdown per consultation | New engagement feature |
| 14 | **"Save Search Alert"** | Search Results | Link to save/subscribe to search query alerts | New feature |

### 5.2 Live Site Features NOT in Wireframes

| # | Feature | Live Location | Description | Risk |
|---|---------|--------------|-------------|------|
| 1 | **Standards Overview Tabbed Pages** | 11 `/en/{standard}` sections | 5-6 tab interface (Overview, Project Listing, Documents for Comment, Effective Dates, Resources, IFRIC) | **Critical** — core content architecture with no wireframe coverage |
| 2 | **Effective Dates Table** | `/en/{standard}/effective-dates` | Purple section-header grouped table with Application/Pronouncement columns | **High** — regulatory reference content |
| 3 | **Document Detail (Exposure Draft)** | `/en/{standard}/documents/{slug}` | Highlights, body, Comments Requested, When to Reply, How to Reply CTA block, Support Materials | **High** — primary stakeholder interaction |
| 4 | **Documents for Comment Listing** | `/en/{standard}/documents` | Open/Closed toggle, grouped table, Submit Comment buttons | **High** — stakeholder engagement |
| 5 | **Resources Listing + Taxonomy** | `/en/{standard}/resources` | Category pills (Article, Guidance, In Brief, Other, Webinar), type dropdown, sort, date range, pagination | **High** — content discovery |
| 6 | **Login / Authentication** | `/en/my-account/login` | Login form, CPA Canada federated auth, registration, password reset | **High** — user authentication |
| 7 | **Members / People Listing** | `/en/{board}/about/members` | 205x205 photo cards, credentials, appointment dates, role labels, section grouping | **Medium** — board governance |
| 8 | **Committee Index** | `/en/{board}/committees` | Committee directory with descriptions, sidebar anchor nav | **Medium** — organizational structure |
| 9 | **Meetings & Events Listing** | `/en/{board}/meetings-and-events` | Upcoming/Past toggle, paginated (180+ items per board) | **Medium** — large content archive |
| 10 | **Job Opportunities** | `/en/job-opportunities` | Conditional display with empty state message | **Low** — small page |
| 11 | **Volunteer Opportunities Listing** | `/en/volunteer-opportunities` | Board-based category tabs, listing items | **Medium** — recruitment feature |
| 12 | **Contact Form** | `/en/contact-us` | Multi-field form with image CAPTCHA, media inquiries block | **Medium** — user communication |
| 13 | **Hero Banner** (purple gradient + dotted circle pattern + board logo) | All inner pages | Branded banner with contextual board logo | **Medium** — visual identity element |
| 14 | **Section Tab Navigation** (horizontal tabs) | Standards, Boards | 5-7 horizontal tabs with purple underline active state | **Medium** — primary content navigation pattern on ~60+ pages |
| 15 | **Flexible Promotional Content Zone** | Board landings | Editor-configurable blocks (newsletter CTA, survey CTA, announcements) | **Medium** — editorial flexibility |
| 16 | **Dark Purple CTA Block** | Document Detail, Research, Sustainability | Full-width dark purple block with H3, body, button, optional contact info | **Medium** — CTA pattern |
| 17 | **Disclaimer Block** | Project Detail | Black bg legal text block | **Low** — regulatory requirement |
| 18 | **Timeline Table** (Q1/Q2/H2 milestone badges) | Project Listing | Quarterly/half-year milestone tracking visualization | **Medium** — replaced by card view |
| 19 | **Data Table** (Active Projects — Standards Overview) | Standards Overview | Simple 2-column project name + description table | **Low** — replaced by card view |
| 20 | **Cookie Consent** (OneTrust) | All pages | Modal with Allow All / Reject All / Confirm | **Required** — compliance, assumed to persist |
| 21 | **Bilingual (EN/FR)** | All pages | Full French mirror site with language switcher | **Critical** — wireframe shows "FR" toggle but no French content wireframes |
| 22 | **Category Filter Pills** | News, Resources, Documents, Projects, Volunteer | Horizontal pill toggles with contextual labels | **Medium** — replaced by different filter patterns |
| 23 | **Sort/Filter Bar** | News, Resources | Sort by, Items per page, Date range dropdowns | **Medium** — partially replaced by faceted search |

### 5.3 Feature Change Summary

| Category | Count |
|----------|-------|
| **New features in wireframes** | 14 |
| **Live features not in wireframes** | 23 |
| **Net feature gap (live features without coverage)** | 23 features across 13 uncovered templates |

---

## 6. Scope Determination

### 6.1 Analysis Verdict

**This is a selective redesign with partial coverage, not a 1:1 rebuild or a full redesign.**

The wireframes represent a focused redesign of the **stakeholder engagement layer** of the site:

| What IS Covered | What IS NOT Covered |
|-----------------|---------------------|
| Homepage | Standards sections (11 tabbed areas) |
| Navigation (completely restructured) | All "About" content pages |
| Search experience (major new feature) | Members/People pages |
| Active Projects (by board, card-based) | Committee pages |
| Open Consultations (new aggregate view) | Documents for Comment listing/detail |
| Project Detail (3-column redesign) | Effective Dates tables |
| Board Detail (3-column redesign) | Resources listing |
| Footer (redesigned) | News listing pages |
| Mobile navigation (purpose-built) | Meetings & Events listing |
| | Contact form |
| | Authentication (Login/Register) |
| | Job/Volunteer Opportunities |

### 6.2 Quantified Coverage

| Dimension | Covered | Total | Percentage |
|-----------|---------|-------|------------|
| Templates | 4 | 17 | **24%** |
| Components (live) | 15 | ~35 | **43%** |
| Content Types | 8 | 12 | **67%** |
| Estimated Pages | ~200 | ~894 | **~22%** |
| Navigation | Fully redesigned | — | **100%** (structural) |
| Search | Fully new | — | **100%** (new feature) |

### 6.3 What the Wireframes Prioritize

1. **Discovery and engagement** — Search, Active Projects, Open Consultations are all new or dramatically improved
2. **Board-centric organization** — Navigation shifts from Standards-first to Boards-first IA
3. **Stakeholder actions** — Submit Comment, Take Survey, Download ED are prominent CTAs
4. **Modern UX patterns** — Faceted search, card-based listings, 3-column layouts, mobile-first menus

### 6.4 What the Wireframes Defer or Ignore

1. **Reference content** — Effective Dates, Resources, Standards Overview tabs
2. **Administrative content** — Members, Committees, About pages
3. **Transactional features** — Login, Registration, Contact form, CPA Canada auth integration
4. **Content management patterns** — Flexible promotional zones, editorial blocks
5. **Archival content** — Meeting archives (180+ per board), News archives (1,010+)
6. **Bilingual implementation** — No French wireframes provided

### 6.5 Build Strategy Implications

| Phase | Scope | Templates | Key Deliverables |
|-------|-------|-----------|-----------------|
| **Phase 1: Wireframed Pages** | Build what's designed | 4 templates + Search (3 frames) + Global Nav/Footer | Homepage, Board Detail, Project Detail, Active Projects Listing, Open Consultations Listing, Search (Modal + Filters + Results), Navigation (Header + Footer + Mobile Menu) |
| **Phase 2: Gap Templates** | Design + build uncovered pages | 13 remaining templates | Standards Overview, Documents for Comment, Document Detail, Effective Dates, Resources, News Listing, Meetings Listing, Members, Committees, Contact, Auth, Job/Volunteer, Content Page |
| **Phase 3: Content Migration** | Migrate ~894 pages of content | All content types | News (1,010 items), Projects (100+), Documents (50+), Meetings (180+ per board), Members, Resources |

### 6.6 Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Standards IA gap** | **Critical** | 11 Standards sections (the largest content area by page count) have no wireframe coverage and the wireframe nav removes Standards from top-level navigation. How will users access `/en/ifrsstandards`, `/en/aspe`, etc.? Through Browse by Standard homepage section only? Through Board Detail pages? This needs design resolution. |
| **URL structure change** | **High** | Wireframe routes (`/active-projects/:board/:slug`, `/boards/:board-slug`, `/open-consultations`) differ from live routes (`/en/{standard}/projects/{slug}`, `/en/{board}`, `/en/{standard}/documents`). Redirect mapping required for ~894 URLs. |
| **Bilingual gap** | **High** | No French wireframes provided. The live site has a full French mirror. Bilingual implementation is a structural concern that affects every template. |
| **Authentication gap** | **High** | Login/registration wireframes not provided. CPA Canada federated auth integration needs design. |
| **Content type gaps** | **Medium** | Members, Committees, Jobs, Volunteers have no Payload CMS collection and no wireframe. These are active content areas. |
| **Archive pagination** | **Medium** | Wireframe search replaces many listing pages but doesn't address how 1,010+ news items and 180+ meeting summaries per board will be browsable outside of search. |

### 6.7 Final Verdict

> **This is a selective redesign focused on the stakeholder engagement experience (projects, consultations, search, boards) with a new information architecture.** It covers approximately 24% of existing templates and 22% of estimated pages. A Phase 2 design effort is required to cover the remaining 13 templates, 4 content types, and ~694 pages before this can be considered a complete site rebuild.
>
> The wireframes should be treated as **Phase 1 of a multi-phase redesign**, not as the complete scope of a rebuild project.

---

*Generated: 2026-03-04 | Source: wireframe-specs.md + site-discovery-verified.md*
