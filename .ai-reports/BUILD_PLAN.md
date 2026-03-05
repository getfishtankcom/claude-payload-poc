# FRAS Canada — Phase 1 Build Plan (Atomic Tasks)

> **Source:** PRD.md, wireframe-specs.md
> **Stack:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL + Tailwind CSS v4
> **Date:** 2026-03-04

---

## Epic 0: Project Scaffolding + Design System

### 0.1 Initialize Next.js + Payload CMS project
- [ ] `create-payload-app` with Next.js template
- [ ] Configure PostgreSQL connection (`.env.example`)
- [ ] Configure Tailwind CSS v4 with `@theme inline` design system
- [ ] Set up project structure: `src/app/`, `src/collections/`, `src/globals/`, `src/components/`
- [ ] Set up ESLint + Prettier + TypeScript strict mode
- **Output:** Running dev server with Payload admin panel at `/admin`

### 0.2 Configure Tailwind CSS v4 design system
- [ ] Install Tailwind CSS v4 with `@tailwindcss/postcss`
- [ ] Configure `@theme inline` in `globals.css` mapping design tokens to Tailwind utilities
- [ ] Map brand colors: `--color-primary: #601F5B`, `--color-primary-bright: #A53B9D`, `--color-primary-medium: #8E3387`, `--color-primary-vivid: #800080`
- [ ] Map hero gradient: `--gradient-hero: linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%)`
- [ ] Map neutral palette: gray-50 through gray-900, black, white
- [ ] Map semantic tokens: text-primary, text-heading, text-muted, link, bg-page, bg-footer, bg-alt, bg-feature
- [ ] Configure typography: Inter font via `next/font`, weights 300/400/600/700/900, heading scale (4xl=46px, 3xl=34px, xl=20px, base=16px)
- [ ] Configure spacing scale: 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px), 12(48px), 16(64px)
- [ ] Configure breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1440px)
- [ ] Configure border radius: none, sm(5px), md(8px), lg(12px), full(9999px)
- [ ] Configure shadows: sm, md, lg
- [ ] Define badge color tokens (Standard=purple, News=dark, Webinar=teal, Meeting Summary=gray, Guidance=dark outline)
- **Output:** `globals.css` with `@theme inline` block + `@layer base` reset, full Tailwind CSS v4 theme

### 0.2.1 Install and configure Tailwind UI
- [ ] Install `@tailwindcss/ui` (or Headless UI `@headlessui/react` for unstyled primitives)
- [ ] Install Heroicons (`@heroicons/react`) for consistent iconography
- [ ] Configure Tailwind UI component catalog reference for team
- [ ] Document which Tailwind UI components map to FRAS components (dropdowns, modals, navigation, forms)
- **Output:** Tailwind UI + Headless UI available for component development

### 0.2.2 Build design primitives
- [ ] `<Button />` — variants: primary (purple fill), secondary (outline), ghost (text+arrow), dark (CTA on dark bg); sizes: sm, md, lg; states: default, hover, focus, disabled
- [ ] `<Badge />` — content type badges with token colors; props: variant (standard, news, webinar, meeting-summary, guidance, exposure-draft, survey, research, public-comment)
- [ ] `<Input />` — text, email, tel, textarea variants; states: default, focus, error, disabled; with label + error message pattern
- [ ] `<Card />` — base card container with optional border, shadow, padding; composable with header/body/footer slots
- [ ] `<Container />` — max-width wrapper (1440px desktop, responsive padding)
- [ ] `<Stack />` — vertical spacing utility component
- **Output:** 6 primitive components with Tailwind CSS v4 classes, exported from `src/components/ui/`

