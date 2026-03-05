# FRAS Canada — Master TODO

> **Total Tasks:** 136 (63 Phase 1 + 73 Phase 2)
> **Stack:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL + Tailwind CSS v4 + Meilisearch
> **Last Updated:** 2026-03-05

## How This Document Works

This is the single source of truth for build progress. Each task has:
- **Status:** `[ ]` pending, `[~]` in progress, `[x]` complete, `[!]` blocked
- **Acceptance Criteria:** What "done" looks like — specific, testable conditions
- **Validation:** Commands or checks to verify completion
- **Ralph Stop:** The condition that signals a Ralph loop to output `<promise>DONE</promise>`

---

# Phase 1 (58 tasks across 11 epics)

---

## Epic 0: Project Scaffolding + Design System (5 tasks)

### 0.1 Initialize Next.js + Payload CMS project

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- `create-payload-app` scaffolded with Next.js template in project root
- `.env.example` contains `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` variables
- PostgreSQL connection string configured in `.env.example` with placeholder values
- Tailwind CSS v4 installed with `@tailwindcss/postcss` in `postcss.config.mjs`
- Project structure exists: `src/app/`, `src/collections/`, `src/globals/`, `src/components/`
- ESLint configured with `@typescript-eslint/parser` and strict rules
- Prettier configured with `.prettierrc`
- `tsconfig.json` has `strict: true`
- Dev server starts without errors on `http://localhost:3000`
- Payload admin panel accessible at `http://localhost:3000/admin`

**Validation:**
```bash
# Verify project structure
ls src/app src/collections src/globals src/components
# Verify dev server starts
npm run dev & sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin && kill %1
# Verify TypeScript strict mode
grep '"strict": true' tsconfig.json
```

**Ralph Stop:** Dev server runs, `/admin` returns 200, all 4 directories exist.

---

### 0.2 Configure Tailwind CSS v4 design system

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- `globals.css` contains `@theme inline` block with all design tokens
- Brand color CSS custom properties defined:
  - `--color-primary: #601F5B`
  - `--color-primary-bright: #A53B9D`
  - `--color-primary-medium: #8E3387`
  - `--color-primary-vivid: #800080`
- Hero gradient token defined:
  - `--gradient-hero: linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%)`
- Neutral palette tokens: `--color-gray-50` through `--color-gray-900`, `--color-black`, `--color-white`
- Semantic tokens defined:
  - `--color-text-primary`, `--color-text-heading`, `--color-text-muted`
  - `--color-link`
  - `--color-bg-page`, `--color-bg-footer`, `--color-bg-alt`, `--color-bg-feature`
- Typography configured:
  - Inter font loaded via `next/font/google`
  - Font weights: 300 (light), 400 (regular), 600 (semibold), 700 (bold), 900 (black)
  - Heading scale: `--text-4xl: 46px`, `--text-3xl: 34px`, `--text-xl: 20px`, `--text-base: 16px`
- Spacing scale tokens: `--spacing-1: 4px`, `--spacing-2: 8px`, `--spacing-3: 12px`, `--spacing-4: 16px`, `--spacing-6: 24px`, `--spacing-8: 32px`, `--spacing-12: 48px`, `--spacing-16: 64px`
- Breakpoints: `--breakpoint-sm: 640px`, `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`, `--breakpoint-xl: 1280px`, `--breakpoint-2xl: 1440px`
- Border radius tokens: `--radius-none: 0`, `--radius-sm: 5px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-full: 9999px`
- Shadow tokens: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Badge color tokens:
  - `--color-badge-standard: #601F5B` (purple)
  - `--color-badge-news: #1a1a1a` (dark)
  - `--color-badge-webinar: #0d9488` (teal)
  - `--color-badge-meeting-summary: #6b7280` (gray)
  - `--color-badge-guidance: #1a1a1a` (dark outline variant)
- `@layer base` reset included
- Tailwind utility `bg-primary` applies `#601F5B` background
- Tailwind utility `text-heading` applies heading color
- Tailwind utility `gradient-hero` applies the hero gradient

**Validation:**
```bash
# Verify globals.css has @theme inline block
grep '@theme inline' src/app/globals.css
# Verify primary color token
grep '#601F5B' src/app/globals.css
# Verify gradient token
grep 'gradient-hero' src/app/globals.css
# Verify Inter font import
grep -r 'Inter' src/app/layout.tsx
```

**Ralph Stop:** `globals.css` contains `@theme inline` with all color, spacing, typography, radius, shadow, and badge tokens. Tailwind utilities resolve to correct values.

---

### 0.2.1 Install and configure Tailwind UI

- [x] **Status:** Complete (2026-03-05) — installed with Epic 2 start

**Acceptance Criteria:**
- `@headlessui/react` installed and listed in `package.json` dependencies
- `@heroicons/react` installed and listed in `package.json` dependencies
- Headless UI components importable: `import { Menu, Dialog, Transition, Disclosure } from '@headlessui/react'`
- Heroicons importable: `import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'`
- Component mapping documented in `.ai-reports/` or inline comments:
  - `Menu` → Board dropdowns, sort selectors
  - `Dialog` → Search modal, mobile menu overlay
  - `Transition` → Animations for menus and modals
  - `Disclosure` → Accordion sections (filters, mobile nav)

**Validation:**
```bash
# Verify packages installed
grep '@headlessui/react' package.json
grep '@heroicons/react' package.json
# Verify imports work
npx tsc --noEmit 2>&1 | head -20
```

**Ralph Stop:** Both packages in `package.json`, importable without TypeScript errors.

---

### 0.2.2 Build design primitives

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**

**`<Button />` — `src/components/ui/Button.tsx`**
- Props: `variant: 'primary' | 'secondary' | 'ghost' | 'dark'`, `size: 'sm' | 'md' | 'lg'`, `children: ReactNode`, `disabled?: boolean`, `href?: string`, `onClick?: () => void`, `type?: 'button' | 'submit'`, `className?: string`
- Variant styles:
  - `primary`: `bg-primary text-white` with hover darkening
  - `secondary`: `border-2 border-primary text-primary` outline with hover fill
  - `ghost`: text with right arrow `→`, no border/background
  - `dark`: white text on dark bg CTA
- Size styles: `sm` (px-3 py-1.5 text-sm), `md` (px-5 py-2.5 text-base), `lg` (px-7 py-3.5 text-lg)
- States: default, hover (scale/color shift), focus (ring), disabled (opacity-50 cursor-not-allowed)
- Renders `<a>` when `href` provided, `<button>` otherwise

**`<Badge />` — `src/components/ui/Badge.tsx`**
- Props: `variant: 'standard' | 'news' | 'webinar' | 'meeting-summary' | 'guidance' | 'exposure-draft' | 'survey' | 'research' | 'public-comment' | 're-exposure-draft'`, `label?: string`, `className?: string`
- Each variant maps to badge color token
- Default label derived from variant name (e.g., `'exposure-draft'` → `'Exposure Draft'`)
- Renders as inline `<span>` with `rounded-full px-3 py-1 text-xs font-semibold`

**`<Input />` — `src/components/ui/Input.tsx`**
- Props: `type: 'text' | 'email' | 'tel' | 'textarea'`, `label: string`, `name: string`, `error?: string`, `disabled?: boolean`, `placeholder?: string`, `value?: string`, `onChange?: (e) => void`, `className?: string`
- States: default (border-gray-300), focus (ring-primary border-primary), error (border-red-500 + error message text), disabled (bg-gray-100 cursor-not-allowed)
- Label rendered as `<label>` above input
- Error message rendered as `<p>` below input in red
- Renders `<textarea>` when `type='textarea'`

**`<Card />` — `src/components/ui/Card.tsx`**
- Props: `children: ReactNode`, `border?: boolean`, `shadow?: 'none' | 'sm' | 'md' | 'lg'`, `padding?: 'none' | 'sm' | 'md' | 'lg'`, `className?: string`
- Composable with `<Card.Header>`, `<Card.Body>`, `<Card.Footer>` sub-components
- Default: white background, rounded-md, no border

**`<Container />` — `src/components/ui/Container.tsx`**
- Props: `children: ReactNode`, `className?: string`
- Max-width: `max-w-[1440px]` centered with `mx-auto`
- Responsive horizontal padding: `px-4 sm:px-6 lg:px-8`

**`<Stack />` — `src/components/ui/Stack.tsx`**
- Props: `children: ReactNode`, `gap?: 'sm' | 'md' | 'lg' | 'xl'`, `className?: string`
- Gap mapping: `sm` (gap-2), `md` (gap-4), `lg` (gap-6), `xl` (gap-8)
- Renders as `<div>` with `flex flex-col`

- All 6 components exported from `src/components/ui/index.ts` barrel file

**Validation:**
```bash
# Verify all component files exist
ls src/components/ui/Button.tsx src/components/ui/Badge.tsx src/components/ui/Input.tsx src/components/ui/Card.tsx src/components/ui/Container.tsx src/components/ui/Stack.tsx src/components/ui/index.ts
# Verify barrel export
grep -c 'export' src/components/ui/index.ts
# Verify TypeScript compiles
npx tsc --noEmit
```

**Ralph Stop:** All 6 component files exist, barrel export has 6 exports, `tsc --noEmit` passes with zero errors.

---

### 0.3 Set up deployment pipeline

- [ ] **Status:** Pending

**Acceptance Criteria:**
- `vercel.json` or Vercel project configuration present (or Vercel CLI linked)
- Database provider chosen and documented in `.env.example` with connection string placeholder
- `.env.example` contains all required environment variables with descriptions:
  - `DATABASE_URI` — PostgreSQL connection string
  - `PAYLOAD_SECRET` — Payload CMS secret key
  - `NEXT_PUBLIC_SERVER_URL` — Public URL (e.g., `http://localhost:3000`)
  - `MEILISEARCH_HOST` — Meilisearch instance URL
  - `MEILISEARCH_API_KEY` — Meilisearch admin API key
  - `HUBSPOT_FORM_ID` — HubSpot newsletter form ID
- Build succeeds: `npm run build` exits 0
- Deployable to Vercel staging environment

**Validation:**
```bash
# Verify .env.example has all keys
grep -c '=' .env.example
# Verify build succeeds
npm run build 2>&1 | tail -5
```

**Ralph Stop:** `npm run build` exits 0, `.env.example` contains all 6 environment variable keys.

---

### 0.5 Set up Storybook

- [x] **Status:** Complete

**Acceptance Criteria:**
- `storybook`, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-interactions`, `@storybook/blocks` in `devDependencies`
- `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/vite.config.ts`, `.storybook/preview-head.html` exist
- `npm run storybook` starts on port 6006 without errors
- `npm run storybook:build` exits 0 (static build succeeds)
- 6 primitive stories exist: Button, Badge, Input, Card, Container, Stack
- All primitive stories render with correct Tailwind CSS v4 styling
- Mock data factory exists at `src/__mocks__/cms-data.ts`

**Validation:**
```bash
npm run storybook:build
npx tsc --noEmit
```

**Ralph Stop:** Storybook builds cleanly, all 6 primitive stories render.

---

## Epic 1: CMS Collections & Globals (11 tasks)

### 1.1 Create `boards` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Boards.ts`
- Collection slug: `boards`
- Fields:
  - `name` — type: `text`, required: true
  - `abbreviation` — type: `text`, required: true (e.g., "AcSB", "CSSB")
  - `slug` — type: `text`, required: true, unique: true, admin.position: 'sidebar'
  - `description` — type: `textarea`
  - `tabs` — type: `array`, fields:
    - `label` — type: `text`, required: true
    - `slug` — type: `text`, required: true
    - `content` — type: `richText`
  - `quick_actions` — type: `array`, fields:
    - `label` — type: `text`, required: true
    - `url` — type: `text`, required: true
    - `icon` — type: `text`
  - `resources` — type: `array`, fields:
    - `title` — type: `text`, required: true
    - `file_url` — type: `text`, required: true
    - `type` — type: `select`, options: `['pdf', 'word', 'link', 'video']`
- Collection registered in `payload.config.ts`
- Admin panel shows Boards collection with CRUD operations
- Seed data created: CSSB, AcSB, PSAB, AASB, RASOC (5 boards)

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Boards.ts
# Verify registered in config
grep 'Boards' src/payload.config.ts
# Verify field count (at minimum: name, abbreviation, slug, description, tabs, quick_actions, resources = 7 top-level)
grep -c "name:" src/collections/Boards.ts
```

**Ralph Stop:** Collection file exists, registered in config, admin panel shows Boards with all 7 top-level fields, 5 seed records created.

---

### 1.2 Create `standards` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Standards.ts`
- Collection slug: `standards`
- Fields:
  - `name` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `category` — type: `select`, required: true, options: `['Sustainability', 'Accounting', 'Public Sector', 'Assurance']`
  - `parts` — type: `array`, fields:
    - `label` — type: `text`, required: true (e.g., "Part I – IFRS Accounting Standards")
    - `slug` — type: `text`, required: true
  - `board` — type: `relationship`, relationTo: `boards`, required: true
- Collection registered in `payload.config.ts`
- Seed data: 11 standards mapped to their respective boards

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Standards.ts
# Verify category enum options
grep -A4 'category' src/collections/Standards.ts | grep 'Sustainability\|Accounting\|Public Sector\|Assurance'
# Verify board relationship
grep 'relationTo.*boards' src/collections/Standards.ts
```

**Ralph Stop:** Collection file exists with all 5 fields, board relationship configured, 11 seed records created.

---

### 1.3 Create `projects` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Projects.ts`
- Collection slug: `projects`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `summary` — type: `richText`
  - `key_proposals` — type: `richText`
  - `status` — type: `select`, required: true, options: `['Active', 'Completed', 'Paused']`
  - `badges` — type: `array`, fields:
    - `badge_type` — type: `select`, options: `['Exposure Draft', 'Public Comment', 'Survey', 'Research', 'Re-exposure Draft']`
  - `timeline_stages` — type: `array`, fields:
    - `phase_number` — type: `number`, required: true
    - `date` — type: `date`
    - `title` — type: `text`, required: true
    - `description` — type: `textarea`
    - `ctas` — type: `array`, fields:
      - `label` — type: `text`, required: true
      - `url` — type: `text`, required: true
  - `current_stage` — type: `number`, min: 1, max: 5
  - `type` — type: `select`, options: `['Active', 'Completed']` — used for Active Projects listing filter
  - `frasIdNumber` — type: `text` — Sitecore FRAS ID used in workflow email subjects ("For Review: {id} - {title}")
  - `board` — type: `relationship`, relationTo: `boards`, required: true
  - `standard` — type: `relationship`, relationTo: `standards`
  - `documents` — type: `relationship`, relationTo: `documents`, hasMany: true
  - `contacts` — type: `relationship`, relationTo: `contacts`, hasMany: true
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Projects.ts
# Verify status enum
grep -A3 'status' src/collections/Projects.ts | grep 'Active\|Completed\|Paused'
# Verify type enum
grep -A3 "'type'" src/collections/Projects.ts | grep 'Active\|Completed'
# Verify frasIdNumber field
grep 'frasIdNumber' src/collections/Projects.ts
# Verify relationships
grep 'relationTo' src/collections/Projects.ts
```

**Ralph Stop:** Collection file exists with all 14 fields, 4 relationships configured, registered in config.

---

### 1.4 Create `consultations` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Consultations.ts`
- Collection slug: `consultations`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `type` — type: `select`, required: true, options: `['Exposure Draft', 'Survey', 'Re-exposure Draft']`
  - `deadline_date` — type: `date`, required: true
  - `description` — type: `richText`
  - `action_documents` — type: `array`, fields:
    - `label` — type: `text`, required: true
    - `url` — type: `text`, required: true
    - `type` — type: `select`, options: `['pdf', 'word', 'link']`
  - `board` — type: `relationship`, relationTo: `boards`, required: true
  - `standard` — type: `relationship`, relationTo: `standards`
  - `project` — type: `relationship`, relationTo: `projects`
  - `commentPeriodStart` — type: `date` — start of comment period window
  - `commentPeriodEnd` — type: `date` — end of comment period, used for countdown timer and open/closed status
  - `frasIdNumber` — type: `text` — Sitecore FRAS ID used in workflow email subjects ("For Review: {id} - {title}")
