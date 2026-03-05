# FRAS Canada — Translation PRD (AI-Assisted Bilingual Workflow)

**Date:** 2026-03-04
**Status:** APPROVED — all 6 decisions resolved, ready for implementation
**Phase:** Phase 2 (Epic 20 — Translation Workflow) + Phase 3 (Content Migration)
**Approach:** AI-assisted (Claude API) + manual trigger + dual approval workflow (CMS + external)

---

## 1. Problem Statement

The live FRAS Canada site is a full EN/FR mirror (1,069 EN URLs, 1,015 FR URLs). The rebuild must maintain bilingual parity. The CMS infrastructure is designed (Payload i18n plugin, `[locale]` routing, slug mapping) — but **no workflow exists for producing, reviewing, and publishing French content.**

This PRD defines an AI-assisted translation workflow that:
- Minimizes manual translation effort and cost
- Maintains terminology consistency across ~2,500 content items
- Integrates directly into the Payload CMS editorial flow
- Handles both net-new content creation and Phase 3 content migration

---

## 2. Content Volume

| Content Type | EN Items | Fields Requiring Translation | Complexity |
|---|---|---|---|
| News items | ~1,010 | title, excerpt, body (richText), slug | Medium — body varies from 1 paragraph to 2,000+ words |
| Meetings & Events | ~900 | title, excerpt, body (richText), slug | Low — mostly structured/short |
| Projects | ~100 | title, summary, body, slug, status labels | Medium |
| Documents for Comment | ~50 | title, highlights, body, comment questions, how-to-reply block, slug | High — legal/technical language |
| Resources | ~100 | title, excerpt, body/description, slug | Low-Medium |
| Board/Council pages | 5 | name, about text, contact info | Low |
| Standards overview pages | 11 | name, tab labels, CTA text | Low |
| Member bios | ~50 | credentials, role labels | Low — mostly proper nouns |
| Committee descriptions | ~25 | name, description (richText) | Low-Medium |
| Effective dates tables | 11 | intro, section headers, footnotes | High — regulatory precision required |
| Static/general pages | ~50 | title, body (richText) | Medium |
| UI strings | ~150 strings | nav labels, buttons, errors, empty states, form labels, filter labels | Low — one-time, small volume |
| **Total** | **~2,500 items** | | |

**Estimated word count:** ~500,000–750,000 words across all content (based on average article length of 200–300 words × 2,500 items, plus long-form documents and rich text pages).

---

## 3. Translation Source Options

### Option A: Client Team (Manual)

| Aspect | Detail |
|--------|--------|
| Who | FRAS/CPA Canada internal bilingual staff |
| Workflow | Author FR content directly in Payload admin panel locale switcher |
| Pros | Full editorial control, domain expertise, no external cost |
| Cons | Slow for ~2,500 items, bottleneck on staff availability, no automation |
| Best for | Ongoing content (new news articles, project updates) |

### Option B: Professional Translation Vendor (Batch)

| Aspect | Detail |
|--------|--------|
| Who | External translation agency (e.g., Translated, Lionbridge, local Canadian vendor) |
| Workflow | Export EN content → vendor translates → import FR via batch pipeline |
| Pros | High quality, domain glossary support, scalable |
| Cons | Cost ($0.10–0.25/word = $50K–$187K for full corpus), turnaround time, review cycles |
| Best for | Phase 3 migration backfill of existing content |

### Option C: AI-Assisted + Human Review (Recommended)

| Aspect | Detail |
|--------|--------|
| Who | AI model (Claude) generates draft → bilingual reviewer approves/edits |
| Workflow | Automated pipeline: extract EN → AI translate → stage in Payload FR locale → human review queue |
| Pros | 80-90% cost reduction vs vendor, fast throughput, consistent terminology via glossary, integrates with CMS |
| Cons | Requires bilingual reviewer for quality gate, regulatory/legal content needs extra scrutiny |
| Best for | Both migration backfill AND ongoing content creation |

**Decision: Option C confirmed.** AI translation acceptable for all content types including regulatory. Manual trigger (no auto-translate on save). Dual approval: CMS reviewers + external reviewers via notification workflow (details TBD, CMS-only for PoC). FR content is Phase 2 — not needed for Phase 1 launch.

