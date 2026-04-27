# RAS Canada — Discovery Sanity Check
**Date:** 2026-04-27
**Purpose:** Cross-reference all discovery materials, proposals, wireframes, and brand guidelines against our existing build plan to identify gaps, contradictions, and missing requirements before starting custom module work.

**Sources audited:**
- Notion: FRAS Discovery, RAS Overview (with 53 subpages), Tech/Misc Queries, Proposal Overview, Discovery Phase (sub-docs), CPA/FRAS Document Database
- Figma: Wireframes file `dMkgM4J5SXwonklEUyM1qs` (node 103:11785)
- Local: Brand Guidelines PDF (17 pages), all PRDs, BUILD_PLANs, MASTER_TODO, design tokens, component registry, consolidated gaps report
- Google Docs: RFP Brief + SOW — **NOT ACCESSIBLE** (needs OAuth via `/mcp`)

---

## 1. CRITICAL — Needs Resolution Before Building

### 1.1 Platform Commitment Unresolved
The Notion "RAS Overview" spec says the site will be "maintained in Sitecore XM (SXA Headless) and rendered through a Next.js front-end framework." All our planning uses Payload CMS. The Notion text appears to be early-stage notes that predate the Payload decision, but this has never been explicitly confirmed with the client in any accessible document. The RFP Brief (inaccessible Google Doc) likely contains the answer.

**Risk:** If the client's RFP specifies Sitecore XM as the required platform, all Payload CMS work is proposal material, not deliverable material.

**Action:** Confirm with Dan/Jeff whether Payload CMS has been accepted by the client. Access the RFP Brief via Google Drive OAuth.

### 1.2 No RAS Brand Guidelines Locally
Only the 2017 FRAS brand guidelines exist locally. The Notion notes say "Logo & Guidelines complete. August [2025] for design system work/approval." By now (April 2026) the RAS brand guidelines should be finalized. They are likely in the Google Drive folder we can't access.

