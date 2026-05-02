# FRAS Canada — Board Sub-Pages Content Audit
**Date:** 2026-04-27
**Purpose:** Document content structure, layout patterns, components, and navigation context for key board sub-pages to inform the 1:1 POC build.
**Source:** Compiled from existing verified accessibility tree snapshots, page-inspections.json, page-types.md, site-discovery-verified.md, and raw DOM crawl data (2026-03-05). Live site access blocked by Cloudflare JS challenge for automated tools — all data is from prior verified chrome-in-chrome sessions.

---

## IMPORTANT: URL STRUCTURE CLARIFICATION

The URLs requested (`/en/acsb/projects-and-implementation/active`, `/en/acsb/consultations`, `/en/acsb/news-and-publications`) **do NOT exist** on the live site. These appear to be proposed POC URL patterns, not live Sitecore URLs.

The live Sitecore structure for these content types is:

| POC URL Concept | Actual Live URL | Notes |
|---|---|---|
| `/{board}/projects-and-implementation/active` | `/en/{standard}/projects` (e.g., `/en/ifrsstandards/projects`) | Projects live under Standards sections, not Board sections |
| `/{board}/consultations` | `/en/{standard}/documents` | Documents for Comment also live under Standards sections |
| `/{board}/news-and-publications` | `/en/{board}/news-listings` | AcSB uses `/en/acsb/news-listings` |
| `/{board}/meetings-and-events` | `/en/{board}/meetings-and-events` | Board-scoped — confirmed live |
| `/{board}/about` | `/en/{board}/about` | Board-scoped — confirmed live |

**Key architectural fact:** Active Projects and Documents for Comment are organized by Standards section (IFRS, ASPE, Public Sector, etc.), not by board. The AcSB oversees multiple standards sections. This is a fundamental IA difference from the proposed POC structure.

---

## 1. AcSB (Accounting Standards Board)

### 1.1 AcSB Board Landing — `/en/acsb`
**Verified via accessibility tree snapshot (2026-03-05)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/acsb` |
| Page Title (meta) | "Accounting Standards Board" |
| H1 | "Accounting Standards Board" |
| Template | T2: Board/Council Landing (Dashboard) |
| Layout | Full-width, no sidebar |
| Sitecore Template ID | `a0418e74-cf42-45c5-a538-26afecca9e62` |

**Breadcrumb:** Home / Accounting Standards Board

**Section Tab Navigation (5 tabs):**
1. ABOUT → `/en/acsb/about`
2. MEETINGS → `/en/acsb/meetings-and-events`
3. COMMITTEES → `/en/acsb/committees`
4. NEWS LISTINGS → `/en/acsb/news-listings`
5. VOLUNTEER OPPORTUNITIES → `/en/acsb/volunteer-opportunities`

**Hero Banner:** AcSB logo (white, on purple-to-blue gradient with dotted circle overlay). Banner image: `acsb-banner-en.png`.

**Content Blocks (in order):**
1. **About Intro Block (gray bg)**
   - H3: "About the AcSB"
   - Body: "The Accounting Standards Board (AcSB) is an independent body with the authority to establish accounting standards for use by all Canadian entities outside the public sector. We serve the public interest by establishing standards for financial reporting by all Canadian private sector entities and by contributing to the development of internationally accepted financial reporting standards."
   - CTA link: "Read more" → `/en/acsb/about`
2. **Contact Block**
   - H3: "Contact the AcSB"
   - CTA link: "Contact us" → `/en/acsb/contact-us`
3. **Flexible Promotional Content Zone**
   - H3: "IFRS® Accounting Standards Discussion Group Meeting – December 9, 2025" (time-sensitive announcement)
   - Excerpt + "Read More" link → `/en/acsb/committees/ifrsdg/ifrsdg-meetings/december-2025`
   - H3: "Stay Up to Date on the Progress of Standard-setting Initiatives" (Newsletter CTA)
   - Body: "Subscribe to The Standard, the Boards and Oversight Council's enewsletter..."
   - Link: "Subscribe" → `/en/my-account/mysubscriptions`
   - H3: "Follow Us on Social Media:"
   - Social links: X (twitter.com/FRASCanada), LinkedIn, YouTube
4. **Meeting & Event Summaries (H2)**
   - "See all meetings & events summaries" link → `/en/acsb/meetings-and-events?tab=pastmeetings`
   - 3 items displayed (title + date + excerpt):
     - "AcSB Decision Summary – January 22, 2026" — IFRS Discussion Group topics
     - "AcSB Decision Summary – December 11, 2025" — ROMRS, Financial Statement Concepts
     - "IFRS® Accounting Standards Discussion Group Meeting Report – December 9, 2025"
5. **News (H2)**
   - "See all news" link → `/en/acsb/news-listings`
   - 3 items displayed (date + category tag + title + excerpt):
     - March 4, 2026 | Document for Comment | "AcSB Exposure Draft – Amendments to the Fair Value Option..."
     - February 27, 2026 | News | "AcSB endorses amendments to several illustrative examples..."
     - February 19, 2026 | News | "IFRS® Accounting Standards Discussion Group – Request for Issues"

**Sidebar widgets:** None (full-width layout). Contact info is an inline block.

---

### 1.2 AcSB Meetings and Events — `/en/acsb/meetings-and-events`
**Verified via accessibility tree snapshot (2026-03-05)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/acsb/meetings-and-events` |
| Page Title (meta) | "Meetings and Events" |
| H1 | "Meetings and Events" |
| Template | T13: Meetings & Events Listing |
| Layout | Full-width, no sidebar |
| Sitecore Template ID | `a0418e74-cf42-45c5-a538-26afecca9e62` |