---

## 4. AI Translation Workflow Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CONTENT CREATION                   │
│                                                     │
│  Author writes EN content in Payload CMS            │
│  └─→ Saves to EN locale                            │
│       └─→ Triggers translation job (webhook/hook)   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   AI TRANSLATION                     │
│                                                     │
│  Translation Service (API route or background job)   │
│  ├── Loads domain glossary (FRAS terminology)        │
│  ├── Loads style guide (Canadian French conventions)  │
│  ├── Sends EN content to Claude API                  │
│  │   ├── System prompt: glossary + style rules       │
│  │   ├── Input: EN field values (structured)         │
│  │   └── Output: FR field values (same structure)    │
│  ├── Generates FR slug from title (or uses mapping)  │
│  └── Writes draft to Payload FR locale               │
│       └─→ Sets status: "pending_review"              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   HUMAN REVIEW                       │
│                                                     │
│  Bilingual reviewer opens Payload admin              │
│  ├── Filters by status: "pending_review"             │
│  ├── Side-by-side EN/FR view                         │
│  ├── Edits FR content as needed                      │
│  └── Sets status: "approved" → publishes FR locale   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.1 Translation Service Components

| Component | Description | Location |
|-----------|-------------|----------|
| `translate-content.ts` | Core translation function — accepts EN fields, returns FR fields | `src/lib/translation/` |
| `glossary.json` | FRAS domain terminology (EN→FR pairs, do-not-translate terms) | `src/lib/translation/` |
| `style-guide.md` | Canadian French conventions, tone, formatting rules | `src/lib/translation/` |
| `POST /api/translate` | API route — accepts collection slug + document ID, triggers translation | `app/api/translate/` |
| Payload `afterChange` hook | Auto-triggers translation when EN content is saved (configurable) | Collection hooks |
| `translation-status` field | Enum field on all collections: `untranslated`, `pending_review`, `approved` | Payload field |
| Batch translate script | CLI script for Phase 3 migration bulk translation | `scripts/batch-translate.mjs` |

### 4.2 Domain Glossary (Stub)

The glossary ensures consistent terminology across all translations. This is the most critical artifact for quality.

```json
{
  "terms": [
    { "en": "Accounting Standards Board", "fr": "Conseil des normes comptables", "abbr_en": "AcSB", "abbr_fr": "CNC" },
    { "en": "Public Sector Accounting Board", "fr": "Conseil sur la comptabilité dans le secteur public", "abbr_en": "PSAB", "abbr_fr": "CCSP" },
    { "en": "Auditing and Assurance Standards Board", "fr": "Conseil des normes d'audit et de certification", "abbr_en": "AASB", "abbr_fr": "CNAC" },
    { "en": "Canadian Sustainability Standards Board", "fr": "Conseil canadien des normes d'information sur la durabilité", "abbr_en": "CSSB", "abbr_fr": "CCNID" },
    { "en": "Regulatory and Assurance Standards Oversight Council", "fr": "Conseil de surveillance de la normalisation en information et en certification", "abbr_en": "RASOC", "abbr_fr": "CSNIC" },
    { "en": "IFRS Accounting Standards", "fr": "Normes IFRS de comptabilité" },
    { "en": "Accounting Standards for Private Enterprises", "fr": "Normes comptables pour les entreprises à capital fermé", "abbr_en": "ASPE", "abbr_fr": "NCECF" },
    { "en": "Not-for-Profit Organizations", "fr": "Organismes sans but lucratif à des fins particulières", "abbr_en": "NFPOs", "abbr_fr": "OSBLSP" },
    { "en": "Public Sector Accounting Standards", "fr": "Normes comptables pour le secteur public", "abbr_en": "PSAS" },
    { "en": "Canadian Standards on Quality Management", "fr": "Normes canadiennes de contrôle de la qualité", "abbr_en": "CSQM", "abbr_fr": "NCCQ" },
    { "en": "Canadian Auditing Standards", "fr": "Normes canadiennes d'audit", "abbr_en": "CAS", "abbr_fr": "NCA" },
    { "en": "Document for Comment", "fr": "Document de consultation" },
    { "en": "Exposure Draft", "fr": "Exposé-sondage" },
    { "en": "Effective Date", "fr": "Date d'entrée en vigueur" },
    { "en": "Consultation Paper", "fr": "Document de consultation" },
    { "en": "Discussion Paper", "fr": "Document de travail" },
    { "en": "Chair", "fr": "Président(e)" },
    { "en": "Vice-Chair", "fr": "Vice-président(e)" },
    { "en": "Voting Member", "fr": "Membre votant(e)" },
    { "en": "CPA Canada", "fr": "CPA Canada", "doNotTranslate": true },
    { "en": "IFRS", "fr": "IFRS", "doNotTranslate": true },
    { "en": "IASB", "fr": "IASB", "doNotTranslate": true },
    { "en": "ISSB", "fr": "ISSB", "doNotTranslate": true },
    { "en": "IPSASB", "fr": "IPSASB", "doNotTranslate": true }
  ],
  "doNotTranslate": [
    "CPA Canada",
    "IFRS",
    "IASB",
    "ISSB",
    "IPSASB",
    "IAASB",
    "FRAS Canada"
  ]
}
```

