# Sitecore Dump Analysis — Synthesis & Migration Insights

> Cross-references all 6 extraction reports against existing PRDs, BUILD_PLANs, and collection definitions.
> Date: 2026-03-05

## Reports Inventory

| Report | File | Size | Key Data |
|--------|------|------|----------|
| Templates | `templates.md` | 33KB | 92 templates, 266 fields, 6 categories |
| Renderings/Layouts | `renderings-layouts.md` | 26KB | 56 sublayouts, 27 Coveo, 5 placeholders |
| Workflows + Content | `workflows-content.md` | 28KB | 3 workflows, config data, content structure |
| Content Tree | `content-tree.md` | 24KB | 43 sections, ~1,400 content items, 7 boards |
| Media Library | `media-library.md` | 16KB | 1,275 blobs (982MB), ~850+ media items |
| Architecture + Survey | `architecture-survey.md` | 10KB | Site IA (153 rows), 85 survey respondents |

---

## 1. Content Volume (Migration Sizing)

From the content tree analysis:

| Content Type | Sitecore Count | Our Collection | Notes |
|-------------|---------------|----------------|-------|
| News items | ~430 | `news` | Across all boards. No images in most. |
| Projects | ~236 | `projects` | IFRSStandards has 104 alone |
| Meetings/Events | ~200 | `events` | Decision summaries, webinars, meetings |
| Documents for Comment | ~133 | `document-for-comment` | Exposure drafts, consultation papers |
| Board Members | ~95 | `board-members` | 16-22 per board, headshots in media library |
| Staff Contacts | 64 | `contacts` | Stored in Site-Components (shared) |
| Volunteer Opportunities | ~52 | `volunteer-opportunities` (Phase 2) | Across all boards |
| Committee entries | ~60+ | **NOT in PRD** | 12 AcSB + 14 AASB + 8 PSAB + more |
| Resources/Guidance | ~80+ | `resources` | Spread across standards sections |
| Banners | 16 | Config/tokens | Site-Components, board-specific |
| Secondary Navs | 17 | Config/code | Per-section navigation |
| Side Navs | 18 | Config/code | Per-page sidebars |
| **TOTAL** | **~1,400+** | | Excluding Page-Components children |

**Previously estimated:** ~2,700+ items. The 1,400 here excludes Page-Components child items (rich text blocks, CTAs, project status rows) which inflate the count significantly.

---

## 2. Template-to-Collection Mapping

### Direct Matches (confirmed by field analysis)

| Sitecore Template | Fields | Our Collection | Field Gaps |
|------------------|--------|----------------|------------|
| Internal News Page | Title, Summary, Description, Board Tags, News Tags, Image, SearchDate | `news` | **Add:** `FRAS ID Number` (used for email subjects) |
| External News Page | Title, Summary, External Link, Board Tags, News Tags | `news` | External news variant — use `type` enum or `externalUrl` field |
| Project | Title, Summary Description, Board Tags, Status, Type (Active/Completed), Timeline | `projects` | **Add:** `type` enum (active/completed). Project-Status-Table is child items — flatten to structured array. |
| Meeting Page | Title, Summary, Meeting Tags, Board, Location, Date, Attachments | `events` | **Confirmed:** matches our `type` enum approach (meeting/webinar/deadline/decision-summary) |
| Document for Comment | Title, Summary Description, Board Tags, Status, Comment Period fields | `document-for-comment` | **Add:** `commentPeriodStart`, `commentPeriodEnd` dates if not already there |
| Member Details | Name, Title, Bio, Photo, Board | `board-members` | **Confirmed:** matches our spec |
| Staff Contact (Data) | Name, Title, Email, Phone | `contacts` | **Confirmed:** matches our spec |
| Standard Page | Title, Description, Rich Text body | `pages` | Generic content page |
| Homepage | Promotional zones, Featured items | `pages` (homepage template) | Complex — uses Page-Components children for flexible zones |

### New Templates Not in Our PRD

