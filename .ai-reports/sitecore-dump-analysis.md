# FRAS Canada — Sitecore Dump & UX Research Analysis

**Date:** 2026-03-04
**Sources:** `data/old-fras-dump/` — Architecture XLSX, Website Survey XLSX, 6 Journey Map PDFs, Opportunity Mapping PDF, Slides PDF, Branding Guidelines PDF (Feb 2017)
**Purpose:** Extract actionable insights from legacy Sitecore data and UX research, cross-reference against existing PRDs

---

## 1. User Personas (6 Journey Maps)

### 1.1 Amanda — Board Member / Vice-Chair (PSAB)
- **Role:** Financial statement analysis expert
- **Usage:** Regular — sends project links to colleagues, verifies board member names, checks project publication
- **Primary path:** Direct navigation via saved links
- **Key pain points:**
  - Homepage is text-heavy, no "Start Here" for non-experts
  - Search unreliable, no filters by board/project
  - Exposure drafts buried under confusing links + nested navigation
  - Webinar registration links buried at bottom of pages
  - No meaningful linkages between FRAS and KNOTIA platform
  - Colleagues confused by navigation when receiving shared links
- **Key quote:** "Having links to active projects under the Public Sector Accounting Standards section is useful for keeping up to date with my work."
- **Top opportunities:** "Start Here" onboarding section, quick-share feature, search filtering, KNOTIA cross-links

### 1.2 Chris — Board Member / Vice-Chair (AcSB)
- **Role:** Financial statement analysis expert
- **Usage:** Regular — tracks board decisions, reviews decision summaries, accesses exposure drafts
- **Primary path:** Newsletter → Google (not FRAS search) → Standards page → Project page
- **Key pain points:**
  - Uses Google to find FRAS content because site search is unreliable
  - Navigates multiple pages to find project details, often incomplete/missing
  - Downloads PDFs via Google instead of site search
  - **403 errors when attempting to log in or submit comments**
  - Excessive scrolling, lack of structure
- **Key quote:** "I appreciate that critical documents are available, even if hard to find."
- **Top opportunities:** Better SEO, left navigation bar on project pages, PDF file-type filtering in search, stable comment submission

### 1.3 Melissa — Manager, National Account Standards (Red Deer, AB)
- **Role:** Private enterprise accounting standards focus
- **Usage:** Weekly — reviews meeting summaries, project statuses, submits comments, accesses response letters
- **Primary path:** Types "FRAS Canada" in browser → lands on Accounting Standards page → Decision Summaries → Project pages
- **Key pain points:**
  - Related documents not centralized on project page (jumps between pages)
  - **Comment submission unreliable — no confirmation email, page sometimes breaks**
  - News sorted by meeting date, not publication date — easy to miss new posts
  - Response letters not linked from project pages
  - Multiple layers to reach documents
- **Key quote:** "This process feels unreliable — there's no confirmation email or tracking, and sometimes the page breaks."
- **Top opportunities:** "Recently Published" sort filter, centralized project page, submission confirmation + tracking, response letter linking

### 1.4 Mohamed — Accountant, 10+ Years Policy Work
- **Role:** Accounting policy specialist
- **Usage:** Monthly — tracks board decisions, reviews minutes, submits proposal feedback
- **Primary path:** Newsletter → Google (not FRAS) → Standards page → Project page → IAS Plus (comparison)
- **Key pain points:**
  - FRAS rarely appears in Google results — uses Deloitte IAS Plus instead
  - Dead pages for completed projects (no completion announcements)
  - No left navigation on project pages — excessive scrolling
  - Comment submission technical issues + dead pages
  - Homepage wastes space, search functionality poor
- **Key quote:** "A prominent, functional search bar on the homepage would be a big improvement. It just needs to work effectively to get me to what I'm looking for."
- **Top opportunities:** Three-column layout (like IAS Plus), centralized project timeline with status indicators, completion announcements, SEO improvement

### 1.5 Philip — CFO, 30+ Years Experience
- **Role:** Small accounting team lead, engages with private enterprise + sustainability + NFP standards
- **Usage:** Regular — newsletter-driven, explores news/projects, reviews exposure drafts, checks volunteer opportunities
- **Primary path:** Newsletter → Homepage → News/Projects → Standards/Boards → Volunteer → Search
- **Key pain points:**
  - Action buttons buried at bottom of project pages
  - **Dark purple Reply area made him think page was over** — missed the CTA entirely
  - Search required manual filtering to find desired documents
  - Prefers browsing over search because search is unreliable
  - No personalization features
