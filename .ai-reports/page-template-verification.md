# FRAS Canada — Page Template Verification Report

**Date:** 2026-03-04
**Method:** Chrome DevTools MCP (full-page screenshots + a11y tree snapshots)

---

## 1. ACSB Members — `/en/acsb/about/members`

**Screenshot:** `.ai-reports/screenshots/01b-acsb-members-retry.png`
**Snapshot:** `.ai-reports/screenshots/01b-acsb-members-retry-snapshot.txt`

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Member cards with portrait photos | Yes | YES — each member has a 205x205 portrait image | CONFIRMED |
| Name links | Yes | YES — each name is a link to `/en/acsb/about/members/{slug}` | CONFIRMED |
| Credentials | Yes | YES — credentials shown below name (e.g. "FCPA, FCA, CPA(MI)", "CFA, MBA", "PhD, CPA, CA") | CONFIRMED |
| Appointment dates | Yes | YES — "Appointed:" and "Term Expires:" fields on each card | CONFIRMED |
| Role labels (CHAIR, VICE-CHAIR) | Yes | YES — "CHAIR" on Armand Capisciolto, "VICE-CHAIR" on Chris Kovalchuk. Other members have no role label. | CONFIRMED |
| 2-column grid layout | Yes | YES — screenshot shows members arranged in 2 columns | CONFIRMED |
| Section nav sidebar | Yes | YES — right sidebar contains links: About, Terms of Reference, Members, Due Process, International Activities, Annual Report, Strategic Plan, Annual Plan | CONFIRMED |

### Additional Observations
- Page title is "Members" (h1)
- Section heading "VOTING MEMBERS" appears above the member grid
- 15 voting members displayed total
- Top section nav bar: ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES
- Breadcrumb: Home > Accounting Standards Board > About the AcSB > Members
- **NOTE:** On first load, the page briefly redirected to the AcSB landing page. On retry, it loaded correctly. This may be a caching/JS rendering issue.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

## 2. ACSB Committees — `/en/acsb/committees`

**Screenshot:** `.ai-reports/screenshots/02-acsb-committees-full.png`
**Snapshot:** `.ai-reports/screenshots/02-acsb-committees-snapshot.txt`

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| List of committee entries | Yes | YES — 14 committees listed | CONFIRMED |
| Linked names | Yes | YES — each committee name is a link (e.g. `/en/acsb/committees/aac`) | CONFIRMED |
| Descriptions | Yes | YES — each committee has a paragraph description below the linked name | CONFIRMED |
| Sidebar navigation | Yes | YES — right sidebar lists all 14 committees as navigation links, with "Committees" as the parent | CONFIRMED |

### Committee List (actual)
1. Academic Advisory Committee
2. Agriculture Advisory Group
3. Canadian Private Enterprise User Advisory Committee
4. IFRS Accounting Standards Discussion Group
5. IFRS Interpretations Committee Member Support Group
6. Insurance Transition Resource Group
7. Medium and Small Practitioners Advisory Committee
8. Not-For-Profit Advisory Committee
9. Pension Plan Advisory Committee
10. Private Enterprise Advisory Committee
11. Rate-regulated Activities Transition Resource Group
12. Risk Mitigation Accounting Working Group
13. User Advisory Committee

### Additional Observations
- Page title is "Committees" (h1)
- Top section nav bar: ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES
- Breadcrumb: Home > Accounting Standards Board > Committees
- Layout: main content area on left, sidebar navigation on right (same pattern as Members page)
- No images/icons on committee entries — text-only list format

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

## 3. Contact Us — `/en/contact-us`

**Screenshot:** `.ai-reports/screenshots/03-contact-us-full.png`
**Snapshot:** `.ai-reports/screenshots/03-contact-us-snapshot.txt`

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Full Name field | Yes | YES — `Full Name: *` (required text input) | CONFIRMED |
| Title field | Yes | YES — `Title:` (optional text input) | CONFIRMED |
| Organization field | Yes | YES — `Organization:` (optional text input) | CONFIRMED |
| Email field | Yes | YES — `Email address: *` (required text input) | CONFIRMED |
| Phone field | Yes | YES — `Business Phone:` (optional text input) | CONFIRMED |
| Comments textarea | Yes | YES — `Comments: *` (required multiline text input) | CONFIRMED |
| Image CAPTCHA | Yes | YES — text-based CAPTCHA image displayed (e.g. "JA487") with a text input and refresh button | CONFIRMED |
| Submit button | Yes | YES — "SUBMIT" button present | CONFIRMED |
| Media Inquiries block | Yes | YES — h2 "Media Inquiries" section with contact: Daniella Girgenti, CMP, Director of Communications, phone +1 (416) 204-3482, email dgirgenti@frascanada.ca | CONFIRMED |

### Additional Observations
- Page title is "Contact Us" (h1)
- This is under the FRASCanada parent (not board-specific)
- Top section nav bar: ABOUT, RESEARCH PROGRAM, NEWS LISTINGS, CONTACT US, JOB OPPORTUNITIES, VOLUNTEER OPPORTUNITIES, MY ACCOUNT
- Breadcrumb: Home
- Introductory text: "Have a question or comment? Write to us!" with note about recent website changes
- No sidebar navigation on this page — single-column form layout
- The CAPTCHA is a simple text-image style (not reCAPTCHA or hCaptcha)

### Field Label Differences
| Your Description | Actual Label |
|------------------|-------------|
| "Phone" | "Business Phone:" |
| "Email" | "Email address: *" |

These are minor label variations, not structural differences.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

## 4. Meetings and Events — `/en/acsb/meetings-and-events`

**Screenshot:** `.ai-reports/screenshots/04-meetings-events-full.png`
**Snapshot:** `.ai-reports/screenshots/04-meetings-events-snapshot.txt`

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Upcoming/Past toggle | Yes | YES — two tabs: "Upcoming meetings & events" and "Past meetings & events" | CONFIRMED |
| Items per page | Yes | YES — "Items per page:" dropdown, currently set to "10" | CONFIRMED |
| Paginated list | Yes | YES — pagination at bottom showing pages 1, 2, 3, ..., 17, 18, plus a forward/next arrow | CONFIRMED |

### Additional Observations
- Page title is "Meetings and Events" (h1)
- Currently showing "Past meetings & events" tab (default view shows past items)
- 10 items displayed on page 1, each with:
  - Linked heading (h2) to individual meeting page
  - Description paragraph summarizing what was discussed
- Items include Decision Summaries, Discussion Group Meeting Reports, and On-demand Webinars
- Most recent item: AcSB Decision Summary -- January 22, 2026
- Top section nav bar: ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES
- Breadcrumb: Home > Accounting Standards Board > Meetings and Events
- No sidebar navigation on this page
- 18 total pages of past content (180+ items)
- The toggle between Upcoming/Past appears as styled list items (tab-like UI), not traditional tab buttons

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

## Summary

| Page | URL | All Elements Present? | Notes |
|------|-----|----------------------|-------|
| Members | `/en/acsb/about/members` | YES | All 7 expected elements confirmed. 2-col grid, sidebar nav, portraits, credentials, dates, role labels. |
| Committees | `/en/acsb/committees` | YES | All 4 expected elements confirmed. Linked names, descriptions, sidebar nav with full committee list. |
| Contact Us | `/en/contact-us` | YES | All 9 expected elements confirmed. Minor label differences (Business Phone vs Phone, Email address vs Email). |
| Meetings & Events | `/en/acsb/meetings-and-events` | YES | All 3 expected elements confirmed. Upcoming/Past toggle, items per page dropdown, full pagination (18 pages). |

**All 4 page templates match their expected descriptions. No missing elements found.**

### Screenshots Saved
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/01b-acsb-members-retry.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/02-acsb-committees-full.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/03-contact-us-full.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/04-meetings-events-full.png`

---

## 5. ACSB Landing — `/en/acsb` (Board/Council Landing Template)

**Screenshot:** `.ai-reports/screenshots/acsb-fullpage.png`
**Snapshot:** `.ai-reports/screenshots/acsb-snapshot.txt`

### Report Claim
> Template 2: Board/Council Landing with tabs + full-width content blocks, about intro, meeting summaries, news feed, newsletter CTA.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Section tabs | Yes | YES — 5 tabs: ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES | CONFIRMED |
| About intro block | Yes | YES — h3 "About the AcSB" with description paragraph and "Read more" link | CONFIRMED |
| Meeting summaries feed | Yes | YES — h2 "Meeting & event summaries" section with 3 dated items (Jan 22 2026, Dec 11 2025, Dec 9 2025) and "See all meetings & events summaries" link | CONFIRMED |
| News feed | Yes | YES — h2 "News" section with 3 dated items (Mar 4 2026, Feb 27 2026, Feb 19 2026), each with category label and "See all news" link | CONFIRMED |
| Newsletter CTA | Yes | YES — h3 "Stay Up to Date on the Progress of Standard-setting Initiatives" with "Subscribe to The Standard" text and "Subscribe" link | CONFIRMED |

### Additional Elements Found (not explicitly claimed)
- **Contact block**: h3 "Contact the AcSB" with "Contact us" link (right column, alongside About intro)
- **Featured content block**: h3 with IFRS Discussion Group Meeting highlight (left column, below About intro)
- **Social media links**: h3 "Follow Us on Social Media:" with X, LinkedIn, YouTube links
- **Board logo banner**: AcSB-specific branded banner with dotted background pattern
- **Breadcrumb**: Home > Accounting Standards Board

### Layout Notes
- About intro and Contact are in a 2-column layout (left/right)
- Below that: 3-column feature area (meeting highlight, newsletter CTA, social media)
- Meeting summaries: 3-column card layout
- News: 3-column card layout
- Full-width content blocks confirmed

### Verdict: ALL CLAIMED ELEMENTS CONFIRMED. Template matches description.

---

## 6. PSAB Landing — `/en/psab` (Board/Council Landing Template)

**Screenshot:** `.ai-reports/screenshots/psab-fullpage.png`
**Snapshot:** `.ai-reports/screenshots/psab-snapshot.txt`

### Report Claim
> Same Template 2 pattern as ACSB: tabs + full-width content blocks, about intro, meeting summaries, news feed, newsletter CTA.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Section tabs | Yes | YES — 5 tabs: ABOUT, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES | CONFIRMED |
| About intro block | Yes | YES — h3 "About PSAB" with description paragraph and "Read more" link | CONFIRMED |
| Meeting summaries feed | Yes | YES — h2 "Meeting & event summaries" section with 3 dated items (Dec 9 2025, Nov 13 2025, Sep 23-24 2025) and "See all meetings & events summaries" link | CONFIRMED |
| News feed | Yes | YES — h2 "News" section with 3 dated items (Feb 25 2026, Jan 12 2026, Nov 17 2025), each with category label and "See all news" link | CONFIRMED |
| Newsletter CTA | **Yes** | **NO — NOT PRESENT** | **MISMATCH** |

### Key Difference from ACSB
- **Missing newsletter CTA**: The ACSB page has a "Stay Up to Date on the Progress of Standard-setting Initiatives" block with a Subscribe link. PSAB does **not** have this block. Instead, PSAB has a **survey CTA**: h3 "Survey -- Government Not-for-Profit: Contributions and Financial Statement Presentation" with a "Take the survey" link. This appears to be a time-sensitive promotional block, not a permanent newsletter CTA.
- **No "Follow Us on Social Media" block**: Unlike ACSB, PSAB does not have a dedicated social media links section in the main content area.
- **Contact block**: Present — h3 "Contact PSAB" with "Contact us" link (same pattern as ACSB).

### Layout Notes
- About intro and Contact are in a 2-column layout (same as ACSB)
- Below that: featured content area has the survey CTA instead of newsletter + social media
- Meeting summaries: 3-column card layout (same as ACSB)
- News: 3-column card layout (same as ACSB)
- Overall template structure is the same; the middle "feature" blocks vary by content

### Verdict: 4 of 5 CLAIMED ELEMENTS CONFIRMED. Newsletter CTA is ABSENT — replaced by a survey CTA. Template structure matches but content blocks differ.

---

## 7. AASB Landing — `/en/aasb` (Board/Council Landing Template)

**Screenshot:** `.ai-reports/screenshots/aasb-fullpage.png`
**Snapshot:** `.ai-reports/screenshots/aasb-snapshot.txt`

### Report Claim
> Same Template 2 pattern as ACSB: tabs + full-width content blocks, about intro, meeting summaries, news feed, newsletter CTA.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Section tabs | Yes | YES — **6 tabs**: ABOUT, INITIATIVES, MEETINGS, COMMITTEES, NEWS LISTINGS, VOLUNTEER OPPORTUNITIES | CONFIRMED (with extra tab) |
| About intro block | Yes | YES — h3 "About the AASB" with description paragraph and "Read more" link | CONFIRMED |
| Meeting summaries feed | Yes | YES — h2 "Meeting & event summaries" section with 3 dated items (Jan 19 2026, Dec 1-2 2025, Sep 9 2025) and "See all meetings & events summaries" link | CONFIRMED |
| News feed | Yes | YES — h2 "News" section with 3 dated items (Feb 25 2026, Feb 17 2026, Feb 6 2026), each with category label and "See all news" link | CONFIRMED |
| Newsletter CTA | **Yes** | **NO — NOT PRESENT** | **MISMATCH** |

### Key Differences from ACSB
- **Extra tab**: AASB has an "INITIATIVES" tab not present on ACSB or PSAB (6 tabs vs 5)
- **Missing newsletter CTA**: No "Stay Up to Date" / Subscribe block. Instead, AASB has **two featured content blocks**: one about "Revised CAS 570, Going Concern" and one about a "Virtual Roundtable" on ISA 540.
- **Extra section: "Upcoming meetings & events"**: AASB has a distinct h2 section for upcoming events (with 3 items) that ACSB and PSAB do not have. This is in addition to the "Meeting & event summaries" (past) section.
- **No "Follow Us on Social Media" block**: Same as PSAB.
- **Contact block**: Present — h3 "Contact the AASB" with "Contact us" link (same pattern).

### Layout Notes
- About intro and Contact in 2-column layout (same pattern)
- Featured content: 2 promotional blocks (CAS 570 notice + Virtual Roundtable registration)
- Meeting summaries: 3-column card layout (same)
- Upcoming meetings: additional section unique to AASB
- News: 3-column card layout (same)

### Verdict: 4 of 5 CLAIMED ELEMENTS CONFIRMED. Newsletter CTA is ABSENT — replaced by topical promotion blocks. AASB also has an extra "INITIATIVES" tab and an "Upcoming meetings & events" section not present on the other boards.

---

## Cross-Board Template Comparison

### Shared Template Elements (all 3 boards)
| Element | ACSB | PSAB | AASB |
|---------|------|------|------|
| Board logo banner | Yes | Yes | Yes |
| Breadcrumb | Yes | Yes | Yes |
| Section tabs row | 5 tabs | 5 tabs | **6 tabs** (extra: INITIATIVES) |
| About intro block (h3) | Yes | Yes | Yes |
| Contact block (h3) | Yes | Yes | Yes |
| Meeting & event summaries (h2) | Yes (3 items) | Yes (3 items) | Yes (3 items) |
| News feed (h2) | Yes (3 items) | Yes (3 items) | Yes (3 items) |
| Newsletter CTA | **YES** | **NO** (survey CTA) | **NO** (promo blocks) |
| Social media links | **YES** | NO | NO |
| Upcoming meetings section | NO | NO | **YES** |
| Featured promo block(s) | 1 (meeting highlight) | 1 (survey) | 2 (CAS 570 + roundtable) |

### Template Assessment
The three board landing pages share a **common structural template** with these consistent elements:
1. Board-branded banner with logo
2. Section tab navigation bar
3. 2-column About + Contact intro area
4. Middle "feature" zone (variable content per board)
5. Meeting & event summaries feed (3 items + "see all" link)
6. News feed (3 items + "see all" link)
7. Standard footer

The **variable elements** are:
- Tab count (AASB has INITIATIVES; others do not)
- Middle feature blocks (newsletter CTA on ACSB only; survey on PSAB; promo notices on AASB)
- AASB has an additional "Upcoming meetings & events" section
- Social media links section only on ACSB

### Report Accuracy Assessment
The discovery report's claim of **"Template 2: Board/Council Landing with tabs + full-width content blocks, about intro, meeting summaries, news feed, newsletter CTA"** is:

- **MOSTLY ACCURATE** for ACSB (all elements present)
- **PARTIALLY ACCURATE** for PSAB (newsletter CTA absent, replaced by survey CTA)
- **PARTIALLY ACCURATE** for AASB (newsletter CTA absent, extra tab and extra section present)

The report's description treats the newsletter CTA as a core template element, but in practice only ACSB has it. The middle "feature" zone appears to be a **flexible content area** where editors can place different CTA blocks per board, not a fixed newsletter CTA built into the template.

### Screenshots Saved
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/acsb-fullpage.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/psab-fullpage.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/aasb-fullpage.png`