| Sitecore Template | Purpose | Action Needed |
|------------------|---------|---------------|
| Committee Members List | Lists committee members (via parameters template) | **Consider:** `committees` collection or nested under boards |
| Effective Dates Table | Standards effective dates with Row-N children | **Consider:** `effective-dates` collection or structured field on standards pages |
| Meeting Topics Table | Past meeting topics searchable table | Could be view/filter on `events` collection |
| Project Status Table | Timeline rows as child items | Flatten into `projects.timeline` array field |
| Meeting Rollups Configuration | Config for meeting listing widgets | Data-driven widget config in page builder |
| News Rollups Configuration | Config for news listing widgets | Data-driven widget config in page builder |
| News Listings Configuration | Config for news listing pages | Data-driven widget config in page builder |
| Meeting Listings Configuration | Config for meeting listing pages | Data-driven widget config in page builder |

---

## 3. Workflow Comparison

### Sitecore (Actual) vs Our Design

| Aspect | Sitecore Fras Workflow | Our 5-State Design | Gap? |
|--------|----------------------|-------------------|------|
| States | Draft → Awaiting Approval → Approved | Draft → In Review → Approved → Published + Needs Revision | **Ours is richer** — we add explicit Needs Revision + Published separation |
| Rejection | Reject → back to Draft (no comments) | Reject → Needs Revision (mandatory comments + banner) | **Ours is better** — Sitecore has no rejection comments |
| Roles | Content Administrator, Web Publisher, Online Editor, Content Author French | Author, Editor, Admin | **Simpler but covers the same** |
| Email notifications | `communications@frascanada.ca`, `webtranslation@cpacanada.ca` | Not specified yet | **Add:** email notification hooks on workflow transitions |
| A/B testing | Custom `Nlc.SBL.Workflow.Actions.ABTestPublish` action | Not in scope | Not needed |
| Provincial publishing | Separate "Published Provinces" final state | Not needed | Legacy CPA Canada pattern |
| Media Release publishing | Separate "Published Media Release" final state | Not needed | Legacy CPA Canada pattern |
| Component workflow | 2-state (Create → Published), no approval | Not in our design | **Consider:** components may need lighter workflow |
| Simple workflow (legacy) | 5-state with 3 publish paths | Superseded by Fras Workflow | Not needed |

### Key Insight
The Sitecore Fras Workflow is actually **simpler** than our design (3 states vs 5). The legacy Simple Workflow had more complexity but was for CPA Canada's broader needs, not FRAS specifically. Our 5-state design is an improvement, not a regression.

**Action:** Add email notification configuration to Epic 22 workflow hooks. Two emails: one to the editorial team, one to the translation team.

---

## 4. Rendering-to-Component Mapping

### Page Builder Component Registry (Epic 25.2) Cross-Reference

| Sitecore Rendering | Our Component | Category | Match Quality |
|-------------------|---------------|----------|---------------|
| Banner | Hero Banner | Layout | Direct |
| Rich Text (Site Element) | Rich Text | Content Blocks | Direct |
| Generic CTA | CTA Banner | Layout | Direct |
| News Listing | News Feed | Data-Driven | Direct |
| News Rollup | News Feed (compact variant) | Data-Driven | Direct |
| Meetings Listing | Event Calendar | Data-Driven | Direct |
| Meeting Summaries Rollup | Event Calendar (variant) | Data-Driven | Direct |
| Upcoming Meetings Rollup | Event Calendar (upcoming variant) | Data-Driven | Direct |
| Document Table | Document Table | Data-Driven | Direct |
| Projects Tables | Project List | Data-Driven | Direct |
| Members List | Board Members Grid | Data-Driven | Direct |
| Committee Members List | Board Members Grid (variant) | Data-Driven | Direct |
| Staff Contact | Contact Card | Data-Driven | Direct |
| Standards List | — | — | **No equivalent** — list of standards with groups |
| Effective Dates Table | — | — | **No equivalent** — effective dates display |
| Image Grid | — | — | **No equivalent** — multi-image grid (logos) |
| Project Details | — | — | **No equivalent** — project status display |
| Project Overview | — | — | **No equivalent** — project summary block |
| Side Navigation | `<SectionNav variant="sidebar">` | N/A (layout) | Built into templates |
| Secondary Navigation | `<SectionNav variant="tabs">` | N/A (layout) | Built into templates |
| Search Past Meeting Topics Table | — | — | **No equivalent** — specialized search table |
| Dynamic Container | — | — | Layout wrapper — maps to column layouts (2-Column, 3-Column) |
| Two Columns 8/4 | 2-Column | Layout | Direct (ratio variant) |
| Coveo Search Results | Search Bar + results page | Interactive | Replaced by Meilisearch |
| Image | Image | Content Blocks | Direct |
| Disclaimer | Rich Text (variant) | Content Blocks | Use Rich Text with "disclaimer" style |
| Summary | Rich Text (variant) | Content Blocks | Use Rich Text with "summary" style |
| Error Message | — | — | Error page specific — not a builder component |

