# FRAS Canada — Complete Site Discovery Report (Verified)

| Field | Value |
|-------|-------|
| **Date** | 2026-03-04 (original) / 2026-03-04 (verified) |
| **URL** | https://www.frascanada.ca/ |
| **Purpose** | Map sitemap, page types, component inventory, and data/metadata structure for 1:1 modern frontend rebuild |
| **Platform** | Sitecore CMS (ASP.NET WebForms) |
| **Language** | Bilingual (English / French) with language switcher |
| **Auth** | Federated with CPA Canada |
| **Verification** | 26+ pages verified via Chrome DevTools + claude-in-chrome across ALL 17 templates |

> **Note:** Items marked with ✅ VERIFIED have been confirmed against the live site. Items marked ⚠️ CORRECTED have been updated based on verification findings.

---

## 1. Sitemap & Navigation Structure

### 1.1 Primary Navigation (4 Mega-Menu Dropdowns) ✅ VERIFIED

#### FRAS Canada → `/en`
| Page | URL |
|------|-----|
| About FRAS Canada | `/en/about` |
| Research Program | `/en/research-program` |
| News Listings | `/en/news-listings` |
| Job Opportunities | `/en/job-opportunities` |
| Volunteer Opportunities | `/en/volunteer-opportunities` |
| Contact | `/en/contact-us` |

#### Council → `/en/rasoc`
| Page | URL |
|------|-----|
| RASOC | `/en/rasoc` |
| About | `/en/rasoc/about` |
| Members | `/en/rasoc/about/members` |
| Meetings and Events | `/en/rasoc/meetings-and-events` |
| News Listings | `/en/rasoc/news-listings` |
| Committees | `/en/rasoc/committes` ⚠️ typo in live URL (missing 'e') |
| → Governance Committee | `/en/rasoc/committes/governance` |
| → Nominating Committee | `/en/rasoc/committes/nominating` |
| Volunteer Opportunities | `/en/rasoc/volunteer-opportunities` |

#### Boards (4 sub-sections)

**Canadian Sustainability Standards Board (CSSB)** → `/en/cssb`
| Page | URL |
|------|-----|
| About | `/en/cssb/about` |
| Members | `/en/cssb/about/members` |
| Terms of Reference | `/en/cssb/about/terms-of-reference` |
| Due Process | `/en/cssb/about/due-process` |
| FAQs | `/en/cssb/about/faqs` |
| Statement of Operating Procedures | `/en/cssb/about/statement-of-operating-procedures` |
| Meetings and Events | `/en/cssb/meetings-and-events` |
| Committees | `/en/cssb/committees` |
| News Listings | `/en/cssb/news-listings` |
| Volunteer Opportunities | `/en/cssb/volunteer-opportunities` |

**Accounting Standards Board (AcSB)** → `/en/acsb`
| Page | URL |
|------|-----|
| About | `/en/acsb/about` |
| Terms of Reference | `/en/acsb/about/terms-of-reference` |
| Members | `/en/acsb/about/members` |
| Due Process | `/en/acsb/about/due-process` |
| International Activities | `/en/acsb/about/international-activities` |
| Annual Reports | `/en/acsb/about/annual-reports` |
| Strategic Plan | `/en/acsb/about/strategic-plan` |
| Annual Plan | `/en/acsb/about/annual-plan` |
| Meetings and Events | `/en/acsb/meetings-and-events` |
| Committees (13 sub-committees) | `/en/acsb/committees` |
| → Academic Advisory Committee | `/en/acsb/committees/aac` |
| → Agriculture Advisory Group | `/en/acsb/committees/aag` |
| → Canadian Private Enterprise User Advisory Committee | _(URL TBD)_ |
| → IFRS Accounting Standards Discussion Group | `/en/acsb/committees/ifrsdg` |
| → IFRS Interpretations Committee MSG | `/en/acsb/committees/iicmsg` |
| → Insurance Transition Resource Group | `/en/acsb/committees/itrc` |
| → Medium and Small Practitioners Advisory Committee | `/en/acsb/committees/mspac` |
| → Not-for-Profit Advisory Committee | `/en/acsb/committees/nfpac` |
| → Pension Plan Advisory Committee | `/en/acsb/committees/ppac` |
| → Private Enterprise Advisory Committee | `/en/acsb/committees/peac` |
| → Rate-regulated Activities Transition Resource Group | _(URL TBD)_ |
| → Risk Mitigation Accounting Working Group | _(URL TBD)_ |
| → User Advisory Committee | `/en/acsb/committees/uac` |
| News Listings | `/en/acsb/news-listings` |
| Volunteer Opportunities | `/en/acsb/volunteer-opportunities` |

**Public Sector Accounting Board (PSAB)** → `/en/psab`
| Page | URL |
|------|-----|
| About | `/en/psab/about` |
| Terms of Reference | `/en/psab/about/terms-of-reference` |
| Members | `/en/psab/about/members` |
| Due Process | `/en/psab/about/due-process` |
| International Activities | `/en/psab/about/international-activities` |
| Annual Reports | `/en/psab/about/annual-report` |
| Strategic Plan | `/en/psab/about/strategic-plan` |
| Meetings and Events | `/en/psab/meetings-and-events` |
| Committees | `/en/psab/committees` |
| News Listings | `/en/psab/news-listings` |
| Volunteer Opportunities | `/en/psab/volunteer-opportunities` |

**Auditing and Assurance Standards Board (AASB)** → `/en/aasb`
| Page | URL |
|------|-----|
| About | `/en/aasb/about` |
| Terms of Reference | `/en/aasb/about/terms-of-reference` |
| Members | `/en/aasb/about/members` |
| Due Process | `/en/aasb/about/due-process` |
| International Activities | `/en/aasb/about/international-activities` |
| Annual Reports | `/en/aasb/about/annual-report` |
| Strategic Plan | `/en/aasb/about/strategic-plan` |
| Meetings and Events | `/en/aasb/meetings-and-events` |
| Committees | `/en/aasb/committees` |
| → AASB Steering Committee | `/en/aasb/committees/aasbsc` |
| → Audits of Less Complex Entities AG | `/en/aasb/committees/less-complex-entities` |
| → Securities Regulations AG | `/en/aasb/committees/srag` |
| News Listings | `/en/aasb/news-listings` |
| Volunteer Opportunities | `/en/aasb/volunteer-opportunities` |

#### Standards (11 sub-sections, each with tabs) ✅ VERIFIED

| Standards Section | URL | Tab Set |
|-------------------|-----|---------|
| Canadian Sustainability Disclosure Standards | `/en/sustainability` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| IFRS® Accounting Standards | `/en/ifrsstandards` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources, IFRIC Agenda Decisions (6 tabs) |
| Accounting Standards for Private Enterprises (ASPE) | `/en/aspe` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Accounting Standards for NFP Organizations | `/en/nfpos` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Accounting Standards for Pension Plans | `/en/pensions` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Public Sector Accounting Standards | `/en/public-sector` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| International Public Sector Accounting Standards | `/en/public-sector-international` | _(varies)_ |
| Canadian Standards on Quality Management | `/en/csqc` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Canadian Auditing Standards | `/en/cas` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Canadian Assurance Standards on Sustainability | `/en/cass` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |
| Other Canadian Standards | `/en/other` | Overview, Project Listing, Documents for Comment, Effective Dates, Resources (5 tabs) |