---

## 8. Global Navigation Structure Verification

**Date:** 2026-03-04
**Method:** Chrome DevTools MCP — a11y tree snapshot + viewport screenshot from `https://www.frascanada.ca/en`
**Screenshot:** `.ai-reports/frascanada-fullpage.png`

### 8a. Main Navigation — Mega-Menu Dropdowns

**Claim:** 4 mega-menu dropdowns: "FRAS Canada", "Council", "Boards", "Standards"

| # | Expected | Actual (a11y uid) | Match? |
|---|----------|-------------------|--------|
| 1 | FRAS Canada | `button "FRAS Canada" expandable` (uid=1_6) | CONFIRMED |
| 2 | Council | `button "Council" expandable` (uid=1_7) | CONFIRMED |
| 3 | Boards | `button "Boards" expandable` (uid=1_8) | CONFIRMED |
| 4 | Standards | `button "Standards" expandable` (uid=1_9) | CONFIRMED |

**Verdict: CONFIRMED — exact match, all 4 dropdowns present in correct order**

### 8b. Utility Navigation

**Claim:** Login, Language Toggle (EN/FR), Search

| # | Expected | Actual (a11y uid) | Match? |
|---|----------|-------------------|--------|
| 1 | Login | `button "Login"` (uid=1_10) | CONFIRMED |
| 2 | Language Toggle (EN/FR) | `button "English"` (uid=1_11) with dropdown chevron | CONFIRMED (label shows current language) |
| 3 | Search | `button "Search"` (uid=1_12) | CONFIRMED |

**Verdict: CONFIRMED — all 3 utility items present. Language toggle displays "English" (current language) rather than "EN/FR" literally.**

### 8c. Footer — Section Columns

| Section | Heading | Links | Match? |
|---------|---------|-------|--------|
| FRAS Canada | "Financial Reporting & Assurance Standards Canada" | About FRAS Canada, Research Program, News Listings, Job Opportunities, Volunteer Opportunities, Contact | CONFIRMED |
| Council | "Council" | Reporting and Assurance Standards Oversight Council | CONFIRMED |
| Boards | "Boards" | CSSB, AcSB, PSAB, AASB | CONFIRMED |
| Standards | "Standards" | (see sub-sections below) | CONFIRMED |

#### Standards Sub-sections

| Sub-section | Links |
|-------------|-------|
| **Sustainability** | Canadian Sustainability Disclosure Standards |
| **Accounting** | IFRS Accounting Standards, ASPE, NFP Organizations, Pension Plans |
| **Public Sector** | Public Sector Accounting Standards, International PSAS Activities |
| **Assurance** | CSQM, Canadian Auditing Standards, Other Canadian Standards |

**Verdict: CONFIRMED — all 4 sub-sections present with correct groupings**

### 8d. Footer — Social Links

| # | Expected | Actual | Match? |
|---|----------|--------|--------|
| 1 | LinkedIn | LinkedIn (uid=1_168) | CONFIRMED |
| 2 | X | **Twitter** (uid=1_170) — alt text says "Twitter", image file is `twitter.png` | PARTIAL — site still uses "Twitter" label |
| 3 | YouTube | YouTube (uid=1_172) | CONFIRMED |

### 8e. Footer — Legal Links

| # | Expected | Actual | Match? |
|---|----------|--------|--------|
| 1 | Cookie Policy | "Cookie Policy" (uid=1_174) | CONFIRMED |
| 2 | Privacy Policy | **"Privacy"** (uid=1_176) | PARTIAL — link text is "Privacy" not "Privacy Policy" |
| 3 | Terms of Use | "Terms of Use" (uid=1_178) | CONFIRMED |

### Overall Navigation Verification Summary

| Claim Category | Status | Discrepancies |
|----------------|--------|---------------|
| Mega-menu dropdowns (4) | **CONFIRMED** | None |
| Utility nav (Login, Language, Search) | **CONFIRMED** | Language button shows "English" not "EN/FR" |
| Footer: FRAS Canada section | **CONFIRMED** | Uses full name |
| Footer: Council section | **CONFIRMED** | None |
| Footer: Boards section | **CONFIRMED** | None |
| Footer: Standards sub-sections | **CONFIRMED** | None |
| Footer: Social links | **PARTIAL** | "X" is labeled "Twitter" on the live site |
| Footer: Legal links | **PARTIAL** | "Privacy Policy" is labeled "Privacy" on the live site |

**Overall: The report's claims are substantially accurate. All structural elements are present. Two minor label discrepancies found (Twitter/X branding, Privacy/Privacy Policy text).**

---

## 9. IFRS Accounting Standards — `/en/ifrsstandards` (Standards Landing Template)

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/screenshots/ifrsstandards-page.png`

### Claim
> Tab navigation with 6 tabs: Overview / Project Listing / Documents / Effective Dates / Resources / IFRIC Agenda Decisions. Active projects table.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Tab 1: OVERVIEW | Yes | YES — link to `/en/ifrsstandards`, active/underlined on this page | CONFIRMED |
| Tab 2: PROJECT LISTING | Yes | YES — link to `/en/ifrsstandards/projects` | CONFIRMED |
| Tab 3: DOCUMENTS FOR COMMENT | "Documents" | YES — actual label is **"DOCUMENTS FOR COMMENT"** (not just "Documents") | CONFIRMED (label more specific) |
| Tab 4: EFFECTIVE DATES | Yes | YES — link to `/en/ifrsstandards/effective-dates` | CONFIRMED |
| Tab 5: RESOURCES | Yes | YES — link to `/en/ifrsstandards/resources` | CONFIRMED |
| Tab 6: IFRIC AGENDA DECISIONS | Yes | YES — link to `/en/ifrsstandards/ifric-agenda-decisions` | CONFIRMED |
| Tab count = 6 | Yes | YES — exactly 6 tabs | CONFIRMED |
| Active Projects table | Yes | YES — h2 "Active Projects" with a table listing 13 active projects, each with project name (linked) and description | CONFIRMED |

### Active Projects Listed (actual)
1. AcSB Strategic Plan
2. Amendments to the Fair Value Option (IAS 28)
3. Amortised Cost Measurement
4. Business Combinations -- Disclosures, Goodwill and Impairment
5. Crypto-asset Activities
6. Equity Method
7. Financial Instruments with Characteristics of Equity
8. Intangible Assets
9. Post-implementation Review of IFRS 16 Leases
10. Provisions -- Targeted Improvements
11. Rate-regulated Activities
12. Risk Mitigation Accounting
13. Statement of Cash Flows and Related Matters

### Additional Elements Found
- **Submit an Issue block**: h3 with link to submit issues for discussion meetings
- **CPA Canada Handbook block**: h3 with "Get the Handbook" link
- **Participate in International Consultations block**: h3 with link to IASB Documents for Comment
- **News section**: h2 "News" with 3 dated items (Mar 4 2026, Feb 27 2026, Feb 19 2026)
- **AcSB branded banner** at top (this is under the AcSB umbrella)
- Breadcrumb: Home > IFRS Accounting Standards

### Minor Label Discrepancy
| Your Description | Actual Label |
|------------------|-------------|
| "Documents" | "DOCUMENTS FOR COMMENT" |

This is a minor label expansion, not a structural difference. The tab exists as described.

### Verdict: ALL CLAIMED ELEMENTS CONFIRMED. 6 tabs exactly as described, active projects table present.

---

## 10. IFRS Standards — Project Listing — `/en/ifrsstandards/projects`

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/screenshots/ifrsstandards-projects.png`

### Claim
> Filter pills: Active / Completed / Deferred. Timeline table with quarterly columns.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Filter pill: Active | "Active" | YES — **"Active Projects"** (dark/selected pill) | CONFIRMED (label slightly longer) |
| Filter pill: Completed | "Completed" | YES — **"Completed Projects"** (outline pill) | CONFIRMED (label slightly longer) |
| Filter pill: Deferred | "Deferred" | YES — **"Deferred Projects"** (outline pill) | CONFIRMED (label slightly longer) |
| Filter pill count = 3 | Yes | YES — exactly 3 filter pills | CONFIRMED |
| Timeline table | Yes | YES — table with "Project" column on left | CONFIRMED |
| Quarterly columns | Yes | YES — **3 time columns**: "2026 Q1", "2026 Q2", "2026 H2" | CONFIRMED (with caveat) |

### Timeline Table Details
- Column headers: **Project | 2026 Q1 | 2026 Q2 | 2026 H2**
- 14 project rows displayed under "Active Projects" filter
- Some cells contain milestone labels (e.g., "Exposure Draft", "Final Amendments", "IFRS Accounting Standard", "Final amendment and basis issued in Handbook")
- The milestone labels appear as rounded pill/badge elements positioned within the quarterly columns, showing when each milestone is expected

### Minor Discrepancies
| Your Description | Actual |
|------------------|--------|
| "Active" pill | "Active Projects" |
| "Completed" pill | "Completed Projects" |
| "Deferred" pill | "Deferred Projects" |
| "Quarterly columns" | 3 columns: Q1, Q2, **H2** (half-year, not quarter) |

The third column is "2026 H2" (second half of 2026), not a specific quarter like Q3 or Q4. This is a half-year grouping rather than a strict quarterly column.

### Verdict: ALL CLAIMED ELEMENTS CONFIRMED with minor label differences. The filter pills say "X Projects" rather than just "X", and the third time column is a half-year (H2) rather than a quarter.

---