> **TODO:** Extract full glossary from live site FR content during Phase 3 extraction. Compare EN/FR versions of the same pages to build a comprehensive term-pair database.

### 4.3 AI System Prompt (Stub)

```
You are a professional Canadian French translator specializing in accounting
standards, public sector auditing, and financial reporting. You are translating
content for FRAS Canada (formerly known as RAS), the organization that oversees
Canadian standard-setting boards.

RULES:
1. Use Canadian French (not European French) — e.g., "courriel" not "e-mail"
2. Preserve all HTML/rich text formatting tags exactly as-is
3. Do NOT translate terms in the glossary marked "doNotTranslate"
4. Use the exact FR equivalents from the glossary for all listed terms
5. Preserve proper nouns (person names, organization names) unless they have
   an official FR form in the glossary
6. URLs, email addresses, phone numbers, and dates must not be translated
7. Maintain the same tone: formal, professional, authoritative
8. For legal/regulatory text, prioritize precision over readability
9. Output must be valid JSON matching the input field structure exactly

GLOSSARY:
{glossary}

INPUT FORMAT: JSON object with field names as keys, EN text as values
OUTPUT FORMAT: Same JSON structure with FR translations as values
```

---

## 5. Field-Level Translation Matrix

### Fields That MUST Be Translated

| Field Type | Collections | Translation Method |
|-----------|-------------|-------------------|
| `title` (text) | All collections | AI + review |
| `body` / `content` (richText) | news, projects, documents, meetings, pages, committees | AI + review |
| `excerpt` / `summary` (text) | news, projects, documents | AI + review |
| `highlights` (richText) | documents-for-comment | AI + review (regulatory precision) |
| `description` (richText) | committees, standards-sections | AI + review |
| `introText` (richText) | effective-dates | AI + review (regulatory precision) |
| `commentQuestions[].questionText` | documents-for-comment | AI + review |
| `howToReply.body` (richText) | documents-for-comment | AI + review |
| `emptyStateMessage` (richText) | job-postings | AI + review |
| `ctaBlock.heading/description/buttonLabel` | various | AI + review |
| `roleLabel` (text) | board-members | Glossary lookup (CHAIR→PRÉSIDENT) |
| `slug` (text) | All collections | Mapping table or AI-generated from FR title |

### Fields That MUST NOT Be Translated

| Field Type | Reason |
|-----------|--------|
| `email` | Email addresses are language-neutral |
| `phone` | Phone numbers are language-neutral |
| `url` / `externalUrl` | URLs are structural, not content |
| `date` / `publishDate` / `closingDate` | Dates are language-neutral (formatting handled by i18n library) |
| `photo` / `image` | Media assets shared across locales |
| `status` (enum) | Internal CMS state |
| `sortOrder` (number) | Display logic |
| `board` (relationship) | Structural relationship |

### Fields With Special Handling