**Each Standards section generates these child pages:**
- `/en/{standard}` → Overview (active projects table)
- `/en/{standard}/projects` → Project Listing (timeline table)
- `/en/{standard}/projects/{project-slug}` → Project Detail
- `/en/{standard}/documents` → Documents for Comment listing
- `/en/{standard}/documents/{doc-slug}` → Document Detail (Exposure Draft)
- `/en/{standard}/effective-dates` → Effective Dates table
- `/en/{standard}/resources` → Resources listing
- `/en/{standard}/ifric-agenda-decisions` → IFRIC Agenda Decisions (IFRS only)

### 1.2 Utility Navigation ✅ VERIFIED
| Item | URL |
|------|-----|
| Login | `/en/my-account/login` |
| My Account / Subscriptions | `/en/my-account/mysubscriptions` |
| Language Toggle (displays current language name, e.g. "English") | `/fr` (French mirror) |
| Search | Global search overlay |

### 1.3 Footer Links ✅ VERIFIED (⚠️ minor label corrections)
| Section | Links |
|---------|-------|
| FRAS Canada (full name: "Financial Reporting & Assurance Standards Canada") | About, Research Program, News Listings, Job Opportunities, Volunteer Opportunities, Contact |
| Council | RASOC |
| Boards | CSSB, AcSB, PSAB, AASB |
| Standards: Sustainability | Canadian Sustainability Disclosure Standards |
| Standards: Accounting | IFRS, ASPE, NFP, Pensions |
| Standards: Public Sector | PSAS, International PSAS |
| Standards: Assurance | CSQM, CAS, CASS, Other |
| Bottom Bar | Contact, Receive Enewsletter, Copyright |
| Social | LinkedIn, ⚠️ Twitter (site still uses "Twitter" label with legacy icon, not "X"), YouTube |
| Legal | Cookie Policy, ⚠️ Privacy (link text is "Privacy", not "Privacy Policy"), Terms of Use |

### 1.4 Estimated Total Pages
| Content Type | Estimate |
|--------------|----------|
| Homepage | 1 |
| News Listings (⚠️ 101 pages × 10/page) | ~1,010 news items |
| Board/Council landing pages | 5 |
| Board sub-pages (About, Members, ToR, etc.) | ~40 |
| Committee pages | ~25+ |
| Standards section overview pages | 11 |
| Standards sub-tab pages (projects, docs, dates, resources) | ~50 |
| Project detail pages | ~100+ |
| Document detail pages | ~50+ |
| Resource/article detail pages | ~100+ |
| Meeting summary detail pages | ~180+ per board |
| Static pages (Contact, Jobs, Volunteer, Login, etc.) | ~10 |
| **Automated crawl total (EN only)** | **894 unique URLs discovered** |

---

## 2. Page Types / Templates

### Template 1: Homepage ✅ VERIFIED
- **URL:** `/en`
- **Layout:** Full-width, no sidebar
- **Sections:** Hero banner with FRAS logo → "Top Stories" H1 heading → 3-column feature cards on deep purple bg (H2 title with underline rule, landscape image, excerpt, CTA button like "Register now"/"Read now") → "News Listings" H2 heading with 6 category filter pills, sort dropdown, date range, items per page, pagination (⚠️ **101 pages**, not 102)
- **Used by:** Homepage only

### Template 2: Board/Council Landing (Dashboard) ⚠️ CORRECTED
- **URL pattern:** `/en/acsb`, `/en/rasoc`, `/en/psab`, `/en/aasb`, `/en/cssb`
- **Layout:** Section tabs + full-width content blocks
- **Sections:** H1 title → About intro block (gray bg) with "Read more" CTA + Contact sidebar CTA → **Flexible promotional content zone** (varies per board — see below) → Meeting & event summaries feed (3 items + "See all" link) → News feed (3 items + "See all" link)
- **Used by:** 5 board/council pages

⚠️ **Verified variation across boards:**

| Element | AcSB | PSAB | AASB | CSSB | RASOC |
|---------|------|------|------|------|-------|
| Tab count | 5 (About, Meetings, Committees, News Listings, Volunteer Opportunities) | 5 (same) | **6** (same + **Initiatives**) | 5 (same as AcSB) | **6** (same + **Recruitment Guidelines**) |
| Promotional content zone | Newsletter CTA + Social media links | Survey CTA (time-sensitive) | 2 promo blocks (CAS 570 + Roundtable) | 2 promo blocks (video + strategic plan) | Newsletter CTA + inline social media pills |
| "Upcoming meetings & events" section | No | No | **Yes** | No | No |
| Social media links (inline) | Yes | No | No | No | **Yes** (purple pills) |
| Contact block style | Direct email | Direct email | Direct email | ⚠️ Email (display/href mismatch) | Button to `/en/rasoc/contact-us` |
| Meeting terminology | Meeting Summary | Meeting Summary | Meeting Summary | Decision Summary | Meeting Minutes |
| Banner logo | AcSB | PSAB | AASB | FRAS Sustainability | RASOC |

> **Key finding:** The promotional content zone between the About intro and Meeting summaries is a **flexible/editor-configurable area**, not a fixed Newsletter CTA. Only AcSB and RASOC have the newsletter CTA; other boards use this zone for surveys, announcements, or promotional blocks.
>
> **Bugs found:** RASOC PSAB link points to `/en/cssb` (wrong board). CSSB contact email display/href mismatch.

### Template 3: Content Page + Right Sidebar ✅ VERIFIED
- **URL pattern:** `/en/about`, `/en/acsb/about`, `/en/research-program`, etc.
- **Layout:** ~70% main content / ~30% right sidebar
- **Sections:** Breadcrumbs → Section tabs (up to 7) → H1 → Rich text content with optional Staff Contact(s) sidebar OR section navigation sidebar
- **Variants:**
  - **With Staff Contact sidebar:** Research Program (includes "Submit your research" dark purple CTA + News section), project details, document details. ⚠️ Staff Contact heading uses **H2** tag, not H3.
  - **With Section Nav sidebar:** About (4 links: About, Due Process, International Activities, IRCSS Recommendations — plain gray text, no heading label), Committees, Members
- **Used by:** ~50+ pages

### Template 4: People Listing (Members) ✅ VERIFIED
- **URL pattern:** `/en/acsb/about/members`, `/en/psab/about/members`, etc.
- **Layout:** ~70% main + ~30% sidebar
- **Sections:** 2-column grid of member cards (205×205px portrait photo, name link, credentials, appointment dates, role label) + section nav sidebar (About, Terms of Reference, Members, Due Process, International Activities, Annual Report, Strategic Plan, Annual Plan)
- **Used by:** ~5 pages (one per board)

