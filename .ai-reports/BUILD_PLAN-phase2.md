# FRAS Canada — Phase 2 Build Plan (Atomic Tasks)

> **Source:** wireframe-specs-phase2.md, site-discovery-verified.md, BUILD_PLAN.md (Phase 1)
> **Stack:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL + Tailwind CSS v4
> **Date:** 2026-03-04
> **Continues from:** Phase 1 (Epics 0–10, 58 tasks)
> **Scope:** 13 gap templates (T3, T4, T5, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17) + bilingual (i18n) + integration/polish

---

## Epic 11: Phase 2 CMS Collections

### 11.1 Create `board-members` collection
- [ ] Fields: name, credentials, photo (upload, 205x205), role (enum: chair, vice-chair, voting-member, non-voting), roleLabel (string)
- [ ] Fields: appointedDate (date), termExpires (date), bioPage (relationship → pages), sortOrder (number)
- [ ] Relationship: board (belongsTo → boards)
- [ ] Seed data: 5+ sample members per board (AcSB, PSAB, CSSB, AASB) with chair/vice-chair/voting roles
- **Dependencies:** Epic 1 (boards collection)
- **Output:** Member CRUD in admin panel with photo upload

### 11.2 Create `committees` collection
- [ ] Fields: name, slug (auto), description (rich text), sortOrder (number), detailPageUrl (URL)
- [ ] Fields: members (array: name, credentials, role, photo), status (enum: active, inactive, archived)
- [ ] Fields: meetingReports (array: title, date, file upload) — Sitecore has 180+ committee meeting report PDFs (IDG Extracts, PSADG reports)
- [ ] Relationship: board (belongsTo → boards)
- [ ] Seed data: 13 AcSB committees, 3+ PSAB committees, 3 AASB committees, 3+ CSSB committees
- **Dependencies:** Epic 1 (boards collection)
- **Output:** Committee directory entries linked to boards

### 11.3 Create `resources` collection
- [ ] Fields: title, slug (auto), date (date), category (multi-select enum: Article, Guidance, In Brief, Other, Webinar)
- [ ] Fields: resourceType (enum: Audio, External Link, PDF, Video, Webpage, Plain Language), excerpt (textarea), content (rich text)
- [ ] Fields: externalUrl (URL), file (upload), status (enum: draft, published, archived)
- [ ] Relationships: board (belongsTo → boards), standard (belongsTo → standards, optional)
- [ ] Seed data: 10+ resources across multiple boards and categories
- **Dependencies:** Epic 1 (boards, standards collections)
- **Output:** Filterable resource items with file/URL support

### 11.4 Create `effective-dates` collection
- [ ] Fields: standard (relationship → standards), introText (rich text with links)
- [ ] Fields: sections (array of: headerLabel string, headerDate date, sortOrder number, rows array)
- [ ] Sub-fields for rows: application (rich text — italic standard names, bullet lists), pronouncement (string), footnoteRef (string)
- [ ] Fields: footnotes (array of: marker string, text rich text)
- [ ] Seed data: 1 full table for IFRS standards (13 sections with sample rows)
- **Dependencies:** Epic 1 (standards collection)
- **Output:** Effective dates tables with purple-header grouped sections

### 11.5 Create `documents-for-comment` collection
- [ ] Fields: title, slug (auto), frasIdNumber (text — used in workflow email subjects), group (enum: exposure-draft, consultation-paper, re-exposure-draft, discussion-paper)
- [ ] Fields: status (enum: open, closed), documentUrl (URL), commentSubmitUrl (URL), commentsPdfUrl (URL)
- [ ] Fields: sortOrder (number), publishedDate (date), commentPeriodStart (date), commentPeriodEnd (date)
- [ ] Relationships: standard (belongsTo → standards), board (belongsTo → boards)
- [ ] Seed data: 4+ open documents, 4+ closed documents across IFRS and ASPE
- **Dependencies:** Epic 1 (boards, standards collections)
- **Output:** Documents grouped by type with open/closed tab filtering

### 11.6 Create `document-details` collection
- [ ] Fields: title, slug (auto), highlights (rich text), bodyContent (rich text blocks)
- [ ] Fields: commentQuestions (array of: questionNumber, questionText rich text)
- [ ] Fields: replyDeadline (date), howToReply (group: heading, body, ctaLabel, ctaHref, contactName, contactTitle, contactAddress rich text, contactEmail)
- [ ] Fields: supportMaterials (array of: label string, url URL, fileType enum)
- [ ] Relationships: standard (→ standards), board (→ boards), staffContacts (hasMany → contacts)
- [ ] Seed data: 3+ full document detail pages with questions, deadlines, and support materials
- **Dependencies:** Epic 1 (boards, standards, contacts collections)
- **Output:** Full exposure draft detail pages with structured content sections

### 11.7 Create `form-submissions` collection
- [ ] Fields: fullName (text, required), title (text), organization (text), email (email, required)
- [ ] Fields: businessPhone (text), comments (textarea, required), submittedAt (date, auto), status (enum: new, read, replied)
- [ ] Admin panel: list view with status filters, read/reply status tracking
- **Dependencies:** Epic 0 (scaffold)
- **Output:** Contact form submission storage with admin management

### 11.8 Create `job-postings` collection
- [ ] Fields: title (text, required), department (text), location (text), description (rich text), summary (textarea)
- [ ] Fields: postedDate (date), closingDate (date), externalUrl (URL), status (enum: draft, published, closed)
- [ ] Seed data: 2 sample postings (1 published, 1 closed)
- **Dependencies:** Epic 0 (scaffold)
- **Output:** Job listings with published/draft/closed lifecycle

### 11.9 Extend `pages` collection for Phase 2
- [ ] Add field: sidebarType (select: staff-contact, section-nav, none)
- [ ] Add field: staffContacts (array of embedded contact objects or relationship → contacts)
- [ ] Add field: sectionNavLinks (array of: label, href, isActive)
- [ ] Add field: ctaBlock (group: heading, description, buttonLabel, buttonHref, variant enum: light/dark-purple)
- [ ] Add field: newsSection (boolean — show related news feed)
- [ ] Add field: board (relationship → boards)
- [ ] Add fields for T15: formConfig (group: captchaEnabled boolean), mediaInquiries (group: heading, contactName, contactTitle, contactEmail, contactPhone)
- [ ] Add fields for T17: listingHeading (text), emptyStateMessage (rich text), layout (select: default, simple-content)
- **Dependencies:** Epic 1 (pages, boards, contacts collections)
- **Output:** Pages collection supports T3A, T3B, T15, and T17 layout variants

