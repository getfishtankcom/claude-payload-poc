# Sitecore Package Export: Workflows & Content Tree Analysis

**Source:** `/data/old-fras-dump/_extracted/fras-214mb/contents/`
**Date:** 2026-03-05 (updated from 2026-03-04 initial extraction)

---

## Part 1: Workflows

Three workflows found in the Sitecore package dump. The **Fras Workflow** is the primary editorial workflow used for content pages; the **Simple Workflow** is the legacy/original CPA Canada workflow with additional publishing paths; the **Component Workflow** is a simplified 2-state flow for reusable components.

---

### 1.1 Simple Workflow (Legacy)

**ID:** `{B98C19A0-E7EB-4FA0-ACC7-4F72E779BF9F}`
**Initial State:** Web Publisher Create and Edit
**Created by:** sitecore\skennedy (2012-07-30)
**Security:** Content Administrator, Web Publisher, Online Editor (read access)

```
                     +-----------------------------------------+
                     |   Web Publisher Create and Edit          |
                     |   (Initial State)                       |
                     |   Preview target: Staging                |
                     +-----------------------------------------+
                       |            |            |            |
            Submit to  |  Publish   | Publish    | Publish
          Online Editor|  (direct)  | Provinces  | Media Release
                       |            |            |
                       v            |            |
          +------------------------+|            |
          | Online Editor Approve  ||            |
          | Preview target: Staging||            |
          +------------------------+|            |
            |               |      |            |
         Publish         Reject    |            |
            |               |      |            |
            |     +---------+      |            |
            |     | (back to       |            |
            |     |  Create/Edit)  |            |
            v     v                v            v
     +-------------+    +--------------+   +------------------+
     |  Published   |   | Published    |   | Published        |
     |  (FINAL)     |   | Provinces    |   | Media Release    |
     |              |   | (FINAL)      |   | (FINAL)          |
     +--------------+   +--------------+   +------------------+
```

#### States Detail

| State | GUID | Sort | Final? | Preview Target | Roles with Access |
|-------|------|------|--------|----------------|-------------------|
| Web Publisher Create and Edit | `{09CE01E6-6886-4C62-A737-5711EC3D474B}` | 10 | No | Staging | Content Administrator (full), Web Publisher (full), Online Editor (limited) |
| Online Editor Approve | `{6B128E36-8189-4737-BA26-9E2D3E642088}` | 20 | No | Staging | Content Administrator (full), Online Editor (full), Content Author French (write), Web Publisher (read only) |
| Published | `{085CD0E5-D04F-4D91-8CEA-7A9C4A1C421E}` | 40 | Yes | -- | Content Administrator, Web Publisher, Online Editor (all full) |
| Published Provinces | `{4F1941C3-DC49-464C-8162-66634EFF588D}` | 100 | Yes | -- | Content Administrator, Provincial Workflow |
| Published Media Release | `{7494272A-5841-42A5-BF33-F79F95B638DB}` | 200 | Yes | -- | Content Administrator, Media Releases |

#### Commands (Transitions)

| From State | Command | To State | Who Can Execute |
|------------|---------|----------|-----------------|
| Create and Edit | Submit to Online Editor | Online Editor Approve | Sitecore Client Authoring (NOT Provincial Workflow) |
| Create and Edit | Publish | Published | Content Administrator ONLY |
| Create and Edit | Publish Provinces | Published Provinces | Content Administrator, Provincial Workflow |
| Create and Edit | Publish Media Release | Published Media Release | Content Administrator, Media Releases |
| Online Editor Approve | Publish | Published | Sitecore Client Authoring |
| Online Editor Approve | Reject | Create and Edit | Sitecore Client Authoring |

#### Actions on States/Transitions

**On "Submit to Online Editor" command:**
| Action | Type | From | To | Subject |
|--------|------|------|----|---------|
| Email Online Editor | email action | no-reply@cpacanada.ca | webcontent@cpacanada.ca | "For Review: {id number} - {title}" |
| Email WebTranslation | email action | webcontent@cpacanada.ca | webtranslation@cpacanada.ca | "FYI - Content submitted to Online Editor: {id number} - {title}" |