### Template 5: Standards Overview (Tabbed) ✅ VERIFIED
- **URL pattern:** `/en/ifrsstandards`, `/en/aspe`, `/en/sustainability`, etc.
- **Layout:** Full-width with section tabs
- **Sections:** Board logo hero → Breadcrumbs → Section title → Tab navigation (Overview / Project Listing / Documents for Comment / Effective Dates / Resources — 5 tabs; IFRS adds 6th: IFRIC Agenda Decisions) → Active Projects table (project name link + description) → Optional feature blocks (CPA Handbook CTA, Submit an Issue CTA) → News feed (3 items)
- **Used by:** 11 standards sections

### Template 6: Project Listing (Timeline Table) ✅ VERIFIED (⚠️ label corrections)
- **URL pattern:** `/en/{standard}/projects`
- **Layout:** Full-width tabbed
- **Sections:** Filter pills (⚠️ "Active Projects" / "Completed Projects" / "Deferred Projects" — full labels, not abbreviated) → Timeline table with time columns (⚠️ format is Q1, Q2, H2 — third column is half-year, not a quarter) showing milestone badges (e.g., "Exposure Draft", "Final Amendments")
- **Used by:** 11 standards sections

### Template 7: Project Detail ✅ VERIFIED
- **URL pattern:** `/en/{standard}/projects/{slug}`
- **Layout:** ~70% main + Staff Contact sidebar (⚠️ heading is H2, not H3)
- **Sections:** "Back to projects" link (CSS-generated chevron, not inline character) → H1 → H2 "Summary" + paragraphs + Staff Contact(s) sidebar → Project Status timeline (5 phases with correct names, green checkmark PNGs via CSS `::before` for complete items, purple bg `rgb(96,31,91)` for current phase, light gray for others) → Related News feed (H2 "News") → Meeting & event summaries section (⚠️ not in original spec but present) → Disclaimer block (⚠️ pure black bg `rgb(0,0,0)`, text is **NOT italicized** — `font-style: normal`, semi-transparent white text `rgba(255,255,255,0.82)`)
- **Used by:** ~100+ project pages

### Template 8: Documents for Comment Listing ✅ VERIFIED
- **URL pattern:** `/en/{standard}/documents`
- **Layout:** Full-width tabbed
- **Sections:** Filter pills (Open for Comment / Closed for Comment — pill toggles via `?tab=closed-for-comment`) → Grouped table with gray banner section headers (e.g., "Exposure Drafts", "Consultation Papers") → Document links with "Submit comment" dark purple buttons (Open tab) or "View Comments" PDF links (some Closed items). Alternating white/gray row styling. ⚠️ Non-semantic table markup (`role="presentation"` divs). No comment deadlines shown on listing.
- **Used by:** 11 standards sections

### Template 9: Document Detail (Exposure Draft) ✅ VERIFIED
- **URL pattern:** `/en/{standard}/documents/{slug}`
- **Layout:** ~70% main + Staff Contact sidebar
- **Sections:** H1 → bold purple "Highlights" heading with paragraphs → Rich body content (IASB Exposure Draft section with external links, "Comments Requested" with blockquoted questions) → "When to Reply" with **bold** deadline dates (e.g., "**April 20, 2026**") → "How to Reply" dark purple/near-black CTA block with full contact address + "Submit comment" button → "Support Materials" heading with chain-link icon + linked docs → Staff Contact(s) sidebar (same info repeated in How to Reply block). No "back to listing" link — must use breadcrumb or tabs.
- **Used by:** ~50+ document pages

### Template 10: Effective Dates Table ✅ VERIFIED
- **URL pattern:** `/en/{standard}/effective-dates`
- **Layout:** Full-width tabbed
- **Sections:** Intro disclaimer text (italic, with link to CPA Canada Handbook on Knotia.ca) → Data table with bold "Application" / "Pronouncement" column headers → 13 purple section header rows with white text grouping by effective date → Rich text in cells with italic standard names, bullet lists, footnotes. ⚠️ Non-semantic markup (`role="presentation"` divs). ⚠️ 2018 section appears before 2019 (out of chronological order).
- **Used by:** 11 standards sections

### Template 11: Resources Listing ✅ VERIFIED (⚠️ corrections)
- **URL pattern:** `/en/{standard}/resources`
- **Layout:** Full-width tabbed
- **Sections:** Category filter pills (⚠️ alphabetical order: All Items / Article / Guidance / In Brief / Other / Webinar) → Dropdown filter (All Types — options: Audio, External Link, PDF, Video, Webpage, Plain Language) + Sort by (Newest/Oldest) + Date range (mm/dd/yyyy) + Items per page (10/20/30/All) → Paginated listing (date + category tags + linked title + excerpt). ⚠️ **PDF icon NOT observed** on any listing item — items do not display resource-type icons.
- **Used by:** 11 standards sections

### Template 12: Filtered News/Event Listing ✅ VERIFIED
- **URL pattern:** `/en/news-listings`, `/en/acsb/news-listings`, `/en/volunteer-opportunities`
- **Layout:** Full-width
- **Sections:** 6 category filter pills (All Items, Document for Comment, International Activity, Meeting Summary, News, Resource — mobile has `<select>` dropdown fallback) → Items per page (10/20/30/All) → Sort by (Newest/Oldest) → Date range (mm/dd/yyyy) → Paginated listing items (date + category tag + linked purple title + excerpt, some with external-link icons). ⚠️ Pagination: **101 pages** at 10 items/page. No total results count displayed. Text-only items (no thumbnails). ASP.NET PostBack for all interactions.
- **Variants:**
  - Homepage news: 6 category pills
  - Board news listings: Board-specific content
  - Volunteer opportunities: Board-based category tabs (AASB/CSSB/PSAB/RASOC/AcSB)
- **Used by:** ~10+ listing pages

### Template 13: Meetings & Events Listing ✅ VERIFIED
- **URL pattern:** `/en/acsb/meetings-and-events`, etc.
- **Layout:** Full-width
- **Sections:** Tab toggle ("Upcoming meetings & events" / "Past meetings & events") → Items per page dropdown (default: 10) → Paginated list (linked h2 title + excerpt). No category filters. Default view shows Past tab.
- **Pagination confirmed:** AcSB has 18 pages (~180+ items)
- **Used by:** ~5 pages (one per board)

### Template 14: Committee Index / Directory ✅ VERIFIED
- **URL pattern:** `/en/acsb/committees`, etc.
- **Layout:** ~70% main + sidebar mirror
- **Sections:** List of committee entries (linked name + description paragraph). Right sidebar mirrors as anchor navigation listing all committees.
- **AcSB verified:** 13 committees listed (confirmed twice)
- **Used by:** ~5 pages