### 11.10 Extend `news` collection for Phase 2
- [ ] Add field: externalUrl (URL — for external link items with icon)
- [ ] Add field: isVolunteerOpportunity (boolean — flags for volunteer listings)
- [ ] Update field: category (enum: Document for Comment, International Activity, Meeting Summary, News, Resource)
- [ ] Seed data: 5+ additional news items across new categories
- **Dependencies:** Epic 1 (news collection)
- **Output:** News supports T12 category filtering and volunteer opportunity variant

### 11.11 Create `standards-sections` collection (or extend existing)
- [ ] Fields: title, slug, boardLogo (upload), boardName (string)
- [ ] Fields: tabs (array of: label, href, isActive — 5-6 per standard)
- [ ] Fields: featureCTAs (array of: heading, description, buttonLabel, buttonHref, variant enum: light/dark-purple)
- [ ] Relationships: board (→ boards), activeProjects (hasMany → projects)
- [ ] Seed data: 4 standards sections (IFRS with 6 tabs, ASPE/Sustainability/CAS with 5 tabs each)
- **Dependencies:** Epic 1 (boards, standards, projects collections)
- **Output:** Standards overview pages with configurable tab sets and CTA blocks

### 11.12 Create `auth-config` global
- [ ] Fields: login labels (usernameLabel, passwordLabel, buttonLabel)
- [ ] Fields: forgot links (forgotUsernameLabel, forgotUsernameUrl, forgotPasswordLabel, forgotPasswordUrl)
- [ ] Fields: registration (registerPrompt, registerLinkLabel, registerUrl)
- [ ] Fields: CPA Canada (cpaExplanation rich text, cpaLoginUrl)
- [ ] Fields: support (supportHeading, supportEmail, supportPhoneTollFree, supportPhoneIntl)
- [ ] Seed data: All fields populated with live site values
- **Dependencies:** Epic 0 (scaffold)
- **Output:** Auth page content fully CMS-editable

### 11.13 Extend `events`/create `meetings` collection
- [ ] Fields: title, slug (auto), date (date), publishedDate (date — when posted, separate from event date; survey feedback: users confused by occurrence-date-only sorting), excerpt (textarea), content (rich text)
- [ ] Fields: type (enum: meeting, event, webinar, decision-summary), status (enum: draft, published, archived)
- [ ] Relationship: board (belongsTo → boards)
- [ ] Query support: upcoming (date >= today, sort asc) vs past (date < today, sort desc)
- [ ] Seed data: 10+ meeting summaries per board (AcSB, PSAB)
- **Dependencies:** Epic 1 (boards collection)
- **Output:** Meeting/event items with upcoming/past split for T13

---

## Epic 12: Content Page Templates

### 12.1 Build `<StaffContactCard />` component
- [ ] Purple H2 heading "Staff Contact(s)" (`color: rgb(96, 31, 91)`)
- [ ] Contact card: bold name with credentials, title/role, phone (tel link with icon), email (mailto link with icon)
- [ ] Support multiple contacts (array, separated by divider)
- [ ] Props: contacts array of { name, title, phone, email }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable sidebar contact card

### 12.2 Build `<SectionNavSidebar />` component
- [ ] Vertical link list with section label (gray text, no heading tag) and divider
- [ ] Active state: bold text + underline, no color change
- [ ] Hover: underline appears on non-active links
- [ ] Props: sectionLabel (string), links array of { label, href, isActive }
- [ ] Mobile: drops below main content as vertical link list
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable sidebar navigation for About/Members/Committees pages

### 12.3 Build `<SectionTabs />` component
- [ ] Horizontal tab bar with up to 7 tabs
- [ ] Active tab: bottom border highlight (purple/brand color), bold text
- [ ] Hover: underline + subtle color shift on non-active tabs
- [ ] Each tab navigates to its own page route (not client-side tab switch)
- [ ] Mobile: horizontal scroll with overflow
- [ ] Props: tabs array of { label, href, isActive }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Board/standards section tab navigation

### 12.4 Build Template 3A: Content Page + Staff Contact Sidebar
- [ ] Route: `app/(frontend)/[...slug]/page.tsx` (dynamic catch-all with sidebar logic)
- [ ] Layout: ~70% main content / ~30% right sidebar
- [ ] Main: breadcrumbs → section tabs → H1 → rich text body → optional CTA block (dark purple) → optional news section
- [ ] Sidebar: `<StaffContactCard />` (sticky on desktop)
- [ ] Mobile: sidebar drops below main content, full width
- [ ] Wire to `pages` collection with `sidebarType === 'staff-contact'`
- **Dependencies:** 12.1, 12.3, 2.5 (Breadcrumb), 11.9 (extended pages)
- **Output:** Research Program, project detail, document detail content pages

### 12.5 Build Template 3B: Content Page + Section Nav Sidebar
- [ ] Same route as 12.4 (conditional layout based on `sidebarType`)
- [ ] Main: breadcrumbs → section tabs → H1 → rich text body
- [ ] Sidebar: `<SectionNavSidebar />` with sibling page links
- [ ] Mobile: sidebar drops below main content
- [ ] Wire to `pages` collection with `sidebarType === 'section-nav'`
- **Dependencies:** 12.2, 12.3, 2.5 (Breadcrumb), 11.9 (extended pages)
- **Output:** About pages, committees, members section-level navigation

### 12.6 Build Template 17: Simple Content / Empty State
- [ ] Route: `app/(frontend)/job-opportunities/page.tsx` (or dynamic)
- [ ] Full-width, no sidebar layout
- [ ] Sections: H1 heading → rich text intro prose (includes italic funding note) → HR divider → bold "Open Positions" heading → dynamic listing area
- [ ] Build `<EmptyState />` component: italic message text, no interactive elements
- [ ] Build `<JobCard />` component: title, department/location, posted date, summary, "View Details →" CTA
- [ ] Build `<JobListings />` component: fetches job-postings, renders cards or empty state
- [ ] No filtering/sorting/pagination controls
- [ ] Wire to `pages` collection (layout=simple-content) + `job-postings` collection
- **Dependencies:** 11.8 (job-postings), 11.9 (extended pages)
- **Output:** Job opportunities page with empty/populated states