**Breadcrumb:** Home / Accounting Standards Board / Meetings and Events

**Section Tabs (5):** ABOUT, MEETINGS (active), COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES

**Content Components:**
- **Tab Toggle:** "Upcoming meetings & events" / "Past meetings & events" (default view = Past)
- **Items Per Page Dropdown:** Default 10
- **Paginated List — 10 items visible (page 1 of 18):**
  1. "AcSB Decision Summary – January 22, 2026" — discussed IFRS Discussion Group recommendations, NI 52-112
  2. "AcSB Decision Summary – December 11, 2025" — ROMRS, Performance Report, Financial Statement Concepts
  3. "IFRS® Accounting Standards Discussion Group Meeting Report – December 9, 2025" — Year-end reminders, IFRS 18
  4. "AcSB Decision Summary – November 12-13, 2025" — Revenue – Control Model, Guidance Framework
  5. "On-demand Webinar – AcSB Consultation Paper, 'Detailed Review of ASPE'" (links to ASPE project sub-page)
  6. "AcSB Decision Summary – October 21, 2025" — Retractable Shares, met with IASB + CSA
  7. "On-demand Webinar – AcSB Consultation Paper, 'Detailed Review of ASPE'" (duplicate — webinar repeated)
  8. "IFRS® Accounting Standards Discussion Group Meeting Report – September 18, 2025"
  9. "AcSB Decision Summary – September 16-17, 2025" — Rate-regulated Activities, IFRS 16 Leases
  10. "AcSB Decision Summary – July 15, 2025" — Agriculture, Detailed Review of ASPE
- **Pagination:** Pages 1, 2, 3 … 17, 18 + Next arrow. 18 pages total (~180 items).

**Sidebar widgets:** None.

**Note:** Items include both "Decision Summary" (board meetings) and "Meeting Report" (advisory group meetings) and "On-demand Webinar" — all treated as a single content type in this listing. The listing mixes content types without filter pills.

---