| Field | Handling |
|-------|---------|
| `slug` | Use `fr-slug-mapping.md` for known paths. For content slugs (news, meetings), generate from FR title via `slugify()`. |
| `name` (board-members) | Proper nouns — do NOT translate. Credentials (CPA, CA, CFA) are language-neutral. |
| `roleLabel` | Use glossary: CHAIR→PRÉSIDENT(E), VICE-CHAIR→VICE-PRÉSIDENT(E) |
| `tabLabels[]` | Use glossary: OVERVIEW→APERÇU, PROJECT LISTING→LISTE DES PROJETS, etc. |
| Rich text with embedded links | Translate link text, preserve href unless it's a known EN→FR URL mapping |

---

## 6. UI Strings Translation

All UI chrome (navigation, buttons, labels, errors, empty states) is managed via `messages/en.json` and `messages/fr.json`.

### Stub: `messages/en.json`

```json
{
  "nav": {
    "home": "Home",
    "boards": "Boards",
    "standards": "Standards",
    "news": "News",
    "search": "Search",
    "login": "Login",
    "language": "FR"
  },
  "filters": {
    "allItems": "All Items",
    "documentForComment": "Document for Comment",
    "internationalActivity": "International Activity",
    "meetingSummary": "Meeting Summary",
    "news": "News",
    "resource": "Resource",
    "sortBy": "Sort By",
    "newest": "Publication date: Newest",
    "oldest": "Publication date: Oldest",
    "itemsPerPage": "Items per page",
    "dateRange": "Date Range",
    "startDate": "Start Date",
    "endDate": "End Date"
  },
  "pagination": {
    "previous": "Previous",
    "next": "Next",
    "page": "Page",
    "of": "of"
  },
  "search": {
    "placeholder": "Search FRAS Canada...",
    "noResults": "No results found for \"{query}\"",
    "resultsCount": "Results {start}-{end} of {total}",
    "saveAlert": "Save Search Alert"
  },
  "forms": {
    "fullName": "Full Name",
    "email": "Email Address",
    "subject": "Subject",
    "message": "Your Message",
    "submit": "Submit",
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address"
  },
  "auth": {
    "login": "Log in",
    "username": "User Name (email address):",
    "password": "Password:",
    "forgotUsername": "Forgot your User Name?",
    "forgotPassword": "Forgot your Password?",
    "register": "Create My account",
    "notRegistered": "Not registered yet?"
  },
  "empty": {
    "noJobs": "Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!",
    "noProjects": "There are currently no active projects",
    "noResults": "No items match your current filters"
  },
  "labels": {
    "highlights": "Highlights",
    "whenToReply": "When to Reply",
    "howToReply": "How to Reply",
    "supportMaterials": "Support Materials",
    "staffContacts": "Staff Contact(s)",
    "relatedNews": "Related News",
    "recentMeetings": "Recent Meetings",
    "activeProjects": "Active Projects",
    "upcomingEvents": "Upcoming Events",
    "viewAll": "View all",
    "readMore": "Read more",
    "backToProjects": "Back to projects"
  }
}
```

> **TODO:** Generate `messages/fr.json` by running the EN file through the AI translation pipeline with the FRAS glossary. Then have a bilingual reviewer validate all ~150 strings.

---

## 7. Phase 3 Migration: Bulk Translation Pipeline

For the ~2,500 existing content items being migrated from Sitecore:

### 7.1 Primary Path: Extract Existing FR Content

The live site already has FR content for most items. The migration pipeline should:

1. **Extract EN content** from live site (existing pipeline)
2. **Extract FR content** from live site using hreflang-paired FR URLs
3. **Import both** as Payload locale variants (EN + FR)
4. **Validate parity** — flag items where FR extraction failed or content differs structurally

**This is the preferred path** — existing human-translated FR content is higher quality than AI-generated. The AI pipeline is for:
- Items missing FR equivalents (~54 URL discrepancy)
- Net-new content created after migration
- UI strings and any newly added CMS fields not present on the live site

### 7.2 Fallback: AI Bulk Translation

For items without FR equivalents on the live site:

```bash
# Batch translate all untranslated items
node scripts/batch-translate.mjs --collection news --status untranslated --limit 100
node scripts/batch-translate.mjs --collection projects --status untranslated
node scripts/batch-translate.mjs --collection meetings --status untranslated
```

Script logic:
1. Query Payload for all items where FR locale is empty
2. For each item, send EN fields to translation service
3. Write FR fields to Payload FR locale with `translation-status: pending_review`
4. Log results: translated count, failed count, skipped count