---

## Epic 13: People & Organization

### 13.1 Build `<MemberCard />` component
- [ ] Portrait photo (205x205px square, consistent sizing)
- [ ] Name as purple link (navigates to bio page)
- [ ] Credentials in gray text (comma-separated designations)
- [ ] Role label: uppercase bold (CHAIR, VICE-CHAIR) — officers only
- [ ] Appointment dates: "Appointed: January 1, 2023" / "Term Expires: December 31, 2025"
- [ ] Props: member object { name, credentials, photo, role, roleLabel, appointedDate, termExpires, bioPageUrl }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable member card for board member listings

### 13.2 Build Template 4: People Listing (Members)
- [ ] Route: `app/(frontend)/[board]/about/members/page.tsx`
- [ ] Layout: ~70% main (2-column card grid) + ~30% section nav sidebar
- [ ] Sections: breadcrumbs → section tabs → H1 "Members" → section groups (CHAIR, VICE-CHAIR, VOTING MEMBERS)
- [ ] Each section: uppercase gray label as visual divider → 2-column grid of `<MemberCard />`
- [ ] Card ordering: officers first (Chair, Vice-Chair), then alphabetical within Voting Members
- [ ] Sidebar: `<SectionNavSidebar />` (About, Terms of Reference, Members, Due Process, etc.)
- [ ] Mobile: cards stack single column, sidebar drops below
- [ ] Wire to `board-members` collection filtered by board, sorted by role then name
- [ ] generateStaticParams for SSG (one page per board)
- **Dependencies:** 13.1, 12.2, 12.3, 11.1 (board-members)
- **Output:** Board member listing pages for all 5 boards

### 13.3 Build `<AnchorNav />` component (scroll-spy sidebar)
- [ ] "On this page" heading
- [ ] Vertical list of all H2 headings on page as anchor links
- [ ] Active state: highlights current section on scroll (Intersection Observer scroll-spy)
- [ ] Sticky positioning on desktop — follows viewport on scroll
- [ ] Mobile: collapses above content as expandable "On this page" accordion or sticky dropdown
- [ ] Props: items auto-generated from page H2 headings, or provided manually
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable scroll-spy table of contents sidebar

### 13.4 Build Template 14: Committee Index / Directory
- [ ] Route: `app/(frontend)/[board]/committees/page.tsx`
- [ ] Layout: ~70% main content + ~30% right sidebar
- [ ] Main content: breadcrumbs → section tabs → H1 "Committees" → committee entries
- [ ] Each entry: H2 linked name (auto-generated anchor ID) + description paragraph + optional "Learn more →" link
- [ ] Sidebar: `<AnchorNav />` mirroring all H2 committee headings
- [ ] No pagination — all committees render on single page
- [ ] No filters or search
- [ ] Mobile: sidebar becomes collapsible "On this page" section above content
- [ ] Wire to `committees` collection filtered by board, sorted by sortOrder or alphabetical
- [ ] generateStaticParams for SSG
- **Dependencies:** 13.3, 12.3, 2.5 (Breadcrumb), 11.2 (committees)
- **Output:** Committee directory pages for all 5 boards (AcSB: 13 committees)

---

## Epic 14: Standards Section

### 14.1 Build `<BoardLogoHero />` component
- [ ] Board crest or wordmark image, centered
- [ ] Full board name displayed below logo
- [ ] Brand-color background (or gradient)
- [ ] Non-interactive, purely decorative/branding
- [ ] Props: logo (image), boardName (string), backgroundColor (optional)
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Standards page hero banner

### 14.2 Build `<ActiveProjectsTable />` component
- [ ] Two-column table: "Project Name" and "Description" headers
- [ ] Each row: project name as purple link + 1-2 sentence description
- [ ] Mobile: 2-column table → stacked cards (name above description)
- [ ] Props: projects array of { name, href, description }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Table used on Standards Overview (T5) pages

### 14.3 Build `<FeatureCTABlock />` component
- [ ] 1-2 CTA cards side by side
- [ ] Each card: heading, description paragraph, arrow button
- [ ] Variants: light gray background or dark purple background (white text)
- [ ] Hover: subtle lift/shadow effect
- [ ] Mobile: CTAs stack vertically
- [ ] Props: cards array of { heading, description, buttonLabel, buttonHref, variant: 'light' | 'dark-purple' }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Feature CTA blocks for Standards Overview and other pages

### 14.4 Build Template 5: Standards Overview (Tabbed)
- [ ] Route: `app/(frontend)/[standard]/page.tsx`
- [ ] Full-width layout with section tab navigation
- [ ] Sections: `<BoardLogoHero />` → breadcrumbs → H1 (standards area name) → `<SectionTabs />` (5-6 tabs) → `<ActiveProjectsTable />` → `<FeatureCTABlock />` → News feed (3 items in 3-column cards)
- [ ] Tab config: 5 tabs standard, IFRS gets 6th (IFRIC Agenda Decisions)
- [ ] Wire to `standards-sections` collection
- [ ] generateStaticParams for 11 standards sections
- **Dependencies:** 14.1, 14.2, 14.3, 12.3, 2.5, 3.6 (NewsItem), 11.11 (standards-sections)
- **Output:** 11 standards overview pages

### 14.5 Build `<EffectiveDatesTable />` component
- [ ] Intro disclaimer text (italic, with links to CPA Canada Handbook and Knotia.ca)
- [ ] Table with two column headers: "Application" (~65% width) and "Pronouncement" (~35% width)
- [ ] Purple section header rows (full-width, purple bg, white text): "Effective for annual periods beginning on or after [Date]"
- [ ] Data rows: application (rich text — italic standard names, bullet lists, footnote refs) + pronouncement (text)
- [ ] Alternating white/light gray row backgrounds within sections
- [ ] Dashed border between rows within same group
- [ ] Footnotes at bottom with superscript markers
- [ ] Ordering: preserve sortOrder field (intentionally non-chronological in some cases)
- [ ] Mobile: 2-column table → single column stacked (Application content first, then "Pronouncement: [value]" as labeled field)
- [ ] Print-friendly (`@media print` styles to avoid breaking rows across pages)
- [ ] Props: sections array, footnotes array, introText (rich text)
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Full effective dates reference table component