- Virtual/computed field `days_remaining`: calculated from `deadline_date - today` (implemented as a hook or frontend utility)
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Consultations.ts
# Verify deadline_date field
grep 'deadline_date' src/collections/Consultations.ts
# Verify comment period fields
grep 'commentPeriodStart\|commentPeriodEnd' src/collections/Consultations.ts
# Verify frasIdNumber field
grep 'frasIdNumber' src/collections/Consultations.ts
# Verify type enum
grep 'Exposure Draft\|Survey\|Re-exposure' src/collections/Consultations.ts
```

**Ralph Stop:** Collection file exists with all 12 fields + virtual field logic, registered in config.

---

### 1.5 Create `news` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/News.ts`
- Collection slug: `news`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `date` — type: `date`, required: true
  - `category` — type: `select`, options: `['News', 'Announcement', 'Press Release', 'Update']`
  - `excerpt` — type: `textarea`
  - `body` — type: `richText`
  - `featured_image` — type: `upload`, relationTo: `media`
  - `frasIdNumber` — type: `text` — Sitecore FRAS ID used in workflow email subjects ("For Review: {id} - {title}")
  - `board` — type: `relationship`, relationTo: `boards`
- `media` collection exists (or is created) to support uploads
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/News.ts
# Verify upload field
grep 'upload' src/collections/News.ts
# Verify frasIdNumber field
grep 'frasIdNumber' src/collections/News.ts
# Verify date field
grep "'date'" src/collections/News.ts
```

**Ralph Stop:** Collection file exists with all 9 fields, media upload configured, registered in config.

---

### 1.6 Create `events` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Events.ts`
- Collection slug: `events`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `date` — type: `date`, required: true
  - `publishedDate` — type: `date` — when posted/published, distinct from event date for sort flexibility
  - `type` — type: `select`, required: true, options: `['Webinar', 'Meeting', 'Deadline']`
  - `description` — type: `textarea`
  - `registration_url` — type: `text`
  - `board` — type: `relationship`, relationTo: `boards`
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Events.ts
# Verify publishedDate field
grep 'publishedDate' src/collections/Events.ts
# Verify type enum
grep 'Webinar\|Meeting\|Deadline' src/collections/Events.ts
```

**Ralph Stop:** Collection file exists with all 8 fields, registered in config.

---

### 1.7 Create `documents` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Documents.ts`
- Collection slug: `documents`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `type` — type: `select`, required: true, options: `['Exposure Draft', 'Implementation Guide', 'Background Paper', 'Research Report', 'Guidance', 'Standard']`
  - `file` — type: `upload`, relationTo: `media`
  - `description` — type: `textarea`
  - `board` — type: `relationship`, relationTo: `boards`
  - `standard` — type: `relationship`, relationTo: `standards`
  - `project` — type: `relationship`, relationTo: `projects`
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Documents.ts
# Verify type options
grep 'Exposure Draft\|Implementation Guide\|Background Paper' src/collections/Documents.ts
# Verify upload field
grep 'upload' src/collections/Documents.ts
```

**Ralph Stop:** Collection file exists with all 8 fields, upload and 3 relationships configured, registered in config.

---

### 1.8 Create `decision-summaries` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/DecisionSummaries.ts`
- Collection slug: `decision-summaries`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `date` — type: `date`, required: true
  - `body` — type: `richText`
  - `board` — type: `relationship`, relationTo: `boards`, required: true
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/DecisionSummaries.ts
# Verify board relationship
grep 'relationTo.*boards' src/collections/DecisionSummaries.ts
```

**Ralph Stop:** Collection file exists with all 5 fields, registered in config.

---

### 1.9 Create `contacts` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Contacts.ts`
- Collection slug: `contacts`
- Fields:
  - `name` — type: `text`, required: true
  - `credentials` — type: `text` (e.g., "CPA, CA")
  - `title` — type: `text` (job title)
  - `phone` — type: `text`
  - `email` — type: `email`
  - `photo` — type: `upload`, relationTo: `media`
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Contacts.ts
# Verify email field type
grep 'email' src/collections/Contacts.ts
# Verify photo upload
grep 'upload\|photo' src/collections/Contacts.ts
```

**Ralph Stop:** Collection file exists with all 6 fields, registered in config.

---

### 1.10 Create `pages` collection

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Collection file at `src/collections/Pages.ts`
- Collection slug: `pages`
- Fields:
  - `title` — type: `text`, required: true
  - `slug` — type: `text`, required: true, unique: true
  - `content` — type: `richText`
  - `sidebar_type` — type: `select`, options: `['staff_contact', 'section_nav', 'none']`, defaultValue: `'none'`
  - `meta` — type: `group`, fields:
    - `meta_title` — type: `text`
    - `meta_description` — type: `textarea`
    - `og_image` — type: `upload`, relationTo: `media`
- Collection registered in `payload.config.ts`

**Validation:**
```bash
# Verify collection file exists
ls src/collections/Pages.ts
# Verify sidebar_type options
grep 'staff_contact\|section_nav' src/collections/Pages.ts
# Verify meta group
grep 'meta_title\|meta_description\|og_image' src/collections/Pages.ts
```

**Ralph Stop:** Collection file exists with all 5 top-level fields (including meta group with 3 sub-fields), registered in config.

---

### 1.11 Create Globals

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**

**`navigation` global — `src/globals/Navigation.ts`**
- Slug: `navigation`
- Fields:
  - `utility_links` — type: `array`, fields: `label` (text), `url` (text), `has_dropdown` (checkbox)
  - `primary_nav` — type: `array`, fields: `label` (text), `url` (text), `has_dropdown` (checkbox)
  - `mega_menu` — type: `array`, fields: `trigger_label` (text), `columns` (array of: `heading` (text), `links` (array of: `label` (text), `url` (text)))

**`footer` global — `src/globals/Footer.ts`**
- Slug: `footer`
- Fields:
  - `columns` — type: `array`, fields: `heading` (text), `links` (array of: `label` (text), `url` (text))
  - `boards_links` — type: `array`, fields: `label` (text), `url` (text)
  - `quick_links` — type: `array`, fields: `label` (text), `url` (text)
  - `newsletter_heading` — type: `text`
  - `newsletter_description` — type: `textarea`

**`homepage` global — `src/globals/Homepage.ts`**
- Slug: `homepage`
- Fields:
  - `hero_heading` — type: `text`, required: true
  - `hero_subtitle` — type: `textarea`
  - `cta_heading` — type: `text`
  - `cta_body` — type: `textarea`
  - `cta_button_label` — type: `text`
  - `cta_button_url` — type: `text`
  - `newsletter_text` — type: `textarea`
  - `browse_by_standard` — type: `array`, fields: `category` (text), `links` (array of: `label` (text), `url` (text))

**`search-config` global — `src/globals/SearchConfig.ts`**
- Slug: `search-config`
- Fields:
  - `popular_tags` — type: `array`, fields: `label` (text), `query` (text)
  - `default_filters` — type: `json`

- All 4 globals registered in `payload.config.ts` under `globals` array
- All 4 globals editable in admin panel

**Validation:**
```bash
# Verify global files exist
ls src/globals/Navigation.ts src/globals/Footer.ts src/globals/Homepage.ts src/globals/SearchConfig.ts
# Verify registered in config
grep -c 'globals' src/payload.config.ts
```

**Ralph Stop:** All 4 global files exist, registered in config, editable in admin panel.

---

## Epic 2: Shared Layout Components (6 tasks)

### 2.1 Build `<SiteHeader />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/layout/SiteHeader.tsx`
- **Row 1 — Utility bar:**
  - Links rendered: About Us (with dropdown indicator), Boards (with dropdown indicator), Contact, Newsletter, Volunteer, FR, Sign In
  - Text size: `text-sm`, muted color
  - Background: subtle gray or transparent
- **Row 2 — Logo + Search:**
  - FRAS Canada logo (image or text placeholder) left-aligned
  - Persistent search input field right-aligned (click triggers `SearchModal`)
  - Search input has `MagnifyingGlassIcon` and placeholder text
- **Row 3 — Primary navigation:**
  - Links: Active Projects (with dropdown), Open Consultations, News
  - Active state: underline or bold
  - Dropdown triggers `MegaMenu` component
- **Responsive behavior (below `lg` breakpoint):**
  - Rows 1 and 3 hidden
  - Row 2 collapses to: logo + search icon + hamburger (`Bars3Icon`)
  - Hamburger triggers `MobileMenu`
- Wired to `navigation` global data (fetched server-side or passed as props)
- Sticky header on scroll (optional, configurable)
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/layout/SiteHeader.tsx
# Verify it references navigation global or accepts nav props
grep -i 'navigation\|nav' src/components/layout/SiteHeader.tsx
# Verify responsive classes
grep 'lg:hidden\|hidden lg:' src/components/layout/SiteHeader.tsx
```

**Ralph Stop:** Component renders 3 rows on desktop, collapses to logo+search+hamburger on mobile, wired to navigation data.

---

### 2.2 Build `<SiteFooter />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/layout/SiteFooter.tsx`
- **4-column layout** (desktop `lg`+):
  - Column 1: Organization info (FRAS Canada description)
  - Column 2: Boards (links to each board page)
  - Column 3: Quick Links (split into 2 sub-columns)
  - Column 4: Account (Sign In, Create Account, etc.)
- **Newsletter CTA row:**
  - Heading text (from `footer` global `newsletter_heading`)
  - Email input + "Subscribe" button (uses `<Input />` and `<Button />` primitives)
- **Copyright bar:**
  - Copyright text with year
  - Policy links (Privacy Policy, Terms, Accessibility)
  - LinkedIn icon link
- **Responsive behavior (below `lg`):**
  - 4 columns stack to single column
  - Newsletter row stacks vertically
- Background: `bg-footer` semantic token (dark)
- Text color: white/light gray
- Wired to `footer` global data
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/layout/SiteFooter.tsx
# Verify footer global reference
grep -i 'footer' src/components/layout/SiteFooter.tsx
# Verify newsletter section
grep -i 'newsletter\|subscribe' src/components/layout/SiteFooter.tsx
```

**Ralph Stop:** Component renders 4-column layout on desktop, stacks on mobile, includes newsletter CTA and copyright bar.

---

### 2.3 Build `<MobileMenu />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/layout/MobileMenu.tsx`
- Props: `isOpen: boolean`, `onClose: () => void`
- Full-screen overlay with dark backdrop
- Close button (`XMarkIcon`) in top-right corner
- **Content (top to bottom):**
  - Search input at top
  - FR language toggle + Sign In link
  - Expandable accordion sections (using Headless UI `Disclosure`):
    - "Active Projects" → expands to show 4 board links
    - "About Us" → expands to show 4 sub-links
    - "Boards" → expands to show per-board nested nav (each board has 7 sub-pages)
  - Static links: Open Consultations, News, Contact, Newsletter, Volunteer
- **Animation:** slide-in from right or fade-in (using Headless UI `Transition`)
- Focus trapped inside when open
- Escape key closes menu
- Body scroll locked when open
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/layout/MobileMenu.tsx
# Verify Dialog or Transition usage
grep 'Dialog\|Transition\|Disclosure' src/components/layout/MobileMenu.tsx
# Verify onClose prop
grep 'onClose' src/components/layout/MobileMenu.tsx
```

**Ralph Stop:** Component renders full-screen overlay, has accordion sections, animates open/close, traps focus.

---

### 2.4 Build `<MegaMenu />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/layout/MegaMenu.tsx`
- Props: `trigger: string`, `items: MegaMenuItem[]`, `isOpen: boolean`, `onToggle: () => void`
- **3 dropdown configurations:**
  - "About Us": single column, 4 links (Who We Are, Our Mission, Leadership, Careers)
  - "Boards": 4-column mega-menu, each column is a board (AcSB, AASB, PSAB, CSSB) with 7 sub-links per board (Overview, Active Projects, Open Consultations, News, Events, Resources, Contact)
  - "Active Projects": single column, 4 board links with full names
- Appears below header, full-width or constrained to content area
- **Interaction:**
  - Opens on hover (desktop) or click
  - Closes on: mouse leave, click outside, Escape key, click on a link
- Uses Headless UI `Menu` or `Popover` for accessibility
- Renders absolutely positioned below trigger element
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/layout/MegaMenu.tsx
# Verify Headless UI usage
grep 'Menu\|Popover' src/components/layout/MegaMenu.tsx
# Verify multi-column support
grep 'grid\|columns\|col-' src/components/layout/MegaMenu.tsx
```

**Ralph Stop:** Component renders 3 dropdown variants, opens/closes correctly, uses Headless UI for a11y.

---

### 2.5 Build `<Breadcrumb />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/layout/Breadcrumb.tsx`
- Props: `items?: BreadcrumbItem[]` (optional override), `className?: string`
- `BreadcrumbItem` type: `{ label: string, href?: string }`
- Auto-generates breadcrumb from current route path when no `items` prop provided
  - Splits pathname by `/`, capitalizes segments, converts slugs to readable labels
  - Each segment links to its parent route except the last (current page, rendered as plain text)
- Separator: `>` or `/` character between items
- First item always "Home" linking to `/`
- Renders as `<nav aria-label="Breadcrumb">` with `<ol>` for semantic markup
- Responsive: wraps naturally, no horizontal scroll
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/layout/Breadcrumb.tsx
# Verify semantic markup
grep 'aria-label.*Breadcrumb' src/components/layout/Breadcrumb.tsx
# Verify nav element
grep '<nav' src/components/layout/Breadcrumb.tsx
```

