# Sitecore Content Tree -- FRAS Canada Full Dump (1GB)

## Summary
- **Total top-level sections under Home:** 43 named directories
- **Board/council sections:** 7 (AcSB, AASB, PSAB, AcSOC, AASOC, CSSB, CASS)
- **Standards sections:** 7 (IFRSStandards, ASPE, NFPOS, CSQC, Public-Sector, Other, Pensions)
- **Other content sections:** Sustainability, About, FAQs, Research-Program, Due-Process, Contact-Us, My-Account, Redirects, News-Listings, Volunteer-Opportunities, Job-Opportunities, International-Activities, etc.
- **Site-Components:** 15 shared component folders (Tags, Staff-Contacts, Banners, Navigation, etc.)
- **Configurations:** Settings + Messaging
- **Sitecore templates identified:** 7 distinct content templates (homepage, standard page, internal or external news page, project, member, meeting details, document for comment, staff contact)
- **Content is bilingual:** EN and FR versions stored in parallel under each GUID
- **Versioning:** Items have multiple versions (e.g., Home has 34 EN versions, AcSB has 23 EN versions)
- **IRCSS-Home:** Separate site section (Independent Review Committee on Standard Setting)

## Content Tree Map

### Fras/ (Top Level)
```
Fras/
  {FF49A3BF-...}/          -- Fras item GUID
  Configurations/
    Messaging/
      Labels/
    Settings/
      AptifyURLs/
      Button-Styles/
      Colors/
      Contact-Forms-Data/
      Dynamic-Columns/
      Email-Addresses/
      Form-Configurations/
      New-Dictionary-Domain/
      Number-of-Results/
      Preference-centre-URLs/
      System-Configurations/
      Tag-Icons/
  Home/                     -- Main content tree
  IRCSS-Home/              -- Independent Review site (separate)
  Site-Components/         -- Shared reusable components
```