**On "Reject" command (Online Editor Approve):**
| Action | Type | Details |
|--------|------|---------|
| Email Web Publisher | email creator action | From: webcontent@cpacanada.ca, Subject: "Content Rejected: {id number} - {title}" |
| Unlock Components | custom action | `Nlc.SBL.Workflow.CustomActions.UnlockComponents, Nlc.SBL` |

**On entering "Online Editor Approve" state:**
| Action | Type | Details |
|--------|------|---------|
| Unlock Components | custom action | `Nlc.SBL.Workflow.CustomActions.UnlockComponents, Nlc.SBL` |

**On entering "Published" state (5+ actions):**
| Action | Type | Details |
|--------|------|---------|
| Publish Components | custom action | `Nlc.SBL.Workflow.CustomActions.PublishComponents, Nlc.SBL` |
| Auto Publish | Sitecore action | `Sitecore.Workflows.Simple.PublishAction` (params: `related=1`) |
| Publish Children in Components Workflow | custom action | `Nlc.SBL.Workflow.CustomActions.PublishChildrenInCompoentsWorkflow, Nlc.SBL` |
| Email Web Publisher | email creator action | From: webcontent@cpacanada.ca, Subject: "Content Approved: {id number} - {title}" |
| Email Web Translation | email action | From: webcontent@cpacanada.ca, To: webtranslation@cpacanada.ca, Subject: "FYI - Content approved: {id number} - {title}" |
| Email Michael M | email action | From: no-reply@cpacanada.ca, To: webcontent@cpacanada.ca, Subject: "FYI Stats Tracking - Content published by: {department} for {owner}" |

**On entering "Published Provinces" state:**
- Publish Components (custom)
- Auto Publish (`related=1`)
- Publish Children in Components Workflow (custom)

**On entering "Published Media Release" state:**
- Publish Components (custom)
- Auto Publish (`related=1`)
- Publish Children in Components Workflow (custom)
- Email-Web-Content: From no-reply@cpacanada.ca, To webcontent@cpacanada.ca, Subject: "FYI - Media Release Published: {id number} - {title}"
- Email Web Translation: From no-reply@cpacanada.ca, To webtranslation@cpacanada.ca, Subject: "FYI - Content approved: {id number} - {title}"

---

### 1.2 Fras Workflow (Primary/Current)

**ID:** `{C9217450-B8F2-4FD2-BB6F-0E1371FCA5DC}`
**Initial State:** Draft
**Created:** 2018-06-12
**Security:** FRASCanada Reviewer (full), FRASCanada Author (full)

```
     +------------------+
     |     Draft         |
     |  (Initial State)  |
     |  Preview: Staging |
     +------------------+
       |              |
    Submit          Publish
       |           (admin only)
       v              |
     +------------------+        |
     | Awaiting Approval |       |
     | Preview: Staging  |       |
     +------------------+        |
       |       |       |         |
    Approve  Approve  Reject     |
             w/Test    |         |
       |       |       |         |
       |       |   (back to      |
       |       |    Draft)       |
       v       v                 v
     +---------------------------+
     |        Approved           |
     |        (FINAL)            |
     +---------------------------+
```

#### States Detail

| State | GUID | Sort | Final? | Preview Target | Key Security |
|-------|------|------|--------|----------------|-------------|
| Draft | `{16D15A4B-5AA5-4F92-807F-B8ECE19DC997}` | 50 | No | Staging | (inherits from workflow) |
| Awaiting Approval | `{75186DF9-A57E-4FC6-A0D7-6B9CD3FBA860}` | 100 | No | Staging | Open security (empty) |
| Approved | `{C528CC1F-49F8-41C5-AF26-D8F993C90A9E}` | 200 | Yes | -- | FRASCanada Author denied read (cannot see approved items) |

#### Commands (Transitions)

| From State | Command | To State | Who Can Execute |
|------------|---------|----------|-----------------|
| Draft | Submit | Awaiting Approval | (no restrictions -- inherits) |
| Draft | Publish | Approved | Content Administrator ONLY (everyone else denied) |
| Awaiting Approval | Approve | Approved | (inherits) |
| Awaiting Approval | Approve with Test | Approved | Uses `Sitecore.ContentTesting.Workflows.TestCandidatesCommandStateEvaluator` |
| Awaiting Approval | Reject | Draft | (inherits) |

#### Actions on Transitions