### 0.5 Set up Storybook
- [x] Install Storybook (react-vite) with addons: essentials, a11y, interactions
- [x] Configure `.storybook/main.ts`, `preview.ts`, `vite.config.ts`, `preview-head.html`
- [x] Add `storybook` and `storybook:build` scripts to package.json
- [x] Write co-located stories for all 6 design primitives (Button, Badge, Input, Card, Container, Stack)
- [x] Create mock data factory at `src/__mocks__/cms-data.ts`
- [x] Verify `npm run storybook:build` exits 0
- **Output:** Storybook running on port 6006, 6 primitives with ~33 stories, all passing

### 0.3 Set up deployment pipeline
- [ ] Vercel project configuration
- [ ] Database provisioning (Neon/Supabase/Railway)
- [ ] Environment variable documentation
- **Output:** Deployable to staging

---

## Epic 1: CMS Collections & Globals

### 1.1 Create `boards` collection
- [ ] Fields: name, abbreviation, slug, description
- [ ] Fields: tabs (array: label, slug, content)
- [ ] Fields: quick_actions (array: label, url, icon)
- [ ] Fields: resources (array: title, file/url, type)
- [ ] Seed data: CSSB, AcSB, PSAB, AASB (+ RASOC for footer)
- **Output:** Board CRUD in admin panel

### 1.2 Create `standards` collection
- [ ] Fields: name, slug, category (enum: Sustainability, Accounting, Public Sector, Assurance)
- [ ] Fields: parts (array for Accounting sub-parts: Part I IFRS, Part II Private, Part III NFP, Part IV Pension)
- [ ] Relationship: board (belongsTo)
- [ ] Seed data: 11 standards mapped to boards
- **Output:** Standards linked to boards

### 1.3 Create `projects` collection
- [ ] Fields: title, slug, summary (rich text), key_proposals (rich text)
- [ ] Fields: status (enum: Active, Completed, Paused)
- [ ] Fields: type (enum: Active, Completed) — used for Active Projects listing filter
- [ ] Fields: frasIdNumber (text) — Sitecore FRAS ID used in workflow email subjects
- [ ] Fields: badges (array of enum: Exposure Draft, Public Comment, Survey, Research, etc.)
- [ ] Fields: timeline_stages (array: phase_number, date, title, description, ctas array)
- [ ] Fields: current_stage (number 1-5)
- [ ] Relationships: board, standard, documents (hasMany), contacts (hasMany)
- **Output:** Full project data model

### 1.4 Create `consultations` collection
- [ ] Fields: title, slug, type (enum: Exposure Draft, Survey, Re-exposure Draft)
- [ ] Fields: deadline_date (date), description (rich text)
- [ ] Fields: commentPeriodStart (date), commentPeriodEnd (date) — comment period window for countdown timer and open/closed status
- [ ] Fields: frasIdNumber (text) — Sitecore FRAS ID used in workflow email subjects
- [ ] Fields: action_documents (array: label, url, type)
- [ ] Relationships: board, standard, project
- [ ] Virtual field: days_remaining (computed from deadline_date)
- **Output:** Consultations with countdown capability

### 1.5 Create `news` collection
- [ ] Fields: title, slug, date, category (enum), excerpt, body (rich text)
- [ ] Fields: featured_image (upload)
- [ ] Fields: frasIdNumber (text) — Sitecore FRAS ID used in workflow email subjects
- [ ] Relationship: board
- **Output:** News articles collection

### 1.6 Create `events` collection
- [ ] Fields: title, slug, date, type (enum: Webinar, Meeting, Deadline)
- [ ] Fields: publishedDate (date) — when posted/published, distinct from event date for sort flexibility
- [ ] Fields: description, registration_url
- [ ] Relationship: board
- **Output:** Events collection

### 1.7 Create `documents` collection
- [ ] Fields: title, slug, type (enum: Exposure Draft, Implementation Guide, Background Paper, etc.)
- [ ] Fields: file (upload), description
- [ ] Relationships: board, standard, project
- **Output:** Document management

### 1.8 Create `decision-summaries` collection
- [ ] Fields: title, slug, date, body (rich text)
- [ ] Relationship: board
- **Output:** Meeting decision summaries