### 7.3 Quality Gate

All AI-translated content enters a review queue before publishing:

| Review Priority | Content Type | Reviewer |
|----------------|-------------|----------|
| **Critical** | Documents for Comment, Effective Dates, Exposure Drafts | Domain expert (regulatory language) |
| **High** | Standards overview pages, Board/Council pages | Bilingual editor |
| **Medium** | News articles, Project pages | Bilingual editor |
| **Low** | Meeting summaries, Resource descriptions | Bilingual editor (batch review) |
| **Automated** | UI strings, slug generation, role labels | Glossary validation script |

---

## 8. Payload CMS Integration

### 8.1 Translate Button (Payload Admin UI — Manual Trigger)

Build a custom Payload admin component — a "Translate to FR" button in the document header:
1. Editor clicks "Translate to FR" button (no auto-translation on save)
2. Shows a loading spinner while Claude API processes
3. On success, switches to FR locale view with draft translation pre-filled
4. Sets `translationStatus: 'pending_review'`
5. Triggers approval notification (see 8.3)

### 8.3 Dual Approval Workflow

Two reviewer types, same status flow:

**Path A — CMS Reviewer (has Payload admin access):**
1. Reviewer logs into Payload admin
2. Navigates to Translation Review dashboard or directly to the document
3. Reviews FR content side-by-side with EN
4. Edits as needed, clicks "Approve" → sets `translationStatus: 'approved'`

**Path B — External Reviewer (no CMS access):**
1. When `translationStatus` is set to `pending_review`, a notification is sent (email or Teams — integration TBD)
2. Notification includes: document title, link to a read-only review page, approve/reject buttons
3. Review page shows side-by-side EN/FR content (public but unguessable URL with token)
4. Reviewer clicks "Approve" or "Request Changes" (with comment field)
5. Approve → sets `translationStatus: 'approved'` via API
6. Request Changes → sets `translationStatus: 'changes_requested'`, notifies editor

> **Note:** External approval workflow details (email vs Teams, notification templates, review page design) are **deferred for later planning**. For the PoC, CMS-based review (Path A) is sufficient.

### 8.4 Translation Status Field (Updated)

```typescript
{
  name: 'translationStatus',
  type: 'select',
  options: [
    { label: 'Untranslated', value: 'untranslated' },
    { label: 'AI Draft (Pending Review)', value: 'pending_review' },
    { label: 'Changes Requested', value: 'changes_requested' },
    { label: 'Approved', value: 'approved' },
  ],
  defaultValue: 'untranslated',
  admin: {
    position: 'sidebar',
  },
}
```

### 8.5 Review Dashboard

Build a Payload admin view — `/admin/translation-review` — that shows:
- All documents with `translationStatus: 'pending_review'` or `'changes_requested'`
- Filterable by collection, date, priority
- Side-by-side EN/FR view for each document
- "Approve" button sets `translationStatus: 'approved'`
- For PoC: CMS-based review only (Path A). External review (Path B) is a future enhancement.

---

## 9. Slug Generation Strategy

| Slug Type | Strategy | Example |
|-----------|----------|---------|
| Board slugs | Hardcoded mapping (5 pairs) | `acsb` → `cnc` |
| Standards slugs | Hardcoded mapping (9 pairs) | `sustainability` → `durabilite` |
| Council slugs | Hardcoded mapping (3 pairs) | `aasoc` → `csnac` |
| Path segments | Hardcoded mapping (11 pairs) | `members` → `membres` |
| Content slugs (news, meetings, projects) | Auto-generate from FR title via `slugify()` | "Rapport annuel 2025" → `rapport-annuel-2025` |
| Edge case: `search-results` | Same in both locales | `search-results` → `search-results` |

All hardcoded mappings are documented in `fr-slug-mapping.md` (89 pairs).

---

## 10. Cost Estimate

### AI Translation (Claude API)

| Model | Cost per 1M tokens | Est. tokens per item (EN+FR) | Est. total cost |
|-------|--------------------|-----------------------------|-----------------|
| Claude Haiku | $0.25 input / $1.25 output | ~2,000 input + ~2,000 output | ~$15–25 for full corpus |
| Claude Sonnet | $3 input / $15 output | ~2,000 input + ~2,000 output | ~$85–150 for full corpus |