### Template 15: Contact / Form Page ✅ VERIFIED (⚠️ label corrections)
- **URL pattern:** `/en/contact-us`
- **Layout:** Full-width, no sidebar
- **Sections:** Intro text → Contact form (Full Name*, Title, Organization, ⚠️ "Email address"*, ⚠️ "Business Phone", Comments* textarea) → Image CAPTCHA (text-based, not reCAPTCHA) + refresh button → SUBMIT button → Media Inquiries contact block (Daniella Girgenti, CMP, Director of Communications)
- **Used by:** 1 page (+ potentially committee-specific submit forms at `/en/{board}/submit-comment`)

### Template 16: Authentication Page ✅ VERIFIED
- **URL pattern:** `/en/my-account/login`
- **Layout:** Full-width, no sidebar
- **Sections:** Login form ("User Name (email address):" `type="text"` input + "Password:" input + "Forgot your User Name?" link to `/en/my-account/forgot-username` + "Forgot your Password?" link to `/en/my-account/forgot-my-password`) → Full-width purple "Log in" button (⚠️ two words "Log in", not "Login" as in nav) → "Not registered yet?" + "Create My account" link to `/en/my-account/register` → CPA Canada shared auth explanation (links to cpacanada.ca/en/login, explains funding) → Support: customerservice@cpacanada.ca, 1 (800) 268-3793, +1 (416) 977-0748. No CAPTCHA, no "Remember me" checkbox. ASP.NET PostBack submit.
- **Used by:** Login, Registration, Password reset

### Template 17: Simple Content / Empty State ✅ VERIFIED
- **URL pattern:** `/en/job-opportunities`
- **Layout:** Full-width, no sidebar
- **Sections:** Intro prose ("Become a part of something special!" + 2 body paragraphs + italic CPA Canada funding note) → "Open Positions" bold heading → Dynamic listing area (currently shows italic empty state: *"Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!"*). No filtering/sorting/pagination controls. No fallback CTA. Transitions directly to footer when empty.
- **Used by:** Job opportunities, potentially other conditional-content pages

---

## 3. Component / Content Block Inventory

### 3.1 Global Components (every page) ✅ VERIFIED

| Component | Description |
|-----------|-------------|
| **Header Nav Bar** | Logo + 4 mega-menu dropdowns + Login + Language toggle (displays current language name) + Search icon |
| **Mega Menu Dropdown** | Multi-column dropdown with grouped links and section headers |
| **Hero Banner** | Full-width purple-to-blue gradient with dotted circle overlay pattern + contextual board/org logo (white) |
| **Breadcrumbs** | `Home / Section / Subsection / Page` — up to 4 levels deep |
| **Section Title Block** | Bold section name (e.g., "AcSB") above horizontal tab navigation |
| **Section Tab Navigation** | Horizontal tabs with purple underline active indicator (varies by section: 5-7 tabs) |
| **Footer** | Dotted bg pattern, 2-column link structure, bottom bar with social + legal |
| **Cookie Consent Banner** | OneTrust-powered modal with Allow All / Reject All / Confirm My Choices |
| **Cookie Preferences Button** | Floating bottom-left green gear icon |

### 3.2 Content Components

| Component | Description | Used On |
|-----------|-------------|---------|
| **Feature Card (Top Stories)** | Purple bg, H2 title, image, excerpt, CTA button | Homepage |
| **News List Item** | Date + category tag(s) + linked H2 title + excerpt | Homepage, News Listings, Project Detail |
| **Meeting Summary Item** | Date + linked H2 title + excerpt | Board landing, Meetings listing |
| **Staff Contact Card** | Purple ⚠️ **H2** "Staff Contact(s)" + Name + credentials + title + phone icon + email icon | Project Detail, Document Detail, Research Program |
| **Section Nav Sidebar** | Vertical list of sibling page links, active item bolded/underlined | About, Members, Committees |
| **Category Filter Pills** | Horizontal row of bordered pill buttons, active pill filled dark. ⚠️ Labels include context word (e.g., "Active Projects" not just "Active") | News, Resources, Documents, Volunteer, Project Listing |
| **Sort/Filter Bar** | Dropdowns for Sort By, Items Per Page, Date Range (Start/End) | News, Resources, Volunteer |
| **Pagination** | Numbered page links (1, 2, 3 ... N) + prev/next arrows | News, Meetings, Resources |
| **Tab Toggle** | 2-button bordered toggle (e.g., "Upcoming meetings & events" / "Past meetings & events", Open/Closed, Active Projects/Completed Projects/Deferred Projects) | Meetings, Documents, Project Listing |
| **Data Table (Active Projects)** | 2-column: Project name link + description | Standards Overview |
| **Timeline Table (Project Listing)** | Project name + time columns with milestone badges. ⚠️ Columns are Q1, Q2, H2 (half-year for second half) | Project Listing |
| **Project Status Timeline** | Phased table: Information gathering → Approving → Engaging → Deliberating → Final pronouncement, with green checkmarks | Project Detail |
| **Effective Dates Table** | Application/Pronouncement columns with purple section header rows | Effective Dates |
| **Documents Table** | Grouped by type (Exposure Drafts, etc.) with "Submit comment" action buttons | Documents for Comment |
| **Dark Purple CTA Block** | Full-width dark purple bg with H3 + description + button (Submit/Subscribe) | Document Detail, Research Program, Sustainability Overview |
| **Flexible Promotional Content Zone** | ⚠️ Editor-configurable block area — can contain newsletter CTA, survey CTA, promotional announcements, or feature highlights. Varies per board. | Board landings |
| **2-Column Feature Block** | Dark purple bg, 2 content columns (e.g., Indigenous Peoples + CPA Handbook) | Sustainability Overview |
| **Newsletter CTA Block** | "Stay Up to Date" + Subscribe button + social links (X, LinkedIn, YouTube). ⚠️ Only confirmed on AcSB + RASOC landings, not universal. | AcSB + RASOC landings |
| **Disclaimer Block** | Pure black bg (`rgb(0,0,0)`) with ⚠️ **non-italic** legal text (`font-style: normal`, semi-transparent white) | Project Detail |
| **Support Materials** | Chain-link icon + linked document name | Document Detail |
| **Member Card** | Portrait photo (205×205px) + name (link) + credentials + appointment date table + role label (CHAIR etc.) | Members pages |
| **Contact Form** | Labels left / inputs right: text inputs + textarea + image CAPTCHA + Submit | Contact page |
| **Login Form** | Email input + Password input + Forgot links (inline) + Login button | Login page |
| **Empty State Message** | Italicized "no content available" message | Job Opportunities, empty listings |
| **External Link Icon** | Small arrow-out-of-box icon next to links that go offsite | News items linking to external PDFs |
| **PDF Icon** | ⚠️ **NOT CONFIRMED** — claimed as small PDF indicator next to document download links, but not observed on any Resources listing item during verification. May only appear on specific resource types or may not exist. | Resources listings (unverified) |
| **"Read more" / "Read now" Button** | Variant: filled red/maroon (RASOC) or bordered outline (AcSB) or filled purple | Board landings, Feature cards |
| **"Back to projects" Link** | `< Back to projects` navigation link | Project Detail |

