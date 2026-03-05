# Notion Component & Page Specs — Full Sub-Page Extraction

> **Date:** 2026-03-05
> **Source:** RAS Overview Notion page — all 50+ sub-pages fetched
> **Purpose:** Field-level specs, component behavior, and design details extracted from every sub-page under the RAS Overview

---

## Summary of Findings

**Total sub-pages fetched:** 53
- New Components: 25 (24 with content + 1 Component Summary already reviewed)
- Existing Components: 21 (only 4 have content; 17 are blank stubs)
- Page Templates: 7 (mostly Sitecore path references only)
- Forms: 8 (6 previously reviewed + 2 new: Forgot Username, Forgot Password)
- New Pages: 4 (Search Results, Board Page, Project Detail, Listing Pages Overview — all previously reviewed except Board/Project Detail screenshots)

**Key takeaway:** The NEW component sub-pages contain meaningful field specs and wireframe screenshots. The EXISTING component sub-pages are almost entirely blank — they serve as placeholders referencing the current Sitecore components. The Page Template sub-pages contain only Sitecore content tree paths. The real design details live in the New Components section.

---

## 1. NEW COMPONENTS — Field-Level Specs

### 1.1 Header Navigation
- **Screenshot:** Yes (3 screenshots — desktop expanded, left panel, right panel)
- **Structure:**
  - **Tertiary Menu:** Drop-down menu + links + destination links, Language Toggle, Sign In/Sign Out
  - **Primary Menu:** FRAS (RAS) Logo, Search Bar, Drop-down menu with links + destination links
- **Auth state behavior:** After successful sign-in, header reflects active status with Member's name and "Sign Out" button
- **Key detail:** Tertiary menu is a separate row above the primary nav

### 1.2 Footer
- **Screenshot:** Yes (1 screenshot)
- **Structure:**
  - Footer Menu Link List in 4 columns with Logo on extreme left
  - Social Icons + Links
  - Newsletter Subscription Form
  - Tertiary Footer Menu with copyright statement and Legal Links (Privacy, ToS, Cookies etc.)

### 1.3 Sitewide Search
- **Screenshots:** Yes (2 screenshots — search modal and results page)
- **Facet controls (left rail):**
  - Board
  - Content Type
  - Date Range picker
- **Sort By:** "Relevance" default, Date Ascending, Date Descending in dropdown
- **Open question:** "Modal implementation to be discussed — What purpose does a modal serve beyond an unnecessary step?" — suggests search modal may be dropped in favor of direct results page

### 1.4 Left Rail Navigation
- **Screenshot:** Yes (1 screenshot)
- **Behavior:**
  - Navigates to any Board Content pages
  - Active link highlighted
  - No limit to number of links
  - **TBC:** May need nested/expandable links within each link (indent solution TBD)

### 1.5 Right Rail — Quick Links
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Curatable link description
  - Sequence (author-controlled order)
  - Headline Field
- **Open questions:** External links? Icons? Active/hover state? Character limits?
- **Reuse note:** "Can be leveraged for RIGHT RAIL — PROJECT ACTIONS"

### 1.6 Right Rail — Project Actions
- **Screenshot:** Yes (1 screenshot)
- **Spec:** Duplicate of Quick Links component
- **Note:** Explicitly calls out as same component as Right Rail - Quick Links

### 1.7 Right Rail — Events List
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline Field
  - Curatable list of events referencing EVENT DETAIL pages as data source
  - Authors control sequence and quantity
- **Open question:** "Dynamic or Authored? TBC"

### 1.8 Right Rail — Resource List
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline Field
  - Curatable selection of resource links from Content Tree
  - Auto-inclusion of icon depending on content type
  - Quantity and sequence completely defined by author

### 1.9 Right Rail — Staff Contact
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline Field
  - Authors select Staff Contact from Staff Details picklist
  - Contact info auto-displayed from selected staff record
  - May include icons in final design
  - No limit to quantity of staff contacts

### 1.10 Hero Banner
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline (SLT — Single Line Text)
  - Body Copy (RTE — Rich Text Editor)
  - Active Project Search Bar & Search Execute CTA
- **Key detail:** Search bar in hero is LIMITED TO JUST PROJECTS — not sitewide search

### 1.11 CTA Banner
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline (SLT)
  - Body Copy (RTE)
  - CTA button
  - Light or Dark theme toggle
  - Optional Image background
- **Note:** Full-width banner

### 1.12 Card Grid
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - 3 card grid layout
  - Authors may manipulate card order
  - Card height defined by tallest card
  - Optional heading
  - Optional background colour/theme
- **Open question:** Height limits?

### 1.13 News Card
- **Screenshot:** Yes (1 screenshot — same as Card Grid screenshot)
- **Fields:**
  - Headline (SLT)
  - Clarity Copy (RTE)
  - Link to All