### Missing Components to Consider Adding

1. **Standards List** — groups of standards with links. Common enough to warrant a component.
2. **Effective Dates Table** — structured dates display. Could be a variant of Document Table.
3. **Image Grid** — logo grids, partner displays. Currently not in our 28 components.

---

## 5. Placeholder-to-Template Zone Mapping

Sitecore has 5 placeholder zones:

| Sitecore Placeholder | Our Page Builder Zone | Locked? | Allowed Components |
|---------------------|----------------------|---------|-------------------|
| `topHeader` | N/A (global layout) | Locked | Header only |
| `phBanner` | Banner zone (locked) | Locked | Banner only |
| `topContent` | N/A (navigation zone) | Locked | Secondary Navigation only |
| `mainContent` | Main editable zone | **Editable** | 11 components whitelisted |
| `bottomContent` (typo: `bottomConent`) | N/A (global layout) | Locked | Footer only |

**Key Insight:** Sitecore's author-editable area is a single `mainContent` zone. The rest is locked in templates. This aligns perfectly with our template-first page builder design — most zones are locked, with 1-2 editable zones per template.

**The 11 mainContent allowed controls map to our editable zone:**
Committee Members List, Coveo Search Results, Document Comment, Document Table, Generic CTA, Meeting Page Details, Meeting Summaries Rollup, Meetings Listing, News Listing, News Rollup, Upcoming Meetings Rollup

---

## 6. Media Library Insights for Migration

| Metric | Value |
|--------|-------|
| Total blobs | 1,275 files (982 MB) |
| Media items | ~850+ unique |
| PDFs | Dominant by size (~900+ MB) |
| Images | ~200 (headshots, logos, banners, thumbnails) |
| Board with most media | AcSB (237 items), PSAB (246 items) |
| Largest single category | AcSB Committees IDG Extracts (105 items) |

### Critical Migration Issues

1. **Per-locale alt text** — Images share one blob for EN/FR but have separate alt text per language. Our Payload media collection needs per-locale alt text fields.
2. **No file extensions on blobs** — Migration script must read `extension` field from XML metadata to rename files.
3. **PDF metadata is rich** — Title, description, keywords fields exist and should be preserved for Meilisearch indexing.
4. **Thumbnail-to-PDF relationship** — Naming convention only (no explicit link). Migration must infer or manually map.
5. **Folder structure maps to boards** — `FRASCanada/AcSB/`, `FRASCanada/PSAB/`, etc. Our folder-based media library (Epic 24) should mirror this.

---

## 7. Architecture IA vs Our Design

The FRAS Architecture.xlsx confirms:

### Confirmed Patterns
- **9 standards sections** in the xlsx (we discovered 11 on the live site — 2 additions post-xlsx)
- **4 boards + 1 council** main sections — matches our design
- **Uniform standards subsections:** Overview, Project Listing, Documents for Comment, Effective Dates, Resources
- **International PSAS Activities** is simpler (3 subsections, no Documents for Comment or Effective Dates)
- **Committee structure** is extensive — 11+ committees per board with member lists