## 11. Sustainability Standards — `/en/sustainability` (Standards Landing Template)

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/screenshots/sustainability-page.png`

### Claim
> Same tabbed pattern with 5 tabs.

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Tab 1: OVERVIEW | Yes | YES — link to `/en/sustainability`, active/underlined | CONFIRMED |
| Tab 2: PROJECT LISTING | Yes | YES — link to `/en/sustainability/projects` | CONFIRMED |
| Tab 3: DOCUMENTS FOR COMMENT | Yes | YES — link to `/en/sustainability/documents` | CONFIRMED |
| Tab 4: EFFECTIVE DATES | Yes | YES — link to `/en/sustainability/effective-dates` | CONFIRMED |
| Tab 5: RESOURCES | Yes | YES — link to `/en/sustainability/resources` | CONFIRMED |
| Tab count = 5 | Yes | YES — exactly 5 tabs | CONFIRMED |
| IFRIC AGENDA DECISIONS tab | N/A | ABSENT — correct, this is IFRS-specific and not expected here | CONFIRMED ABSENT |

### Additional Elements Found
- Page title: "Canadian Sustainability Disclosure Standards" (h1)
- **Active Projects section**: h2 "Active Projects" — currently shows "There are currently no active projects"
- **Indigenous commitment block**: h3 "The CSSB's Commitment to Indigenous Peoples" with Land Acknowledgement and Our Commitment links
- **CPA Canada Handbook block**: h3 with "Get the Handbook" link (Sustainability handbook)
- **News section**: h2 "News" with 3 dated items (Nov 25 2025, Nov 11 2025, Nov 10 2025)
- **FRAS Sustainability branded banner** (different from AcSB banner)
- Breadcrumb: Home > Overview

### Verdict: ALL CLAIMED ELEMENTS CONFIRMED. Exactly 5 tabs as described. Same tabbed pattern as IFRS but without the IFRIC Agenda Decisions tab.

---

## 12. ASPE — Accounting Standards for Private Enterprises — `/en/aspe` (Standards Landing Template)

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/screenshots/aspe-page.png`

### Claim
> Same pattern (as IFRS/Sustainability tabbed standards template).

### Verified Elements
| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Tab 1: OVERVIEW | Yes | YES — link to `/en/aspe`, active/underlined | CONFIRMED |
| Tab 2: PROJECT LISTING | Yes | YES — link to `/en/aspe/projects` | CONFIRMED |
| Tab 3: DOCUMENTS FOR COMMENT | Yes | YES — link to `/en/aspe/documents` | CONFIRMED |
| Tab 4: EFFECTIVE DATES | Yes | YES — link to `/en/aspe/effective-dates` | CONFIRMED |
| Tab 5: RESOURCES | Yes | YES — link to `/en/aspe/resources` | CONFIRMED |
| Tab count = 5 | Yes | YES — exactly 5 tabs (same as Sustainability) | CONFIRMED |
| IFRIC AGENDA DECISIONS tab | N/A | ABSENT — correct, IFRIC is IFRS-specific | CONFIRMED ABSENT |

### Additional Elements Found
- Page title: "Accounting Standards for Private Enterprises" (h1)
- **Active Projects section**: h2 "Active Projects" with 5 projects listed:
  1. AcSB Strategic Plan
  2. Detailed Review of Accounting Standards for Private Enterprises
  3. Financial Statement Concepts
  4. Guidance Framework
  5. Subsequent Measurement of Goodwill and Acquired Intangible Assets
- **Submit an Issue block**: h3 with link to submit issues
- **CPA Canada Handbook block**: h3 with "Get the Handbook" link (Part II)
- **News section**: h2 with 3 dated items (Feb 9 2026, Dec 1 2025, Nov 3 2025)
- **AcSB branded banner** (ASPE is under the AcSB umbrella)
- Breadcrumb: Home > Accounting Standards for Private Enterprises

### Verdict: ALL CLAIMED ELEMENTS CONFIRMED. Exactly 5 tabs, same pattern as Sustainability. Matches the Standards Landing template.

---

## Standards Section — Cross-Page Template Comparison

### Tab Structure Comparison
| Page | URL | Tab Count | Tabs |
|------|-----|-----------|------|
| IFRS Accounting Standards | `/en/ifrsstandards` | **6** | Overview, Project Listing, Documents for Comment, Effective Dates, Resources, **IFRIC Agenda Decisions** |
| Sustainability | `/en/sustainability` | **5** | Overview, Project Listing, Documents for Comment, Effective Dates, Resources |
| ASPE | `/en/aspe` | **5** | Overview, Project Listing, Documents for Comment, Effective Dates, Resources |

### Shared Template Elements (all 3 standards pages)
| Element | IFRS | Sustainability | ASPE |
|---------|------|----------------|------|
| Tab navigation | 6 tabs | 5 tabs | 5 tabs |
| Overview page (default) | Yes | Yes | Yes |
| Active Projects section | Yes (13 projects) | Yes (0 projects) | Yes (5 projects) |
| CPA Canada Handbook block | Yes | Yes | Yes |
| News section | Yes | Yes | Yes |
| Submit an Issue block | Yes | No | Yes |
| Board/FRAS branded banner | AcSB | FRAS Sustainability | AcSB |

### Template Assessment
All three Standards pages use a **common Standards Landing template** with:
1. Board/org-branded banner
2. Tab navigation bar (5 base tabs; IFRS adds a 6th for IFRIC Agenda Decisions)
3. Overview as default landing with Active Projects list
4. Sidebar CTA blocks (Handbook, Submit an Issue)
5. News feed at bottom

The template is consistent across all three. The only structural difference is the IFRS-specific 6th tab for IFRIC Agenda Decisions.

### Screenshots Saved
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/ifrsstandards-page.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/ifrsstandards-projects.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/sustainability-page.png`
- `/Users/garson/03--fishtank/fras/.ai-reports/screenshots/aspe-page.png`

---

## 13. Documents for Comment Listing — `/en/ifrsstandards/documents` (Template 8)

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/template8-documents-for-comment-listing.png`
**Closed Tab Screenshot:** `.ai-reports/template8-closed-for-comment.png`

### Claim
> Listing page with filter pills (Open for Comment / Closed for Comment), grouped table with section headers (e.g., "Exposure Drafts"), document links with "Submit comment" action buttons.

### Verified Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| H1 title | "Documents for Comment" | YES -- `heading "Documents for Comment" level="1"` | CONFIRMED |
| Filter pill: Open for Comment | Yes | YES -- `<li class="active">` with dark background (`rgb(51, 51, 51)`), white text | CONFIRMED |
| Filter pill: Closed for Comment | Yes | YES -- `<li>` with white background, grey text (`rgb(82, 82, 82)`) | CONFIRMED |
| Filter pills as toggle tabs | Yes | YES -- implemented as `<li>` items within a `<ul class="tabs">`, switching between tab content panels | CONFIRMED |
| Grouped table with section headers | Yes | YES -- `<table>` with 27 rows total; section headers use `<th>` inside `<tr class="custom-head">` | CONFIRMED |
| Section header: "Exposure Drafts" | Yes | YES -- bold `<th>` element with grey background strip | CONFIRMED |
| Document links | Yes | YES -- 2 documents listed under "Open for Comment" > "Exposure Drafts" | CONFIRMED |
| Document 1 link | Yes | "AcSB Exposure Draft -- Risk Mitigation Accounting" linking to `/en/ifrsstandards/documents/acsb-ed-risk-mitigation-accounting` | CONFIRMED |
| Document 2 link | Yes | "AcSB Exposure Draft -- Amendments to the Fair Value Option for Investments in Associates and Joint Ventures" linking to `/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option` | CONFIRMED |
| "Submit comment" action buttons | Yes | YES -- 2 "Submit comment" links, each pointing to `/en/acsb/submit-comment?docname=...` with the document name as query parameter | CONFIRMED |
| Submit button styling | Purple button | YES -- purple-colored button aligned to the right of each document row | CONFIRMED |

### Closed for Comment Tab
When the "Closed for Comment" pill is activated:
| Element | Actual | Notes |
|---------|--------|-------|
| Section header: "Consultation Papers" | YES -- grey background strip with bold text | Additional section type not visible in "Open" tab |
| Document: "Consultation Paper I -- Exploring Scalability in Canada" | YES -- linked document name | Present |
| "View Comments" button | YES -- replaces "Submit comment" for closed documents | Different CTA for closed items |
| Section header: "Exposure Drafts" | YES -- second section group | Additional closed exposure drafts below |
| Document: "AcSB Exposure Draft -- Translation to a Hyperinflationary Presentation Currency" | YES -- visible in closed tab | Present |

### Filter Pill Styling Details
| Property | Open for Comment (active) | Closed for Comment (inactive) |
|----------|--------------------------|-------------------------------|
| Background | `rgb(51, 51, 51)` (dark grey/black) | `rgb(255, 255, 255)` (white) |
| Text color | `rgba(255, 255, 255, 0.82)` (white) | `rgb(82, 82, 82)` (grey) |
| Display | `inline-block` | `inline-block` |
| Border radius | `0px` (rectangular, not pill-shaped) | `0px` |

### Additional Observations
- Breadcrumb: Home > IFRS Accounting Standards > Documents for Comment
- Tab navigation bar: OVERVIEW, PROJECT LISTING, **DOCUMENTS FOR COMMENT** (active/underlined), EFFECTIVE DATES, RESOURCES, IFRIC AGENDA DECISIONS
- The filter pills are rectangular (no border-radius), not rounded pills -- they function as tab toggles
- The table uses alternating row styles: grey `<tr class="custom-head">` for section headers, white rows for documents
- Each document row has: linked document name on the left, "Submit comment" or "View Comments" button on the right
- A responsive/mobile version of the tabs exists using `<span class="tab_drawer_heading">` elements (hidden on desktop via `display: none`)
- The "Open for Comment" tab currently shows only 1 section group (Exposure Drafts) with 2 documents
- The "Closed for Comment" tab shows at least 2 section groups (Consultation Papers, Exposure Drafts)

### Discrepancies / Flags
1. **Filter "pills" are not pill-shaped** -- They are rectangular tab-style toggles with `border-radius: 0px`, not rounded pill elements. The term "pills" in the spec is a misnomer; they are styled as rectangular tab buttons.
2. **No visible count/badge** on the filter tabs showing how many documents are in each category.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED. Filter tabs, grouped table, section headers, document links, and Submit comment buttons all present and functional.

---

## 14. Document Detail / Exposure Draft — `/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option` (Template 9)

**Date:** 2026-03-04
**Screenshot:** `.ai-reports/template9-document-detail.png`

### Claim
> Document detail page with H1 title, Highlights section, rich body content, "When to Reply" section with bold deadline dates, "How to Reply" dark purple CTA block with contact address and "Submit comment" button, Support Materials section with chain-link icon and linked document names, Staff Contact(s) sidebar.

### Verified Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| H1 title | Yes | YES -- `heading "AcSB Exposure Draft -- Amendments to the Fair Value Option for Investments in Associates and Joint Ventures" level="1"` | CONFIRMED |
| Highlights section | Yes | YES -- `heading "Highlights" level="3"` followed by 4 paragraphs explaining the proposal, comment process, and confidentiality notice | CONFIRMED |
| Rich body content | Yes | YES -- Multiple H3 sections ("IASB Exposure Draft", "Comments Requested") with paragraphs containing inline links to external resources (IASB Exposure Draft PDF, IAS 28 on Knotia, etc.) | CONFIRMED |
| "When to Reply" section | Yes | YES -- `heading "When to Reply" level="2"` with explanatory text about deadlines and the endorsement process | CONFIRMED |
| Bold deadline dates | Yes | YES -- 2 bold dates found: **"April 20, 2026"** (IASB deadline) and **"March 27, 2026"** (AcSB deadline), both wrapped in `<strong>` tags | CONFIRMED |
| "How to Reply" dark purple CTA block | Yes | YES -- `heading "How to reply" level="3"` inside a container with `background-color: rgb(96, 31, 91)` (dark purple, class `.left-sec-container`), H3 text color is white | CONFIRMED |
| Contact address in CTA | Yes | YES -- Full contact block: "Katharine Christopoulos, CPA, CA / Director, Accounting Standards / Accounting Standards Board / 145 King Street West, Suite 500 / Toronto, Ontario M5H 1J8 / kchristopoulos@acsbcanada.ca" | CONFIRMED |
| "Submit comment" button in CTA | Yes | YES -- `link "Submit comment"` with class `purple-btn cta-button-1`, `background-color: rgb(165, 59, 157)` (purple/magenta), white text, linking to `/en/acsb/submit-comment?docname=AcSB-ED-Amendments-to-the-Fair-Value-Option` | CONFIRMED |
| Support Materials section | Yes | YES -- `heading "Support Materials" level="2"` with a link container below | CONFIRMED |
| Chain-link icon on Support Materials | Yes | PARTIAL -- Links have class `internal-link-icon` and there is an icon character (Unicode) before the link text, but it is rendered via CSS pseudo-element, not a visible `<img>` or `<svg>`. The icon appears as a small chain-link/external-link glyph. | CONFIRMED (CSS-based icon) |
| Linked document names in Support Materials | Yes | YES -- 1 linked document: "Amendments to the Fair Value Option (IAS 28)" linking to `/en/ifrsstandards/projects/amendments-to-the-fair-value-option-ias-28` | CONFIRMED |
| Staff Contact(s) sidebar | Yes | YES -- `heading "Staff Contact(s)" level="2"` in a sidebar column with: Name ("Katharine Christopoulos, CPA, CA"), Title ("Director, Accounting Standards Board"), Phone ("+1 416 204 3270" with phone icon), Email ("kchristopoulos@acsbcanada.ca" with email icon) | CONFIRMED |