### 14.6 Build Template 10: Effective Dates page
- [ ] Route: `app/(frontend)/[standard]/effective-dates/page.tsx`
- [ ] Full-width tabbed layout (same page chrome as T5/T8 — tabs present, this is one of the tabs)
- [ ] H1 "Effective Dates" → `<EffectiveDatesTable />`
- [ ] Static content — no interactive elements, no filtering, no sorting, no pagination
- [ ] All sections render on single page (long scroll)
- [ ] Wire to `effective-dates` collection filtered by standard
- [ ] generateStaticParams for 11 standards sections
- **Dependencies:** 14.5, 12.3, 2.5, 11.4 (effective-dates)
- **Output:** Effective dates pages for all 11 standards

---

## Epic 15: Document Workflow

### 15.1 Build `<TabPills />` component
- [ ] Two-pill toggle buttons (e.g., "Open for Comment" / "Closed for Comment")
- [ ] Active state: filled background (dark), white text
- [ ] Inactive state: outline/ghost, dark text
- [ ] Tab switching uses query param (e.g., `?tab=closed-for-comment`)
- [ ] Full page navigation — not client-side toggle
- [ ] Props: options array of { label, queryValue, isActive }, paramName (string)
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable pill toggle for document listing and other filtered pages

### 15.2 Build `<GroupedTable />` component
- [ ] Table-like layout with gray banner section headers (full-width, `#f0f0f0` bg, bold text)
- [ ] Data rows with alternating white/light gray backgrounds
- [ ] Dashed border between rows within same group
- [ ] Section headers derive from group enum (exposure-draft → "Exposure Drafts", etc.)
- [ ] Empty groups are not rendered
- [ ] Props: groups array of { heading, rows[] }, renderRow function
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Grouped table used in Documents for Comment listing

### 15.3 Build `<DocumentRow />` component
- [ ] Title as purple link to document detail page
- [ ] "Submit comment" button (dark purple fill, white text) — Open tab only
- [ ] "View Comments" as PDF link — Closed tab, optional
- [ ] Mobile: button stacks below title text
- [ ] Props: document object { title, href, commentSubmitUrl?, commentsPdfUrl?, status }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Individual document row within grouped table

### 15.4 Build Template 8: Documents for Comment Listing
- [ ] Route: `app/(frontend)/[standard]/documents/page.tsx`
- [ ] Full-width tabbed layout
- [ ] H1 "Documents for Comment" → `<TabPills />` (Open/Closed) → `<GroupedTable />` with `<DocumentRow />`
- [ ] Default: Open tab active, `?tab=closed-for-comment` for Closed
- [ ] Group documents by `group` field within each tab
- [ ] Wire to `documents-for-comment` collection filtered by standard + status
- [ ] generateStaticParams for 11 standards sections
- **Dependencies:** 15.1, 15.2, 15.3, 12.3, 2.5, 11.5 (documents-for-comment)
- **Output:** Documents for comment listing for all 11 standards

### 15.5 Build `<DarkPurpleCTA />` component
- [ ] Dark purple/near-black background (`~rgb(50, 20, 50)`)
- [ ] White text throughout
- [ ] H3 heading (e.g., "How to Reply")
- [ ] Instruction paragraph
- [ ] Full mailing address (name, title, street, city, province, postal code)
- [ ] Email as mailto link
- [ ] "Submit comment" button (white text on contrasting button)
- [ ] Full width on both desktop and mobile
- [ ] Props: heading, body, ctaLabel, ctaHref, contactName, contactTitle, contactAddress, contactEmail
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable dark CTA block for document detail and other pages

### 15.6 Build `<BlockquoteQuestion />` component
- [ ] Bordered box with light background
- [ ] Question number heading (e.g., "Question 1")
- [ ] Question text (rich text)
- [ ] Static display — no expand/collapse, no form input
- [ ] Full width on mobile with reduced horizontal padding
- [ ] Props: questionNumber, questionText
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Question blockquote used in "Comments Requested" sections

### 15.7 Build `<SupportMaterialsList />` component
- [ ] Chain-link icon prefix + labeled document link
- [ ] Each link opens PDF in new tab or external resource
- [ ] Props: materials array of { label, url, fileType }
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Support materials link list for document detail pages

### 15.8 Build Template 9: Document Detail (Exposure Draft)
- [ ] Route: `app/(frontend)/[standard]/documents/[slug]/page.tsx`
- [ ] Layout: ~70% main content + ~30% Staff Contact sidebar
- [ ] Main sections: H1 → "Highlights" section (purple heading, body paragraphs) → Rich body content (IASB references, external links) → "Comments Requested" with `<BlockquoteQuestion />` components → "When to Reply" (bold deadline date) → `<DarkPurpleCTA />` "How to Reply" block → `<SupportMaterialsList />`
- [ ] Sidebar: `<StaffContactCard />` (sticky on desktop)
- [ ] No "back to listing" link — navigation via breadcrumbs or tabs
- [ ] Mobile: sidebar collapses below all main content
- [ ] Wire to `document-details` collection with depth:2 (populate staffContacts, standard, board)
- [ ] generateStaticParams for all document detail pages
- **Dependencies:** 15.5, 15.6, 15.7, 12.1, 12.3, 2.5, 11.6 (document-details)
- **Output:** Full exposure draft detail pages (~50+ pages)

---

## Epic 16: Listings

### 16.1 Build `<CategoryPills />` component
- [ ] Horizontal row of pill/tab buttons for category filtering
- [ ] Active state: filled/dark background, white text
- [ ] Inactive state: outline/ghost, dark text
- [ ] "All Items" as first option (default active), resets filter
- [ ] Categories are contextual per page (alphabetical order)
- [ ] Mobile: collapses to `<select>` dropdown
- [ ] Props: options array of { label, value, isActive }, onChange handler
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable category filter for Resources, News, Volunteer listings