### Fras/Home/ (Main Content Tree)
```
Home/
  {88FC40FF-...}/                -- Homepage item (template: "homepage")

  ---- BOARDS & COUNCILS ----
  AcSB/                          -- Accounting Standards Board
    About/
      Annual-Plan/
      Annual-Reports/
      current-work-plan/
      Due-Process/
      due-process-considerations/
      International-Activities/
      Members/ (16 members)
      Strategic-Plan/
      Terms-of-Reference/
      what-are-accounting-/
    Committees/ (12 committees)
      aac, aag, cawg, ifrsdg, iicmsg, itrc, nfpac, peac, ppwg, spwg, uac
    Contact-Us/
    Meetings-and-Events/ (~82 items: decision summaries, meetings, webinars)
    News-Listings/ (~170 items: news, announcements, reports)
    Page-Components/
    Submit-Comment/
    Volunteer-Opportunities/ (~22 items)

  AASB/                          -- Auditing and Assurance Standards Board
    About/
      Annual-Plan, Annual-Report, Due-Process, international-activities
      Members/ (17 members)
      Strategic-Plan, Terms-of-Reference
    Committees/ (14 committees)
      aasbsc, aeag, eer, fofireferencegroup, fofitaskforce,
      fraud-advisory-group, going-concern-advisory-group,
      joint-fraud-going-concern-reference-group, jps-joint-task-force,
      less-complex-entities, qcag, sac, srag
    Contact-Us/
    Effective-Dates/ (1 page + Page-Components)
    Initiatives/ (Page-Components only)
    Meetings-and-Events/ (~58 items)
    News-Listings/ (~107 items)
    Page-Components/
    Submit-Comment/
    Technology/ (Page-Components only)
    Volunteer-Opportunities/ (~14 items)
    Volunteer-Opportunities-TEST/

  PSAB/                          -- Public Sector Accounting Board
    About/
      Annual-Plan, Annual-Report, Due-Process, International-Activities
      Members/ (17 members)
      Strategic-Plan, Terms-of-Reference, What-are-public-sector-standards
    Committees/ (8 committees)
      cufptf, figoe, gnfpac, iag, psadg, Standard-Page, tag
    Contact-Us/
    Meetings-and-Events/ (~46 items)
    News-Listings/ (~81 items)
    Page-Components/
    Submit-Comment/
    Volunteer-Opportunities/ (~13 items)

  CSSB/                          -- Canadian Sustainability Standards Board
    about/
    chair-role/
    cssb-video-transcript/
    implementation-committee/
    meetings-and-events/ (~5 items)
    news-listings/ (~22 items)
    Page-Components/
    Submit-Comment/
    volunteer-opportunities/ (~3 items)

  AcSOC/                         -- Accounting Standards Oversight Council
    About/
      annual-reports, Members/ (27 members), Statement-Operating-Procedures,
      Terms-of-Reference
    AcSOC-activities/
    Committees/
    Contact-Us/
    Meetings-and-Events/
    News-Listings/ (~15 items)
    Page-Components/
    Volunteer-Opportunities/

  AASOC/                         -- Auditing and Assurance Standards Oversight Council
    AASOC-activities/
    About/
      Annual-Report, Members/ (18 members), public-interest,
      Statement-Principal-Operating-Procedures, Terms-of-Reference
    Committees/
    Contact-Us/
    Meetings-and-Events/
    News-Listings/ (~10 items)
    Page-Components/
    Volunteer-Opportunities/

  CASS/                          -- Canadian Auditing Standards (AASB standards area)
    Documents/ (14 items)
    Effective-Dates/
    Page-Components/
    Projects/ (18 items: audit-evidence, auditor-reporting, fraud, going-concern, group-audits, etc.)
    Resources/ (5 items)

  ---- STANDARDS SECTIONS ----
  IFRSStandards/                 -- International Financial Reporting Standards
    Documents/ (~33 items: exposure drafts, amendments)
    Effective-Dates/ (1 page)
    IFRIC-Agenda-Decisions/ (1 page)
    Page-Components/
    Projects/ (~104 items: amend-ias-*, amend-ifrs-*, annual-improvements-*, etc.)
    Resources/ (~16 items)

  ASPE/                          -- Accounting Standards for Private Enterprises
    Documents/ (~20 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~32 items)
    Resources/ (~7 items)

  NFPOS/                         -- Not-for-Profit Organizations Standards
    Documents/ (~9 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~17 items)
    Resources/ (~3 items)

  CSQC/                          -- Canadian Standards on Quality Management
    Documents/ (~4 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~3 items)
    Resources/

  Public-Sector/                 -- Public Sector Accounting Standards
    Documents/ (~33 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~29 items)
    Resources/ (~12 items)

  Pensions/                      -- Accounting Standards for Pension Plans
    Documents/ (~4 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~7 items)
    Resources/ (~1 item)

  Other/                         -- Other Canadian Standards
    Documents/ (~13 items)
    Effective-Dates/
    Page-Components/
    Projects/ (~23 items)
    Resources/

  Sustainability/                -- CSSB Standards (separate from CSSB board section)
    Documents/ (~3 items)
    Page-Components/
    Projects/ (~3 items)
    Resources/ (~2 items)

  ---- CROSS-CUTTING / SHARED ----
  About/ (Page-Components only)
  Contact-Us/
  FAQs/
  News-Listings/ (~28 items -- root-level cross-board news)
  Volunteer-Opportunities/ (3 items + Page-Components)
  Job-Opportunities/ (Page-Components only)
  Research-Program/ (~7 items: call for papers, research forums)
  Due-Process/ (Page-Components only)
  International-Activities/
  International-Standards-and-Canadas-Standard-setting-Boards/
  Independent-Standard-setting-and-the-Due-Process/
  independent-standard-setting-review/

  ---- ACCOUNT / AUTH ----
  My-Account/
    create-password, Forgot-my-password, Forgot-Username, Login, logout,
    My-Profile, MySubscriptions, profile-created, Register,
    reset-password, Unsubscribe-Feedback, your-account-is-disabled

  ---- REDIRECTS ----
  Redirects/ (~21 redirect items)

  ---- STATIC / POLICY ----
  accessibility-policy/
  cookie-policy/
  copyright/
  privacy-policy/
  error-403/
  error-404/
  error-500/
  LinkedIn/

  ---- LEGACY / MISC ----
  CoveoSearch/
  normes-iaasb/
  Page-Compontents/ (note: typo in original)
  public-sector-international/
  Search-Results/
  Staging-site-tests/
```

## Board-by-Board Breakdown