### 1.3 AcSB About — `/en/acsb/about`

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/acsb/about` |
| Page Title (meta) | "About the AcSB" |
| Meta Description | "The Accounting Standards Board (AcSB) is an independent body with the authority to develop and establish accounting standards for use by all Canadian entities outside the public sector." |
| Template | T3: Content Page + Right Sidebar |
| Layout | ~70% main content / ~30% right sidebar |
| Sitecore Template ID | `a247605d-74e0-428c-b909-ce20d4423225` |

**Breadcrumb:** Home / Accounting Standards Board / About the AcSB

**Section Tabs (5):** ABOUT (active), MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES

**Content:** Rich text body about the AcSB's mandate and structure.

**Sidebar (Section Nav):** Vertical nav with sibling page links:
- About ← active
- Terms of Reference
- Members
- Due Process
- International Activities
- Annual Report
- Strategic Plan
- Annual Plan

**Note:** From the verified discovery doc — the About template uses a section nav sidebar (not a staff contact card). This sidebar pattern repeats on all board "About" sub-pages.

---

### 1.4 AcSB Members — `/en/acsb/about/members`
**Verified via discovery doc (T4: People Listing)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/acsb/about/members` |
| Page Title (meta) | "Members" |
| Meta Description | "Accounting Standards Board (AcSB) member biographies" |
| Template | T4: People Listing |
| Layout | ~70% main + ~30% right sidebar |
| Sitecore Template ID | `a247605d-74e0-428c-b909-ce20d4423225` |

**Breadcrumb:** Home / Accounting Standards Board / About the AcSB / Members

**Content:** 2-column grid of member cards. Each card: 205×205px portrait photo + name (linked to bio) + credentials + role label (CHAIR / VICE-CHAIR) + Appointed / Term Expires dates.

**Section groupings:** "VOTING MEMBERS" label separates card groups.

**Sidebar (Section Nav):** Same as About — 8 links: About, Terms of Reference, Members (active/bolded), Due Process, International Activities, Annual Report, Strategic Plan, Annual Plan.

---

### 1.5 AcSB News Listings — `/en/acsb/news-listings`

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/acsb/news-listings` |
| Template | T12: Filtered News/Event Listing |
| Layout | Full-width, no sidebar |

**Breadcrumb:** Home / Accounting Standards Board / News Listings

**Section Tabs (5):** ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS (active), VOLUNTEER OPPORTUNITIES

**Content Components:**
- Category filter pills (board-scoped): All Items, Document for Comment, International Activity, Meeting Summary, News, Resource
- Items per page (10/20/30/All)
- Sort by: Newest/Oldest
- Date range filters
- Paginated listing: date + category tag + title link (purple) + excerpt
- 11 URLs in sitemap for AcSB news-listings (`/en/acsb/news-listings` + 10 detail pages)

**Note:** Board news listings show only content tagged to that board. Items link to standard section pages (e.g., document details live at `/en/ifrsstandards/documents/...`), not under `/en/acsb/`.

---

### 1.6 AcSB Active Projects — `/en/acsb/projects-and-implementation/active`
**URL DOES NOT EXIST on live Sitecore site.**

Active Projects for AcSB-overseen standards live at:
- `/en/ifrsstandards` (Overview tab shows active projects table)
- `/en/ifrsstandards/projects` (Project Listing tab — all projects with status filter pills)
- `/en/aspe` → active projects
- `/en/nfpos` → active projects
- `/en/pensions` → active projects

**Template T6: Project Listing** — used at `/en/{standard}/projects`
- Filter pills: "Active Projects" / "Completed Projects" / "Deferred Projects"
- Timeline table: Project name (link) + milestone badges in Q1/Q2/H2 columns
- Each standards section has its own project listing

**Template T5: Standards Overview** — used at `/en/{standard}` (the tab landing)
- Data table: Project name + 1-2 sentence description
- Shows only active projects on overview

**IFRS project listing has ~100+ entries across IFRS, ASPE, NFP, Pensions standards.**

---

### 1.7 AcSB Consultations (Documents for Comment) — `/en/acsb/consultations`
**URL DOES NOT EXIST on live Sitecore site.**

Documents for Comment live at:
- `/en/ifrsstandards/documents`
- `/en/aspe/documents`
- `/en/nfpos/documents`
- `/en/pensions/documents`

**Template T8: Documents for Comment Listing**
- Tab Toggle: "Open for Comment" / "Closed for Comment"
- Grouped by type: "Exposure Drafts", "Consultation Papers", "Re-exposure Drafts" (gray banner headers)
- Each document: title link + "Submit comment" button (Open) or "View Comments" PDF (Closed)
- No comment deadlines shown on listing (deadline only on document detail)

**March 2026 verified open items included:**
- "AcSB Exposure Draft – Amendments to the Fair Value Option for Investments in Associates and Joint Ventures" (deadline April 20, 2026)

---

## 2. PSAB (Public Sector Accounting Board)

### 2.1 PSAB Board Landing — `/en/psab`
**Verified via accessibility tree snapshot (2026-03-05)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/psab` |
| Page Title (meta) | "Public Sector Accounting Board" |
| H1 | "Public Sector Accounting Board" |
| Template | T2: Board/Council Landing (Dashboard) |
| Layout | Full-width, no sidebar |

