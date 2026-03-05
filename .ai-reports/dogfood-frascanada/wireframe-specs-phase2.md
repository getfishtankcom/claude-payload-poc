# FRAS Canada — Phase 2 Wireframe Specifications (Gap Templates)

> **Date:** 2026-03-04
> **Source:** Derived from live site discovery + verification of frascanada.ca
> **Purpose:** ASCII wireframe specs for 13 page templates not covered in Figma deliverables. These supplement the Figma-based `wireframe-specs.md` (which covers Homepage, Search, Project Detail, Active Projects Listing, Open Consultations Listing, Board Detail, and Global Components).
> **Templates Covered:** T3, T4, T5, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17
> **Reference Format:** `.ai-reports/wireframe-specs.md`

---

## Table of Contents

1. [Template 3: Content Page + Right Sidebar](#template-3-content-page--right-sidebar)
   - [3A: Staff Contact Sidebar Variant](#3a-staff-contact-sidebar-variant)
   - [3B: Section Nav Sidebar Variant](#3b-section-nav-sidebar-variant)
2. [Template 4: People Listing (Members)](#template-4-people-listing-members)
3. [Template 5: Standards Overview (Tabbed)](#template-5-standards-overview-tabbed)
4. [Template 8: Documents for Comment Listing](#template-8-documents-for-comment-listing)
5. [Template 9: Document Detail (Exposure Draft)](#template-9-document-detail-exposure-draft)
6. [Template 10: Effective Dates Table](#template-10-effective-dates-table)
7. [Template 11: Resources Listing](#template-11-resources-listing)
8. [Template 12: Filtered News/Event Listing](#template-12-filtered-newsevent-listing)
9. [Template 13: Meetings & Events Listing](#template-13-meetings--events-listing)
10. [Template 14: Committee Index / Directory](#template-14-committee-index--directory)
11. [Template 15: Contact / Form Page](#template-15-contact--form-page)
12. [Template 16: Authentication Page](#template-16-authentication-page)
13. [Template 17: Simple Content / Empty State](#template-17-simple-content--empty-state)
14. [Consolidated Component Inventory](#consolidated-component-inventory)
15. [Combined CMS Collection Summary](#combined-cms-collection-summary)

---

## Template 3: Content Page + Right Sidebar

**URL Pattern:** `/en/about`, `/en/acsb/about`, `/en/research-program`, `/en/acsb/about/due-process`, etc.
**Page Count:** ~50+ pages
**Layout:** ~70% main content / ~30% right sidebar

**Variants:**
- **3A — Staff Contact Sidebar:** Used on Research Program, project details, document details
- **3B — Section Nav Sidebar:** Used on About pages, Committees, Members sections

---

### 3A: Staff Contact Sidebar Variant

**Used by:** Research Program, project detail pages, document detail pages
**Example URLs:** `/en/research-program`, `/en/acsb/projects/...`

#### Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header — see Global Components]                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  Home / About / Research Program                              (breadcrumbs)  │
├──────────────────────────────────────────────────────────────────────────────┤
│  [About ▾] [Research Program] [Oversight Council] [Jobs]    (section tabs)   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────┐  ┌──────────────────────────┐ │
│  │                                           │  │                          │ │
│  │  Research Program                   (H1)  │  │  Staff Contact(s)  (H2) │ │
│  │                                           │  │  ─────────────────────── │ │
│  │  The FRAS Canada Research Program         │  │                          │ │
│  │  commissions research to support          │  │  **Andrew White,         │ │
│  │  standard-setting activities. Research    │  │    CPA, CA**             │ │
│  │  projects help boards make informed       │  │  Associate Director,     │ │
│  │  decisions by providing evidence-based    │  │  Accounting Standards    │ │
│  │  analysis...                              │  │  Board                   │ │
│  │                                           │  │                          │ │
│  │  [Rich text content continues —           │  │  📞 +1 416 204 3487     │ │
│  │   paragraphs, headings (H2/H3),          │  │  ✉  awhite@acsbcanada.ca│ │
│  │   bullet lists, tables, inline links,     │  │                          │ │
│  │   embedded PDFs, etc.]                    │  │  ─────────────────────── │ │
│  │                                           │  │                          │ │
│  │                                           │  │  **Jane Doe, CPA**       │ │
│  │                                           │  │  Director, Research      │ │
│  │                                           │  │  Program                 │ │
│  │                                           │  │                          │ │
│  │                                           │  │  📞 +1 416 204 3500     │ │
│  │                                           │  │  ✉  jdoe@acsbcanada.ca  │ │
│  │                                           │  └──────────────────────────┘ │
│  │                                           │                               │
│  │  ┌─────────────────────────────────────┐  │  (sidebar is sticky or        │
│  │  │  Submit your research        (CTA)  │  │   ends after contacts)        │
│  │  │                                     │  │                               │
│  │  │  Have research that could support   │  │                               │
│  │  │  standard-setting? Submit a         │  │                               │
│  │  │  proposal for consideration.        │  │                               │
│  │  │                                     │  │                               │
│  │  │  [Submit a Research Proposal →]     │  │                               │
│  │  └─────────────────────────────────────┘  │                               │
│  │       (dark purple background, white text) │                               │
│  │                                           │                               │
│  │  News                               (H2) │                               │
│  │  ┌───────────────────────────────────┐    │                               │
│  │  │ Mar 1, 2026   Research update...  │    │                               │
│  │  │ Feb 15, 2026  New project funded  │    │                               │
│  │  │ Jan 20, 2026  Call for proposals  │    │                               │
│  │  └───────────────────────────────────┘    │                               │
│  │                                           │                               │
│  └───────────────────────────────────────────┘                               │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer — see Global Components]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Layout (390px)

```
┌──────────────────────────────┐
│  [Header — mobile]           │
├──────────────────────────────┤
│  Home / About / Research...  │
├──────────────────────────────┤
│  [About ▾] [Research...]     │
│  (horizontal scroll tabs)    │
├──────────────────────────────┤
│                              │
│  Research Program      (H1)  │
│                              │
│  The FRAS Canada Research    │
│  Program commissions         │
│  research to support...      │
│                              │
│  [Rich text content —        │
│   full width, stacked]       │
│                              │
│  ┌──────────────────────────┐│
│  │  Submit your research    ││
│  │  (dark purple CTA)       ││
│  │  [Submit a Research      ││
│  │   Proposal →]            ││
│  └──────────────────────────┘│
│                              │
│  News                  (H2)  │
│  • Mar 1, 2026 ...          │
│  • Feb 15, 2026 ...         │
│                              │
│  ──────────────────────────  │
│                              │
│  Staff Contact(s)      (H2)  │
│  **Andrew White, CPA, CA**   │
│  Associate Director, AcSB    │
│  📞 +1 416 204 3487         │
│  ✉  awhite@acsbcanada.ca   │
│                              │
│  **Jane Doe, CPA**           │
│  Director, Research Program  │
│  📞 +1 416 204 3500         │
│  ✉  jdoe@acsbcanada.ca     │
│                              │
├──────────────────────────────┤
│  [Footer — mobile]           │
└──────────────────────────────┘
```

#### Component Breakdown — Variant 3A

| Component | Element | Type | Required | Notes |
|-----------|---------|------|----------|-------|
| **Breadcrumbs** | Trail | Array of {label, href} | Yes | Separator: ` / ` — last item is current page (no link) |
| **Section Tabs** | Tabs | Array of {label, href, isActive} | Yes | Up to 7 tabs; active tab has bottom border highlight |
| **Page Title** | H1 | String | Yes | Plain text, no icon |
| **Rich Text Body** | Content | Rich Text (HTML) | Yes | Supports H2, H3, p, ul, ol, table, a, img, embed |
| **Staff Contact Card** | Heading | String | Yes | Always "Staff Contact(s)" — purple H2, `color: rgb(96, 31, 91)` |
| | Name | String | Yes | Bold, may include credentials e.g. "Andrew White, CPA, CA" |
| | Title | String | Yes | Job title / role description |
| | Phone | String (tel link) | Yes | Format: `+1 416 204 3487`, phone icon prefix |
| | Email | String (mailto link) | Yes | Email address, mail icon prefix |
| **Submit Research CTA** | Heading | String | No | Dark purple background block (Research Program only) |
| | Description | String | No | Supporting paragraph |
| | Button | {label, href} | No | Arrow suffix, white text on purple |
| **News Section** | Heading | String | No | "News" H2 (Research Program only) |
| | Items | Array of {date, title, href} | No | 3 most recent, date + linked title |

#### Interaction Notes — Variant 3A

| Interaction | Behavior |
|-------------|----------|
| **Section tabs hover** | Underline + subtle color shift on non-active tabs |
| **Section tabs click** | Navigate to corresponding section page |
| **Breadcrumb links** | Navigate to parent page; last breadcrumb item is plain text |
| **Staff Contact phone** | Opens `tel:` link on mobile, displays number on desktop |
| **Staff Contact email** | Opens `mailto:` link |
| **Submit Research CTA** | Navigates to research submission page |
| **News item click** | Navigates to full news article |
| **Responsive: sidebar** | Sidebar drops below main content on mobile, full width |
| **Responsive: tabs** | Horizontal scroll with overflow on narrow screens |

---

### 3B: Section Nav Sidebar Variant

**Used by:** About pages, Committees, Members (section-level navigation)
**Example URLs:** `/en/acsb/about`, `/en/psab/committees`, `/en/acsb/about/due-process`

#### Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header — see Global Components]                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  Home / AcSB / About                                          (breadcrumbs)  │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Overview] [About] [Consultations] [Projects] [Resources]  (section tabs)   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────┐  ┌──────────────────────────┐ │
│  │                                           │  │                          │ │
│  │  About the Accounting                     │  │  About                   │ │
│  │  Standards Board                    (H1)  │  │  ─────────────────────   │ │
│  │                                           │  │  **Due Process**         │ │
│  │  The Accounting Standards Board           │  │  International           │ │
│  │  (AcSB) is an independent body           │  │    Activities             │ │
│  │  responsible for establishing             │  │  IRCSS                   │ │
│  │  accounting standards for private         │  │    Recommendations       │ │
│  │  enterprises, not-for-profit              │  │                          │ │
│  │  organizations, and pension plans         │  │                          │ │
│  │  in Canada...                             │  │                          │ │
│  │                                           │  │                          │ │
│  │  [Rich text content continues —           │  │                          │ │
│  │   paragraphs, headings, lists,            │  │                          │ │
│  │   embedded media, etc.]                   │  │                          │ │
│  │                                           │  │                          │ │
│  │                                           │  │                          │ │
│  │                                           │  │                          │ │
│  └───────────────────────────────────────────┘  └──────────────────────────┘ │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer — see Global Components]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Section Nav Sidebar Detail:**

```
┌──────────────────────────┐
│                          │
│  About                   │  ← plain gray text, no heading tag
│  ───────────────────     │
│  Due Process             │  ← plain gray text links
│  International           │
│    Activities             │
│  IRCSS                   │
│    Recommendations       │
│                          │
└──────────────────────────┘

Active state (when on Due Process page):

┌──────────────────────────┐
│                          │
│  About                   │
│  ───────────────────     │
│  **Due Process**         │  ← bold + underline = active
│  International           │
│    Activities             │
│  IRCSS                   │
│    Recommendations       │
│                          │
└──────────────────────────┘
```

#### Mobile Layout (390px)

```
┌──────────────────────────────┐
│  [Header — mobile]           │
├──────────────────────────────┤
│  Home / AcSB / About        │
├──────────────────────────────┤
│  [Overview] [About] [...]    │
│  (horizontal scroll tabs)    │
├──────────────────────────────┤
│                              │
│  About the Accounting        │
│  Standards Board       (H1)  │
│                              │
│  The Accounting Standards    │
│  Board (AcSB) is an         │
│  independent body...         │
│                              │
│  [Rich text content —        │
│   full width, stacked]       │
│                              │
│  ──────────────────────────  │
│                              │
│  About                       │
│  ───────────────────         │
│  **Due Process**             │
│  International Activities    │
│  IRCSS Recommendations       │
│                              │
├──────────────────────────────┤
│  [Footer — mobile]           │
└──────────────────────────────┘
```

#### Component Breakdown — Variant 3B

| Component | Element | Type | Required | Notes |
|-----------|---------|------|----------|-------|
| **Breadcrumbs** | Trail | Array of {label, href} | Yes | Same as 3A |
| **Section Tabs** | Tabs | Array of {label, href, isActive} | Yes | Same as 3A |
| **Page Title** | H1 | String | Yes | Plain text |
| **Rich Text Body** | Content | Rich Text (HTML) | Yes | Same capabilities as 3A |
| **Section Nav Sidebar** | Links | Array of {label, href, isActive} | Yes | 4–8 links, vertical list |
| | Active indicator | Boolean per link | Yes | Active = bold + underline |
| | Section label | String | No | Gray text above divider, no heading tag |

#### Interaction Notes — Variant 3B

| Interaction | Behavior |
|-------------|----------|
| **Section nav link hover** | Underline appears on non-active links |
| **Section nav link click** | Navigate to sibling page; new page highlights active link |
| **Active link styling** | Bold text + underline — no color change, stays gray |
| **Responsive: sidebar** | Drops below main content on mobile; renders as vertical link list |
| **No heading label** | Section nav has no "Navigation" or "In this section" heading — just plain links under a thin divider |

---

## Template 4: People Listing (Members)

**URL Pattern:** `/en/acsb/about/members`, `/en/psab/about/members`, `/en/cssb/about/members`, etc.
**Page Count:** ~5 pages (one per board)
**Layout:** ~70% main (2-column card grid) + ~30% section nav sidebar

### Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header — see Global Components]                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  Home / AcSB / About / Members                                (breadcrumbs)  │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Overview] [About] [Consultations] [Projects] [Resources]  (section tabs)   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────┐  ┌──────────────────────────┐ │
│  │                                           │  │                          │ │
│  │  Members                            (H1)  │  │  About                   │ │
│  │                                           │  │  ─────────────────────   │ │
│  │  CHAIR                                    │  │  About                   │ │
│  │  ─────────────────────────────────────    │  │  Due Process             │ │
│  │  ┌────────────────┐  ┌────────────────┐   │  │  International           │ │
│  │  │ ┌────────────┐ │  │                │   │  │    Activities             │ │
│  │  │ │            │ │  │  (empty if     │   │  │  **Members**             │ │
│  │  │ │   Photo    │ │  │   only one     │   │  │  IRCSS                   │ │
│  │  │ │  205×205   │ │  │   chair)       │   │  │    Recommendations       │ │
│  │  │ │            │ │  │                │   │  │                          │ │
│  │  │ └────────────┘ │  │                │   │  │                          │ │
│  │  │ John Smith     │  │                │   │  │                          │ │
│  │  │ FCPA, FCA      │  │                │   │  │                          │ │
│  │  │ CHAIR          │  │                │   │  │                          │ │
│  │  │ Appointed:     │  │                │   │  │                          │ │
│  │  │ Jan 1, 2023    │  │                │   │  │                          │ │
│  │  │ Term Expires:  │  │                │   │  │                          │ │
│  │  │ Dec 31, 2025   │  │                │   │  │                          │ │
│  │  └────────────────┘  └────────────────┘   │  │                          │ │
│  │                                           │  │                          │ │
│  │  VICE-CHAIR                               │  │                          │ │
│  │  ─────────────────────────────────────    │  │                          │ │
│  │  ┌────────────────┐                       │  │                          │ │
│  │  │ ┌────────────┐ │                       │  │                          │ │
│  │  │ │   Photo    │ │                       │  │                          │ │
│  │  │ │  205×205   │ │                       │  │                          │ │
│  │  │ └────────────┘ │                       │  │                          │ │
│  │  │ Maria Garcia   │                       │  │                          │ │
│  │  │ CPA, CA        │                       │  │                          │ │
│  │  │ VICE-CHAIR     │                       │  │                          │ │
│  │  │ Appointed:     │                       │  │                          │ │
│  │  │ Jul 1, 2024    │                       │  │                          │ │
│  │  │ Term Expires:  │                       │  │                          │ │
│  │  │ Jun 30, 2027   │                       │  │                          │ │
│  │  └────────────────┘                       │  │                          │ │
│  │                                           │  │                          │ │
│  │  VOTING MEMBERS                           │  │                          │ │
│  │  ─────────────────────────────────────    │  │                          │ │
│  │  ┌────────────────┐  ┌────────────────┐   │  │                          │ │
│  │  │ ┌────────────┐ │  │ ┌────────────┐ │   │  │                          │ │
│  │  │ │   Photo    │ │  │ │   Photo    │ │   │  │                          │ │
│  │  │ │  205×205   │ │  │ │  205×205   │ │   │  │                          │ │
│  │  │ └────────────┘ │  │ └────────────┘ │   │  │                          │ │
│  │  │ Alice Chen     │  │ Bob Williams   │   │  │                          │ │
│  │  │ FCPA, FCA,     │  │ CPA(MI)        │   │  │                          │ │
│  │  │ CPA(MI)        │  │                │   │  │                          │ │
│  │  │ Appointed:     │  │ Appointed:     │   │  │                          │ │
│  │  │ Jan 1, 2024    │  │ Jan 1, 2023    │   │  │                          │ │
│  │  │ Term Expires:  │  │ Term Expires:  │   │  │                          │ │
│  │  │ Dec 31, 2026   │  │ Dec 31, 2025   │   │  │                          │ │
│  │  └────────────────┘  └────────────────┘   │  │                          │ │
│  │                                           │  │                          │ │
│  │  ┌────────────────┐  ┌────────────────┐   │  └──────────────────────────┘ │
│  │  │ ┌────────────┐ │  │ ┌────────────┐ │   │                               │
│  │  │ │   Photo    │ │  │ │   Photo    │ │   │                               │
│  │  │ │  205×205   │ │  │ │  205×205   │ │   │                               │
│  │  │ └────────────┘ │  │ └────────────┘ │   │                               │
│  │  │ David Park     │  │ Emily Tremblay │   │                               │
│  │  │ CPA, CA        │  │ FCPA, FCGA     │   │                               │
│  │  │ Appointed:     │  │ Appointed:     │   │                               │
│  │  │ Jul 1, 2024    │  │ Jul 1, 2023    │   │                               │
│  │  │ Term Expires:  │  │ Term Expires:  │   │                               │
│  │  │ Jun 30, 2027   │  │ Jun 30, 2026   │   │                               │
│  │  └────────────────┘  └────────────────┘   │                               │
│  │                                           │                               │
│  │  (more member cards...)                   │                               │
│  │                                           │                               │
│  └───────────────────────────────────────────┘                               │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer — see Global Components]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Member Card Detail

```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │                  │  │
│  │   Portrait       │  │
│  │   Photo          │  │
│  │   205 × 205px    │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  Alice Chen            │  ← purple link to bio page
│  FCPA, FCA, CPA(MI)   │  ← gray credentials text
│  CHAIR                 │  ← uppercase bold role label (if officer)
│                        │
│  Appointed:            │
│  January 1, 2024       │
│  Term Expires:         │
│  December 31, 2026     │
│                        │
└────────────────────────┘
```

### Mobile Layout (390px)

```
┌──────────────────────────────┐
│  [Header — mobile]           │
├──────────────────────────────┤
│  Home / AcSB / About /      │
│  Members                     │
├──────────────────────────────┤
│  [Overview] [About] [...]    │
│  (horizontal scroll tabs)    │
├──────────────────────────────┤
│                              │
│  Members                (H1) │
│                              │
│  CHAIR                       │
│  ────────────────────────    │
│  ┌──────────────────────────┐│
│  │ ┌────────────────────┐   ││
│  │ │     Photo          │   ││
│  │ │     205×205        │   ││
│  │ └────────────────────┘   ││
│  │ John Smith               ││
│  │ FCPA, FCA                ││
│  │ CHAIR                    ││
│  │ Appointed: Jan 1, 2023   ││
│  │ Term Expires:            ││
│  │ Dec 31, 2025             ││
│  └──────────────────────────┘│
│                              │
│  VOTING MEMBERS              │
│  ────────────────────────    │
│  ┌──────────────────────────┐│
│  │ [Member Card]            ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ [Member Card]            ││
│  └──────────────────────────┘│
│  (cards stack single column) │
│                              │
│  ──────────────────────────  │
│                              │
│  About                       │
│  ───────────────────         │
│  About                       │
│  Due Process                 │
│  International Activities    │
│  **Members**                 │
│  IRCSS Recommendations       │
│                              │
├──────────────────────────────┤
│  [Footer — mobile]           │
└──────────────────────────────┘
```

### Component Breakdown — Template 4

| Component | Element | Type | Required | Notes |
|-----------|---------|------|----------|-------|
| **Breadcrumbs** | Trail | Array of {label, href} | Yes | Same pattern as Template 3 |
| **Section Tabs** | Tabs | Array of {label, href, isActive} | Yes | Board-level navigation tabs |
| **Page Title** | H1 | String | Yes | Always "Members" |
| **Section Label** | Heading | String | No | Uppercase gray text: "CHAIR", "VICE-CHAIR", "VOTING MEMBERS" — groups cards |
| **Member Card** | Photo | Image (205x205px) | Yes | Square portrait headshot, consistent sizing |
| | Name | String (link) | Yes | Purple link navigating to member bio page |
| | Credentials | String | No | Comma-separated designations, gray text |
| | Role Label | String | No | Uppercase bold: "CHAIR", "VICE-CHAIR" — officers only |
| | Appointed Date | Date | Yes | Format: "January 1, 2023" |
| | Term Expires | Date | Yes | Format: "December 31, 2025" |
| **Section Nav Sidebar** | Links | Array of {label, href, isActive} | Yes | Same as Template 3B sidebar |

### Interaction Notes — Template 4

| Interaction | Behavior |
|-------------|----------|
| **Member name hover** | Underline on purple link text |
| **Member name click** | Navigate to individual bio page |
| **Photo hover** | No effect (photo is not clickable) |
| **Card grid responsive** | 2-column on desktop (in 70% main area) → 1-column stack on mobile |
| **Section labels** | Act as visual dividers grouping cards — not clickable |
| **Section nav sidebar** | Same behavior as Template 3B — drops below cards on mobile |
| **Card ordering** | Officers first (Chair, Vice-Chair), then alphabetical within Voting Members |

---

## Template 5: Standards Overview (Tabbed)

**URL Pattern:** `/en/ifrsstandards`, `/en/aspe`, `/en/sustainability`, `/en/csqm`, etc.
**Page Count:** 11 standards sections
**Layout:** Full-width with section tab navigation

### Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header — see Global Components]                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │     [Board Logo — e.g. AcSB crest/wordmark]                             ││
│  │                                                                          ││
│  │     Accounting Standards Board                                           ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                    (hero)    │
├──────────────────────────────────────────────────────────────────────────────┤
│  Home / AcSB / IFRS Standards                                  (breadcrumbs)│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  IFRS® Accounting Standards                                          (H1)   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Overview] [Project Listing] [Documents for Comment] [Effective Dates]      │
│  [Resources] [IFRIC Agenda Decisions]                          (5-6 tabs)    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Active Projects                                                       (H2) │
│  ────────────────────────────────────────────────────────────────────────    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ Project Name                      │ Description                         ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ IFRS 18 Presentation and          │ Replacing IAS 1 with a new          ││
│  │ Disclosure in Financial           │ standard on presentation and        ││
│  │ Statements                        │ disclosure requirements for         ││
│  │                                   │ financial statements.               ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ Amendments to IFRS 9 —            │ Proposed amendments addressing      ││
│  │ Financial Instruments             │ classification and measurement      ││
│  │                                   │ of financial assets with ESG        ││
│  │                                   │ features.                           ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ Annual Improvements to            │ Narrow-scope amendments and         ││
│  │ IFRS Accounting Standards         │ editorial corrections across        ││
│  │ — Volume 12                       │ multiple standards.                 ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ (more rows...)                    │                                     ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐       ││
│  │  │                             │  │                             │       ││
│  │  │  CPA Canada Handbook        │  │  Submit an Issue            │       ││
│  │  │                             │  │                             │       ││
│  │  │  Access the authoritative   │  │  Have an issue or question  │       ││
│  │  │  source for Canadian        │  │  related to IFRS Standards? │       ││
│  │  │  accounting, auditing, and  │  │  Submit it for the AcSB's  │       ││
│  │  │  assurance standards.       │  │  consideration.             │       ││
│  │  │                             │  │                             │       ││
│  │  │  [Access Handbook →]        │  │  [Submit an Issue →]        │       ││
│  │  │                             │  │                             │       ││
│  │  └─────────────────────────────┘  └─────────────────────────────┘       ││
│  │       (light gray card)                (dark purple card)                ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                              (feature CTAs)  │
│                                                                              │
│  News                                                                  (H2) │
│  ────────────────────────────────────────────────────────────────────────    │
│  ┌──────────────────┬──────────────────┬──────────────────┐                  │
│  │ Mar 1, 2026      │ Feb 15, 2026     │ Jan 20, 2026     │                  │
│  │                  │                  │                  │                  │
│  │ AcSB Publishes   │ IFRS 18 Early    │ Update on        │                  │
│  │ Guidance on      │ Adoption         │ Annual           │                  │
│  │ IFRS 18 Trans... │ Resources Now... │ Improvements...  │                  │
│  │                  │                  │                  │                  │
│  │ [Read More →]    │ [Read More →]    │ [Read More →]    │                  │
│  └──────────────────┴──────────────────┴──────────────────┘                  │
│                                                           (3-column cards)   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer — see Global Components]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (390px)

```
┌──────────────────────────────┐
│  [Header — mobile]           │
├──────────────────────────────┤
│  ┌──────────────────────────┐│
│  │  [Board Logo]            ││
│  │  Accounting Standards    ││
│  │  Board                   ││
│  └──────────────────────────┘│
├──────────────────────────────┤
│  Home / AcSB / IFRS...      │
├──────────────────────────────┤
│  IFRS® Accounting      (H1) │
│  Standards                   │
├──────────────────────────────┤
│  [Overview] [Project...]     │
│  (horizontal scroll tabs)    │
├──────────────────────────────┤
│                              │
│  Active Projects       (H2)  │
│  ────────────────────────    │
│                              │
│  ┌──────────────────────────┐│
│  │ IFRS 18 Presentation     ││
│  │ and Disclosure in         ││
│  │ Financial Statements      ││
│  │                           ││
│  │ Replacing IAS 1 with a   ││
│  │ new standard on...        ││
│  ├──────────────────────────┤│
│  │ Amendments to IFRS 9 —   ││
│  │ Financial Instruments     ││
│  │                           ││
│  │ Proposed amendments       ││
│  │ addressing...             ││
│  └──────────────────────────┘│
│   (table becomes stacked     │
│    card list on mobile)      │
│                              │
│  ┌──────────────────────────┐│
│  │ CPA Canada Handbook      ││
│  │ Access the authoritative  ││
│  │ source for...             ││
│  │ [Access Handbook →]       ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Submit an Issue           ││
│  │ Have an issue or          ││
│  │ question related to...    ││
│  │ [Submit an Issue →]       ││
│  └──────────────────────────┘│
│   (CTAs stack vertically)    │
│                              │
│  News                  (H2)  │
│  ────────────────────────    │
│  ┌──────────────────────────┐│
│  │ Mar 1, 2026              ││
│  │ AcSB Publishes Guidance  ││
│  │ on IFRS 18 Trans...      ││
│  │ [Read More →]            ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Feb 15, 2026             ││
│  │ IFRS 18 Early Adoption   ││
│  │ Resources Now...         ││
│  │ [Read More →]            ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Jan 20, 2026             ││
│  │ Update on Annual         ││
│  │ Improvements...          ││
│  │ [Read More →]            ││
│  └──────────────────────────┘│
│   (news cards stack 1-col)   │
│                              │
├──────────────────────────────┤
│  [Footer — mobile]           │
└──────────────────────────────┘
```

### Tab Variants — Template 5

Most standards sections use 5 tabs. IFRS Standards adds a 6th:

| Standard Section | Tab 1 | Tab 2 | Tab 3 | Tab 4 | Tab 5 | Tab 6 |
|-----------------|-------|-------|-------|-------|-------|-------|
| IFRS Standards | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | IFRIC Agenda Decisions |
| ASPE | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | — |
| Sustainability (CSDS) | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | — |
| CSQM | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | — |
| CAS | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | — |
| (all others) | Overview | Project Listing | Documents for Comment | Effective Dates | Resources | — |

### Component Breakdown — Template 5

| Component | Element | Type | Required | Notes |
|-----------|---------|------|----------|-------|
| **Board Logo Hero** | Logo | Image | Yes | Board crest or wordmark, centered |
| | Board Name | String | Yes | Full board name displayed below logo |
| | Background | Color/Image | Yes | May use board brand color as background |
| **Breadcrumbs** | Trail | Array of {label, href} | Yes | Standard breadcrumb pattern |
| **Section Title** | H1 | String | Yes | Standards area name, e.g. "IFRS® Accounting Standards" |
| **Tab Navigation** | Tabs | Array of {label, href, isActive} | Yes | 5 tabs standard; 6 for IFRS. Active tab = bottom border highlight |
| **Active Projects Table** | Header Row | — | Yes | "Project Name" and "Description" column headers |
| | Rows | Array of ProjectSummary | Yes | Each row: project name (purple link) + 1-2 sentence description |
| | → Project Name | String (link) | Yes | Purple link navigating to project detail page |
| | → Description | String | Yes | Plain text, 1-2 sentences |
| **Feature CTA Block** | Card 1 | {heading, description, buttonLabel, buttonHref, variant} | No | e.g. "CPA Canada Handbook" — light gray background |
| | Card 2 | {heading, description, buttonLabel, buttonHref, variant} | No | e.g. "Submit an Issue" — dark purple background |
| **News Feed** | Heading | String | Yes | "News" H2 |
| | Items | Array of {date, title, excerpt, href} | Yes | 3 most recent items, displayed as cards |
| | → Date | Date | Yes | Format: "Mar 1, 2026" |
| | → Title | String (link) | Yes | Linked heading text |
| | → Excerpt | String | No | Truncated preview text |
| | → CTA | {label, href} | Yes | "Read More →" link |

### Interaction Notes — Template 5

| Interaction | Behavior |
|-------------|----------|
| **Tab hover** | Underline + subtle color shift on non-active tabs |
| **Tab click** | Navigates to tab route (each tab is its own page, not client-side tab switch) |
| **Active tab** | Bottom border highlight (purple/brand color), bold text |
| **Project name hover** | Underline on purple link |
| **Project name click** | Navigate to full project detail page |
| **Table responsive** | 2-column table on desktop → stacked cards on mobile (name above description) |
| **Feature CTA hover** | Subtle lift/shadow effect on card |
| **Feature CTA click** | Navigate to external or internal target |
| **News card hover** | Subtle lift/shadow on card |
| **News card click** | "Read More" navigates to full article |
| **News layout responsive** | 3-column cards → single column stack on mobile |
| **Board logo hero** | Non-interactive, purely decorative/branding |

---

## Template 8: Documents for Comment Listing

**Source:** Live site pattern observed across 11 standards sections
**Route:** `/en/{standard}/documents`
**Layout:** Full-width tabbed listing
**Used by:** 11 standards sections (e.g., `/en/ifrsstandards/documents`, `/en/aspe/documents`, `/en/public-sector/documents`)

### 8.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header / Top Navigation Bar]                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Documents for Comment                                                       │
│                                                                              │
│  ┌──────────────────────────┬───────────────────────────┐                    │
│  │  Open for Comment        │  Closed for Comment       │  ← pill tab toggle │
│  │  (active — filled bg)    │  (inactive — outline)     │                    │
│  └──────────────────────────┴───────────────────────────┘                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ ██  Exposure Drafts  ████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  ED Title: Proposed Amendments to Section 3856                      │    │
│  │  Financial Instruments                              [Submit comment]│    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │  ED Title: Proposed New Standard, Financial                         │    │
│  │  Instruments – Disclosure and Presentation          [Submit comment]│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██  Consultation Papers  ████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  Consultation Paper Title: Reporting Controlled                     │    │
│  │  and Related Entities                               [Submit comment]│    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │  Consultation Paper Title: Another Topic Here                       │    │
│  │                                                     [Submit comment]│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██  Re-exposure Drafts  █████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  Re-ED Title: Revenue — Proposed Amendments         [Submit comment]│    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer]                                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Closed for Comment tab (via `?tab=closed-for-comment`):**

```
│  ┌──────────────────────────┬───────────────────────────┐                    │
│  │  Open for Comment        │  Closed for Comment       │  ← pill tab toggle │
│  │  (inactive — outline)    │  (active — filled bg)     │                    │
│  └──────────────────────────┴───────────────────────────┘                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ ██  Exposure Drafts  ████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  ED Title: Previous Exposure Draft on Topic X                       │    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │  ED Title: Closed Draft on Topic Y                  [View Comments] │    │
│  │                                                     (PDF link)      │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██  Consultation Papers  ████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  Closed Consultation Paper Title                                    │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
```

### 8.2 Mobile Layout (390px)

```
┌──────────────────────────────────┐
│  [Mobile Header]                 │
├──────────────────────────────────┤
│                                  │
│  Documents for Comment           │
│                                  │
│  ┌──────────┬───────────────┐    │
│  │  Open    │  Closed       │    │
│  │  (active)│  (inactive)   │    │
│  └──────────┴───────────────┘    │
│                                  │
│  ██ Exposure Drafts █████████    │
│  ┌──────────────────────────┐    │
│  │ ED Title: Proposed       │    │
│  │ Amendments to Section    │    │
│  │ 3856 Financial           │    │
│  │ Instruments              │    │
│  │                          │    │
│  │ [Submit comment]         │    │
│  ├──────────────────────────┤    │
│  │ ED Title: Proposed New   │    │
│  │ Standard, Financial      │    │
│  │ Instruments – Disclosure │    │
│  │ and Presentation         │    │
│  │                          │    │
│  │ [Submit comment]         │    │
│  └──────────────────────────┘    │
│                                  │
│  ██ Consultation Papers ████     │
│  ┌──────────────────────────┐    │
│  │ Consultation Paper       │    │
│  │ Title: Reporting         │    │
│  │ Controlled and Related   │    │
│  │ Entities                 │    │
│  │                          │    │
│  │ [Submit comment]         │    │
│  └──────────────────────────┘    │
│                                  │
├──────────────────────────────────┤
│  [Footer]                        │
└──────────────────────────────────┘
```

### 8.3 Component Breakdown

**Page Header:**
- H1: "Documents for Comment" — standard page heading pattern
- No breadcrumb observed in live site pattern

**Tab Pills:**
- Two pill-style toggle buttons: "Open for Comment" (default active) and "Closed for Comment"
- Active state: filled background (dark), white text
- Inactive state: outline/ghost, dark text
- Tab switching uses query param: `?tab=closed-for-comment`
- No JavaScript tab switch — full page reload with URL change

**Group Section Header (gray banner):**
- Full-width gray background row (`#F0F0F0` — design token: `bg-group-header`)
- Bold white or dark text heading (e.g., "Exposure Drafts", "Consultation Papers", "Re-exposure Drafts")
- Acts as a visual divider/grouping mechanism — not a semantic `<thead>`

**Document Row:**
- Title text as purple link (`color: rgb(96, 31, 91)` approximate) — links to document detail page
- Alternating white / light gray (`#F8F8F8` — design token: `bg-row-alt`) row backgrounds
- **Open tab rows:** Include "Submit comment" button (dark purple fill, white text) right-aligned
- **Closed tab rows:** Some include "View Comments" as a PDF link; others have no action
- No comment deadline dates shown on the listing page
- Non-semantic table markup (likely `<div>` or `<table>` used for layout, not data semantics)

**Row separator:**
- Dashed or light border between rows within the same group

### 8.4 Interaction Notes

| Behavior | Description |
|----------|-------------|
| **Tab toggle** | Clicking "Closed for Comment" navigates to `?tab=closed-for-comment`; clicking "Open for Comment" returns to default URL (no param). Full page reload, not client-side toggle. |
| **Document title click** | Navigates to document detail page (`/en/{standard}/documents/{slug}`) |
| **Submit comment button** | Navigates to comment submission page or external form (Open tab only) |
| **View Comments link** | Opens PDF file in new tab (Closed tab, select items only) |
| **Hover — document title** | Underline on hover, cursor pointer |
| **Hover — Submit comment button** | Slight darkening of background |
| **Responsive** | On mobile (390px), rows stack with button below title text. Gray section headers span full width. Table-like layout collapses to single-column stacked cards. |
| **Empty state** | When no documents exist for a group, the group header is not rendered |

### 8.5 CMS Data Requirements

**Collection: `document-for-comment`**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | Yes | Document display title |
| `slug` | String (auto) | Yes | URL-safe slug, auto-generated from title |
| `standard` | Relationship → `standards` | Yes | Which standard section this belongs to (e.g., IFRS, ASPE) |
| `board` | Relationship → `boards` | Yes | Parent board (AcSB, PSAB, etc.) |
| `group` | Enum: `exposure-draft`, `consultation-paper`, `re-exposure-draft`, `discussion-paper` | Yes | Determines which gray header group it appears under |
| `status` | Enum: `open`, `closed` | Yes | Controls which tab the document appears in |
| `documentUrl` | URL | No | Link to the actual document (PDF or external) |
| `commentSubmitUrl` | URL | No | "Submit comment" destination (Open status only) |
| `commentsPdfUrl` | URL | No | "View Comments" PDF link (Closed status, optional) |
| `sortOrder` | Number | No | Manual sort within group |
| `publishedDate` | Date | No | For internal tracking / sorting |

**Group heading labels are derived from the `group` enum:**
- `exposure-draft` → "Exposure Drafts"
- `consultation-paper` → "Consultation Papers"
- `re-exposure-draft` → "Re-exposure Drafts"
- `discussion-paper` → "Discussion Papers"

**Query pattern:**
```
// Open tab (default)
documentForComment.find({
  where: { standard: { equals: currentStandard }, status: { equals: 'open' } },
  sort: 'group,sortOrder'
})

// Closed tab
documentForComment.find({
  where: { standard: { equals: currentStandard }, status: { equals: 'closed' } },
  sort: 'group,sortOrder'
})
```

---

## Template 9: Document Detail (Exposure Draft)

**Source:** Live site pattern observed across ~50+ document pages
**Route:** `/en/{standard}/documents/{slug}`
**Layout:** ~70% main content + Staff Contact sidebar
**Used by:** ~50+ document pages across all standards sections

### 9.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header / Top Navigation Bar]                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────┬─────────────────────────┐    │
│  │                ~70% width                   │       ~30% width       │    │
│  │                                             │                        │    │
│  │  Exposure Draft — Proposed Amendments       │  Staff Contact(s)      │    │
│  │  to Section 3856, Financial Instruments     │  ─────────────────     │    │
│  │  ════════════════════════════════════════    │  (purple H2, rgb(96,  │    │
│  │                                             │   31, 91))             │    │
│  │  Highlights                                 │                        │    │
│  │  ──────────                                 │  Andrew White,         │    │
│  │  (bold purple heading)                      │  CPA, CA               │    │
│  │                                             │  (bold name)           │    │
│  │  The Accounting Standards Board (AcSB)      │                        │    │
│  │  has issued this Exposure Draft proposing   │  Associate Director,   │    │
│  │  amendments to Section 3856...              │  Accounting Standards  │    │
│  │                                             │  Board                 │    │
│  │  This Exposure Draft addresses issues       │                        │    │
│  │  identified during the post-implementation  │  📞 +1 416 204 3487   │    │
│  │  review of Section 3856...                  │  ✉  awhite@            │    │
│  │                                             │     acsbcanada.ca      │    │
│  │  ────────────────────────────────────────   │                        │    │
│  │                                             │  ─────────────────     │    │
│  │  IASB Exposure Draft                        │                        │    │
│  │                                             │  (Second contact if    │    │
│  │  The International Accounting Standards     │   applicable, same     │    │
│  │  Board (IASB) published IFRS Exposure       │   card layout)         │    │
│  │  Draft ED/2025/1...                         │                        │    │
│  │  [View IASB Exposure Draft →]               │                        │    │
│  │  (external link)                            │                        │    │
│  │                                             │                        │    │
│  │  ────────────────────────────────────────   │                        │    │
│  │                                             │                        │    │
│  │  Comments Requested                         │                        │    │
│  │                                             │                        │    │
│  │  The AcSB welcomes comments on all         │                        │    │
│  │  aspects of this Exposure Draft. In         │                        │    │
│  │  particular, the AcSB is seeking            │                        │    │
│  │  comments on the following questions:       │                        │    │
│  │                                             │                        │    │
│  │  ┌────────────────────────────────────┐     │                        │    │
│  │  │ Question 1                         │     │                        │    │
│  │  │                                    │     │                        │    │
│  │  │ Do you agree with the proposed     │     │                        │    │
│  │  │ amendments to paragraph 3856.05?   │     │                        │    │
│  │  │ Why or why not?                    │     │                        │    │
│  │  └────────────────────────────────────┘     │                        │    │
│  │  ┌────────────────────────────────────┐     │                        │    │
│  │  │ Question 2                         │     │                        │    │
│  │  │                                    │     │                        │    │
│  │  │ Are there any additional           │     │                        │    │
│  │  │ disclosures that should be         │     │                        │    │
│  │  │ required?                          │     │                        │    │
│  │  └────────────────────────────────────┘     │                        │    │
│  │                                             │                        │    │
│  │  ────────────────────────────────────────   │                        │    │
│  │                                             │                        │    │
│  │  When to Reply                              │                        │    │
│  │                                             │                        │    │
│  │  The comment deadline is                    │                        │    │
│  │  April 20, 2026.                            │                        │    │
│  │  (bold date)                                │                        │    │
│  │                                             │                        │    │
│  │  ════════════════════════════════════════    │                        │    │
│  │                                             │                        │    │
│  │  ┌────────────────────────────────────┐     │                        │    │
│  │  │ ██████████████████████████████████ │     │                        │    │
│  │  │ ██  How to Reply                 ██│     │                        │    │
│  │  │ ██                               ██│     │                        │    │
│  │  │ ██  Written comments should be   ██│     │                        │    │
│  │  │ ██  addressed to:                ██│     │                        │    │
│  │  │ ██                               ██│     │                        │    │
│  │  │ ██  Andrew White, CPA, CA        ██│     │                        │    │
│  │  │ ██  Associate Director           ██│     │                        │    │
│  │  │ ██  Accounting Standards Board   ██│     │                        │    │
│  │  │ ██  277 Wellington St. West      ██│     │                        │    │
│  │  │ ██  Toronto, ON M5V 3H2         ██│     │                        │    │
│  │  │ ██                               ██│     │                        │    │
│  │  │ ██  awhite@acsbcanada.ca         ██│     │                        │    │
│  │  │ ██                               ██│     │                        │    │
│  │  │ ██  [Submit comment]             ██│     │                        │    │
│  │  │ ██  (white button on dark bg)    ██│     │                        │    │
│  │  │ ██████████████████████████████████ │     │                        │    │
│  │  └────────────────────────────────────┘     │                        │    │
│  │                                             │                        │    │
│  │  ────────────────────────────────────────   │                        │    │
│  │                                             │                        │    │
│  │  Support Materials                          │                        │    │
│  │                                             │                        │    │
│  │  🔗 Exposure Draft (PDF)                    │                        │    │
│  │  🔗 Basis for Conclusions (PDF)             │                        │    │
│  │  🔗 Snapshot — Summary of Proposals         │                        │    │
│  │                                             │                        │    │
│  └────────────────────────────────────────────┴─────────────────────────┘    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer]                                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Mobile Layout (390px)

```
┌──────────────────────────────────┐
│  [Mobile Header]                 │
├──────────────────────────────────┤
│                                  │
│  Exposure Draft — Proposed       │
│  Amendments to Section 3856,     │
│  Financial Instruments           │
│  ════════════════════════════    │
│                                  │
│  Highlights                      │
│  ──────────                      │
│  (bold purple heading)           │
│                                  │
│  The Accounting Standards        │
│  Board (AcSB) has issued this    │
│  Exposure Draft proposing        │
│  amendments to Section 3856...   │
│                                  │
│  ────────────────────────────    │
│                                  │
│  IASB Exposure Draft             │
│                                  │
│  The International Accounting    │
│  Standards Board (IASB)          │
│  published IFRS Exposure         │
│  Draft ED/2025/1...              │
│  [View IASB Exposure Draft →]    │
│                                  │
│  ────────────────────────────    │
│                                  │
│  Comments Requested              │
│                                  │
│  ┌──────────────────────────┐    │
│  │ Question 1               │    │
│  │                          │    │
│  │ Do you agree with the    │    │
│  │ proposed amendments to   │    │
│  │ paragraph 3856.05?       │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Question 2               │    │
│  │                          │    │
│  │ Are there any additional │    │
│  │ disclosures that should  │    │
│  │ be required?             │    │
│  └──────────────────────────┘    │
│                                  │
│  ────────────────────────────    │
│                                  │
│  When to Reply                   │
│                                  │
│  The comment deadline is         │
│  April 20, 2026.                 │
│                                  │
│  ════════════════════════════    │
│                                  │
│  ┌──────────────────────────┐    │
│  │ ████████████████████████ │    │
│  │ ██ How to Reply       ██ │    │
│  │ ██                    ██ │    │
│  │ ██ Andrew White,      ██ │    │
│  │ ██ CPA, CA            ██ │    │
│  │ ██ Associate Director ██ │    │
│  │ ██ 277 Wellington St. ██ │    │
│  │ ██ West               ██ │    │
│  │ ██ Toronto, ON        ██ │    │
│  │ ██ M5V 3H2            ██ │    │
│  │ ██                    ██ │    │
│  │ ██ awhite@            ██ │    │
│  │ ██ acsbcanada.ca      ██ │    │
│  │ ██                    ██ │    │
│  │ ██ [Submit comment]   ██ │    │
│  │ ████████████████████████ │    │
│  └──────────────────────────┘    │
│                                  │
│  ────────────────────────────    │
│                                  │
│  Support Materials               │
│                                  │
│  🔗 Exposure Draft (PDF)         │
│  🔗 Basis for Conclusions (PDF)  │
│  🔗 Snapshot — Summary           │
│                                  │
│  ════════════════════════════    │
│                                  │
│  Staff Contact(s)                │
│  ──────────                      │
│                                  │
│  Andrew White, CPA, CA           │
│  Associate Director,             │
│  Accounting Standards Board      │
│  📞 +1 416 204 3487              │
│  ✉  awhite@acsbcanada.ca        │
│                                  │
├──────────────────────────────────┤
│  [Footer]                        │
└──────────────────────────────────┘
```

### 9.3 Component Breakdown

**Page Title (H1):**
- Full document title, e.g., "Exposure Draft — Proposed Amendments to Section 3856, Financial Instruments"
- Standard H1 styling, no breadcrumb, no "back to listing" link

**Highlights Section:**
- Bold purple heading "Highlights" (`color: rgb(96, 31, 91)`)
- One or more body paragraphs summarizing the document's purpose
- Separated from subsequent sections by a horizontal rule

**Rich Body Content:**
- Multiple content sections with subheadings (e.g., "IASB Exposure Draft", "Comments Requested")
- External links styled as purple arrow links (e.g., "[View IASB Exposure Draft →]")
- Blockquoted questions in the "Comments Requested" section — each question in a bordered box with light background
- Standard rich text: paragraphs, bold, italic, bullet lists, links

**When to Reply Section:**
- Heading: "When to Reply"
- Contains bold deadline date (e.g., "April 20, 2026") within body text
- Separated by horizontal rules above and below

**How to Reply — Dark Purple CTA Block:**
- Dark purple background — `#601F5B` (design token: `color-primary` / `bg-feature`)
- White text throughout
- H3 heading: "How to Reply"
- Body paragraph with instructions
- Full mailing address (name, title, street, city, province, postal code)
- Email address as mailto link
- "Submit comment" button: white text on contrasting button, or white outline button on dark bg
- This block duplicates contact info from the sidebar — intentional for accessibility within the reading flow

**Support Materials Section:**
- Heading: "Support Materials"
- List of linked documents with chain-link icon
- Each link opens a PDF or external resource
- Typical items: Exposure Draft PDF, Basis for Conclusions, Snapshot/Summary documents

**Staff Contact(s) Sidebar (desktop right column):**
- Purple H2 heading: "Staff Contact(s)" (`color: rgb(96, 31, 91)`)
- One or more contact cards, each containing:
  - **Name:** Bold, with credentials (e.g., "Andrew White, CPA, CA")
  - **Title:** Regular weight (e.g., "Associate Director, Accounting Standards Board")
  - **Phone:** Tel link with phone icon, format "+1 416 204 3487"
  - **Email:** Mailto link with mail icon (e.g., "awhite@acsbcanada.ca")
- Sidebar is sticky or fixed within viewport on scroll (desktop only)
- On mobile, sidebar content moves below main content

### 9.4 Interaction Notes

| Behavior | Description |
|----------|-------------|
| **No back link** | No "back to listing" navigation — user must use browser back or site nav |
| **External links** | IASB and other external links open in new tab (`target="_blank"`) |
| **Phone link** | `tel:+14162043487` — triggers phone dialer on mobile |
| **Email link** | `mailto:awhite@acsbcanada.ca` — triggers email client |
| **Submit comment button** | Navigates to comment submission form (same pattern as listing page) |
| **Support material links** | Open PDFs in new tab or trigger download |
| **Blockquote questions** | Static display — no expand/collapse, no interactive form |
| **Hover — purple links** | Underline on hover, cursor pointer |
| **Hover — Submit comment button** | Slight lightening of button bg in CTA block context |
| **Responsive — sidebar** | Desktop: ~30% width right column, sticky positioning. Mobile: sidebar collapses below all main content as a full-width section. |
| **Responsive — CTA block** | Full width on both desktop and mobile, padding adjusts |
| **Responsive — blockquotes** | Full width on mobile with reduced horizontal padding |

### 9.5 CMS Data Requirements

**Collection: `document-detail`** (extends `document-for-comment` or standalone)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | Yes | H1 page title |
| `slug` | String (auto) | Yes | URL-safe slug |
| `standard` | Relationship → `standards` | Yes | Parent standard |
| `board` | Relationship → `boards` | Yes | Parent board |
| `highlights` | Rich text | Yes | "Highlights" section content — bold purple heading is auto-rendered |
| `bodyContent` | Rich text (blocks) | Yes | Main body — supports headings, paragraphs, links, blockquotes |
| `commentQuestions` | Array of { questionNumber: Number, questionText: Rich text } | No | Blockquoted questions in "Comments Requested" section |
| `replyDeadline` | Date | No | "When to Reply" deadline date — rendered bold inline |
| `howToReply` | Object | No | Dark purple CTA block content (see sub-fields below) |
| `supportMaterials` | Array of { label: String, url: URL, fileType: Enum } | No | "Support Materials" linked documents |
| `staffContacts` | Array of Relationship → `contacts` | Yes | One or more staff contacts displayed in sidebar |

**Sub-fields for `howToReply`:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `heading` | String | Yes | H3 heading, default "How to Reply" |
| `body` | String | No | Instruction paragraph (white text) |
| `ctaLabel` | String | No | Button label, e.g., "Submit comment" |
| `ctaHref` | URL | No | Button destination |
| `contactName` | String | No | Name + credentials |
| `contactTitle` | String | No | Job title |
| `contactAddress` | Rich text | No | Full mailing address (street, city, province, postal code) |
| `contactEmail` | String (email) | No | Email address — rendered as mailto link |

**Collection: `contacts`** (shared with Project Detail)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | Yes | Full name with credentials, e.g., "Andrew White, CPA, CA" |
| `title` | String | Yes | Job title, e.g., "Associate Director, Accounting Standards Board" |
| `phone` | String | Yes | Phone number, format "+1 416 204 3487" |
| `email` | String (email) | Yes | Email address |
| `photo` | Upload (image) | No | Optional headshot |

---

## Template 10: Effective Dates Table

**Source:** Live site pattern observed across 11 standards sections
**Route:** `/en/{standard}/effective-dates`
**Layout:** Full-width tabbed (single-tab — no tab toggle, but same page chrome as T8)
**Used by:** 11 standards sections

### 10.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Header / Top Navigation Bar]                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Effective Dates                                                             │
│                                                                              │
│  The effective dates of recently issued accounting standards, guidelines,     │
│  and amendments are listed below. Note that the standards referenced below   │
│  are included in the CPA Canada Handbook – Accounting on Knotia.ca.         │
│  (italic text, "CPA Canada Handbook" and "Knotia.ca" are links)             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │          Application                    │       Pronouncement       │    │
│  │          (bold column header)           │   (bold column header)    │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  │ ██  Effective for annual periods beginning on or after             ██│    │
│  │ ██  January 1, 2027                                               ██│    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  Amendments to Section 3856,           │  Prospective              │    │
│  │  Financial Instruments                 │                           │    │
│  │  (italic standard name)               │                           │    │
│  │                                        │                           │    │
│  │  • New disclosure requirements for     │                           │    │
│  │    expected credit losses              │                           │    │
│  │  • Revised measurement guidance for    │                           │    │
│  │    financial guarantee contracts       │                           │    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │  Amendments to Section 1591,           │  Retrospective            │    │
│  │  Subsidiaries                          │                           │    │
│  │  (italic standard name)               │                           │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  │ ██  Effective for annual periods beginning on or after             ██│    │
│  │ ██  January 1, 2026                                               ██│    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  Amendments to IFRS 16,               │  Modified                  │    │
│  │  Leases                               │  retrospective¹            │    │
│  │  (italic standard name)               │                           │    │
│  │                                        │                           │    │
│  │  • Clarification of sale and           │                           │    │
│  │    leaseback transactions              │                           │    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │  IAS 12, Income Taxes                  │  Retrospective            │    │
│  │  (italic standard name)               │                           │    │
│  │                                        │                           │    │
│  │  • International Tax Reform —          │                           │    │
│  │    Pillar Two Model Rules             │                           │    │
│  │    (Amendments to IAS 12)             │                           │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  ...                                                                │    │
│  │  (continues for 13 purple section headers total)                    │    │
│  │  ...                                                                │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  │ ██  Effective for annual periods beginning on or after             ██│    │
│  │ ██  January 1, 2018                                               ██│    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  IFRS 15, Revenue from Contracts      │  Full retrospective or     │    │
│  │  with Customers                       │  modified retrospective    │    │
│  │  (italic standard name)               │                           │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  │ ██  Effective for annual periods beginning on or after             ██│    │
│  │ ██  January 1, 2019                                               ██│    │
│  │ ██████████████████████████████████████████████████████████████████████│    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │  IFRS 16, Leases                      │  Modified retrospective    │    │
│  │  (italic standard name)               │  or full retrospective     │    │
│  │                                        │                           │    │
│  │  ¹ Footnote: Modified retrospective    │                           │    │
│  │    means entities apply the amendment  │                           │    │
│  │    at the beginning of the annual...   │                           │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Note: The 2018 section appears before the 2019 section (out of             │
│  chronological order in the live site). This appears intentional.            │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Footer]                                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Mobile Layout (390px)

```
┌──────────────────────────────────┐
│  [Mobile Header]                 │
├──────────────────────────────────┤
│                                  │
│  Effective Dates                 │
│                                  │
│  The effective dates of          │
│  recently issued accounting      │
│  standards, guidelines, and      │
│  amendments are listed below.    │
│  Note that the standards         │
│  referenced below are included   │
│  in the CPA Canada Handbook –    │
│  Accounting on Knotia.ca.        │
│  (italic, with links)           │
│                                  │
│  ┌──────────────────────────┐    │
│  │ Application              │    │
│  │ (bold)                   │    │
│  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │    │
│  │ Pronouncement            │    │
│  │ (bold)                   │    │
│  ├──────────────────────────┤    │
│  │ ████████████████████████ │    │
│  │ ██ Effective for       ██│    │
│  │ ██ annual periods      ██│    │
│  │ ██ beginning on or     ██│    │
│  │ ██ after January 1,    ██│    │
│  │ ██ 2027                ██│    │
│  │ ████████████████████████ │    │
│  ├──────────────────────────┤    │
│  │ Amendments to Section    │    │
│  │ 3856, Financial          │    │
│  │ Instruments              │    │
│  │ (italic)                 │    │
│  │                          │    │
│  │ • New disclosure         │    │
│  │   requirements for       │    │
│  │   expected credit losses │    │
│  │                          │    │
│  │ Pronouncement:           │    │
│  │ Prospective              │    │
│  ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤    │
│  │ Amendments to Section    │    │
│  │ 1591, Subsidiaries       │    │
│  │ (italic)                 │    │
│  │                          │    │
│  │ Pronouncement:           │    │
│  │ Retrospective            │    │
│  ├──────────────────────────┤    │
│  │ ████████████████████████ │    │
│  │ ██ Effective for       ██│    │
│  │ ██ annual periods      ██│    │
│  │ ██ beginning on or     ██│    │
│  │ ██ after January 1,    ██│    │
│  │ ██ 2026                ██│    │
│  │ ████████████████████████ │    │
│  ├──────────────────────────┤    │
│  │ (rows continue stacked)  │    │
│  └──────────────────────────┘    │
│                                  │
├──────────────────────────────────┤
│  [Footer]                        │
└──────────────────────────────────┘
```

### 10.3 Component Breakdown

**Page Title (H1):**
- "Effective Dates" — standard page heading

**Intro Disclaimer Text:**
- Italic paragraph explaining the table's purpose
- Contains two links:
  - "CPA Canada Handbook" — links to CPA Canada Handbook resource
  - "Knotia.ca" — external link to Knotia.ca platform
- Displayed above the table, outside any table markup

**Table Structure:**
- **Column headers:** Two columns — "Application" (left, ~65% width) and "Pronouncement" (right, ~35% width)
- Column headers are bold text, likely in a `<thead>` or styled `<tr>`
- Non-semantic markup in live site (table used for layout, not strict data table semantics)

**Purple Section Header Rows:**
- Full-width rows spanning both columns
- Purple background (`~rgb(96, 31, 91)` — same brand purple) with white text
- Text pattern: "Effective for annual periods beginning on or after [Date]"
- 13 total section headers across the page
- Groups data rows by effective date
- **Ordering note:** The 2018 section appears before the 2019 section, which is out of reverse-chronological order. This appears to be an intentional exception or legacy ordering in the live site content.

**Data Rows (within each section):**
- **Application column (left):** Rich text containing:
  - Standard name in italics (e.g., "*Amendments to Section 3856, Financial Instruments*")
  - Optional bullet lists describing specific changes
  - Optional footnote references (superscript numbers, e.g., "1")
- **Pronouncement column (right):** Plain text describing transition method (e.g., "Prospective", "Retrospective", "Modified retrospective", "Full retrospective or modified retrospective")
- Alternating white/light gray row backgrounds within each section
- Dashed border between rows within the same effective date group

**Footnotes:**
- Appear at the bottom of the table or inline within data rows
- Superscript reference numbers (1, 2, etc.)
- Explanatory text in smaller font

### 10.4 Interaction Notes

| Behavior | Description |
|----------|-------------|
| **Static content** | This is a read-only reference table — no interactive elements, no filtering, no sorting |
| **External links in intro** | "CPA Canada Handbook" and "Knotia.ca" open in new tab |
| **No pagination** | All 13 sections render on a single page — long scroll |
| **No anchor links** | No jump-to navigation for specific effective date sections |
| **Hover — links in intro** | Underline on hover for "CPA Canada Handbook" and "Knotia.ca" links |
| **Responsive — table** | On mobile (390px), the two-column table collapses to a stacked single-column layout. Each row shows Application content first, then "Pronouncement: [value]" as a labeled field below. Purple section headers span full width. |
| **Responsive — section headers** | Purple header rows maintain full width on mobile, text wraps within padding |
| **Responsive — intro text** | Full width, wraps naturally |
| **Print** | Table should be print-friendly — consider `@media print` styles to avoid breaking rows across pages |

### 10.5 CMS Data Requirements

**Collection: `effective-dates-table`** (or as a page block within `pages`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `standard` | Relationship → `standards` | Yes | Which standard section this table belongs to |
| `introText` | Rich text | Yes | Italic disclaimer paragraph with links to CPA Canada Handbook and Knotia.ca |
| `sections` | Array of EffectiveDateSection | Yes | 13 (variable) purple-header grouped sections |

**Sub-fields for `sections` (EffectiveDateSection):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `headerLabel` | String | Yes | Full text for purple header row, e.g., "Effective for annual periods beginning on or after January 1, 2027" |
| `headerDate` | Date | No | Parsed date for sorting/logic (if needed); display uses `headerLabel` string |
| `sortOrder` | Number | No | Manual sort order — allows out-of-chronological ordering (e.g., 2018 before 2019) |
| `rows` | Array of EffectiveDateRow | Yes | Data rows within this section |

**Sub-fields for `rows` (EffectiveDateRow):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `application` | Rich text | Yes | Standard name (italic), bullet lists, footnotes — supports full rich text formatting |
| `pronouncement` | String | Yes | Transition method, e.g., "Prospective", "Retrospective", "Modified retrospective" |
| `footnoteRef` | String | No | Superscript footnote marker (e.g., "1", "2") |

**Collection: `effective-dates-footnote`** (or inline array on the table)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `marker` | String | Yes | Footnote identifier (e.g., "1", "2") |
| `text` | Rich text | Yes | Footnote explanation text |
| `table` | Relationship → `effective-dates-table` | Yes | Parent table |

**Query Patterns:**

```
// T8 — Documents for Comment Listing
// Route: /en/{standard}/documents
// Default (Open tab)
const docs = await payload.find({
  collection: 'document-for-comment',
  where: {
    standard: { equals: standardId },
    status: { equals: 'open' }
  },
  sort: 'group,sortOrder'
});
// Group by doc.group for rendering section headers

// Closed tab (?tab=closed-for-comment)
// Same query with status: 'closed'
```

```
// T9 — Document Detail
// Route: /en/{standard}/documents/{slug}
const doc = await payload.findBySlug({
  collection: 'document-detail',
  slug: params.slug,
  depth: 2  // populate staffContacts, standard, board
});
```

```
// T10 — Effective Dates Table
// Route: /en/{standard}/effective-dates
const table = await payload.find({
  collection: 'effective-dates-table',
  where: {
    standard: { equals: standardId }
  },
  depth: 1
});
// Sections are pre-ordered by sortOrder field (not date)
// to preserve intentional non-chronological ordering
```

---

## Template 11: Resources Listing

**URL Pattern:** `/en/{standard}/resources` (e.g., `/en/acsb/resources`)
**Layout:** Full-width tabbed
**Used by:** 11 standards sections (one per board/standard area)

### 11.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Home / AcSB / Resources                                                     │
│                                                                              │
│  Resources                                                                   │
│                                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐        │
│  │All Items │ Article  │ Guidance │ In Brief │  Other   │ Webinar  │        │
│  │ (active) │          │          │          │          │          │        │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ [All Types        ▾]  Sort by: [Publication date: Newest ▾]         │    │
│  │ Start date: [mm/dd/yyyy 📅]  End date: [mm/dd/yyyy 📅]             │    │
│  │ Items per page: [10 ▾]                                              │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ January 15, 2025                                                     │    │
│  │ [Article]                                                            │    │
│  │ Understanding the New Revenue Recognition Standard  ←── purple link  │    │
│  │ This article provides an overview of the key changes                 │    │
│  │ introduced by the updated revenue recognition guidance...            │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ December 8, 2024                                                     │    │
│  │ [Guidance] [In Brief]                                                │    │
│  │ IFRS 16 Leases - Implementation Guide                               │    │
│  │ Comprehensive guidance document covering the practical               │    │
│  │ application of IFRS 16 for Canadian entities...                      │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ November 22, 2024                                                    │    │
│  │ [Webinar]                                                            │    │
│  │ Year-End Accounting Considerations Webinar Recording                 │    │
│  │ Join our panel of experts as they discuss critical                   │    │
│  │ year-end accounting considerations for 2024...                       │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ (more items...)                                                       │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │              ◀ Previous  [1] [2] [3] ... [12]  Next ▶               │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ Home / AcSB / Resources        │
│                                │
│ Resources                      │
│                                │
│ ┌────────────────────────────┐ │
│ │ [All Items            ▾]  │ │
│ └────────────────────────────┘ │
│ ← category pills become a     │
│   <select> dropdown on mobile  │
│                                │
│ ┌────────────────────────────┐ │
│ │ [All Types            ▾]  │ │
│ │ Sort by:                   │ │
│ │ [Pub date: Newest     ▾]  │ │
│ │ Start: [mm/dd/yyyy    📅] │ │
│ │ End:   [mm/dd/yyyy    📅] │ │
│ │ Items/page: [10        ▾] │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ January 15, 2025           │ │
│ │ [Article]                  │ │
│ │ Understanding the New      │ │
│ │ Revenue Recognition        │ │
│ │ Standard                   │ │
│ │ This article provides an   │ │
│ │ overview of the key...     │ │
│ ├────────────────────────────┤ │
│ │ December 8, 2024           │ │
│ │ [Guidance] [In Brief]      │ │
│ │ IFRS 16 Leases -           │ │
│ │ Implementation Guide       │ │
│ │ Comprehensive guidance...  │ │
│ ├────────────────────────────┤ │
│ │ (more items...)            │ │
│ └────────────────────────────┘ │
│                                │
│ ◀ Prev [1][2][3]... Next ▶    │
└────────────────────────────────┘
```

### 11.3 Component Breakdown

**Category Filter Pills:**

| Component | Description |
|---|---|
| `<CategoryPills />` | Horizontal row of pill/tab buttons for category filtering |
| Active state | Filled/dark background, white text |
| Inactive state | Outline/ghost, dark text |
| Categories | All Items, Article, Guidance, In Brief, Other, Webinar (alphabetical) |
| Mobile | Collapses to `<select>` dropdown |

**Sort/Filter Bar:**

| Field | Type | Required | Default | Options |
|---|---|---|---|---|
| Filters Dropdown | `<select>` | No | "All Types" | Audio, External Link, PDF, Video, Webpage, Plain Language |
| Sort By | `<select>` | Yes | "Publication date: Newest" | "Publication date: Newest", "Publication date: Oldest" |
| Items Per Page | `<select>` | Yes | 10 | 10, 20, 30, All |
| Start Date | Date input | No | empty | Format: mm/dd/yyyy with calendar picker |
| End Date | Date input | No | empty | Format: mm/dd/yyyy with calendar picker |

**Resource Listing Item:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Date | Date string | Yes | Displayed above title, format: "Month DD, YYYY" |
| Category Tags | Badge/chip[] | Yes | One or more: Article, Guidance, In Brief, Other, Webinar |
| Title | String (linked) | Yes | Purple text, links to resource detail or external URL |
| Excerpt | String (paragraph) | Yes | 2-3 sentence summary, truncated |

**Note:** PDF icon is NOT displayed on listing items (confirmed from live site observation).

### 11.4 Interaction Notes

| Interaction | Behavior |
|---|---|
| Category pill click | Filters list to show only items matching that category. "All Items" resets filter. Active pill gets filled style. |
| Filter dropdown change | Filters list by resource type (Audio, PDF, Video, etc.). Combines with active category pill. |
| Sort change | Re-orders listing by publication date ascending or descending. |
| Date range input | Filters results to items published within start/end date range. Either field can be used independently. |
| Items per page change | Changes number of visible items. Resets to page 1. "All" shows every result on one page. |
| Pagination click | Navigates to selected page. Maintains all active filters and sort. |
| Title link click | Navigates to resource detail page or opens external URL (depending on resource type). |
| Responsive (< 768px) | Category pills collapse to `<select>` dropdown. Filter bar fields stack vertically. |
| Server interaction | ASP.NET PostBack on legacy site; Next.js version should use client-side filtering with API route for pagination. |

### 11.5 CMS Data Requirements

**Collection: `resources`**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | Resource title |
| `slug` | String (auto) | Yes | URL-safe slug |
| `date` | Date | Yes | Publication date |
| `category` | Enum (multi-select) | Yes | Article, Guidance, In Brief, Other, Webinar |
| `resourceType` | Enum | Yes | Audio, External Link, PDF, Video, Webpage, Plain Language |
| `excerpt` | Textarea | Yes | Short summary for listing display |
| `content` | Rich Text | No | Full content body (for detail pages) |
| `board` | Relationship → `boards` | Yes | Which board this resource belongs to |
| `standard` | Relationship → `standards` | No | Optional standard association |
| `externalUrl` | URL | No | For External Link type resources |
| `file` | Upload | No | For PDF/Audio type resources |
| `status` | Enum | Yes | draft, published, archived |

**API Query Pattern:**
```
GET /api/resources?board={boardSlug}&category={category}&type={resourceType}&sort={date_asc|date_desc}&startDate={date}&endDate={date}&page={n}&limit={10|20|30}
```

---

## Template 12: Filtered News/Event Listing

**URL Pattern:** `/en/news-listings`, `/en/acsb/news-listings`, `/en/volunteer-opportunities`
**Layout:** Full-width
**Used by:** ~10+ listing pages (homepage news, board-specific news, volunteer opportunities)

### 12.1 Desktop Layout (1440px) — News Listings Variant

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Home / News Listings                                                        │
│                                                                              │
│  News                                                                        │
│                                                                              │
│  ┌────────────┬───────────────────┬──────────────┬──────┬──────┬──────────┐ │
│  │ All Items  │Doc for Comment    │International │Meeting│ News │ Resource │ │
│  │  (active)  │                   │ Activity     │Summary│      │          │ │
│  └────────────┴───────────────────┴──────────────┴──────┴──────┴──────────┘ │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ Items per page: [10 ▾]   Sort by: [Publication date: Newest ▾]      │    │
│  │ Start date: [mm/dd/yyyy 📅]  End date: [mm/dd/yyyy 📅]             │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ March 1, 2025                                                        │    │
│  │ [News]                                                               │    │
│  │ FRAS Canada Announces New Climate Disclosure Standards  ← purple     │    │
│  │ FRAS Canada has released new guidance on climate-related             │    │
│  │ financial disclosures for Canadian reporting entities...              │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ February 20, 2025                                                    │    │
│  │ [Document for Comment]                                               │    │
│  │ Exposure Draft: Proposed Amendments to Section 3856  🔗 ← ext. link │    │
│  │ The AcSB invites comments on proposed amendments to                  │    │
│  │ Section 3856, Financial Instruments...                               │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ February 14, 2025                                                    │    │
│  │ [International Activity]                                             │    │
│  │ IASB Issues Amendments to IAS 21                                     │    │
│  │ The International Accounting Standards Board (IASB) has              │    │
│  │ issued amendments to IAS 21 regarding the effects...                 │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ (more items...)                                                       │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │         ◀ Previous  [1] [2] [3] ... [101]  Next ▶                   │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│  ← No total results count displayed                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Desktop Layout — Volunteer Opportunities Variant

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Home / Volunteer Opportunities                                              │
│                                                                              │
│  Volunteer Opportunities                                                     │
│                                                                              │
│  ┌──────┬──────┬──────┬──────┬──────┐                                       │
│  │ AASB │ CSSB │ PSAB │RASOC │ AcSB │  ← Board-based category tabs         │
│  └──────┴──────┴──────┴──────┴──────┘                                       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ Items per page: [10 ▾]   Sort by: [Publication date: Newest ▾]      │    │
│  │ Start date: [mm/dd/yyyy 📅]  End date: [mm/dd/yyyy 📅]             │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ January 10, 2025                                                     │    │
│  │ [Volunteer]                                                          │    │
│  │ Call for Volunteers: AcSB Advisory Committee                         │    │
│  │ The Accounting Standards Board is seeking volunteers to              │    │
│  │ serve on its advisory committee for the 2025-2026 term...            │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ (more items...)                                                       │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ◀ Previous  [1] [2] [3]  Next ▶                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 12.3 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ Home / News Listings           │
│                                │
│ News                           │
│                                │
│ ┌────────────────────────────┐ │
│ │ [All Items            ▾]  │ │
│ └────────────────────────────┘ │
│ ← 6 pills collapse to         │
│   <select> dropdown on mobile  │
│                                │
│ ┌────────────────────────────┐ │
│ │ Items/page: [10        ▾] │ │
│ │ Sort by:                   │ │
│ │ [Pub date: Newest     ▾]  │ │
│ │ Start: [mm/dd/yyyy    📅] │ │
│ │ End:   [mm/dd/yyyy    📅] │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ March 1, 2025              │ │
│ │ [News]                     │ │
│ │ FRAS Canada Announces      │ │
│ │ New Climate Disclosure      │ │
│ │ Standards                   │ │
│ │ FRAS Canada has released   │ │
│ │ new guidance on climate... │ │
│ ├────────────────────────────┤ │
│ │ February 20, 2025          │ │
│ │ [Document for Comment]     │ │
│ │ Exposure Draft: Proposed   │ │
│ │ Amendments to Section      │ │
│ │ 3856  🔗                   │ │
│ │ The AcSB invites comments  │ │
│ │ on proposed amendments...  │ │
│ ├────────────────────────────┤ │
│ │ (more items...)            │ │
│ └────────────────────────────┘ │
│                                │
│ ◀ Prev [1][2]...[101] Next ▶  │
└────────────────────────────────┘
```

### 12.4 Component Breakdown

**Category Filter Pills (News variant):**

| Component | Description |
|---|---|
| `<CategoryPills />` | Reuses same component from Template 11 |
| Categories (News) | All Items, Document for Comment, International Activity, Meeting Summary, News, Resource |
| Categories (Volunteer) | AASB, CSSB, PSAB, RASOC, AcSB (board-based tabs) |
| Mobile | `<select>` dropdown fallback |

**Sort/Filter Bar:**

| Field | Type | Required | Default | Options |
|---|---|---|---|---|
| Items Per Page | `<select>` | Yes | 10 | 10, 20, 30, All |
| Sort By | `<select>` | Yes | "Publication date: Newest" | "Publication date: Newest", "Publication date: Oldest" |
| Start Date | Date input | No | empty | Format: mm/dd/yyyy |
| End Date | Date input | No | empty | Format: mm/dd/yyyy |

**Note:** No "Filters" / "All Types" dropdown in this template (unlike Template 11). The filter bar is simpler.

**News Listing Item:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Date | Date string | Yes | Format: "Month DD, YYYY" — displayed above title |
| Category Tag | Badge/chip | Yes | Single category: News, Document for Comment, International Activity, Meeting Summary, Resource |
| Title | String (linked) | Yes | Purple linked text |
| External Link Icon | Icon | No | Shown when item links to external URL |
| Excerpt | String (paragraph) | Yes | 2-3 sentences, text only (no thumbnails) |

### 12.5 Interaction Notes

| Interaction | Behavior |
|---|---|
| Category pill click | Filters list to matching category. "All Items" resets. Active pill gets filled style. |
| Items per page change | Changes visible count. Resets to page 1. |
| Sort change | Re-orders by date ascending/descending. |
| Date range input | Filters to items within date range. Fields can be used independently. |
| Pagination click | Navigates pages. Maintains all active filters/sort. |
| Title click (standard) | Navigates to news detail page. |
| Title click (external) | Opens external URL. External link icon displayed next to title. |
| Responsive (< 768px) | Category pills collapse to `<select>` dropdown. Filter fields stack vertically. |
| Page load | No total results count is displayed anywhere on the page. |
| Legacy behavior | ASP.NET PostBack for all interactions on current site. Next.js should use client-side with API. |
| Volunteer variant | Category tabs switch between board-specific volunteer opportunity lists instead of content type categories. |

### 12.6 CMS Data Requirements

**Collection: `news` (extends existing)**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | News item title |
| `slug` | String (auto) | Yes | URL-safe slug |
| `date` | Date | Yes | Publication date |
| `category` | Enum | Yes | Document for Comment, International Activity, Meeting Summary, News, Resource |
| `excerpt` | Textarea | Yes | Short summary for listing display |
| `content` | Rich Text | No | Full article body |
| `board` | Relationship → `boards` | No | Board association (required for board-specific listings) |
| `externalUrl` | URL | No | If set, title links externally and shows external link icon |
| `isVolunteerOpportunity` | Boolean | No | Flags items for volunteer opportunities listing |
| `status` | Enum | Yes | draft, published, archived |

**API Query Pattern:**
```
GET /api/news?board={boardSlug}&category={category}&sort={date_asc|date_desc}&startDate={date}&endDate={date}&page={n}&limit={10|20|30}
```

**Variant Configuration:**
- `/en/news-listings` — No board filter, all news categories
- `/en/acsb/news-listings` — Pre-filtered to `board=acsb`
- `/en/volunteer-opportunities` — Pre-filtered to `isVolunteerOpportunity=true`, tabs filter by board

---

## Template 13: Meetings & Events Listing

**URL Pattern:** `/en/acsb/meetings-and-events`, `/en/psab/meetings-and-events`, etc.
**Layout:** Full-width
**Used by:** ~5 pages (one per board)

### 13.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Home / AcSB / Meetings & Events                                             │
│                                                                              │
│  Meetings & Events                                                           │
│                                                                              │
│  ┌──────────────────────────────┬────────────────────────────────┐           │
│  │ Upcoming meetings & events   │ Past meetings & events         │           │
│  │                              │ (active — default view)        │           │
│  └──────────────────────────────┴────────────────────────────────┘           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │ Items per page: [10 ▾]                                              │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │ AcSB Meeting Summary — February 27, 2025                             │    │
│  │ ─── (H2, linked, purple text) ───                                    │    │
│  │                                                                      │    │
│  │ The Accounting Standards Board met on February 27, 2025 to           │    │
│  │ discuss several active projects including revenue recognition,       │    │
│  │ financial instruments, and annual improvements...                     │    │
│  │                                                                      │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │ AcSB Meeting Summary — January 23, 2025                              │    │
│  │ ─── (H2, linked, purple text) ───                                    │    │
│  │                                                                      │    │
│  │ The Accounting Standards Board met on January 23, 2025 to review     │    │
│  │ stakeholder feedback on the proposed amendments to Section 3856...    │    │
│  │                                                                      │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │ AcSB Meeting Summary — December 12, 2024                             │    │
│  │ ─── (H2, linked, purple text) ───                                    │    │
│  │                                                                      │    │
│  │ The Accounting Standards Board met on December 12, 2024. Topics      │    │
│  │ included sustainability standards coordination and the Part II...     │    │
│  │                                                                      │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │ (more items...)                                                       │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │         ◀ Previous  [1] [2] [3] ... [18]  Next ▶                    │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│  ← AcSB: 18 pages (~180+ items confirmed)                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ Home / AcSB /                  │
│ Meetings & Events              │
│                                │
│ Meetings & Events              │
│                                │
│ ┌──────────┬─────────────────┐ │
│ │ Upcoming │ Past  (active)  │ │
│ └──────────┴─────────────────┘ │
│                                │
│ Items/page: [10          ▾]   │
│                                │
│ ┌────────────────────────────┐ │
│ │ AcSB Meeting Summary —    │ │
│ │ February 27, 2025          │ │
│ │                            │ │
│ │ The Accounting Standards   │ │
│ │ Board met on February 27,  │ │
│ │ 2025 to discuss several    │ │
│ │ active projects including  │ │
│ │ revenue recognition...     │ │
│ ├────────────────────────────┤ │
│ │ AcSB Meeting Summary —    │ │
│ │ January 23, 2025           │ │
│ │                            │ │
│ │ The Accounting Standards   │ │
│ │ Board met on January 23,   │ │
│ │ 2025 to review stakeholder │ │
│ │ feedback on the proposed   │ │
│ │ amendments...              │ │
│ ├────────────────────────────┤ │
│ │ (more items...)            │ │
│ └────────────────────────────┘ │
│                                │
│ ◀ Prev [1][2]...[18] Next ▶  │
└────────────────────────────────┘
```

### 13.3 Component Breakdown

**Tab Toggle:**

| Component | Description |
|---|---|
| `<TabToggle />` | Two-state toggle: "Upcoming meetings & events" / "Past meetings & events" |
| Default state | "Past meetings & events" is active on page load |
| Active style | Filled/dark background with white text (or underline indicator) |
| Inactive style | Outline/ghost styling |

**Items Per Page Dropdown:**

| Field | Type | Required | Default | Options |
|---|---|---|---|---|
| Items Per Page | `<select>` | Yes | 10 | 10, 20, 30, All |

**Note:** No category filters, no sort dropdown, no date range filters. This is the simplest listing template.

**Meeting/Event Listing Item:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | String (H2, linked) | Yes | Purple linked text. Typically includes date in title (e.g., "AcSB Meeting Summary — February 27, 2025") |
| Excerpt | String (paragraph) | Yes | 2-3 sentences describing the meeting content |
| Href | URL | Yes | Links to meeting detail / decision summary page |

### 13.4 Interaction Notes

| Interaction | Behavior |
|---|---|
| Tab toggle click | Switches between upcoming and past meetings/events. Resets to page 1. |
| Default view | "Past meetings & events" tab is active on initial page load. |
| Items per page change | Changes number of visible items. Resets to page 1. |
| Pagination click | Navigates pages. Maintains active tab selection. |
| Title (H2) click | Navigates to individual meeting detail / decision summary page. |
| Responsive (< 768px) | Tab toggle remains as two side-by-side tabs (does not collapse to dropdown). Items stack full-width. |
| No filters | No category filters, sort options, or date range controls — just the tab toggle and items-per-page. |
| Content volume | Large datasets expected (AcSB has 180+ items, ~18 pages at 10/page). Server-side pagination recommended. |

### 13.5 CMS Data Requirements

**Collection: `meetings` (new, or extend existing `events`)**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | Meeting/event title (often includes date) |
| `slug` | String (auto) | Yes | URL-safe slug |
| `date` | Date | Yes | Meeting/event date — used for upcoming/past split |
| `excerpt` | Textarea | Yes | 2-3 sentence summary for listing display |
| `content` | Rich Text | No | Full meeting summary / decision summary body |
| `board` | Relationship → `boards` | Yes | Which board this meeting belongs to |
| `type` | Enum | Yes | meeting, event, webinar, decision-summary |
| `status` | Enum | Yes | draft, published, archived |

**API Query Pattern:**
```
GET /api/meetings?board={boardSlug}&timeframe={upcoming|past}&page={n}&limit={10|20|30}
```

**Logic:**
- `timeframe=upcoming` — returns items where `date >= today`, sorted ascending (soonest first)
- `timeframe=past` — returns items where `date < today`, sorted descending (most recent first)

---

## Template 14: Committee Index / Directory

**URL Pattern:** `/en/acsb/committees`, `/en/psab/committees`, etc.
**Layout:** ~70% main content + 30% right sidebar
**Used by:** ~5 pages (one per board)

### 14.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Home / AcSB / Committees                                                    │
│                                                                              │
│  Committees                                                                  │
│                                                                              │
│  ┌────────────────────────────────────────────────┬─────────────────────────┐│
│  │                                                │                         ││
│  │  Accounting Standards Advisory Forum  ←── H2   │  On this page           ││
│  │  ─────────────────────────────────             │  ─────────────          ││
│  │  The Accounting Standards Advisory Forum       │  ■ Accounting Standards ││
│  │  (ASAF) provides a forum for national          │    Advisory Forum       ││
│  │  standard-setters to discuss accounting        │  ■ Advisory Committee   ││
│  │  issues with the IASB and to share             │  ■ Agriculture Advisory ││
│  │  perspectives on important financial           │    Group                ││
│  │  reporting topics...                           │  ■ Due Process          ││
│  │                         [Learn more →]         │    Oversight Committee  ││
│  │                                                │  ■ Employee Future      ││
│  │  Advisory Committee                   ←── H2   │    Benefits Task Force  ││
│  │  ─────────────────                             │  ■ Financial Instruments││
│  │  The Advisory Committee assists the AcSB       │    Advisory Committee   ││
│  │  by providing input on technical accounting    │  ■ Insurance Advisory   ││
│  │  matters, standard-setting priorities,         │    Group                ││
│  │  and implementation issues. Members are        │  ■ NFP Advisory Group   ││
│  │  appointed for renewable two-year terms...     │  ■ Pension Advisory     ││
│  │                         [Learn more →]         │    Group                ││
│  │                                                │  ■ Private Enterprise   ││
│  │  Agriculture Advisory Group           ←── H2   │    Advisory Committee   ││
│  │  ──────────────────────                        │  ■ Revenue Advisory     ││
│  │  The Agriculture Advisory Group provides       │    Group                ││
│  │  specialized input to the AcSB on matters      │  ■ User Advisory        ││
│  │  related to accounting for agricultural        │    Council              ││
│  │  activities, biological assets, and            │  ■ XBRL Advisory        ││
│  │  bearer plants...                              │    Committee            ││
│  │                         [Learn more →]         │                         ││
│  │                                                │                         ││
│  │  Due Process Oversight Committee      ←── H2   │                         ││
│  │  ───────────────────────────                   │                         ││
│  │  The Due Process Oversight Committee           │                         ││
│  │  ensures that the AcSB's standard-setting      │                         ││
│  │  activities follow established due              │                         ││
│  │  process procedures...                         │                         ││
│  │                         [Learn more →]         │                         ││
│  │                                                │                         ││
│  │  (9 more committees...)                        │                         ││
│  │                                                │                         ││
│  └────────────────────────────────────────────────┴─────────────────────────┘│
│  ← AcSB: 13 committees verified                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 14.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ Home / AcSB / Committees       │
│                                │
│ Committees                     │
│                                │
│ ┌────────────────────────────┐ │
│ │ On this page          [▾] │ │
│ │ ■ Accounting Standards     │ │
│ │   Advisory Forum           │ │
│ │ ■ Advisory Committee       │ │
│ │ ■ Agriculture Advisory     │ │
│ │   Group                    │ │
│ │ ■ (10 more...)             │ │
│ └────────────────────────────┘ │
│ ← Sidebar becomes a           │
│   collapsible "On this page"  │
│   section above content, or   │
│   sticky jump-to dropdown     │
│                                │
│ Accounting Standards           │
│ Advisory Forum                 │
│ ──────────────────             │
│ The Accounting Standards       │
│ Advisory Forum (ASAF)          │
│ provides a forum for national  │
│ standard-setters to discuss    │
│ accounting issues with the     │
│ IASB and to share              │
│ perspectives...                │
│              [Learn more →]    │
│                                │
│ Advisory Committee             │
│ ──────────────────             │
│ The Advisory Committee         │
│ assists the AcSB by providing  │
│ input on technical accounting  │
│ matters...                     │
│              [Learn more →]    │
│                                │
│ (11 more committees...)        │
└────────────────────────────────┘
```

### 14.3 Component Breakdown

**Committee Entry:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | String (H2) | Yes | Linked committee name — used as heading and anchor target |
| Description | String (paragraph) | Yes | 2-4 sentence description of committee purpose and scope |
| Detail Link | URL | No | Optional "Learn more" link to dedicated committee detail page |
| Anchor ID | String (auto) | Yes | Auto-generated from name for sidebar anchor navigation |

**Sidebar Navigation (Table of Contents):**

| Component | Description |
|---|---|
| `<AnchorNav />` | Vertical list of all committee names as anchor links |
| Heading | "On this page" |
| Items | Mirror all H2 committee headings on page |
| Active state | Highlights current section as user scrolls (scroll-spy behavior) |
| Position | Sticky — follows viewport on scroll (desktop) |
| Mobile | Collapses above content as expandable section or becomes jump-to dropdown |

### 14.4 Interaction Notes

| Interaction | Behavior |
|---|---|
| Sidebar anchor click | Smooth-scrolls to the corresponding committee H2 heading on the page. URL hash updates. |
| Scroll-spy | Active sidebar item updates as user scrolls past each committee section heading. |
| Sidebar position | Sticky on desktop — sidebar follows viewport as user scrolls the main content. |
| Committee name click (if linked) | Navigates to committee detail page (if one exists). |
| "Learn more" click | Navigates to dedicated committee detail page. |
| Responsive (< 768px) | Sidebar moves above main content as a collapsible "On this page" accordion, or becomes a sticky dropdown at top of content area. |
| No pagination | All committees render on a single page (no pagination). AcSB has 13 — manageable as a single-page list. |
| No filters | No search, filter, or sort controls. Static directory layout. |

### 14.5 CMS Data Requirements

**Collection: `committees`**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | Committee name (used as H2 heading) |
| `slug` | String (auto) | Yes | URL-safe slug — used for anchor IDs and optional detail page routes |
| `description` | Rich Text | Yes | Committee purpose/scope description (2-4 sentences for listing, full content for detail page) |
| `board` | Relationship → `boards` | Yes | Which board this committee belongs to |
| `sortOrder` | Number | No | Manual ordering override (defaults to alphabetical by name) |
| `detailPageUrl` | URL | No | Optional link to dedicated committee detail page |
| `members` | Array | No | Committee members (for detail page, not shown on index) |
| `members.name` | String | Yes (in array) | Member name |
| `members.role` | String | No | Member role/title |
| `members.organization` | String | No | Member organization |
| `status` | Enum | Yes | active, inactive, archived |

**API Query Pattern:**
```
GET /api/committees?board={boardSlug}&sort={sortOrder|name}
```

**Note:** Returns all committees for the board in a single response (no pagination needed). Client renders the full list.

---

## Template 15: Contact / Form Page

**URL Pattern:** `/en/contact-us`
**Layout:** Full-width, no sidebar
**Used By:** 1 page (+ potentially comment submit forms on consultation pages)

### 15.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SiteHeader — 3-row nav bar]                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Contact Us                                                         │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│   [Intro prose paragraph — describes how to reach FRAS Canada,      │
│    invites the user to fill out the form below]                      │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │                                                              │   │
│   │  Full Name: *                                                │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  Title:                                                      │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  Organization:                                               │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  Email address: *                                            │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  Business Phone:                                             │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  Comments: *                                                 │   │
│   │  ┌──────────────────────────────────────────────────────┐    │   │
│   │  │                                                      │    │   │
│   │  │                                                      │    │   │
│   │  │                                                      │    │   │
│   │  │                                                      │    │   │
│   │  └──────────────────────────────────────────────────────┘    │   │
│   │                                                              │   │
│   │  ┌──────────────────────┐  ┌──────────────────────────┐     │   │
│   │  │  [CAPTCHA IMAGE]     │  │ Type the text shown: *   │     │   │
│   │  │  "xK7mP2"           │  │ ┌──────────────────────┐ │     │   │
│   │  │                     │  │ │                      │ │     │   │
│   │  └──────────────────────┘  │ └──────────────────────┘ │     │   │
│   │  [↻ Refresh]               └──────────────────────────┘     │   │
│   │                                                              │   │
│   │  ┌──────────────────┐                                        │   │
│   │  │     SUBMIT       │  ← Purple filled button                │   │
│   │  └──────────────────┘                                        │   │
│   │                                                              │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │  Media Inquiries                                             │   │
│   │  ───────────────                                             │   │
│   │  Daniella Girgenti, CMP                                     │   │
│   │  Director of Communications                                 │   │
│   │  [email / phone contact details]                             │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  [SiteFooter]                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 15.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ [SiteHeader — mobile]          │
├────────────────────────────────┤
│                                │
│  Contact Us                    │
│  ──────────────────────────── │
│                                │
│  [Intro prose paragraph]       │
│                                │
│  Full Name: *                  │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Title:                        │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Organization:                 │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Email address: *              │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Business Phone:               │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Comments: *                   │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │                          │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │  [CAPTCHA IMAGE]         │  │
│  │  "xK7mP2"               │  │
│  └──────────────────────────┘  │
│  [↻ Refresh]                   │
│                                │
│  Type the text shown: *        │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │        SUBMIT            │  │
│  └──────────────────────────┘  │
│                                │
│  ─────────────────────────── │
│  Media Inquiries               │
│  Daniella Girgenti, CMP       │
│  Director of Communications   │
│  [email / phone]               │
│                                │
├────────────────────────────────┤
│ [SiteFooter — mobile]          │
└────────────────────────────────┘
```

### 15.3 Component Breakdown

**Page structure:**
- **H1 heading:** "Contact Us"
- **Intro text:** Rich text paragraph (CMS-editable) explaining how to reach FRAS Canada
- **Contact form:** Stacked vertical form with labeled inputs
- **CAPTCHA block:** Image-based text CAPTCHA with refresh button (NOT reCAPTCHA/hCaptcha)
- **Submit button:** Purple filled button, label "SUBMIT"
- **Media Inquiries block:** Contact card for media/press inquiries

**Form fields:**

| Field | Label | Type | Required | HTML `type` | Validation Notes |
|-------|-------|------|----------|-------------|------------------|
| Full Name | "Full Name: *" | Text input | Yes | `text` | Non-empty string |
| Title | "Title:" | Text input | No | `text` | Optional, free-text |
| Organization | "Organization:" | Text input | No | `text` | Optional, free-text |
| Email Address | "Email address: *" | Email input | Yes | `email` | Must be valid email format |
| Business Phone | "Business Phone:" | Tel input | No | `tel` | Optional, accepts formatted phone numbers |
| Comments | "Comments: *" | Textarea | Yes | `textarea` | Non-empty string, multi-line, ~6 rows |
| CAPTCHA Response | "Type the text shown: *" | Text input | Yes | `text` | Must match server-generated CAPTCHA image text |

**CAPTCHA component:**
- Server-generated image containing distorted alphanumeric text
- Adjacent text input for the user to type what they see
- "Refresh" button (↻ icon) to request a new CAPTCHA image
- Validation happens server-side on form submit

**Media Inquiries block:**
- Heading: "Media Inquiries"
- Contact name: "Daniella Girgenti, CMP"
- Contact title: "Director of Communications"
- Contact details: email and/or phone (CMS-managed)

### 15.4 Interaction Notes

| Interaction | Behavior |
|-------------|----------|
| Required field validation | Client-side: highlight empty required fields on submit with inline error message below each field. Asterisk (*) in label indicates required. |
| Email validation | Client-side: validate email format before submit. Show inline error "Please enter a valid email address." |
| CAPTCHA refresh | Click ↻ button → AJAX request for new CAPTCHA image, replaces current image without page reload. Clears CAPTCHA text input. |
| Submit (valid) | POST form data to API endpoint. On success: show confirmation message ("Thank you for contacting us. We will respond shortly.") or redirect to a thank-you page. |
| Submit (invalid) | Scroll to first error. Highlight invalid/empty required fields. CAPTCHA re-generates on failed submit. |
| Submit (CAPTCHA fail) | Show inline error below CAPTCHA input: "The text you entered does not match the image. Please try again." Generate new CAPTCHA image. |
| Hover — SUBMIT button | Darken background color (purple → darker purple). Cursor: pointer. |
| Hover — Refresh button | Slight rotation animation on ↻ icon. Cursor: pointer. |
| Responsive (mobile) | CAPTCHA image and text input stack vertically (image above, input below). All form fields stretch to full container width. |
| Focus states | All inputs show visible focus ring (border-color change or outline) for accessibility. |
| Tab order | Natural top-to-bottom: Full Name → Title → Organization → Email → Phone → Comments → CAPTCHA input → Refresh → Submit |

### 15.5 CMS Data Requirements

**Collection: `form-submissions`**

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | text (required) | Submitted full name |
| `title` | text | Submitted title |
| `organization` | text | Submitted organization |
| `email` | email (required) | Submitted email address |
| `businessPhone` | text | Submitted phone number |
| `comments` | textarea (required) | Submitted comments |
| `submittedAt` | date | Auto-generated timestamp |
| `status` | select: `new`, `read`, `replied` | For admin tracking |

**Page content (managed via `pages` collection):**

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Page heading ("Contact Us") |
| `introText` | richText | Introductory paragraph above the form |
| `formConfig.captchaEnabled` | boolean | Toggle CAPTCHA on/off |
| `mediaInquiries` | group | Contact block below the form |
| `mediaInquiries.heading` | text | "Media Inquiries" |
| `mediaInquiries.contactName` | text | "Daniella Girgenti, CMP" |
| `mediaInquiries.contactTitle` | text | "Director of Communications" |
| `mediaInquiries.contactEmail` | email | Media contact email |
| `mediaInquiries.contactPhone` | text | Media contact phone |

**Next.js components:**
- `<ContactForm />` — Full form with client-side validation + server action submit
- `<ImageCaptcha />` — CAPTCHA image display + refresh + text input
- `<MediaInquiriesBlock />` — Contact card rendered from CMS data

---

## Template 16: Authentication Page

**URL Pattern:** `/en/my-account/login`
**Layout:** Full-width, no sidebar
**Used By:** Login, Registration, Password reset flows

### 16.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SiteHeader — 3-row nav bar]                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                     ┌──────────────────────────────┐                 │
│                     │                              │                 │
│                     │  User Name (email address):  │                 │
│                     │  ┌────────────────────────┐  │                 │
│                     │  │                        │  │                 │
│                     │  └────────────────────────┘  │                 │
│                     │  Forgot your User Name?      │                 │
│                     │                              │                 │
│                     │  Password:                   │                 │
│                     │  ┌────────────────────────┐  │                 │
│                     │  │                        │  │                 │
│                     │  └────────────────────────┘  │                 │
│                     │  Forgot your Password?       │                 │
│                     │                              │                 │
│                     │  ┌────────────────────────┐  │                 │
│                     │  │       Log in           │  │                 │
│                     │  └────────────────────────┘  │                 │
│                     │  ← Purple filled, full-width │                 │
│                     │                              │                 │
│                     │  ──────────────────────────  │                 │
│                     │                              │                 │
│                     │  Not registered yet?         │                 │
│                     │  Create My account           │                 │
│                     │  ← "Create My account" link  │                 │
│                     │                              │                 │
│                     │  ──────────────────────────  │                 │
│                     │                              │                 │
│                     │  [CPA Canada shared auth     │                 │
│                     │   explanation paragraph —    │                 │
│                     │   explains that FRAS Canada  │                 │
│                     │   accounts are managed       │                 │
│                     │   through CPA Canada.        │                 │
│                     │   Link: cpacanada.ca/en/login│                 │
│                     │   Explains funding model.]   │                 │
│                     │                              │                 │
│                     │  ──────────────────────────  │                 │
│                     │                              │                 │
│                     │  Support                     │                 │
│                     │  customerservice@cpacanada.ca│                 │
│                     │  1 (800) 268-3793            │                 │
│                     │  +1 (416) 977-0748           │                 │
│                     │                              │                 │
│                     └──────────────────────────────┘                 │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  [SiteFooter]                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 16.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ [SiteHeader — mobile]          │
├────────────────────────────────┤
│                                │
│  User Name (email address):    │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│  Forgot your User Name?       │
│                                │
│  Password:                     │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  └──────────────────────────┘  │
│  Forgot your Password?        │
│                                │
│  ┌──────────────────────────┐  │
│  │        Log in            │  │
│  └──────────────────────────┘  │
│                                │
│  ──────────────────────────── │
│                                │
│  Not registered yet?           │
│  Create My account             │
│                                │
│  ──────────────────────────── │
│                                │
│  [CPA Canada shared auth      │
│   explanation paragraph]       │
│  Link: cpacanada.ca/en/login   │
│                                │
│  ──────────────────────────── │
│                                │
│  Support                       │
│  customerservice@cpacanada.ca  │
│  1 (800) 268-3793              │
│  +1 (416) 977-0748             │
│                                │
├────────────────────────────────┤
│ [SiteFooter — mobile]          │
└────────────────────────────────┘
```

### 16.3 Component Breakdown

**Page structure:**
- **Login form:** Centered card/container with username and password inputs
- **"Forgot" links:** Inline text links below each respective field
- **Login button:** Full-width purple filled button, label "Log in" (two words, not "Login")
- **Registration CTA:** Text "Not registered yet?" + "Create My account" link
- **CPA Canada explanation:** Prose block explaining shared authentication with CPA Canada, includes link to `cpacanada.ca/en/login`
- **Support contact block:** Email and phone numbers for CPA Canada customer service

**Form fields:**

| Field | Label | Type | Required | HTML `type` | Notes |
|-------|-------|------|----------|-------------|-------|
| User Name | "User Name (email address):" | Text input | Yes | `text` | Note: `type="text"`, NOT `type="email"` — matches legacy ASP.NET behavior |
| Password | "Password:" | Password input | Yes | `password` | Masked input |

**Important design constraints:**
- No CAPTCHA on login form
- No "Remember me" checkbox
- Button text is "Log in" (two words) — NOT "Login" (one word)
- Original site uses ASP.NET PostBack for form submission — new implementation will use Next.js server actions or API route
- "Create My account" — note the capital "M" in "My" and lowercase "a" in "account"

**Support contact block:**
- Email: `customerservice@cpacanada.ca` (linked as `mailto:`)
- Toll-free: `1 (800) 268-3793` (linked as `tel:`)
- International: `+1 (416) 977-0748` (linked as `tel:`)

### 16.4 Interaction Notes

| Interaction | Behavior |
|-------------|----------|
| Submit (valid credentials) | POST to auth API. On success: redirect to `/en/my-account` dashboard or previous page. Set session cookie. |
| Submit (invalid credentials) | Show error message above the form: "Invalid user name or password. Please try again." Do NOT specify which field is wrong (security best practice). |
| Submit (empty fields) | Client-side validation: highlight empty required fields. Prevent submission. |
| "Forgot your User Name?" click | Navigate to `/en/my-account/forgot-username` (or equivalent recovery flow). |
| "Forgot your Password?" click | Navigate to `/en/my-account/forgot-password` (or equivalent recovery flow). |
| "Create My account" click | Navigate to `/en/my-account/register` registration page. |
| CPA Canada link click | Opens `https://www.cpacanada.ca/en/login` in new tab (`target="_blank"`, `rel="noopener noreferrer"`). |
| Support email click | Opens default email client via `mailto:customerservice@cpacanada.ca`. |
| Support phone click | Opens dialer via `tel:` link on mobile; no action on desktop (or opens dialer app if available). |
| Hover — Log in button | Darken background color (purple → darker purple). Cursor: pointer. |
| Hover — "Forgot" links | Underline text. Cursor: pointer. Color change to link-hover color. |
| Hover — "Create My account" link | Underline text. Cursor: pointer. |
| Responsive (mobile) | Form container stretches to full width with horizontal padding. All fields full-width. Layout is already single-column, so minimal adaptation needed. |
| Focus states | Visible focus ring on all inputs and interactive elements for accessibility. |
| Tab order | User Name → Password → Log in button → Forgot User Name → Forgot Password → Create My account |
| Form method | Original: ASP.NET PostBack. New: Next.js server action or API route POST to `/api/auth/login`. |

### 16.5 CMS Data Requirements

**Page content (managed via `pages` collection or a dedicated `auth-pages` global):**

| Field | Type | Notes |
|-------|------|-------|
| `login.usernameLabel` | text | "User Name (email address):" |
| `login.passwordLabel` | text | "Password:" |
| `login.buttonLabel` | text | "Log in" |
| `login.forgotUsernameLabel` | text | "Forgot your User Name?" |
| `login.forgotUsernameUrl` | text | URL for username recovery |
| `login.forgotPasswordLabel` | text | "Forgot your Password?" |
| `login.forgotPasswordUrl` | text | URL for password recovery |
| `login.registerPrompt` | text | "Not registered yet?" |
| `login.registerLinkLabel` | text | "Create My account" |
| `login.registerUrl` | text | URL for registration page |
| `login.cpaExplanation` | richText | CPA Canada shared auth explanation paragraph |
| `login.cpaLoginUrl` | text | "https://www.cpacanada.ca/en/login" |
| `login.supportHeading` | text | "Support" |
| `login.supportEmail` | email | "customerservice@cpacanada.ca" |
| `login.supportPhoneTollFree` | text | "1 (800) 268-3793" |
| `login.supportPhoneIntl` | text | "+1 (416) 977-0748" |

**Authentication (NOT in CMS — application-level):**

| Concern | Implementation Notes |
|---------|---------------------|
| Session management | NextAuth.js or custom JWT-based sessions |
| User storage | CPA Canada SSO integration or local `users` collection in Payload |
| Password hashing | bcrypt or argon2 — never store plaintext |
| Rate limiting | Implement login attempt throttling (e.g., 5 attempts per 15 min) |
| CSRF protection | Next.js built-in CSRF tokens via server actions |

**Next.js components:**
- `<LoginForm />` — Username/password form with client-side validation + server action
- `<AuthLayout />` — Centered card layout wrapper used by login, register, forgot-password pages
- `<SupportContactBlock />` — Reusable support info block (email + phone numbers)
- `<CpaExplanationBlock />` — Rich text block explaining CPA Canada shared auth

---

## Template 17: Simple Content / Empty State

**URL Pattern:** `/en/job-opportunities`
**Layout:** Full-width, no sidebar
**Used By:** Job opportunities, potentially other conditional-content pages (e.g., upcoming events listing when empty)

### 17.1 Desktop Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SiteHeader — 3-row nav bar]                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Become a part of something special!                                │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│   [Body paragraph 1 — describes the mission and culture of FRAS     │
│    Canada, why working here matters, what the organization does.]    │
│                                                                      │
│   [Body paragraph 2 — additional context about the organization,    │
│    values, team, and what they look for in candidates.]              │
│                                                                      │
│   _FRAS Canada is funded by CPA Canada._                             │
│   ← Italic CPA Canada funding note                                  │
│                                                                      │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│   **Open Positions**                                                 │
│   ← Bold heading                                                     │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │                                                              │   │
│   │  _Thank you for your interest. Unfortunately, we do not      │   │
│   │  have any open positions at this time. Please check back     │   │
│   │  soon!_                                                      │   │
│   │  ← Italic empty state message                                │   │
│   │                                                              │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   (No filtering, sorting, or pagination controls)                    │
│   (No fallback CTA — transitions directly to footer when empty)     │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  [SiteFooter]                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

**With active job listings (populated state):**

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SiteHeader — 3-row nav bar]                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Become a part of something special!                                │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│   [Body paragraph 1]                                                 │
│   [Body paragraph 2]                                                 │
│   _FRAS Canada is funded by CPA Canada._                             │
│                                                                      │
│   ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│   **Open Positions**                                                 │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │  Job Title 1                                                 │   │
│   │  Department / Location          Posted: Jan 15, 2025         │   │
│   │  Brief description of the role and responsibilities...       │   │
│   │                                              [View Details →]│   │
│   ├──────────────────────────────────────────────────────────────┤   │
│   │  Job Title 2                                                 │   │
│   │  Department / Location          Posted: Feb 3, 2025          │   │
│   │  Brief description of the role and responsibilities...       │   │
│   │                                              [View Details →]│   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  [SiteFooter]                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 17.2 Mobile Layout (390px)

```
┌────────────────────────────────┐
│ [SiteHeader — mobile]          │
├────────────────────────────────┤
│                                │
│  Become a part of something    │
│  special!                      │
│  ──────────────────────────── │
│                                │
│  [Body paragraph 1]            │
│                                │
│  [Body paragraph 2]            │
│                                │
│  _FRAS Canada is funded by     │
│  CPA Canada._                  │
│                                │
│  ──────────────────────────── │
│                                │
│  **Open Positions**            │
│                                │
│  _Thank you for your interest. │
│  Unfortunately, we do not have │
│  any open positions at this    │
│  time. Please check back       │
│  soon!_                        │
│                                │
├────────────────────────────────┤
│ [SiteFooter — mobile]          │
└────────────────────────────────┘
```

### 17.3 Component Breakdown

**Page structure:**
- **H1 heading:** "Become a part of something special!" (or CMS-editable heading)
- **Intro prose:** 2 body paragraphs (rich text, CMS-editable)
- **Funding note:** Italic text: "FRAS Canada is funded by CPA Canada." — rendered as `<em>` within the prose block
- **Visual divider:** Horizontal rule or spacing between intro and listings
- **"Open Positions" heading:** Bold (`<strong>` or `<h2>`), serves as section heading for the dynamic area
- **Dynamic listing area:** Renders either job listing cards OR the empty state message
- **Empty state message:** Italic text: "Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!"

**Key design constraints:**
- No filtering, sorting, or pagination controls — this is a simple listing
- No fallback CTA (no "Sign up for alerts" or "Browse other opportunities" link)
- Page transitions directly from the last content element to the footer
- The empty state is the default/expected state for this page
- The "Open Positions" heading remains visible even when the list is empty

### 17.4 Interaction Notes

| Interaction | Behavior |
|-------------|----------|
| Empty state | Display italic message in place of job listing cards. No interactive elements in the empty state area. |
| Populated state | Render job listing cards in a vertical stack. Each card is a clickable row that navigates to the job detail page or external posting. |
| "View Details →" click | Navigate to job detail page (internal) or external job posting URL (opens in new tab if external). |
| Hover — job card | Subtle background color change or left-border accent to indicate interactivity. Cursor: pointer. |
| Responsive (mobile) | Single-column layout already — no significant adaptation needed. Job cards stretch to full width. Posted date stacks below department/location. |
| Content loading | Server-rendered page — no client-side loading state needed. The empty/populated decision is made at render time. |
| No pagination | Even if many jobs are posted, all render on a single page (no pagination controls exist). If this becomes an issue at scale, pagination can be added later. |

### 17.5 CMS Data Requirements

**Page content (managed via `pages` collection):**

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Page heading ("Become a part of something special!") |
| `slug` | text | "job-opportunities" |
| `introContent` | richText | Body paragraphs + italic funding note |
| `listingHeading` | text | "Open Positions" |
| `emptyStateMessage` | richText | Italic empty state message — editable so content team can update wording |
| `layout` | select | "simple-content" template identifier |

**Collection: `job-postings` (new)**

| Field | Type | Notes |
|-------|------|-------|
| `title` | text (required) | Job title |
| `department` | text | Department or team name |
| `location` | text | Office location or "Remote" |
| `description` | richText | Full job description (for detail view) |
| `summary` | textarea | Short description for listing card |
| `postedDate` | date | Date the posting was published |
| `closingDate` | date | Application deadline (optional) |
| `externalUrl` | text | External job posting URL (if hosted elsewhere) |
| `status` | select: `draft`, `published`, `closed` | Controls visibility |

**Query logic:**
- Fetch all `job-postings` where `status === 'published'` and `closingDate` is null or in the future
- If results count === 0, render empty state message
- If results count > 0, render job listing cards sorted by `postedDate` descending

**Next.js components:**
- `<SimpleContentPage />` — Layout wrapper: heading + rich text prose + dynamic section
- `<JobListings />` — Fetches and renders job cards or empty state
- `<JobCard />` — Individual job listing card (title, department, location, date, summary, CTA)
- `<EmptyState />` — Reusable italic message component (can be used by other conditional-content pages)

---

## Consolidated Component Inventory

All new/reusable components introduced across Phase 2 gap templates, extending the Component Inventory in `wireframe-specs.md` Section 12.

### Components from Templates 3-5

| Component | Used In | Description |
|---|---|---|
| `<StaffContactCard />` | T3A, T9 | Sidebar card with name, title, phone, email — purple H2 heading |
| `<SectionNavSidebar />` | T3B, T4 | Vertical link list with active state indicator (bold + underline). Note: This is the Phase 2 name for the vertical sidebar navigation. Phase 1 uses `<SectionNav />` for the same concept. During implementation, consolidate into a single `<SectionNav />` component with a `variant` prop ('sidebar' \| 'tabs'). |
| `<MemberCard />` | T4 | Portrait photo + name (purple link) + credentials + role label + dates |
| `<BoardLogoHero />` | T5 | Board crest/wordmark with board name on brand-color background |
| `<FeatureCTABlock />` | T5 | 1-2 CTA cards (light gray or dark purple variants) with heading, description, button |

### Components from Templates 8-10

| Component | Used In | Description |
|---|---|---|
| `<TabPills />` | T8 | Two-pill toggle (Open/Closed) with URL query param switching |
| `<GroupedTable />` | T8 | Table-like layout with gray banner section headers grouping rows |
| `<DocumentRow />` | T8 | Title link + optional action button (Submit comment / View Comments) |
| `<DarkPurpleCTA />` | T9 | Dark purple/near-black background block with heading, body, address, button |
| `<BlockquoteQuestion />` | T9 | Bordered question box used in "Comments Requested" sections |
| `<SupportMaterialsList />` | T9 | Chain-link icon + labeled document links |
| `<EffectiveDatesTable />` | T10 | Full data table with purple section headers, rich text cells, footnotes |
| `<PurpleSectionHeader />` | T10 | Full-width purple bg row with white text — used as table group divider |

### Components from Templates 11-14

| Component | Used In | Description |
|---|---|---|
| `<CategoryPills />` | T11, T12 | Horizontal pill/tab row for category filtering. Collapses to `<select>` on mobile. |
| `<SortFilterBar />` | T11, T12 | Dropdown controls for sort, items-per-page, date range. Stacks vertically on mobile. |
| `<ListingItem />` | T11, T12, T13 | Date + category badge + linked title + excerpt. Text-only, no thumbnails. |
| `<TabToggle />` | T13 | Two-state toggle for upcoming/past content. |
| `<AnchorNav />` | T14 | Sticky sidebar with scroll-spy that mirrors page H2 headings as anchor links. |
| `<DateRangePicker />` | T11, T12 | Start/end date inputs with calendar picker. Format: mm/dd/yyyy. |
| `<ItemsPerPage />` | T11, T12, T13 | Dropdown selector for pagination size: 10, 20, 30, All. |

### Components from Templates 15-17

| Component | Used In | Description |
|---|---|---|
| `<ContactForm />` | T15 | Full contact form with labeled fields, validation, and submit handler |
| `<ImageCaptcha />` | T15 | Server-generated text CAPTCHA with image display, text input, and refresh button |
| `<MediaInquiriesBlock />` | T15 | Contact card showing name, title, email, phone for media inquiries |
| `<LoginForm />` | T16 | Username/password form with "forgot" links and submit |
| `<AuthLayout />` | T16 | Centered card layout wrapper for auth pages (login, register, forgot-password) |
| `<SupportContactBlock />` | T16 | Email + phone support contact block (CPA Canada customer service) |
| `<CpaExplanationBlock />` | T16 | Rich text block explaining CPA Canada shared authentication |
| `<SimpleContentPage />` | T17 | Layout: heading + rich text prose + dynamic listing section |
| `<JobListings />` | T17 | Renders job cards or empty state based on data availability |
| `<JobCard />` | T17 | Individual job posting card with title, metadata, summary, CTA |
| `<EmptyState />` | T17 (+ reusable) | Italic message displayed when a dynamic list has no items |

### Shared / Global Components (reused across all gap templates)

| Component | Reused In | Notes |
|---|---|---|
| `<SiteHeader />` | All templates | Standard 3-row navigation header |
| `<SiteFooter />` | All templates | Standard footer |
| `<Breadcrumb />` | T3, T4, T5, T11, T12, T13, T14 | Path navigation trail |
| `<SectionTabs />` | T3, T4, T5 | Board-level tab navigation (5-7 tabs). Note: Horizontal tab navigation variant. May be consolidated with `<SectionNav variant='tabs' />` during implementation. |
| `<Pagination />` | T11, T12, T13 | Previous / page numbers / Next controls |
| `<PageHeader />` | All templates | H1 heading pattern |

### Design Tokens (Gap Templates)

| Token | Value | Notes |
|---|---|---|
| Brand purple | `rgb(96, 31, 91)` / `#601f5b` | Used for headings, links, active states, CTA backgrounds |
| Dark purple CTA bg | `#601F5B` (design token: `color-primary` / `bg-feature`) | "How to Reply" block, dark variant CTAs |
| Light gray card bg | `#F0F0F0` (design token: `bg-group-header`) | Group headers, light card backgrounds |
| Row alt bg | `#F8F8F8` (design token: `bg-row-alt`) | Alternating table row background |
| Form label style | Regular weight, colon-terminated, asterisk for required | "Full Name: *" pattern |
| Auth card max-width | ~480px | Centered login form container |
| Empty state text | `font-style: italic` | Visually distinct from normal body text |
| Member photo size | 205 x 205px | Square portrait, consistent across all member cards |

---

## Combined CMS Collection Summary

This section consolidates all Payload CMS collection proposals from all gap template specifications into a single unified mapping.

### Collection Name Reconciliation (Phase 1 → Phase 2)

| Phase 1 Name | Phase 2 Name | Resolution |
|---|---|---|
| `consultations` | `document-for-comment` | Use `document-for-comment` — more specific |
| `documents` | `resources` | Use `resources` — broader scope covers articles, guidance, webinars, and uploaded files |
| `events` | `meetings` | Use `events` — broader scope, with `type` enum (meeting, webinar, deadline, decision-summary) |
| `decision-summaries` | (merged into `events`) | Merge into `events` collection with `type: 'decision-summary'` |
| `contacts` | `contacts` | Same name, reconcile fields: use `title` (not `role`), include credentials in `name` |

### New Collections

| Collection | Templates | Purpose | Key Fields |
|---|---|---|---|
| `board-members` | T4 | Board member profiles with photos and term dates | name, credentials, photo (205x205), role (enum), roleLabel, appointedDate, termExpires, board, bioPage, sortOrder |
| `standards-sections` | T5 | Standards overview pages with tabbed navigation | title, slug, board, boardLogo, boardName, tabs (array), activeProjects, featureCTAs (array with variant) |
| `document-for-comment` | T8 | Documents listed on comment listing pages. Note: Phase 1 PRD uses `consultations` as the collection name. This maps to `document-for-comment` in Phase 2. During implementation, use `document-for-comment` as the canonical collection name. | title, slug, standard, board, group (enum: exposure-draft/consultation-paper/re-exposure-draft/discussion-paper), status (open/closed), documentUrl, commentSubmitUrl, commentsPdfUrl, sortOrder, publishedDate |
| `document-detail` | T9 | Full document detail pages (exposure drafts, etc.) | title, slug, standard, board, highlights (richText), bodyContent (richText blocks), commentQuestions (array), replyDeadline (date), howToReply (object), supportMaterials (array), staffContacts (relationship → contacts) |
| `effective-dates-table` | T10 | Effective dates reference data per standard | standard (relationship), introText (richText), sections (array of { headerLabel, headerDate, sortOrder, rows[] }) |
| `effective-dates-footnote` | T10 | Footnotes for effective dates tables | marker, text (richText), table (relationship) |
| `contacts` | T9, shared | Staff contact profiles for sidebars and CTA blocks. Note: `name` should include credentials (e.g., "Andrew White, CPA, CA"). | name, title, phone, email, photo (optional) |
| `resources` | T11 | Board-specific resource items (articles, guidance, webinars) | title, slug, date, category (multi-enum), resourceType (enum), excerpt, content, board, standard, externalUrl, file, status |
| `meetings` | T13 | Meeting summaries and events per board | title, slug, date, excerpt, content, board, type (enum: meeting/event/webinar/decision-summary), status |
| `committees` | T14 | Committee directory entries per board | name, slug, description (richText), board, sortOrder, detailPageUrl, members (array), status (active/inactive/archived) |
| `form-submissions` | T15 | Contact form submission storage | fullName, title, organization, email, businessPhone, comments, submittedAt, status (new/read/replied) |
| `job-postings` | T17 | Job opportunity listings | title, department, location, description, summary, postedDate, closingDate, externalUrl, status (draft/published/closed) |

### Extended Collections

| Collection | Templates | Changes | New/Modified Fields |
|---|---|---|---|
| `pages` | T3, T15, T17 | Add sidebar configuration, form config, simple-listing support | sidebarType (select: staff-contact/section-nav/none), staffContacts (array), sectionNavLinks (array), ctaBlock (group), newsSection (boolean), board (relationship), formConfig (group), mediaInquiries (group), listingHeading, emptyStateMessage, layout |
| `news` | T5, T12 | Add volunteer opportunity support and external link field | externalUrl (URL), isVolunteerOpportunity (Boolean), category (enum: Document for Comment/International Activity/Meeting Summary/News/Resource) |

### New Globals

| Global | Templates | Purpose | Key Fields |
|---|---|---|---|
| `auth-config` | T16 | Authentication page content (labels, URLs, explanation text) | login.usernameLabel, login.passwordLabel, login.buttonLabel, login.forgotUsernameLabel/Url, login.forgotPasswordLabel/Url, login.registerPrompt, login.registerLinkLabel/Url, login.cpaExplanation, login.cpaLoginUrl, login.supportHeading/Email/PhoneTollFree/PhoneIntl |

### Extended Page Block Types

| Block/Group | Templates | Fields |
|---|---|---|
| `contact-form-block` | T15 | formConfig (captchaEnabled), mediaInquiries (heading, contactName, contactTitle, contactEmail, contactPhone) |
| `simple-listing-block` | T17 | listingHeading, emptyStateMessage, listingCollection (relationship to collection name) |

### Enum Definitions (All Gap Templates)

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

### Relationship Diagram

```
pages (Templates 3, 15, 17)
  ├── board → boards
  ├── staffContacts[] (embedded)
  ├── sectionNavLinks[] (embedded)
  └── sectionTabs[] → pages (siblings)

board-members (Template 4)
  ├── board → boards
  └── bioPage → pages

standards-sections (Template 5)
  ├── board → boards
  ├── activeProjects[] → projects
  └── tabs[] (embedded)

document-for-comment (Template 8)
  ├── standard → standards
  └── board → boards

document-detail (Template 9)
  ├── standard → standards
  ├── board → boards
  └── staffContacts[] → contacts

effective-dates-table (Template 10)
  └── standard → standards

effective-dates-footnote (Template 10)
  └── table → effective-dates-table

contacts (shared: T9, Project Detail)
  (standalone collection, no outbound relationships)

resources (Template 11)
  ├── board → boards
  └── standard → standards

news (Templates 5, 12)
  ├── board → boards
  └── standardsSection → standards-sections

meetings (Template 13)
  └── board → boards

committees (Template 14)
  └── board → boards

form-submissions (Template 15)
  (standalone collection — no relationships, stores form data)

job-postings (Template 17)
  (standalone collection — no relationships)
```

### Mobile Wireframe Summary (All Gap Templates)

| Template | Desktop Layout | Mobile Adaptations |
|---|---|---|
| T3A: Content + Staff Contact Sidebar | 70/30 main + sidebar | Sidebar drops below main content, full width |
| T3B: Content + Section Nav Sidebar | 70/30 main + sidebar | Sidebar drops below main content as vertical link list |
| T4: People Listing (Members) | 70/30, 2-col card grid + sidebar | Cards stack 1-column; sidebar drops below |
| T5: Standards Overview (Tabbed) | Full-width, tabs + table + CTAs + news | Table → stacked cards; CTAs stack; news cards stack 1-col; tabs horizontal scroll |
| T8: Documents for Comment | Full-width, pill toggle + grouped rows | Rows stack with button below title; headers span full width |
| T9: Document Detail | 70/30 main + contact sidebar | Sidebar drops below; CTA block full width; blockquotes reduce padding |
| T10: Effective Dates Table | Full-width, 2-col data table | Columns stack (Application above Pronouncement); purple headers span full width |
| T11: Resources Listing | Full-width, pills + filter bar + paginated list | Pills → `<select>` dropdown; filter fields stack vertically |
| T12: Filtered News/Event Listing | Full-width, 6 pills + filter bar + paginated list | Pills → `<select>` dropdown; filter fields stack vertically |
| T13: Meetings & Events Listing | Full-width, tab toggle + items-per-page + paginated list | Tab toggle remains as tabs; items stack full-width |
| T14: Committee Index / Directory | 70/30 main + sidebar | Sidebar moves above content as collapsible "On this page" accordion |
| T15: Contact / Form Page | Full-width, stacked form | CAPTCHA stacks vertically; all fields full-width; media block stacks below |
| T16: Authentication Page | Centered ~480px card | Card stretches to full width with padding; already single-column |
| T17: Simple Content / Empty State | Full-width, single column | Already single-column; text reflows naturally; job cards stretch full-width |

---

> **End of Phase 2 Wireframe Specifications (Gap Templates T3-T17)**
> **Generated:** 2026-03-04
> **Source files consolidated:** wireframe-specs-gap-t3-t5.md, wireframe-specs-gap-t8-t10.md, wireframe-specs-gap-t11-t14.md, wireframe-specs-gap-t15-t17.md