### 1.9 Create `contacts` collection
- [ ] Fields: name, credentials, title, phone, email, photo (upload)
- **Output:** Staff contact cards

### 1.10 Create `pages` collection
- [ ] Fields: title, slug, content (rich text), sidebar_type (enum: staff_contact, section_nav, none)
- [ ] Fields: meta (title, description, og_image)
- **Output:** Generic content pages

### 1.11 Create Globals
- [ ] `navigation`: utility_links, primary_nav, mega_menu configuration
- [ ] `footer`: columns, boards_links, quick_links, newsletter config
- [ ] `homepage`: hero_heading, hero_subtitle, cta_block, newsletter_text, browse_by_standard
- [ ] `search-config`: popular_tags, default_filters
- **Output:** All 4 globals editable in admin

---

## Epic 2: Shared Layout Components

> **Note:** Every component task in Epics 2-10 (and Phase 2 UI epics) must include a co-located `.stories.tsx` file as part of its deliverable.

### 2.1 Build `<SiteHeader />`
- [ ] Row 1: Utility bar (About Us ▾, Boards ▾, Contact, Newsletter, Volunteer, FR, Sign In)
- [ ] Row 2: Logo + persistent search input
- [ ] Row 3: Primary nav (Active Projects ▾, Open Consultations, News)
- [ ] Responsive: collapse to logo + search icon + hamburger on mobile
- [ ] Wire to `navigation` global
- **Dependencies:** 2.4 MegaMenu

### 2.2 Build `<SiteFooter />`
- [ ] 4-column layout: Org info, Boards, Quick Links (2 sub-cols), Account
- [ ] Newsletter CTA row: heading + email input + Subscribe button
- [ ] Copyright bar with policy links
- [ ] LinkedIn icon
- [ ] Responsive: stack to single column on mobile
- [ ] Wire to `footer` global
- **Output:** Footer renders on all pages

### 2.3 Build `<MobileMenu />`
- [ ] Full-screen overlay with close (X) button
- [ ] Search input at top
- [ ] FR toggle + Sign In
- [ ] Expandable sections: Active Projects (→ board list), About Us (→ 4 links), Boards (→ nested per-board nav with 7 sub-pages each)
- [ ] Static links: Open Consultations, News, Contact, Newsletter, Volunteer
- [ ] Animate open/close
- **Dependencies:** 2.1 SiteHeader triggers this

### 2.4 Build `<MegaMenu />`
- [ ] About Us dropdown: single column, 4 links
- [ ] Boards dropdown: 4-column mega-menu, each board with 7 sub-links
- [ ] Active Projects dropdown: single column, 4 board links (full names)
- [ ] Hover/click to expand, escape/click-outside to close
- **Output:** Desktop mega-menu dropdowns

### 2.5 Build `<Breadcrumb />`
- [ ] Auto-generate from route path
- [ ] Support custom overrides via page data
- **Output:** Breadcrumbs on all interior pages

### 2.6 Build root layout
- [ ] `app/layout.tsx` with SiteHeader + SiteFooter
- [ ] Font loading (Inter)
- [ ] Metadata defaults
- **Output:** Shell layout wrapping all pages

---

## Epic 3: Utility / Atomic Components

### 3.1 Build `<ContentTypeBadge />`
- [ ] Variants: Standard (purple), News (dark), Webinar (teal), Meeting Summary (gray), Guidance (dark outline), Exposure Draft, Survey, Re-exposure Draft, Research, Public Comment
- [ ] Props: type, label (optional override)
- **Output:** Reusable badge component

### 3.2 Build `<TagChip />`
- [ ] Pill-style chip for search tags
- [ ] Props: label, onClick, active state
- **Output:** Used in SearchModal

### 3.3 Build `<Pagination />`
- [ ] "Showing X-Y of Z results" text
- [ ] Numbered page buttons with prev/next
- [ ] Props: totalItems, itemsPerPage, currentPage, onChange
- **Output:** Reusable pagination