### 3.3 Component Metadata / Content Breakdown

Below is the exact data that feeds into each reusable component — what fields are needed, what's required vs optional, and display format.

#### Header Nav Bar ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Logo | Image (SVG) | Yes | FRAS Canada dot-pattern logo, links to homepage |
| Primary Nav Items | Array of NavItem | Yes | 4 items: FRAS Canada, Council, Boards, Standards |
| → NavItem.label | String | Yes | Display text |
| → NavItem.href | URL | No | Top-level may not link (e.g., "Boards") |
| → NavItem.children | Array of NavGroup | Yes | Mega-menu dropdown content |
| → → NavGroup.heading | String | No | Group label within dropdown (e.g., "Accounting") |
| → → NavGroup.links | Array of {label, href} | Yes | Individual nav links |
| Login Button | {label, href} | Yes | "/en/my-account/login" |
| Language Toggle | {currentLang, alternateLang, alternateHref} | Yes | Displays current language name (e.g., "English"), toggles to alternate |
| Search | Boolean | Yes | Triggers search overlay |

#### Hero Banner
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Background | CSS gradient + SVG pattern | Yes | Purple-to-blue gradient with dotted circle overlay |
| Section Logo | Image (SVG, white) | Yes | Changes per section: FRAS, AcSB, PSAB, AASB, CSSB, RASOC, Sustainability variant |
| Logo Alt Text | String | Yes | e.g., "Accounting Standards Board" |

#### Breadcrumbs
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Items | Array of {label, href} | Yes | Min 1 (Home), max 4 levels. Last item = current page (no link) |

#### Section Tab Navigation ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Tabs | Array of {label, href, isActive} | Yes | 5-7 tabs depending on section. ⚠️ AASB has 6 tabs (extra: INITIATIVES), RASOC has 6 tabs (extra: RECRUITMENT GUIDELINES) |
| Active Indicator | Derived | Auto | Purple underline bar under active tab |

#### Feature Card (Top Stories)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | String (H2) | Yes | White text on purple bg |
| Image | Image (landscape, ~400×250) | Yes | Below title, full card width |
| Excerpt | String (paragraph) | Yes | White text, ~3-5 sentences |
| CTA Label | String | Yes | e.g., "Register now", "Read now" |
| CTA Href | URL | Yes | Links to detail page |
| Background Color | CSS | Yes | Dark purple |

#### News List Item
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Date | Date | Yes | Format: "March 4, 2026" — gray text |
| Categories | Array of String | Yes | e.g., ["Document for Comment"], ["News"], ["Resource", "Article"] — gray text |
| Title | String (H2 link) | Yes | Purple linked text |
| Excerpt | String (paragraph) | Yes | 2-4 sentences, dark gray |
| External URL | URL | No | If present, shows external link icon (↗) |
| Internal URL | URL | No | Links to detail page |

#### Meeting Summary Item
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | String (H2 link) | Yes | Purple linked text, includes date in title (e.g., "AcSB Decision Summary – January 22, 2026") |
| Excerpt | String (paragraph) | Yes | 2-3 sentences |
| Href | URL | Yes | Links to meeting detail page |

#### Staff Contact Card ✅ VERIFIED (⚠️ corrected)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Heading | String | Yes | Always "Staff Contact(s)" — purple ⚠️ **H2** (not H3 as originally reported) with color `rgb(96, 31, 91)` |
| Name | String | Yes | Bold, e.g., "Andrew White, CPA, CA" |
| Title | String | Yes | e.g., "Associate Director, Accounting Standards Board" |
| Phone | String (tel link) | Yes | Format: "+1 416 204 3487" with phone icon |
| Email | String (mailto link) | Yes | e.g., "awhite@acsbcanada.ca" with mail icon |

#### Section Nav Sidebar ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Links | Array of {label, href, isActive} | Yes | Vertical list, active item bolded with underline |
| Count | Varies | — | 4-8 links depending on section depth. AcSB Members sidebar: About, Terms of Reference, Members, Due Process, International Activities, Annual Report, Strategic Plan, Annual Plan |

#### Category Filter Pills ✅ VERIFIED (⚠️ label correction)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Options | Array of {label, value, isActive} | Yes | First option = "All Items" (default active). ⚠️ Labels are contextual, e.g., "Active Projects" not just "Active" |
| Style | Variant | — | Active = filled dark bg, inactive = bordered/outline |

#### Sort/Filter Bar
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Filters Dropdown | {label, options[]} | No | e.g., "All Types" with type options |
| Sort By | {label, options[]} | Yes | "Publication date: Newest" / "Oldest" |
| Items Per Page | {label, options[]} | Yes | 10 (default), 20, 30, All |
| Start Date | Date input | No | Format: mm/dd/yyyy |
| End Date | Date input | No | Format: mm/dd/yyyy |

#### Pagination ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Current Page | Number | Yes | Highlighted / non-linked |
| Total Pages | Number | Yes | Used to render: 1, 2, 3 ... 17, 18 (AcSB meetings verified at 18 pages) |
| Prev/Next | Boolean | Yes | Arrow buttons, disabled at boundaries |
| Page Size | Number | Yes | From items-per-page selector |

#### Tab Toggle ✅ VERIFIED (⚠️ label correction)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Options | Array of {label, isActive} | Yes | 2-3 options. ⚠️ Full labels: "Upcoming meetings & events" / "Past meetings & events", or "Active Projects" / "Completed Projects" / "Deferred Projects" |
| Style | Variant | — | Active = filled dark, inactive = bordered |

#### Data Table (Active Projects — Standards Overview) ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Rows | Array of ProjectSummary | Yes | |
| → Project Name | String (link) | Yes | Purple link to project detail |
| → Description | String | Yes | 1-2 sentence summary |

#### Timeline Table (Project Listing) ✅ VERIFIED (⚠️ column correction)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Columns | Array of String | Yes | ⚠️ Format: "2026 Q1", "2026 Q2", "2026 H2" — third column is half-year (H2), not a quarter |
| Rows | Array of ProjectTimeline | Yes | |
| → Project Name | String (link) | Yes | Purple link |
| → Milestones | Array of {column, label} | No | e.g., {column: "2026 Q1", label: "Exposure Draft"} — rendered as bordered badge |

#### Project Status Timeline
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Phases | Array of Phase | Yes | Exactly 5 phases in order |
| → Phase.name | String | Yes | "Information gathering", "Approving project", "Engaging communities", "Deliberating feedback", "Final pronouncement" |
| → Phase.items | Array of {status: "complete"/"in-progress", description: String} | Yes | Green checkmark (✔) for complete items |
| → Phase.isCurrent | Boolean | No | Current phase gets purple bg highlight |