### AcSB (Accounting Standards Board)
- **Template:** "standard page"
- **Sections:** About (10 sub-pages + 16 members), Committees (12), Contact-Us, Meetings-and-Events (~82), News-Listings (~170), Submit-Comment, Volunteer-Opportunities (~22)
- **Deepest path:** AcSB/Committees/ifrsdg/ifrsdg-meetings/december-2023/Page-Components/Body-Text/ (6 levels deep)
- **Content patterns:**
  - Members use template "member" with fields: name, designation, fras title, body content, photo, location, appointed date, term expires, is voting member
  - News uses template "internal or external news page" with fields: title, content (rich text), date, type of news (Treelist), tags (Treelist), type of resource (Treelist), link
  - Meetings use template "meeting details" with fields: body content (rich text), start date, end date, type of meeting (Treelist), address/city/province, google map, tags
  - Committee pages have nested meeting reports with Page-Components containing Body-Text, Table-of-Contents, CTA sub-items
- **Notable:** Largest news archive of all boards. 12 advisory committees is the most of any board.

### AASB (Auditing and Assurance Standards Board)
- **Template:** "standard page"
- **Sections:** About (8 sub-pages + 17 members), Committees (14), Contact-Us, Effective-Dates, Initiatives, Meetings-and-Events (~58), News-Listings (~107), Submit-Comment, Technology, Volunteer-Opportunities (~14)
- **Notable:** Has 14 committees (most of any board), an "Initiatives" section, a "Technology" section, and a "Volunteer-Opportunities-TEST" folder. Effective-Dates has only a Page-Components child (content rendered via configuration).

### PSAB (Public Sector Accounting Board)
- **Template:** "standard page"
- **Sections:** About (9 sub-pages + 17 members), Committees (8), Contact-Us, Meetings-and-Events (~46), News-Listings (~81), Submit-Comment, Volunteer-Opportunities (~13)
- **Notable:** Has a "What-are-public-sector-standards" explainer page.

### CSSB (Canadian Sustainability Standards Board)
- **Template:** "standard page" (uses lowercase URL slugs unlike other boards)
- **Sections:** about, chair-role, cssb-video-transcript, implementation-committee, meetings-and-events (~5), news-listings (~22), Submit-Comment, volunteer-opportunities (~3)
- **Notable:** Newest board -- smallest content footprint. No formal "About/Members" structure like other boards. Has a "chair-role" standalone page and "cssb-video-transcript" page.

### AcSOC (Accounting Standards Oversight Council)
- **Sections:** About (Members: 27, annual-reports, Statement-Operating-Procedures, Terms-of-Reference), AcSOC-activities, Committees, Contact-Us, Meetings-and-Events, News-Listings (~15), Volunteer-Opportunities
- **Notable:** Oversight council, not a standards board. Has more members (27) than any board. Has "AcSOC-activities" section. No Submit-Comment.

### AASOC (Auditing and Assurance Standards Oversight Council)
- **Sections:** About (Members: 18, Annual-Report, public-interest, Statement-Principal-Operating-Procedures, Terms-of-Reference), AASOC-activities, Committees, Contact-Us, Meetings-and-Events, News-Listings (~10), Volunteer-Opportunities
- **Notable:** Similar structure to AcSOC. Has "public-interest" page. No Submit-Comment.

## Standards Sections Breakdown

Standards sections share a common structure pattern:

| Section | Projects | Documents | Resources | Effective-Dates |
|---------|----------|-----------|-----------|-----------------|
| IFRSStandards | 104 | 33 | 16 | 1 page |
| ASPE | 32 | 20 | 7 | yes |
| Public-Sector | 29 | 33 | 12 | yes |
| Other | 23 | 13 | - | yes |
| CASS | 18 | 14 | 5 | yes |
| NFPOS | 17 | 9 | 3 | yes |
| Pensions | 7 | 4 | 1 | yes |
| CSQC | 3 | 4 | - | yes |
| Sustainability | 3 | 3 | 2 | no |
| **TOTALS** | **236** | **133** | **46** | |

### Project Template Fields
- Template: "project"
- Key fields: page title, breadcrumb title, description (rich text), sumary description (rich text), summary description 2 (rich text), fras id number, project status (Droptree), issued date, section title (Droptree), meta keywords, meta description, image
- Child items: Page-Components/ containing Project-Status-Table (with Row-1 through Row-5+ sub-items), News-Rollups-Configuration, Meeting-Rollups-Configuration
- The Project-Status-Table rows represent the timeline/stage progression