- **Key quote:** "The fact that you can cut 50% of what is on the website out of my life by having that one dropdown that I never touch — that's kind of what I want."
- **Top opportunities:** Prominent CTAs at top of project pages, left nav bar, volunteer opportunity filters, personalized dashboard (like IFRS), centralized webinar hub

### 1.6 Shari — Lecturer, University of Waterloo (20+ Years)
- **Role:** Accounting education + technical advising, professional development courses
- **Usage:** Frequent — references standards/guidance, reviews meeting notes, accesses podcasts/webinars
- **Primary path:** Newsletter → Homepage → Standards → Boards → Project pages → Search
- **Key pain points:**
  - Podcast categorized under "Other" instead of under relevant project/standard
  - Standards not directly linked under boards (must manually switch sections)
  - Meeting notes now HTML only, prefers PDF for printing/annotation
  - Project resources scattered across multiple clicks
  - Avoids search due to past inaccurate results
  - Previous FRAS website (5-6 years ago) had more logical navigation
- **Key quote:** "It's nicely organized [IFRS]. These are what's published. This is anything that we publish that relates to this project."
- **Top opportunities:** IFRS-style tab layout, multi-column project navigation, better resource categorization under projects/standards

---

## 2. Cross-Persona Pain Point Synthesis

### Universal Pain Points (mentioned by 4+ personas)

| Pain Point | Personas | Our Solution |
|-----------|----------|-------------|
| **Search is unreliable/avoided** | All 6 | Meilisearch with faceted search ✅ |
| **Navigation is confusing/excessive clicking** | All 6 | Redesigned mega-menu + SectionNav ✅ |
| **Documents scattered across pages** | Amanda, Melissa, Mohamed, Shari | Centralized project page with related docs ✅ |
| **Comment submission unreliable** | Chris, Melissa, Mohamed | New form system with email confirmation ✅ |
| **CTAs/action buttons buried** | Amanda, Philip, Mohamed | Wireframes place CTAs prominently ✅ |

### Common Pain Points (mentioned by 2-3 personas)

| Pain Point | Personas | Our Solution |
|-----------|----------|-------------|
| **Uses Google instead of FRAS search** | Chris, Mohamed | Meilisearch + better SEO needed |
| **IAS Plus / IFRS preferred for layout** | Mohamed, Shari, Philip | Tab layout in wireframes (partial) |
| **No left navigation on project pages** | Chris, Mohamed, Philip | SectionNav sidebar component ✅ |
| **Newsletter could be improved** | Amanda, Shari | Out of scope (HubSpot handles newsletter) |
| **Prefers PDF format** | Melissa, Shari | PDF downloads maintained in rebuild ✅ |

---

## 3. Opportunity Mapping (from UX research team)

The UX team categorized all persona opportunities by website area, ranked by frequency:

| Area | # Opportunities | Priority |
|------|----------------|----------|
| **Project Page** | 13 | Highest friction area |
| **Homepage** | 5 | Second highest |
| **Search** | 4 | Third |
| **FRAS Newsletter** | 4 | Out of scope (HubSpot) |
| **Standards Page** | 3 | Covered in Phase 2 |
| **Board Page** | 2 | Covered in Phase 1 |
| **Navigation** | 1 | Covered in Phase 1 |
| **Volunteer** | 1 | Covered in Phase 2 |
| **Users Profile** | 1 | Out of scope (Phase 4+) |

**Three strategic themes identified by UX team:**
1. **Building off the newsletter** — use newsletter engagement to drive site engagement, overlap with LinkedIn
2. **More personalization** — users asking for tailored experience (like IFRS website)
3. **Evolving the search** — clear need for advanced search controls

---

## 4. Branding Guidelines Analysis (Feb 2017)

### 4.1 Logo System