### 16.2 Build `<SortFilterBar />` component
- [ ] Dropdown controls: Sort By ("Publication date: Newest" / "Oldest")
- [ ] Items Per Page dropdown (10, 20, 30, All)
- [ ] Optional: Type filter dropdown ("All Types" with resource type options)
- [ ] Optional: Date range inputs (start date, end date — mm/dd/yyyy with calendar picker)
- [ ] Mobile: all fields stack vertically
- [ ] Props: sortOptions, itemsPerPageOptions, typeFilterOptions?, showDateRange?
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable sort/filter bar for listing pages

### 16.3 Build `<ListingItem />` component
- [ ] Date string (format: "Month DD, YYYY") — displayed above title
- [ ] Category badge/chip (one or more)
- [ ] Title as purple linked text
- [ ] Optional: external link icon when linking offsite
- [ ] Excerpt (2-3 sentences, text only — no thumbnails)
- [ ] Props: item object { date, categories, title, href, excerpt, isExternal? }
- **Dependencies:** 3.1 (ContentTypeBadge)
- **Output:** Reusable listing item for Resources, News, Meetings

### 16.4 Build Template 11: Resources Listing
- [ ] Route: `app/(frontend)/[standard]/resources/page.tsx`
- [ ] Full-width tabbed layout
- [ ] Sections: breadcrumbs → H1 "Resources" → `<CategoryPills />` (All Items, Article, Guidance, In Brief, Other, Webinar) → `<SortFilterBar />` (with type filter + date range) → `<ListingItem />` list → `<Pagination />`
- [ ] Client-side filtering with API route for pagination
- [ ] Wire to `resources` collection filtered by board/standard + category + type + date range
- [ ] API route: `GET /api/resources?board=...&category=...&type=...&sort=...&startDate=...&endDate=...&page=...&limit=...`
- [ ] generateStaticParams for 11 standards sections
- **Dependencies:** 16.1, 16.2, 16.3, 3.3 (Pagination), 12.3, 2.5, 11.3 (resources)
- **Output:** Filterable, paginated resources listing for all standards

### 16.5 Build Template 12: Filtered News/Event Listing
- [ ] Route: `app/(frontend)/news-listings/page.tsx` + `app/(frontend)/[board]/news-listings/page.tsx`
- [ ] Full-width layout
- [ ] Sections: breadcrumbs → H1 "News" → `<CategoryPills />` (All Items, Document for Comment, International Activity, Meeting Summary, News, Resource) → `<SortFilterBar />` (items per page + sort + date range, NO type filter) → `<ListingItem />` list → `<Pagination />`
- [ ] Variant: `/en/volunteer-opportunities` — board-based tabs (AASB, CSSB, PSAB, RASOC, AcSB) instead of category pills, pre-filtered to `isVolunteerOpportunity=true`
- [ ] Board-specific news: pre-filtered to `board=boardSlug`
- [ ] No total results count displayed
- [ ] API route: `GET /api/news?board=...&category=...&sort=...&startDate=...&endDate=...&page=...&limit=...`
- **Dependencies:** 16.1, 16.2, 16.3, 3.3 (Pagination), 2.5, 11.10 (extended news)
- **Output:** News listings (global + per-board) and volunteer opportunities

### 16.6 Build `<TabToggle />` component
- [ ] Two-state toggle: e.g., "Upcoming meetings & events" / "Past meetings & events"
- [ ] Active: filled/dark background with white text
- [ ] Inactive: outline/ghost styling
- [ ] Stays as two side-by-side tabs on mobile (does NOT collapse to dropdown)
- [ ] Props: options array of { label, value, isActive }, onChange handler
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable tab toggle for Meetings and other two-state lists

### 16.7 Build Template 13: Meetings & Events Listing
- [ ] Route: `app/(frontend)/[board]/meetings-and-events/page.tsx`
- [ ] Full-width layout
- [ ] Sections: breadcrumbs → H1 "Meetings & Events" → `<TabToggle />` (Upcoming/Past) → Items Per Page dropdown (10 default) → meeting items list → `<Pagination />`
- [ ] Meeting items: H2 linked title (purple text, often includes date) + excerpt paragraph
- [ ] Default view: "Past meetings & events" tab active
- [ ] No category filters, no sort, no date range — simplest listing template
- [ ] Server-side pagination (large datasets: AcSB has 180+ items)
- [ ] API route: `GET /api/meetings?board=...&timeframe=upcoming|past&page=...&limit=...`
- [ ] Upcoming: date >= today, sort ascending. Past: date < today, sort descending.
- [ ] generateStaticParams for 5 boards
- **Dependencies:** 16.6, 3.3 (Pagination), 2.5, 11.13 (meetings)
- **Output:** Meeting/event listing pages for all 5 boards

---

## Epic 17: Forms & Auth

### 17.1 Build `<ContactForm />` component
- [ ] Vertical stacked form with labeled inputs (label: colon-terminated, asterisk for required)
- [ ] Fields: Full Name* (text), Title (text), Organization (text), Email address* (email), Business Phone (tel), Comments* (textarea ~6 rows)
- [ ] Client-side validation: required field check, email format validation
- [ ] Inline error messages below each invalid field
- [ ] Focus states: visible focus ring on all inputs for accessibility
- [ ] Tab order: Full Name → Title → Organization → Email → Phone → Comments → CAPTCHA → Submit
- [ ] Submit handler: server action POST to API, success → confirmation message, failure → scroll to first error
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Validated contact form component

### 17.2 Build `<ReCaptcha />` component
- [ ] Install `react-google-recaptcha-v3` (invisible ReCaptcha)
- [ ] Create `<ReCaptchaProvider />` wrapper in root layout with site key from env
- [ ] Build `<ReCaptcha />` component: executes reCAPTCHA action on form submit, returns token
- [ ] Server-side verification: POST token to `https://www.google.com/recaptcha/api/siteverify` with secret key
- [ ] Add `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` to `.env.example`
- [ ] Fallback: if reCAPTCHA fails to load, show honeypot field
- [ ] No visible CAPTCHA widget — invisible v3 scores user behavior
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Invisible ReCaptcha v3 for contact form spam prevention

### 17.3 Build `<MediaInquiriesBlock />` component
- [ ] Heading: "Media Inquiries"
- [ ] Contact card: name + credentials, title, email (mailto link), phone (tel link)
- [ ] Wire to `pages.mediaInquiries` group fields
- [ ] Props: heading, contactName, contactTitle, contactEmail, contactPhone
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Media contact block for contact page