### Document for Comment Template Fields
- Template: "document for comment"
- Key fields: page title, breadcrumb title, teaser (rich text), rich text content, sumary description (rich text), button label, button link, document state (Droplink), documents (Treelist), links (Treelist), type of document (Droptree), section title (Droptree), cta title (Droptree)
- Notable: has both "sumary description" (typo preserved from Sitecore) and "rich text content"

## Configurations

### Fras/Configurations/
```
Configurations/
  Messaging/
    Labels/
  Settings/
    AptifyURLs/           -- Aptify CRM integration endpoints
    Button-Styles/        -- CMS-configurable button variants
    Colors/               -- Color palette definitions
    Contact-Forms-Data/   -- Form configuration data
    Dynamic-Columns/      -- Layout column configurations
    Email-Addresses/      -- Email recipients for forms
    Form-Configurations/  -- Form field configs
    New-Dictionary-Domain/ -- i18n dictionary entries
    Number-of-Results/    -- Pagination settings
    Preference-centre-URLs/ -- HubSpot preference centre
    System-Configurations/ -- System-wide settings
    Tag-Icons/            -- Icons mapped to tag types
```

### Fras/Site-Components/
```
Site-Components/
  Authors/               -- Author attribution items
  Banners/ (16 variants)
    AASB, AASB-CAS, AASB-CSQC, AASB-Other, AASOC, AcSB, AcSB-ASPE,
    AcSB-IFRS, AcSB-NFPO, AcSB-Pension, AcSOC, CSSB, FRAS, PSAB,
    PSAB-Public, Sustainability-FRAS
  Button-Labels/         -- Reusable button text
  DocumentForComment-Labels/ -- DFC-specific labels
  Footer/
    Footer-Links/
    Footer-List/
    Social-Links/
  FRAS-Contact-Forms/ (7 board-specific forms)
    FRAS-AASB-contact-us, FRAS-AASOC-contact-us, FRAS-AcSB-Contact-Us,
    FRAS-AcSOC-contact-us, FRAS-Contact-us, FRAS-CSSB-contact-us,
    FRAS-PSAB-contact-us
  Header/
    Header-Main-Manu/
  IRCSS/                 -- IRCSS-specific components
  MeetingNewsRollup-Labels/ -- Labels for meeting/news listing components
  Project-Labels/        -- Labels for project page components
  Rollup-Configs/ (12 configs)
    {Board}-meeting-summaries, {Board}-upcoming-meetings (for AcSB, AASB, PSAB, CSSB, AcSOC, AASOC)
  Secondary-Navigations/ (17 menus)
    AASB-Menu, AASOC-Menu, AcSB-Menu, AcSOC-Menu, ASPE-Menu, CAS-Menu,
    CSQC-Menu, CSSB-Menu, FRAS-Menu, IFRS-Menu, Int-Public-Sector-Menu,
    NFPOS-Menu, Other-Menu, Pensions-Menu, PSAB-Menu, Public-Sector-Menu,
    Sustainability-Menu
  Side-Navigations/ (18 menus)
    {Board}-About-Menu, {Board}-Committee-Menu (for various boards),
    cas-240-resource-menu, EER-FAQs, My-Account, Sustainability-Menu
  Staff-Contacts/ (64 staff contacts)
  Tags/
    Base-Tags/
      Board/ (AcSB, AASB, CSSB, PSAB)
      Committees-For-Rollups-Only/
      Council/ (used for AcSOC, AASOC)
      FRASCanada/
      Standards-List/ (10 standards)
        Accounting-Standards-for-Not-for-profit-Organizations
        Accounting-Standards-for-Pensions-Plans
        Accounting-Standards-for-Private-Enterprises
        Canadian-Auditing-Standards
        Canadian-Standards-on-Quality-Management
        Canadian-Sustainability-Disclosure-Standards
        International-Financial-Reporting-Standards
        International-Public-Sector-Accounting-Standards-Activities
        Other-Canadian-Standards
        Public-Sector-Accounting-Standards
    Type-of-Articles/ (News)
    Type-of-Meeting/ (Meeting, Webinar)
    Type-of-News/ (22 types)
      COVID, Document-for-Comment, International-Activity, IRCSS-meeting-summary,
      IRCSS-news, Meeting, Meeting-Summary, News, Project, Resource,
      Resource-Article, Resource-Guidance, Resource-In-Brief, Resource-Other,
      Resource-Webinar, Volunteer-AASB, Volunteer-AASOC, Volunteer-AcSB,
      Volunteer-AcSOC, Volunteer-Opportunity, Volunteer-PSAB, Webinar
    Type-of-Resource/ (Audio, External-Link, PDF, PlainLanguage, Video, Webpage)
```