| Entity | Acronym | Type |
|--------|---------|------|
| FRAS Canada | FRAS / NIFC (FR) | Parent brand |
| Auditing and Assurance Standards Board | AASB / CNAC (FR) | Board (sub-brand) |
| Public Sector Accounting Board | PSAB / CCSP (FR) | Board (sub-brand) |
| Accounting Standards Board | AcSB / CNC (FR) | Board (sub-brand) |
| Auditing and Assurance Standards Oversight Council | AASOC / CSNAC (FR) | Council (sub-brand) |
| Accounting Standards Oversight Council | AcSOC / CSNC (FR) | Council (sub-brand) |

**Note:** This 2017 guide shows AASOC and AcSOC as the oversight councils. RASOC is not present — it was likely created after 2017, or RASOC combines/replaces these. Our PRDs list RASOC as the single oversight council. Need to confirm the current state.

### 4.2 Official Color Palette

| Color | Usage | Pantone | RGB | Hex | Our Token |
|-------|-------|---------|-----|-----|-----------|
| **FRAS Purple** | Primary brand | #7658 | 96, 32, 92 | **#60205B** | `--color-primary: #601F5B` ✅ (1 char diff) |
| **Blue** | AASOC, AcSOC | #7687 | 0, 67, 140 | **#00438C** | Not in design tokens |
| **Red-Brown** | AcSB, AASB, PSAB | #7628 | 153, 51, 51 | **#983232** | Not in design tokens |
| **Blue 50%** | Supporting | — | 122, 135, 186 | **#7986B9** | Not in design tokens |
| **Red-Brown 50%** | Supporting | — | 202, 133, 121 | **#C98578** | Not in design tokens |
| **Black** | Text | — | 0, 0, 0 | **#000000** | `--color-text-primary: #333333` (different) |
| **Dark Gray** | Text | — | 51, 51, 51 | **#323232** | Closest: `--color-text-primary: #333333` |
| **Gray** | Supporting | — | 167, 169, 172 | **#A7A9AB** | Not in design tokens |

