# Ralph Loop Prompt — Epic 0: Project Scaffolding + Design System

## Your Mission

You are building the foundation for FRAS Canada (frascanada.ca rebuild). This is Epic 0 — the scaffold and design system that everything else builds on.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules and conventions
2. `.ai-reports/MASTER_TODO.md` — find Epic 0 tasks, check which are `[ ]` pending
3. `.ai-reports/BUILD_PLAN.md` — Epic 0 full task details
4. `.ai-reports/dogfood-frascanada/design-tokens.md` — complete token reference
5. `.ai-reports/PRD.md` — Section 3 (Tech Stack), Section 9 (Non-Functional Requirements)

## What to Build

### Task 0.1: Initialize Next.js + Payload CMS project
- Run `npx create-payload-app@latest` with Next.js template
- Configure PostgreSQL connection in `.env.example`
- Configure Tailwind CSS v4 with `@tailwindcss/postcss`
- Set up project structure: `src/app/`, `src/collections/`, `src/globals/`, `src/components/`, `src/components/ui/`
- Set up ESLint + Prettier + TypeScript strict mode
- **DONE WHEN:** `npm run dev` starts without errors, `/admin` loads Payload panel, `npx tsc --noEmit` passes

### Task 0.2: Configure Tailwind CSS v4 design system
- Configure `@theme inline` in `src/app/(frontend)/globals.css`
- Map ALL design tokens from `design-tokens.md` to Tailwind utilities
- Brand colors: `--color-primary: #601F5B`, `--color-primary-bright: #A53B9D`, `--color-primary-medium: #8E3387`, `--color-primary-vivid: #800080`
- Hero gradient: `--gradient-hero: linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%)`
- Neutrals: gray-50(#F8F8F8) through gray-900(#333333), black, white
- Semantic tokens: text-primary, text-heading, text-muted, link, bg-page, bg-footer, bg-alt, bg-feature
- Typography: Inter via `next/font`, weights 300/400/600/700/900
- Heading scale: 4xl=46px, 3xl=34px, xl=20px, base=16px
- Spacing: 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px), 12(48px), 16(64px)
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1440px)
- Border radius: none, sm(5px), md(8px), lg(12px), full(9999px)
- Badge color tokens
- **DONE WHEN:** All CSS custom properties exist in globals.css, Tailwind classes like `bg-primary`, `text-heading`, `text-4xl`, `p-4`, `rounded-sm` all work

### Task 0.2.1: Install and configure Tailwind UI
- Install `@headlessui/react` for unstyled accessible primitives
- Install `@heroicons/react` for iconography
- **DONE WHEN:** `import { Dialog } from '@headlessui/react'` and `import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'` both resolve without errors

### Task 0.2.2: Build design primitives
Build these 6 components in `src/components/ui/`:

**`<Button />`** — `src/components/ui/button.tsx`
- Props: `variant` ('primary' | 'secondary' | 'ghost' | 'dark'), `size` ('sm' | 'md' | 'lg'), `children`, `asChild?`, standard button HTML attributes
- Primary: bg-primary text-white rounded-sm px-4 py-2.5
- Secondary: border border-primary text-primary bg-transparent rounded-sm
- Ghost: text-primary bg-transparent p-0 (text + arrow style)
- Dark: bg-primary-medium text-white rounded-sm (CTA on dark bg)
- Hover, focus, disabled states

**`<Badge />`** — `src/components/ui/badge.tsx`
- Props: `variant` ('standard' | 'news' | 'webinar' | 'meeting-summary' | 'guidance' | 'exposure-draft' | 'survey' | 'research' | 'public-comment'), `children`
- Each variant maps to badge color tokens

**`<Input />`** — `src/components/ui/input.tsx`
- Props: `type` ('text' | 'email' | 'tel' | 'textarea'), `label`, `error?`, `required?`, standard input HTML attributes
- Label above input with optional asterisk for required
- Error state: red border + error message below
- Focus ring using focus-ring token

**`<Card />`** — `src/components/ui/card.tsx`
- Props: `children`, `className?`, `bordered?`, `shadow?`
- Composable: `<Card.Header>`, `<Card.Body>`, `<Card.Footer>` sub-components

**`<Container />`** — `src/components/ui/container.tsx`
- Props: `children`, `className?`, `size?` ('default' | 'narrow')
- Max-width 1440px (default) or 1200px (narrow), responsive padding

**`<Stack />`** — `src/components/ui/stack.tsx`
- Props: `children`, `gap?` (spacing scale value), `className?`
- Vertical flex with configurable gap

**DONE WHEN:** All 6 components export from `src/components/ui/index.ts`, render without errors, TypeScript types are correct

### Task 0.3: Set up deployment pipeline
- Vercel project configuration
- Database provisioning docs in `.env.example`
- Environment variable documentation
- **DONE WHEN:** `vercel.json` exists (if needed), `.env.example` has all required vars documented

## Workflow

1. Read MASTER_TODO.md — find first `[ ]` task in Epic 0
2. Mark it `[~]` in MASTER_TODO.md
3. Build it following acceptance criteria above
4. Run validation (TypeScript compile, dev server, visual check)
5. Mark `[x]` if passing, fix if not
6. Move to next task
7. When ALL Epic 0 tasks are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 0 COMPLETE</promise>
```

## IMPORTANT

- Use design tokens from `design-tokens.md` — never hardcode colors
- Follow Tailwind CSS v4 patterns (`@theme inline`, not v3 `tailwind.config.js`)
- All components must be TypeScript with proper types
- Export everything from barrel files (`index.ts`)
- This is an APPROVAL GATE epic — user reviews before Epic 1 starts