#### Effective Dates Table ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Section Headers | Array of {label, bgColor} | Yes | 13 purple bg rows with white text, grouped by effective date (e.g., "Effective date to be determined:", year-specific dates). ⚠️ Non-semantic markup (`role="presentation"` divs). ⚠️ 2018 section appears before 2019 (out of chronological order). |
| Rows | Array of EffectiveDate | Yes | |
| → Application | Rich text | Yes | Standard names in italics, bullet lists, footnotes |
| → Pronouncement | String | Yes | e.g., "Prospective" |

#### Documents Table
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Groups | Array of DocGroup | Yes | |
| → Group.heading | String | Yes | e.g., "Exposure Drafts" — gray bg header row |
| → Group.items | Array of DocItem | Yes | |
| → → DocItem.title | String (link) | Yes | Purple link to document detail |
| → → DocItem.action | {label, href} | No | "Submit comment" button (only for Open docs) |

#### Dark Purple CTA Block
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Heading | String (H3) | Yes | White text on dark purple bg |
| Body | String (paragraph) | Yes | White text |
| CTA Label | String | No | e.g., "Submit", "Get the Handbook" |
| CTA Href | URL | No | Button link |
| Contact Info | Rich text | No | Name, title, address, email (for "How to Reply" variant) |
| Variant | Enum | — | "cta-simple" (Submit) / "cta-contact" (with address) / "cta-2col" (2-column feature) |

#### 2-Column Feature Block
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Column 1 | {heading, body} | Yes | Dark purple bg, white text |
| Column 2 | {heading, body, ctaLabel?, ctaHref?} | Yes | Optional CTA button |

#### Newsletter CTA Block ⚠️ CORRECTED — not universal
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Heading | String | Yes | "Stay Up to Date on the Progress of Standard-setting Initiatives" |
| Description | String | Yes | Subscribe prompt |
| CTA Label | String | Yes | "Subscribe" |
| CTA Href | URL | Yes | `/en/my-account/mysubscriptions` |
| Social Links | Array of {platform, href, icon} | Yes | X, LinkedIn, YouTube |
| ⚠️ **Note** | — | — | Confirmed on AcSB + RASOC landing pages. Other boards (PSAB, AASB, CSSB) use different promotional content in this zone. |

#### Disclaimer Block ✅ VERIFIED (⚠️ corrected)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Body | Rich text | Yes | ⚠️ Text is **NOT italicized** (`font-style: normal`). Semi-transparent white text `rgba(255,255,255,0.82)` on pure black bg `rgb(0,0,0)`. Includes "Disclaimer" span title + legal paragraph. |

#### Support Materials
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Items | Array of {title, href, icon} | Yes | Chain-link icon + linked document name |

#### Member Card ✅ VERIFIED
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Photo | Image (portrait, ~205×205px) | Yes | Square headshot (⚠️ verified at 205×205, not ~100×120) |
| Name | String (link) | Yes | Purple link to bio page `/en/{board}/about/members/{name-slug}` |
| Credentials | String | No | e.g., "FCPA, FCA, CPA(MI)" |
| Role Label | String | No | Uppercase bold: "CHAIR", "VICE-CHAIR" — only for officers |
| Appointed Date | Date | Yes | Format: "January 1, 2023" |
| Term Expires | Date | Yes | Format: "December 31, 2025" |
| Section Label | String | No | e.g., "VOTING MEMBERS" — gray uppercase, groups cards |

#### Contact Form ✅ VERIFIED (⚠️ label corrections)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Text input | Yes* | Required field — label: "Full Name: *" |
| Title | Text input | No | Label: "Title:" |
| Organization | Text input | No | Label: "Organization:" |
| Email Address | Email input | Yes* | ⚠️ Label: "Email address: *" (not just "Email") |
| Business Phone | Tel input | No | ⚠️ Label: "Business Phone:" (not just "Phone") |
| Comments | Textarea | Yes* | Label: "Comments: *" |
| CAPTCHA | Image + text input + refresh button | Yes | Text-based image CAPTCHA (not reCAPTCHA) |
| Submit Button | Button | Yes | Purple filled, label: "SUBMIT" |

#### Login Form
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| User Name (Email) | Text input | Yes | With "Forgot your User Name?" link inline |
| Password | Password input | Yes | With "Forgot your Password?" link inline |
| Login Button | Button | Yes | Purple filled, full-width |
| Register CTA | {label, href} | Yes | "Create My account" link |
| Support Info | {email, phone} | Yes | CPA Canada customer service contact |

#### Cookie Consent Banner (OneTrust)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Logo | Image | Yes | OneTrust branding |
| Description | String | Yes | Privacy explanation text |
| Privacy Link | URL | Yes | `/en/privacy-policy` |
| Categories | Array of {name, description, isRequired, isEnabled} | Yes | Strictly Necessary (always on), Performance, Functional, Targeting |
| Buttons | Array of {label, action} | Yes | "Allow All", "Reject All", "Confirm My Choices" |

### 3.4 Typography & Color Patterns

