# FRAS Canada — Wireframe Specifications

> **Source:** Figma file `FRAS-2025-07-22`, Page: "Wireframe Deliverables 07-21-25"
> **Figma URL:** https://www.figma.com/design/3DK2vb90O9421OaYmAsJJd/FRAS-2025-07-22?node-id=103-11785
> **Date Documented:** 2026-03-04
> **Purpose:** Component specifications for Payload CMS + Next.js implementation

---

## Table of Contents

1. [Global Components](#1-global-components)
2. [Homepage (Desktop)](#2-homepage-desktop)
3. [Homepage (Mobile)](#3-homepage-mobile)
4. [Search Modal](#4-search-modal)
5. [Search Filters](#5-search-filters)
6. [Search Results](#6-search-results)
7. [Project Detail Page](#7-project-detail-page)
8. [Active Projects Listing](#8-active-projects-listing)
9. [Open Consultations Listing](#9-open-consultations-listing)
10. [Board Detail Page](#10-board-detail-page)
11. [Mobile Menu](#11-mobile-menu)
12. [Component Inventory](#12-component-inventory)
13. [Payload CMS Collection Mapping](#13-payload-cms-collection-mapping)

---

## 1. Global Components

**Figma Frame:** `Navigation & Footer (Components)` — 1640 x 2447

### 1.1 Header / Top Navigation Bar

**Desktop layout (1440px):**

```
┌──────────────────────────────────────────────────────────────────────┐
│ About Us ▾ │ Boards ▾ │ Contact │ Newsletter │ Volunteer   FR  👤 Sign In │
├──────────────────────────────────────────────────────────────────────┤
│ FRAS Canada    🔍 [Projects, standards, and more...]                 │
├──────────────────────────────────────────────────────────────────────┤
│ Active Projects ▾    Open Consultations    News                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Structure:**
- **Row 1 (Utility bar):** Secondary links — About Us (dropdown), Boards (dropdown), Contact, Newsletter, Volunteer | FR language toggle | Sign In with user icon
- **Row 2 (Main bar):** FRAS Canada logo (left) + Global search input (center/right) with placeholder "Projects, standards, and more..."
- **Row 3 (Primary nav):** Active Projects (with dropdown chevron), Open Consultations, News

**Mobile layout (390px):**
- FRAS Canada logo + search icon + hamburger menu icon
- Search and navigation collapse into mobile menu (see Section 11)

**Next.js Component:** `<SiteHeader />` — Shared layout component
**Payload Fields:** Global `navigation` config with menu items, labels, and link targets

### 1.1b Mega-Menu Dropdowns

**Figma Frame:** `Navigation` — 1440 x 1558

The header navigation includes dropdown mega-menus for three sections:

**About Us dropdown (single column):**
- About FRAS Canada
- Oversight Council
- Research Program
- Jobs

**Boards dropdown (4-column mega-menu):**
| CSSB | AcSB | PSAB | AASB |
|---|---|---|---|
| Overview | Overview | Overview | Overview |
| Consultations | Consultations | Consultations | Consultations |
| Projects & Initiatives | Projects & Initiatives | Projects & Initiatives | Projects & Initiatives |
| Resources | Resources | Resources | Resources |
| Meetings & Decision Summaries | Meetings & Decision Summaries | Meetings & Decision Summaries | Meetings & Decision Summaries |
| Committees | Committees | Committees | Committees |
| Volunteer | Volunteer | Volunteer | Volunteer |

**Active Projects dropdown (single column, by board):**
- Canadian Sustainability Standards Board
- Accounting Standards Board
- Public Sector Accounting Board
- Auditing and Assurance Standards Board

**Next.js Component:** `<MegaMenu />` — Dropdown variant per nav item
**Behavior:** Hover/click to expand, matches full-width of header

### 1.2 Footer

**Desktop layout:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ FRAS Canada                   │ Boards              │ Quick Links   │ Account │
│ Financial Reporting &         │ CSSB                │ About Us      │ Login   │
│ Assurance Standards Canada    │ AcSB                │ Research Prog │ Français│
│ 🔗 LinkedIn                   │ PSAB                │ News          │         │
│                               │ AASB                │ Jobs          │         │
│                               │ RASOC               │ Volunteer     │         │
│                               │                     │ Contact       │         │
│                               │                     │ Newsletter    │         │
├──────────────────────────────────────────────────────────────────────┤
│ Stay informed with our weekly updates                                │
│ Get critical updates on regulatory changes...  Learn more            │
│ [Your email address]                                    [Subscribe]  │
├──────────────────────────────────────────────────────────────────────┤
│ © 2025 FRAS Canada. All rights reserved.  Privacy Policy │ Cookie │ Terms  │
└──────────────────────────────────────────────────────────────────────┘
```

**Structure:**
- **Column 1:** Org name ("FRAS Canada"), full name ("Financial Reporting & Assurance Standards Canada"), LinkedIn icon
- **Column 2:** Boards — Canadian Sustainability Standards Board, Accounting Standards Board, Public Sector Accounting Board, Auditing and Assurance Standards Board, Reporting & Assurance Standards Oversight Council (5 total, using full names)
- **Column 3:** Quick Links (2 sub-columns) — About Us, Research Program, News, Jobs, Volunteer, Contact, Newsletter | Site Map, Privacy Policy, Cookie Policy
- **Column 4:** Account — Login, Français (language toggle)
- **Newsletter CTA row:** "Stay informed with our weekly updates" + "Get critical updates on regulatory changes and new standard releases. Learn more" + email input + Subscribe button
- **Copyright bar:** "© 2025 Financial Reporting & Assurance Standards Canada. All rights reserved." + Privacy Policy, Cookie Policy, Terms of Use links

**Next.js Component:** `<SiteFooter />`
**Payload Fields:** Global `footer` config with column groups, newsletter settings

---

## 2. Homepage (Desktop)

**Figma Frame:** `Homepage` — 1440 x 2968
**Route:** `/`

### 2.1 Hero Section

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Canada's Official Hub for Financial                           │
│   Reporting Standards                                            │
│                                                                  │
│   FRAS provides resources and guidance to help professionals     │
│   navigate Canadian accounting, auditing, and sustainability     │
│   standards.                                                     │
│                                                                  │
│   🔍 [Find an active project                     ] [Search]      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Components:**
- H1 heading: "Canada's Official Hub for Financial Reporting Standards"
- Subtitle/description paragraph
- Search bar with placeholder "Find an active project" + Search button (dark/filled)
- Full-width section, white background

### 2.2 "New to FRAS?" CTA

```
┌──────────────────────────────────────────────────────────────────┐
│   New to FRAS?                                                   │
│   Let us guide you through the essentials.      [Get Started →]  │
└──────────────────────────────────────────────────────────────────┘
```

- Left: Heading + description text
- Right: "Get Started →" outline/ghost button with arrow
- Horizontal divider styling, compact section

### 2.3 Important News & Events

```
┌──────────────────────────────────────────────────────────────────┐
│  Important News & Events                                         │
│  ┌──────────────┬──────────────────────┬─────────────────────┐   │
│  │ Top News     │ Respond to Exposure  │ Upcoming Events     │   │
│  │  All News →  │ Drafts    3 Active   │          This Month │   │
│  │              │                      │                     │   │
│  │ • AASB       │ • ED-2025-01:        │ • Event Title 1     │   │
│  │   Roundtable │   Climate Disclosure │   June 5, 9:00 AM   │   │
│  │   Published  │   Due: June 30, 2025 │                     │   │
│  │   May 5...   │                      │ • Event Title 2     │   │
│  │              │ • ED-2025-03:        │   June 8, 2:00 PM   │   │
│  │ • PSAB       │   Biodiversity       │                     │   │
│  │   Survey...  │   Due: July 20, 2025 │ • Event Title 3     │   │
│  │              │                      │   June 12, 1:00 PM  │   │
│  │ • AcSB       │ • ED-2025-02:        │                     │   │
│  │   Volunteer  │   Social Impact      │                     │   │
│  │   Opp...     │   Due: Aug 15, 2025  │                     │   │
│  └──────────────┴──────────────────────┴─────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 3-column card grid with light blue/gray background
**Column 1 — Top News:** Header with "All News →" link, list of news items with title + publish date
**Column 2 — Respond to Exposure Drafts:** Header with "3 Active" badge, list with title + due date
**Column 3 — Upcoming Events:** Header with "This Month" filter, list with title + date/time + timezone

### 2.4 Newsletter / Trust Section

```
┌──────────────────────────────────────────────────────────────────┐
│  Trusted by 3,000+ finance professionals to stay informed.       │
│  Stay ahead of regulatory changes with our newsletter digest...  │
│                                                                  │
│  [Your email address                         ] [Subscribe]       │
│  🔗 Join the conversation with FRAS on LinkedIn                  │
└──────────────────────────────────────────────────────────────────┘
```

- Centered text layout
- Email input + Subscribe button (dark/filled)
- LinkedIn CTA link with icon

### 2.5 Browse by Standard

```
┌──────────────────────────────────────────────────────────────────┐
│  Browse by Standard                                              │
│  ┌─────────────┬──────────────┬──────────────┬──────────────┐   │
│  │Sustainability│ Accounting   │ Public Sector│ Assurance    │   │
│  │             │              │              │              │   │
│  │ • CSDS      │ • Part I:    │ • PSAS       │ • CSQM       │   │
│  │ • CSSB      │   IFRS® AS   │ • IPSAS      │ • CAS        │   │
│  │             │ • Part II:   │   Activities │ • Other      │   │
│  │             │   Private    │ • PSAB       │ • AASB       │   │
│  │             │   Enterprises│              │              │   │
│  │             │ • Part III:  │              │              │   │
│  │             │   NFP Orgs   │              │              │   │
│  │             │ • Part IV:   │              │              │   │
│  │             │   Pension    │              │              │   │
│  │             │ • AcSB       │              │              │   │
│  └─────────────┴──────────────┴──────────────┴──────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 4-column card grid
**Each card:** Category heading + list of standard/board links
**Categories:** Sustainability, Accounting, Public Sector, Assurance

---

## 3. Homepage (Mobile)

**Figma Frame:** `Homepage Mobile` — 390 x 4256
**Same sections as desktop, stacked vertically:**
- Mobile header: FRAS Canada logo + search icon + hamburger
- Hero section with stacked heading + search input + Search button
- "New to FRAS?" CTA (stacked, "Get Started" button below text)
- **Important News & Events** — 3 desktop columns become 3 distinct stacked sections:
  - "All News →" with stacked news items
  - "Response to Exposure Drafts" with ED items (ED number, title, date)
  - "Upcoming Events" with event items (date, title, type)
- Newsletter / Trust section — full width, email + Subscribe
- Browse by Standard — 4 categories stacked as expandable list cards (Sustainability, Accounting, Public Sector, Assurance) with sub-standard links
- Footer stacks into single column

**Mobile adaptation patterns:**
- Board sidebar → dropdown selector
- Multi-column grids → single-column stacks
- Filter panel → collapsible accordions
- Section nav sidebar → top dropdown or accordion

---

## 4. Search Modal

**Figma Frame:** `Search Modal` — 1440 x 1440
**Trigger:** Click on search input in header

```
┌──────────────────────────────────────────────────────────────────┐
│                         (overlay/dimmed background)               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 🔍 [Projects, meetings, documents, and more.            ] │  │
│  │                                                            │  │
│  │ Recent                          Popular                    │  │
│  │ ┌──────────┬──────────────┬───┐ ┌───────┬──────────┬────┐ │  │
│  │ │ IFRS 16  │Sustainability│ASB│ │IFRS 17│Lease Acc.│ESG │ │  │
│  │ │          │Standards     │Mtg│ │       │          │Rep │ │  │
│  │ └──────────┴──────────────┴───┘ │ASPE   │Revenue   │    │ │  │
│  │ │Public Sector│                 │Updates│Recogn.   │    │ │  │
│  │                                 └───────┴──────────┴────┘ │  │
│  │                                                            │  │
│  │ [Search] [Cancel]                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Components:**
- Full-screen overlay with dimmed background
- Large search input with icon and placeholder
- **Recent tags (pill chips):** IFRS 16, Sustainability Standards, ASB Meeting, Public Sector
- **Popular tags (pill chips):** IFRS 17, Lease Accounting, ESG Reporting, ASPE Updates, Revenue Recognition
- **Actions:** Search button (dark/filled) + Cancel button (outline)

**Mobile version:** `Search Modal Mobile` (390px) — same layout, stacked tags

---

## 5. Search Filters

**Figma Frame:** `Search Filters` — 1440 x 982
**Context:** Displayed as a panel/sidebar on the Search Results page

```
┌──────────────────────────────────────────────────────────────────┐
│  Search Filters                                                  │
│  ┌──────────┬──────────────┬───────────┬────────────┬──────────┐│
│  │ By Board │ By Standard  │Files&Media│Content Type│ Date     ││
│  │          │              │           │            │          ││
│  │☐ CSSB    │Sustainability│☐ All      │☐ Project   │○ Last 30d││
│  │☐ AcSB    │ ☐ CSDS      │☐ PDF Files│☐ News      │○ Last 3mo││
│  │☐ PSAB    │Accounting    │☐ Word Docs│☐ Doc for   │○ Last yr ││
│  │☐ AASB    │ ☐ Part I    │☐ Video    │  Comment   │○ All time││
│  │          │ ☐ Part II   │           │☐ Resource  │          ││
│  │          │ ☐ Part III  │           │☐ Guidance  │          ││
│  │          │ ☐ Part IV   │           │☐ Articles  │          ││
│  │          │Public Sector │           │☐ Roundtable│          ││
│  │          │ ☐ PSAS      │           │☐ Decision  │          ││
│  │          │ ☐ IPSAS     │           │  Summaries │          ││
│  │          │Assurance     │           │☐ Webinar   │          ││
│  │          │ ☐ CSQM      │           │            │          ││
│  │          │ ☐ CAS       │           │            │          ││
│  │          │ ☐ Other     │           │            │          ││
│  │          │ ☐ AASB      │           │            │          ││
│  └──────────┴──────────────┴───────────┴────────────┴──────────┘│
└──────────────────────────────────────────────────────────────────┘
```

**Filter categories (5 columns):**
1. **By Board:** Checkboxes — CSSB, AcSB, PSAB, AASB
2. **By Standard:** Grouped checkboxes under Sustainability, Accounting (Part I-IV), Public Sector, Assurance
3. **Files & Media:** Checkboxes — All, PDF Files, Word Documents, Video
4. **Content Type:** Checkboxes — Project, News, Document for Comment, Resource, Guidance, Articles, Roundtable, Decision Summaries, Webinar
5. **Date:** Radio buttons — Last 30 days, Last 3 months, Last year, All time

**Mobile version:** `Search Filters Mobile` (390px) — filters collapse into accordions/dropdowns

---

## 6. Search Results

**Figma Frame:** `Search Results` — 1440 x 2206
**Route:** `/search?q=...`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home / Search Results                                           │
│  🔍 [IFRS 16                                                  ] │
│  Recent: [IFRS 16] [Sustainability Standards] [ASB Meeting] ... │
│                                         [Save Search Alert]      │
├──────────────────────────────────────────────────────────────────┤
│  Filter Results   Clear All │ 40 results found    Sort by: [Relevance ▾]│
│  ┌─────────────────────┐   │                                    │
│  │ Filter by Board (1) ▾│  │ ┌──────────────────────────────┐  │
│  │ ☐ CSSB (2)          │  │ │[Standard] AcSB  Jan 15, 2025 │  │
│  │ ☑ AcSB (30)         │  │ │ IFRS 16 Leases - Impl Guide  │  │
│  │ ☐ PSAB (8)          │  │ │ Comprehensive guidance on...  │  │
│  │   AASB (0)          │  │ │ PDF • 2.4 MB    View Document │  │
│  │                     │  │ └──────────────────────────────┘  │
│  │ By Standard      ▾  │  │ ┌──────────────────────────────┐  │
│  │ Files & Media    ▾  │  │ │[News] AcSB      Mar 22, 2025 │  │
│  │ Content Type     ▾  │  │ │ IFRS 16 Amendment: Lease...   │  │
│  │                     │  │ │ The IASB has issued amendments│  │
│  │ Filter by Date (1) ▲│  │ │ Web Article         Read More │  │
│  │ ● Last 30 days     │  │ └──────────────────────────────┘  │
│  │ ○ Last 3 months    │  │                                    │
│  │ ○ Last year        │  │ (more results...)                   │
│  │ ○ All time         │  │                                    │
│  └─────────────────────┘  │ Showing 1-5 of 40  [1][2][3]...[8]│
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 2-column — sidebar filters (left) + results list (right)

**Search bar area:**
- Breadcrumb: Home / Search Results
- Large search input pre-filled with query
- Recent search tags (pill chips)
- "Save Search Alert" link

**Filter sidebar:**
- Collapsible accordion sections matching Search Filters spec
- Active filter count badges, e.g. "Filter by Board (1)"
- "Clear All" link

**Result cards — each contains:**
- **Content type badge:** Standard (purple), News (dark), Webinar (teal), Meeting Summary (gray), Guidance (dark outline)
- **Board name** + **Date** (right-aligned)
- **Title** (linked heading)
- **Description** (truncated text)
- **File info** (e.g., "PDF • 2.4 MB") or format indicator
- **CTA link:** View Document / Read More / Watch Recording / Read Summary / Download Guide

**Pagination:** "Showing 1-5 of 40 results" + numbered page buttons

---

## 7. Project Detail Page

**Figma Frame:** `Project` — 1440 x 3116
**Route:** `/active-projects/:board/:project-slug`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home / Active Projects / PSAB / Intangible Assets - PS 3155     │
│                                                                  │
│  🏛 Intangible Assets - Proposed Section PS 3155                 │
│                                                                  │
│  ┌─────────┐  ┌──────────────────────────────┐ ┌──────────────┐ │
│  │ PSAB    │  │      [Project Banner]        │ │Project Actions│ │
│  │─────────│  │       (optional)              │ │[Submit Comment│ │
│  │Overview │  │                              │ │[Take Survey]  │ │
│  │News     │  │ Summary                      │ │[Download ED]  │ │
│  │Meetings │  │ The Public Sector Accounting  │ ├──────────────┤ │
│  │Events   │  │ Board (PSAB) approved the    │ │Upcoming Events│ │
│  │Resources│  │ Exposure Draft...            │ │• Impl Webinar │ │
│  │         │  │                              │ │  Jun 10       │ │
│  │         │  │ Key Proposals                │ │• Comment Close│ │
│  │         │  │ • Recognition criteria       │ │  May 30       │ │
│  │         │  │ • Measurement requirements   │ │• PSAB Meeting │ │
│  │         │  │ • Disclosure requirements    │ │  Mar 20       │ │
│  │         │  │ • Modifications to IPSAS 31  │ ├──────────────┤ │
│  │         │  │                              │ │Resources      │ │
│  │         │  │ Project Timeline             │ │📎 PS 3154     │ │
│  │         │  │ ● Information Gathering [1]  │ │📄 Exposure    │ │
│  │         │  │   Completed 2023             │ │   Draft       │ │
│  │         │  │ ● Approving Project [2]      │ └──────────────┘ │
│  │         │  │   Completed Dec 2024         │                   │
│  │         │  │ ● Engaging Communities [3]   │                   │
│  │         │  │   ED published, comment      │                   │
│  │         │  │   open until May 30, 2025    │                   │
│  │         │  │   [Take Survey][Submit Comm] │                   │
│  │         │  │ ○ Deliberating Feedback [4]  │                   │
│  │         │  │   Planned Summer 2025        │                   │
│  │         │  │ ○ Final Pronouncement [5]    │                   │
│  │         │  │   Planned Late 2025          │                   │
│  └─────────┘  └──────────────────────────────┘                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Recent Events                                View All → │    │
│  │ Feb 27, 2025  PSAB Decision Summary  [Decision Summary] │    │
│  │ Dec 12, 2024  PSAB Decision Summary  [Decision Summary] │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ Recent News                                  View All → │    │
│  │ Feb 27, 2025  PSAB Issues Exposure Draft on...          │    │
│  │ Jan 15, 2025  Intangible Assets Project Update Webinar  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Contacts                                                        │
│  Sarah Johnson — Project Manager — sarah.johnson@frascanada.ca   │
│  Michael Chen — Technical Advisor — michael.chen@frascanada.ca   │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 3-column (sidebar nav | main content | right sidebar)

**Left sidebar — Section nav:**
- Board name (e.g., "PSAB")
- Tabs: Overview, News, Meetings, Events, Resources

**Main content area:**
- Optional project banner image
- **Summary:** Rich text with heading + body paragraphs
- **Key Proposals:** Bulleted list
- **Project Timeline:** Configurable stepper with up to 7 stages (wireframe shows 5 representative stages: Information Gathering, Approving Project, Engaging Communities, Deliberating Feedback, Final Pronouncement):
  1. Information Gathering [Stage 1]
  2. Approving Project [Stage 2]
  3. Engaging Communities [Stage 3] — with CTA buttons
  4. Deliberating Feedback [Stage 4]
  5. Final Pronouncement [Stage 5]
  - Each stage: status indicator (filled/empty circle), stage badge, description, date, optional CTAs

**Right sidebar:**
- **Project Actions:** Submit Comment, Take Survey, Download Exposure Draft (buttons)
- **Upcoming Events:** Date + title + type badge (Webinar, Meeting, Deadline)
- **Resources:** Document links with icons

**Below main area:**
- **Recent Events:** Date + title + type badge, "View All →" link
- **Recent News:** Date + title, "View All →" link
- **Contacts:** Name, role, email, phone for project leads

---

## 8. Active Projects Listing

**Figma Frame:** `Active Projects` — 1440 x 2682
**Route:** `/active-projects/:board`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home / Active Projects / PSAB                                   │
│  🏛 Active Projects                                              │
│                                                                  │
│  ┌─────────────────────┐ ┌──────────────────────────────────────┐│
│  │ CSSB                │ │ 🔍 [Filter projects...] [All Standards▾]│
│  │ AcSB                │ │                                      ││
│  │ ▶ PSAB (selected)   │ │ Public Sector Accounting Standards  ▾││
│  │ AASB                │ │                                      ││
│  │                     │ │ 2024-2025 Annual Improvements        ││
│  │                     │ │ [Exposure Draft] [Public Comment]    ││
│  │                     │ │ PSAB issued its ED... Apr 11, 2025   ││
│  │                     │ │ Stage 3: Deliberating Feedback       ││
│  │                     │ │ [View ED] [Comment Summary]          ││
│  │                     │ │                                      ││
│  │                     │ │ Cloud Computing Arrangements         ││
│  │                     │ │ [Survey] [Research]                  ││
│  │                     │ │ Survey opened Feb 2025...            ││
│  │                     │ │ Stage 2: Engaging Communities        ││
│  │                     │ │ [View Survey] [Research Paper]       ││
│  │                     │ │                                      ││
│  │                     │ │ Employee Benefits                    ││
│  │                     │ │ [Re-exposure] [Feedback Analysis]    ││
│  │                     │ │ PSAB is currently deliberating...    ││
│  │                     │ │ Stage 4: Deliberating Feedback       ││
│  │                     │ │ [View Re-exposure Draft]             ││
│  │                     │ │                                      ││
│  │                     │ │ (more projects...)                   ││
│  │                     │ │                                      ││
│  │                     │ │ ── International PSAS Activities ──▾ ││
│  │                     │ │ IPSAS Implementation Review          ││
│  │                     │ │ [Research] [International Coord.]    ││
│  │                     │ │ IPSASB Consultation Responses        ││
│  │                     │ │ [International Input]                ││
│  └─────────────────────┘ └──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 2-column — board nav sidebar + project list

**Left sidebar — Board nav:**
- Vertical list of boards using full names: Canadian Sustainability Standards Board, Accounting Standards Board, Public Sector Accounting Board (selected), Auditing and Assurance Standards Board
- Active board is highlighted with dark background

**Project list area:**
- Search/filter bar: `Filter projects by name...` text input + `All Standards` dropdown
- Projects grouped under collapsible standard headers (e.g., "Public Sector Accounting Standards")
- Separate collapsible section: "International Public Sector Accounting Standards Activities"

**Each project card contains:**
- **Title** (linked)
- **Type badges:** Exposure Draft, Public Comment, Survey, Research, Re-exposure, Feedback Analysis, Webinar, Initial Research, Implementation, International Coordination, International Input
- **Description** text
- **Stage indicator:** "Stage N: [Stage Name]" with stage number
- **Action buttons:** View Exposure Draft, Comment Summary, View Survey, Research Paper, View Re-exposure Draft, Read Responses, Sign Up for Webinar, Basis for Conclusions, View Research, View Responses

**Wireframe shows 8 projects under "Public Sector Accounting Standards" (PSAB selected):**
1. 2024-2025 Annual Improvements — `Exposure Draft` `Public Comment` — Stage 3: Deliberating Feedback — `View Exposure Draft` `Comment Summary`
2. Cloud Computing Arrangements — `Survey` `Research` — Stage 2: Engaging Communities — `View Survey` `Research Paper`
3. Employee Benefits — `Re-exposure` `Feedback` `Analysis` — Stage 4: Deliberating Feedback — `View Re-exposure Draft` `Read Responses`
4. Government Not-For-Profit: Contributions — `Webinar` `Initial Research` — Stage 1: Information Gathering — `Sign Up for Webinar`
5. Intangible Assets — `Exposure Draft` `Implementation` — Stage 3: Engaging Communities — `View Exposure Draft` `Basis for Conclusions`
6. Narrow-scope Amendment: SORP-1 Consistency Updates — `Exposure Draft` — Stage 3: Engaging Communities — `View Exposure Draft`

**Under "International Public Sector Accounting Standards Activities":**
7. IPSAS Implementation Review — `Research` `International Coordination` — Stage 2: Information Gathering — `View Research`
8. IPSASB Consultation Responses — `International Input` — Stage 3: Engaging Communities — `View Responses`

---

## 9. Open Consultations Listing

**Figma Frame:** `Open Consultations` — 1440 x 2289
**Route:** `/open-consultations`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home / Open Consultations                                       │
│  💬 Open Consultations                                           │
│                                                                  │
│  🔍 [Filter consultations by name...]  [All Boards ▾]  [All Standards ▾]│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Intangible Assets   [Exposure Draft] [Survey]              │  │
│  │ Deadline: May 30, 2025                                     │  │
│  │ PSAB • Public Sector Accounting Standards                  │  │
│  │                                                            │  │
│  │ PSAB's Exposure Draft proposes accounting standards for    │  │
│  │ the recognition, measurement, presentation and disclosure  │  │
│  │ of intangible assets...                                    │  │
│  │                                                            │  │
│  │ [View Exposure Draft] [Basis for Conclusions]              │  │
│  │ [Submit Comment]                   Comments due in 45 days │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Cloud Computing Arrangements  [Survey]                     │  │
│  │ Deadline: April 15, 2025                                   │  │
│  │ PSAB • Public Sector Accounting Standards                  │  │
│  │ Survey seeking stakeholder input...                        │  │
│  │ [Complete Survey] [Background Paper]  Comments due 22 days │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Sustainability Disclosure Framework  [Exposure Draft]      │  │
│  │ Deadline: June 12, 2025                                    │  │
│  │ CSSB • Canadian Sustainability Disclosure Standards        │  │
│  │ Proposed framework for sustainability-related financial... │  │
│  │ [View ED] [Implementation Guide] [Submit Comment]          │  │
│  │                                    Comments due in 68 days │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Quality Management Standards Update  [Re-exposure Draft]  │  │
│  │ Deadline: April 28, 2025                                  │  │
│  │ Auditing and Assurance Standards Board •                   │  │
│  │   Canadian Standards on Quality Management                │  │
│  │ Re-exposure draft of proposed amendments to Canadian       │  │
│  │ Standard on Quality Management (CSQM) 1...                │  │
│  │ [View Re-exposure Draft] [Summary of Changes]             │  │
│  │ [Submit Comment]                  Comments due in 35 days │  │
│  └────────────────────────────────────────────────────────────┘  │
│  (more consultations...)                                         │
└──────────────────────────────────────────────────────────────────┘
```

**Filter bar:** Text search (`Filter consultations by name...`) + Board dropdown (`All Boards`) + Standard dropdown (`All Standards`)

**Each consultation card contains:**
- **Title** (linked)
- **Type badges:** Exposure Draft, Survey, Re-exposure Draft
- **Deadline date** (with formatting)
- **Board full name • Standard name** breadcrumb (uses full board names, not abbreviations)
- **Description** paragraph
- **Action buttons:** View Exposure Draft, Basis for Conclusions, Submit Comment, Complete Survey, Background Paper, Implementation Guide, Summary of Changes, View Re-exposure Draft
- **Countdown:** "Comments due in X days" (right-aligned)

**Wireframe shows 4 consultation cards:**
1. Intangible Assets — Exposure Draft + Survey — PSAB — May 30, 2025
2. Cloud Computing Arrangements — Survey — PSAB — April 15, 2025
3. Sustainability Disclosure Framework — Exposure Draft — CSSB — June 12, 2025
4. Quality Management Standards Update — Re-exposure Draft — AASB — April 28, 2025

---

## 10. Board Detail Page

**Figma Frame:** `Boards` — 1440 x 2542
**Route:** `/boards/:board-slug`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home / Board / Public Sector Accounting Board / Overview        │
│                                                                  │
│  🏛 Public Sector Accounting Board                               │
│                                                                  │
│  ┌─────────────────────┐ ┌──────────────────┐ ┌───────────────┐ │
│  │ Overview (active)   │ │ Active Projects  │ │ Quick Actions │ │
│  │ Consultations       │ │    View All →    │ │ CPA Handbook  │ │
│  │ Projects &          │ │ [All Standards ▾]│ │ Impl. Tools   │ │
│  │   Initiatives       │ │                  │ │ Explore       │ │
│  │ Resources           │ │ 2024-25 Annual   │ │ Webinars      │ │
│  │ Meetings & Decision │ │ Improvements     │ ├───────────────┤ │
│  │   Summaries         │ │ [ED][Public Comm]│ │Upcoming Events│ │
│  │ Committees          │ │ Stage 3: Delib.  │ │• PS 3450      │ │
│  │ Volunteer           │ │ [View Doc]       │ │  Webinar      │ │
│  │                     │ │                  │ │  Jun 10       │ │
│  │                     │ │ Employee Benefits│ │• Q2 Standards │ │
│  │                     │ │ [Re-exp][Feedbck]│ │  Review       │ │
│  │                     │ │ Stage 4: Delib.  │ │  Jun 15       │ │
│  │                     │ │                  │ │• Consultation │ │
│  │                     │ │ Intangible Assets│ │  Deadline     │ │
│  │                     │ │ [ED][Impl]       │ │  Jun 30       │ │
│  │                     │ │ Stage 3: Engaging│ ├───────────────┤ │
│  │                     │ │ [View ED]        │ │Resources      │ │
│  │                     │ │                  │ │📎 Basis for   │ │
│  │                     │ │ IPSAS Convergence│ │  Conclusions  │ │
│  │                     │ │ [Research][Analy]│ │📄 Impl Guide  │ │
│  │                     │ │ Stage 2: Engaging│ │📄 Illustrative│ │
│  │                     │ │                  │ │  Examples     │ │
│  │                     │ ├──────────────────┤ └───────────────┘ │
│  │                     │ │ Most Recent News │                   │
│  │                     │ │    View All →    │                   │
│  │                     │ │ • PSAB Announces │                   │
│  │                     │ │   New Public...  │                   │
│  │                     │ │ • Impl Guide for │                   │
│  │                     │ │   PS 3450...     │                   │
│  │                     │ │ • PSAB Board     │                   │
│  │                     │ │   Meeting - May  │                   │
│  └─────────────────────┘ └──────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 3-column — section nav sidebar | main content | right sidebar

**Left sidebar — Section nav:**
- Overview (active), Consultations, Projects & Initiatives, Resources, Meetings & Decision Summaries, Committees, Volunteer

**Main content:**
- **Active Projects** section with "View All →" + `All Standards` filter dropdown
- Project cards showing: standard group label, title, badges, description, stage indicator, action buttons
- Wireframe shows 4 projects: 2024-2025 Annual Improvements (Stage 3), Employee Benefits (Stage 4), Intangible Assets (Stage 3), IPSAS Convergence Initiative (Stage 2)
- **Most Recent News** section with "View All →" — 4 news items with date + title + excerpt + "Read More →":
  1. June 15, 2025 — PSAB Announces New Public Consultation Period
  2. June 8, 2025 — Implementation Guide for PS 3450 Now Available
  3. May 30, 2025 — PSAB Board Meeting Summary - May 2025
  4. May 22, 2025 — New Effective Dates for Asset Retirement Obligations

**Right sidebar:**
- **Quick Actions:** CPA Canada Handbook, View Implementation Tools, Explore Webinars
- **Upcoming Events** (with "View All" link) — 3 items with date + title + type badge:
  1. June 10, 2025 — Introduction to PS 3450 Webinar — `Webinar` `Sign Up`
  2. June 15, 2025 — Board Meeting - Q2 Standards Review — `Meeting`
  3. June 30, 2025 — Public Consultation Deadline — `Deadline`
- **Resources:** Document links with file type icons — Basis for Conclusions, Implementation Guide, Illustrative Examples

---

## 11. Mobile Menu

**Figma Frames:** `Mobile Menu Collapse` (390px) + `Mobile Menu Expand` (390 x 1942)

### 11.1 Collapsed (Default)

```
┌────────────────────────────────┐
│ FRAS Canada          X (close)│
│ 🔍 [Search...]                │
│                    FR  Sign In │
│                               │
│ Active Projects            ▸  │
│ Open Consultations            │
│ News                          │
│ About Us                   ▸  │
│ Boards                     ▸  │
│ Contact                       │
│ Newsletter                    │
│ Volunteer                     │
└────────────────────────────────┘
```

### 11.2 Expanded (with sub-menus)

```
┌────────────────────────────────┐
│ FRAS Canada          X (close)│
│ 🔍 [Search...]                │
│                    FR  Sign In │
│                               │
│ Active Projects            ▾  │
│   Canadian Sustainability     │
│     Standards Board           │
│   Accounting Standards Board  │
│   Public Sector Accounting Bd │
│   Auditing and Assurance      │
│     Standards Board           │
│ Open Consultations            │
│ News                          │
│ About Us                   ▾  │
│   About FRAS Canada           │
│   Oversight Council           │
│   Research Program            │
│   Jobs                        │
│ Boards                     ▾  │
│   CSSB                        │
│     Overview                  │
│     Consultations             │
│     Projects & Initiatives    │
│     Resources                 │
│     Meetings & Decision Sum.  │
│     Committees                │
│     Volunteer                 │
│   AcSB                        │
│     (same sub-nav)            │
│   PSAB                        │
│     (same sub-nav)            │
│   AASB                        │
│     (same sub-nav)            │
│ Contact                       │
│ Newsletter                    │
│ Volunteer                     │
└────────────────────────────────┘
```

**Key behaviors:**
- Full-screen overlay on mobile
- Close button (X) top right
- Search input at top
- Language toggle (FR) + Sign In
- Expandable sections with chevron toggle for: Active Projects, About Us, Boards
- Boards sub-menu has nested navigation matching Board Detail page sidebar

---

## 12. Component Inventory

### Shared/Reusable Components

| Component | Used In | Description |
|---|---|---|
| `<SiteHeader />` | All pages | Top nav with utility bar, logo, search, primary nav |
| `<SiteFooter />` | All pages | Footer with columns, newsletter CTA, copyright |
| `<MobileMenu />` | All pages (mobile) | Full-screen mobile navigation overlay |
| `<SearchModal />` | Triggered from header | Overlay search with recent/popular tags |
| `<SearchBar />` | Homepage hero, Search Results, header | Search input with button |
| `<Breadcrumb />` | All inner pages | Path navigation (Home / Section / Page) |
| `<PageHeader />` | Inner pages | Icon + title pattern with board context |
| `<FilterSidebar />` | Search Results | Collapsible filter accordion |
| `<SearchResultCard />` | Search Results | Content type badge + title + description + CTA |
| `<ProjectCard />` | Active Projects, Boards | Project title + badges + stage + CTAs |
| `<ConsultationCard />` | Open Consultations | Consultation with deadline countdown |
| `<ProjectTimeline />` | Project Detail | Configurable vertical stepper (up to 7 stages) |
| `<SectionNav />` | Project Detail, Boards | Left sidebar tab navigation |
| `<QuickActions />` | Board Detail | Button group in right sidebar |
| `<UpcomingEvents />` | Board Detail, Project Detail | Date + title + badge list |
| `<ResourcesList />` | Board Detail, Project Detail | File links with icons |
| `<RecentNews />` | Board Detail, Project Detail, Homepage | News items with date + title |
| `<NewsEventsGrid />` | Homepage | 3-column Top News / Exposure Drafts / Events |
| `<BrowseByStandard />` | Homepage | 4-column standard category cards |
| `<NewsletterCTA />` | Homepage, Footer | Email input + subscribe |
| `<TagChip />` | Search Modal, Search Results | Pill/chip for search tags |
| `<ContentTypeBadge />` | Search Results, Active Projects | Colored label badge |
| `<Pagination />` | Search Results | Page number navigation |

### Design Tokens (from wireframes)

| Token | Value | Notes |
|---|---|---|
| Desktop width | 1440px | Main content area |
| Mobile width | 390px | Mobile breakpoint |
| Font family | Inter | Used throughout wireframes |
| Primary button | Dark/black fill, white text | Search, Subscribe, Submit |
| Secondary button | White fill, dark border | Cancel, outline CTAs |
| Ghost button | Text + arrow, no border | "Get Started →", "View All →" |
| Section background | Light gray/blue tint | News & Events section, filter area |
| Card style | White background, subtle border | Content cards throughout |

---

## 13. Payload CMS Collection Mapping

Based on the wireframe content, here are the recommended Payload CMS collections:

### Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `pages` | Static pages (About, etc.) | title, slug, content (richText), layout (blocks) |
| `boards` | Standards boards (AcSB, PSAB, AASB, CSSB, RASOC) | name, slug, icon, description, quickActions, resources |
| `standards` | Individual standards under boards | name, slug, board (relationship), category |
| `projects` | Active projects | title, slug, board, standard, summary (richText), keyProposals, timeline (array of stages), contacts, status |
| `consultations` | Open consultations | title, slug, board, standard, type (enum), deadline, description, documents (array), commentsDueDate |
| `news` | News articles | title, slug, date, board, description, content (richText), type |
| `events` | Events and meetings | title, date, time, timezone, type (enum: webinar/meeting/deadline), board, registrationUrl |
| `documents` | Uploaded documents (EDs, guides, etc.) | title, file (upload), type, board, standard, fileSize |
| `decision-summaries` | Board meeting decision summaries | title, date, board, content (richText) |
| `contacts` | Project team contacts | name, role, email, phone, photo |

### Globals

| Global | Purpose | Key Fields |
|---|---|---|
| `navigation` | Site-wide nav config | utilityLinks, primaryNav (with nested children), mobileMenu |
| `footer` | Footer config | columns (array), newsletterHeading, newsletterDescription, copyrightText, legalLinks |
| `homepage` | Homepage content | heroTitle, heroDescription, searchPlaceholder, newToFras (heading, description, ctaLabel, ctaUrl), browseByStandard (array) |
| `search-config` | Search settings | recentSearches, popularSearches, filterCategories |

---

## Mobile Wireframe Summary

All mobile wireframes follow a consistent 390px width and adapt the desktop layouts:

| Mobile Frame | Desktop Equivalent | Key Adaptations |
|---|---|---|
| `Homepage Mobile` | Homepage | Stacked sections, single-column cards |
| `Search Modal Mobile` | Search Modal | Full-screen, stacked tags |
| `Search Filters Mobile` | Search Filters | Accordion-based collapsible filters |
| `Search Results Mobile` | Search Results | Stacked cards, filters in drawer/modal |
| `Project Mobile` | Project | Stacked 3-column → single column, sticky CTAs |
| `Active Projects Mobile` | Active Projects | Board nav becomes dropdown, stacked project cards |
| `Open Consultations Mobile` | Open Consultations | Single column, stacked filter dropdowns |
| `Frame` (Board Detail Mobile) | Boards | Section nav becomes dropdown, Quick Actions inline, 3-col → single column, stacked project cards + news + events |
| `Mobile Menu Collapse` | N/A | Mobile-only collapsed navigation |
| `Mobile Menu Expand` | N/A | Mobile-only expanded navigation with sub-menus |