### 17.4 Build Template 15: Contact / Form Page
- [ ] Route: `app/(frontend)/contact-us/page.tsx`
- [ ] Full-width, no sidebar layout
- [ ] Sections: H1 "Contact Us" → intro prose (rich text) → `<ContactForm />` with `<ReCaptcha />` → Submit button (purple) → `<MediaInquiriesBlock />`
- [ ] Server action for form submission → stores in `form-submissions` collection
- [ ] ReCaptcha v3 token validation on submit, fallback to honeypot if ReCaptcha unavailable
- [ ] Success state: confirmation message ("Thank you for contacting us. We will respond shortly.")
- [ ] Wire to `pages` collection for content + `form-submissions` for storage
- **Dependencies:** 17.1, 17.2, 17.3, 11.7 (form-submissions), 11.9 (extended pages)
- **Output:** Working contact form page with CAPTCHA and admin submission management

### 17.5 Build `<LoginForm />` component
- [ ] Username input (label: "User Name (email address):", HTML type="text" — matches legacy behavior)
- [ ] Password input (label: "Password:", type="password")
- [ ] "Forgot your User Name?" inline link → `/en/my-account/forgot-username`
- [ ] "Forgot your Password?" inline link → `/en/my-account/forgot-password`
- [ ] "Log in" button — full-width purple, TWO WORDS (not "Login")
- [ ] Client-side validation: highlight empty required fields, prevent submission
- [ ] Error display: "Invalid user name or password. Please try again." (never specify which field is wrong)
- [ ] No CAPTCHA, no "Remember me" checkbox
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Login form with validation and error handling

### 17.6 Build `<AuthLayout />` component
- [ ] Centered card/container wrapper (~480px max-width)
- [ ] Used by login, register, forgot-password pages
- [ ] Props: children (form content)
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable auth page layout wrapper

### 17.7 Build `<SupportContactBlock />` and `<CpaExplanationBlock />` components
- [ ] `<SupportContactBlock />`: "Support" heading, email (mailto link), toll-free phone (tel link), international phone (tel link)
- [ ] `<CpaExplanationBlock />`: rich text explaining CPA Canada shared auth, includes link to `cpacanada.ca/en/login` (opens new tab)
- [ ] Wire to `auth-config` global
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Reusable support and explanation blocks for auth pages

### 17.8 Build Template 16: Authentication Page
- [ ] Route: `app/(frontend)/my-account/login/page.tsx`
- [ ] Full-width, no sidebar — `<AuthLayout />` wrapper
- [ ] Sections: `<LoginForm />` → HR → "Not registered yet?" + "Create My account" link (note capital M, lowercase a) → HR → `<CpaExplanationBlock />` → HR → `<SupportContactBlock />`
- [ ] Auth implementation: Aptify DB API integration (Next.js server actions ↔ Aptify API)
- [ ] Simple member verification: boolean True/False (no complex usergroups)
- [ ] Session management: HTTP-only cookie with JWT token after Aptify validation
- [ ] No CPA SSO/OKTA — direct Aptify DB calls replicating current CPA pattern
- [ ] Rate limiting: 5 login attempts per 15 minutes
- [ ] CSRF protection via Next.js server actions
- [ ] Wire to `auth-config` global for all labels/URLs
- **Dependencies:** 17.5, 17.6, 17.7, 11.12 (auth-config global)
- **Output:** Login page with CPA Canada auth integration hooks

---

> **Note:** Epic 19 reserved for future use. Epic 20 (Gap Pages & Forms) was added after initial planning to cover gaps identified during Notion research cross-reference.

## Epic 20: Gap Pages & Forms

### 20.1 Build Annual Report page template
- [ ] Route: `app/(frontend)/[board]/about/annual-report/page.tsx`
- [ ] Layout: Content page with section nav sidebar (reuse T3B pattern)
- [ ] Main: H1 + rich text body + downloadable PDF links
- [ ] Wire to `pages` collection with `layout === 'annual-report'`
- **Dependencies:** 12.2, 12.3, 11.9 (extended pages)
- **Output:** Annual report pages for all boards

### 20.2 Build Error Pages (404/500)
- [ ] `app/not-found.tsx` — custom 404 page
- [ ] `app/error.tsx` — custom 500 error page
- [ ] Design: minimal layout with brand colors, "Back to Home" CTA
- [ ] Include SiteHeader + SiteFooter in error pages
- **Dependencies:** Epic 2 (Layout)
- **Output:** Branded error pages replacing Next.js defaults

### 20.3 Build RSS Feed endpoint
- [ ] Route: `app/api/rss/route.ts` — generates RSS XML feed
- [ ] Include: news items, meeting summaries, documents for comment
- [ ] Support per-board feeds: `app/api/rss/[board]/route.ts`
- [ ] Set `Content-Type: application/rss+xml`
- [ ] Include bilingual metadata (EN/FR separate feeds)
- **Dependencies:** Epic 1 (news, events collections)
- **Output:** RSS feed endpoint for feed readers

### 20.4 Build Decision Summaries Listing page
- [ ] Route: `app/(frontend)/[board]/decision-summaries/page.tsx`
- [ ] Reuse listing template pattern from T13 (Meetings & Events)
- [ ] TabToggle not needed (no upcoming/past split for summaries)
- [ ] Items Per Page dropdown + Pagination
- [ ] Wire to `decision-summaries` collection filtered by board
- **Dependencies:** 16.3, 3.3, 1.8 (decision-summaries collection)
- **Output:** Decision summaries listing for all boards

### 20.5 Build Registration form page
- [ ] Route: `app/(frontend)/my-account/register/page.tsx`
- [ ] Layout: `<AuthLayout />` wrapper
- [ ] Fields: Email (username), Password, Confirm Password, First Name, Last Name
- [ ] Client-side validation: email format, password match, required fields
- [ ] Server action: POST to Aptify DB API for account creation
- [ ] Success: redirect to login with confirmation message
- [ ] Wire to `auth-config` global for labels
- **Dependencies:** 17.6 (AuthLayout), 11.12 (auth-config)
- **Output:** Account registration page