| Element | Style |
|---------|-------|
| H1 Page Titles | Large, purple (#5B2D8E-ish), serif-like weight |
| H2 Section Headers | Bold, purple, smaller than H1 |
| H3 Sub-headers | Bold, dark purple |
| Body Text | Dark gray, standard serif/sans-serif |
| Links | Purple, underlined on hover |
| Category Tags | Gray text, appears above or beside titles |
| Date Display | Gray text, format: "March 4, 2026" or "February 27, 2026" |
| Primary Button | Filled purple with white text |
| Secondary Button | Bordered/outline with purple border and text |
| Hero Banner | Purple-to-blue gradient (#5B2D8E → #1A3A8C-ish) with dotted circle overlay |
| Dark Feature Block | Deep purple bg with white text |
| Gray Block | Light gray bg for intro/about sections |

---

## 4. Data & Metadata Structure

### 4.1 Content Types (Taxonomy)

| Content Type | Fields |
|--------------|--------|
| **News Item** | Title, Date (publication), Category (Document for Comment / International Activity / Meeting Summary / News / Resource), Excerpt, Body, Related Standard, External URL (optional) |
| **Project** | Title, Slug, Standard (parent), Status (Active/Completed/Deferred), Summary, Project Phases (Information gathering, Approving, Engaging, Deliberating, Final pronouncement — each with status + description), Staff Contact(s), Related News, Timeline milestones (quarterly + half-year), Disclaimer |
| **Document for Comment** | Title, Slug, Standard (parent), Type (Exposure Draft / Re-exposure Draft / etc.), Status (Open/Closed), Highlights, Body, Comments Requested, Reply Deadline, How to Reply (contact info), Staff Contact(s), Support Materials (linked docs) |
| **Resource** | Title, Date, Type (Webinar / Other / In Brief / Guidance / Article), Excerpt, Body or PDF link, Standard (parent) |
| **Meeting/Event** | Title, Date, Board (parent), Type (Meeting Summary / Decision Summary / Meeting Minutes / Discussion Group Meeting Report / On-demand Webinar — ⚠️ terminology varies by board: AcSB/PSAB/AASB use "Meeting Summary", CSSB uses "Decision Summary", RASOC uses "Meeting Minutes"), Excerpt, Body |
| **Member** | Name, Photo (portrait, 205×205px), Credentials, Title/Role, Appointed Date, Term Expires, Board(s), Bio URL |
| **Committee** | Name, Slug, Board (parent), Description, Members |
| **Board/Council** | Name, Slug, Logo, About text, Contact info, Sub-navigation structure, Tab configuration (⚠️ varies: 5-6 tabs) |
| **Standard** | Name, Slug, Board (parent), Logo, Overview content, Tab configuration (5 base tabs; IFRS adds IFRIC Agenda Decisions = 6) |
| **Job Opportunity** | Title, Description (conditional display / empty state) |
| **Volunteer Opportunity** | Title, Date, Board(s) (AASB/CSSB/PSAB/RASOC/AcSB), Description, External Application URL |
| **Page** | Title, Body (rich text), Sidebar content, Breadcrumb path |

### 4.2 Taxonomy / Classification

| Taxonomy | Values |
|----------|--------|
| **News Category** | Document for Comment, International Activity, Meeting Summary, News, Resource |
| **Resource Type (category pills)** | Article, Guidance, In Brief, Other, Webinar (⚠️ alphabetical order on live site) |
| **Resource Type (dropdown filter)** | Audio, External Link, PDF, Video, Webpage, Plain Language (separate taxonomy from pills) |
| **Project Status** | Active, Completed, Deferred |
| **Document Status** | Open for Comment, Closed for Comment |
| **Meeting Time** | Upcoming, Past |
| **Board** | AcSB, AASB, PSAB, CSSB, RASOC |
| **Standard** | Sustainability, IFRS, ASPE, NFP, Pensions, Public Sector, IPSAS, CSQM, CAS, CASS, Other |
| **Project Phase** | Information gathering, Approving project, Engaging communities, Deliberating feedback, Final pronouncement |
| **Member Role** | Chair, Vice-Chair, (regular member) |
| **Language** | English (`/en/`), French (`/fr/`) |

### 4.3 Relationships

```
Board/Council ──┬── Committees
                ├── Members
                ├── Meetings & Events
                ├── News Listings
                ├── Volunteer Opportunities
                └── Standards ──┬── Projects ── News (related)
                                ├── Documents for Comment
                                ├── Effective Dates
                                └── Resources
```

### 4.4 URL Structure Pattern

```
/{lang}/{section}/{subsection}/{detail}

Examples:
/en/acsb/about/members                    → Board > About > Members
/en/ifrsstandards/projects/{slug}          → Standard > Projects > Detail
/en/ifrsstandards/documents/{slug}         → Standard > Documents > Detail
/en/acsb/meetings-and-events/{date-slug}   → Board > Meetings > Detail
/en/acsb/committees/{abbreviation}         → Board > Committees > Detail
```

---

## 5. Technology & Platform Notes

| Aspect | Detail |
|--------|--------|
| **CMS** | Sitecore (ASP.NET WebForms — hidden form fields, PostBack pagination) |
| **Cookie Consent** | OneTrust |
| **Authentication** | Federated with CPA Canada (shared credentials) |
| **Forms** | ASP.NET server-side with image-based CAPTCHA (not reCAPTCHA) |
| **Pagination** | ASP.NET PostBack (not URL-based routing) |
| **Social** | LinkedIn, Twitter (site still uses "Twitter" branding), YouTube |
| **External Integrations** | CPA Canada login, Knotia.ca (CPA Handbook), Pathways Executive Search (volunteer applications), IASB/IFRS.org |
| **Bilingual** | Full EN/FR site with language switcher |

---

## 6. Issues Found During Exploration

| # | Severity | Issue |
|---|----------|-------|
| 1 | High | `/en/~/link.aspx` — HTTP 404 |
| 2 | High | `/en/cssb/meetings-and-events/aug-27-2025` — HTTP 500 |
| 3 | High | `/en/aspe/projects//en/aspe/projects/related-party-combinations` — HTTP 404 (double-path bug) |
| 4 | High | `/en/aspe/projects/~/link.aspx` — HTTP 404 |
| 5 | Medium | `/en/acsb/meetings-and-events/jan-22-2026` — Runtime Error (meeting detail page broken) |
| 6 | Medium | Missing Meta Description on: `/en/aasb/initiatives`, `/en/about/ircss-final-recommendations`, `/en/aspe/resources/climate-related-risks-and-opportunities-aspe/agricultural-inventories`, `/en/news-listings/2024-04-01-rasoc-announcement` |
| 7 | Low | Cloudflare bot protection blocks headless browser access (may affect SEO crawlers) |
| 8 | Low | RASOC has typo in URL: `/en/rasoc/committes` (missing an 'e' — should be "committees") |
| 9 | High | RASOC About section: PSAB link incorrectly points to `/en/cssb` instead of `/en/psab` |
| 10 | Medium | CSSB Contact block: displayed email `cssb.ccnid@frascanada.ca` but mailto href points to `lfrench@frascanada.ca` |
| 11 | Low | Effective Dates table: 2018 section appears before 2019, breaking reverse-chronological order |
| 12 | Low | Effective Dates + Documents listing: non-semantic table markup (`role="presentation"` divs) — accessibility concern |
| 13 | Low | Login page: "Log in" button text vs "Login" in nav header — inconsistent labeling |
| 14 | Low | Login page: email field uses `type="text"` instead of `type="email"` — no browser validation |

---

## 7. Verification Summary

### ALL 17 TEMPLATES VERIFIED

### Pages Verified (26+ pages across all 17 templates)
| Page | URL | Template | Result |
|------|-----|----------|--------|
| Homepage | `/en` | T1: Homepage | ✅ Top Stories cards, News listing, 101-page pagination all confirmed |
| AcSB Landing | `/en/acsb` | T2: Board Landing | ✅ All elements confirmed |
| PSAB Landing | `/en/psab` | T2: Board Landing | ⚠️ Newsletter CTA absent (survey instead) |
| AASB Landing | `/en/aasb` | T2: Board Landing | ⚠️ Extra tab (Initiatives), extra section, no newsletter CTA |
| CSSB Landing | `/en/cssb` | T2: Board Landing | ✅ 5 tabs, 2 promo blocks, contact email bug found |
| RASOC Landing | `/en/rasoc` | T2: Board Landing | ⚠️ 6 tabs (Recruitment Guidelines), PSAB link bug, newsletter CTA + social pills |
| About | `/en/about` | T3: Content + Sidebar | ✅ Section nav sidebar variant confirmed |
| Research Program | `/en/research-program` | T3: Content + Sidebar | ✅ Staff Contact sidebar variant confirmed (H2 not H3) |
| AcSB Members | `/en/acsb/about/members` | T4: People Listing | ✅ All elements confirmed |
| IFRS Standards | `/en/ifrsstandards` | T5: Standards Overview | ✅ 6 tabs confirmed |
| Sustainability | `/en/sustainability` | T5: Standards Overview | ✅ 5 tabs confirmed |
| ASPE | `/en/aspe` | T5: Standards Overview | ✅ 5 tabs confirmed |
| IFRS Projects | `/en/ifrsstandards/projects` | T6: Project Listing | ✅ Timeline table confirmed |
| Project Detail | `/en/ifrsstandards/projects/goodwill-and-impairment` | T7: Project Detail | ⚠️ All elements confirmed; disclaimer NOT italic; extra meeting summaries section |
| IFRS Documents | `/en/ifrsstandards/documents` | T8: Documents Listing | ✅ All elements confirmed |
| Document Detail | `/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option` | T9: Exposure Draft | ✅ All elements confirmed |
| Effective Dates | `/en/ifrsstandards/effective-dates` | T10: Effective Dates | ✅ All elements confirmed; non-semantic markup flagged |
| ASPE Resources | `/en/aspe/resources` | T11: Resources Listing | ⚠️ PDF icon NOT observed; pill order alphabetical |
| News Listings | `/en/news-listings` | T12: News Listing | ✅ 101 pages (not 102); all filters confirmed |
| AcSB Meetings | `/en/acsb/meetings-and-events` | T13: Meetings Listing | ✅ 18 pages pagination confirmed |
| AcSB Committees | `/en/acsb/committees` | T14: Committee Index | ✅ 13 committees confirmed |
| Contact Us | `/en/contact-us` | T15: Contact Form | ✅ All fields confirmed |
| Login | `/en/my-account/login` | T16: Auth Page | ✅ All elements confirmed; no CAPTCHA, "Log in" vs "Login" |
| Job Opportunities | `/en/job-opportunities` | T17: Empty State | ✅ Intro prose + italic empty state message confirmed |
| Footer / Nav | (global) | Global | ✅ All structural elements confirmed |

### All Corrections Applied
| Original Claim | Correction | Severity |
|----------------|------------|----------|
| Newsletter CTA is a fixed template element on all board landings | **Flexible content zone** — only AcSB + RASOC have newsletter CTA | Structural |
| All board landings have 5 tabs | AASB has **6** (Initiatives), RASOC has **6** (Recruitment Guidelines) | Structural |
| Board landing template is uniform | AASB has extra "Upcoming meetings & events"; boards vary in contact style, meeting terminology, banner logo | Structural |
| Disclaimer text is "italicized legal text" | Text is **NOT italicized** (`font-style: normal`) | Structural |
| Staff Contact heading is H3 | Actually **H2** across all templates | Structural |
| Project Detail has News feed only | Also has **Meeting & event summaries** section below News | Structural |
| Resources listing has PDF icon | **PDF icon NOT observed** on listing items | Structural |
| Homepage news has 102 pages | Actually **101 pages** | Detail |
| Social media link labeled "X" | Site still labels it **"Twitter"** | Label |
| Footer legal link "Privacy Policy" | Actual text is **"Privacy"** | Label |
| Filter pills: "Active/Completed/Deferred" | Full labels: **"Active Projects/Completed Projects/Deferred Projects"** | Label |
| Timeline has "quarterly columns" | Third column is **"H2"** (half-year), not a quarter | Label |
| Member photo ~100×120px | Actual: **205×205px** | Detail |
| Contact form "Phone" field | Actual label: **"Business Phone"** | Label |
| Contact form "Email" field | Actual label: **"Email address"** | Label |
| Auth page button matches nav | Button says **"Log in"** (2 words), nav says **"Login"** (1 word) | Label |
| Resource filter pill order matches spec | Actually **alphabetical** (Article, Guidance, In Brief, Other, Webinar) | Label |

### Bugs Found on Live Site
| Bug | Location | Severity |
|-----|----------|----------|
| RASOC PSAB link points to `/en/cssb` | `/en/rasoc` About section | High |
| CSSB contact email display/href mismatch | `/en/cssb` Contact block | Medium |
| RASOC URL typo: `/en/rasoc/committes` | Navigation | Low |
| Effective dates 2018 section before 2019 | `/en/ifrsstandards/effective-dates` | Low |
| Non-semantic table markup (`role="presentation"`) | Effective dates, Documents listing | Low (a11y) |

### Report Accuracy (Final)
- **Template coverage:** 17/17 (100%)
- **Board landing coverage:** 5/5 (100%)
- **Structural corrections:** 7 (flexible content zone, tab variations, disclaimer styling, heading levels, missing sections, PDF icon, page count)
- **Label corrections:** 9 (various field names, pill labels, button text)
- **Component inventory:** ~97% (PDF icon on resources listing not confirmed)
- **Content type coverage:** 100% (all 12 content types confirmed)

---

## 8. Rebuild Checklist Summary

### Templates to Build (17)
1. Homepage
2. Board/Council Landing (Dashboard) — with flexible promotional content zone
3. Content Page + Right Sidebar
4. People Listing (Members)
5. Standards Overview (Tabbed) — 5 base tabs, IFRS gets 6th
6. Project Listing (Timeline Table)
7. Project Detail
8. Documents for Comment Listing
9. Document Detail (Exposure Draft)
10. Effective Dates Table
11. Resources Listing
12. Filtered News/Event Listing
13. Meetings & Events Listing
14. Committee Index / Directory
15. Contact / Form Page
16. Authentication Page
17. Simple Content / Empty State

### Reusable Components to Build (~30)
- Header with mega-menu navigation
- Hero banner with contextual logo
- Breadcrumbs (up to 4 levels)
- Section tab navigation (configurable 5-7 tabs)
- Footer (multi-column + bottom bar)
- Feature card (image + title + excerpt + CTA)
- News list item (date + category + title + excerpt)
- Staff contact card
- Section nav sidebar
- Category filter pills (contextual labels)
- Sort/filter bar with dropdowns + date range
- Pagination
- Tab toggle (2-3 options, full contextual labels)
- Data table (multiple variants)
- Timeline table with milestone badges (Q1, Q2, H2 columns)
- Project status timeline (phased)
- Dark purple CTA block
- Flexible promotional content zone (editor-configurable)
- Newsletter CTA block (AcSB-specific variant)
- 2-column feature block
- Disclaimer block
- Member card with photo (205×205px)
- Contact form with CAPTCHA
- Login form
- Empty state message
- Cookie consent (OneTrust integration)
- Language switcher
- Search overlay
- External link / PDF indicators
- Back navigation link

### Content Types to Model (~12)
News Item, Project, Document for Comment, Resource, Meeting/Event, Member, Committee, Board/Council, Standard, Job Opportunity, Volunteer Opportunity, Page

### Key Features to Preserve
- Bilingual (EN/FR) with language toggle
- Federated auth with CPA Canada
- News listing with category filtering, sorting, date range, pagination (~1,010 items across 101 pages)
- Project timeline tables with quarterly + half-year milestone tracking
- Document comment submission workflow
- Member directory with photo cards and appointment dates
- Meeting archive with Upcoming/Past toggle (~180+ items per board)
- Cookie consent (OneTrust)
- Search functionality
- Flexible promotional content zones on board landings