**Breadcrumb:** Home / Public Sector Accounting Board

**Section Tab Navigation (5 tabs):**
1. ABOUT → `/en/psab/about`
2. MEETINGS → `/en/psab/meetings-and-events`
3. COMMITTEES → `/en/psab/committees`
4. NEWS LISTINGS → `/en/psab/news-listings`
5. VOLUNTEER OPPORTUNITIES → `/en/psab/volunteer-opportunities`

**Hero Banner:** PSAB logo (white). Banner image: `psab-banner-en.png`.

**Content Blocks (in order):**
1. **About Intro Block (gray bg)**
   - H3: "About PSAB"
   - Body: "The Public Sector Accounting Board (PSAB) was created to serve the public interest by establishing accounting standards for the public sector. We also provide guidance for financial and other performance information reported by the public sector."
   - CTA: "Read more" → `/en/psab/about`
2. **Contact Block**
   - H3: "Contact PSAB"
   - Body: "Need help or have information to share?"
   - CTA: "Contact us" → `/en/psab/contact-us`
3. **Flexible Promotional Content Zone (survey CTA — NOT a newsletter)**
   - H3: "Survey – Government Not-for-Profit: Contributions and Financial Statement Presentation"
   - Body: survey invitation, deadline March 5, 2026
   - External CTA: "Take the survey" → `connect.frascanada.ca` (Pathways platform)
   - **Note:** NO newsletter CTA, NO social links inline on PSAB landing
4. **Meeting & Event Summaries (H2)**
   - "See all meetings & events summaries" → `/en/psab/meetings-and-events?tab=pastmeetings`
   - 3 items:
     - December 9, 2025 | "PSAB Decision Summary – December 9-10, 2025" — PS 3251 Employee Benefits approved
     - November 13, 2025 | "Now Available! Meeting Report from Public Sector Accounting Discussion Group Meeting – November 13, 2025"
     - September 23-24, 2025 | "PSAB Decision Summary – September 23-24, 2025"
5. **News (H2)**
   - "See all news" → `/en/psab/news-listings`
   - 3 items:
     - February 25, 2026 | Volunteer Opportunity, PSAB | "PSAB Volunteer Opportunity – Candidates who Identify as Indigenous..."
     - January 12, 2026 | News | "Media Release – Andrew Newman Named Chair of the Public Sector Accounting Board"
     - November 17, 2025 | International Activity | "International Public Sector Accounting Standards Board (IPSASB) Work Program Consultation..."

**Key difference from AcSB:** No newsletter CTA, no social media links inline, promotional zone shows time-sensitive survey content.

---

### 2.2 PSAB Meetings and Events — `/en/psab/meetings-and-events`

| Field | Value |
|---|---|
| Template | T13: Meetings & Events Listing |
| Layout | Full-width |

**Breadcrumb:** Home / Public Sector Accounting Board / Meetings and Events

**Content:** Same structure as AcSB meetings. Pagination count not confirmed for PSAB (likely similar volume). Terminology: "Decision Summary" (same as PSAB).

Items include both "PSAB Decision Summary" and "Meeting Report from Public Sector Accounting Discussion Group" — mixed types in single listing.

---

### 2.3 PSAB News Listings — `/en/psab/news-listings`

Same template as AcSB news listings (T12). Board-scoped content. Category pills identical. Not separately verified for item count.

---

### 2.4 PSAB Active Projects / Consultations
PSAB-overseen standards:
- `/en/public-sector` — Public Sector Accounting Standards (PSAS)
- `/en/public-sector-international` — International PSAS

Same template patterns as AcSB standards (T5, T6, T7, T8, T9).

The `/en/psab/projects-and-implementation/active` and `/en/psab/consultations` URLs **do not exist**.

---

## 3. CSSB (Canadian Sustainability Standards Board)