### Gaps Identified
1. **Committees** — significant content area (60+ entries) not in our PRD. Committees have: name, members list, meeting reports. Decision needed: standalone collection vs nested under boards.
2. **Effective Dates** — every standards section has this. Not explicitly in our collections. Could be a field on projects or a dedicated view.
3. **AASB Initiatives** — unique to AASB (Audits of LCEs, Sustainability Assurance, Technology). Content pages, not projects.
4. **Recruitment Guidelines** — RASOC-specific page. Minor.

---

## 8. Survey Insights for UX Priorities

From 85 respondents (77 EN, 8 FR):

| Finding | Impact on Our Design |
|---------|---------------------|
| 61% find info "somewhat/very difficult" to find | **Validates:** Meilisearch investment, redesigned nav |
| #1 challenge: "Searching for content" (59%) | **Validates:** Epic 5 (Meilisearch) is critical path |
| 95% use desktop | **Confirms:** Desktop-first design correct, mobile secondary |
| "I just use Google" (Mohamed persona) | **Validates:** SEO + structured data needed |
| PDF language switching painful | **Action:** Bilingual resource linking in Epic 18 |
| Form submission unreliable, no confirmation | **Action:** Ensure Epic 17 forms have confirmation flow |
| Committee info requested | **Action:** Consider committees collection |
| Meeting summaries hard to find (posted by occurrence not publication date) | **Action:** `events` collection needs both `eventDate` and `publishedDate` |
| Project pages "too much information" | **Validates:** Simpler Project Detail wireframe |
| Past project archives requested | **Action:** Ensure `projects` collection retains completed projects with all docs |

---

## 9. Action Items

### Must-Do (Before Phase 1 Implementation)

1. **Add `FRAS ID Number` field** to relevant collections (used in workflow email subjects)
2. **Add `commentPeriodStart`/`commentPeriodEnd`** to `document-for-comment` if not present
3. **Add `type` enum (active/completed)** to `projects` collection
4. **Add `publishedDate` field** to `events` collection (separate from `eventDate`)
5. **Configure email notification hooks** in Epic 22 workflow: `communications@frascanada.ca` + `webtranslation@cpacanada.ca`
6. **Add per-locale alt text** support to media uploads

### Should-Do (Phase 2 or Migration)

7. **Create `committees` collection** — name, board relationship, members (relationship to board-members), meeting reports
8. **Add Effective Dates view** — either as a collection or structured field on standards pages
9. **Add 3 missing page builder components:** Standards List, Effective Dates Table, Image Grid
10. **Flatten Project-Status-Table** from Sitecore child items to structured array field

### Nice-to-Have

11. Volunteer spotlight/profile feature (survey request)
12. Plain-language standards tutorials (survey request)
13. Historical archive browsing (survey request)

---

## 10. Content Migration Script Requirements

Based on the dump analysis, a migration script will need to:

1. **Parse Sitecore XML items** — extract field values from GUID-based directory structure
2. **Merge Page-Components children** — a single Sitecore "page" = parent item + 5-10 child items (Rich Text, CTAs, Project Status Rows)
3. **Handle bilingual content** — EN and FR versions stored in parallel under each GUID (`/en/1/xml`, `/fr/1/xml`)
4. **Resolve Sitecore links** — internal links use `link` field type with GUID references, need URL mapping
5. **Map template GUIDs** to Payload collections using the GUID Reference table in `templates.md`
6. **Extract blob files** with correct extensions from XML metadata
7. **Preserve rich metadata** on PDFs (title, description, keywords) for search indexing
8. **Handle version history** — items have multiple versions (e.g., Homepage has 34 EN versions)
9. **Map board ownership** from tree position (e.g., `Home/AcSB/News/` → board: AcSB)
10. **Fix known typos** — "sumary description" → "summary description", `bottomConent` → `bottomContent`