**On "Submit" command (Draft -> Awaiting Approval):**
| Action | From | To | Subject |
|--------|------|----|---------|
| Email Online Editor | no-reply@cpacanada.ca | communications@frascanada.ca | "Content ready for review: {frasID}" |
| Email WebTranslation | no-reply@cpacanada.ca | webtranslation@cpacanada.ca | "FYI - FRASCanada content submitted to Online Editor: {frasID}" |

**Email body template (Submit):**
> The web publisher: {updatedby} has submitted the following item for your review.
> - Title: {frasPageTitle} {frasWhatsNewTitle}
> - ID: {frasID}
> Please review and edit the item here: {editlink}
> COMMENT HISTORY (version {version number}): {workflow history}

**On "Reject" command:**
| Action | From | Subject |
|--------|------|---------|
| Email Web Publisher (creator action) | communications@frascanada.ca | "Content Rejected: {frasID}" |
| Unlock Components | custom action | `Nlc.SBL.Workflow.CustomActions.UnlockComponents` |

**Rejection email template:**
> The Online Editor: {updatedby} has rejected this item:
> - Title: {frasPageTitle} {frasWhatsNewTitle}
> - ID: {frasID}
> This item was rejected because: **{last comment}.**
> Please make the necessary corrections and resubmit.

**On entering "Awaiting Approval" state:**
- Unlock Components (custom action)

**On entering "Approved" state (5 actions):**
| Action | Type | Details |
|--------|------|---------|
| Publish Components | custom action | `Nlc.SBL.Workflow.CustomActions.PublishComponents` (sort: 0, runs first) |
| Auto Publish | Sitecore action | `Sitecore.Workflows.Simple.PublishAction` (params: `deep=1&smart=1`) |
| Publish Children in Components Workflow | custom action | (sort: 200) |
| Email Web Publisher | email creator action | From: communications@frascanada.ca, Subject: "Content Approved: {frasID}" |
| Email Web Translation | email action | From: communications@frascanada.ca, To: webtranslation@cpacanada.ca, Subject: "FYI - FRASCanada.ca content approved: {frasID}" |

**Approval email template:**
> The Online Editor: {updatedby} has approved item:
> - Title: {frasPageTitle} {frasWhatsNewTitle}
> - ID: {frasID}
> It will publish to the website within two hours. If this content has been scheduled for a specific date/time, it will publish to the website within two hours of that scheduled date/time.
> Please inform the owner when they can expect this web page to be live on frascanada.ca.

**Key difference from Simple Workflow:** Fras Workflow uses `deep=1&smart=1` for publishing (deep publish + smart publish), while Simple uses `related=1` (publish related items only).

**Key difference in tokens:** Fras Workflow uses `{frasID}`, `{frasPageTitle}`, `{frasWhatsNewTitle}` instead of `{id number}` and `{title}`.

---

### 1.3 Component Workflow

**ID:** `{4CF6727D-C812-4227-B6A2-ED7AE41C3620}`
**Initial State:** Create and Edit
**Created:** 2014-01-02
**Security:** FRASCanada Author, Content Author French, Content Administrator, Content Author English, Content Author, FRASCanada Reviewer (all have full workflow access). Everyone else denied.

```
     +------------------+
     | Create and Edit   |
     | (Initial State)   |
     | Preview: Staging  |
     +------------------+
            |
         Publish
            |
            v
     +------------------+
     |    Published      |
     |    (FINAL)        |
     +------------------+
```

**Simplest workflow -- no approval step. Direct publish.**

#### On entering "Published" state:
| Action | Type | Details |
|--------|------|---------|
| Publish Components | custom action | `Nlc.SBL.Workflow.CustomActions.PublishComponents` |
| Auto Publish | Sitecore action | `deep=1&smart=1` |
| Publish Children in Components Workflow | custom action | (same as others) |

---

### 1.4 Workflow Email Addresses Summary

| Address | Used For |
|---------|----------|
| no-reply@cpacanada.ca | Sender on Simple Workflow submit + stats tracking, Fras Workflow submit |
| webcontent@cpacanada.ca | Sender on Simple Workflow (most actions), Recipient for stats tracking + media release notifications |
| webtranslation@cpacanada.ca | FYI recipient on all workflows |
| communications@frascanada.ca | Sender AND recipient on Fras Workflow actions |

