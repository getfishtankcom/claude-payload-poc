# FRAS Canada — Detail Page Content Structures

**Date:** 2026-04-27
**Source:** `data/page-inspections.json` — 95 pages crawled 2026-03-05 via Playwright

This document catalogues the exact content structure of the most content-rich detail page types on frascanada.ca. It is the authoritative reference for 1:1 POC implementation of these templates.

---

## Table of Contents

1. [Project Detail Page](#1-project-detail-page)
2. [Document for Comment (Consultation) Detail](#2-document-for-comment-consultation-detail)
3. [News Article Detail](#3-news-article-detail)
4. [Board Meeting / Decision Summary Detail](#4-board-meeting--decision-summary-detail)
5. [Council Meeting Minutes Detail](#5-council-meeting-minutes-detail)
6. [Resource / Guidance Detail](#6-resource--guidance-detail)
7. [Standards Section Landing (Overview)](#7-standards-section-landing-overview)
8. [Cross-Cutting Patterns](#8-cross-cutting-patterns)
9. [Component Inventory Summary](#9-component-inventory-summary)

---

## 1. Project Detail Page

**Sitecore Template ID:** `5b254c29-288b-44ca-9d91-02e725efa9dd`

Two sub-variants exist based on which board/section owns the project:

| Variant | URL Pattern | Board | Tab Set |
|---|---|---|---|
| `board-project-detail` | `/en/aspe/projects/:slug` | AcSB (ASPE section) | Overview, Project Listing, Documents for Comment, Effective Dates, Resources |
| `section-project-detail` | `/en/cass/projects/:slug`, `/en/ifrsstandards/projects/:slug` | AASB / AASB-related sections | Same + optional IFRIC Agenda Decisions |

**Difference:** The `section-project-detail` variant can have a linked CTA block (`purple-info-content` with `flex-row` / `btn-container`). Both are otherwise structurally identical.

### Example Pages

| Title | URL | Board Section |
|---|---|---|
| 2021 Annual Improvements | `/en/aspe/projects/2021-aip` | ASPE (AcSB) |
| AcSB Strategic Plan | `/en/aspe/projects/acsb-strategic-plan` | IFRS Standards (AcSB) |
| Audit Evidence & Risk Response | `/en/cass/projects/audit-evidence` | Canadian Auditing Standards (AASB) |
| AASB Strategic Plan | `/en/csqc/projects/aasb-strategic-plan` | Canadian Standards on Quality Management |
| Second Comprehensive Review of IFRS for SMEs | `/en/ifrsstandards/projects/2019-comprehensive-review-of-ifrs-for-smes` | IFRS Standards (AcSB) |

### Breadcrumb Pattern

```
Home > [Section Name] > Project Listing > [Project Title]
```

Sometimes the breadcrumb omits the "Project Listing" step (e.g. Strategic Plan pages go directly Home > Section > Project Title).

### Sub-Navigation (Horizontal Tabs)

Active tab: **"Project Listing"**

Standard tab set for accounting standards sections:
- Overview
- Project Listing *(active)*
- Documents for Comment
- Effective Dates
- Resources
- (IFRS sections add) IFRIC Agenda Decisions

### Page Layout

```
[Section Title Banner]   ← `.h2` styled paragraph, board/section name
[Horizontal Sub-Nav Tabs]
[H1 Page Title]
[Back to projects link]  ← .back-to-project inside #back-to-project-container

[Purple Info Container — 8/12 left + 4/12 right]
  LEFT col-sm-8:
    .standard-project-intro   ← Summary section with H2 "Summary" + rte body
    .show-text / .more-text   ← Expandable "Read more" for long summaries
                                 (hidden input: HiddenSeeMoreLabel / HiddenSeeLessLabel)
  RIGHT col-sm-4:
    .standard-project-content  ← H2 "Staff Contact(s)" + contact card
      .staffname                ← Staff name
      .organization             ← Role/title
      .phone-content            ← Phone number
      .mail-content             ← Email

[Project Status Container]  ← #project-status-container
  H2 "Project Status"
  .project-status-content  ← Timeline of stages
    .right-indentation (×10)  ← Each stage item (10 slots total, appears fixed)
    .completed (×N)           ← Completed stages (class="completed" on <p>)
    .not-completed (×1)       ← Active/current stage
    .Default-Button > .purple-btn.cta-button-1  ← CTA e.g. "Submit Comments"

[Purple Info Container — optional CTA block]  ← present on some projects
  .purple-info-content + .flex-row + .btn-container
  H3 [CTA title] + buttons

[Standards Plain Language Container]  ← #standards-plain-language-container.rollups
  #pagination-container
    .standards-plain-language-content
      .news-meetings-rollup-listing
        H2 "News" (or section header)
        .content-item (×N)        ← News/document cards
          .content-item-title
          .content-icon           ← pdf-icon or external-icon span

[Meeting List Container]  ← #new-meeting-list-container.rollups
  .news-meetings-rollup-listing
    H2 "Meeting & event summaries"
  #new-custom-tab-accordion
    .tab_container
      .meetings-container
        .new-meetings-news-item (×N)   ← Each meeting row
          .meeting-date  (span)
          .meetings-news-item-link (a → H3)
          .meeting-time  (span)
          .meeting-location (span)

[Disclaimer Container]  ← #disclaimer-container
  .disclaimer-content  ← Boilerplate disclaimer text
```

### Key Field Summary

| Field | CSS Class / ID | Notes |
|---|---|---|
| Section name | `maincontent_1_sectionTitle` / `.h2` | E.g. "ASPE", "Canadian Auditing Standards" |
| Summary text | `.standard-project-intro` / `.rte-wrapper` | Can be truncated with show/hide |
| Staff name | `.staffname` | Inside `.standard-project-content` |
| Staff role | `.organization` | |
| Staff phone | `.phone-content` | |
| Staff email | `.mail-content` | |
| Project status stages | `.right-indentation` × 10 | Always 10 slots; filled from top |
| Stage state: complete | `.completed` on `<p>` | |
| Stage state: active | `.not-completed` on `<p>` | |
| CTA button | `.purple-btn.cta-button-1` | In project-status-container |
| Related news | `.content-item` in `#pagination-container` | Linked news/docs |
| Meeting rows | `.new-meetings-news-item` in `#new-custom-tab-accordion` | |
| Meeting date | `.meeting-date` | |
| Meeting link | `.meetings-news-item-link` | Contains H3 with meeting title |
| Disclaimer | `.disclaimer-content` | Legal boilerplate |

### Notable Variants

- **`morecontent` / `morelink`**: Some project summaries use an older "read more" pattern (`span.morecontent`, `a.morelink`) vs the newer `show-text` / `more-text` divs.
- **CTA blocks**: Some projects have 1–2 `purple-info-content` CTA blocks (e.g. "Download the Strategic Plan PDF"). Not present on all projects.
- **External links**: `span.external-icon` appears on news/doc items linking to external sites (e.g. IASB).
- **PDF links**: `span.pdf-icon` appears on items linking to PDFs. `a.pdf-link` is also used in the document-comment container (see below).

---

## 2. Document for Comment (Consultation) Detail

**Sitecore Template ID:** `a9bc5df5-19ee-41be-90cd-3dfdf50ef83c`

This is the "Documents for Comment" detail page — i.e. an Exposure Draft or Consultation Paper that stakeholders can respond to.

**Note:** The Sitecore template ID differs from project detail (`5b254c29...` vs `a9bc5df5...`), confirming these are separate templates.

### Example Pages

| Title | URL |
|---|---|
| AASB Exposure Draft – CAS 240 Fraud | `/en/cass/documents/aasb-cas-240-fraud` |
| AASB Consultation Paper – 2026-2029 Strategic Plan | `/en/csqc/documents/aasb-strategic-plan-consultation` |
| AcSB Exposure Draft – Disclosure Requirements in IFRS Standards | `/en/ifrsstandards/documents/2021-05-03-ed-disclosure-requirements-ifrs-standards-pilot-approach` |

### Breadcrumb Pattern

```
Home > [Section Name] > Documents for Comment > [Document Title]
```

### Sub-Navigation (Horizontal Tabs)

Active tab: **"Documents for Comment"**

(Same tab set as project detail, but "Documents for Comment" is active.)

### Page Layout

```
[Section Title Banner]
[Horizontal Sub-Nav Tabs]
[H1 Page Title]

[Purple Info Container — 8/12 left + 4/12 right]
  LEFT col-sm-8:
    .standard-project-intro   ← Summary text + "read more"
  RIGHT col-sm-4:
    .standard-project-content  ← H2 "Staff Contact(s)" + contact card
      (same fields as project detail)

[Document Comment Container]  ← #document-comment-container (2 columns)
  LEFT .left-sec-container → .left-dynamic-container
    .document-comment-content
      .link-container (×N)
        .link-item (×N)         ← Download / action links
          .pdf-link (a)         ← PDF download link
          .internal-link-icon (a)  ← Internal site links
  RIGHT .right-sec-container → .right-dynamic-container
    H2 "Support Materials"     ← Only present when support materials exist
      .link-container / .link-item / .pdf-link

[Detail Content Container]  ← #detail-content-container
  .detail-content.rte-wrapper  ← Full RTE body content
    H2 "Background"            ← Long-form background text
    (more H2/H3 sections as authored)
```

### Key Field Summary

| Field | CSS Class / ID | Notes |
|---|---|---|
| Summary text | `.standard-project-intro` | Same as project detail |
| Staff contact | `.standard-project-content` | Same fields as project detail |
| Primary document download | `.pdf-link` in `#document-comment-container` left | The main PDF |
| Internal link | `.internal-link-icon` | Points to another page on site |
| Support materials | `.right-dynamic-container` > H2 "Support Materials" | Optional right column |
| Background body | `.detail-content.rte-wrapper` in `#detail-content-container` | RTE-authored long text |
| Published date | `fras__publishedDate` meta | ISO date |

### Important: No "Submit Comments" Form on Detail Page

The document detail page does **not** contain an inline form. The CTA button (`.purple-btn`) in the project-status-container (on project pages) links to the submission form. The document detail page itself shows the document downloads and background text only. The comment submission is a separate form flow.

### Variants by Document Count

- CAS 240 page: 4 `link-item` entries (2 left, 2 right — a PDF and an internal link in each column)
- Consultation Paper: 2 `link-item` entries (1 left, 1 right)
- Disclosure Requirements ED: 2 `link-item` entries + `detail-content` with 6 child blocks (richer background text)

---

## 3. News Article Detail

**Sitecore Template IDs:**
- Cross-board news (`news-detail`): `9769f3e7-7900-4bfb-b35d-8ee081f0c5da` (same as resource detail)
- Council news (`council-news-detail`): `9769f3e7-7900-4bfb-b35d-8ee081f0c5da`

The `news-detail` and `council-news-detail` types share the **same Sitecore template ID and page structure**. They differ only in:
- URL namespace (`/en/news-listings/` vs `/en/[council]/news-listings/`)
- Sub-navigation tabs (FRAS-wide org tabs vs council-specific tabs)

### Example Pages

| Type | Title | URL |
|---|---|---|
| news-detail | Canada's Oversight Councils Announce Transition | `/en/news-listings/2024-04-01-rasoc-announcement` |
| news-detail | Canadian Standard Setting Changes Ahead | `/en/news-listings/canadian-standard-setting-changes-ahead` |
| news-detail | Close Call Going Concern Assessments (Resource) | `/en/news-listings/close-call-going-concern-assessment` |
| council-news-detail | Appointments, Reappointments – AASOC | `/en/aasoc/news-listings/appointments-reappointments-retirements-aasoc` |
| council-news-detail | Appointments, Reappointments – AcSOC | `/en/acsoc/news-listings/2023-acsoc-appointments` |

### Breadcrumb Patterns

For `news-detail` (FRAS-wide):
```
Home > News Listings > [Article Title]
```

For `council-news-detail`:
```
Home > [Council Name] > News Listings > [Article Title]
```

### Sub-Navigation

For `news-detail` (FRAS-wide org tabs):
- About, Research Program, **News Listings** *(active)*, Contact Us, Job Opportunities, Volunteer Opportunities, My Account

For `council-news-detail` (e.g. AASOC council tabs):
- About, Meetings, Timelines, Committees, **News Listings** *(active)*, Volunteer Opportunities

### Page Layout

```
[Section Title Banner]   ← "FRASCanada" for org-wide; council name for council news
[Horizontal Sub-Nav Tabs]
[H1 Article Title]

[Detail Content Intro]  ← #detail-content-intro
  .detail-content-intro-top   ← (empty in crawled data — likely image slot)
  .detail-content-intro-bottom
    span.date   ← Publication date (e.g. "April 1, 2024")
    span.tag    ← Content type label (e.g. "News", "Resource, Guidance")

[Purple Info Container — main body]
  8/12 column: .rte-wrapper  ← Main article body (long-form RTE)
  4/12 column: .standard-project-content  ← OPTIONAL Staff Contact(s) sidebar

[Optional: second .purple-info-container]  ← Additional CTA/content block (some articles)

[Optional: #detail-content-container]
  .detail-content.rte-wrapper  ← Extended body content (some articles)
```

### Key Field Summary

| Field | CSS Class / ID | Notes |
|---|---|---|
| Publication date | `maincontent_4_newsDate` / `span.date` | "March 31, 2024" format |
| Content type tag | `maincontent_4_newsType` / `span.tag` | "News", "Resource, Guidance", etc. |
| Article body | `.rte-wrapper` in `purple-info-container` | Main long-form content |
| Staff contact (optional) | `.standard-project-content` | Some news articles include author/contact |
| OG type | `og:type = "article"` | Set on news articles (not project pages) |
| Coveo tags | `fras__tags` meta | E.g. "AASOC;AASB" |
| Page type | `fras__pageTypes` meta | "News", "Resource", "Guidance" |
| Board category | `fras__category` meta | E.g. "Auditing and Assurance Standards Oversight Council" |

### No Images in Body Content

The `detail-content-intro-top` div was empty in all crawled samples. The live site has **no images in news article bodies** — this is consistent with the CLAUDE.md note that "News stories currently have no images in content."

### Content Type Tags Observed

- `News`
- `Resource, Guidance`
- `Meeting Summary`

---

## 4. Board Meeting / Decision Summary Detail

**Sitecore Template ID:** `2f06d9ae-86cc-4a6f-82e1-aadda69b7a42`

Used for board decision summaries (AcSB, AASB) and board meeting summaries (CSSB). These are the per-meeting "what was decided" pages.

### Example Pages

| Title | URL |
|---|---|
| AASB Decision Summary – April 5, 2023 | `/en/aasb/meetings-and-events/apr-5-2023` |
| AcSB Decision Summary – February 23, 2022 | `/en/acsb/meetings-and-events/2022-02-23` |

### Breadcrumb Pattern

```
Home > [Board Name] > Meetings and Events > [Meeting Title]
```

### Sub-Navigation (Board Tabs)

Active tab: **"Meetings"**

For AASB:
- About, Initiatives, **Meetings** *(active)*, Committees, News Listings, Volunteer Opportunities

For AcSB:
- About, Projects, Meetings, Committees, News Listings, ...

### Page Layout

This template is the **simplest** of all the detail pages — it is essentially one RTE block.

```
[Section Title Banner]  ← Board name e.g. "AASB"
[Horizontal Sub-Nav Tabs]
[H1 Meeting Title]  ← e.g. "AASB Decision Summary – April 5, 2023"

[Meeting Description Container]  ← #maincontent_4_PlMeetingDescription (Sitecore placeholder)
  col-sm-12.col-xs-12  ← Full-width single column
    .rte-wrapper           ← ALL content is in this single rich-text wrapper

    Content structure (authored in RTE):
    <p> Opening boilerplate (e.g. "This summary of decisions...")
    <h2> [Standard category] (e.g. "Canadian Auditing Standards")
      <h3> [Topic] (e.g. "Audit Evidence")
        <p> Discussion narrative
        <ul> Key issues / decisions
      <h3> [Topic 2]
        ...
    <h2> [Category 2] (e.g. "Other Canadian Standards")
      ...
    <h2> "Other"
      ...
```

### Real Example Heading Structure (AASB Apr 5, 2023)

```
H1: AASB Decision Summary – April 5, 2023
H2: Canadian Auditing Standards
  H3: Audit Evidence
  H3: Going Concern
H2: Other Canadian Standards
  H3: Audits of Less Complex Entities (LCEs)
H2: Other
  H3: IAASB Strategy
```

### Key Field Summary

| Field | CSS Class / ID | Notes |
|---|---|---|
| Meeting body | `#maincontent_4_PlMeetingDescription` / `.rte-wrapper` | Full content, one block |
| Coveo page type | `fras__pageTypes = "Meeting Summary"` | |
| Category | `fras__category` | Board name |
| Tags | `fras__tags` | Board abbreviation (e.g. "AASB") |

### Important Notes

- **No sidebar.** No staff contact, no downloads, no status timeline. Pure RTE body.
- **No pagination or meeting links** — this is a detail page, not a listing.
- The `.rte-wrapper` contains the entire page narrative including all H2/H3 sections, paragraphs, bullet lists, and any inline links to supporting documents.
- The opening `<p>` boilerplate ("This summary of decisions...") is always present and is part of the authored content.

---

## 5. Council Meeting Minutes Detail

**Sitecore Template ID:** Same Sitecore placeholder pattern as board meeting detail (`maincontent_4_PlMeetingDescription`).

Council meetings (AcSOC, AASOC, RASOC) use the same structural pattern as board meeting decision summaries, but the content type is "Meeting Minutes" (full minutes) vs "Decision Summary" (board-only summary format).

### Example Pages

| Title | URL |
|---|---|
| AcSOC Meeting Minutes – February 23, 2023 | `/en/acsoc/meetings-and-events/february-23-2023` |
| AASOC Meeting Minutes – June 13, 2024 | `/en/rasoc/meetings-and-events/aasoc-june-2024` |
| AcSOC Meeting Minutes – June 1, 2023 | `/en/acsoc/meetings-and-events/june-1-2023` |

### Breadcrumb Pattern

```
Home > [Council Name] > Meetings and Events > [Meeting Title]
```

### Sub-Navigation

For AcSOC: About, Meetings *(active)*, Annual Reports, Committees, News Listings, Volunteer Opportunities

### Page Layout

Identical to board meeting detail:

```
[Section Title Banner]
[Horizontal Sub-Nav Tabs]
[H1 Meeting Minutes Title]

[#maincontent_4_PlMeetingDescription]
  .rte-wrapper  ← All content
    Opening sentence (attendance/format note)
    H2: Call to Order
    H2: Approval of [previous] Minutes
    H2: Chair's Remarks
    H2: [Report names] (PRC Report, Chair Reports, etc.)
      H3: [Sub-topics]
    H2: Adjournment
```

### Real Example Heading Structure (AcSOC June 1, 2023)

```
H1: AcSOC Meeting Minutes – June 1, 2023
H2: Call to Order
H2: Approval of Meeting Minutes from February 23-24, 2023
H2: Chair's Remarks
H2: Performance Review Committee Report on the AcSB and PSAB
  H3: PSAB 2022-2023 Annual Report
  H3: AcSB 2022-2023 Annual Report
H2: PSAB Chair Report
H2: AcSB Chair Report
H2: CSSB Update
H2: Education Sessions
H2: Closing Remarks
H2: Adjournment
```

### Difference from Board Decision Summaries

| Aspect | Board Decision Summary | Council Meeting Minutes |
|---|---|---|
| Content | What was *decided* | Full meeting *proceedings* |
| Boilerplate opener | "This summary of decisions..." | No boilerplate — direct narrative |
| Typical H2 sections | CAS categories, topic areas | Procedural (Call to Order, Chair's Remarks, etc.) |
| Coveo pageTypes | "Meeting Summary" | Not set (or "Meeting Summary") |
| Template URL | `/en/[board]/meetings-and-events/:slug` | `/en/[council]/meetings-and-events/:slug` |

---

## 6. Resource / Guidance Detail

**Sitecore Template ID:** `9769f3e7-7900-4bfb-b35d-8ee081f0c5da` (shared with news-detail)

Resources are articles, guidance documents, or publications that provide interpretive/educational content. They use the same template ID as news articles but can have much richer content structure.

### Example Pages

| Title | URL |
|---|---|
| Amendments to IAS 1 and the Impact on the CASs | `/en/cass/resources/amendments-ias-1-impact-on-cass` |
| 2020 Changes to Part I – AcSB Due Process | `/en/ifrsstandards/resources/2020-changes-to-part-i-acsb-due-process-endorsement-activities` |
| Audits of Less Complex Entities – Our Progress | `/en/other/resources/audits-lces-progress-report` |

### Breadcrumb Pattern

```
Home > [Section Name] > Resources > [Resource Title]
```

### Sub-Navigation

Active tab: **"Resources"**

### Page Layout

Resources have a more structured layout than news articles, with multiple `purple-info-container` blocks stacked vertically:

```
[Section Title Banner]
[Horizontal Sub-Nav Tabs]
[H1 Resource Title]

[Detail Content Intro]  ← #detail-content-intro (same as news articles)
  .detail-content-intro-top  ← (empty / image slot)
  .detail-content-intro-bottom
    span.date   ← Publication date
    span.tag    ← "Resource, Guidance"

[Purple Info Container #1]  ← Full-width RTE — intro paragraph
  .rte-wrapper (with inline <style> block for spacing)

[Purple Info Container #2]  ← Full-width RTE — body paragraph
  .rte-wrapper

[Purple Info Container #3]  ← 2-column split (8/4)
  col-8: .rte-wrapper  ← Main section content with H2
  col-4: .rte-wrapper  ← Sidebar CTA or related box (gray div)

[Purple Info Container #4]  ← Full-width RTE section
  .rte-wrapper

[Purple Info Container #5]  ← Full-width RTE section
  .rte-wrapper

[Purple Info Container #6]  ← Full-width RTE section (up to 14 child elements)
  .rte-wrapper
    H2 sections
    H3 sub-sections
    Tables
    Paragraphs / bullet lists
```

### Real Example Heading Structure (IAS 1 Impact on CASs)

```
H1: Amendments to IAS 1 and the Impact on the CASs: Disclosure of Material Accounting Policy Information
H2: Narrow-scope Amendments to IAS 1
H2: What's Changing in the CASs
H2: Disclosures in the Financial Statements Impacted by the Change to IAS 1
  H3: The auditor's responsibilities
H2: About this Publication
```

### Key Field Summary

| Field | CSS Class / ID | Notes |
|---|---|---|
| Publication date | `maincontent_4_newsDate` / `span.date` | Same as news |
| Content type tag | `maincontent_4_newsType` / `span.tag` | "Resource, Guidance" |
| Intro/body | Multiple `.rte-wrapper` in stacked `purple-info-container` | Unlike news (1 block), resources use many blocks |
| Sidebar callout | `col-4 .rte-wrapper` with inline `.gray-div` style | Related links or CTA box |
| Tags | `fras__tags` | E.g. "AASB;Other Canadian Standards;Canadian Auditing Standards" |
| Page type | `fras__pageTypes` | "Resource;Guidance" |

### Important Notes

- Resources use **multiple stacked `purple-info-container` blocks** (up to 6 observed), each with its own `.rte-wrapper`. This is different from news articles which use 1–2 blocks.
- The 2-column layout (`col-8` + `col-4`) appears at least once per resource, typically for a main content section paired with a callout box.
- Resources can contain inline `<style>` blocks in the RTE (via Sitecore `.rte-wrapper` convention).
- The `fras__pageTypes` meta field can contain multiple comma-separated values: `"Resource;Guidance"`.

---

## 7. Standards Section Landing (Overview)

**URL Pattern:** `/en/[section-slug]` (e.g. `/en/cass`, `/en/csqc`, `/en/ifrsstandards`)

This is the landing/overview page for each standards section. Not a detail page per se, but included here as it's the entry point for all project/document/resource detail pages.

### Example Pages

| Section | URL |
|---|---|
| Canadian Auditing Standards | `/en/cass` |
| Canadian Standards on Quality Management | `/en/csqc` |
| IFRS Accounting Standards | `/en/ifrsstandards` |

### Sub-Navigation

Active tab: **"Overview"**

Tab set varies by section:
- CAS/CSQC: Overview, Project Listing, Documents for Comment, Effective Dates, Resources
- IFRS: + IFRIC Agenda Decisions

### Page Layout

```
[Section Title Banner]
[Horizontal Sub-Nav Tabs]
[H1 "Overview"]

[Active Projects Block]
  H2 "Active Projects"  ← class="activeProjectsHeading"
  CTA cards (H3 titles) linking to sub-pages or external resources:
    e.g. "CPA Canada Handbook", "Participate in International Consultations"

[News Block]
  H2 "News"  ← maincontent_6_sectionTitle
  .meetings-news-item list
    .float-items-left > span.date + .update-link + .title + .content-icon
```

### Notes

- This page type is a **hub page** — it aggregates active projects and recent news for the section.
- Not a template that needs its own "detail" implementation; it maps to what the PRD calls the Standards Overview page.
- IFRS section has 3 CTA cards; CAS/CSQC have 1–2.

---

## 8. Cross-Cutting Patterns

These patterns appear across multiple page types and should be implemented as reusable components.

### Section Title Banner

Present on all detail pages. Displays the board/section name above the sub-navigation.

```html
<p class="h2" id="maincontent_1_sectionTitle">Canadian Auditing Standards</p>
```

In POC: This maps to the `<SectionNav>` component's header variant, or a standalone `<SectionTitle>` component.

### Horizontal Sub-Navigation (Second Navigation)

```html
<div class="second-navigation-content">
  <!-- tab links with active state -->
</div>
```

The tabs available differ by section type:
- **Standards sections** (CAS, CSQC, IFRS, ASPE): Overview | Project Listing | Documents for Comment | Effective Dates | Resources | (IFRS only: IFRIC Agenda Decisions)
- **Board sections** (AcSB, AASB, CSSB): About | [Projects or Initiatives] | Meetings | Committees | News Listings | Volunteer Opportunities
- **Council sections** (AcSOC, AASOC, RASOC): About | Meetings | Timelines/Annual Reports | Committees | News Listings | Volunteer Opportunities
- **FRAS-wide**: About | Research Program | News Listings | Contact Us | Job Opportunities | Volunteer Opportunities | My Account

### Staff Contact Card

Present on: project detail, document-for-comment detail, some news articles.

```
H2 "Staff Contact(s)"
  span.staffname       — Name
  span.organization    — Role/title
  div.phone-content    — Phone
  div.mail-content     — Email
```

Can have **multiple contacts** (the Sitecore ID uses `_ContactsRepeater_` with index `_0`, `_1`, etc.).

### Purple Info Container

A recurring layout wrapper used for:
- Project intro + contact sidebar (2-column)
- CTA blocks
- Resource body sections (stacked full-width)

```html
<div class="purple-info-container">
  <div class="row"> <!-- or direct child -->
    <!-- col-sm-8 left + col-sm-4 right, OR col-sm-12 full-width -->
  </div>
</div>
```

### "Read More" Toggle

Two variants:
1. Newer: `.show-text` + `.more-text` + hidden inputs (`#HiddenSeeMoreLabel`, `#HiddenSeeLessLabel`)
2. Older: `span.morecontent` + `a.morelink`

Both truncate long summary text. The POC should implement collapsible long text for project summaries.

### Disclaimer Block

Present on all project detail pages at the bottom.

```
#disclaimer-container > .disclaimer-content
```

Text: "This project summary has been prepared for informational purposes..." (boilerplate legal text). Should be a static component.

### OG Type Differences

| Page Type | og:type |
|---|---|
| News article | `article` |
| Resource/guidance | `article` |
| Project detail | *(not set)* |
| Document for comment | *(not set)* |
| Meeting detail | *(not set)* |

---

## 9. Component Inventory Summary

The following components are needed for 1:1 detail page implementation, mapped to POC component names:

| Component | Used On | POC Name |
|---|---|---|
| Section title banner | All pages | `<SectionHeader>` |
| Horizontal sub-nav tabs | All pages | `<SectionNav variant="tabs">` |
| Breadcrumb | All pages | `<Breadcrumb>` |
| Project summary + contact 2-col | Project, Document | `<ProjectIntro>` |
| Staff contact card | Project, Document, News (optional) | `<StaffContact>` |
| "Read more" toggle | Project, Document | Built into `<ProjectIntro>` |
| Project status timeline | Project | `<ProjectTimeline>` (10 stages, tri-state) |
| CTA button | Project, Document | `<CTAButton variant="purple">` |
| Related news list | Project | `<NewsMeetingsRollup>` |
| Meeting & events list | Project | `<MeetingsList>` |
| Meeting row item | Project | `<MeetingRow>` |
| Download link (PDF) | Document | `<DownloadLink type="pdf">` |
| Internal link item | Document | `<DownloadLink type="internal">` |
| Support materials sidebar | Document | `<SupportMaterials>` |
| Article date + tag banner | News, Resource | `<ArticleMeta>` |
| Article body (RTE) | News, Resource, Meeting | `<RichTextBody>` |
| Stacked content sections | Resource | Multiple `<ContentSection>` |
| 2-column layout | Resource, Project | `<TwoColumnLayout cols="8/4">` |
| Sidebar callout box | Resource | `<SidebarCallout>` |
| Disclaimer block | Project | `<Disclaimer>` |
| Active projects list | Section Landing | `<ActiveProjectsBlock>` |
| News list (section landing) | Section Landing | `<SectionNewsRollup>` |

---

## Appendix: Sitecore Meta Fields

These `fras__*` meta name fields are present on detail pages and inform content modeling:

| Meta Field | Values Observed | Purpose |
|---|---|---|
| `fras__coveoPageTitle` | Article title | Search index title |
| `fras__category` | Board/section name | Search facet |
| `fras__tags` | Semicolon-separated board codes | Search tags |
| `fras__pageTypes` | "News", "Meeting Summary", "Resource", "Guidance", "Resource;Guidance" | Content type facet |
| `fras__publishedDate` | ISO datetime | Date for sorting/display |
| `fras__templateId` | Sitecore GUID | Template identification |
| `fras__itemId` | Sitecore GUID | Item identification |
| `fras__excludeFromIndex` | "false" | Coveo indexing control |

`fras__pageTypes` maps directly to what should be stored as a `type` enum on the `resources` and `events` collections in Payload CMS.