**Ralph Stop:** Component auto-generates from route or accepts override, uses semantic `<nav>` + `<ol>`, first item is "Home".

---

### 2.6 Build root layout

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- File at `src/app/(frontend)/layout.tsx` (or `src/app/layout.tsx` if no route group)
- Imports and renders `<SiteHeader />` and `<SiteFooter />`
- Structure: `<SiteHeader />` → `<main>{children}</main>` → `<SiteFooter />`
- Inter font loaded via `next/font/google` and applied to `<body>` or `<html>`
- Default metadata exported:
  - `title`: "FRAS Canada — Financial Reporting & Assurance Standards"
  - `description`: appropriate default meta description
  - `openGraph` defaults configured
- `globals.css` imported for Tailwind styles
- `<html lang="en">` for language attribute

**Validation:**
```bash
# Verify layout file exists
ls src/app/layout.tsx src/app/'(frontend)'/layout.tsx 2>/dev/null
# Verify SiteHeader and SiteFooter imports
grep 'SiteHeader\|SiteFooter' src/app/layout.tsx src/app/'(frontend)'/layout.tsx 2>/dev/null
# Verify Inter font
grep 'Inter' src/app/layout.tsx src/app/'(frontend)'/layout.tsx 2>/dev/null
```

**Ralph Stop:** Layout renders header + main + footer, Inter font loaded, default metadata set, `lang="en"` on html.

---

## Epic 3: Utility / Atomic Components (6 tasks)

### 3.1 Build `<ContentTypeBadge />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/ContentTypeBadge.tsx`
- Props:
  - `type: 'standard' | 'news' | 'webinar' | 'meeting-summary' | 'guidance' | 'exposure-draft' | 'survey' | 're-exposure-draft' | 'research' | 'public-comment'`
  - `label?: string` (optional override; defaults to humanized `type` value)
  - `className?: string`
- Variant color mapping:
  - `standard` → purple background (`bg-badge-standard text-white`)
  - `news` → dark background (`bg-badge-news text-white`)
  - `webinar` → teal background (`bg-badge-webinar text-white`)
  - `meeting-summary` → gray background (`bg-badge-meeting-summary text-white`)
  - `guidance` → dark outline (`border border-badge-guidance text-badge-guidance bg-transparent`)
  - `exposure-draft` → purple variant
  - `survey` → distinct color
  - `re-exposure-draft` → distinct color
  - `research` → distinct color
  - `public-comment` → distinct color
- Renders as `<span>` with `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold`
- Default label: `'exposure-draft'` → `'Exposure Draft'`, `'meeting-summary'` → `'Meeting Summary'`
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/ContentTypeBadge.tsx
# Verify all 10 variants
grep -c "'" src/components/ContentTypeBadge.tsx | head -1
# Verify default label logic
grep 'replace\|split\|charAt\|humanize\|label' src/components/ContentTypeBadge.tsx
```

**Ralph Stop:** Component renders all 10 variants with correct colors, default label humanizes the type prop.

---

### 3.2 Build `<TagChip />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/TagChip.tsx`
- Props:
  - `label: string`
  - `onClick?: () => void`
  - `active?: boolean` (default `false`)
  - `className?: string`
- Pill-style chip: `rounded-full px-4 py-1.5 text-sm font-medium`
- Default state: `bg-gray-100 text-gray-700 hover:bg-gray-200`
- Active state: `bg-primary text-white` (or inverted scheme)
- Cursor: `cursor-pointer` when `onClick` provided
- Renders as `<button>` when `onClick` provided, `<span>` otherwise
- Used in SearchModal for recent/popular tags
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/TagChip.tsx
# Verify active state logic
grep 'active' src/components/TagChip.tsx
# Verify onClick prop
grep 'onClick' src/components/TagChip.tsx
```

**Ralph Stop:** Component renders pill chip, toggles between default and active styles, renders correct element based on interactivity.

---

### 3.3 Build `<Pagination />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/Pagination.tsx`
- Props:
  - `totalItems: number`
  - `itemsPerPage: number` (default `10`)
  - `currentPage: number`
  - `onChange: (page: number) => void`
  - `className?: string`
- Displays: "Showing X–Y of Z results" text
- Page buttons: numbered, with `prev` (`<`) and `next` (`>`) buttons
- Current page button visually distinct: `bg-primary text-white`
- Truncation with ellipsis (`...`) when total pages > 7
- `prev` disabled on page 1, `next` disabled on last page
- Buttons are `<button>` elements with `aria-label` for accessibility
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/Pagination.tsx
# Verify props interface
grep 'totalItems\|itemsPerPage\|currentPage\|onChange' src/components/Pagination.tsx
# Verify aria labels
grep 'aria-label' src/components/Pagination.tsx
```

**Ralph Stop:** Component renders page numbers with prev/next, shows "Showing X–Y of Z", truncates with ellipsis, disables buttons at boundaries.

---

### 3.4 Build `<PageHeader />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/PageHeader.tsx`
- Props:
  - `icon?: React.ReactNode` (Heroicon or custom SVG)
  - `title: string`
  - `subtitle?: string`
  - `className?: string`
- Layout: icon (left or above) + H1 title on same line, subtitle below
- H1 uses `text-3xl font-bold text-heading` (34px from design system)
- Subtitle uses `text-lg text-muted`
- Icon sized at `w-8 h-8` or `w-10 h-10`, colored `text-primary`
- Responsive: icon + title stack vertically on small screens if needed
- Used on Active Projects listing, Open Consultations listing, Board Detail pages
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/PageHeader.tsx
# Verify h1 tag
grep '<h1\|heading' src/components/PageHeader.tsx
# Verify icon and title props
grep 'icon\|title\|subtitle' src/components/PageHeader.tsx
```

**Ralph Stop:** Component renders icon + H1 + optional subtitle, uses design system heading styles.

---

### 3.5 Build `<NewsletterCTA />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/NewsletterCTA.tsx`
- Props:
  - `heading?: string` (default: `"Trusted by 3,000+ professionals across Canada"`)
  - `description?: string`
  - `className?: string`
- Renders:
  - Heading text (`text-2xl font-bold`)
  - Optional description paragraph
  - Email input field (uses `<Input />` primitive, `type="email"`, placeholder "Enter your email")
  - "Subscribe" button (uses `<Button />` primitive, `variant="primary"`)
  - LinkedIn CTA link with LinkedIn icon
- Form submit handler:
  - Validates email format client-side
  - Calls HubSpot API endpoint (or placeholder function)
  - Shows success/error state after submission
- Responsive: input and button stack vertically on mobile, inline on desktop
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/NewsletterCTA.tsx
# Verify email input
grep 'email' src/components/NewsletterCTA.tsx
# Verify subscribe button
grep -i 'subscribe' src/components/NewsletterCTA.tsx
```

**Ralph Stop:** Component renders heading + email input + subscribe button + LinkedIn link, handles form submission with validation.

---

### 3.6 Build `<NewsItem />`

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- Component file at `src/components/NewsItem.tsx`
- Props:
  - `news: { title: string, date: string, excerpt: string, slug: string, category?: string, board?: { abbreviation: string } }`
  - `showExcerpt?: boolean` (default `true`)
  - `className?: string`
- Renders:
  - Date formatted (e.g., "March 4, 2026") in `text-sm text-muted`
  - Title as a link (`<a>` or Next.js `<Link>`) with hover underline, `text-lg font-semibold text-heading`
  - Excerpt paragraph (when `showExcerpt` is true) in `text-base text-primary` (body text color)
  - "Read More →" link in `text-primary font-medium` (ghost button style)
- Link destination: `/news/{slug}` or `/boards/{board}/news/{slug}`
- Used in: Board Detail sidebar, Homepage news section, Search Results
- Co-located `.stories.tsx` file with Default, variant, and edge case stories

**Validation:**
```bash
# Verify component file exists
ls src/components/NewsItem.tsx
# Verify Link usage
grep 'Link\|href' src/components/NewsItem.tsx
# Verify date formatting
grep 'date\|Date\|format' src/components/NewsItem.tsx
```

**Ralph Stop:** Component renders date + linked title + excerpt + "Read More →", links to correct news URL.

---

<!-- CONTINUED IN NEXT SECTION: Epics 4-10 -->

---

## Epic 4: Homepage

### 4.1 Build hero section
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. H1 renders "Canada's Official Hub for Financial Reporting Standards" with gradient background
  2. Subtitle text renders below H1 from `homepage` global
  3. Search bar click opens SearchModal overlay (Epic 5.1)
  4. Hero section stacks vertically on viewports < 768px
  5. Gradient matches design token `--gradient-hero`
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep -r "hero" src/app/ --include="*.tsx" -l` — hero section file exists
  - `curl -s localhost:3000 | grep -i "official hub"` — H1 text renders in HTML
  - Chrome DevTools screenshot at 390px confirms vertical stack
- **Ralph Stop:** Hero renders with gradient, heading, subtitle, and search bar triggers modal on click.

### 4.2 Build "New to FRAS?" CTA section
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Section displays intro paragraph from `homepage` global CTA block
  2. "Get Started" button renders with primary variant styling
  3. Button links to configured URL from global
  4. Content is editable via Payload admin panel
  5. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `curl -s localhost:3000 | grep -i "get started"` — CTA button present
  - Payload admin → Homepage global → edit CTA text → verify frontend updates
- **Ralph Stop:** CTA section renders with editable text and functional button link.

### 4.3 Build "Important News & Events" 3-column grid
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Column 1 shows 3 latest news items with date, title, excerpt, "Read More →"
  2. Column 2 shows latest Exposure Drafts with ED number, title, date
  3. Column 3 shows upcoming events with date, title, type badge (Webinar/Meeting/Deadline)
  4. Each column has a "View All →" link to its respective listing
  5. Mobile (< 768px): columns stack vertically as 3 separate sections
  6. Data fetched server-side from news, documents, events collections
  7. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `curl -s localhost:3000 | grep -c "Read More"` — returns 3+ matches
  - Chrome DevTools screenshot at 1440px shows 3-column layout
  - Chrome DevTools screenshot at 390px shows stacked layout
- **Ralph Stop:** Three columns render with live CMS data; mobile stacks correctly.

### 4.4 Build "Browse by Standard" section
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. 4-column card grid: Sustainability, Accounting, Public Sector, Assurance
  2. Each card displays category heading + list of standard/board links
  3. Links navigate to correct board detail pages
  4. Mobile: cards stack or render as expandable accordion list
  5. Data sourced from `standards` collection grouped by category
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `curl -s localhost:3000 | grep -i "sustainability"` — category present
  - Click each standard link → navigates to `/boards/[slug]`
  - Chrome DevTools screenshot at 390px confirms mobile adaptation
- **Ralph Stop:** Four category cards render with correct standard links that navigate to board pages.

### 4.5 Wire homepage route
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Route `app/(frontend)/page.tsx` exists as server component
  2. Fetches `homepage` global, latest news, events, standards in parallel
  3. Composes hero (4.1), CTA (4.2), news grid (4.3), browse section (4.4)
  4. Page metadata (title, description, og:image) set from homepage global
  5. Page loads in < 2s on localhost
- **Validation:**
  - `ls src/app/\\(frontend\\)/page.tsx` — file exists
  - `curl -s -o /dev/null -w "%{http_code}" localhost:3000` — returns 200
  - Lighthouse performance score ≥ 80 on localhost
- **Ralph Stop:** Homepage route renders all four sections with live CMS data and correct metadata.

---

## Epic 5: CMS Data Integration & Search (11 tasks)

> Epic 5 retroactively wires Epics 2-4 to CMS data and introduces block schemas for page builder architecture (Epics 25-26). CMS Integration tasks (5.1-5.6) run first, then Search tasks (5.7-5.11).

### CMS Integration (5.1–5.6)

### 5.1 Create block schemas, hero system, and reusable fields
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. `src/fields/link.ts` exports `link()` factory function (internal/external toggle, label, newTab, optional appearance select)
  2. `src/fields/linkGroup.ts` exports `linkGroup()` wrapping `link()` in an array field
  3. `src/heros/config.ts` exports `hero` group field with `type` select (none/highImpact/lowImpact), `richText` (Lexical), `links` (linkGroup), conditional `media` upload, conditional `search_enabled` boolean
  4. `src/heros/RenderHero.tsx` maps hero `type` → variant component (returns null for `none`)
  5. `src/heros/HighImpact/index.tsx` renders gradient hero with rich text, links, optional search bar
  6. `src/heros/LowImpact/index.tsx` renders simple text hero with rich text and links
  7. 5 block directories exist in `src/blocks/`: CTABlock, ContentBlock, RichTextBlock, NewsGridBlock, BrowseByStandardBlock — each with `config.ts` + `Component.tsx`
  8. Every `config.ts` has `slug`, `interfaceName`, and `fields` using `lexicalEditor()` with `FixedToolbarFeature()` + `InlineToolbarFeature()` for all richText fields
  9. `src/blocks/index.ts` exports blocks array
  10. `npx tsc --noEmit` passes with zero errors
- **Validation:**
  ```bash
  find src/blocks -name "config.ts" | wc -l  # ≥ 5
  find src/blocks -name "Component.tsx" | wc -l  # ≥ 5
  ls src/heros/config.ts src/heros/RenderHero.tsx  # hero system exists
  ls src/fields/link.ts src/fields/linkGroup.ts  # reusable fields exist
  npx tsc --noEmit
  ```
- **Ralph Stop:** All blocks, hero, and reusable fields compile; directory structure matches Payload website template.

### 5.2 Create `<RenderBlocks />` + update Pages collection + Homepage global
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. `src/blocks/RenderBlocks.tsx` has slug → Component mapping, iterates blocks array, spreads props, returns null for unknown types
  2. `src/collections/Pages.ts` updated with tabs: Hero tab (using `hero` field), Content tab (with `layout` blocks field), SEO tab (existing meta)
  3. `src/globals/Homepage.ts` updated with tabs: Hero tab + Content tab with `layout` blocks field; flat fields migrated to hero group + blocks
  4. Blocks registered on both Pages `layout` and Homepage `layout` via imported blocks array
  5. `admin: { initCollapsed: true }` set on layout blocks field
  6. Types regenerated: `npx payload generate:types` produces updated `payload-types.ts`
  7. Co-located `.stories.tsx` for RenderBlocks with mixed block types
  8. `npx storybook build --quiet` exits 0
- **Validation:**
  ```bash
  ls src/blocks/RenderBlocks.tsx  # exists
  grep "type: 'blocks'" src/collections/Pages.ts  # layout field exists
  grep "type: 'blocks'" src/globals/Homepage.ts  # layout field exists
  grep "interfaceName" src/blocks/*/config.ts | wc -l  # ≥ 5
  npx tsc --noEmit
  npx storybook build --quiet
  ```