### 1.5 Sitecore Roles Used in Workflows

| Role | Workflows |
|------|-----------|
| sitecore\Content Administrator | Simple, Fras, Component |
| sitecore\Web Publisher | Simple |
| sitecore\Online Editor | Simple |
| sitecore\Provincial Workflow | Simple (Publish Provinces) |
| sitecore\Media Releases | Simple (Publish Media Release) |
| sitecore\FRASCanada Author | Fras, Component |
| sitecore\FRASCanada Reviewer | Fras, Component |
| sitecore\Content Author | Component |
| sitecore\Content Author English | Component |
| sitecore\Content Author French | Simple (Approve state), Component |
| sitecore\Sitecore Client Authoring | Simple (Submit/Approve/Reject) |

### 1.6 Custom Action Classes

All from assembly `Nlc.SBL`:
- `Nlc.SBL.Workflow.CustomActions.PublishComponents` -- publishes associated components
- `Nlc.SBL.Workflow.CustomActions.PublishChildrenInCompoentsWorkflow` -- publishes children that are in the Component Workflow (note: typo "Compoents" in original)
- `Nlc.SBL.Workflow.CustomActions.UnlockComponents` -- unlocks components on reject/state entry

---

## Part 2: Content Tree Structure

### 2.1 Fras Site Root

```
/sitecore/content/Fras/
  +-- {FF49A3BF-...}              (site definition item)
  +-- Home/                        (main page tree)
  +-- Configurations/              (settings & labels)
  +-- Site-Components/             (shared components)
  +-- IRCSS-Home/                  (Independent Review site)
```

### 2.2 Fras/Home/ (Page Tree -- 40+ top-level folders)

#### Board/Council Sections (7 entities)

| Folder | Entity | Sub-sections |
|--------|--------|-------------|
| `AcSB/` | Accounting Standards Board | About (Terms-of-Reference, Strategic-Plan, current-work-plan), Committees, Contact-Us, Meetings-and-Events, News-Listings, Page-Components, Submit-Comment, Volunteer-Opportunities |
| `PSAB/` | Public Sector Accounting Board | About, Committees (iag, gnfpac, cufptf, psadg + meeting entries), Contact-Us, Meetings-and-Events, News-Listings, Page-Components, Submit-Comment, Volunteer-Opportunities |
| `AASB/` | Auditing & Assurance Standards Board | About, Committees, Contact-Us, Effective-Dates, Initiatives, Meetings-and-Events, News-Listings, Page-Components, Submit-Comment, Technology, Volunteer-Opportunities |
| `CSSB/` | Canadian Sustainability Standards Board | about, chair-role, cssb-video-transcript, implementation-committee, meetings-and-events, news-listings, Page-Components, Submit-Comment, volunteer-opportunities |
| `AASOC/` | Auditing & Assurance Standards Oversight Council | About (Terms-of-Reference, Statement-Principal-Operating-Procedures, Annual-Report, Members, public-interest), Committees (nominating, performance-review) |
| `AcSOC/` | Accounting Standards Oversight Council | About (annual-reports, Members, Terms-of-Reference), Committees (Nominating, Performance-Review), AcSOC-activities (yearly activity reports) |
| `CASS/` | Canadian Auditing Standards | (minimal content) |

**Pattern:** AcSB, PSAB, AASB share identical structure (About, Committees, Contact-Us, Meetings-and-Events, News-Listings, Submit-Comment, Volunteer-Opportunities). CSSB uses lowercase naming and has unique sections (chair-role, implementation-committee). Oversight councils (AASOC, AcSOC) have different structures (annual reports, member bios, activity reports instead of meetings/events).

#### Standards Sections

| Folder | Content Type |
|--------|-------------|
| `IFRSStandards/` | IFRS Standards -- Effective-Dates (deep table: Section-1..Section-11, each with Row/Column items), Projects |
| `Sustainability/` | Sustainability Standards -- Projects (adoption-csds1-csds2, Criteria-for-Modification), Resources (webinars), Documents |
| `ASPE/` | Accounting Standards for Private Enterprises |
| `NFPOS/` | Not-for-Profit Organizations |
| `Pensions/` | Pension standards |
| `Public-Sector/` | Public sector standards |
| `public-sector-international/` | International public sector standards |
| `normes-iaasb/` | IAASB standards (French naming) |
| `CSQC/` | Quality control standards |