**Risk:** Our design tokens may be based on obsolete FRAS branding. CSSB has no brand color defined anywhere (didn't exist in 2017).

**Action:** Access Google Drive via OAuth. Retrieve the RAS brand guidelines. Update design-tokens.md.

### 1.3 Different Figma File Than Specs Reference
Our `wireframe-specs.md` references file `3DK2vb90O9421OaYmAsJJd` ("FRAS-2025-07-22"). The hackathon links to `dMkgM4J5SXwonklEUyM1qs` ("Wireframes"). These are different files. Canvas layout appears consistent (~20 frames) but frame-level verification is needed.

**Action:** Have someone with Figma access confirm whether the new file has updates or RAS rebrand changes.

### 1.4 Proposal Told Client: NO Visual Page Builder
Direct quote from proposal: "This is a deliberate shift away from visual page editing and component-based page construction." Our page builder (Epics 25-26) is an over-delivery — a competitive differentiator for the pitch, not something the client was promised.

**Implication:** Position the page builder as exceeding expectations, not as delivering on a commitment.

### 1.5 Algolia/Clerk → Meilisearch/Aptify — Client May Not Know
The proposal specifies Algolia (~$100/mo) and Clerk (~$100/mo). Our build uses Meilisearch (free, self-hosted) and direct Aptify API. Both changes were made post-proposal. Budget impact: removes ~$200/mo ongoing cost. Client may have different expectations.

**Action:** Confirm with Dan whether the client was informed of these substitutions.

### 1.6 Google Docs Still Inaccessible
The RFP Brief (`13yb2U1H17HUsEzm1yAEaw8mXXBcWHFZt`) and SOW draft folder (`1PamWslzTzKPPLC9hB6yz6XqzQdXmXw6i`) both require Google OAuth. These likely contain contractual commitments, platform requirements, timeline constraints, and security scanning thresholds.

**Action:** Run `/mcp` in Claude.ai → authenticate "claude.ai Google Drive" → re-fetch these documents.

---

## 2. HIGH — Scope Gaps

### 2.1 EngagementHQ for PSAB (NOT in any PRD)
Discovery links to `connect.frascanada.ca` — a third-party stakeholder engagement platform (EngagementHQ) used by PSAB for Exposure Draft consultation. The conclusion in tech notes: "this integration is not possible right now." Our plan replaces it with form-to-email, but the client raised it as a wish-list item.

**Action:** Confirm with client whether EngagementHQ integration is in scope or explicitly out of scope.

### 2.2 Working Group Content Restrictions
Discovery mentions "Content Access Restrictions by Working Groups." Our plan says all content is freely available except 3 member-only forms (True/False membership gate). Working group-based access restrictions are a materially different capability.

**Action:** Confirm with client: is content gating per-working-group, or just binary member/non-member?

### 2.3 Aptify Write-Back from Forms
Discovery confirms FRAS forms currently **populate Aptify** (volunteer applications, newsletter subscriptions). Our plan says "form to email, no storage." If the client expects Aptify write-back to be maintained, Epic 17 (Auth) is under-scoped.

**Action:** Confirm: do the 3 member-only forms need to write back to Aptify, or just send email?

### 2.4 My Account / Member Dashboard — No Epic
`/my-account` exists on the live site. No epic in Phase 1 or Phase 2 covers the logged-in member dashboard. At minimum: newsletter preferences, access to the 3 gated forms, profile management.

**Action:** Add to Phase 2 scope or explicitly exclude.

### 2.5 Training Epic Missing
Proposal includes a $5K training budget line. No training epic exists in the 20-epic plan.

**Action:** Add Epic 27 (Training) or append to Phase 2.

### 2.6 Multi-Attachment on Document Comment Form
Tech Queries doc: "Desire is to include more than one document." Our Task 20.8 specs a single file upload.

**Action:** Update Task 20.8 to support multiple file attachments.

### 2.7 Confirmation Emails to Submitters
Tech Queries doc: "Need confirmation Email." Our spec sends email to FRAS staff but not back to the submitter. Standard UX expectation for all 3 member-only forms.

**Action:** Add confirmation email to Tasks 20.6, 20.7, 20.8.

### 2.8 SAST/DAST Security Scanning
Discovery notes: "SAST and DAST scans (and subsequent remediation) have proven to be a challenge." Client's InfoSec team wants specific vulnerability thresholds. Not in any PRD.

**Action:** Add to NFRs as a process requirement and risk item.

### 2.9 Newsletter Subscription Management
Member Login Walkthrough confirms subscribers manage preferences via FRAS (linked to HubSpot CRM). No epic covers the "My Subscriptions" / newsletter management UI.

**Action:** Add to Phase 2 (possibly part of My Account epic).

### 2.10 True SSO Across CPA Properties
Client wants cross-site SSO (FRAS, eStore, cpacanada.ca). Our plan is FRAS-only Aptify integration. This is correctly scoped as a future-phase item, but should be explicitly acknowledged.

**Action:** Document as Phase 3+ / separate engagement.

### 2.11 Two Migration Cycles
Tech notes: "Plan for 2 full migrations." Current plan has one migration phase. Two cycles = staging/QA migration + production migration, roughly doubling effort.

**Action:** Update Phase 3 migration plan to reflect dual migrations.

---

## 3. COMPONENT REGISTRY — 18 Missing + 6 Fixes

### 3.1 Missing Components (from Notion specs + Figma)

| Component | Source | Priority | Description |
|---|---|---|---|
| `project-timeline` | Notion: New Components | HIGH | 7-stage stepper, tri-state (complete/in-progress/not-started) |
| `quick-links` | Notion: Right Rail Quick Links + Project Actions | HIGH | Same component for Board Detail + Project Detail right rails |
| `page-header` | Notion: Page Header + Breadcrumb | HIGH | Breadcrumb derived from content tree + page title |
| `news-card-widget` | Notion: News Card | HIGH | Homepage 3-up, auto-populated + manual override, View All CTA |
| `drafts-card` | Notion: Drafts Card | HIGH | Homepage 3-up, exposure drafts, Due Date field |
| `events-card` | Notion: Events Card | HIGH | Homepage 3-up, Start Time (webinar-only conditional) |
| `promo-card-grid` | Notion: Promo Card Grid | HIGH | Homepage-only 4-column board link grid |
| `news-events-grid` | Figma: Homepage | HIGH | 3-panel homepage widget (News / Drafts / Events) |
| `browse-by-standard` | Figma: Homepage | MEDIUM | 4-column standard categories |
| `right-rail-events-list` | Notion: Right Rail Events List | MEDIUM | Sidebar events widget, curated |
| `right-rail-resource-list` | Notion: Right Rail Resource List | MEDIUM | Sidebar resources, auto-icon by content type |
| `subscribe-banner` | Notion: Subscribe Banner | MEDIUM | Full-width HubSpot + LinkedIn; distinct from newsletter-signup |
| `event-summary-table` | Notion: Event Summary Table | MEDIUM | Replica of meeting summary table |
| `member-action-form` | Notion: 3 Member-Only Forms | MEDIUM | Shared UI for DFC Submit, Event Reg, Volunteer Reg |
| `category-pills` | Figma: Listing Pages | MEDIUM | Horizontal pill filter tabs (Open/Closed toggle) |
| `anchor-nav` | Figma: Template 14 (Committees) | MEDIUM | Scroll-spy table of contents |

### 3.2 Fixes Needed in Existing Components

| Component | Issue |
|---|---|
| `hero-banner` | Missing `showProjectSearch` checkbox + `searchPlaceholder` text |
| `cta-banner` | Missing `backgroundImage` media field |
| `consultation-countdown` | Wrong `relationTo: 'consultations'` → should be `'document-for-comment'` |
| `project-list` | Missing `deferred` in `statusFilter` options |
| `event-calendar` | Missing `decision-summary` in `eventTypeFilter` options |
| `newsletter-signup` | Missing `linkedinUrl` text field |
| `contact-card` | Missing `layout: 'sidebar-sticky'` variant + multi-contact array |
| `board-members-grid` | Missing `groupByRole` boolean for Chair/Vice-Chair/Voting section labels |
| `document-table` | Missing `grouping: 'by-type'` + `showGroupHeaders` boolean |

### 3.3 Zone Architecture Gap
All 31 components have `allowedZones: []` (allowed everywhere). Wireframes show clear right-rail-only components. The `allowedZones` constraint system exists but is unused. Right rail components should be restricted to sidebar zones.

---

## 4. DESIGN TOKEN GAPS

### 4.1 Missing Color Tokens (from 2017 Brand Guidelines)
These are documented in `sitecore-dump-analysis.md` but NOT in `design-tokens.md`:

```css
--color-brand-councils: #00438C;        /* Blue — oversight councils */
--color-brand-councils-tint: #7986B9;   /* Blue 50% tint */
--color-brand-boards: #983232;          /* Red-brown — AcSB/AASB/PSAB */
--color-brand-boards-tint: #C98578;     /* Red-brown 50% tint */
--color-brand-gray: #A7A9AB;            /* Supporting neutral gray */
```

### 4.2 Minor Discrepancy
Brand spec dark gray is `#323232`. Our token uses `#333333`. Technically different by 1 RGB unit. Imperceptible on screen.

### 4.3 CSSB Color — Undefined
CSSB (Canadian Sustainability Standards Board) did not exist in 2017. No brand color has been defined for it in any local document. Needs to be sourced from the client or the live site.

### 4.4 RASOC Consolidation
2017 guide shows AASOC + AcSOC as two separate oversight councils. These were later consolidated into RASOC. Brand guidelines haven't been updated to reflect this.

---

## 5. FRAS → RAS NAMING AUDIT

### 5.1 Pervasive Usage of "FRAS" That Needs Updating

| Location | Current | Should Be |
|---|---|---|
| `PRD.md` title + throughout | "FRAS Canada" | "RAS Canada" |
| `PRD-phase2.md` | "FRAS Canada" | "RAS Canada" |
| `BUILD_PLAN.md` title | "FRAS Canada" | "RAS Canada" |
| `MASTER_TODO.md` title | "FRAS Canada" | "RAS Canada" |
| Homepage hero copy (PRD §4.1) | "Canada's Official Hub for Financial Reporting Standards" | Updated to reflect RAS rebrand |
| "New to FRAS?" CTA (PRD §4.2) | "New to FRAS?" | "New to RAS?" |
| Footer org name (PRD §3.1) | "FRAS Canada" | "RAS Canada" |
| Copyright text | "© 2025 FRAS Canada" | "© 2026 RAS Canada" |
| CLAUDE.md project overview | Mixed (correctly notes rebrand) | Consistent RAS usage |
| Wireframe specs | "FRAS" throughout | Depends on whether Figma file was updated |
| Seed data / CMS content | "FRAS" references | "RAS" |

### 5.2 What's Correctly Documented
- CLAUDE.md has the full French name mapping (FRAS→NIFC, AcSB→CNC, etc.)
- RASOC rules are correctly documented
- The proposal uses "RAS Canada" throughout

### 5.3 French Equivalent for "RAS"
The French brand name for RAS has not been documented. FRAS→NIFC (Normes d'information financière et de certification) is documented, but RAS→??? needs confirmation.

---

## 6. ARCHITECTURAL INSIGHTS

### 6.1 Page Builder Scope
The page builder is primarily relevant for: Homepage, Board Pages, Project Detail, Standard Pages, and flexible content pages. Listing pages (T8–T13) follow fixed collection-driven templates and do NOT need the visual builder — they are data-driven.

### 6.2 Single Editable Zone Precedent
Sitecore's pattern was one `mainContent` placeholder with 11 allowed controls. The proposal sold Payload as structured content, not visual editing. Our multi-zone builder exceeds this — which is good for the pitch.

### 6.3 Board-First vs Content-First IA Tension
Discovery explicitly notes: "New architecture is not reflected in wireframe — still very much categorized by Board vs Content Type." The wireframes show board-scoped navigation; the client's stated goal is content-type-first centralized listing. Our Phase 2 listing templates address this, but the Board Detail page still reflects the old IA.

### 6.4 Decision Summaries Confirmed as Separate Content Type
NOT a sub-type of Events. Needs its own listing page route, its own collection, and explicit admin sidebar entry.

### 6.5 Multi-Board Tagging Required
Discovery flagged "no way to tag multiple things" as a pain point. Collections (`news`, `projects`, `events`) must support hasMany relationships to boards and standards, not just single belongsTo.

### 6.6 Subscribe Banner as Reusable Field
Subscribe/submit banners appear across many page types (research programs, board pages, standards). The CMS needs a reusable `show_subscribe_banner` field on the `pages` collection, not just a page-builder block.

---

## 7. PROPOSAL BUDGET CONTEXT

| Line Item | Budget | Notes |
|---|---|---|
| Website Dev | $175K–$250K | Core build |
| Design | $20K | Light, code-first (no separate Figma design phase) |
| Content Migration | $20K–$30K | Phase 3, plan for 2 full migrations |
| Search Integration | ~$20K | Carved from dev budget |
| Training | ~$5K | No epic exists for this |
| Infrastructure | ~$300/mo | Vercel + Algolia + Clerk (now Meilisearch + Aptify = ~$100/mo) |
| **Total** | **$250K–$280K CAD** | Fixed fee, not T&M |

One design review cycle per page is in scope. Additional cycles are change requests.

---

## 8. NEXT STEPS

### Immediate (before grill / module work)
1. [ ] Authenticate Google Drive via `/mcp` — access RFP Brief and SOW
2. [ ] Confirm with Dan/Jeff: Payload CMS accepted by client?
3. [ ] Confirm Algolia→Meilisearch and Clerk→Aptify were communicated
4. [ ] Verify Figma file change — is the new file an update or separate version?

### Before Implementation
5. [ ] Retrieve RAS brand guidelines from Drive — update design tokens
6. [ ] Get CSSB brand color from client
7. [ ] Confirm with client: Working Group gating vs binary member gate
8. [ ] Confirm: Aptify write-back from forms in scope?
9. [ ] Confirm: EngagementHQ in scope or explicitly excluded?
10. [ ] Confirm: reCAPTCHA v2 checkbox or v3 invisible?

### Build Plan Updates
11. [ ] Add 16 missing components to registry
12. [ ] Fix 9 existing component issues
13. [ ] Add Training epic
14. [ ] Add My Account / Member Dashboard epic
15. [ ] Add multi-attachment to DFC form spec
16. [ ] Add confirmation emails to all 3 member forms
17. [ ] Add SAST/DAST to NFRs
18. [ ] Update all FRAS→RAS naming in PRDs and build plans
19. [ ] Add missing color tokens to design-tokens.md
20. [ ] Document True SSO as Phase 3+ item