## IRCSS-Home (Separate Site)
```
IRCSS-Home/
  About/
  Accessibility-policy/
  Consultation-Paper/
  cookie-policy/
  Copyright/
  error-403, error-404, error-500/
  final-report/
  Meeting-summaries/
  News/
  Privacy-policy/
  Terms-of-reference/
  Test-pages/
```
The Independent Review Committee on Standard Setting has its own parallel site structure with separate error pages, policies, and content sections.

## Site/ (Secondary Site)
```
Site/
  Configurations/
  Home/
    career-and-professional-development/
    policies/
```
A secondary, minimal site -- likely CPA Canada career pages or a legacy holdover.

## Content Patterns

### Pattern 1: Board Landing Pages
All boards use template "standard page" with:
- page title, breadcrumb title, description, meta keywords/description, image, section title (Droptree reference to Tags)
- `__final renderings` and `__renderings` fields containing layout XML with component placements in placeholders (maincontent, topheader, bottomcontent)
- Board pages reference layout containers (12-col, 8-col, 6-col, 4-col) with nested Rich Text rendering components

### Pattern 2: Standards Section Structure
All 9 standards sections follow identical structure:
- Projects/ -- uses "project" template
- Documents/ -- uses "document for comment" template
- Resources/ -- resource items
- Effective-Dates/ -- usually just a Page-Components shell (content rendered dynamically)
- Page-Components/ -- shared components for the section

### Pattern 3: Page-Components Pattern
Every content item can have a `Page-Components/` child folder containing:
- Rich text datasource items (Body-Content, Body-Text)
- Configuration items (News-Rollups-Configuration, Meeting-Rollups-Configuration, Meetings-Listing-Config)
- Layout components (CTA, Table-of-Contents)
- Project-Status-Table with Row-1 through Row-N sub-items

This is Sitecore's "datasource" pattern where rendering components reference child items rather than inline content.

### Pattern 4: Banner Per Board/Standards Combination
16 banner variants map boards to their standards contexts:
- FRAS (root), AcSB, AcSB-IFRS, AcSB-ASPE, AcSB-NFPO, AcSB-Pension
- AASB, AASB-CAS, AASB-CSQC, AASB-Other
- PSAB, PSAB-Public
- AcSOC, AASOC, CSSB, Sustainability-FRAS

### Pattern 5: Tag-Based Content Filtering
Content uses a multi-taxonomy tagging system:
- **Board tags:** AcSB, AASB, CSSB, PSAB (4 boards)
- **Standards tags:** 10 standards areas
- **News type tags:** 22 categories (granular: Resource-Article, Resource-Guidance, etc.)
- **Meeting type tags:** Meeting, Webinar
- **Resource type tags:** Audio, External-Link, PDF, PlainLanguage, Video, Webpage

Tags are referenced via GUIDs in Treelist fields, enabling multi-select faceted filtering.

### Pattern 6: Staff Contact as Shared Component
Staff contacts (64 total) are stored in Site-Components/ and referenced by GUID from project pages, meeting pages, and documents. Fields: name, designations, role, email, phone number.

### Pattern 7: Bilingual Versioning
Every item has parallel `en/` and `fr/` directories under its GUID. Each language has numbered version folders (1, 2, 3...). The highest number is the latest version. Homepage has 34 EN versions and 27 FR versions.

### Pattern 8: Committee Depth Pattern
Committees contain nested meeting reports and archives:
- Committee/ -> ifrsdg-meetings/ -> december-2023/ -> Page-Components/ -> Body-Text/
- Up to 6 levels of nesting for committee meeting content
- Committees also contain "Archived-Meeting-Reports" with cumulative body content