### Section Order (top to bottom)
1. AcSB branded banner (dotted background + AcSB logo)
2. Breadcrumb: Home > IFRS Accounting Standards > Documents for Comment > [document title]
3. Tab navigation: OVERVIEW, PROJECT LISTING, DOCUMENTS FOR COMMENT, EFFECTIVE DATES, RESOURCES, IFRIC AGENDA DECISIONS
4. **H1 title** (full document name)
5. **Highlights** (H3) -- left column
6. **Staff Contact(s)** (H2) -- right sidebar column
7. **IASB Exposure Draft** (H3) -- body content section
8. **Comments Requested** (H3) -- body content section
9. **When to Reply** (H2) -- with bold deadline dates
10. **How to Reply** (H3) -- dark purple CTA block with address + Submit comment button
11. **Support Materials** (H2) -- linked documents with icons
12. Footer

### Layout Details
- The page uses a **2-column layout**: main content on the left, Staff Contact sidebar on the right
- The "How to Reply" block breaks out of the content column into a **full-width dark purple band** (`rgb(96, 31, 91)`) with white text
- The "Submit comment" button within the CTA block uses a brighter purple (`rgb(165, 59, 157)`) to contrast against the dark purple background
- The sidebar contains phone and email icons (small PNG images: `Shape 129.png` for phone, `Shape 130.png` for email)

### "How to Reply" CTA Block Color Details
| Element | Color |
|---------|-------|
| Background container (`.left-sec-container`) | `rgb(96, 31, 91)` -- dark purple |
| H3 text ("How to reply") | `rgb(255, 255, 255)` -- white |
| Body text (address, instructions) | White on dark purple background |
| "Submit comment" button | `rgb(165, 59, 157)` background (brighter purple/magenta), white text |

### Discrepancies / Flags
1. **No issues found** -- All expected elements are present and correctly styled.
2. **Note on first document URL**: The URL `/en/ifrsstandards/documents/acsb-ed-risk-mitigation-accounting` redirected to the News Listings page on first attempt. The second document URL (`acsb-ed-amendments-to-the-fair-value-option`) loaded correctly. This may indicate the first document detail page has a redirect issue or is configured differently.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED. H1 title, Highlights section, rich body content with inline links, "When to Reply" with bold dates, dark purple "How to Reply" CTA block with full contact address and Submit comment button, Support Materials with icon-linked documents, and Staff Contact sidebar all present and correctly implemented.

---

## Templates 8 & 9 Summary

| Template | Page | URL | All Elements Present? | Notes |
|----------|------|-----|----------------------|-------|
| Template 8 | Documents for Comment Listing | `/en/ifrsstandards/documents` | YES | Filter tabs (Open/Closed), grouped table with section headers, document links + Submit comment buttons. "Closed" tab shows "View Comments" instead. Filter tabs are rectangular, not pill-shaped. |
| Template 9 | Document Detail (Exposure Draft) | `/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option` | YES | H1 title, Highlights, rich body, When to Reply (bold dates), How to Reply (dark purple CTA with address + Submit comment), Support Materials (icon links), Staff Contact sidebar. All confirmed. |

### Screenshots Saved
- `/Users/garson/03--fishtank/fras/.ai-reports/template8-documents-for-comment-listing.png` -- Full page, Open for Comment tab
- `/Users/garson/03--fishtank/fras/.ai-reports/template8-closed-for-comment.png` -- Viewport, Closed for Comment tab
- `/Users/garson/03--fishtank/fras/.ai-reports/template9-document-detail.png` -- Full page, Document Detail

---

## 10. Effective Dates Table (Template 10) — `/en/ifrsstandards/effective-dates`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + viewport screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Intro disclaimer text (italic) | Yes | YES -- "*This summary is for informational purposes only.*" displayed in italic | CONFIRMED |
| Secondary disclaimer paragraph | Yes | YES -- "This summary may not include consequential amendments resulting from the issuance of new standards or minor updates to existing standards. For comprehensive details, please refer to the CPA Canada Handbook -- Accounting on Knotia.ca." | CONFIRMED |
| Link to CPA Canada Handbook | Yes | YES -- "CPA Canada Handbook -- Accounting" is a hyperlink to `https://www.casso.ca/Home.aspx?App=knotia.ca&ReturnTo=...` | CONFIRMED |
| Data table with Application + Pronouncement columns | Yes | YES -- Two-column table structure with "Application" (left) and "Pronouncement" (right) column headers in bold | CONFIRMED |
| Purple section header rows | Yes | YES -- Full-width purple/dark-purple background rows with white text serving as date-group separators | CONFIRMED |
| Italic standard names in cells | Yes | YES -- Standard names rendered in italic (e.g., "*Consolidated Financial Statements*", "*Investments in Associates and Joint Ventures*", "*The Effects of Changes in Foreign Exchange Rates*") | CONFIRMED |
| Bullet lists in cells | Yes | YES -- Amendment details shown as bulleted lists within cells (e.g., "- Sale or Contribution of Assets between an Investor and its Associate or Joint Venture*") | CONFIRMED |
| Alternating row backgrounds | N/A | YES -- Rows alternate between white and light gray backgrounds for readability | OBSERVED |
| Breadcrumb navigation | Yes | YES -- "Home / IFRS Accounting Standards / Effective Dates -- IFRS Accounting Standards" | CONFIRMED |
| Section tab navigation | Yes | YES -- Tabs: OVERVIEW, PROJECT LISTING, DOCUMENTS FOR COMMENT, **EFFECTIVE DATES** (active, underlined with purple bar), RESOURCES, IFRIC AGENDA DECISIONS | CONFIRMED |
| Page heading (H1) | Yes | YES -- "Effective Dates -- IFRS Accounting Standards" in large purple text | CONFIRMED |
| Board banner | Yes | YES -- AcSB (Accounting Standards Board) purple/gradient banner with logo | CONFIRMED |
| Footnote text | Yes | YES -- Asterisk footnotes present (e.g., "* The effective date for the amendments to these standards are deferred indefinitely until the IASB's research project on Equity Method of Accounting is completed.") | CONFIRMED |

### Purple Section Headers Found (in order, top to bottom)
1. **"Effective date to be determined:"**
2. **"Effective for annual periods beginning on or after January 1, 2027"**
3. **"Effective for annual periods beginning on or after January 1, 2026:"**
4. **"Effective for annual periods beginning on or after January 1, 2025:"**
5. **"Effective for annual periods beginning on or after January 1, 2024:"**
6. **"Effective for annual periods beginning on or after January 1, 2023:"**
7. **"Effective for annual periods beginning on or after January 1, 2022:"**
8. **"Effective for annual periods beginning on or after April 1, 2021:"**
9. **"Effective for annual periods beginning on or after January 1, 2021:"**
10. **"Effective for annual periods beginning on or after January 1, 2020:"**
11. **"Effective for annual periods beginning on or after January 1, 2018:"**
12. **"Effective for annual periods beginning on or after January 1, 2019:"**
13. **"Effective for annual periods beginning on or after January 1, 2017:"**

### Rich Text Verification
- Standard names are consistently italicized (e.g., *Consolidated Financial Statements*, *Financial Instruments*, *Leases*, *Income Taxes*)
- Amendment bullet points use italic text (e.g., *Sale or Contribution of Assets between an Investor and its Associate or Joint Venture*)
- Parenthetical notes in regular weight (e.g., "(New in 2024; replaces IAS 1)", "(New in 2014; replaces IAS 39, IFRIC 9 and earlier versions of IFRS 9)")
- Pronouncement column contains application method text: "Prospective", "Retrospective", or "In accordance with specific requirements in [standard]"

### Table Structure Details
- The table uses a `presentation` role (ref_290), not a semantic `<table>` element
- Column headers "Application" and "Pronouncement" are rendered as styled generic elements, not `<th>` elements
- Purple section header rows span the full width of the table
- Each data row contains: left cell (standard name + italic title + bulleted amendments + footnotes) and right cell (application method)

### Discrepancies / Flags
1. **Semantic HTML concern**: The table uses `role="presentation"` rather than a proper `<table>` with `<thead>/<tbody>/<tr>/<td>` elements. This may impact accessibility for screen readers. The column headers ("Application", "Pronouncement") are generic `<div>` elements rather than `<th>` elements.
2. **Date ordering anomaly**: The 2018 section appears before the 2019 section in the DOM. The chronological order goes: 2027 -> 2026 -> 2025 -> 2024 -> 2023 -> 2022 -> Apr 2021 -> Jan 2021 -> 2020 -> **2018** -> **2019** -> 2017. The 2018 and 2019 sections are swapped.
3. **No pagination or collapsible sections**: The entire table is rendered as a single long page with no pagination or accordion behavior. This is a very long page.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED. Intro disclaimer, two-column data table, purple section headers, rich text with italic names and bullet lists, footnotes -- all present and correctly rendered. Minor flags: non-semantic table markup (accessibility), and 2018/2019 date sections appear out of chronological order.

---

## 11. Resources Listing (Template 11) — `/en/aspe/resources`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + viewport screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Category filter pills | Yes | YES -- Pill-shaped buttons: "All Items" (dark/active), "Article", "Guidance", "In Brief", "Other", "Webinar" | CONFIRMED |
| "All Items" pill is active/selected by default | Yes | YES -- "All Items" has a dark (filled) background; others are outlined | CONFIRMED |
| Dropdown filter (All Types) | Yes | YES -- "FILTERS" label with "All Types" dropdown. Options: All Types, Audio, External Link, PDF, Video, Webpage, Plain Language | CONFIRMED |
| Sort by dropdown | Yes | YES -- "SORT BY" label with "Publication date: Newest" dropdown. Options: Newest, Oldest | CONFIRMED |
| Date range filter | Yes | YES -- "START DATE" and "END DATE" labels with `mm/dd/yyyy` text inputs | CONFIRMED |
| Items per page selector | Yes | YES -- "Items per page:" label with dropdown, options: 10, 20, 30, All. Default is 10 | CONFIRMED |
| Paginated listing | Yes | YES -- 10 items displayed on page 1, with pagination: 1, 2, 3, > (next arrow) | CONFIRMED |
| Date on each listing item | Yes | YES -- Each item shows a date (e.g., "February 9, 2026", "October 14, 2025") | CONFIRMED |
| Category tags on each item | Yes | YES -- Each item shows tags (e.g., "Resource, Other", "In Brief, Resource", "Video, Webinar, Resource", "Resource, Guidance") | CONFIRMED |
| Linked title on each item | Yes | YES -- Each item has a clickable title (purple link text) that navigates to the resource detail page | CONFIRMED |
| Excerpt text on each item | Yes | YES -- Each item has a descriptive paragraph excerpt below the title | CONFIRMED |
| PDF icon on items | **Partially** | **NOT OBSERVED** -- No PDF icons visible in the accessibility tree or screenshots for any of the 10 items on page 1. The "All Types" filter includes a "PDF" option, but the listing items themselves do not display a PDF icon next to titles. | **FLAG** |
| Breadcrumb navigation | Yes | YES -- "Home / Accounting Standards for Private Enterprises / Resources" | CONFIRMED |
| Section tab navigation | Yes | YES -- Tabs: OVERVIEW, PROJECT LISTING, DOCUMENTS FOR COMMENT, EFFECTIVE DATES, **RESOURCES** (active, underlined with purple bar) | CONFIRMED |
| Page heading (H1) | Yes | YES -- "Resources" in large purple text | CONFIRMED |
| Board banner | Yes | YES -- AcSB (Accounting Standards Board) purple/gradient banner with logo | CONFIRMED |

### Category Filter Pills (exact list)
1. **All Items** (active/selected -- dark background)
2. Article
3. Guidance
4. In Brief
5. Other
6. Webinar

**Note:** The expected order was "All Items/Webinar/Other/In Brief/Guidance/Article". The actual order on the page is **All Items / Article / Guidance / In Brief / Other / Webinar** (alphabetical after "All Items"). This differs from the expected order but is a reasonable alphabetical arrangement.

### Dropdown Filter Options
**FILTERS (All Types):**
- All Types (default)
- Audio
- External Link
- PDF
- Video
- Webpage
- Plain Language

**SORT BY:**
- Publication date: Newest (default)
- Publication date: Oldest

### Sample Listing Items (Page 1, 10 items)
| # | Date | Tags | Title (truncated) |
|---|------|------|--------------------|
| 1 | February 9, 2026 | Resource, Other | Retractable or Mandatorily Redeemable Shares Issued in a Tax Planning Arrangement (ROMRS) Post-implementation Review -- What You Need to Know |
| 2 | October 14, 2025 | In Brief, Resource | In Brief -- AcSB's Exposure Draft, "Relief from Recognition of Acquired Intangible Assets and Amortization of Goodwill" |
| 3 | September 23, 2025 | Video, Webinar, Resource | On-demand Webinar -- AcSB Consultation Paper, "Detailed Review of Accounting Standards for Private Enterprises" |
| 4 | September 9, 2025 | Resource, In Brief | In Brief -- AcSB Consultation Paper, "Detailed Review of Accounting Standards for Private Enterprises" |
| 5 | June 30, 2025 | Resource, Guidance | Attention Management and Auditors: Revised CAS 570, Going Concern Brings Changes... |
| 6 | May 26, 2025 | Resource, Webinar, Video | On-demand Webinar -- Domestic Accounting Standards Update (Spring 2025) |
| 7 | April 3, 2025 | Resource, Guidance | What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements |
| 8 | February 5, 2025 | Resource, Guidance | What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements |
| 9 | October 8, 2024 | Resource, Guidance | What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements |
| 10 | May 15-16, 2024 | Webinar, Video | On-demand -- Webinar -- Domestic Accounting Standards Update (Spring 2024) |