### 3.4 Build `<PageHeader />`
- [ ] Icon + H1 title pattern (used on Active Projects, Open Consultations, Board Detail)
- [ ] Props: icon, title, subtitle (optional)
- **Output:** Consistent page headers

### 3.5 Build `<NewsletterCTA />`
- [ ] "Trusted by 3,000+..." or custom heading
- [ ] Email input + Subscribe button
- [ ] LinkedIn CTA link
- **Output:** Used on Homepage + Footer

### 3.6 Build `<NewsItem />`
- [ ] Date + title + excerpt + "Read More →"
- [ ] Props: news object
- **Output:** Used in Board Detail, Homepage, Search Results

---

## Epic 4: Homepage

### 4.1 Build hero section
- [ ] H1 "Canada's Official Hub for Financial Reporting Standards"
- [ ] Subtitle text
- [ ] Search bar (triggers SearchModal)
- [ ] Responsive stacking on mobile
- **Dependencies:** 5.1 SearchModal

### 4.2 Build "New to FRAS?" CTA section
- [ ] Intro text + "Get Started" button
- [ ] Wire to `homepage` global

### 4.3 Build "Important News & Events" 3-column grid
- [ ] Column 1: Top News (3 items) with "All News →"
- [ ] Column 2: Exposure Drafts with ED number, title, date
- [ ] Column 3: Upcoming Events with date, title, type badge
- [ ] Mobile: stack as 3 separate sections
- **Dependencies:** 1.5 news, 1.6 events, 1.7 documents collections

### 4.4 Build "Browse by Standard" section
- [ ] 4-column card grid: Sustainability, Accounting, Public Sector, Assurance
- [ ] Each card: category heading + list of standard/board links
- [ ] Mobile: expandable list cards
- **Dependencies:** 1.2 standards collection

### 4.5 Wire homepage route
- [ ] `app/(frontend)/page.tsx`
- [ ] Fetch homepage global + news + events + standards
- [ ] Server component with client interactive sections
- **Output:** Full homepage rendering

---

## Epic 5: CMS Data Integration & Search (11 tasks)

> **Note:** Epics 1-4 must be complete. Epic 5 retroactively wires their output to CMS data and introduces block schemas for the page builder architecture (Epics 25-26).

### CMS Integration (5.1–5.6)

### 5.1 Create block schemas, hero system, and reusable fields
- [ ] Create reusable `link()` and `linkGroup()` field factories in `src/fields/`
- [ ] Create hero group field in `src/heros/config.ts` (type select: none/highImpact/lowImpact + richText + links + media)
- [ ] Create `RenderHero.tsx` + hero variant components (HighImpact, LowImpact) in `src/heros/`
- [ ] Create 5 block directories in `src/blocks/`, each with `config.ts` + `Component.tsx`:
  - CTABlock, ContentBlock, RichTextBlock, NewsGridBlock, BrowseByStandardBlock
- [ ] Every `config.ts` has: `slug`, `interfaceName`, `fields` with `lexicalEditor()` for richText
- [ ] Export blocks array from `src/blocks/index.ts`
- **Output:** Block + hero architecture matching official Payload website template

### 5.2 Create `<RenderBlocks />` + update Pages collection + Homepage global
- [ ] `src/blocks/RenderBlocks.tsx` — slug → Component map, iterates blocks, spreads props
- [ ] Update `src/collections/Pages.ts` — add tabs (Hero + Content with `layout` blocks field + SEO)
- [ ] Update `src/globals/Homepage.ts` — add tabs (Hero + Content with `layout` blocks field), migrate flat fields to hero group + blocks
- [ ] Co-located `.stories.tsx` for RenderBlocks with mixed block types
- [ ] Run `npx payload generate:types` to regenerate types
- **Output:** Pages + Homepage both support hero + blocks layout; RenderBlocks renders any block mix