### 20.6 Build Forgot Username page
- [ ] Route: `app/(frontend)/my-account/forgot-username/page.tsx`
- [ ] Layout: `<AuthLayout />` wrapper
- [ ] Fields: Email address
- [ ] Server action: POST to Aptify DB API for username recovery
- [ ] Success: "An email has been sent with your username" message
- **Dependencies:** 17.6 (AuthLayout), 11.12 (auth-config)
- **Output:** Forgot username recovery page

### 20.7 Build Forgot Password page
- [ ] Route: `app/(frontend)/my-account/forgot-my-password/page.tsx`
- [ ] Layout: `<AuthLayout />` wrapper
- [ ] Fields: Username (email)
- [ ] Server action: POST to Aptify DB API for password reset
- [ ] Success: "A password reset link has been sent to your email" message
- **Dependencies:** 17.6 (AuthLayout), 11.12 (auth-config)
- **Output:** Forgot password recovery page

### 20.8 Build Member-Only Form Template
- [ ] Shared form component for: Document Comment Submission, Event Registration, Volunteer Registration
- [ ] Auth gate: redirect to login if not authenticated (Aptify session check)
- [ ] Common fields: Name, Email, Organization + type-specific fields
- [ ] Document Comment: textarea + file attachment (PDF/Word upload)
- [ ] Volunteer Registration: textarea + CV upload
- [ ] Event Registration: event selection + optional comments
- [ ] Server action: validate Aptify session → send email with attachments (no DB storage)
- [ ] Success: confirmation message per form type
- **Dependencies:** 17.6 (AuthLayout), Task 17.8 (Aptify auth)
- **Output:** 3 member-only form pages behind auth gate

### 20.9 Build Event Summary Table component
- [ ] Tabular meeting/event summary format (replica of existing Sitecore component)
- [ ] Columns: Date, Topic/Item, Decision/Action
- [ ] Props: rows array of { date, topic, decision }
- [ ] Responsive: table → stacked cards on mobile
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Event Summary Table for meeting detail pages

### 20.10 Build Meeting Topics Table component
- [ ] Tabular display of meeting agenda topics
- [ ] Columns: Topic, Description, Status/Outcome
- [ ] Props: topics array of { topic, description, status }
- [ ] Responsive: table → stacked cards on mobile
- **Dependencies:** Epic 3 (atomic components)
- **Output:** Meeting Topics Table for meeting detail pages

---

## Epic 18: Bilingual (i18n)

### 18.1 Configure Next.js i18n routing
- [ ] Set up locale-based routing: `/en/...` and `/fr/...`
- [ ] Configure `next.config.js` with `i18n` settings or App Router `[locale]` segment
- [ ] Default locale: `en`
- [ ] Middleware for locale detection and redirect
- **Dependencies:** Epic 0 (scaffold)
- **Output:** EN/FR URL routing functional

### 18.2 Add locale support to Payload CMS content model
- [ ] Enable Payload localization config for supported locales: `en`, `fr`
- [ ] Add locale field to all text/rich text fields across collections (title, body, excerpt, etc.)
- [ ] Update admin panel to show locale switcher
- [ ] Test: create bilingual content entry, verify both locales persist and retrieve
- **Dependencies:** Epic 1 (CMS collections), Epic 11 (Phase 2 collections)
- **Output:** All CMS content supports EN/FR locale variants

### 18.3 Build language switcher component
- [ ] Displays current language name (e.g., "English" or "Francais")
- [ ] Click toggles to alternate locale, preserving current page path
- [ ] Generates correct FR equivalent URL from EN URL (and vice versa)
- [ ] Integrate with `<SiteHeader />` utility bar and `<MobileMenu />`
- [ ] Handle edge cases: pages that exist in only one locale → redirect to locale homepage
- **Dependencies:** 18.1, 2.1 (SiteHeader), 2.3 (MobileMenu)
- **Output:** Working language toggle across all pages

### 18.4 Create FR translation strings file
- [ ] Extract all UI text (buttons, labels, headings, error messages, empty states) into translation file
- [ ] Create `messages/en.json` and `messages/fr.json` (or equivalent i18n library format)
- [ ] Cover: navigation labels, filter labels, form labels, error messages, pagination text, CTA labels, empty state messages
- [ ] FR URL slug mappings (10 FR board slugs, 9 FR section slugs, 3 FR council slugs, 11 FR path segment translations per site-discovery-verified.md)
- **Dependencies:** 18.1
- **Output:** Complete UI translation files for EN/FR

### 18.5 Implement hreflang and locale metadata
- [ ] Add `<link rel="alternate" hreflang="en" href="..." />` and `<link rel="alternate" hreflang="fr" href="..." />` to all pages
- [ ] Update `<html lang="...">` attribute per locale
- [ ] Add locale to OpenGraph and Twitter Card metadata
- [ ] Sitemap: include hreflang entries for both locales
- **Dependencies:** 18.1, 10.5 (SEO setup from Phase 1)
- **Output:** Search engines correctly index EN/FR page pairs

---

## Epic 21: Phase 2 Integration & Polish

### 21.1 Seed CMS with Phase 2 sample data
- [ ] Create 20+ board members across 4 boards with photos
- [ ] Create 25+ committee entries across 4 boards
- [ ] Create 30+ resource items across multiple categories and types
- [ ] Create effective dates tables for 3+ standards
- [ ] Create 10+ documents for comment (open and closed)
- [ ] Create 5+ document detail pages with full content
- [ ] Create 50+ meeting/event items across boards
- [ ] Create contact form test submissions
- [ ] Create 2 sample job postings
- [ ] Configure auth-config global with live site values
- **Dependencies:** All Epic 11 tasks
- **Output:** All Phase 2 pages render with realistic content

### 21.2 Phase 2 responsive testing
- [ ] Test all 13 gap templates at 390px, 768px, 1024px, 1440px
- [ ] Verify mobile adaptations: sidebar→below-content, grid→stack, pills→dropdown, table→stacked-cards
- [ ] Verify horizontal scroll tabs on narrow screens
- [ ] Verify sticky sidebar behavior on desktop for T3A, T9, T14
- [ ] Test all gap pages (error, RSS, registration, forgot username/password, member-only forms) at all breakpoints
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- **Dependencies:** All Epic 12-17, Epic 20 tasks
- **Output:** All Phase 2 pages responsive and cross-browser compatible