**Recommendation:** Use Haiku for bulk migration (low-complexity items), Sonnet for regulatory/legal content (Documents for Comment, Effective Dates, Exposure Drafts).

### Human Review

| Reviewer | Rate | Est. hours | Est. cost |
|----------|------|-----------|-----------|
| Bilingual editor (bulk review) | $50–75/hr | 40–60 hrs | $2,000–4,500 |
| Domain expert (regulatory) | $100–150/hr | 10–20 hrs | $1,000–3,000 |

**Total estimated cost: $3,100–7,650** (vs $50K–$187K for full professional vendor translation)

---

## 11. Decisions (Resolved)

| # | Decision | Answer | Notes |
|---|----------|--------|-------|
| 1 | **Who is the bilingual reviewer?** | **All of the above** — some reviewers have direct CMS access, others use an external approval workflow (email/Teams notification with approve/reject links). Approval workflow details TBD — plan later. | Mixed reviewer pool: CMS-based + external notification-based |
| 2 | **Is AI translation acceptable for regulatory content?** | **Yes** — AI translation is acceptable for all content types including regulatory. Quality must be good. For this PoC/demo phase, AI translation is fine across the board. | No carve-outs needed for Documents for Comment, Effective Dates, etc. |
| 3 | **Auto-translate on save or manual trigger?** | **Manual trigger + approval** — editors click "Translate to FR" button explicitly. No auto-translation on save. All translations enter `pending_review` status and require explicit approval before publishing. | Prevents unwanted drafts, gives editors control |
| 4 | **FR content needed before Phase 2 launch?** | **No** — Phase 1 is EN-only. FR content is a Phase 2 deliverable. | No timeline pressure on translation workflow |
| 5 | **Glossary validation** | **Not a priority** — glossary stub is sufficient for PoC. Can be expanded organically as content is translated. | Will naturally improve during Phase 3 extraction |
| 6 | **Claude API account/model selection** | **Plan later** — will determine best model (Haiku vs Sonnet vs future models) during implementation. API billing to be set up as part of infrastructure. | Model selection can be a config value, not hardcoded |

---

## 12. Implementation Tasks

> **These tasks should be added to BUILD_PLAN-phase2.md as Epic 20 (Translation Workflow).**

| # | Task | Phase | Depends On | Est. Effort |
|---|------|-------|-----------|-------------|
| T1 | Create `translate-content.ts` core translation function with glossary | Phase 2 | Epic 18.2 | 2 days |
| T2 | Create `POST /api/translate` route (manual trigger, no auto-translate) | Phase 2 | T1 | 1 day |
| T3 | Add `translationStatus` field (`untranslated` / `pending_review` / `changes_requested` / `approved`) to all collections | Phase 2 | Epic 18.2 | 0.5 days |
| T4 | Create `messages/fr.json` UI strings file (AI-translate from en.json + review) | Phase 2 | Epic 18.4, T1 | 1 day |
| T5 | Build "Translate to FR" button in Payload admin document header | Phase 2 | T1, T2 | 1 day |
| T6 | Build translation review dashboard (`/admin/translation-review`) — CMS-based Path A only for PoC | Phase 2 | T3 | 2 days |
| T7 | Build `batch-translate.mjs` CLI script for migration backfill | Phase 3 | T1 | 1 day |
| T8 | Run bulk translation on migrated content missing FR equivalents | Phase 3 | T7, content import | 1 day |
| T9 | Human review of AI-translated content (CMS-based) | Phase 3 | T8 | 2–3 weeks |
| T10 | *(Future)* External reviewer approval workflow (email/Teams notifications, review page) | Post-PoC | T6 | 3–5 days |

**PoC engineering effort: ~9.5 days** (T1–T8, excluding human review and external workflow)
**Full engineering effort: ~14.5 days** (including T10 external approval workflow)

---

*Generated 2026-03-04. Cross-references: BUILD_PLAN-phase2.md (Epic 18), PRD-phase2.md (bilingual NFR), fr-slug-mapping.md, content-migration-strategy.md, research-resolution-open-questions.md (Q2), consolidated-gaps-report.md*