### 5.3 Create typed CMS fetch helpers
- [ ] File: `src/lib/payload-helpers.ts`
- [ ] Helpers: `getHomepage()`, `getNavigation()`, `getFooter()`, `getPageBySlug(slug)`, `getLatestNews(limit)`, `getUpcomingEvents(limit)`, `getStandardsByCategory()`
- [ ] All helpers use `getPayload` + `configPromise` pattern, return typed results from `payload-types.ts`
- **Output:** Typed data access layer for all page routes

### 5.4 Wire SiteHeader + MegaMenu to `navigation` global
- [ ] Root layout fetches `navigation` via `getNavigation()`, passes as props
- [ ] Remove ALL hardcoded nav items from SiteHeader/MegaMenu/MobileMenu
- [ ] Handle missing/empty nav data with sensible empty state
- **Output:** Header/nav driven entirely by CMS data

### 5.5 Wire SiteFooter to `footer` global
- [ ] Root layout fetches `footer` via `getFooter()`, passes as props
- [ ] Remove ALL hardcoded footer links, board lists, text content
- [ ] Handle missing/empty footer data with sensible empty state
- **Output:** Footer driven entirely by CMS data

### 5.6 Wire homepage route to CMS data
- [ ] `page.tsx` uses `<RenderHero {...homepage.hero} />` + `<RenderBlocks blocks={homepage.layout} />`
- [ ] Also fetches news + events for dynamic blocks (NewsGridBlock fetches server-side like ArchiveBlock)
- [ ] Remove ALL hardcoded content strings from Epic 4 components
- [ ] Add empty state handling for all sections
- **Output:** Homepage renders via hero + blocks pattern, zero hardcoded user-facing text

### Search (5.7–5.11)

### 5.7 Set up Meilisearch infrastructure
- [ ] Docker Compose config for Meilisearch instance (v1.x)
- [ ] Install `payload-meilisearch` plugin — configure in `payload.config.ts`
- [ ] Define searchable collections: projects, news, document-for-comment, resources, events, pages
- [ ] Configure `afterChange` hooks via plugin for auto-sync to Meilisearch indexes
- [ ] Create bilingual indexes: `{collection}_en`, `{collection}_fr`
- [ ] Configure filterable attributes: board, standard, content_type, file_type, date
- [ ] Configure searchable attributes per collection (title, body, excerpt)
- [ ] Configure ranking rules and typo tolerance
- **Output:** Meilisearch running locally, syncing with Payload CMS collections

### 5.8 Build `<SearchModal />`
- [ ] Full-screen overlay triggered by search input click
- [ ] Large search input with placeholder "Projects, meetings, documents, and more."
- [ ] Recent tags section (pill chips)
- [ ] Popular tags section (pill chips from `search-config` global)
- [ ] Search + Cancel buttons
- [ ] Mobile: same layout, stacked tags

### 5.9 Build `<FilterSidebar />` + `<SearchResultCard />`
- [ ] FilterSidebar: 5 collapsible accordion sections (Board, Standard, Files & Media, Content Type, Date)
- [ ] Active filter count badges per section, "Clear All" link
- [ ] Desktop: sidebar | Mobile: collapsible accordion above results
- [ ] Wire to Meilisearch `<RefinementList>` widgets
- [ ] SearchResultCard: content type badge + board name + date + title + description + CTA
- [ ] CTA link varies by content type (View Document / Read More / Watch Recording / Read Summary / Download Guide)

### 5.10 Build Search Results page
- [ ] Route: `app/(frontend)/search/page.tsx`
- [ ] Search bar pre-filled with query + recent tags
- [ ] 2-column layout: FilterSidebar + results list
- [ ] Wire to Meilisearch via React InstantSearch (`react-instantsearch` + `@meilisearch/instant-meilisearch`)
- [ ] `<InstantSearch>` wrapper with `<SearchBox>`, `<RefinementList>`, `<Hits>`, `<Pagination>`, `<Stats>`
- [ ] Sort by dropdown (Relevance, Date)
- [ ] Results count via `<Stats>` widget
- **Dependencies:** 5.7, 5.8, 5.9, 3.3 Pagination