- **Behavior:**
  - Auto-updated by 3 most recent news articles
  - Authors may override and add their own news story
  - Each news article shows: Headline (truncated), Published Date

### 1.14 Drafts Card
- **Screenshot:** Yes (1 screenshot — same as Card Grid screenshot)
- **Fields:**
  - Headline (SLT)
  - Clarity Copy (RTE)
  - Link to All → Change "3 Active" to View All CTA
- **Behavior:**
  - Auto-updated by 3 most recent Exposure Drafts
  - Authors may override with their own Exposure Draft
  - Each draft shows: Headline (truncated), Due Date

### 1.15 Events Card
- **Screenshot:** Yes (1 screenshot — same as Card Grid screenshot)
- **Fields:**
  - Headline (SLT)
  - Clarity Copy (RTE)
  - Link to All → Change "This Month" to View All CTA
- **Behavior:**
  - Auto-updated by 3 next Events
  - Authors may override with their own Event
  - Each event shows: Headline (truncated), Start Date, Start Time (for Webinars Only)
- **New detail:** Start Time field is WEBINAR-ONLY — other event types only show date

### 1.16 Subscribe Banner
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Headline
  - Body Copy
  - Email Entry Field
  - Subscribe Button → forwards email directly to HubSpot DB
  - LinkedIn Icon and Link
- **Integration:** HubSpot for email subscription
- **Note:** Full-width banner

### 1.17 Promo Card Grid + Cards
- **Screenshot:** Yes (1 screenshot)
- **Spec:** Visual solution for LinkList — curatable list of 4-column link list, categorized by Board
- **Key detail:** ONE-OFF COMPONENT, SPECIFIC TO HOMEPAGE — not reusable across pages

### 1.18 Page Header (+ Breadcrumb)
- **Screenshot:** Yes (1 screenshot)
- **Open question:** "Defined by Page name or Curatable by Authoring team?"
- **Breadcrumb:** Defined by Content Tree path
- **Consideration:** Need truncation for excessively long page titles

### 1.19 Project Timeline
- **Screenshot:** Yes (1 screenshot)
- **Behavior:**
  - Curatable component — authors easily update project status
  - Up to 7 stages allowed
  - Each stage has a checkbox state determining display:
    - **Complete:** checkmark icon on left
    - **In Progress:** active highlight
    - **Not Started:** greyed out

### 1.20 Projects List
- **Screenshot:** Yes (1 screenshot)
- **Content:** Screenshot only, no text specs provided

### 1.21 News List
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Heading
  - View All CTA
  - Maximum 4 most recent News items tagged with the respective Board
  - Listed by date descending
- **Each listing shows:**
  - Date
  - News Story Headline
  - Summary Copy (truncated)
  - Read More link

### 1.22 Rich Text (New)
- **Screenshot:** Yes (1 screenshot)
- **Content:** Screenshot only, no text specs provided

### 1.23 Events Listing
- **Screenshot:** Yes (1 screenshot)
- **Fields:**
  - Heading
  - View All CTA
  - Up to 3 next upcoming events or decision summaries
  - Ranked by date nearest to furthest
  - Scoped to Board (defined by which page it sits on)
- **Each event listing shows:**
  - Event Title
  - Event Description (truncated where necessary)
  - Event Type (Badge)
  - Event Date

### 1.24 Event Summary Table
- **Screenshot:** Yes (1 screenshot — from current live site)
- **Spec:** "Replica of existing Summary Table from current site"
- **Note:** This is a carry-forward component from the existing site, not a net-new design

---

## 2. EXISTING COMPONENTS — Status

Of the 21 existing component sub-pages, only **4** contain any content:

| Component | Content |
|-----------|---------|
| Banner | Screenshot only (current site banner) |
| Breadcrumb | Screenshot only (current site breadcrumb) |
| Section Title | Screenshot only (current site section title) |
| Page Title | Screenshot only (current site page title/header) |
| Secondary Navigation | Screenshot only (horizontal tab-style nav pulling sibling pages) |
| Staff Contact | Screenshot only (current site staff contact block) |

The following **15 existing component pages are completely BLANK** (placeholder stubs only):

1. Committee Members List
2. Document Comment Section
3. Generic CTA
4. Meeting Page Details
5. Meeting Summary Rollup
6. Meetings Listing
7. News Listing
8. Upcoming Meetings Rollup
9. Side Navigation
10. Effective Dates Table
11. Meeting Topics Table
12. Project Overview
13. Project Table
14. Project Status Table
15. Rich Text (Existing)

**Implication:** For these 15 blank components, we must rely on live site observation and our own site-discovery docs for field specs.

---

## 3. PAGE TEMPLATES — Status