### Pagination
- Page numbers: 1, 2, 3
- Next page arrow: > (right chevron)
- Total pages: 3 (at 10 items per page)
- No "Previous" arrow on page 1 (correct behavior)

### Rich Text in Listing Items
- Italic text observed in excerpts (e.g., "*Business Combinations*", "*Goodwill and Intangible Assets*", "*Going Concern*")
- Links are purple and underlined on the title headings
- Excerpt text is regular weight, multi-line

### Discrepancies / Flags
1. **PDF icon not present**: The expected "PDF icon" on listing items was NOT observed. No file-type icons appear next to titles or anywhere in the listing card. The "All Types" dropdown includes "PDF" as a filter option, but the listing items do not display resource-type icons. This may be because the current items on page 1 are not PDF-type resources (they are Webpage, Other, In Brief, Guidance, Video, and Webinar types). To confirm, the filter should be set to "PDF" to check if PDF-specific items display an icon.
2. **Filter pill order differs from spec**: Expected "All Items/Webinar/Other/In Brief/Guidance/Article" but actual is "All Items/Article/Guidance/In Brief/Other/Webinar" (alphabetical). This is a minor difference in sorting order.
3. **"FILTERS" label vs "All Types" label**: The dropdown label says "FILTERS" above "All Types", which differs slightly from the expected "Dropdown filter (All Types)". Both refer to the same control.
4. **Mobile dropdown duplication**: The accessibility tree shows both a desktop pill-based category selector and a mobile dropdown (combobox) with the same options. The mobile version is presumably hidden on desktop viewports.

### Verdict: MOSTLY CONFIRMED. All major elements present: category filter pills, dropdown filters (All Types + Sort By + Date Range), paginated listing with date, tags, linked title, and excerpt. The **PDF icon** was not observed on any listing item -- this is the only element that could not be confirmed. The pill order is alphabetical rather than the specified order, which is a minor discrepancy.

---

## Templates 10 & 11 Summary

| Template | Page | URL | All Elements Present? | Notes |
|----------|------|-----|----------------------|-------|
| Template 10 | Effective Dates Table | `/en/ifrsstandards/effective-dates` | YES | Two-column table (Application/Pronouncement), purple section headers, italic standard names, bullet lists, footnotes. Non-semantic table markup flagged. 2018/2019 date sections out of order. |
| Template 11 | Resources Listing | `/en/aspe/resources` | MOSTLY | Filter pills, dropdown filters, paginated listing with date/tags/title/excerpt all confirmed. **PDF icon not observed** on any listing item. Pill order is alphabetical vs. spec order. |

---

## Template 8 — Documents for Comment Listing