## Content Volume Estimates

| Content Type | Approximate Count |
|---|---|
| News items (all boards) | ~430+ |
| Meeting/event items (all boards) | ~200+ |
| Projects (all standards sections) | ~236 |
| Documents for comment | ~133 |
| Resources | ~46 |
| Board members | ~95 (across 6 boards/councils) |
| Staff contacts | 64 |
| Volunteer opportunities | ~52 |
| Committee pages | ~40+ |
| Redirect items | 21 |
| Research program items | 7 |
| My-Account pages | 12 |
| IRCSS pages | ~15 |
| Static/policy pages | 7 |
| Banner variants | 16 |
| Navigation menus | 35 (17 secondary + 18 side) |
| Tag taxonomy values | ~40+ |
| **Estimated total content items** | **~1,400+** |

Note: Each item also has Page-Components children, so actual directory/file count is much higher. With Page-Components, datasource items, and version files, the total file count reaches into thousands.

## Key Findings for Migration Planning

### 1. Two-Layer Content Architecture
Content lives in TWO places:
- **Inline fields** on the item itself (title, description, meta fields, date, tags)
- **Page-Components child items** containing datasource content (rich text blocks, tables, CTAs, rollup configs)

Migration must extract BOTH layers. The Page-Components pattern means a single "page" in the new CMS may need to merge content from 5-10 Sitecore items.

### 2. Template Field Inconsistencies
- "sumary description" (typo) vs "summary description 2" -- both exist on the project template
- Different field IDs for same conceptual field across templates (e.g., "body content" key appears with different template field IDs)
- "description" field on standard pages is Rich Text, while news items have separate "title" and "content" fields

### 3. CSSB is Structurally Different
CSSB uses lowercase URL slugs (about/ vs About/) and has a flatter structure without the standard About/Members hierarchy. It also has unique pages (chair-role, cssb-video-transcript, implementation-committee) that other boards lack.

### 4. Councils vs Boards Have Different Sections
- **Boards (AcSB, AASB, PSAB):** Have Submit-Comment section
- **Oversight Councils (AcSOC, AASOC):** Have {Board}-activities section instead
- **CSSB:** Has both Submit-Comment AND unique pages

### 5. Banner Mapping Reveals Board-Standards Relationships
The 16 banner variants encode which board "owns" which standards:
- AcSB owns: IFRS, ASPE, NFPO, Pensions
- AASB owns: CAS, CSQC, Other
- PSAB owns: Public-Sector
- CSSB: Sustainability (via FRAS umbrella)

This maps directly to the navigation structure and content scoping.

### 6. Project-Status-Table is Custom Component
Project pages have a structured child tree for timeline stages (Row-1 through Row-N). This maps to our `<ProjectTimeline>` component but the stage data is stored as individual Sitecore items, not a structured field.

### 7. Rollup Configurations Are Shared Components
Meeting summaries and upcoming meeting listings use shared Rollup-Config items (12 total, 2 per board) that configure which content appears in listing components. This is Sitecore's approach to what we'll handle with Payload CMS queries.

### 8. 64 Staff Contacts Are Referenced Globally
Staff contacts in Site-Components/ are referenced by GUID from project pages via "Staff Contacts={GUID}" rendering parameters. Migration needs to preserve these relationships.

### 9. IRCSS Is a Separate Concern
The IRCSS (Independent Review Committee on Standard Setting) site is a standalone structure under IRCSS-Home/ with its own policies, errors, and content. This was a temporary microsite and may not need migration.

### 10. My-Account Section Maps Directly to Auth Flows
12 account-related pages (Login, Register, Forgot-Password, etc.) map to our planned Aptify auth integration flows 1:1.

### 11. Standards-List Taxonomy Confirms 10 Standards Areas
The Base-Tags/Standards-List has exactly 10 values, confirming our documented 11 sections (the 11th being "Sustainability" which lives under CSSB). The "International Public Sector Accounting Standards Activities" tag maps to the "public-sector-international" section.

### 12. News Type Tags Are Very Granular
22 news type values suggest the original site had fine-grained content categorization. For migration, we may want to simplify to fewer categories while preserving the data for filtering. Notable: volunteer opportunities are tagged as news types (Volunteer-AcSB, Volunteer-AASB, etc.).
