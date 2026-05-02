---
archived-on: 2026-05-01
archived-reason: historical
---
# FRAS Canada — Documentation Audit Report

**Date:** 2026-03-05
**Status:** ALL ISSUES FIXED (2026-03-05). See audit log entries 51-55 for fix details.
**Scope:** All `.ai-reports/` documentation — PRDs, Build Plans, wireframes, design tokens, cross-reference docs, supporting research
**Files audited:** 14 documents across 5 parallel audit passes

---

## Executive Summary

**76 total issues found** across 14 documents. Broken down by severity:

| Severity | Count | Description |
|----------|-------|-------------|
| **HIGH** | 5 | Contradictions that would cause implementation errors |
| **MEDIUM** | 24 | Inconsistencies that need reconciliation before build |
| **LOW** | 47 | Cosmetic, stale info, or minor naming issues |

The biggest systemic problem: **documents were updated independently and never reconciled against each other.** Key decisions (Meilisearch, Aptify, collection merges) are correctly reflected in some files but stale in others.

---

## HIGH Severity Issues (5)

### H1. `consolidated-gaps-report.md` — Search decision still shows "Coveo vs Custom — needs decision"
The Meilisearch decision was made and incorporated into `notion-research-cross-reference.md` and both PRDs, but the consolidated gaps report (Part 4 item 1, Part 5 Q8, Part 7 blocking decision #1) still treats this as an unresolved blocking decision.
**Fix:** Update Part 4 item 1, Part 5 Q8, and Part 7 item 1 to reflect Meilisearch resolution.

### H2. `research-resolution-open-questions.md` — Auth Q3 still shows "Hard blocker — CPA SSO protocol unknown"
The Aptify DB API decision was confirmed via Notion research and incorporated into both PRDs and the consolidated report. But this file still treats auth as the #1 hard blocker with unknown SSO protocol, never mentioning Aptify.
**Fix:** Update Q3 to reflect Aptify resolution.

### H3. `PRD-phase2.md` — Open Question #2 resolves to merge `document-for-comment` + `document-detail` into one collection, but Sections 3.4, 3.5, 4.1, 4.4, 4.5 all still treat them as two separate collections
The resolution says "Single `documents-for-comment` collection with `detailLevel` field" but nothing in the rest of the document was updated. All tables, diagrams, and specs still show two collections.
**Fix:** Either revert the Q2 resolution (keep two collections) or update all sections to reflect the merge. Recommend keeping two collections and updating Q2.

### H4. `wireframe-specs.md` — `boards` collection lists only 4 boards (AcSB, PSAB, AASB, CSSB), missing RASOC
The collection definition in the CMS mapping section omits RASOC. All other docs list 5 boards/councils.
**Fix:** Add RASOC to the boards collection definition.

### H5. Project Timeline: 5 stages (wireframes) vs up to 7 stages (Notion component specs)
Phase 1 wireframe specs consistently describe 5 fixed stages. Notion says "up to 7 stages allowed" and authors can curate them. This is a functional design conflict.
**Fix:** Clarify with design team. Recommend: configurable up to 7 stages (per Notion), wireframe just shows 5 as a representative example.

---

## MEDIUM Severity Issues (24)

### PRD.md (7 medium issues)

| # | Issue |
|---|-------|
| M1 | RASOC systematically excluded from mega-menu, search facets, and Active Projects board nav — needs explicit exclusion rationale or inclusion |
| M2 | Hero Banner search placeholder implies sitewide ("Projects, standards, and more...") but Notion says project-only — scope never clarified |
| M3 | "Project Actions" (Section 4.3) vs "Quick Actions" (Section 4.2) naming — same component per Notion, treated as different in PRD |
| M4 | 6 components described in page specs (Section 4) but missing from component inventory (Section 6): `<BrowseByStandard />`, `<NewToFRAS />`, `<CountdownTimer />`, `<StaffContacts />`, `<CollapsibleSection />`, `<PromoCardGrid />` |
| M5 | `decision-summaries` collection defined in Section 5 but never referenced by any page spec — orphaned in Phase 1 |
| M6 | Newsletter CTA: homepage version has trust text + LinkedIn, footer version is simpler — are these the same `<NewsletterCTA />` component with different props or separate components? |
| M7 | Epic 20.x references in open questions fall outside documented Phase 2 epic range (11-19) |

### PRD-phase2.md (5 medium issues)

| # | Issue |
|---|-------|
| M8 | Collection name inconsistency: `document-for-comment` (singular, used everywhere) vs `documents-for-comment` (plural, used in Q2 resolution and line 445) |
| M9 | "12 new CMS collections" count invalidated if Q2 merge resolution is applied (would be 11) |
| M10 | "36 new components" claimed but manual count yields 34 |
| M11 | Templates T6 and T7 unaccounted for in both PRDs — numbering gap unexplained |
| M12 | Event Registration form has "Blank Notion spec — needs design" but claimed to share same UI as other 2 member-only forms. Register, Forgot Username, Forgot Password identified as separate pages but have no template specs |

### Build Plans (3 medium issues)

| # | Issue |
|---|-------|
| M13 | Phase 1 task count: summary table says 59, actual count is **58** (Epic 0 listed as 6 tasks, only has 5) |
| M14 | Phase 2 header says Phase 1 has "54 tasks" — actual is 58. CLAUDE.md and MEMORY.md also say "54 tasks" and "117 total" — all stale |
| M15 | Combined total: stated 132, actual is **131** (58 + 73) |

### Supporting Docs (3 medium issues)

| # | Issue |
|---|-------|
| M16 | `site-discovery-verified.md` Section 1.4 says "12" standards section overview pages — contradicts "11" everywhere else in same file |
| M17 | `research-resolution-open-questions.md` Q2 (translation source) still shows as open action item — resolved in PRD-translation.md |
| M18 | `consolidated-gaps-report.md` open questions count says "14 total" but Part 8 added Q15-Q21, making true total 21 |

### Design Docs (6 medium issues)

| # | Issue |
|---|-------|
| M19 | Search facet categories differ: 5 in wireframes (Board, Standard, Files & Media, Content Type, Date) vs 3 in Notion (Board, Content Type, Date Range) |
| M20 | Search Modal: full component spec in wireframes, but Notion questions "what purpose does a modal serve?" — unresolved |
| M21 | Dark purple CTA color: `~rgb(50,20,50)` in Phase 2 wireframes vs `#601F5B` in design-tokens.md — significantly different values |
| M22 | `SectionNav` vs `SectionNavSidebar` vs `SectionTabs` — 3 names for overlapping navigation components |
| M23 | `consultations` (Phase 1) vs `document-for-comment` (Phase 2) vs `document-detail` (Phase 2) — overlapping collections, no reconciliation |
| M24 | `resources` (Phase 2) vs `documents` (Phase 1) + `meetings` (Phase 2) vs `events` + `decision-summaries` (Phase 1) — collection splits/merges undocumented |

---

## LOW Severity Issues (47)

### PRD.md (11 low issues)

- L1: Source file references use bare filenames — `site-discovery-verified.md` and `wireframe-vs-live-gap-analysis.md` are actually in `dogfood-frascanada/` subdirectory
- L2: "Save Search Alert" — resolved as wireframe invention but not tracked anywhere as a Phase 2 feature item
- L3: "Oversight Council" in About Us mega-menu — never clarified as RASOC
- L4: No Table of Contents
- L5: No Risk Register section
- L6: No Testing Strategy section
- L7: `pages` collection defined but never referenced by Phase 1 page specs
- L8: Open Question heading still says "Open Questions" despite all being resolved
- L9-L11: Minor formatting/reference issues

### PRD-phase2.md (5 low issues)

- L12: Section heading says "Critical Open Questions" but all 10 are resolved
- L13: Phase 2 tech stack omits Meilisearch (present in Phase 1)
- L14: "Effective Dates" uses "13 total sections" (date-group headers) vs "11 sections" (standards pages) — same word, different meanings
- L15: Contact Us form stores data but member-only forms say "no storage" — distinction implicit, never explicitly justified
- L16: "NextAuth.js" mentioned for session management — potentially misleading given Aptify is not OAuth-based

### Build Plans (3 low issues)

- L17: Epic 19 skipped in Phase 2 numbering (jumps from 17 to 20, then 18 after 20)
- L18: Phase 1 dependency graph text says "Epic 8 reuses Epic 7 project card" but Epic 8 builds its own `<ProjectCard />`
- L19: Epic count: 20 total epics (0-10 + 11-18,20-21) but CLAUDE.md says "19 epics"

### Supporting Docs (8 low issues)

- L20: `consolidated-gaps-report.md` status header claims "PRDs and Build Plans updated" but own content has stale search info
- L21: Translation PRD proposes 10 new tasks not counted in 132 revised total
- L22: 12 Sitecore templates vs 17 rebuild templates — distinction never explained
- L23: CAS/CASS conflated as single mega-menu link in Q1 research but are 2 separate standards sections
- L24: `Phase 3 URL count "~2,090 (1,069 EN + 1,015 FR)" — math is 2,084, not 2,090
- L25: `PRD-translation.md` Epic 20 reference extends beyond documented 19-epic scope
- L26-L27: Minor formatting issues

### Design Docs (20 low issues)

- L28: T6 coverage status ambiguous — partially covered by Phase 1, not in Phase 2 list
- L29: `contacts` collection defined twice with different field names (`role` vs `title`)
- L30: `#f9f9f9` row alt background not in design-tokens.md (closest: `#F5F5F5` or `#F8F8F8`)
- L31: `#f0f0f0` group header background not in design-tokens.md
- L32: RASOC appears in volunteer tabs (Phase 2) but not board nav sidebar (Phase 1)
- L33: HubSpot integration in Notion not captured in wireframe specs
- L34: `wireframe-vs-live-gap-analysis.md` is stale — still says "13 templates uncovered" when all 13 now have Phase 2 wireframes
- L35: Quick Actions = Quick Links consolidation from Notion not reflected in Phase 1 component inventory
- L36-L47: Additional minor naming, formatting, and reference issues

---

## Meta File Staleness

The following meta files contain stale numbers and should be updated:

| File | Stale Claim | Should Be |
|------|-------------|-----------|
| `CLAUDE.md` | "54 tasks" for Phase 1 | 58 tasks |
| `CLAUDE.md` | "63 tasks" for Phase 2 | 73 tasks |
| `CLAUDE.md` | "117 implementation tasks across 19 epics" | 131 tasks across 20 epics |
| `MEMORY.md` | "Phase 1: 54, Phase 2: 63" | Phase 1: 58, Phase 2: 73 |
| `MEMORY.md` | "Total scope: 117 tasks across 19 epics" | 131 tasks across 20 epics |

---

## Recommended Fix Priority

### Must fix before implementation (HIGH + critical MEDIUM):
1. **H1-H2:** Update stale resolutions in consolidated-gaps-report.md and research-resolution-open-questions.md
2. **H3:** Decide: two document collections or one? Update PRD-phase2.md accordingly
3. **H4:** Add RASOC to boards collection
4. **H5:** Clarify Project Timeline stage count with design team
5. **M2:** Clarify Hero search scope (project-only vs sitewide)
6. **M4:** Add 6 missing components to PRD.md Section 6
7. **M13-M15:** Fix task counts across all files
8. **M23-M24:** Reconcile collection naming across Phase 1 and Phase 2

### Should fix before implementation (remaining MEDIUM):
9. **M1, M3, M6, M7-M12, M16-M22:** All medium issues above

### Can fix during implementation (LOW):
10. All LOW issues — cosmetic, naming, and reference fixes

---

*Audit completed 2026-03-05. 14 files audited across 5 parallel passes.*