### 3.1 CSSB Board Landing — `/en/cssb`

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/cssb` |
| Page Title (meta) | "Canadian Sustainability Standards Board" |
| Template | T2: Board/Council Landing (Dashboard) |
| Layout | Full-width, no sidebar |

**Breadcrumb:** Home / (no extra level — CSSB landing IS the first crumb after Home)

**Section Tabs (5):** ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES

**Hero Banner:** FRAS Sustainability logo (white). `cssb-banner-en.png` NOT confirmed — uses FRAS sustainability variant.

**Content Blocks (verified from discovery doc):**
1. About Intro + "Read more" CTA
2. Contact Block — **bug:** displayed email `cssb.ccnid@frascanada.ca` but mailto href points to `lfrench@frascanada.ca`
3. Flexible Promotional Content Zone — 2 promo blocks (video + strategic plan), NOT a newsletter CTA
4. Meeting & Event Summaries (H2) — 3 items, uses "Decision Summary" terminology
5. News (H2) — 3 items

**Key differences from AcSB:** FRAS Sustainability banner logo. Breadcrumb is only 1 level deep (no "Boards" parent). Contact email bug. No newsletter CTA.

---

### 3.2 CSSB About — `/en/cssb/about`

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/cssb/about` |
| Page Title (meta) | "About" |
| Meta Description | "The Canadian Sustainability Standards Board (CSSB) works with the International Sustainability Standards Board (ISSB) to support the uptake of ISSB standards in Canada." |
| Template | T3: Content Page + Right Sidebar |
| Sitecore Template ID | `a247605d-74e0-428c-b909-ce20d4423225` |

**Breadcrumb:** Home / About (NOTE: only 2 levels — does NOT include "CSSB" as breadcrumb level)

**Section Tabs:** ABOUT (active), MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES

**Sidebar (Section Nav):** Vertical nav — About (active), Members, Terms of Reference, Due Process, FAQs, Statement of Operating Procedures.

**CSSB sidebar has different links than AcSB** — no International Activities, Annual Report, Strategic Plan, Annual Plan. Instead has FAQs and Statement of Operating Procedures.

---

### 3.3 CSSB Members — `/en/cssb/about/members`

| Field | Value |
|---|---|
| Page Title | "Members" |
| Meta Description | "Read about the Canadian Sustainability Standards board members and chair." |
| Template | T4: People Listing |
| Sitecore Template ID | `a247605d-74e0-428c-b909-ce20d4423225` |
| Last Published | 2025-04-15 |

**Breadcrumb:** Home / About / Members

**Content:** Same 2-column member card grid as AcSB. 205×205px portraits. Name + credentials + role label + appointment/term dates.

**Sidebar (Section Nav):** CSSB-specific links — About, Members (active), Terms of Reference, Due Process, FAQs, Statement of Operating Procedures.

---

### 3.4 CSSB Meetings and Events — `/en/cssb/meetings-and-events`

| Field | Value |
|---|---|
| Page Title | "Meetings and Events" |
| Meta Description | "Find more information on the Canadian Sustainability Standards Board's (CSSB) past and upcoming meetings and events." |
| Template | T13: Meetings & Events Listing |
| Sitecore Template ID | `a0418e74-cf42-45c5-a538-26afecca9e62` |
| Last Published | 2025-02-06 |

**Breadcrumb:** Home / Meetings and Events (NOTE: 2 levels only — no CSSB intermediate breadcrumb)

**Terminology:** CSSB uses "Decision Summary" (not "Meeting Summary" like AcSB/PSAB).

**Sitemap count:** 13 meeting pages total under CSSB (`/en/cssb/meetings-and-events` + 12 detail pages).

---

### 3.5 CSSB News Listings — `/en/cssb/news-listings`

6 URLs in sitemap: 1 listing + 5 detail pages. Same T12 template.

---

### 3.6 CSSB Active Projects — `/en/cssb/projects-and-implementation/active`
**URL DOES NOT EXIST.**

CSSB-overseen standards:
- `/en/sustainability` — Canadian Sustainability Disclosure Standards

Active projects at `/en/sustainability/projects`. Same T5/T6 template.

---

## 4. Standards Pages