#### Cross-Cutting Content

| Folder | Purpose |
|--------|---------|
| `About/` | About FRAS Canada |
| `Contact-Us/` | General contact page |
| `Due-Process/` | Due process information |
| `Independent-Standard-setting-and-the-Due-Process/` | Standards process documentation |
| `independent-standard-setting-review/` | ISS review content |
| `International-Activities/` | International standards engagement |
| `International-Standards-and-Canadas-Standard-setting-Boards/` | Relationship to international boards |
| `Job-Opportunities/` | Career listings |
| `News-Listings/` | Global news landing page |
| `Research-Program/` | Research program content |
| `Volunteer-Opportunities/` | Global volunteer opportunities |
| `FAQs/` | Frequently asked questions |
| `LinkedIn/` | LinkedIn redirect/landing |
| `My-Account/` | Authenticated user area |

#### Search, System, & Legal

| Folder | Purpose |
|--------|---------|
| `CoveoSearch/` | Coveo search integration page |
| `Search-Results/` | Search results page |
| `Redirects/` | URL redirect rules |
| `Page-Compontents/` | Shared page components (note: typo "Compontents") |
| `Staging-site-tests/` | Test/staging content |
| `Other/` | Miscellaneous |
| `accessibility-policy/` | Accessibility policy |
| `cookie-policy/` | Cookie policy |
| `copyright/` | Copyright notice |
| `privacy-policy/` | Privacy policy |
| `error-403/`, `error-404/`, `error-500/` | Error pages |

### 2.3 Content Item Structure Pattern

Each content page follows a consistent Sitecore pattern:

```
[PageName]/
  {GUID}/                          -- Item definition
    en/                            -- English versions
      1/, 2/, 3/... /xml           -- Version history (multiple versions per language)
    fr/                            -- French versions
      1/, 2/, 3/... /xml           -- Version history
  Page-Components/                 -- Nested component items
    Body-Content/  or Body-content/
      {GUID}/en/N/xml
    CTA/
      {GUID}/en/N/xml
    News-Rollups-Configuration/
    Meeting-Rollups-Configuration/
    Project-Status-Table/
      Row-1/, Row-2/...
        Task-1/, Column-1/, Column-2/
    Effective-Dates-Table/
      Section-1/ through Section-11/
        Row-1/ through Row-N/
          Column-1/, Column-2/
    Projects-Table/
      Active-Projects/
    Resources-config/
  [child pages]/
```

**Key observations:**
- All content is bilingual (en/fr) with independent version chains
- Items have deep version history (some pages up to 20+ versions per language, e.g., AcSB landing = 23 EN / 18 FR)
- Page-Components are child items under each page (component architecture)
- Common components: Body-Content, CTA, News-Rollups-Configuration, Meeting-Rollups-Configuration
- Project pages have Project-Status-Table with Row/Task structure
- Standards pages have Effective-Dates-Table with Section/Row/Column structure (deeply nested -- up to 5 levels)

### 2.4 Fras/Site-Components/ (Shared/Reusable Content)

```
Site-Components/
  +-- Authors/                       (content authors)
  +-- Banners/                       (promotional banners)
  +-- Button-Labels/                 (50+ bilingual button labels: have-your-voice-heard, ViewComments, Apply, Submit-Comment, Documents-for-Comment, Learn-More, Exposure-Draft, Download-Now, Search, etc.)
  +-- DocumentForComment-Labels/     (document consultation labels)
  +-- Footer/                        (footer configuration)
  +-- FRAS-Contact-Forms/            (contact form definitions)
  +-- Header/                        (header/navigation configuration)
  +-- IRCSS/                         (IRCSS-specific components)
  +-- MeetingNewsRollup-Labels/      (meeting/news rollup labels)
  +-- Project-Labels/                (project-related labels)
  +-- Rollup-Configs/                (content rollup configurations)
  +-- Secondary-Navigations/         (board-specific secondary navs)
  +-- Side-Navigations/              (sidebar nav configurations)
  +-- Staff-Contacts/                (25+ staff: Johanna-Field, Harry-Klompas, Jamie-Goodman, Ingrid-McDonald, Jean-Goguen, Noor-Abu-Shaaban, Amanda-Winter, Stephenie-Fox, Svetlana-Berger, Laura-Trommels, Grace-Flis, Rebecca-Villmann, Camila-Santos, etc.)
  +-- Tags/                          (content tags/taxonomy)
```

