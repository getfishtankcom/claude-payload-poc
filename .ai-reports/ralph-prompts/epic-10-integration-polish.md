# Ralph Loop Prompt — Epic 10: Integration & Polish

## Your Mission

Seed CMS with sample data, run responsive/accessibility/performance testing, set up SEO, integrate HubSpot newsletter. This is the Phase 1 capstone.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 10 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epic 10 task details (10.1–10.5 + 10.1.1)
4. `.ai-reports/PRD.md` — Section 9 (Non-Functional Requirements), Section 10 (Integrations)

## What to Build

### 10.1 Seed CMS with sample data
- Create seed script: `src/seed/index.ts`
- 4 boards (AcSB, PSAB, AASB, CSSB) + RASOC
- 11 standards mapped to boards
- 8+ projects with timeline data
- 4 consultations with deadlines
- 10+ news items across categories
- 5+ events (webinars, meetings, deadlines)
- Configure navigation + footer globals
- Run via `npx payload seed` or custom script

### 10.1.1 Integrate HubSpot newsletter
- Wire `<NewsletterCTA />` submit to HubSpot Forms API
- `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_ID` in `.env.example`
- Server action: POST to `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}`
- Success/error states in UI

### 10.2 Responsive testing
- Test all pages at 390px, 768px, 1024px, 1440px
- Verify mobile adaptations: sidebar→dropdown, grid→stack, filter→accordion

### 10.3 Accessibility audit
- WCAG 2.1 AA compliance
- Keyboard nav for mega-menu, search modal, mobile menu
- Screen reader testing
- Color contrast for all badge types

### 10.4 Performance optimization
- Core Web Vitals targets
- next/image optimization
- Server/client component split
- Bundle analysis

### 10.5 SEO setup
- Metadata for all pages
- Structured data: Organization, BreadcrumbList
- Sitemap generation
- robots.txt

## Validation

```bash
# Seed data exists
npm run seed  # or equivalent
# Visit /admin — all collections have entries
# Visit all pages — content renders

# SEO
curl -s http://localhost:3000/sitemap.xml | head
curl -s http://localhost:3000/robots.txt

npx tsc --noEmit
```

## Workflow

When ALL Epic 10 tasks `[x]`: update AUDIT_LOG.md, output:

```
<promise>EPIC 10 COMPLETE — PHASE 1 DONE</promise>
```