- **Ralph Stop:** RenderBlocks renders mixed blocks; Pages + Homepage both use hero + blocks layout; types generated.

### 5.3 Create typed CMS fetch helpers
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. `src/lib/payload-helpers.ts` exists with 7 typed helper functions
  2. `getHomepage()` returns typed homepage global (with hero + layout)
  3. `getNavigation()` returns typed navigation global data
  4. `getFooter()` returns typed footer global data
  5. `getPageBySlug(slug)` returns typed page from `pages` collection (with hero + layout)
  6. `getLatestNews(limit)` returns news collection sorted by date desc
  7. `getUpcomingEvents(limit)` returns events filtered by future dates, sorted
  8. `getStandardsByCategory()` returns standards grouped by category enum
  9. All helpers use `getPayload` + `configPromise` pattern from Payload template
  10. All return types match generated `payload-types.ts`
- **Validation:**
  ```bash
  npx tsc --noEmit  # All helpers compile with correct return types
  grep -c "export.*async.*function" src/lib/payload-helpers.ts  # ≥ 7
  ```
- **Ralph Stop:** All 7 helpers compile with correct return types.

### 5.4 Wire SiteHeader + MegaMenu to `navigation` global
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Root layout fetches `navigation` global via `getNavigation()` and passes data as props
  2. `<SiteHeader />` accepts navigation data props (no internal CMS fetching)
  3. `<MegaMenu />` and `<MobileMenu />` receive navigation data from SiteHeader props
  4. ALL hardcoded nav items removed — navigation structure comes entirely from CMS
  5. Empty state renders sensibly when no navigation data exists
- **Validation:**
  ```bash
  grep -rn "hardcoded\|TODO" src/components/layout/SiteHeader* src/components/layout/MegaMenu* src/components/layout/MobileMenu*  # returns 0
  npx tsc --noEmit
  # Change nav data in /admin → frontend reflects change on refresh
  ```
- **Ralph Stop:** Header/nav driven entirely by CMS data; zero hardcoded nav items.

### 5.5 Wire SiteFooter to `footer` global
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Root layout fetches `footer` global via `getFooter()` and passes data as props
  2. `<SiteFooter />` accepts footer data props (no internal CMS fetching)
  3. ALL hardcoded footer links, board lists, and text content removed
  4. Footer columns, boards links, quick links, newsletter config from CMS
  5. Empty state renders sensibly when no footer data exists
- **Validation:**
  ```bash
  grep -rn "hardcoded\|TODO" src/components/layout/SiteFooter*  # returns 0
  npx tsc --noEmit
  # Change footer data in /admin → frontend reflects change on refresh
  ```
- **Ralph Stop:** Footer driven entirely by CMS data; zero hardcoded content.