**Key finding:** The brand guide purple (#60205B, RGB 96,32,92) closely matches our design token purple (#601F5B, RGB 96,31,91). 1-digit difference — effectively the same color. This **confirms the purple is correct**.

**Missing from our tokens:** The board-specific colors (blue #00438C for oversight councils, red-brown #983232 for boards). These may be needed for board-specific branding on Board Detail pages.

### 4.3 Official Typeface

**Brand typeface: Arial** (all variants: Regular, Bold, Italic, Bold Italic, Narrow, Black)

| Source | Font |
|--------|------|
| Brand Guidelines (2017) | **Arial** |
| Live site (current) | **Roboto** |
| Wireframes (Figma) | **Inter** |
| Our design tokens | Says use Inter (wireframe) unless client specifies otherwise |

**This is a three-way conflict.** The official brand font is Arial, the live site switched to Roboto at some point, and wireframes use Inter. The brand guidelines explicitly state Arial "is to be used for all text headings and body copy." However, these guidelines are from 2017 and the site has since moved to Roboto — the brand guidelines may be outdated.

**Recommendation:** Keep this as a design team decision (already flagged). Inter is the best modern choice (closest to the Arial/Roboto lineage, better web rendering). But if brand compliance is strict, Arial is the official answer.

### 4.4 Logo Digital Specifications

| Logo Type | Min Digital Size |
|-----------|-----------------|
| FRAS with descriptor | 100px height |
| FRAS without descriptor | 40px height |
| Board/council with descriptor | 60px height |
| Board/council acronym only | 30px height |
| Favicon | 16x16px (circle symbol) |

**Implementation note:** Protected space = 1x wordmark height around all sides. Logo must always appear with the circle symbol — never wordmark alone.

### 4.5 French Logo Names

| English | French |
|---------|--------|
| FRAS Canada | NIFC Canada |
| AASB | CNAC |
| PSAB | CCSP |
| AcSB | CNC |
| AASOC | CSNAC |
| AcSOC | CSNC |

These FR names are needed for the bilingual language switcher and FR page variants.

---

## 5. Website Survey Analysis (~75 respondents)

### 5.1 Response Demographics
- ~67 English + ~8 French respondents
- Mix of: Board/council staff, volunteers, public accountants, auditors, students, government, public members
- Nearly all use desktop/laptop (only 2 smartphone, 1 tablet users)

### 5.2 Top Pain Points (ranked by frequency)

1. **"Searching for content"** — mentioned by majority of respondents as biggest challenge
2. **"Navigating the menu"** — several respondents find navigation confusing
3. **Document submission instability** — "very unstable" with no confirmation feedback
4. **Meeting summaries sorted by occurrence date, not post date** — easily missed when posted late
5. **Finding documents in other language** — FR translators struggle when PDFs don't have URL-swappable paths
6. **Outdated/missing content** — broken links, 404s, stale information
7. **Decision summaries hard to find** — users want them organized by topic, not just chronologically

### 5.3 Feature Requests (from survey free-text responses)
- Decision summaries organized by topic
- Implementation guidance for standards
- Clearer project status indicators
- Better searchability
- More resources/guidance documents
- Mobile-friendly (though most use desktop)

### 5.4 Key Insight
**Board staff themselves rate the site "Very difficult" to use.** When the internal team finds the tool frustrating, external stakeholders are likely experiencing even worse friction.

---

## 6. Site Information Architecture (from Architecture XLSX)

The official IA tree from Sitecore:

```
Home
├── Council (RASOC)
│   ├── About
│   ├── Members
│   ├── Annual Report
│   ├── Meetings
│   ├── Committees
│   ├── News
│   ├── Volunteer
│   └── Recruitment Guidelines
├── CSSB (Board)
│   ├── About (4 sub-pages)
│   ├── Meetings
│   ├── Committees (5 named committees)
│   ├── News
│   └── Volunteer
├── AcSB (Board)
│   ├── About (7 sub-pages)
│   ├── Meetings
│   ├── Committees (6 named committees)
│   ├── News
│   └── Volunteer
├── PSAB (Board)
│   ├── About (7 sub-pages)
│   ├── Meetings
│   ├── Committees (6 named committees)
│   ├── News
│   └── Volunteer
├── AASB (Board)
│   ├── About (6 sub-pages)
│   ├── Meetings
│   ├── Committees (4 named committees)
│   ├── News
│   └── Volunteer
├── Standards (9 sections)
│   ├── IFRS (Overview, Projects, Docs for Comment, Effective Dates, Resources)
│   ├── Sustainability (same structure)
│   ├── CAS (same structure)
│   ├── CSQM (same structure)
│   ├── CSRS (same structure)
│   ├── ASPE (same structure)
│   ├── PS (same structure)
│   ├── NFP (same structure)
│   └── Pension Plans (same structure)
├── My Account
│   ├── Login
│   ├── Forgot Username
│   └── Forgot Password
└── Footer Links
    ├── Careers
    ├── Contact Us
    ├── Accessibility Policy
    ├── Privacy Policy
    ├── Terms of Use
    └── Site Map
```

### 6.1 IA Cross-Reference Against PRDs

| Sitecore IA Section | PRD Coverage | Notes |
|---------------------|-------------|-------|
| Council (RASOC) | Phase 1 (partial — footer + About nav) | RASOC rules documented. No Board Detail page for RASOC. |
| 4 Boards (CSSB, AcSB, PSAB, AASB) | Phase 1 ✅ | Board Detail pages with tabs |
| Board > About sub-pages | Phase 2 (content pages) | 4-7 sub-pages per board |
| Board > Meetings | Phase 2 ✅ | T13 Meetings Listing |
| Board > Committees | Phase 2 ✅ | T14 Committee Index |
| Board > News | Phase 2 ✅ | T10 News Listing |
| Board > Volunteer | Phase 2 ✅ | T12 variant |
| Standards (9 sections × 5 sub-pages) | Phase 1 + 2 ✅ | All 5 sub-page types covered |
| My Account (Login, Forgot) | Phase 2 ✅ | T16 + auth forms |
| Footer links (Careers, Contact, etc.) | Phase 2 ✅ | T17 Jobs, T15 Contact |
| Accessibility/Privacy/Terms | Phase 2 (content pages) | Generic content template |

**Coverage: 100% of Sitecore IA is accounted for** across Phase 1 + Phase 2. No missing page types.

**Note on RASOC in IA:** The Sitecore IA shows RASOC at the same level as boards with its own About, Members, Annual Report, Meetings, Committees, News, and Volunteer sub-pages. Our PRD correctly limits RASOC (no Board Detail page, no search facet), but the IA confirms RASOC still needs content pages for About, Members, Annual Report, etc. These would be handled by Phase 2 content page templates.

---

## 7. Cross-Reference: New Gaps Found

### 7.1 New Items Not in PRDs

| # | Gap | Source | Priority | Phase |
|---|-----|--------|----------|-------|
| 1 | **"Start Here" / onboarding section** — Amanda asked for glossary, acronym guide, simplified explanations for non-experts | Journey Map (Amanda) | Medium | Phase 1 (homepage) |
| 2 | **PDF file-type filter in search** — Chris specifically wants to filter search results by PDF | Journey Map (Chris) | Low | Phase 1 (search facet) |
| 3 | **"Recently Published" sort option** — Melissa wants to sort news by post date, not meeting date | Journey Map (Melissa) | Medium | Phase 2 (news listing) |
| 4 | **Project completion announcements** — Mohamed wants clear notice when projects finalize | Journey Map (Mohamed) | Low | Phase 2 |
| 5 | **Quick-share / link copy feature** — Amanda wants easy URL sharing for colleagues | Journey Map (Amanda) | Low | Phase 1 |
| 6 | **Board-specific brand colors** — blue (#00438C) for councils, red-brown (#983232) for boards — not in design tokens | Branding Guidelines | Medium | Phase 1 |
| 7 | **French logo names** — NIFC, CNAC, CCSP, CNC, CSNAC, CSNC needed for bilingual implementation | Branding Guidelines | Medium | Phase 1 |
| 8 | **AASOC/AcSOC → RASOC reconciliation** — 2017 brand guide shows 2 oversight councils, current site has 1 (RASOC). Confirm current state. | Branding Guidelines | Low | Clarification |

### 7.2 Items Already Covered (Validation)

| User Request | Our Solution |
|-------------|-------------|
| Better search with filters | Meilisearch + faceted search ✅ |
| Left navigation on project pages | SectionNav sidebar ✅ |
| Centralized project documents | Project Detail page with related docs ✅ |
| Prominent CTAs at top of pages | Wireframe placement ✅ |
| Reliable comment submission | New form system + email confirmation ✅ |
| Board/standards cross-linking | Mega-menu + board detail pages ✅ |
| Project timeline with status indicators | Timeline stepper component (up to 7 stages) ✅ |
| Webinar registration visibility | Phase 2 events pages ✅ |
| Volunteer opportunity filters | Phase 2 volunteer listing ✅ |

### 7.3 Future Phase Opportunities (Phase 4+)

| Opportunity | Source | Notes |
|-------------|--------|-------|
| Personalized dashboard (like IFRS) | Philip, Mohamed | Requires user profiles, preferences storage |
| KNOTIA cross-linking | Amanda | External platform integration |
| Newsletter engagement optimization | UX team | HubSpot feature, not website |
| Three-column layout (like IAS Plus) | Mohamed | Partially addressed by SectionNav + sidebar |

---

## 8. Design Token Updates Needed

### 8.1 Font Decision (Updated Context)

| Source | Font | Date |
|--------|------|------|
| Brand Guidelines | **Arial** | Feb 2017 |
| Live Sitecore site | **Roboto** | Current |
| Wireframes (Figma) | **Inter** | Jul 2025 |

All three are in the same sans-serif family. **Inter** is the modern web-optimized equivalent and is the wireframe designer's choice. Recommend Inter unless brand team insists on Arial.

### 8.2 Board-Specific Colors (from Brand Guidelines)

These colors are NOT in our current design tokens but may be needed for board branding:

```css
/* Board-specific brand colors (from 2017 Brand Guidelines) */
--color-brand-fras: #60205B;        /* Purple — already have as #601F5B */
--color-brand-councils: #00438C;     /* Blue — AASOC/AcSOC/RASOC */
--color-brand-councils-light: #7986B9; /* Blue 50% tint */
--color-brand-boards: #983232;       /* Red-brown — AcSB/AASB/PSAB */
--color-brand-boards-light: #C98578;  /* Red-brown 50% tint */
--color-brand-gray: #A7A9AB;         /* Supporting gray */
```

---

*Analysis completed 2026-03-04. Sources: 9 documents from `data/old-fras-dump/`.*