### 2.5 Fras/IRCSS-Home/ (Independent Review Microsite)

```
IRCSS-Home/
  +-- About/                        (about the review)
  +-- Accessibility-policy/
  +-- Consultation-Paper/            (consultation documents)
  +-- cookie-policy/
  +-- Copyright/
  +-- error-403/, error-404/, error-500/
  +-- final-report/                  (final review report)
  +-- Meeting-summaries/             (meeting summary documents)
  +-- News/                          (IRCSS-specific news)
  +-- Page-Components/               (shared components)
  +-- Privacy-policy/
  +-- Terms-of-reference/            (review terms of reference)
  +-- Test-pages/                    (test content)
```

### 2.6 Fras/Configurations/

```
Configurations/
  +-- Messaging/
  |     +-- Labels/
  |           +-- Preference-Centre/ (18+ items: CAS, CSQC, ASPE, IFRS, Pension, PublicSector, NFPO, SustainabilityStandards, TheStandard, FeedbackTitle, OtherFeedback, ContentNotInteresting, ContentNotRelevant, EmailsTooFrequent, SendFeedback, FeedBackSuccess, Thank-you, NoThanks, UnsubscribeSubjectLine, UnsubscribeBody)
  |           +-- A/ (All, All-Items, Attachment)
  |           +-- G/ (GenericFailMessage)
  |           +-- I/ (Items-per-page, Issued)
  |           +-- N/ (Next, No-Results-Found, NoDeferredProjects, NoActiveProjects, NoDocumentsFound, Non-Voting-Members, NameofCommittee, NameofEvent, News, Newest, NewsLanding-PaginationGoToPageScreenReaderLabel, Not-Available)
  |           +-- R/ (Register, RegisterObserveThankYou, RegistertoAttendThankYou, RegistertoVolunteerThankYou)
  |           +-- S/ (Search)
  +-- Settings/
        +-- Email-Addresses/        (per-board email addresses)
        +-- AptifyURLs/             (auth flow URLs)
        +-- Colors/                 (Purple #a53b9d, Gray #f3f3f3, Black #000, White #fff, IRCSS greens)
        +-- Button-Styles/          (Default-Button, Secondary-Button, IRCSS variants)
        +-- Dynamic-Columns/        (Column-12, Column-6-6, Column-8-4, Column-444, Column-3333)
        +-- Form-Configurations/    (per-board form IDs)
        +-- Contact-Forms-Data/     (Name, Email, Title, Organization, Phone, Comments)
        +-- Preference-centre-URLs/ (Feedback-form, Mysubscriptions)
        +-- System-Configurations/  (MyAccount, Buttons, Error handling)
        +-- Tag-Icons/              (External-News-Icon)
        +-- New-Dictionary-Domain/  (dictionary entries)
```

---

## Part 2B: Configuration Data

### Email Addresses (per board)

| Board | Email |
|-------|-------|
| AASB | info@aasbcanada.ca |
| AcSB | info@acsbcanada.ca |
| PSAB | info@psabcanada.ca |
| CSSB | CSSB.CCNID@frascanada.ca |
| Generic | info@frascanada.ca |

### Color Definitions

| Name | Hex | Usage |
|------|-----|-------|
| Purple | #a53b9d | Primary brand color |
| Gray | #f3f3f3 | Light background |
| Black | #000 | Text / dark elements |
| White | #fff | Light text / backgrounds |
| ICRSS-Deep-Green | #275D38 | IRCSS branding (dark green) |
| ICRSS-Green | #0C8642 | IRCSS branding (medium green) |

### Button Styles