### 21.3 Phase 2 accessibility audit
- [ ] WCAG 2.1 AA compliance check for all Phase 2 templates
- [ ] Keyboard navigation: forms (T15, T16), tab toggles (T8, T13), anchor nav (T14), scroll-spy
- [ ] Screen reader testing: form labels, error messages, table headers, section headers, ReCaptcha screen reader compatibility
- [ ] Color contrast: purple headers on white, white text on dark purple CTA, alternating row backgrounds
- [ ] Focus management: form submit → error scroll, tab switching
- [ ] Test member-only form auth gates, registration form validation, ReCaptcha screen reader compatibility
- **Dependencies:** All Epic 12-17, Epic 20 tasks
- **Output:** All Phase 2 pages meet WCAG 2.1 AA

### 21.4 Phase 2 performance optimization
- [ ] Verify Core Web Vitals on all Phase 2 pages
- [ ] Optimize member photos (205x205px, next/image with proper sizing)
- [ ] Server component / client component split: listings with filters need client components, static pages stay server
- [ ] Large listing pagination: server-side pagination for meetings (180+ items)
- [ ] Table component rendering optimization (effective dates can have 13+ sections)
- [ ] Bundle analysis for Phase 2 components
- **Dependencies:** All Epic 12-17 tasks
- **Output:** Phase 2 pages meet performance targets

### 21.5 Phase 2 SEO setup
- [ ] Metadata for all Phase 2 page types (title, description, og:image)
- [ ] Structured data: add Person (members), Organization (committees), FAQPage (if applicable)
- [ ] Update sitemap with all Phase 2 routes
- [ ] Verify robots.txt includes Phase 2 paths
- [ ] Bilingual SEO: hreflang tags, locale-specific metadata
- **Dependencies:** All Epic 12-17 tasks, 18.5
- **Output:** Phase 2 pages fully indexed with correct SEO metadata

### 21.6 End-to-end integration testing
- [ ] Test contact form submit → form-submissions collection → admin notification
- [ ] Test login flow → session management → protected pages
- [ ] Test document comment flow: listing → detail → submit comment
- [ ] Test bilingual navigation: EN page → language switch → FR equivalent
- [ ] Test search integration: Phase 2 content types appear in search results (if Phase 1 search supports them)
- [ ] Test all API routes with edge cases (empty results, large datasets, invalid params)
- [ ] Test registration → login → member-only form submission → email trigger
- [ ] Test forgot username/password recovery flows
- [ ] Test RSS feed generation and validation
- **Dependencies:** All Epic 11-20 tasks
- **Output:** All Phase 2 user flows verified end-to-end

---

## Dependency Graph

```
Epic 11 (Phase 2 CMS Collections)
  ├── 11.1–11.6, 11.10–11.11, 11.13 ← Epic 1 (boards, standards, projects, contacts)
  ├── 11.7–11.8, 11.12 ← Epic 0 (scaffold only)
  └── 11.9 ← Epic 1 (pages, boards, contacts)
  ↓
Epic 12 (Content Templates)         Epic 13 (People)              Epic 14 (Standards)
  ├── 12.1–12.3 ← Epic 3           ├── 13.1, 13.3 ← Epic 3       ├── 14.1–14.3 ← Epic 3
  ├── 12.4–12.5 ← 12.1-12.3,       ├── 13.2 ← 13.1, 12.2,        ├── 14.4 ← 14.1-14.3,
  │     2.5, 11.9                   │     12.3, 11.1               │     12.3, 3.6, 11.11
  └── 12.6 ← 11.8, 11.9            └── 13.4 ← 13.3, 12.3,        ├── 14.5 ← Epic 3
                                          2.5, 11.2                └── 14.6 ← 14.5, 12.3,
                                                                         2.5, 11.4
  ↓                                  ↓                             ↓
Epic 15 (Documents)                 Epic 16 (Listings)
  ├── 15.1–15.3, 15.5–15.7          ├── 16.1–16.3, 16.6
  │     ← Epic 3                    │     ← Epic 3
  ├── 15.4 ← 15.1-15.3,            ├── 16.4 ← 16.1-16.3,
  │     12.3, 2.5, 11.5             │     3.3, 12.3, 2.5, 11.3
  └── 15.8 ← 15.5-15.7,            ├── 16.5 ← 16.1-16.3,
        12.1, 12.3, 2.5, 11.6      │     3.3, 2.5, 11.10
                                    └── 16.7 ← 16.6, 3.3,
                                          2.5, 11.13
  ↓                                  ↓
Epic 17 (Forms & Auth)
  ├── 17.1–17.3, 17.5–17.7 ← Epic 3
  ├── 17.4 ← 17.1-17.3, 11.7, 11.9
  └── 17.8 ← 17.5-17.7, 11.12
  ↓
Epic 20 (Gap Pages & Forms) ← Epics 2, 3, 11, 12, 16, 17
  ↓
Epic 18 (Bilingual i18n)
  ├── 18.1 ← Epic 0
  ├── 18.2 ← Epic 1, Epic 11
  ├── 18.3 ← 18.1, 2.1, 2.3
  ├── 18.4 ← 18.1
  └── 18.5 ← 18.1, 10.5
  ↓
Epic 21 (Integration & Polish) ← ALL Epics 11-20
```

---

## Estimated Task Count

| Epic | Tasks | Dependencies |
|------|-------|-------------|
| 11. Phase 2 CMS Collections | 13 | Epics 0, 1 |
| 12. Content Page Templates | 6 | Epics 3, 11 |
| 13. People & Organization | 4 | Epics 3, 11, 12 |
| 14. Standards Section | 6 | Epics 3, 11, 12 |
| 15. Document Workflow | 8 | Epics 3, 11, 12 |
| 16. Listings | 7 | Epics 3, 11, 12 |
| 17. Forms & Auth | 8 | Epics 3, 11 |
| 20. Gap Pages & Forms | 10 | Epics 2, 3, 11, 12, 16, 17 |
| 18. Bilingual (i18n) | 5 | Epics 0, 1, 2, 11 |
| 21. Phase 2 Integration & Polish | 6 | All Phase 2 |
| **Phase 2 Total** | **73 tasks** | |
| **Combined (Phase 1 + 2)** | **131 tasks** | |