### 5.6 Wire homepage route to CMS data
- [x] **Status:** Not Started
- **Acceptance Criteria:**
  1. `src/app/(frontend)/page.tsx` fetches homepage global via `getHomepage()`
  2. Uses `<RenderHero {...homepage.hero} />` for hero section
  3. Uses `<RenderBlocks blocks={homepage.layout} />` for page body
  4. NewsGridBlock fetches data server-side (async component, like Payload template's ArchiveBlock)
  5. Empty state handling for all sections when CMS has no data
  6. Zero hardcoded user-facing content strings in homepage components (outside seed data)
  7. `npx tsc --noEmit` passes
- **Validation:**
  ```bash
  grep -rn "New to FRAS\|Canada's Official Hub" src/app/ src/components/  # 0 outside seed data
  grep "RenderHero\|RenderBlocks" src/app/\(frontend\)/page.tsx  # both present
  npx tsc --noEmit
  npm run dev  # Homepage renders with CMS data or empty states
  ```
- **Ralph Stop:** Homepage renders via RenderHero + RenderBlocks; zero hardcoded user-facing text.

### Search (5.7–5.11)

### 5.7 Set up Meilisearch infrastructure
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Docker Compose includes Meilisearch v1.x service on port 7700
  2. `payload-meilisearch` plugin configured in `payload.config.ts` with collections list
  3. Searchable collections: projects, news, document-for-comment, resources, events, pages
  4. `afterChange` hooks auto-sync documents to Meilisearch indexes
  5. Filterable attributes configured: board, standard, content_type, file_type, date
  6. Bilingual indexes created: `{collection}_en`, `{collection}_fr`
  7. `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` added to `.env.example`
- **Validation:**
  - `docker compose ps | grep meilisearch` — service running
  - `curl -s localhost:7700/health` — returns `{"status":"available"}`
  - Create a news item in Payload admin → `curl localhost:7700/indexes/news_en/search?q=...` returns it
  - `curl localhost:7700/indexes/news_en/settings/filterable-attributes` — returns configured attributes
- **Ralph Stop:** Meilisearch running, auto-syncing with Payload, filterable attributes configured.

### 5.8 Build `<SearchModal />`
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Full-screen overlay opens when search input is clicked (header or hero)
  2. Large search input with placeholder "Projects, meetings, documents, and more."
  3. Recent tags section renders pill chips from user history (localStorage)
  4. Popular tags section renders pill chips from `search-config` global
  5. "Search" button navigates to `/search?q={query}`; "Cancel" closes modal
  6. Escape key closes modal; focus trapped inside modal when open
  7. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Click search input → modal overlay appears with `role="dialog"`
  - Type query + click Search → URL is `/search?q=...`
  - Press Escape → modal closes, focus returns to trigger element
- **Ralph Stop:** Modal opens/closes correctly, submits search query to results page, keyboard accessible.

### 5.9 Build `<FilterSidebar />` + `<SearchResultCard />`
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Five collapsible accordion sections: Board, Standard, Files & Media, Content Type, Date
  2. Board section: 4 checkboxes (CSSB, AcSB, PSAB, AASB)
  3. Standard section: grouped checkboxes under 4 categories
  4. Active filter count badge displays on each section header
  5. "Clear All" link resets all filters and updates search results
  6. Mobile (< 1024px): renders as collapsible accordion above results instead of sidebar
  7. SearchResultCard displays: content type badge, board name, date, linked title, truncated description
  8. File info row shows "PDF · 2.4 MB" when applicable (documents only)
  9. CTA link text varies by content type (View Document / Read More / Watch Recording / Read Summary / Download Guide)
  10. Co-located `.stories.tsx` files for both components
- **Validation:**
  - Toggle Board checkbox → results update via Meilisearch refinement
  - `document.querySelectorAll('[data-filter-section]').length === 5` in DevTools console
  - Chrome DevTools screenshot at 768px shows accordion layout
  - Search for known document → card shows file size and "View Document" CTA
- **Ralph Stop:** All 5 filter sections functional; search result cards render correctly with type-appropriate CTAs.

### 5.10 Build Search Results page
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Route `app/(frontend)/search/page.tsx` exists
  2. Search bar pre-filled with `?q=` query param; recent tags visible below
  3. 2-column layout: FilterSidebar (left) + results list (right)
  4. Results wired to Meilisearch via `react-instantsearch` + `@meilisearch/instant-meilisearch`
  5. Sort dropdown: Relevance, Date (newest first)
  6. Results count displays "Showing X-Y of Z results" with pagination
- **Validation:**
  - `curl -s "localhost:3000/search?q=sustainability"` — returns 200 with results
  - Toggle sort → results reorder
  - Apply Board filter → results narrow to selected board
  - Pagination: click page 2 → next batch of results loads
- **Ralph Stop:** Search page returns filtered, sorted, paginated results from Meilisearch.

### 5.11 Build document extraction pipeline
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. `pdf-parse` and `mammoth` installed as dependencies
  2. `afterChange` hook on `resources` collection extracts text from PDF and DOCX uploads
  3. Extracted text indexed in Meilisearch (not stored in PostgreSQL)
  4. Extraction errors logged as warnings without blocking document save
  5. Search for text inside a PDF returns the document in results
- **Validation:**
  - Upload a PDF with known text via admin → search for that text → document appears in results
  - Upload a DOCX with known text → same validation
  - Upload a corrupt file → document saves successfully, warning logged, no crash
- **Ralph Stop:** PDF and DOCX content searchable via Meilisearch; errors handled gracefully.

---

## Epic 6: Board Detail Page

### 6.1 Build `<SectionNav />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Vertical nav sidebar renders 7 navigation items from board `tabs` data
  2. Active item visually highlighted (left border + bold text or background)
  3. Click navigates to corresponding section/tab on the page
  4. Mobile (< 1024px): renders as dropdown `<select>` or collapsible menu
  5. Sticky positioning on desktop scroll
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `document.querySelectorAll('[data-section-nav] a').length >= 7` in DevTools
  - Click nav item → page scrolls or tab switches to correct section
  - Chrome DevTools screenshot at 390px shows dropdown variant
- **Ralph Stop:** Nav renders all items, active state works, mobile dropdown functional.

### 6.2 Build `<QuickActions />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Vertical button list renders from board `quick_actions` array
  2. Each button displays label and optional icon
  3. Buttons link to configured URLs (external links open in new tab)
  4. Minimum 3 actions: CPA Canada Handbook, View Implementation Tools, Explore Webinars
  5. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `document.querySelectorAll('[data-quick-actions] a').length >= 3`
  - Click each action → navigates to correct URL
  - External links have `target="_blank"` and `rel="noopener noreferrer"`
- **Ralph Stop:** Quick action buttons render from CMS data and link correctly.

### 6.3 Build `<UpcomingEvents />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. "View All" header link navigates to events listing
  2. Each event shows: formatted date, title, type badge (Webinar/Meeting/Deadline)
  3. Events sorted by date ascending (soonest first)
  4. Displays max 3-5 events
  5. Empty state handled gracefully (message or section hidden)
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Events render in ascending date order
  - Badge colors match type: Webinar=teal, Meeting=gray, Deadline=red/orange
  - Remove all events from CMS → section shows empty state or hides
- **Ralph Stop:** Events display with correct sorting, badges, and date formatting.

### 6.4 Build `<ResourcesList />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Document links rendered from board `resources` array
  2. Each resource shows file type icon (PDF, DOC, link), title, and type label
  3. File downloads trigger on click for uploadable resources
  4. External URLs open in new tab
  5. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - PDF resource click → file downloads or opens in new tab
  - External link resource → opens in new tab
  - Resources list matches board admin data
- **Ralph Stop:** Resources render with correct icons and functional download/navigation links.

### 6.5 Build `<RecentNews />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. "View All →" header link navigates to news listing filtered by board
  2. Each news item shows: date, title, excerpt, "Read More →" link
  3. News sorted by date descending (newest first)
  4. Displays max 3-5 news items
  5. Reuses or extends `<NewsItem />` component (3.6)
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - News items sorted newest first
  - "Read More →" links navigate to individual news pages
  - "View All →" navigates to `/news?board=[slug]` or equivalent
- **Ralph Stop:** Recent news renders with correct sorting and functional links.

### 6.6 Wire Board Detail route
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Route `app/(frontend)/boards/[board-slug]/page.tsx` exists
  2. 3-column layout: SectionNav (left) | Main content (center) | Quick Actions + Events + Resources (right)
  3. `generateStaticParams` returns slugs for all 4 boards (CSSB, AcSB, PSAB, AASB)
  4. Data fetched server-side: board, related projects, news, events
  5. Breadcrumb renders: Home > Boards > [Board Name]
  6. Page metadata set from board data
- **Validation:**
  - `curl -s localhost:3000/boards/cssb` — returns 200
  - `curl -s localhost:3000/boards/acsb` — returns 200
  - Chrome DevTools screenshot at 1440px shows 3-column layout
  - Chrome DevTools screenshot at 390px shows stacked layout
- **Ralph Stop:** All 4 board pages render with 3-column layout, live data, breadcrumbs, and metadata.

---

## Epic 7: Project Detail Page

### 7.1 Build `<ProjectTimeline />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. 5-stage vertical stepper renders from project `timeline_stages` array
  2. Each stage shows: phase number, date, title, description
  3. Completed stages show checkmark icon; current stage highlighted; future stages dimmed
  4. Inline CTA buttons render per stage from `ctas` array data
  5. Mobile: vertical layout with dates aligned left
  6. `current_stage` field determines which stage is active
  7. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Timeline renders 5 stages with correct visual states
  - CTA buttons within stages are clickable and navigate correctly
  - Change `current_stage` in admin → visual indicator moves
  - Chrome DevTools screenshot at 390px confirms mobile vertical layout
- **Ralph Stop:** Timeline stepper renders all stages with correct completed/current/future states and functional CTAs.

### 7.2 Build Project Detail page
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Route `app/(frontend)/active-projects/[board]/[project-slug]/page.tsx` exists
  2. 3-column layout: SectionNav (left) | Main (summary, key proposals, timeline, news, contacts) | Right sidebar (actions, events, resources)
  3. Summary and key proposals render rich text from CMS
  4. Contact cards display name, credentials, title, phone, email, photo
  5. Mobile: stacked layout with sticky CTA bar at bottom
  6. Breadcrumb: Home > Active Projects > [Board] > [Project Title]
- **Validation:**
  - `curl -s localhost:3000/active-projects/cssb/sample-project` — returns 200
  - Rich text renders headings, lists, links correctly
  - Contact card shows photo + clickable email/phone links
  - Chrome DevTools screenshot at 390px shows stacked layout with sticky CTA
- **Ralph Stop:** Project page renders all sections with live CMS data; mobile layout with sticky CTA functional.

---

## Epic 8: Active Projects Listing

### 8.1 Build `<BoardNav />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Vertical list of board full names with active state highlighting
  2. Click selects board and filters project list
  3. "All Boards" option available to show all projects
  4. Mobile (< 1024px): renders as dropdown selector
  5. Active board synced with URL param or route
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Click "AcSB" → only AcSB projects displayed
  - Click "All Boards" → all projects displayed
  - Chrome DevTools screenshot at 390px shows dropdown
- **Ralph Stop:** Board nav filters projects correctly; mobile dropdown works; active state visible.

### 8.2 Build `<ProjectCard />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Title renders as linked heading to project detail page
  2. Type badges row displays project badges (Exposure Draft, Survey, etc.)
  3. Description text displayed (truncated if needed)
  4. Stage indicator shows "Stage N: [Stage Name]" with visual marker
  5. Action buttons row renders CTAs from project data
  6. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Card title link navigates to `/active-projects/[board]/[project-slug]`
  - Badges render with correct colors per type
  - Stage indicator matches project `current_stage` value
- **Ralph Stop:** Project card displays all fields with functional links and correct badge/stage rendering.

### 8.3 Wire Active Projects route
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Route `app/(frontend)/active-projects/page.tsx` exists
  2. 2-column layout: BoardNav (left sidebar) + project cards list (right)
  3. Filter bar with text search input and standards dropdown
  4. Projects grouped under collapsible standard headers
  5. International section as separate collapsible group at bottom
  6. Page header uses `<PageHeader />` with icon and title "Active Projects"
- **Validation:**
  - `curl -s localhost:3000/active-projects` — returns 200
  - Text search filters projects by title/description
  - Standards dropdown narrows to selected standard
  - Collapse/expand standard groups → projects hide/show
- **Ralph Stop:** Active Projects page renders grouped, filterable project list with board nav and collapsible sections.

---

## Epic 9: Open Consultations Listing

### 9.1 Build `<ConsultationCard />`
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Title renders as linked heading to consultation detail or related project
  2. Type badges (Exposure Draft, Survey, Re-exposure Draft) + deadline date badge
  3. Board full name and standard name displayed as "Board • Standard"
  4. Description paragraph rendered (truncated if needed)
  5. Countdown text: "Comments due in X days" computed from `deadline_date`
  6. Action buttons row with document links (Submit Comment, View Draft, etc.)
  7. Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - Countdown shows correct days remaining from today to deadline
  - Past-deadline consultations show "Closed" or "Comments closed" state
  - Badge colors correct for each consultation type
- **Ralph Stop:** Consultation card renders all fields with accurate countdown and type-appropriate badges.

### 9.2 Wire Open Consultations route
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  1. Route `app/(frontend)/open-consultations/page.tsx` exists
  2. Filter bar with text search, board dropdown, standard dropdown
  3. Consultation cards list sorted by deadline (soonest first)
  4. Page header uses `<PageHeader />` with icon and title "Open Consultations"
  5. Empty state message when no open consultations exist
- **Validation:**
  - `curl -s localhost:3000/open-consultations` — returns 200
  - Board dropdown filter narrows results to selected board
  - Cards sorted by deadline ascending
  - Remove all consultations → empty state message displays
- **Ralph Stop:** Open Consultations page renders sorted, filterable consultation list with empty state handling.

---

## Epic 10: Integration & Polish + HubSpot

### 10.1 Seed CMS with sample data
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. 4 boards (CSSB, AcSB, PSAB, AASB) + RASOC created with full field data
  2. 11 standards created and linked to correct boards
  3. 8+ projects created with timeline stages, badges, and relationships
  4. 4+ consultations created with future deadline dates
  5. 10+ news items and 5+ events created with varied dates and types
  6. Navigation and footer globals configured with all menu items
- **Validation:**
  - `curl -s localhost:3000/api/boards | jq '.docs | length'` — returns 5
  - `curl -s localhost:3000/api/standards | jq '.docs | length'` — returns 11
  - Homepage renders news, events, and browse-by-standard with seeded data
  - All board detail pages render with related content
- **Ralph Stop:** All collections populated; all pages render with realistic sample content.

### 10.1.1 Integrate HubSpot newsletter subscription
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Newsletter form submits email to HubSpot Forms API endpoint
  2. Success state: confirmation message displayed to user
  3. Error state: error message displayed with retry option
  4. HubSpot form ID and portal ID configured in `.env.example`
  5. Form validates email format client-side before submission
- **Validation:**
  - Submit valid email → HubSpot dashboard shows new contact
  - Submit invalid email → client-side validation error displayed
  - Disconnect network → error state rendered with retry
  - `grep "HUBSPOT" .env.example` — env vars documented
- **Ralph Stop:** Newsletter form submits to HubSpot; success/error states work; env vars documented.

### 10.2 Responsive testing
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. All pages tested at 4 breakpoints: 390px, 768px, 1024px, 1440px
  2. Mobile adaptations verified: sidebar→dropdown, grid→stack, filter→accordion
  3. No horizontal scroll at any breakpoint
  4. Touch targets ≥ 44x44px on mobile
- **Validation:**
  - Chrome DevTools device emulation screenshots at each breakpoint for homepage, search, board detail, project detail, active projects, open consultations
  - `document.documentElement.scrollWidth <= document.documentElement.clientWidth` at each breakpoint
  - Tap targets audit via Lighthouse mobile
- **Ralph Stop:** All pages render correctly at all 4 breakpoints with no overflow or undersized touch targets.

### 10.3 Accessibility audit
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. WCAG 2.1 AA compliance: no critical or serious axe violations
  2. Full keyboard navigation: all interactive elements reachable via Tab/Enter/Escape
  3. Screen reader tested: mega-menu, search modal, mobile menu announce state changes
  4. Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text on all badge types
- **Validation:**
  - `npx axe-core localhost:3000` — 0 critical/serious violations
  - Tab through entire homepage → all links/buttons focusable with visible focus ring
  - Open search modal via keyboard → focus trapped; Escape closes
  - Check badge contrast ratios in DevTools for all badge variants
- **Ralph Stop:** Zero critical a11y violations; keyboard nav complete; screen reader announces modal/menu state.

### 10.4 Performance optimization
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. Lighthouse performance score ≥ 90 on homepage
  2. LCP < 2.5s, FID < 100ms, CLS < 0.1
  3. All images use `next/image` with appropriate sizing and lazy loading
  4. Client components minimized; heavy components use dynamic imports
- **Validation:**
  - Lighthouse audit on homepage, search, board detail — all ≥ 90 performance
  - `npx next build` — no "First Load JS" bundles > 150kB
  - Network tab: no render-blocking resources after optimization
- **Ralph Stop:** Core Web Vitals pass; Lighthouse ≥ 90; no oversized bundles.

### 10.5 SEO setup
- [x] **Status:** Complete
- **Acceptance Criteria:**
  1. All pages have unique `<title>` and `<meta name="description">` from CMS data
  2. Open Graph tags (og:title, og:description, og:image) set on all pages
  3. JSON-LD structured data: Organization (homepage), BreadcrumbList (all interior pages)
  4. Sitemap auto-generated at `/sitemap.xml` including all dynamic routes
  5. `robots.txt` configured to allow indexing, reference sitemap
- **Validation:**
  - `curl -s localhost:3000 | grep '<title>'` — unique title present
  - `curl -s localhost:3000/sitemap.xml | head -20` — valid sitemap XML
  - `curl -s localhost:3000/robots.txt` — contains Sitemap directive
  - Google Rich Results Test on homepage — Organization structured data valid
- **Ralph Stop:** All pages have metadata; sitemap and robots.txt generated; structured data validates.

---

<!-- CONTINUED: Phase 2 Epics 11-21 -->
# Phase 2 (73 tasks across 10 epics)

---

## Epic 11: Phase 2 CMS Collections (13 tasks)

### 11.1 Create `board-members` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Collection file exists at `src/collections/BoardMembers.ts` and is registered in `payload.config.ts`
  - Fields include `name` (text), `credentials` (text), `photo` (upload, 205x205), `role` (select: chair | vice-chair | voting-member | non-voting), `roleLabel` (text), `appointedDate` (date), `termExpires` (date), `bioPage` (relationship to pages), `sortOrder` (number)
  - Relationship field `board` (belongsTo boards) exists and filters correctly in admin
  - Seed script creates 5+ members per board (AcSB, PSAB, CSSB, AASB) with mixed roles
  - Admin panel shows member CRUD with photo upload working
- **Validation:**
  - `grep -r "board-members" src/collections/` returns collection definition
  - `npx payload migration:status` shows no pending migrations
  - Admin panel at `/admin/collections/board-members` loads with seeded data
- **Ralph Stop:** Collection CRUD works in admin, seed data visible, photo upload functional

### 11.2 Create `committees` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Collection file at `src/collections/Committees.ts` with fields: `name`, `slug` (auto), `description` (richText), `sortOrder` (number), `detailPageUrl` (text), `status` (select: active | inactive | archived)
  - `members` field is an array with sub-fields: `name` (text), `role` (text), `organization` (text)
  - Relationship `board` (belongsTo boards) exists
  - Seed data: 13 AcSB committees, 3+ PSAB, 3 AASB, 3+ CSSB committees
- **Validation:**
  - `grep -r "slug.*auto" src/collections/Committees.ts` confirms auto-slug
  - Admin panel at `/admin/collections/committees` shows seeded entries
- **Ralph Stop:** Committee entries render in admin with board relationships and member arrays populated

### 11.3 Create `resources` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title`, `slug` (auto), `date` (date), `category` (select: Article | Guidance | In Brief | Other | Webinar), `resourceType` (select: Audio | External Link | PDF | Video | Webpage | Plain Language), `excerpt` (textarea), `content` (richText)
  - Fields: `externalUrl` (text), `file` (upload), `status` (select: draft | published | archived)
  - Relationships: `board` (belongsTo boards), `standard` (belongsTo standards, optional)
  - 10+ seed resources across multiple boards and categories
- **Validation:**
  - `grep -r "resources" src/collections/` returns collection file
  - `npx payload migration:status` clean
- **Ralph Stop:** Resources CRUD works, file upload and external URL both function, seed data spans multiple categories

### 11.4 Create `effective-dates` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `standard` (relationship to standards), `introText` (richText)
  - `sections` array with sub-fields: `headerLabel` (text), `headerDate` (date), `sortOrder` (number), `rows` (array)
  - Row sub-fields: `application` (richText), `pronouncement` (text), `footnoteRef` (text)
  - `footnotes` array with sub-fields: `marker` (text), `text` (richText)
  - Seed: 1 full IFRS effective dates table with 13 sections and sample rows
- **Validation:**
  - `grep -r "effective-dates" src/collections/` returns definition
  - Admin panel shows nested sections/rows/footnotes editing
- **Ralph Stop:** Admin can create effective dates with nested sections, rows render in correct hierarchy

### 11.5 Create `documents-for-comment` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title`, `slug` (auto), `group` (select: exposure-draft | consultation-paper | re-exposure-draft | discussion-paper), `status` (select: open | closed), `documentUrl` (text), `commentSubmitUrl` (text), `commentsPdfUrl` (text), `sortOrder` (number), `publishedDate` (date)
  - Relationships: `standard` (belongsTo standards), `board` (belongsTo boards)
  - Seed: 4+ open documents, 4+ closed documents across IFRS and ASPE
- **Validation:**
  - `grep "group.*exposure-draft" src/collections/DocumentsForComment.ts` confirms enum values
  - Admin filter by status returns correct open/closed split
- **Ralph Stop:** Documents grouped by type visible in admin, open/closed status filtering works

### 11.6 Create `document-details` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title`, `slug` (auto), `highlights` (richText), `bodyContent` (richText blocks)
  - `commentQuestions` array: `questionNumber` (number), `questionText` (richText)
  - `replyDeadline` (date), `howToReply` group: `heading`, `body`, `ctaLabel`, `ctaHref`, `contactName`, `contactTitle`, `contactAddress` (richText), `contactEmail` (email)
  - `supportMaterials` array: `label` (text), `url` (text), `fileType` (select)
  - Relationships: `standard`, `board`, `staffContacts` (hasMany contacts)
  - Seed: 3+ full document detail pages with questions, deadlines, support materials
- **Validation:**
  - `grep -r "commentQuestions" src/collections/DocumentDetails.ts` confirms array field
  - Admin panel renders nested howToReply group fields
- **Ralph Stop:** Full document detail entries editable in admin with all nested groups/arrays populated

### 11.7 Create `form-submissions` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `fullName` (text, required), `title` (text), `organization` (text), `email` (email, required), `businessPhone` (text), `comments` (textarea, required), `submittedAt` (date, auto), `status` (select: new | read | replied)
  - Admin panel list view shows status column with filter support
  - No public API endpoint (admin-only collection)
- **Validation:**
  - `grep "status.*new.*read.*replied" src/collections/FormSubmissions.ts` confirms enum
  - Admin list at `/admin/collections/form-submissions` renders with status filters
- **Ralph Stop:** Form submissions viewable in admin with status tracking functional

### 11.8 Create `job-postings` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title` (text, required), `department` (text), `location` (text), `description` (richText), `summary` (textarea), `postedDate` (date), `closingDate` (date), `externalUrl` (text), `status` (select: draft | published | closed)
  - Seed: 2 sample postings (1 published, 1 closed)
  - Admin list view filterable by status
- **Validation:**
  - `ls src/collections/JobPostings.ts` confirms file exists
  - Admin panel shows 2 seeded postings with correct statuses
- **Ralph Stop:** Job postings CRUD works with published/draft/closed lifecycle visible in admin

### 11.9 Extend `pages` collection for Phase 2
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - New fields added: `sidebarType` (select: staff-contact | section-nav | none), `staffContacts` (array or relationship to contacts), `sectionNavLinks` (array: label, href, isActive)
  - New fields: `ctaBlock` group (heading, description, buttonLabel, buttonHref, variant: light | dark-purple), `newsSection` (checkbox), `board` (relationship to boards)
  - T15 fields: `formConfig` group (captchaEnabled checkbox), `mediaInquiries` group (heading, contactName, contactTitle, contactEmail, contactPhone)
  - T17 fields: `listingHeading` (text), `emptyStateMessage` (richText), `layout` (select: default | simple-content)
- **Validation:**
  - `grep "sidebarType" src/collections/Pages.ts` confirms new field
  - Admin panel page editor shows all new field groups
- **Ralph Stop:** Pages collection supports T3A, T3B, T15, T17 layout variants, all new fields editable in admin

### 11.10 Extend `news` collection for Phase 2
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - New field: `externalUrl` (text) for external link items
  - New field: `isVolunteerOpportunity` (checkbox) for volunteer listings
  - Updated `category` enum includes: Document for Comment, International Activity, Meeting Summary, News, Resource
  - 5+ additional seed news items across new categories
- **Validation:**
  - `grep "isVolunteerOpportunity" src/collections/News.ts` confirms field
  - `grep "International Activity" src/collections/News.ts` confirms updated enum
- **Ralph Stop:** News collection supports T12 category filtering and volunteer opportunity variant

### 11.11 Create `standards-sections` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title`, `slug`, `boardLogo` (upload), `boardName` (text)
  - `tabs` array: `label` (text), `href` (text), `isActive` (checkbox) — supports 5-6 tabs
  - `featureCTAs` array: `heading`, `description`, `buttonLabel`, `buttonHref`, `variant` (select: light | dark-purple)
  - Relationships: `board` (belongsTo boards), `activeProjects` (hasMany projects)
  - Seed: 4 standards sections (IFRS with 6 tabs, ASPE/Sustainability/CAS with 5 tabs)
- **Validation:**
  - `grep "featureCTAs" src/collections/StandardsSections.ts` confirms array field
  - Admin shows 4 seeded standards sections with configured tabs
- **Ralph Stop:** Standards overview config fully editable in admin with tab arrays and CTA blocks

### 11.12 Create `auth-config` global
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Global (not collection) at `src/globals/AuthConfig.ts` registered in payload config
  - Fields: `usernameLabel`, `passwordLabel`, `buttonLabel`, `forgotUsernameLabel`, `forgotUsernameUrl`, `forgotPasswordLabel`, `forgotPasswordUrl`
  - Fields: `registerPrompt`, `registerLinkLabel`, `registerUrl`
  - Fields: `cpaExplanation` (richText), `cpaLoginUrl`
  - Fields: `supportHeading`, `supportEmail`, `supportPhoneTollFree`, `supportPhoneIntl`
  - Seeded with live site values
- **Validation:**
  - `grep -r "auth-config" src/globals/` returns global definition
  - Admin at `/admin/globals/auth-config` shows all fields populated
- **Ralph Stop:** Auth page content fully CMS-editable via global config

### 11.13 Extend `events` / create `meetings` collection
- [x] **Status:** Complete (2026-03-05)
- **Acceptance Criteria:**
  - Fields: `title`, `slug` (auto), `date` (date), `excerpt` (textarea), `content` (richText)
  - Fields: `type` (select: meeting | event | webinar | decision-summary), `status` (select: draft | published | archived)
  - Relationship: `board` (belongsTo boards)
  - Query support: upcoming (date >= today, sort asc) and past (date < today, sort desc)
  - Seed: 10+ meeting summaries per board (AcSB, PSAB)
- **Validation:**
  - `grep "type.*meeting.*event.*webinar" src/collections/Meetings.ts` confirms type enum
  - API query with `where[date][greater_than_equal]` returns upcoming items sorted ascending
- **Ralph Stop:** Meetings/events support upcoming/past split queries with correct sort ordering

---

## Epic 12: Content Page Templates (6 tasks)

### 12.1 Build `<StaffContactCard />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/StaffContactCard.tsx` with typed props: `contacts: Array<{ name: string; title: string; phone: string; email: string }>`
  - Purple H2 heading "Staff Contact(s)" using `color: rgb(96, 31, 91)`
  - Each contact renders: bold name, title/role, phone as `tel:` link with icon, email as `mailto:` link with icon
  - Multiple contacts separated by visual divider (HR or border)
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "rgb(96, 31, 91)" src/components/StaffContactCard.tsx` confirms purple heading color
  - Component renders correctly at 390px and 1440px viewport widths
- **Ralph Stop:** Contact card renders with phone/email links functional, multiple contacts display with dividers

### 12.2 Build `<SectionNavSidebar />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/SectionNavSidebar.tsx` with props: `sectionLabel: string`, `links: Array<{ label: string; href: string; isActive: boolean }>`
  - Active link styled: bold text + underline, no color change
  - Non-active links show underline on hover
  - Mobile (< 768px): drops below main content as vertical link list
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "isActive" src/components/SectionNavSidebar.tsx` confirms active state handling
  - Renders correctly in both desktop sidebar and mobile stacked layout
- **Ralph Stop:** Section nav renders with active state distinction, mobile layout drops below content

### 12.3 Build `<SectionTabs />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/SectionTabs.tsx` with props: `tabs: Array<{ label: string; href: string; isActive: boolean }>`
  - Active tab has bottom border highlight (purple/brand) and bold text
  - Each tab is an `<a>` navigating to its own route (not client-side switch)
  - Mobile: horizontal scroll with `overflow-x: auto`
  - Supports up to 7 tabs
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "overflow" src/components/SectionTabs.tsx` confirms mobile scroll handling
  - Tab navigation performs full page navigation to href
- **Ralph Stop:** Tabs render with active state, navigation works, horizontal scroll on mobile

### 12.4 Build Template 3A: Content Page + Staff Contact Sidebar
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[...slug]/page.tsx` handles dynamic catch-all with sidebar logic
  - Layout: ~70% main / ~30% right sidebar when `sidebarType === 'staff-contact'`
  - Main renders: breadcrumbs, section tabs, H1, rich text body, optional CTA block (dark purple), optional news section
  - Sidebar renders `<StaffContactCard />` with sticky positioning on desktop
  - Mobile: sidebar drops below main content, full width
- **Validation:**
  - `grep "sidebarType.*staff-contact" app/(frontend)/` confirms conditional rendering
  - Page renders at `/en/research-program` (or similar) with sidebar visible
  - Chrome DevTools responsive mode shows sidebar below content at 390px
- **Ralph Stop:** Content page with staff contact sidebar renders, sticky sidebar works on desktop, mobile stacks correctly

### 12.5 Build Template 3B: Content Page + Section Nav Sidebar
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Same catch-all route as 12.4, conditionally renders when `sidebarType === 'section-nav'`
  - Main: breadcrumbs, section tabs, H1, rich text body
  - Sidebar: `<SectionNavSidebar />` with sibling page links
  - Mobile: sidebar drops below main content
  - About pages (Members, Committees, Terms of Reference) use this template
- **Validation:**
  - `grep "section-nav" app/(frontend)/` confirms conditional layout branch
  - Page renders with section nav sidebar showing sibling links
- **Ralph Stop:** Section nav sidebar renders with correct sibling links, active page highlighted

### 12.6 Build Template 17: Simple Content / Empty State
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/job-opportunities/page.tsx`
  - Full-width layout, no sidebar
  - Renders: H1 heading, rich text intro, HR divider, bold "Open Positions" heading, dynamic listing area
  - `<EmptyState />` component renders italic message when no jobs exist
  - `<JobCard />` component renders: title, department/location, posted date, summary, "View Details" CTA
  - `<JobListings />` fetches from `job-postings` collection, renders cards or empty state
- **Validation:**
  - `ls src/components/EmptyState.tsx src/components/JobCard.tsx src/components/JobListings.tsx` confirms all 3 components exist
  - Page renders empty state when no published jobs, cards when jobs exist
- **Ralph Stop:** Job opportunities page shows empty state or job cards depending on data, no filtering/sorting controls

---

## Epic 13: People & Organization (4 tasks)

### 13.1 Build `<MemberCard />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/MemberCard.tsx` with typed props: `member: { name: string; credentials: string; photo: string; role: string; roleLabel: string; appointedDate: string; termExpires: string; bioPageUrl: string }`
  - Photo renders at 205x205px square using `next/image`
  - Name is purple link navigating to `bioPageUrl`
  - Role label (CHAIR, VICE-CHAIR) rendered as uppercase bold for officers only
  - Appointment dates formatted: "Appointed: January 1, 2023" / "Term Expires: December 31, 2025"
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "205" src/components/MemberCard.tsx` confirms image sizing
  - Card renders with purple linked name, role badge, and formatted dates
- **Ralph Stop:** Member card renders all fields with correct formatting, photo sizing, and role label display

### 13.2 Build Template 4: People Listing (Members)
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[board]/about/members/page.tsx`
  - Layout: ~70% main (2-column card grid) + ~30% section nav sidebar
  - Section groups: CHAIR, VICE-CHAIR, VOTING MEMBERS with uppercase gray label dividers
  - Cards ordered: officers first (Chair, Vice-Chair), then alphabetical within Voting Members
  - Sidebar: `<SectionNavSidebar />` (About, Terms of Reference, Members, Due Process, etc.)
  - `generateStaticParams` generates one page per board
  - Mobile: cards stack single column, sidebar drops below
- **Validation:**
  - `grep "generateStaticParams" app/(frontend)/\[board\]/about/members/page.tsx` confirms SSG
  - Page renders 2-column grid on desktop, single column on mobile
  - Members sorted: Chair first, then Vice-Chair, then alphabetical voting members
- **Ralph Stop:** Board member listing pages render for all boards with correct grouping and sort order

### 13.3 Build `<AnchorNav />` component (scroll-spy sidebar)
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/AnchorNav.tsx` with "On this page" heading
  - Vertical list of anchor links corresponding to H2 headings on the page
  - Active state highlights current section using Intersection Observer scroll-spy
  - Sticky positioning on desktop, follows viewport on scroll
  - Mobile: collapses as expandable "On this page" accordion
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "IntersectionObserver" src/components/AnchorNav.tsx` confirms scroll-spy implementation
  - Clicking anchor link scrolls to correct H2 section
  - Active highlight updates on scroll
- **Ralph Stop:** Scroll-spy sidebar tracks current section, anchor links scroll correctly, mobile accordion works

### 13.4 Build Template 14: Committee Index / Directory
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[board]/committees/page.tsx`
  - Layout: ~70% main + ~30% `<AnchorNav />` sidebar
  - Each committee: H2 linked name (with auto-generated anchor ID) + description paragraph + optional "Learn more" link
  - Sidebar mirrors all H2 committee headings as anchor links
  - No pagination, no filters, no search — all committees on single page
  - `generateStaticParams` for SSG
  - Mobile: sidebar becomes collapsible "On this page" section above content
- **Validation:**
  - `grep "generateStaticParams" app/(frontend)/\[board\]/committees/page.tsx` confirms SSG
  - AcSB page renders 13 committee entries with working anchor links
  - Sidebar scroll-spy highlights current committee on scroll
- **Ralph Stop:** Committee directory renders all entries with anchor nav, scroll-spy functional

---

## Epic 14: Standards Section (6 tasks)

### 14.1 Build `<BoardLogoHero />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/BoardLogoHero.tsx` with props: `logo: string` (image path), `boardName: string`, `backgroundColor?: string`
  - Board crest/wordmark centered, full board name below
  - Brand-color background
  - Non-interactive, purely decorative/branding
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "BoardLogoHero" src/components/BoardLogoHero.tsx` confirms component export
  - Renders centered logo with board name at both mobile and desktop widths
- **Ralph Stop:** Hero banner renders with logo, board name, and brand background color

### 14.2 Build `<ActiveProjectsTable />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/ActiveProjectsTable.tsx` with props: `projects: Array<{ name: string; href: string; description: string }>`
  - Two-column table: "Project Name" and "Description" headers
  - Project name renders as purple link
  - Mobile: 2-column table becomes stacked cards (name above description)
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "Project Name" src/components/ActiveProjectsTable.tsx` confirms table headers
  - Table renders with purple linked names, responsive at 390px
- **Ralph Stop:** Projects table renders with linked names, mobile stacked card layout works

### 14.3 Build `<FeatureCTABlock />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/FeatureCTABlock.tsx` with props: `cards: Array<{ heading: string; description: string; buttonLabel: string; buttonHref: string; variant: 'light' | 'dark-purple' }>`
  - 1-2 CTA cards side by side
  - Light variant: gray background. Dark-purple variant: purple background with white text
  - Hover: subtle lift/shadow effect
  - Mobile: CTAs stack vertically
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "dark-purple" src/components/FeatureCTABlock.tsx` confirms variant handling
  - Both variants render correctly with hover effects
- **Ralph Stop:** CTA blocks render in both variants, hover animation works, mobile stacks vertically

### 14.4 Build Template 5: Standards Overview (Tabbed)
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[standard]/page.tsx`
  - Full-width layout with `<SectionTabs />` navigation (5-6 tabs)
  - Sections: `<BoardLogoHero />`, breadcrumbs, H1, `<SectionTabs />`, `<ActiveProjectsTable />`, `<FeatureCTABlock />`, News feed (3 items in 3-column cards)
  - IFRS gets 6th tab (IFRIC Agenda Decisions), others get 5
  - `generateStaticParams` for 11 standards sections
  - Wired to `standards-sections` collection
- **Validation:**
  - `grep "generateStaticParams" app/(frontend)/\[standard\]/page.tsx` confirms SSG
  - IFRS page shows 6 tabs, ASPE page shows 5 tabs
  - News feed renders 3 items in 3-column grid
- **Ralph Stop:** 11 standards overview pages render with correct tab counts, projects table, CTA blocks, and news feed

### 14.5 Build `<EffectiveDatesTable />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/EffectiveDatesTable.tsx` with props: `sections: Array<{ headerLabel: string; headerDate: string; rows: Array<{ application: RichText; pronouncement: string }> }>`, `footnotes: Array<{ marker: string; text: RichText }>`, `introText: RichText`
  - Purple section header rows (purple bg, white text) spanning full width
  - Two columns: Application (~65%) and Pronouncement (~35%)
  - Alternating white/light gray row backgrounds, dashed borders between rows
  - Footnotes at bottom with superscript markers
  - Mobile: single column stacked (Application first, then labeled Pronouncement)
  - Print-friendly: `@media print` styles prevent row breaks across pages
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "@media print" src/components/EffectiveDatesTable.tsx` confirms print styles
  - Purple section headers render, alternating row backgrounds visible
  - Mobile layout stacks columns correctly
- **Ralph Stop:** Effective dates table renders all sections with purple headers, footnotes, alternating rows, and print styles

### 14.6 Build Template 10: Effective Dates page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[standard]/effective-dates/page.tsx`
  - Full-width tabbed layout matching T5/T8 page chrome (section tabs present)
  - H1 "Effective Dates" followed by `<EffectiveDatesTable />`
  - Static content — no interactive elements, no filtering, no sorting, no pagination
  - All sections render on single page (long scroll)
  - `generateStaticParams` for 11 standards sections
  - Wired to `effective-dates` collection filtered by standard
- **Validation:**
  - `grep "generateStaticParams" app/(frontend)/\[standard\]/effective-dates/page.tsx` confirms SSG
  - Page renders complete table with all sections visible on scroll
- **Ralph Stop:** Effective dates pages render for all 11 standards with full table content, tab navigation functional

---

## Epic 15: Document Workflow (8 tasks)

### 15.1 Build `<TabPills />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/TabPills.tsx` with props: `options: Array<{ label: string; queryValue: string; isActive: boolean }>`, `paramName: string`
  - Active pill: filled dark background, white text
  - Inactive pill: outline/ghost styling, dark text
  - Tab switching uses query param (e.g., `?tab=closed-for-comment`) via full page navigation
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "queryValue" src/components/TabPills.tsx` confirms query param integration
  - Clicking pill navigates with updated query param in URL
- **Ralph Stop:** Pill toggle switches between states via URL query params, styling correct for both states

### 15.2 Build `<GroupedTable />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/GroupedTable.tsx` with props: `groups: Array<{ heading: string; rows: any[] }>`, `renderRow: (row: any) => ReactNode`
  - Gray banner section headers (full-width, `#f0f0f0` bg, bold text)
  - Alternating white/light gray data row backgrounds
  - Dashed border between rows within same group
  - Empty groups are not rendered
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "#f0f0f0" src/components/GroupedTable.tsx` confirms header background color
  - Component renders with grouped sections, empty groups hidden
- **Ralph Stop:** Grouped table renders section headers and rows with correct styling, empty groups omitted

### 15.3 Build `<DocumentRow />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/DocumentRow.tsx` with props: `document: { title: string; href: string; commentSubmitUrl?: string; commentsPdfUrl?: string; status: 'open' | 'closed' }`
  - Title as purple link to document detail page
  - "Submit comment" button (dark purple fill, white text) shown only for open documents
  - "View Comments" PDF link shown only for closed documents (when commentsPdfUrl exists)
  - Mobile: button stacks below title
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "commentSubmitUrl" src/components/DocumentRow.tsx` confirms conditional button rendering
  - Open document shows submit button, closed document shows view comments link
- **Ralph Stop:** Document rows render with correct action buttons per status

### 15.4 Build Template 8: Documents for Comment Listing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[standard]/documents/page.tsx`
  - Full-width tabbed layout with `<SectionTabs />`
  - H1 "Documents for Comment" followed by `<TabPills />` (Open/Closed), `<GroupedTable />` with `<DocumentRow />`
  - Default: Open tab active; `?tab=closed-for-comment` for Closed
  - Documents grouped by `group` field within each tab
  - `generateStaticParams` for 11 standards sections
- **Validation:**
  - `grep "tab=closed-for-comment" app/(frontend)/\[standard\]/documents/page.tsx` confirms query param
  - Open tab shows documents with submit buttons, Closed tab shows view comments links
  - Documents grouped under Exposure Drafts, Consultation Papers, etc.
- **Ralph Stop:** Documents for comment listing renders with tab switching, grouped display, and correct per-status actions

### 15.5 Build `<DarkPurpleCTA />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/DarkPurpleCTA.tsx` with props: `heading`, `body`, `ctaLabel`, `ctaHref`, `contactName`, `contactTitle`, `contactAddress`, `contactEmail`
  - Dark purple/near-black background (~rgb(50, 20, 50)) with white text
  - H3 heading, instruction paragraph, full mailing address, email as mailto link
  - "Submit comment" button (white text on contrasting button)
  - Full width on both desktop and mobile
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "mailto" src/components/DarkPurpleCTA.tsx` confirms email link
  - Component renders with dark background and white text
- **Ralph Stop:** Dark CTA block renders with all contact fields, mailto link, and submit button

### 15.6 Build `<BlockquoteQuestion />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/BlockquoteQuestion.tsx` with props: `questionNumber: number`, `questionText: RichText`
  - Bordered box with light background
  - "Question N" heading (e.g., "Question 1")
  - Static display — no expand/collapse, no form input
  - Full width on mobile with reduced horizontal padding
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "questionNumber" src/components/BlockquoteQuestion.tsx` confirms props
  - Renders bordered question box with number heading and rich text body
- **Ralph Stop:** Question blockquote renders with bordered styling, question number, and rich text content

### 15.7 Build `<SupportMaterialsList />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/SupportMaterialsList.tsx` with props: `materials: Array<{ label: string; url: string; fileType: string }>`
  - Chain-link icon prefix before each labeled document link
  - Links open PDF/external resource in new tab (`target="_blank"`)
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "target.*_blank" src/components/SupportMaterialsList.tsx` confirms new tab behavior
  - Links render with icon prefix and correct href
- **Ralph Stop:** Support materials list renders with icons and functional new-tab links

### 15.8 Build Template 9: Document Detail (Exposure Draft)
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[standard]/documents/[slug]/page.tsx`
  - Layout: ~70% main + ~30% `<StaffContactCard />` sidebar (sticky on desktop)
  - Main sections: H1, "Highlights" (purple heading + body), rich body content, "Comments Requested" with `<BlockquoteQuestion />` components, "When to Reply" (bold deadline date), `<DarkPurpleCTA />` "How to Reply" block, `<SupportMaterialsList />`
  - No "back to listing" link — navigation via breadcrumbs or tabs
  - Mobile: sidebar collapses below all main content
  - `generateStaticParams` for all document detail pages
  - Wired to `document-details` with depth:2 (populate staffContacts, standard, board)
- **Validation:**
  - `grep "depth.*2" app/(frontend)/\[standard\]/documents/\[slug\]/page.tsx` confirms depth population
  - Page renders all sections in correct order with staff contact sidebar
  - Mobile layout stacks sidebar below content
- **Ralph Stop:** Full exposure draft detail pages render with all content sections, sticky sidebar, and populated relationships

---

## Epic 16: Listings (7 tasks)

### 16.1 Build `<CategoryPills />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/CategoryPills.tsx` with props: `options: Array<{ label: string; value: string; isActive: boolean }>`, `onChange: (value: string) => void`
  - "All Items" as first option (default active), resets filter
  - Active pill: filled/dark background, white text
  - Inactive pill: outline/ghost, dark text
  - Mobile (< 768px): collapses to `<select>` dropdown
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "select" src/components/CategoryPills.tsx` confirms mobile dropdown fallback
  - Desktop shows horizontal pill row, mobile shows dropdown
- **Ralph Stop:** Category pills render with active state, "All Items" default, mobile collapses to dropdown

### 16.2 Build `<SortFilterBar />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/SortFilterBar.tsx` with props: `sortOptions`, `itemsPerPageOptions`, `typeFilterOptions?`, `showDateRange?`
  - Sort By dropdown (Publication date: Newest / Oldest)
  - Items Per Page dropdown (10, 20, 30, All)
  - Optional Type filter dropdown
  - Optional Date range inputs (start/end with calendar picker, mm/dd/yyyy format)
  - Mobile: all fields stack vertically
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "itemsPerPageOptions" src/components/SortFilterBar.tsx` confirms prop
  - Desktop shows inline controls, mobile stacks vertically
- **Ralph Stop:** Sort/filter bar renders all control variants, date range picker functional when enabled

### 16.3 Build `<ListingItem />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/ListingItem.tsx` with props: `item: { date: string; categories: string[]; title: string; href: string; excerpt: string; isExternal?: boolean }`
  - Date formatted "Month DD, YYYY" above title
  - Category badge/chip(s) rendered
  - Title as purple linked text
  - External link icon when `isExternal` is true
  - 2-3 sentence excerpt, text only
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "isExternal" src/components/ListingItem.tsx` confirms external link handling
  - Item renders date, badges, purple title link, and excerpt
- **Ralph Stop:** Listing item renders all fields with correct formatting, external icon shows for external links

### 16.4 Build Template 11: Resources Listing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[standard]/resources/page.tsx`
  - Full-width tabbed layout with section tabs
  - Sections: breadcrumbs, H1 "Resources", `<CategoryPills />` (All Items, Article, Guidance, In Brief, Other, Webinar), `<SortFilterBar />` (type filter + date range), `<ListingItem />` list, `<Pagination />`
  - Client-side filtering with API route for pagination
  - API route: `GET /api/resources?board=...&category=...&type=...&sort=...&startDate=...&endDate=...&page=...&limit=...`
  - `generateStaticParams` for 11 standards sections
- **Validation:**
  - `ls app/api/resources/route.ts` confirms API route exists
  - Category pill filtering updates listing, pagination navigates pages
  - Date range filter returns correct subset of results
- **Ralph Stop:** Resources listing renders with all filters functional, pagination works, API returns filtered/paginated results

### 16.5 Build Template 12: Filtered News/Event Listing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Routes: `app/(frontend)/news-listings/page.tsx` and `app/(frontend)/[board]/news-listings/page.tsx`
  - Sections: breadcrumbs, H1 "News", `<CategoryPills />` (All Items, Document for Comment, International Activity, Meeting Summary, News, Resource), `<SortFilterBar />` (items per page + sort + date range, NO type filter), `<ListingItem />` list, `<Pagination />`
  - Volunteer variant at `/en/volunteer-opportunities`: board-based tabs (AASB, CSSB, PSAB, RASOC, AcSB) instead of category pills, pre-filtered to `isVolunteerOpportunity=true`
  - Board-specific news: pre-filtered to `board=boardSlug`
  - API route: `GET /api/news?board=...&category=...&sort=...&startDate=...&endDate=...&page=...&limit=...`
- **Validation:**
  - `ls app/api/news/route.ts` confirms API route exists
  - Global news listing shows all categories, board-specific listing is pre-filtered
  - Volunteer page shows board tabs instead of category pills
- **Ralph Stop:** News listings render (global + per-board + volunteer), filtering and pagination functional

### 16.6 Build `<TabToggle />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/TabToggle.tsx` with props: `options: Array<{ label: string; value: string; isActive: boolean }>`, `onChange: (value: string) => void`
  - Two-state toggle: active has filled/dark background with white text, inactive has outline/ghost
  - Stays as two side-by-side tabs on mobile (does NOT collapse to dropdown)
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "TabToggle" src/components/TabToggle.tsx` confirms component export
  - Toggle renders as two side-by-side buttons at all viewport widths
- **Ralph Stop:** Tab toggle renders correctly at all breakpoints, does not collapse on mobile

### 16.7 Build Template 13: Meetings & Events Listing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[board]/meetings-and-events/page.tsx`
  - Sections: breadcrumbs, H1 "Meetings & Events", `<TabToggle />` (Upcoming/Past), Items Per Page dropdown (10 default), meeting items list, `<Pagination />`
  - Meeting items: H2 linked title (purple text, often includes date) + excerpt paragraph
  - Default view: "Past meetings & events" tab active
  - No category filters, no sort, no date range
  - Server-side pagination (AcSB has 180+ items)
  - API route: `GET /api/meetings?board=...&timeframe=upcoming|past&page=...&limit=...`
  - Upcoming: date >= today, sort ascending. Past: date < today, sort descending
  - `generateStaticParams` for 5 boards
- **Validation:**
  - `ls app/api/meetings/route.ts` confirms API route exists
  - Past tab shows descending date order, Upcoming tab shows ascending
  - Pagination handles 180+ item dataset
- **Ralph Stop:** Meetings listing renders with tab toggle, correct date sorting per tab, server-side pagination for large datasets

---

## Epic 17: Forms & Auth (8 tasks)

### 17.1 Build `<ContactForm />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/ContactForm.tsx` with vertical stacked labeled inputs
  - Fields: Full Name* (text), Title (text), Organization (text), Email address* (email), Business Phone (tel), Comments* (textarea ~6 rows)
  - Client-side validation: required field check, email format validation
  - Inline error messages below each invalid field
  - Tab order: Full Name, Title, Organization, Email, Phone, Comments, CAPTCHA, Submit
  - Submit handler: server action POST, success shows confirmation, failure scrolls to first error
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "required" src/components/ContactForm.tsx` confirms required field validation
  - Form prevents submission with empty required fields, shows inline errors
  - Successful submission shows confirmation message
- **Ralph Stop:** Contact form validates all fields, displays inline errors, submits successfully with confirmation

### 17.2 Build `<ReCaptcha />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Install `react-google-recaptcha-v3` package
  - `<ReCaptchaProvider />` wrapper in root layout with site key from `RECAPTCHA_SITE_KEY` env var
  - `<ReCaptcha />` component executes reCAPTCHA action on form submit, returns token
  - Server-side verification: POST token to `https://www.google.com/recaptcha/api/siteverify`
  - `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` added to `.env.example`
  - Fallback: honeypot field if reCAPTCHA fails to load
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "RECAPTCHA_SITE_KEY" .env.example` confirms env vars documented
  - `grep "react-google-recaptcha-v3" package.json` confirms package installed
- **Ralph Stop:** Invisible reCAPTCHA v3 executes on submit, server validates token, honeypot fallback present

### 17.3 Build `<MediaInquiriesBlock />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/MediaInquiriesBlock.tsx` with props: `heading: string`, `contactName: string`, `contactTitle: string`, `contactEmail: string`, `contactPhone: string`
  - "Media Inquiries" heading
  - Contact card: name + credentials, title, email (mailto link), phone (tel link)
  - Wired to `pages.mediaInquiries` group fields
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "mailto" src/components/MediaInquiriesBlock.tsx` confirms email link
  - Block renders with all contact fields and functional links
- **Ralph Stop:** Media inquiries block renders contact info with working mailto and tel links

### 17.4 Build Template 15: Contact / Form Page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/contact-us/page.tsx`
  - Full-width, no sidebar layout
  - Sections: H1 "Contact Us", intro prose (rich text), `<ContactForm />` with `<ReCaptcha />`, Submit button (purple), `<MediaInquiriesBlock />`
  - Server action stores submission in `form-submissions` collection
  - ReCaptcha v3 validation on submit, honeypot fallback
  - Success state: "Thank you for contacting us. We will respond shortly."
- **Validation:**
  - `grep "form-submissions" app/(frontend)/contact-us/` confirms collection integration
  - Form submits, data appears in admin form-submissions collection
  - Success message displays after valid submission
- **Ralph Stop:** Contact form page submits to CMS, reCAPTCHA validates, success message shows, admin sees submission

### 17.5 Build `<LoginForm />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/LoginForm.tsx`
  - Username input (label: "User Name (email address):", type="text")
  - Password input (label: "Password:", type="password")
  - "Forgot your User Name?" link to `/en/my-account/forgot-username`
  - "Forgot your Password?" link to `/en/my-account/forgot-password`
  - "Log in" button (TWO WORDS, full-width purple)
  - Error display: "Invalid user name or password. Please try again." (generic, never field-specific)
  - No CAPTCHA, no "Remember me" checkbox
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "Log in" src/components/LoginForm.tsx` confirms two-word button label
  - `grep "forgot-username" src/components/LoginForm.tsx` confirms forgot link
  - Form validates empty fields, shows generic error on invalid credentials
- **Ralph Stop:** Login form renders with correct labels, forgot links, generic error message, and two-word "Log in" button

### 17.6 Build `<AuthLayout />` component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/AuthLayout.tsx` with props: `children: ReactNode`
  - Centered card/container wrapper with ~480px max-width
  - Used by login, register, forgot-password pages
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "480" src/components/AuthLayout.tsx` confirms max-width constraint
  - Layout centers content horizontally with constrained width
- **Ralph Stop:** Auth layout renders centered card container at ~480px max-width

### 17.7 Build `<SupportContactBlock />` and `<CpaExplanationBlock />`
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - `<SupportContactBlock />` at `src/components/SupportContactBlock.tsx`: "Support" heading, email (mailto), toll-free phone (tel link), international phone (tel link)
  - `<CpaExplanationBlock />` at `src/components/CpaExplanationBlock.tsx`: rich text explaining CPA Canada shared auth, link to `cpacanada.ca/en/login` (opens new tab)
  - Both wired to `auth-config` global
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `ls src/components/SupportContactBlock.tsx src/components/CpaExplanationBlock.tsx` confirms both files exist
  - Support block renders with functional mailto and tel links
  - CPA block renders with external link opening in new tab
- **Ralph Stop:** Both blocks render with correct content from auth-config global, all links functional

### 17.8 Build Template 16: Authentication Page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/my-account/login/page.tsx`
  - Full-width `<AuthLayout />` wrapper
  - Sections: `<LoginForm />`, HR, "Not registered yet?" + "Create My account" link (capital M, lowercase a), HR, `<CpaExplanationBlock />`, HR, `<SupportContactBlock />`
  - Auth: Aptify DB API integration via Next.js server actions
  - Session management: HTTP-only cookie with JWT token after Aptify validation
  - Rate limiting: 5 login attempts per 15 minutes
  - CSRF protection via Next.js server actions
  - Wired to `auth-config` global for all labels/URLs
- **Validation:**
  - `grep "Create My account" app/(frontend)/my-account/login/page.tsx` confirms exact casing
  - `grep "httpOnly" ` confirms HTTP-only cookie setting
  - Login with valid credentials sets session cookie, invalid shows error
- **Ralph Stop:** Login page renders all sections, auth flow sets HTTP-only JWT cookie, rate limiting active

---

## Epic 20: Gap Pages & Forms (10 tasks)

### 20.1 Build Annual Report page template
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[board]/about/annual-report/page.tsx`
  - Layout: Content page with section nav sidebar (reuse T3B pattern)
  - Main: H1 + rich text body + downloadable PDF links
  - Wired to `pages` collection with `layout === 'annual-report'`
- **Validation:**
  - `ls app/(frontend)/\[board\]/about/annual-report/page.tsx` confirms route exists
  - Page renders with sidebar navigation and PDF download links
- **Ralph Stop:** Annual report pages render for all boards with section nav and downloadable PDFs

### 20.2 Build Error Pages (404/500)
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - `app/not-found.tsx` — custom 404 page with brand colors and "Back to Home" CTA
  - `app/error.tsx` — custom 500 error page with brand colors and "Back to Home" CTA
  - Both include `<SiteHeader />` and `<SiteFooter />`
  - Minimal layout, no sidebar, no navigation beyond home link
- **Validation:**
  - `ls app/not-found.tsx app/error.tsx` confirms both files exist
  - Navigating to `/nonexistent-page` shows branded 404 page
  - Error boundary shows branded 500 page
- **Ralph Stop:** Both error pages render with brand styling, header/footer, and home CTA

### 20.3 Build RSS Feed endpoint
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/api/rss/route.ts` generates RSS XML feed
  - Includes news items, meeting summaries, documents for comment
  - Per-board feeds at `app/api/rss/[board]/route.ts`
  - Response header: `Content-Type: application/rss+xml`
  - Bilingual metadata (EN/FR separate feeds)
- **Validation:**
  - `curl -s http://localhost:3000/api/rss | head -5` returns valid XML with rss tag
  - `curl -sI http://localhost:3000/api/rss | grep Content-Type` returns `application/rss+xml`
  - Per-board feed at `/api/rss/acsb` returns board-filtered items
- **Ralph Stop:** RSS feeds return valid XML with correct content-type, board-specific feeds filter correctly

### 20.4 Build Decision Summaries Listing page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/[board]/decision-summaries/page.tsx`
  - Reuses listing pattern from T13 (Meetings & Events) without TabToggle (no upcoming/past split)
  - Items Per Page dropdown + `<Pagination />`
  - Wired to `decision-summaries` collection filtered by board
- **Validation:**
  - `ls app/(frontend)/\[board\]/decision-summaries/page.tsx` confirms route exists
  - Listing renders with pagination, no tab toggle present
- **Ralph Stop:** Decision summaries listing renders with pagination for all boards, no tab toggle

### 20.5 Build Registration form page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/my-account/register/page.tsx`
  - `<AuthLayout />` wrapper
  - Fields: Email (username), Password, Confirm Password, First Name, Last Name
  - Client-side validation: email format, password match, required fields
  - Server action: POST to Aptify DB API for account creation
  - Success: redirect to login with confirmation message
  - Wired to `auth-config` global for labels
- **Validation:**
  - `ls app/(frontend)/my-account/register/page.tsx` confirms route exists
  - Form validates password match, email format, required fields
  - Successful registration redirects to login page
- **Ralph Stop:** Registration form validates all fields, submits to Aptify, redirects to login on success

### 20.6 Build Forgot Username page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/my-account/forgot-username/page.tsx`
  - `<AuthLayout />` wrapper
  - Single field: Email address
  - Server action: POST to Aptify DB API for username recovery
  - Success: "An email has been sent with your username" message
- **Validation:**
  - `ls app/(frontend)/my-account/forgot-username/page.tsx` confirms route exists
  - Form submits and shows success message
- **Ralph Stop:** Forgot username page submits email, displays success confirmation message

### 20.7 Build Forgot Password page
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Route at `app/(frontend)/my-account/forgot-my-password/page.tsx`
  - `<AuthLayout />` wrapper
  - Single field: Username (email)
  - Server action: POST to Aptify DB API for password reset
  - Success: "A password reset link has been sent to your email" message
- **Validation:**
  - `ls app/(frontend)/my-account/forgot-my-password/page.tsx` confirms route exists
  - Form submits and shows success message
- **Ralph Stop:** Forgot password page submits username, displays success confirmation message

### 20.8 Build Member-Only Form Template
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Shared form component for Document Comment Submission, Event Registration, Volunteer Registration
  - Auth gate: redirects to login if not authenticated (Aptify session check)
  - Common fields: Name, Email, Organization + type-specific fields
  - Document Comment: textarea + file attachment (PDF/Word upload)
  - Volunteer Registration: textarea + CV upload
  - Event Registration: event selection + optional comments
  - Server action: validates Aptify session, sends email with attachments (no DB storage)
  - Success: confirmation message per form type
- **Validation:**
  - Unauthenticated access redirects to `/my-account/login`
  - Authenticated user can submit form with file attachment
  - Success confirmation displays after submission
- **Ralph Stop:** Member-only forms enforce auth gate, accept file uploads, send email on submit, show confirmation

### 20.9 Build Event Summary Table component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/EventSummaryTable.tsx` with props: `rows: Array<{ date: string; topic: string; decision: string }>`
  - Three columns: Date, Topic/Item, Decision/Action
  - Responsive: table becomes stacked cards on mobile
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "EventSummaryTable" src/components/EventSummaryTable.tsx` confirms export
  - Table renders with 3 columns on desktop, stacked cards on mobile
- **Ralph Stop:** Event summary table renders with correct columns, mobile layout stacks as cards

### 20.10 Build Meeting Topics Table component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Component at `src/components/MeetingTopicsTable.tsx` with props: `topics: Array<{ topic: string; description: string; status: string }>`
  - Three columns: Topic, Description, Status/Outcome
  - Responsive: table becomes stacked cards on mobile
  - Co-located `.stories.tsx` file with Default, variant, and edge case stories
- **Validation:**
  - `grep "MeetingTopicsTable" src/components/MeetingTopicsTable.tsx` confirms export
  - Table renders with 3 columns on desktop, stacked cards on mobile
- **Ralph Stop:** Meeting topics table renders with correct columns, mobile layout stacks as cards

---

## Epic 18: Bilingual i18n (5 tasks)

### 18.1 Configure Next.js i18n routing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Locale-based routing: `/en/...` and `/fr/...` paths both resolve
  - App Router `[locale]` segment configured in route structure
  - Default locale: `en`
  - Middleware handles locale detection and redirect (no-locale URL redirects to `/en/...`)
- **Validation:**
  - `grep "locale" middleware.ts` confirms middleware locale handling
  - `curl -sI http://localhost:3000/ | grep Location` redirects to `/en/`
  - `/en/about` and `/fr/about` both resolve without 404
- **Ralph Stop:** EN/FR URL routing functional, default locale redirects work, middleware detects locale

### 18.2 Add locale support to Payload CMS content model
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Payload config includes `localization` config with `locales: ['en', 'fr']`, `defaultLocale: 'en'`
  - All text/richText fields across collections support locale variants
  - Admin panel shows locale switcher for editing content in EN/FR
  - Creating bilingual content entry persists and retrieves both locale values
- **Validation:**
  - `grep "localization" src/payload.config.ts` confirms i18n config
  - Admin locale switcher toggles between EN and FR content editing
  - API query `?locale=fr` returns French content
- **Ralph Stop:** All CMS content supports EN/FR, admin locale switcher works, API returns locale-specific content

### 18.3 Build language switcher component
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Displays current language name ("English" or "Francais")
  - Click toggles to alternate locale, preserving current page path
  - Generates correct FR equivalent URL from EN URL and vice versa
  - Integrated into `<SiteHeader />` utility bar and `<MobileMenu />`
  - Edge case: pages existing in only one locale redirect to locale homepage
- **Validation:**
  - `grep "LanguageSwitcher" src/components/SiteHeader.tsx` confirms integration
  - Clicking switcher on `/en/about` navigates to `/fr/about`
  - Switcher on single-locale page redirects to homepage
- **Ralph Stop:** Language toggle switches locale in header/mobile menu, URL path preserved, edge cases handled

### 18.4 Create FR translation strings file
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Files: `messages/en.json` and `messages/fr.json`
  - Covers: navigation labels, filter labels, form labels, error messages, pagination text, CTA labels, empty state messages
  - FR URL slug mappings: 10 FR board slugs, 9 FR section slugs, 3 FR council slugs, 11 FR path segment translations
  - All UI text extracted from components into translation keys
- **Validation:**
  - `ls messages/en.json messages/fr.json` confirms both files exist
  - `node -e "const en=require('./messages/en.json'); const fr=require('./messages/fr.json'); console.log(Object.keys(en).length, Object.keys(fr).length)"` shows matching key counts
- **Ralph Stop:** Complete UI translation files for EN/FR with matching key sets and slug mappings

### 18.5 Implement hreflang and locale metadata
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - All pages include `<link rel="alternate" hreflang="en" href="..." />` and `<link rel="alternate" hreflang="fr" href="..." />`
  - `<html lang="...">` attribute set per locale
  - OpenGraph and Twitter Card metadata includes locale
  - Sitemap includes hreflang entries for both locales
- **Validation:**
  - `curl -s http://localhost:3000/en/about | grep hreflang` shows both EN and FR alternate links
  - `curl -s http://localhost:3000/en/about | grep 'html lang'` shows `lang="en"`
  - Sitemap XML includes xhtml:link entries with hreflang
- **Ralph Stop:** Search engines see correct hreflang tags, html lang attribute set, sitemap includes locale pairs

---

## Epic 21: Phase 2 Integration & Polish (6 tasks)

### 21.1 Seed CMS with Phase 2 sample data
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - 20+ board members across 4 boards with photos
  - 25+ committee entries across 4 boards
  - 30+ resource items across multiple categories and types
  - Effective dates tables for 3+ standards
  - 10+ documents for comment (open and closed)
  - 5+ document detail pages with full content
  - 50+ meeting/event items across boards
  - Contact form test submissions, 2 sample job postings
  - Auth-config global populated with live site values
- **Validation:**
  - `curl -s http://localhost:3000/api/board-members | python3 -c "import sys,json; print(len(json.load(sys.stdin)['docs']))"` returns 20+
  - Admin dashboard shows populated collections across all Phase 2 types
- **Ralph Stop:** All Phase 2 pages render with realistic content, no empty states on seeded pages

### 21.2 Phase 2 responsive testing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - All 13 gap templates tested at 390px, 768px, 1024px, 1440px viewports
  - Mobile adaptations verified: sidebar stacks below content, grid becomes single column, pills collapse to dropdown, tables become stacked cards
  - Horizontal scroll tabs work on narrow screens
  - Sticky sidebar behavior works on desktop for T3A, T9, T14
  - Error pages, RSS, registration, forgot username/password, member-only forms tested at all breakpoints
- **Validation:**
  - Chrome DevTools device mode screenshots at 390px and 1440px for each template
  - No horizontal overflow at any breakpoint
  - Cross-browser spot check in Safari and Firefox
- **Ralph Stop:** All Phase 2 pages responsive and cross-browser compatible at all 4 breakpoints

### 21.3 Phase 2 accessibility audit
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - WCAG 2.1 AA compliance for all Phase 2 templates
  - Keyboard navigation works: forms (T15, T16), tab toggles (T8, T13), anchor nav (T14), scroll-spy
  - Screen reader compatibility: form labels, error messages, table headers, section headers, reCAPTCHA
  - Color contrast passes: purple headers on white, white on dark purple CTA, alternating row backgrounds
  - Focus management: form submit scrolls to first error, tab switching maintains focus
- **Validation:**
  - `npx axe-core-cli http://localhost:3000/en/contact-us` returns 0 violations
  - Tab-key navigation through contact form follows correct order
  - Screen reader announces form labels and error messages
- **Ralph Stop:** All Phase 2 pages meet WCAG 2.1 AA with zero automated violations

### 21.4 Phase 2 performance optimization
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Core Web Vitals passing on all Phase 2 pages (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  - Member photos optimized (205x205px via next/image with proper sizing props)
  - Server/client component split: listings with filters use client components, static pages use server components
  - Server-side pagination for meetings (180+ items) avoids client-side data loading
  - Effective dates table (13+ sections) renders without layout jank
  - Bundle analysis shows no oversized Phase 2 chunks
- **Validation:**
  - Lighthouse performance score >= 90 on representative Phase 2 pages
  - `npx next build` output shows no pages exceeding 300KB first load JS
  - `next/image` used for all member photos with width/height props
- **Ralph Stop:** Phase 2 pages meet Core Web Vitals targets, bundle sizes reasonable, no render jank

### 21.5 Phase 2 SEO setup
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Metadata (title, description, og:image) set for all Phase 2 page types
  - Structured data added: Person (members), Organization (committees), FAQPage (if applicable)
  - Sitemap updated with all Phase 2 routes
  - robots.txt includes Phase 2 paths
  - Bilingual SEO: hreflang tags and locale-specific metadata present
- **Validation:**
  - `curl -s http://localhost:3000/en/acsb/about/members | grep 'og:title'` returns metadata
  - `curl -s http://localhost:3000/sitemap.xml | grep "members"` confirms Phase 2 routes in sitemap
  - Google Rich Results Test validates structured data on member pages
- **Ralph Stop:** Phase 2 pages fully indexed with correct SEO metadata, structured data, and sitemap entries

### 21.6 End-to-end integration testing
- [ ] **Status:** Not started
- **Acceptance Criteria:**
  - Contact form flow: submit form, verify data in form-submissions collection, admin notification
  - Login flow: authenticate, verify session cookie set, access protected pages
  - Document comment flow: listing page, navigate to detail, submit comment
  - Bilingual navigation: EN page, click language switch, verify FR equivalent loads
  - Search integration: Phase 2 content types appear in search results (if Phase 1 search exists)
  - API routes: test with empty results, large datasets, invalid params
  - Registration flow: register, login, submit member-only form, verify email trigger
  - Recovery flows: forgot username and forgot password both send confirmation
  - RSS feed: validate XML output with standard RSS validator
- **Validation:**
  - `npx playwright test tests/e2e/phase2/` passes all integration tests
  - Manual walkthrough of contact form, login, document comment, and language switch flows
  - API edge cases return appropriate error responses (400/404) not 500s
- **Ralph Stop:** All Phase 2 user flows verified end-to-end, no broken flows, error handling graceful
