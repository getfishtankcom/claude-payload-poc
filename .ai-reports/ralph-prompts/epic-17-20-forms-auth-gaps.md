# Ralph Loop Prompt — Epics 17 + 20: Forms, Auth & Gap Pages

## Your Mission

Build forms (contact, login), auth (Aptify integration), ReCaptcha, and all gap pages (error pages, RSS, registration, forgot password/username, member-only forms, missing components).

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 17 and 20 tasks
3. `.ai-reports/BUILD_PLAN-phase2.md` — full task details
4. `.ai-reports/PRD-phase2.md` — form specs, auth architecture
5. `.ai-reports/dogfood-frascanada/notion-research-cross-reference.md` — Aptify auth details, member boolean

## Epic 17: Forms & Auth (8 tasks)
- 17.1 `<ContactForm />` — vertical stacked form, validation, server action
- 17.2 `<ReCaptcha />` — invisible v3, `react-google-recaptcha-v3`, server verification
- 17.3 `<MediaInquiriesBlock />` — heading + contact info
- 17.4 Template 15: Contact page — form + ReCaptcha + media inquiries
- 17.5 `<LoginForm />` — username + password, forgot links, "Log in" button
- 17.6 `<AuthLayout />` — centered card wrapper (~480px)
- 17.7 `<SupportContactBlock />` + `<CpaExplanationBlock />`
- 17.8 Template 16: Auth page — login + register link + CPA explanation + support
  - **Auth: Aptify DB API** (NOT NextAuth/OAuth)
  - Simple member boolean (True/False)
  - HTTP-only JWT cookie session
  - Rate limiting: 5 attempts per 15 min

## Epic 20: Gap Pages & Forms (10 tasks)
- 20.1 Annual Report page — T3B pattern
- 20.2 Error pages (404/500) — branded, with header/footer
- 20.3 RSS feed endpoint — `/api/rss` and `/api/rss/[board]`
- 20.4 Decision Summaries listing — reuse T13 pattern
- 20.5 Registration form — AuthLayout, Aptify API account creation
- 20.6 Forgot Username — AuthLayout, Aptify recovery
- 20.7 Forgot Password — AuthLayout, Aptify reset
- 20.8 Member-Only Form Template — auth gate, 3 form variants (doc comment, event reg, volunteer)
- 20.9 `<EventSummaryTable />` — tabular meeting summary
- 20.10 `<MeetingTopicsTable />` — agenda topics table

## IMPORTANT Auth Notes
- Auth is Aptify DB API, NOT OAuth/SSO
- Members are simple True/False boolean
- Member-only forms submit → email with attachments, NO database storage
- Aptify API calls happen in Next.js server actions

## Validation

```bash
npx tsc --noEmit
npm run dev
# /contact-us — form renders, validation works, ReCaptcha loads
# /my-account/login — login form renders, forgot links work
# /my-account/register — registration form
# /my-account/forgot-username — recovery form
# /my-account/forgot-my-password — reset form
# 404 page — visit /nonexistent, branded error page shows
# /api/rss — returns valid XML
```

## Stop Condition

When ALL tasks across Epics 17 and 20 are `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPICS 17 AND 20 COMPLETE</promise>
```