All 7 page template sub-pages contain only Sitecore content tree paths — no field specs:

| Template | Content |
|----------|---------|
| Homepage | Sitecore path + 2 wireframe screenshots (homepage top + footer area) |
| Standard Page | `NLC/Pages/Fras/Standard Page` — no specs |
| Standard Page with Side Navigation | `NLC/Pages/Fras/Standard Page with Side Navigation` — no specs |
| Project | `NLC/Pages/Fras/Project` — no specs |
| Annual Report Page | `NLC/Pages/Fras/Annual Report Page` — no specs |
| Error Page | `NLC/Pages/Fras/Error Page` — no specs |

**Note:** The Homepage template has wireframe screenshots that show component composition (Hero, Card Grid, Promo Card Grid, Subscribe Banner, Footer layout).

---

## 4. FORMS — Additional Pages Not Previously Reviewed

### 4.1 Forgot Username
- **URL:** `https://www.frascanada.ca/en/my-account/forgot-username`
- **Screenshot:** Yes (1 screenshot from live site)
- **Content:** Link to live page + screenshot

### 4.2 Forgot Password
- **URL:** `https://www.frascanada.ca/en/my-account/forgot-my-password`
- **Screenshot:** Yes (1 screenshot from live site)
- **Content:** Link to live page + screenshot

---

## 5. NEW PAGES — Screenshots

### 5.1 Search Results Page
- **Screenshots:** Yes (2 screenshots — search results with left rail facets, results grid view)
- **Content:** Screenshots only — no text specs (see Sitewide Search component for facet details)

### 5.2 Board Page
- **Screenshots:** Yes (1 screenshot — Board landing page wireframe)
- **Content:** Screenshot only

### 5.3 Project Detail
- **Screenshots:** Yes (1 screenshot — Project detail wireframe)
- **Content:** Screenshot only

---

## 6. KEY FINDINGS — New or Contradictory Information

### 6.1 Hero Banner Search is Project-Only
The Hero Banner's search bar is **limited to Projects only**, not sitewide search. This is explicitly stated: "Active Project Search Bar & Search Execute CTA (Limited to just Projects)". Our PRD should clarify this distinction.

### 6.2 Right Rail — Project Actions = Quick Links
These are the SAME component. The Notion page explicitly says "Duplicate of QUICK LINKS" and links to the Quick Links page. No need for a separate component — just different content.

### 6.3 Events Card — Start Time is Webinar-Only
The Events Card explicitly specifies "Start Time (For Webinars Only)" — other event types only show Start Date. This implies a conditional field display.

### 6.4 Promo Card Grid is Homepage-Only
Explicitly stated as "(One-Off component, specific to HomePage)". Should not be treated as a reusable component.

### 6.5 Subscribe Banner → HubSpot
The Subscribe Banner's submit button "Will forward email directly to Hubspot DB". This confirms the HubSpot integration requirement for newsletter subscriptions. Also includes LinkedIn icon and link.

### 6.6 Project Timeline — Up to 7 Stages with Tri-State
Each stage has 3 display states: Complete (checkmark), In Progress (highlighted), Not Started (greyed out). Authors can define up to 7 stages.

### 6.7 Left Rail Nav — Nested Links TBD
The Left Rail Navigation "MAY need to consider inclusion/solution for NESTED links within each of the links (Expandable? Indent?) TBC". This is still an open design question.

### 6.8 Page Header — Source TBD
Open question: "Defined by Page name or Curatable by Authoring team?" — whether page title comes from CMS page name field or a separate authored field.

### 6.9 Right Rail — Events List Sourcing TBD
"Dynamic or Authored? TBC" — whether events are auto-populated from CMS or manually curated by authors.

### 6.10 Card Grid — Height Limits Questioned
Open question about whether card heights should have maximum limits.

### 6.11 Search Modal Under Debate
The Sitewide Search page questions the modal: "What purpose does a modal serve beyond an unnecessary step?" — this suggests the search flow may go directly to results page without an intermediary modal.

---

## 7. OPEN DESIGN QUESTIONS (Surfaced from Sub-Pages)

| # | Question | Component | Impact |
|---|----------|-----------|--------|
| 1 | Left Rail: Need nested/expandable links? | Left Rail Navigation | Medium |
| 2 | Quick Links: External links? Icons? Active/hover state? Character limits? | Right Rail - Quick Links | Low |
| 3 | Events List: Dynamic or authored? | Right Rail - Events List | Medium |
| 4 | Card Grid: Height limits? | Card Grid | Low |
| 5 | Page Header: Derived from page name or separate authored field? | Page Header | Low |
| 6 | Search: Drop the modal in favor of direct results? | Sitewide Search | Medium |
| 7 | CTA Banner: What constitutes "Light" vs "Dark" theme? | CTA Banner | Low |