### 4.1 Standards Landing — `/en/standards`
**URL DOES NOT EXIST.** There is no unified "standards" landing page. Standards are accessed via the "Standards" mega-menu dropdown.

### 4.2 AcSB Standards (IFRS Overview) — `/en/ifrsstandards`
**Verified via accessibility tree snapshot (T5: Standards Overview)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/ifrsstandards` |
| Page Title | "IFRS® Accounting Standards" |
| Template | T5: Standards Overview (Tabbed) |
| Layout | Full-width with section tabs |

**Breadcrumb:** Home / IFRS® Accounting Standards

**Section Tabs (6 — IFRS has one extra tab):**
1. Overview (active on `/en/ifrsstandards`)
2. Project Listing → `/en/ifrsstandards/projects`
3. Documents for Comment → `/en/ifrsstandards/documents`
4. Effective Dates → `/en/ifrsstandards/effective-dates`
5. Resources → `/en/ifrsstandards/resources`
6. IFRIC Agenda Decisions → `/en/ifrsstandards/ifric-agenda-decisions` (IFRS-only tab)

**Hero Banner:** AcSB logo variant or IFRS branding.

**Content Blocks:**
1. Board logo hero (full-width purple gradient)
2. Section title
3. Tab navigation bar (6 tabs)
4. Active Projects table: 2 columns — Project Name (purple link) + Description (1-2 sentences)
5. Optional feature blocks (CPA Handbook CTA, Submit an Issue CTA)
6. News feed (3 items)

---

### 4.3 IFRS Project Listing — `/en/ifrsstandards/projects`
**Verified (T6: Project Listing)**

**Filter pills:** "Active Projects" / "Completed Projects" / "Deferred Projects"

**Timeline Table columns:** 2026 Q1 | 2026 Q2 | 2026 H2 (third column is half-year)

Each row: Project name (purple link) + milestone badges (e.g., "Exposure Draft") in appropriate column.

Sample active projects from sitemap (selected):
- Amendments to the Fair Value Option (IAS 28)
- Rate-regulated Activities
- Climate-related Risks in the Financial Statements
- Financial Statement Concepts (multiple sub-pages)
- Goodwill and Impairment
- Revenue – Control Model (AcSB)
- IFRS for SMEs 3rd edition

**Total project detail pages:** 392 EN pages across all standards sections.

---

### 4.4 AcSB Effective Dates — `/en/acsb/standards/effective-dates`
**URL DOES NOT EXIST.** Effective dates live at `/en/{standard}/effective-dates`.

**Live URL:** `/en/ifrsstandards/effective-dates`
**Template T10: Effective Dates Table**

- Breadcrumb: Home / IFRS® Accounting Standards / Effective Dates
- Full-width tabbed layout
- Intro disclaimer: italic text with link to CPA Canada Handbook on Knotia.ca
- Data table: "Application" / "Pronouncement" bold column headers
- 13 purple section header rows grouping by effective date
- Rich text cells: italic standard names, bullets, footnotes
- Known bug: 2018 section appears before 2019 (out of order)
- Non-semantic markup: `role="presentation"` divs (accessibility concern)

---

## 5. Other Key Pages

### 5.1 Contact Us — `/en/contact-us`
**Verified via accessibility tree snapshot (T15: Contact/Form)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/contact-us` |
| H1 | "Contact Us" |
| Template | T15: Contact / Form Page |
| Layout | Full-width, no sidebar |

**Breadcrumb:** Home / (Contact Us is terminal page, breadcrumb shows only Home + FRASCanada section label)

**Section Tabs (7 — FRASCanada org tabs):**
ABOUT, RESEARCH PROGRAM, NEWS LISTINGS, CONTACT US (active), JOB OPPORTUNITIES, VOLUNTEER OPPORTUNITIES, MY ACCOUNT

**Form fields (all confirmed):**
- Full Name: * (required text input)
- Title: (optional)
- Organization: (optional)
- Email address: * (required — label exactly "Email address:", input type="text" NOT type="email")
- Business Phone: (optional)
- Comments: * (required textarea)
- CAPTCHA: text-based image + 5-char code (e.g., "JA487") + refresh button
- SUBMIT button (purple)