| Style | Background | Text | Border | Hover BG | Hover Text | Border Radius |
|-------|-----------|------|--------|----------|------------|---------------|
| Default-Button | Purple (#a53b9d) | White (#fff) | none | Purple (#a53b9d) | White (#fff) | Yes |
| Secondary-Button | Gray (#f3f3f3) | Black (#000) | Black (#000) | White (#fff) | Purple (#a53b9d) | Yes |

### Dynamic Column Layouts

| Name | Layout |
|------|--------|
| Column-12 | Full width (12) |
| Column-6-6 | Two equal (6+6) |
| Column-8-4 | Two unequal (8+4) |
| Column-444 | Three columns (4+4+4) |
| Column-3333 | Four columns (3+3+3+3) |

### Publishing Targets

| Target | Database | Purpose |
|--------|----------|---------|
| Internet | web | Production |
| Staging | staging | Preview (referenced by all workflow states) |

---

## Part 3: Key Findings & Recommendations

### 3.1 Workflow Design Implications for Payload CMS

1. **The Fras Workflow is the modern standard** (created 2018) -- a clean 3-state flow (Draft -> Awaiting Approval -> Approved). The Simple Workflow (2012) is the legacy system with more complex routing. **Use Fras Workflow as the model.**

2. **Three parallel publish paths** exist in Simple Workflow (standard, provincial, media release) -- each with different roles and final states. These should be consolidated in Payload CMS into a single publish path with role-based permissions.

3. **Component Workflow is ultra-simple** (2 states: Create -> Published) -- components don't need editorial review. Use a separate, simpler status flow for components in Payload.

4. **Email notifications are deeply integrated** -- every state transition triggers notifications to `communications@frascanada.ca` and `webtranslation@cpacanada.ca`. Implement via Payload hooks on status change.

5. **Custom Nlc.SBL actions** handle cascading publish of components and child items -- Sitecore-specific, won't carry over. In Payload CMS, component publishing should be automatic.

6. **Admin shortcut preserved** -- Content Administrators can bypass review and publish directly from Draft. Map to admin override in Payload.

7. **FRASCanada Author denied read on Approved state** -- authors can create/submit but cannot see approved items. Consider if this access control pattern should carry over.

### 3.2 Content Tree Observations

1. **Consistent board structure:** AcSB, PSAB, AASB share identical patterns. CSSB differs (lowercase, unique sections). Oversight councils (AASOC, AcSOC) have entirely different structures.

2. **Deep version history:** 5-23 versions per language, confirming active editorial workflow and need for robust versioning.

3. **Page-Components pattern:** Every page has child component items (Body-Content, CTA, rollup configs, table structures). In Payload CMS, these become fields/blocks on the page collection.

4. **Table structures are deeply nested:** Effective-Dates has 11 sections with Row/Column nesting; Project-Status-Table has Row/Task nesting. These need structured data (array fields) in Payload rather than tree items.

5. **Bilingual content is universal** -- every item has en/fr versions.

6. **Dictionary system** in Configurations/Messaging/Labels is a key-value store organized alphabetically. Maps to Payload Globals or i18n dictionary.

7. **25+ Staff-Contacts** as shared Site-Components referenced across pages.

8. **IRCSS-Home is a separate microsite** with own content tree, error pages, and policies (likely archived).

### 3.3 Recommended Payload CMS Workflow Mapping

| Sitecore State | Payload CMS Status |
|---------------|-------------------|
| Draft / Create and Edit | `draft` |
| Awaiting Approval / Online Editor Approve | `pendingReview` |
| Approved / Published | `published` |

Additional:
- Add `archived` status for retired content (not in Sitecore)
- Admin override: allow `admin` role to transition directly draft -> published
- Component collections: use simple draft -> published (no review)
- Email notifications: implement via Payload hooks on status change

### 3.4 Notable Observations

1. **Two email domains:** Simple Workflow uses `@cpacanada.ca`, Fras Workflow uses `@frascanada.ca` -- reflecting the organizational split.

2. **Typo in codebase:** `PublishChildrenInCompoentsWorkflow` ("Compoents" not "Components") -- consistent across all three workflows.

3. **"Approve with Test"** uses Sitecore Content Testing for A/B testing -- will not carry over to Payload.

4. **Preference Centre** has 18+ subscription categories (CAS, CSQC, ASPE, IFRS, Pension, PublicSector, NFPO, SustainabilityStandards, TheStandard, etc.) -- this maps to a newsletter subscription system.

5. **Aptify integration** for auth (Login, Register, Forgot-Password, etc.) -- being replaced by federated auth with CPA Canada.

6. **Brand color confirmed:** Purple `#a53b9d` is the primary color in Sitecore configuration.