### 5.11 Build document extraction pipeline
- [ ] Install `pdf-parse` for PDF text extraction
- [ ] Install `mammoth` for Word (.docx) text extraction
- [ ] Create `afterChange` hook for `resources` collection: extract text → index in Meilisearch
- [ ] Store extracted text as searchable field in Meilisearch index (not in Payload DB)
- [ ] Handle extraction errors gracefully (skip unreadable files, log warnings)
- **Output:** PDF and Word documents searchable via Meilisearch

---

## Epic 6: Board Detail Page

### 6.1 Build `<SectionNav />`
- [ ] Vertical nav sidebar with 7 items
- [ ] Active state highlighting
- [ ] Mobile: dropdown selector
- [ ] Props: items array, activeItem

### 6.2 Build `<QuickActions />`
- [ ] Vertical button list (CPA Canada Handbook, View Implementation Tools, Explore Webinars)
- [ ] Props: actions array

### 6.3 Build `<UpcomingEvents />`
- [ ] "View All" header link
- [ ] Event items: date + title + type badge (Webinar/Meeting/Deadline)
- [ ] Props: events array

### 6.4 Build `<ResourcesList />`
- [ ] Document links with file type icons
- [ ] Props: resources array

### 6.5 Build `<RecentNews />`
- [ ] "View All →" header link
- [ ] News items with date + title + excerpt + "Read More →"
- [ ] Props: news array

### 6.6 Wire Board Detail route
- [ ] Route: `app/(frontend)/boards/[board-slug]/page.tsx`
- [ ] 3-column layout composition
- [ ] Fetch board data + projects + news + events
- [ ] generateStaticParams for SSG
- **Dependencies:** 6.1-6.5, 1.1, 1.3, 1.5, 1.6

---

## Epic 7: Project Detail Page

### 7.1 Build `<ProjectTimeline />`
- [ ] 5-stage vertical stepper
- [ ] Each stage: phase number, date, title, description
- [ ] Visual indicators: completed (check), current (highlighted), future (empty)
- [ ] Inline CTA buttons per stage
- [ ] Mobile: vertical layout with dates

### 7.2 Build Project Detail page
- [ ] Route: `app/(frontend)/active-projects/[board]/[project-slug]/page.tsx`
- [ ] 3-column layout: SectionNav | Main (summary, key proposals, timeline, recent events/news, contacts) | Right sidebar (actions, events, resources)
- [ ] Mobile: stacked with sticky CTA
- **Dependencies:** 7.1, 6.1-6.5, 1.3

---

## Epic 8: Active Projects Listing

### 8.1 Build `<BoardNav />`
- [ ] Vertical board name list with active state
- [ ] Full board names
- [ ] Mobile: dropdown selector
- [ ] Props: boards array, activeBoard

### 8.2 Build `<ProjectCard />`
- [ ] Title (linked)
- [ ] Type badges row
- [ ] Description text
- [ ] Stage indicator: "Stage N: [Stage Name]"
- [ ] Action buttons row
- [ ] Props: project object

### 8.3 Wire Active Projects route
- [ ] Route: `app/(frontend)/active-projects/page.tsx`
- [ ] 2-column layout: BoardNav + project list
- [ ] Filter bar: text search + standards dropdown
- [ ] Projects grouped under collapsible standard headers
- [ ] International section as separate collapsible group
- **Dependencies:** 8.1, 8.2, 1.1, 1.2, 1.3

---

## Epic 9: Open Consultations Listing