**Below form:**
- H2: "Media Inquiries"
- Staff: Daniella Girgenti, CMP® (Director of Communications)

**Note:** Each board also has its own contact page at `/en/{board}/contact-us` — these are simpler with no form (just email/phone for the relevant staff).

---

### 5.2 Login — `/en/my-account/login`
**Verified (T16: Authentication)**

| Field | Value |
|---|---|
| URL | `https://www.frascanada.ca/en/my-account/login` |
| H1 | (not confirmed — page uses form-centric layout) |
| Template | T16: Authentication Page |
| Layout | Full-width, no sidebar |

**Form fields:**
- "User Name (email address):" — type="text" input (not type="email")
- "Password:" — password input
- "Forgot your User Name?" link inline → `/en/my-account/forgot-username`
- "Forgot your Password?" link inline → `/en/my-account/forgot-my-password`
- Purple full-width "Log in" button (2 words — NOT "Login")

**Below form:**
- "Not registered yet?" + "Create My account" link → `/en/my-account/register`
- CPA Canada auth explanation (shared credentials with CPA Canada)
- Support: customerservice@cpacanada.ca, 1 (800) 268-3793, +1 (416) 977-0748

**No CAPTCHA. No "Remember me" checkbox. ASP.NET PostBack.**

---

### 5.3 Volunteer Opportunities — `/en/volunteer-opportunities`

| Field | Value |
|---|---|
| Template | T12 variant: Board-tabbed listing |
| Layout | Full-width |

**Unique feature:** Uses board-based category TABS (not pills) — AASB / CSSB / PSAB / RASOC / AcSB. Filters volunteer listings by board.

Items: Date + category tag + title link + excerpt. External URLs open on Pathways Executive Search (pathwaysexecutivesearch.com).

Each board also has: `/en/{board}/volunteer-opportunities` (board-scoped version).

---

## 6. Board Comparison Matrix

| Element | AcSB | PSAB | CSSB | AASB | RASOC |
|---|---|---|---|---|---|
| Tab count | 5 | 5 | 5 | **6** | **6** |
| Extra tab | — | — | — | Initiatives | Recruitment Guidelines |
| Promotional zone | Newsletter CTA + Social | Survey CTA | 2 promo blocks | 2 promo blocks (CAS 570 + Roundtable) | Newsletter CTA + social pills |
| Social links (inline on landing) | Yes | No | No | No | **Yes** (purple pills) |
| Meeting terminology | Decision Summary | Decision Summary | Decision Summary | Decision Summary | Meeting Minutes |
| Newsletter CTA | **Yes** | No | No | No | **Yes** |
| Breadcrumb depth | 2 levels (Home > Board) | 2 levels | **1 level** (Home > About, skips CSSB) | 2 levels | 2 levels |
| Upcoming meetings section | No | No | No | **Yes** | No |
| Contact block | Link to /contact-us | Link to /contact-us | Email (bug) | Email | Button to /rasoc/contact-us |
| Hero banner logo | AcSB | PSAB | FRAS Sustainability | AASB | RASOC |
| Standards overseen | IFRS, ASPE, NFP, Pensions | PSAS, IPSAS | Sustainability | CAS, CASS, CSQM | — |
| Standards page URL | /ifrsstandards, /aspe, /nfpos, /pensions | /public-sector, /public-sector-international | /sustainability | /cass, /csqc, /other | — |

---

## 7. Navigation Architecture Summary

### Board Nav (confirmed section tabs for each board):

**AcSB (5 tabs):** About | Meetings | Committees | News Listings | Volunteer Opportunities

**PSAB (5 tabs):** About | Meetings | Committees | News Listings | Volunteer Opportunities

**CSSB (5 tabs):** About | Meetings | Committees | News Listings | Volunteer Opportunities

**AASB (6 tabs):** About | Initiatives | Meetings | Committees | News Listings | Volunteer Opportunities

**RASOC (6 tabs):** About | Recruitment Guidelines | Meetings | Committees | News Listings | Volunteer Opportunities

### Standards Nav (confirmed tabs for each section):

**All standards (5 tabs):** Overview | Project Listing | Documents for Comment | Effective Dates | Resources

**IFRS only (6 tabs):** adds "IFRIC Agenda Decisions"