**URL:** `https://www.frascanada.ca/en/ifrsstandards/documents`
**Date verified:** 2026-03-04
**Method:** claude-in-chrome MCP (read_page accessibility tree + screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| H1 page title "Documents for Comment" | Yes | YES -- large purple H1 heading "Documents for Comment" at top of content area | CONFIRMED |
| Breadcrumb trail | Yes | YES -- "Home / IFRS Accounting Standards / Documents for Comment" | CONFIRMED |
| Section nav tabs (IFRS Accounting Standards) | Yes | YES -- tabs: OVERVIEW, PROJECT LISTING, DOCUMENTS FOR COMMENT (active, with purple underline), EFFECTIVE DATES, RESOURCES, IFRIC AGENDA DECISIONS | CONFIRMED |
| Filter pill: "Open for Comment" | Yes | YES -- dark filled pill (active state) labeled "Open for Comment" | CONFIRMED |
| Filter pill: "Closed for Comment" | Yes | YES -- outlined/unfilled pill labeled "Closed for Comment"; clicking it switches to dark fill and shows closed items | CONFIRMED |
| Grouped table with section header "Exposure Drafts" | Yes | YES -- grey banner row with bold "Exposure Drafts" text appears as section header in the "Open for Comment" view | CONFIRMED |
| Document links (clickable titles) | Yes | YES -- each document title is a purple hyperlink (e.g., "AcSB Exposure Draft -- Risk Mitigation Accounting", "AcSB Exposure Draft -- Amendments to the Fair Value Option...") | CONFIRMED |
| "Submit comment" action buttons | Yes | YES -- dark purple "Submit comment" button on the right side of each row in "Open for Comment" tab. Links to `/en/acsb/submit-comment?docname=...` | CONFIRMED |
| Alternating row styling | Yes | YES -- rows alternate between white and light grey backgrounds | CONFIRMED |

### "Closed for Comment" Tab
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Grouped table with "Consultation Papers" section | Yes | YES -- grey banner row with bold "Consultation Papers" text | CONFIRMED |
| Grouped table with "Exposure Drafts" section | Yes | YES -- grey banner row with bold "Exposure Drafts" text | CONFIRMED |
| "View Comments" buttons (for closed items with responses) | Yes | YES -- purple "View Comments" button on select closed items. Links to PDF response booklets. | CONFIRMED |
| Document links without action buttons | Yes | YES -- most closed Exposure Drafts have only the title link with no action button | CONFIRMED |

### Open for Comment Documents (at time of verification)
1. AcSB Exposure Draft -- Risk Mitigation Accounting --> [Submit comment]
2. AcSB Exposure Draft -- Amendments to the Fair Value Option for Investments in Associates and Joint Ventures --> [Submit comment]

### Closed for Comment Documents (partial list)
**Consultation Papers:**
- Consultation Paper I -- Exploring Scalability in Canada --> [View Comments]

**Exposure Drafts (18+ items including):**
- Translation to a Hyperinflationary Presentation Currency
- Amendments to IFRS 19 Subsidiaries without Public Accountability: Disclosures
- Equity Method of Accounting -- IAS 28
- Provisions -- Targeted Improvements
- Climate-related and Other Uncertainties in the Financial Statements
- Annual Improvements to IFRS Accounting Standards -- Volume 11
- Business Combinations -- Disclosures, Goodwill and Impairment --> [View Comments]
- Classification and Measurement of Financial Instruments (IFRS 9 / IFRS 7)
- Contracts for Renewable Electricity
- Financial Instruments with Characteristics of Equity
- International Tax Reform -- Pillar Two Model Rules (IAS 12)
- Lack of Exchangeability (IAS 21) --> [Exposure Draft PDF]
- Non-current Liabilities with Covenants (IAS 1)
- General Presentation and Disclosures --> [View Comments]
- Supplier Finance Arrangements (IAS 7 / IFRS 7)

### Discrepancies / Flags
1. **Non-semantic table markup**: Uses `role="presentation"` rather than `<table>` semantics. Accessibility concern.
2. **No date information displayed**: Neither tab shows comment period dates on the listing. Users must click into each document to see deadlines.
3. **Inconsistent action buttons on closed items**: Some have "View Comments" (PDF booklet), some have "Exposure Draft" (PDF), most have none.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED.

---

## Template 9 — Document Detail / Exposure Draft

**URL:** `https://www.frascanada.ca/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option`
**Date verified:** 2026-03-04
**Method:** claude-in-chrome MCP (read_page accessibility tree + screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| H1 title | Yes | YES -- "AcSB Exposure Draft -- Amendments to the Fair Value Option for Investments in Associates and Joint Ventures" | CONFIRMED |
| Breadcrumb trail | Yes | YES -- Home / IFRS Accounting Standards / Documents for Comment / [title] | CONFIRMED |
| Section nav tabs | Yes | YES -- OVERVIEW, PROJECT LISTING, DOCUMENTS FOR COMMENT (active), EFFECTIVE DATES, RESOURCES, IFRIC AGENDA DECISIONS | CONFIRMED |
| "Highlights" section | Yes | YES -- bold purple subheading with paragraphs about the AcSB proposal | CONFIRMED |
| Rich body content | Yes | YES -- sections: "Highlights", "IASB Exposure Draft", "Comments Requested" with blockquoted question, inline links | CONFIRMED |
| "When to Reply" section with bold deadline dates | Yes | YES -- "Comments to the IASB are due by **April 20, 2026**." and "send your comments to the AcSB by **March 27, 2026**." | CONFIRMED |
| "How to Reply" dark purple CTA block | Yes | YES -- dark purple block with white text, instructions, full mailing address, email, and "Submit comment" button | CONFIRMED |
| Contact address in CTA block | Yes | YES -- Katharine Christopoulos, CPA, CA / Director / 145 King Street West, Suite 500 / Toronto, Ontario M5H 1J8 | CONFIRMED |
| "Submit comment" button in CTA block | Yes | YES -- purple button linking to `/en/acsb/submit-comment?docname=AcSB-ED-Amendments-to-the-Fair-Value-Option` | CONFIRMED |
| Support Materials section | Yes | YES -- heading "Support Materials" with chain-link icon + "Amendments to the Fair Value Option (IAS 28)" link | CONFIRMED |
| Chain-link icon next to support material links | Yes | YES -- chain-link icon visible left of the link | CONFIRMED |
| Staff Contact(s) sidebar | Yes | YES -- right sidebar: "Katharine Christopoulos, CPA, CA", Director, phone (+1 416 204 3270), email (kchristopoulos@acsbcanada.ca) | CONFIRMED |

### Content Structure (top to bottom)
1. Header banner (AcSB logo on purple-to-red gradient)
2. Breadcrumb
3. Section nav tabs
4. H1 title
5. Highlights (left column) + Staff Contact(s) sidebar (right column)
6. IASB Exposure Draft section (links to IASB source docs)
7. Comments Requested section (blockquoted question)
8. When to Reply section (bold dates: April 20, 2026 / March 27, 2026)
9. How to Reply dark purple CTA block (address + email + Submit comment button)
10. Support Materials section (chain-link icon + linked doc)
11. Footer

### Discrepancies / Flags
1. **"How to Reply" background color**: Very dark purple, almost black. Functions as intended but exact shade may differ from Figma spec.
2. **No "back to listing" navigation**: Must use breadcrumb or section nav tab to return.
3. **Staff Contact sidebar not sticky**: Disappears as user scrolls past Highlights, but same info repeated in "How to Reply" CTA block.

### Verdict: ALL EXPECTED ELEMENTS CONFIRMED.

---

## Templates 8 & 9 Summary

| Template | Page | URL | All Elements Present? | Notes |
|----------|------|-----|----------------------|-------|
| Template 8 | Documents for Comment Listing | `/en/ifrsstandards/documents` | YES | Filter pills (Open/Closed), grouped table with section headers, document links, "Submit comment" buttons all confirmed. Non-semantic table markup. No dates on listing. |
| Template 9 | Document Detail / Exposure Draft | `/en/ifrsstandards/documents/acsb-ed-amendments-to-the-fair-value-option` | YES | H1, Highlights, rich body, "When to Reply" with bold dates, dark purple "How to Reply" CTA with address + Submit button, Support Materials with chain-link icon, Staff Contact(s) sidebar all confirmed. |

---

## CSSB Board Landing — `/en/cssb`

**Date verified:** 2026-03-04
**Method:** Claude-in-Chrome MCP (read_page + screenshots)

### Section Tabs
**Count: 5 tabs**
| # | Label | URL |
|---|-------|-----|
| 1 | ABOUT | `/en/cssb/about` |
| 2 | MEETINGS | `/en/cssb/meetings-and-events` |
| 3 | COMMITTEES | `/en/cssb/committees` |
| 4 | NEWS LISTINGS | `/en/cssb/news-listings` |
| 5 | VOLUNTEER OPPORTUNITIES | `/en/cssb/volunteer-opportunities` |

### About Intro Block
| Element | Present? | Details |
|---------|----------|---------|
| "About the CSSB" heading | YES | h2, bold, left column |
| Intro paragraph | YES | "The Canadian Sustainability Standards Board (CSSB) works to advance the adoption of sustainability disclosure standards in Canada. The CSSB develops Canadian Sustainability Disclosure Standards (CSDSs) that align with the global baseline standards developed by the International Sustainability Standards Board (ISSB), but with modifications to serve the Canadian public interest." |
| "Read more" link | YES | Links to `/en/cssb/about` |

### Contact Block
| Element | Present? | Details |
|---------|----------|---------|
| "Contact the CSSB" heading | YES | h2, bold, right column |
| Contact text | YES | "Need help or have information to share?" |
| Email link | YES | Displays `cssb.ccnid@frascanada.ca` (mailto links to `lfrench@frascanada.ca` — note mismatch between displayed text and actual href) |

### Middle Promotional Zone (dark purple banner)
**CSSB has TWO promotional blocks side-by-side in the middle zone (NOT a newsletter CTA):**

| # | Block | CTA Button | Link |
|---|-------|------------|------|
| 1 | "Watch On Demand: CSSB and UN PRI's 'Sustainability Disclosure in Canada: Overcoming the Headwinds'" | "Watch now" | YouTube video link |
| 2 | "CSSB 2025-2028 Strategic Plan and Feedback Statement" | "Learn more!" | `/en/cssb/about/strategic-plan` |

**No newsletter/subscribe CTA in the middle zone.** This is a key difference from other boards.

### News Feed
| Element | Present? | Details |
|---------|----------|---------|
| "News" heading | YES | Purple h2 |
| "See all news" link | YES | Links to `/en/cssb/news-listings` |
| Item count | **3 items** | Displayed in 3-column layout |

**News items:**
1. **Feb 25, 2026** — "CSSB Volunteer Opportunity - Candidates who Identify as Indigenous (First Nations, Inuit, Metis)" — Category: Volunteer Opportunity, CSSB — External link to Pathways Executive Search
2. **Jan 12, 2026** — "AcSB and CSSB Meet Japanese Counterparts to Advance Global Accounting and Sustainability Standards" — Category: News — External link to ASBJ PDF
3. **Nov 25, 2025** — "Watch the Recording: CSSB and UN PRI's 'Sustainability Disclosure in Canada: Overcoming the Headwinds'" — Category: Webinar, News — Internal link

### Meeting & Event Summaries Feed
| Element | Present? | Details |
|---------|----------|---------|
| "Meeting & event summaries" heading | YES | Purple h2 |
| "See all meetings & events summaries" link | YES | Links to `/en/cssb/meetings-and-events` |
| Item count | **3 items** | Displayed in 3-column layout |

**Meeting summary items:**
1. **Nov 19-20, 2025** — "CSSB Decision Summary - November 19-20, 2025" — Discussed engagement framework, 2026 Performance Report, Climate-related Disclosures
2. **Oct 29, 2025** — "CSSB Decision Summary - October 29, 2025" — SASB Standards Enhancement, Indigenous Peoples outreach
3. **Aug 27, 2025** — "CSSB Decision Summary - August 27, 2025" — Advisory committees creation, Strategic Plan, SASB consultation

### Social Media Links
**In footer only** (not in page body):
- LinkedIn (`/en/linkedin`)
- Twitter/X (`https://twitter.com/FRASCanada`)
- YouTube (`https://www.youtube.com/@financialreportingassuranc5812`)

**No inline social media section in the page body.** This is different from RASOC which has social media buttons in the middle zone.

### Other Footer Elements
- "Receive Enewsletter" link in footer bar
- Contact, Copyright links
- Cookie Policy, Privacy, Terms of Use

### Unique Elements (compared to AcSB/PSAB/AASB)
1. **Banner logo says "FRAS Sustainability"** — uses the FRAS Sustainability variant logo (not the standard FRAS or board-specific logo like AcSB/PSAB/AASB)
2. **Two promotional blocks** in the middle zone instead of a newsletter CTA — one for a video recording, one for the Strategic Plan
3. **No newsletter/subscribe CTA in the middle zone** — unlike other boards
4. **No inline social media section in the body** — social links only appear in the global footer
5. **Contact email display mismatch** — displays `cssb.ccnid@frascanada.ca` but the mailto href points to `lfrench@frascanada.ca`
6. **Meeting summaries use "Decision Summary" terminology** — other boards use "Meeting Summary" or "Meeting Minutes"
7. **Only 5 tabs** (no PROJECT LISTING or STANDARDS tabs) — same count as AcSB/PSAB/AASB but different labels (COMMITTEES instead of COMMITTEES for some boards)

### Verdict: ALL CORE ELEMENTS CONFIRMED
About block, Contact block, 3-item News feed, 3-item Meeting summaries feed, section tabs all present. Middle zone uses promotional content blocks instead of newsletter CTA. Social media links footer-only.

---

## RASOC Board Landing — `/en/rasoc`

**Date verified:** 2026-03-04
**Method:** Claude-in-Chrome MCP (read_page + screenshots)

### Section Tabs
**Count: 6 tabs** (one more than all other boards)
| # | Label | URL |
|---|-------|-----|
| 1 | ABOUT | `/en/rasoc/about` |
| 2 | MEETINGS | `/en/rasoc/meetings-and-events` |
| 3 | COMMITTEES | `/en/rasoc/committes` (note: typo in URL — "committes" not "committees") |
| 4 | NEWS LISTINGS | `/en/rasoc/news-listings` |
| 5 | VOLUNTEER OPPORTUNITIES | `/en/rasoc/volunteer-opportunities` |
| 6 | RECRUITMENT GUIDELINES | `/en/rasoc/recruitment-guidelines` |

### About Intro Block
| Element | Present? | Details |
|---------|----------|---------|
| Page heading | YES | "The Oversight Council" (h1, purple) |
| Intro paragraph | YES | "Established in 2024, the Reporting & Assurance Standards Oversight Council (the Oversight Council) is an independent, volunteer body dedicated to serving the public interest." |
| Board list | YES | Lists 4 boards it oversees with links: AASB, AcSB, CSSB, PSAB |
| "Read more" button | YES | Purple button linking to `/en/rasoc/about` |

**NOTE:** The PSAB link in the board list (`ref_151`) incorrectly points to `/en/cssb` instead of `/en/psab`. This is a data/link error.

### Contact Block
| Element | Present? | Details |
|---------|----------|---------|
| "Contact the Oversight Council" heading | YES | h2, bold, right column |
| Contact text | YES | "Need help or have information to share?" |
| "Contact us" button | YES | Outlined/bordered button linking to `/en/rasoc/contact-us` |

**NOTE:** RASOC uses a "Contact us" button linking to a contact page, rather than displaying a direct email address like all other boards.

### Middle Promotional Zone (dark purple banner)
**Two-column layout:**

**Left column — Newsletter CTA:**
- Heading: "Stay Up to Date on the Progress of Standard-setting Initiatives"
- Text: "Subscribe to *The Standard*, the Boards and Oversight Council's enewsletter, which you can customize to topics that interest you."
- CTA button: "Subscribe" (links to `/en/my-account/mysubscriptions`)

**Right column — Social Media:**
- Heading: "Follow Us on Social Media:"
- Three purple buttons: X, LinkedIn, YouTube
- X: `https://twitter.com/FRASCanada`
- LinkedIn: `https://www.frascanada.ca/en/linkedin`
- YouTube: `https://www.youtube.com/channel/UCk5HwEnc8PfvYf4jaWGan2w`

### Meeting & Event Summaries Feed
| Element | Present? | Details |
|---------|----------|---------|
| "Meeting & event summaries" heading | YES | Purple h2 |
| "See all meetings & events summaries" link | YES | Links to `/en/rasoc/meetings-and-events` |
| Item count | **3 items** | Displayed in 3-column layout |

**Meeting summary items:**
1. **Jun 18, 2025** — "Reporting and Assurance Standards Oversight Council Meeting Minutes - June 18, 2025" — Discussed activities of four Boards
2. **Feb 4, 2025** — "Oversight Council Meeting Minutes - February 4, 2025" — Discussed activities of various boards
3. **Oct 29, 2024** — "Oversight Council Meeting Minutes - October 29, 2024" — Discussed activities of various boards

**NOTE:** RASOC uses "Meeting Minutes" terminology, not "Decision Summary" like CSSB or "Meeting Summary" like AcSB.

### News Feed
| Element | Present? | Details |
|---------|----------|---------|
| "News" heading | YES | Purple h2 |
| "See all news" link | YES | Links to `/en/rasoc/news-listings` |
| Item count | **3 items** | Displayed in 3-column layout |

**News items:**
1. **Jan 12, 2026** — "Media Release - Andrew Newman Named Chair of the Public Sector Accounting Board" — Category: News
2. **Jul 22, 2025** — "Explore the 2024-2025 Annual Reports from the Reporting and Assurance Standards Oversight Council and the Standard-setting Boards" — Category: News
3. **Jul 8, 2025** — "Call for Applications: Chair, Public Sector Accounting Board" — Category: News

### Social Media Links
**In BOTH page body AND footer:**
- **Body (middle zone):** X, LinkedIn, YouTube as purple pill buttons
- **Footer:** LinkedIn, Twitter/X, YouTube icons (same as all other pages)

### Unique Elements (compared to AcSB/PSAB/AASB/CSSB)
1. **6 tabs instead of 5** — extra "RECRUITMENT GUIDELINES" tab unique to RASOC
2. **Banner logo is "RASOC" branded** — uses the RASOC-specific logo with "Reporting & Assurance Standards Oversight Council" text
3. **Breadcrumb says "The Oversight Council"** — not "RASOC" in the breadcrumb trail
4. **About section lists the 4 boards it oversees** with links — unique structural element not on any board landing
5. **Contact block uses a "Contact us" button** linking to a separate contact page — all other boards show a direct email address
6. **Newsletter CTA ("The Standard") in the middle zone** — this is the standard newsletter subscribe pattern, similar to AcSB/PSAB/AASB but different from CSSB which has promotional content instead
7. **Inline social media buttons in the body** (purple pill-style) — unique visual treatment not on other board landings
8. **Meeting summaries use "Meeting Minutes" terminology** — different from "Decision Summary" (CSSB) and "Meeting Summary" (AcSB/PSAB)
9. **URL typo:** `/en/rasoc/committes` (missing an 'e') for the Committees tab
10. **Link error:** The PSAB link in the board list incorrectly points to `/en/cssb` instead of `/en/psab`
11. **Page order is Meeting Summaries THEN News** — same as other boards, feeds appear below the promo zone

### Verdict: ALL CORE ELEMENTS CONFIRMED WITH BUGS NOTED
About block, Contact block, Newsletter CTA, Social media links, 3-item Meeting summaries feed, 3-item News feed, 6 section tabs all present. Two bugs flagged: PSAB link error and "committes" URL typo.

---

## Board Landing Comparison Matrix

| Feature | AcSB | PSAB | AASB | CSSB | RASOC |
|---------|------|------|------|------|-------|
| **Tab count** | 5 | 5 | 5 | 5 | **6** |
| **Extra tab** | — | — | — | — | RECRUITMENT GUIDELINES |
| **About intro** | Yes | Yes | Yes | Yes | Yes |
| **"Read more" link** | Yes | Yes | Yes | Yes | Yes (button style) |
| **Contact block** | Yes (email) | Yes (email) | Yes (email) | Yes (email*) | Yes (**button to page**) |
| **Middle zone type** | Newsletter CTA | Newsletter CTA | Newsletter CTA | **Promo content (2 blocks)** | Newsletter CTA + Social |
| **Newsletter CTA** | Yes | Yes | Yes | **No** | Yes ("The Standard") |
| **Inline social media** | No | No | No | No | **Yes (purple pills)** |
| **Meeting summaries (3)** | Yes | Yes | Yes | Yes | Yes |
| **Meeting terminology** | Meeting Summary | Meeting Summary | Meeting Summary | **Decision Summary** | **Meeting Minutes** |
| **News feed (3)** | Yes | Yes | Yes | Yes | Yes |
| **Footer social links** | Yes | Yes | Yes | Yes | Yes |
| **Banner logo** | AcSB | PSAB | AASB | **FRAS Sustainability** | **RASOC** |
| **Boards list in About** | No | No | No | No | **Yes (4 boards)** |

### Key Differences Summary

**CSSB is unique because:**
- Uses "FRAS Sustainability" banner branding instead of a board-specific logo
- Has **two promotional content blocks** in the middle zone instead of a newsletter CTA
- Uses "Decision Summary" for meeting summaries
- No inline social media or newsletter CTA in the body
- Contact email display/href mismatch bug

**RASOC is unique because:**
- Has **6 tabs** (extra: Recruitment Guidelines)
- Has **inline social media buttons** (purple pills) in the body
- Uses "Contact us" button instead of direct email
- Lists the 4 boards it oversees in the About section
- Uses "Meeting Minutes" for meeting summaries
- Has 2 bugs: PSAB link error pointing to `/en/cssb`, and "committes" URL typo

---

## Homepage — `/en`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + viewport screenshots)

### Page Structure (top to bottom)

1. **Header / Navigation Bar** (sticky)
   - FRAS Canada logo (left)
   - Primary nav: FRAS Canada, Council, Boards, Standards (each with dropdown chevron)
   - Login link (top right)
   - Language switcher: English / Francais dropdown
   - Search icon (magnifying glass, far right)

2. **Hero Banner**
   - Full-width gradient banner: purple (left) transitioning to blue (right)
   - Dotted/halftone pattern overlay on the blue side
   - FRAS Canada full logo (white) centered-left within the banner
   - No heading text, no CTA button -- purely a branded visual banner

3. **"Top Stories" Section**
   - H1 heading "Top Stories" on white background above the cards
   - 3-column card layout on a **purple background** (full-width purple section)

4. **"News Listings" Section**
   - H2 heading "News Listings" on white background
   - Category filter tabs, sort controls, date range, paginated news items

5. **Footer**
   - Dotted background pattern (light gray)
   - 3-column layout: FRAS Canada links, Standards links, FRAS logo
   - Sub-footer bar (dark red/maroon): Contact, Receive Enewsletter, Copyright, Social icons (LinkedIn, X/Twitter, YouTube), Cookie Policy, Privacy, Terms of Use

---

### Claim 1: "Top Stories" section with 3-column feature cards

| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Section exists with heading | Yes | YES -- H1 "Top Stories" present | CONFIRMED |
| 3-column layout | Yes | YES -- 3 cards side by side | CONFIRMED |
| Purple background | Yes | YES -- full-width deep purple (~#601F5B / dark plum) background behind all 3 cards | CONFIRMED |
| H2 title per card | Claimed H2 | Actual: rendered as **H2 headings** in the accessibility tree with white text | CONFIRMED |
| Image per card | Yes | YES -- each card has a landscape image below the title, separated by a thin horizontal rule | CONFIRMED |
| Excerpt text | Yes | YES -- multi-sentence paragraph excerpt below each image, white text on purple | CONFIRMED |
| CTA button | Yes | YES -- each card has a button at the bottom | CONFIRMED |

#### Feature Card Details (as of 2026-03-04)

**Card 1:**
- Title: "Virtual Roundtable: Help Shape Canada's Input on the IAASB's ISA 540 Review"
- Image: Magnifying glass on table with glowing tech/data graphics
- Excerpt: "Share your experience applying CAS 540, Auditing Accounting Estimates and Related Disclosures -- your insights will directly shape Canada's input to the IAASB's post-implementation review of ISA 540 (Revised). Join us on April 7 (English) or April 9 (French) to influence international auditing standards, surface real-world challenges, and help ensure Canadian perspectives are reflected in global standard-setting."
- CTA: **"Register now"** button (white text on brighter purple/magenta background)
- Link: `/en/cass/projects/canadian-activities-iaasb-isa-540/virtual-roundtable-canadian-input-iaasb-post-implementation-review-isa-540`

**Card 2:**
- Title: "What We Heard at the Canadian Technology Quality Management Roundtable"
- Image: Wall of light-up text/speech bubbles
- Excerpt: "The AASB, in partnership with the IAASB, convened a Canadian roundtable to explore how emerging technologies -- including AI -- are being used in audit and assurance engagements and how quality management standards apply in practice. The insights gathered are informing the IAASB's global Technology Quality Management project and helping ensure Canadian perspectives are reflected in future guidance."
- CTA: **"Read now"** button (white text on brighter purple/magenta background)
- Link: `/en/csqc/projects/technology-quality-management-workstream/what-we-heard-canadian-technology-quality-management-roundtable`

**Card 3:**
- Title: "ROMRS Post-implementation Review: What You Need to Know"
- Image: Person using a calculator holding a pen
- Excerpt: "The AcSB conducted a post-implementation review of the retractable or mandatorily redeemable shares issued in tax planning arrangements (ROMRS) amendments to Account Standards for Private Enterprises -- to assess whether the changes are working as intended. Based on outreach and analysis, the Board confirmed that the amendments are meeting their objectives, with no significant systemic issues identified. Explore the post-implementation review findings."
- CTA: **"Read now"** button (white text on brighter purple/magenta background)
- Link: `/en/aspe/projects/redeemable-shares-tax-planning/romrs-post-implementation-review`

#### Card Structure Note
Each card follows this vertical order: **Title (H2, white, with underline rule) -> Landscape image -> Excerpt paragraph (white text) -> CTA button**. The title has a thin horizontal line (rule) beneath it separating it from the image. The CTA buttons are styled as filled rectangles with rounded corners.

---

### Claim 2: "News Listings" section

| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| Section heading | Yes | YES -- H2 "News Listings" | CONFIRMED |
| Category filter tabs | Yes | YES -- horizontal row of pill/tag buttons | CONFIRMED |
| Sort dropdown | Yes | YES -- "Sort by: Publication date: Newest" dropdown | CONFIRMED |
| Date range | Yes | YES -- Start Date and End Date fields (mm/dd/yyyy placeholders) | CONFIRMED |
| Pagination (claimed 102 pages) | Yes | YES -- pagination shows: 1, 2, 3, ..., 101, 102, > (next arrow) | CONFIRMED |

#### Category Filter Tabs (actual)
The filter tabs are rendered as a horizontal row of bordered pill-style buttons:
1. **All Items** (selected/active -- dark background, white text)
2. Document for Comment
3. International Activity
4. Meeting Summary
5. News
6. Resource

There is also a **mobile-only dropdown** version of these same categories (combobox with same options).

#### Additional Controls
- **Items per page:** dropdown with options: 10 (selected), 20, 30, All
- **Sort by:** dropdown with options: "Publication date: Newest" (selected), "Publication date: Oldest"
- **Start Date / End Date:** two text fields with `mm/dd/yyyy` placeholder format

#### News Items on Page 1 (10 items displayed)

| # | Date | Category | Title |
|---|------|----------|-------|
| 1 | March 4, 2026 | Document for Comment | AcSB Exposure Draft -- Amendments to the Fair Value Option for Investments in Associates and Joint Ventures |
| 2 | February 27, 2026 | News | AcSB endorses amendments to several illustrative examples to clarify disclosure requirements for uncertainties |
| 3 | February 19, 2026 | News | IFRS Accounting Standards Discussion Group -- Request for Issues |
| 4 | February 17, 2026 | News | AcSB endorses Translation to a Hyperinflationary Presentation Currency (Amendments to IAS 21) |
| 5 | February 17, 2026 | News | What We Heard and Next Steps for the Canadian Amendments Related to Indigenous Matters in CSSA 5000 |
| 6 | February 9, 2026 | Resource, Other | ROMRS Post-implementation Review -- What You Need to Know |
| 7 | February 6, 2026 | Resource, Article | What We Heard at the Canadian Technology Quality Management Roundtable |
| 8 | January 22, 2026 | Meeting Summary, Webpage | AcSB Decision Summary -- January 22, 2026 |
| 9 | January 19, 2026 | Meeting Summary, Meeting | AASB Decision Summary -- January 19, 2026 |
| 10 | January 12, 2026 | News | AcSB and CSSB Meet Japanese Counterparts to Advance Global Accounting and Sustainability Standards |

Each news item displays: **Date** (left) | **Category tag(s)** (right of date) | **Linked title** (purple, bold, H3-level heading) | **Excerpt paragraph** (gray/black text). Items #4 and #10 have external link icons.

#### Pagination Details
- Shows: `1  2  3  ...  101  102  >`
- Total pages: **102** (confirmed via links "Go to page 101" and "Go to page 102")
- Next page arrow (`>`) links to page 2

---

### Claim 3: Feature card styling details

| Element | Claimed | Actual | Match? |
|---------|---------|--------|--------|
| White text on purple bg | Yes | YES -- title text and excerpt text are white on deep purple background | CONFIRMED |
| Landscape image | Yes | YES -- all 3 images are landscape orientation (wider than tall) | CONFIRMED |
| Excerpt text | Yes | YES -- multi-sentence paragraph excerpts present on all 3 cards | CONFIRMED |
| CTA button like "Register now" or "Read now" | Yes | YES -- Card 1 has "Register now", Cards 2 and 3 have "Read now" | CONFIRMED |

#### Minor Styling Notes
- The CTA buttons appear as **filled rectangles with slight rounding**, brighter purple/magenta against the darker purple card background
- Title text is **bold, white**, with a **thin horizontal rule** (line) underneath separating it from the image
- The purple background is not per-card; it is a **full-width purple section** spanning the entire viewport width, with 3 cards arranged inside it

---

### Discrepancies / Flags

1. **No discrepancies found** -- All 3 claims are fully confirmed.
2. **Title heading level:** The "Top Stories" heading is rendered as H1 (not H2). The individual card titles are H2. The "News Listings" heading is also H2. This is semantically appropriate.
3. **External links:** News items #4 (IAS 21 amendment) and #10 (Japanese counterparts meeting, links to asb-j.jp) display an external link icon, which is good UX practice.
4. **Cookie consent overlay:** A OneTrust privacy preference dialog appears on first visit with Strictly Necessary, Performance, Functional, and Targeting cookie categories.
5. **No hero CTA or hero heading:** The hero banner is purely visual (logo + gradient). There is no headline or call-to-action in the hero area.

### Verdict: ALL 3 CLAIMS CONFIRMED. The homepage at `/en` contains a "Top Stories" section with exactly 3 feature cards in a 3-column layout on a purple background, each with an H2 title, landscape image, excerpt text, and CTA button ("Register now" or "Read now"). The "News Listings" section has category filter tabs (6 categories), a sort dropdown, date range fields, items-per-page selector, and pagination spanning 102 pages. Feature card styling matches: white text on purple background, landscape images, excerpt paragraphs, and styled CTA buttons.

---

## Template 12 — Filtered News/Event Listing — `/en/news-listings`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + screenshots + JavaScript DOM extraction)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Category filter tabs (Document for Comment, International Activity, Meeting Summary, News, Resource) | Yes | YES — "All Items" (active/selected), "Document for Comment", "International Activity", "Meeting Summary", "News", "Resource" displayed as pill/tab buttons | CONFIRMED |
| Items per page dropdown | Yes | YES — `<select id="ItemsPerPageDropDown">` with options: **10** (default), **20**, **30**, **All** | CONFIRMED |
| Sort by dropdown | Yes | YES — `<select id="SortByDropDown">` with options: **"Publication date: Newest"** (default), **"Publication date: Oldest"** | CONFIRMED |
| Date range (Start/End date inputs) | Yes | YES — Two text inputs labeled **"START DATE"** and **"END DATE"** with placeholder `mm/dd/yyyy`, separated by "to" | CONFIRMED |
| Paginated listing items with date | Yes | YES — Each item displays a date (e.g. "March 4, 2026") | CONFIRMED |
| Paginated listing items with category tag | Yes | YES — Each item shows category text inline after the date (e.g. "Document for Comment", "News") | CONFIRMED |
| Paginated listing items with linked title | Yes | YES — Titles are purple hyperlinks (e.g. "AcSB Exposure Draft -- Amendments to the Fair Value Option...") | CONFIRMED |
| Paginated listing items with excerpt | Yes | YES — Each item includes a multi-line text excerpt paragraph below the title | CONFIRMED |
| Pagination controls | Yes | YES — Numeric page links: **1, 2, 3, ..., 100, 101** with a **Next (>)** arrow button | CONFIRMED |

### Pagination Details
- **Total pages:** 101 (at 10 items per page, "All Items" category)
- Pagination renders as: `1  2  3  ...  100  101  >` (next arrow)
- Current page (1) is displayed as non-linked bold text; others are clickable
- Pagination button IDs follow pattern: `maincontent_4_PaginationRepeater_BtnPage_N`
- Next button ID: `maincontent_4_BtnNext`

### Filter Tabs Details
- Desktop: 6 link-style buttons (`All Items` + 5 categories), each triggers ASP.NET PostBack
- Mobile: A separate `<select id="DropDownMobileTags">` with the same 6 options
- "All Items" is highlighted/active by default with a dark filled background
- Other tabs have bordered (outline) pill style

### Listing Item Structure (per item)
1. **Date** — e.g. "March 4, 2026" (plain text, left-aligned)
2. **Category tag** — e.g. "Document for Comment" (plain text, inline after date)
3. **Linked title** — purple bold hyperlink, some with external-link icon
4. **Excerpt** — paragraph of descriptive text

### Sample Items (Page 1)
| # | Date | Category | Title (truncated) |
|---|------|----------|-------------------|
| 1 | March 4, 2026 | Document for Comment | AcSB Exposure Draft -- Amendments to the Fair Value Option... |
| 2 | February 27, 2026 | News | AcSB endorses amendments to several illustrative examples... |
| 3 | February 19, 2026 | News | IFRS Accounting Standards Discussion Group -- Request for Issues |
| 4 | February 17, 2026 | News | AcSB endorses Translation to a Hyperinflationary Presentation Currency... |
| 5 | January 22, 2026 | Meeting Summary | AcSB Decision Summary -- January 22, 2026 |

### Flags / Observations
- **No total results count displayed** — user must infer total from pagination (101 pages x 10 items)
- **No thumbnail images** — listing items are text-only
- Sort options are limited to date-based only (no alphabetical, no relevance)
- Page uses ASP.NET Web Forms PostBack for all filter/pagination interactions (not AJAX/SPA)
- NOTE: Homepage `/en` also embeds a News Listings section; pagination there showed 102 pages vs 101 here — likely 1 item added/removed between checks, or slight count discrepancy between standalone and embedded

---

## Template 16 — Authentication Page — `/en/my-account/login`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Login form with email input | Yes | YES — `<input type="text">` labeled **"User Name (email address):"** | CONFIRMED |
| Login form with password input | Yes | YES — `<input type="password">` labeled **"Password:"** | CONFIRMED |
| "Forgot your User Name?" link | Yes | YES — Inline right of email field, href `/en/my-account/forgot-username` | CONFIRMED |
| "Forgot your Password?" link | Yes | YES — Inline right of password field, href `/en/my-account/forgot-my-password` | CONFIRMED |
| Login button (purple filled) | Yes | YES — Purple/dark filled button labeled **"Log in"** (full-width block, centered) | CONFIRMED |
| Register CTA ("Create My account" link) | Yes | YES — **"Not registered yet?"** + **"Create My account"** link → `/en/my-account/register` | CONFIRMED |
| CPA Canada shared auth explanation | Yes | YES — Two explanation blocks present | CONFIRMED |
| Support contact info | Yes | YES — Email, toll-free, and local phone numbers with clickable links | CONFIRMED |

### CPA Canada Shared Auth Explanation (verbatim)
1. "*Are you a Chartered Professional Accountant (CPA) or subscribed to CPA Canada emails and newsletters? Your login information is the same as your **CPA Canada login**." — links to `https://www.cpacanada.ca/en/login`
2. "Note: You do not need to be a CPA to subscribe to The Standard."
3. "Why is your login information on this website the same as on CPA Canada's? CPA Canada funds the development of financial reporting and assurance standards and the activities of the Boards and Oversight Councils, which includes providing us with the resources and tools we need to send out our newsletter."

### Support Contact Info
- Email: **customerservice@cpacanada.ca** (`mailto:` link)
- Toll-free: **1 (800) 268-3793** (`tel:` link)
- Local: **+1 (416) 977-0748** (`tel:` link)

### Additional Content
- **Pre-form notice:** "If you are unable to login using your existing credentials, please **create a new account**." (link to `/en/my-account/register`)
- **Language preference:** "Update your language preference — follow instructions under **My Profile** once signed in."
- **Registration section:** "Register — Please provide your First Name, Last Name and Email."
- **Member note:** "*Member and Students: Your CPA Canada Member/Customer Number is required (format: C123456)."

### Page Layout
- Breadcrumb: Home / My Account / FRASCanada Log in
- Sub-nav: ABOUT, RESEARCH PROGRAM, NEWS LISTINGS, CONTACT US, JOB OPPORTUNITIES, VOLUNTEER OPPORTUNITIES, **MY ACCOUNT** (active)
- Page title: **"Log in"** (h1, purple)
- Form fields centered; labels left-aligned; "Forgot" links right-aligned on same row

### Flags / Observations
- **No CAPTCHA** — no visible bot protection on the login form
- **No "Remember me" checkbox** — no session persistence option
- **Login button uses PostBack** — `javascript:WebForm_DoPostBackWithOptions(...)` not standard form submit
- **"Log in" (two words) vs "Login" (one word)** — heading/button say "Log in"; header nav says "Login" — minor inconsistency
- **Email field uses `type="text"` not `type="email"`** — no browser-level email validation enforced

---

## Template 17 — Simple Content / Empty State — `/en/job-opportunities`

**Date verified:** 2026-03-04
**Method:** `mcp__claude-in-chrome` (read_page accessibility tree + screenshots)

### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Intro prose | Yes | YES — Three content paragraphs + CPA Canada note describing FRAS Canada's mission | CONFIRMED |
| Dynamic listing area (shows content or empty state) | Yes | YES — **"Open Positions"** section heading with dynamic content area below | CONFIRMED |
| Empty state message | Yes (when no content) | YES — Italic: *"Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!"* | CONFIRMED |

### Intro Prose Content
1. **"Become a part of something special!"** — bold lead-in
2. **Paragraph 1:** Canada's national standard setters role in financial/non-financial reporting supply chain, importance to businesses/economy/society.
3. **Paragraph 2:** Seeking independent, passionate, creative, results-driven, team-oriented individuals for boards, oversight councils, committees.
4. **CPA Canada note (italic):** CPA Canada provides funding/staff/resources for independent standard-setting; applications and recruitment supported by CPA Canada.

### Dynamic Listing Area
- **Heading:** "Open Positions" (bold, non-linked)
- **Current state:** Empty — no job listings
- **Empty state message:** Italic text — graceful, user-friendly message
- Transitions directly to site footer after empty state

### Page Layout
- Breadcrumb: Home / Job Opportunities
- Sub-nav: ABOUT, RESEARCH PROGRAM, NEWS LISTINGS, CONTACT US, **JOB OPPORTUNITIES** (active), VOLUNTEER OPPORTUNITIES, MY ACCOUNT
- Page title: **"Job Opportunities"** (h1, purple)

### Flags / Observations
- **No visible container/card structure** for listing area — no skeleton UI hinting at eventual layout when positions exist
- **No filtering, sorting, or pagination** — unlike Template 12, this is content-or-empty only
- **No fallback CTA** — no "Sign up for job alerts" or "Check partner sites" when empty
- Page combines a "simple content page" (intro) with a "listing page" (Open Positions) in one template
- Empty state message is well-worded and appropriately styled (italic)

---

## Template 3: Content Page + Right Sidebar

### 3a. Staff Contact(s) Sidebar Variant — `/en/research-program`

**Verified via:** claude-in-chrome (read_page + screenshots)

#### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Breadcrumbs | Yes | YES — "Home / Research Program" with links | CONFIRMED |
| Section tabs | Yes | YES — "ABOUT, RESEARCH PROGRAM (active, underlined purple), NEWS LISTINGS, CONTACT US, JOB OPPORTUNITIES, VOLUNTEER OPPORTUNITIES, MY ACCOUNT" | CONFIRMED |
| H1 title | Yes | YES — "Research Program" in large purple text | CONFIRMED |
| Rich text content | Yes | YES — H2 "What is our research program all about?" followed by 3 paragraphs of body text | CONFIRMED |
| Staff Contact(s) sidebar (right) | Yes | YES — positioned to the right of main content | CONFIRMED |
| Purple H3 "Staff Contact(s)" | Yes | YES — H2 tag, purple color `rgb(96, 31, 91)`, text reads "Staff Contact(s)" | CONFIRMED (note: uses H2 tag, not H3) |
| Name with credentials | Yes | YES — "Dominique Hamel, MSc, CPA" in bold | CONFIRMED |
| Title | Yes | YES — "Associate Director, Accounting Standards" | CONFIRMED |
| Phone icon + number | Yes | YES — phone icon image + linked "+1 514 285 5019" (`tel:` link) | CONFIRMED |
| Email icon + address | Yes | YES — email icon image + linked "dhamel@acsbcanada.ca" (`mailto:` link) | CONFIRMED |

#### Additional Sections Below Main Content
- **"Submit your research"** — dark purple/maroon banner with white text, description paragraph, and a "Submit" button (links to `mailto:Dhamel@acsbcanada.ca`)
- **"News"** — contains a single news item: "Blockchain and Cryptoassets - Insights from Practice" linking to an external Wiley journal article, with a description paragraph referencing *Accounting Perspectives*

#### Flags / Observations
- Staff Contact(s) heading is rendered as H2, not H3 — design spec should be verified for heading level
- Section tab label "FRASCanada" appears above the tabs as a bold section title
- The "Submit your research" CTA block is a full-width dark background section — not part of the sidebar layout

#### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

### 3b. Section Nav Sidebar Variant — `/en/about`

**Verified via:** claude-in-chrome (read_page + screenshots)

#### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Breadcrumbs | Yes | YES — "Home / About" with links | CONFIRMED |
| Section tabs | Yes | YES — "ABOUT (active, underlined purple), RESEARCH PROGRAM, NEWS LISTINGS, CONTACT US, JOB OPPORTUNITIES, VOLUNTEER OPPORTUNITIES, MY ACCOUNT" | CONFIRMED |
| H1 title | Yes | YES — "About" in large purple text | CONFIRMED |
| Rich text content | Yes | YES — Multiple H2s ("About Canada's Standard-setting Boards and Oversight Council", "Our Relationship with CPA Canada", "The CPA Canada Handbook"), body paragraphs, inline links to AcSB/PSAB/AASB/CSSB/RASOC, and an inline image | CONFIRMED |
| Section Nav sidebar (right) | Yes | YES — right sidebar with navigation links: "About", "Due Process", "International Activities", "IRCSS Recommendations" | CONFIRMED |

#### Section Nav Sidebar Details
- 4 navigation links in a vertical list, separated by thin horizontal rules
- Links: About, Due Process, International Activities, IRCSS Recommendations
- Text is gray/dark gray, no special active-state highlighting visible
- No heading label above the nav list (unlike Staff Contact(s) which has a purple heading)

#### Additional Sections Below Main Content
- **"Stay Up to Date..."** — dark purple banner with H2, description referencing "The Standard" newsletter, and a "Subscribe" button
- **"Follow Us on Social Media:"** — links to X (Twitter), LinkedIn, YouTube

#### Flags / Observations
- The Section Nav sidebar does NOT have a heading/title — it is just a plain list of links. This differs from Staff Contact(s) variant which has a prominent purple "Staff Contact(s)" heading.
- Both sidebar variants (Staff Contact and Section Nav) share the same overall page layout: main content left (~75%), sidebar right (~25%)

#### Verdict: ALL EXPECTED ELEMENTS CONFIRMED

---

## Template 7: Project Detail — `/en/ifrsstandards/projects/goodwill-and-impairment`

**Page:** Business Combinations - Disclosures, Goodwill and Impairment
**Verified via:** claude-in-chrome (read_page + screenshots + JavaScript inspection)

#### Expected Elements
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| "< Back to projects" link at top | Yes | YES — "Back to projects" link with `::before` pseudo-element for the `<` chevron icon, links to `/en/ifrsstandards/projects` | CONFIRMED |
| H1 title | Yes | YES — "Business Combinations - Disclosures, Goodwill and Impairment" in large purple text | CONFIRMED |
| Summary text | Yes | YES — H2 "Summary" (purple) followed by 3 rich-text paragraphs describing the IASB/AcSB initiative | CONFIRMED |
| Staff Contact(s) sidebar | Yes | YES — positioned right, identical structure to Template 3 variant | CONFIRMED |
| Staff Contact purple H3 | Yes | YES — H2 tag, purple `rgb(96, 31, 91)`, text "Staff Contact(s)" | CONFIRMED (note: H2 not H3) |
| Contact name with credentials | Yes | YES — "Jayshal Rajendra Daya, CPA, CA" | CONFIRMED |
| Contact title | Yes | YES — "Principal, Accounting Standards Board" | CONFIRMED |
| Phone icon + number | Yes | YES — phone icon + "+1 416 204 3501" (`tel:` link) | CONFIRMED |
| Email icon + address | Yes | YES — email icon + "jrdaya@acsbcanada.ca" (`mailto:` link) | CONFIRMED |

#### Project Status Timeline
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| "Project Status" heading | Yes | YES — H2, purple text | CONFIRMED |
| Exactly 5 phases | Yes | YES — 5 `<li>` items in the timeline list | CONFIRMED |
| Phase 1: "Information gathering" | Yes | YES — present, light gray bg `rgb(245,245,245)` | CONFIRMED |
| Phase 2: "Approving project" | Yes | YES — present, light gray bg | CONFIRMED |
| Phase 3: "Engaging communities" | Yes | YES — present, light gray bg | CONFIRMED |
| Phase 4: "Deliberating feedback" | Yes | YES — present, **active phase**, purple bg `rgb(96,31,91)` with white text | CONFIRMED |
| Phase 5: "Final pronouncement" | Yes | YES — present, light gray bg, no description text (future phase) | CONFIRMED |
| Green checkmarks for completed items | Yes | YES — `p.completed` class on items in phases 1-3, checkmark rendered via CSS `::before` pseudo-element using a background-image PNG | CONFIRMED |
| Purple bg highlight for current phase | Yes | YES — Phase 4 "Deliberating feedback" has `class="active"` and bg `rgb(96,31,91)` (FRAS purple) | CONFIRMED |

**Phase label discrepancy:** The spec says "Approving project" but the actual site shows "Approving project" (singular). This matches. However, the spec says "Engaging communities" and the site also shows "Engaging communities" — all match.

#### Timeline Visual Details
- Completed phases (1-3): light gray background `rgb(245,245,245)`, each completed sub-item has a green checkmark icon (PNG via CSS `::before`)
- Current phase (4, "Deliberating feedback"): purple background `rgb(96,31,91)`, white text, no checkmarks (items are in progress)
- Future phase (5, "Final pronouncement"): light gray background, no description text, no checkmarks

#### Related News Feed
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| "News" heading | Yes | YES — H2 "News" | CONFIRMED |
| News items with dates | Yes | YES — 7 news items with dates (July 30, 2024 through March 3, 2020) | CONFIRMED |
| News items with category tags | Yes | YES — categories like "International Activity, News", "Document for Comment, International Activity, News", etc. | CONFIRMED |
| News item titles as links | Yes | YES — each item has an H3 title link to the full article/document | CONFIRMED |
| News item summaries | Yes | YES — each item has a paragraph description | CONFIRMED |

Additionally, there is a **"Meeting & event summaries"** section below the News section with 5 meeting decision summary entries (June 2024 through January 2020).

#### Disclaimer Block
| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Dark/black bg | Yes | YES — `div.disclaimer-content` has bg `rgb(0,0,0)` (pure black) | CONFIRMED |
| "Disclaimer" label | Yes | YES — `<span>` with text "Disclaimer" | CONFIRMED |
| Legal text | Yes | YES — "This project summary has been prepared for information purposes only. Decisions reported are tentative and reflect only the current status of discussions on this project, which may change after further Board deliberations. Decisions to publish Handbook material are final only after a formal voting process." | CONFIRMED |
| Italicized text | **Expected** | **NO** — body text `fontStyle: "normal"`, NOT italic. The text color is `rgba(255,255,255,0.82)` (semi-transparent white). | **NOT CONFIRMED** |

#### Flags / Observations
1. **Disclaimer text is NOT italicized** — the CSS `font-style` is `normal` on both the title `<span>` and the body `<p>`. The spec calls for "italicized legal text" but the current site renders it in normal (upright) style. The text is white on black background which gives it a distinct appearance, but it is not italic.
2. **Staff Contact(s) heading uses H2, not H3** — same as Template 3. Consistent across both templates.
3. **"Back to projects" uses a CSS `::before` pseudo-element** for the left-arrow/chevron icon, not an inline `<` character in the HTML.
4. **Meeting & event summaries** section exists below News — this was not explicitly listed in the expected elements but is present as an additional content section.
5. **Breadcrumbs:** "Home / IFRS Accounting Standards / Business Combinations - Disclosures, Goodwill and Impairment" — 3 levels deep.
6. **Section tabs at top:** OVERVIEW, PROJECT LISTING (active), DOCUMENTS FOR COMMENT, EFFECTIVE DATES, RESOURCES, IFRIC AGENDA DECISIONS

#### Verdict: ALL EXPECTED ELEMENTS CONFIRMED except disclaimer body text is NOT italicized (renders as `font-style: normal`)