### 9.1 Build `<ConsultationCard />`
- [ ] Title (linked)
- [ ] Type badges + deadline date badge
- [ ] Board full name • Standard name
- [ ] Description paragraph
- [ ] Action buttons row
- [ ] Countdown: "Comments due in X days"
- [ ] Props: consultation object

### 9.2 Wire Open Consultations route
- [ ] Route: `app/(frontend)/open-consultations/page.tsx`
- [ ] Filter bar: text search + board dropdown + standard dropdown
- [ ] Consultation cards list
- **Dependencies:** 9.1, 1.4

---

## Epic 10: Integration & Polish + HubSpot

### 10.1 Seed CMS with sample data
- [ ] Create 4 boards + RASOC
- [ ] Create 11 standards
- [ ] Create 8+ sample projects with timeline data
- [ ] Create 4 sample consultations
- [ ] Create 10+ news items
- [ ] Create 5+ events
- [ ] Configure navigation + footer globals

### 10.1.1 Integrate HubSpot newsletter subscription
- [ ] Install HubSpot Forms API client or use REST API directly
- [ ] Wire `<NewsletterCTA />` form submit to HubSpot Forms API endpoint
- [ ] Handle success/error states in UI
- [ ] Configure HubSpot form ID in environment variables (`.env.example`)
- **Dependencies:** 3.5 NewsletterCTA
- **Output:** Newsletter signups flow to HubSpot CRM

### 10.2 Responsive testing
- [ ] Test all pages at 390px, 768px, 1024px, 1440px
- [ ] Verify mobile adaptations: sidebar→dropdown, grid→stack, filter→accordion
- [ ] Cross-browser testing

### 10.3 Accessibility audit
- [ ] WCAG 2.1 AA compliance check
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader testing for mega-menu, search modal, mobile menu
- [ ] Color contrast verification for all badge types

### 10.4 Performance optimization
- [ ] Verify Core Web Vitals targets
- [ ] Image optimization (next/image)
- [ ] Server component / client component split optimization
- [ ] Bundle analysis

### 10.5 SEO setup
- [ ] Metadata for all pages (title, description, og:image)
- [ ] Structured data: Organization, BreadcrumbList
- [ ] Sitemap generation
- [ ] robots.txt

---

## Dependency Graph

```
Epic 0 (Scaffold + Design System)
  ↓
Epic 1 (CMS Collections)
  ↓
Epic 2 (Layout) ←→ Epic 3 (Atomic Components) ← Epic 0.2.2 (Primitives)
  ↓
Epic 4 (Homepage) — builds UI with mock/inline CMS data
  ↓
Epic 5 (CMS Data Integration + Search) ← retroactively wires Epics 2-4 to CMS data
  ↓   [5.1-5.6: CMS wiring] → [5.7-5.11: Search/Meilisearch]
Epic 6 (Board Detail)
  ↓
Epic 7 (Project Detail) ← reuses Epic 6 sidebar components
  ↓
Epic 8 (Active Projects) ← builds `<ProjectCard />` (8.2) for the Active Projects listing
  ↓
Epic 9 (Open Consultations)
  ↓
Epic 10 (Integration & Polish + HubSpot) — seed data + verify CMS rendering
```

---

## Estimated Task Count

| Epic | Tasks | Dependencies |
|------|-------|-------------|
| 0. Scaffolding + Design System | 5 | None |
| 1. CMS Collections | 11 | Epic 0 |
| 2. Layout Components | 6 | Epics 0 |
| 3. Atomic Components | 6 | Epic 0.2.2 |
| 4. Homepage | 5 | Epics 1, 2, 3 |
| 5. CMS Data Integration & Search | 11 | Epics 1, 2, 3, 4 |
| 6. Board Detail | 6 | Epics 1, 2, 3 |
| 7. Project Detail | 2 | Epic 6 |
| 8. Active Projects | 3 | Epics 1, 6 |
| 9. Open Consultations | 2 | Epic 1 |
| 10. Integration + HubSpot | 6 | All |
| **Total** | **63 tasks** | |