### AcSB About section nav sidebar (confirmed 8 links):
About | Terms of Reference | Members | Due Process | International Activities | Annual Report | Strategic Plan | Annual Plan

### CSSB About section nav sidebar (confirmed 6 links, different from AcSB):
About | Members | Terms of Reference | Due Process | FAQs | Statement of Operating Procedures

---

## 8. POC Build Implications

### URL Schema Decisions Required
The Sitecore site organizes content by Standards section, not by Board. The POC needs to decide:

**Option A (mirror Sitecore):** Projects + Documents for Comment live at `/standards/{standard}/projects` and `/standards/{standard}/documents`. Board pages link out to them.

**Option B (reorganize by board):** Projects + Documents for Comment are accessible from board pages. This requires either:
- Cross-referenced collection queries (a project tagged to AcSB shows on `/acsb/projects`)
- Or separate board-centric listing pages that aggregate across multiple standards

**Recommendation:** The PRD uses "active" filter at board level (`/en/acsb/projects-and-implementation/active`) — this suggests Option B for the POC. The board landing has a `relatedStandards` relationship that can drive the filtered view. Projects and Documents for Comment should have a `board` field for this purpose.

### Content Fields Confirmed Needed (from live site observation)
| Field | Where Visible | Notes |
|---|---|---|
| meeting.type | Meetings listing (mixed content) | "Decision Summary" / "Meeting Report" / "On-demand Webinar" — different event types appear in same listing |
| meeting.board | All meeting pages | For board-scoped filtering |
| news.board | News listings | Already planned |
| project.standards | Project detail | Cross-reference to standards section |
| board.promotionalContentZone | Board landing | Flexible content block — can be newsletter, survey, promo |
| board.tabConfig | Board landing | Different tab counts per board |
| document.type | Documents listing | "Exposure Draft" / "Consultation Paper" / "Re-exposure Draft" |
| member.photo | Members listing | 205×205px required |
| member.role | Members listing | CHAIR / VICE-CHAIR enum |
| contact.email_display | Board landing | Separate from mailto href (bug exists on live) |

### Breadcrumb Depth Inconsistency
CSSB breadcrumb is shallower than AcSB/PSAB (skips board name level). In our POC, standardize: all board pages should show `Home / {Board Name} / {Section}`.

### Meeting Terminology by Board
In the POC, the `events.type` enum should support all observed values:
- `decision-summary` (AcSB, PSAB, CSSB, AASB)
- `meeting-minutes` (RASOC only)
- `meeting-report` (advisory group meetings — appears in AcSB and PSAB listings)
- `webinar` (on-demand webinars appear in AcSB meetings listing)
- `discussion-group-meeting-report` (IFRS Discussion Group, Public Sector Discussion Group)

### Items Without POC Coverage
These pages were requested but have no POC-equivalent planned yet:
- `/en/acsb/committees` — 13 committees, T14 template — needs Committee Index + Committee Detail pages
- Individual committee pages (e.g., `/en/acsb/committees/ifrsdg`) — has meeting reports as sub-pages
- `/en/volunteer-opportunities` board-tabbed listing — Phase 2 planned

---

## 9. Data Sources Used

| Source | Coverage |
|---|---|
| `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/acsb-snapshot.txt` | Full accessibility tree: AcSB landing + Meetings listing |
| `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/psab-snapshot.txt` | Full accessibility tree: PSAB landing |
| `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/04-meetings-events-snapshot.txt` | Full accessibility tree: AcSB meetings listing |
| `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/03-contact-us-snapshot.txt` | Full accessibility tree: Contact Us form |
| `/Users/garson/03--fishtank/fras/.ai-reports/dogfood-frascanada/site-discovery-verified.md` | All 17 templates + field-level specs |
| `/Users/garson/03--fishtank/fras/data/page-inspections.json` | 95 pages — metadata, breadcrumbs for all board pages |
| `/Users/garson/03--fishtank/fras/.ai-reports/dogfood-frascanada/page-types.md` | 36 page types, all URLs by type |
| `/Users/garson/03--fishtank/fras/.ai-reports/dogfood-frascanada/report.md` | Sitemap hierarchy, page counts |
