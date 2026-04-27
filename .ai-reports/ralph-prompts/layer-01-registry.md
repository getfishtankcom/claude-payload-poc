# Ralph Loop Prompt — Layer 1: Component Registry Expansion

## Your Mission

Expand the page builder component registry from 31 to 53 components. For every new component, you must: register it in `registry.ts`, write a preview renderer, apply template zone constraints, and create a Storybook story. Also add the `SiteAlert` global component. This layer feeds directly into the visual page builder and all future frontend pages.

**Estimated tasks:** 4 (1.1–1.4)
**Stop condition:** `<promise>LAYER 1 COMPLETE</promise>`
**Gate required:** No — but Storybook build must pass before Layer 2 begins.

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, Payload skill priority, Ralph loop workflow
2. `.ai-reports/MASTER_TODO.md` — find the "Layer 1" section; read every task entry
3. `.ai-reports/PRD-admin-panel.md` — Section 6.2 (Toolbox components) + Section 6.5 (Page Templates)
4. `src/admin/components/builder/registry.ts` — existing 31-component registry; understand the registration pattern before adding
5. `src/admin/components/builder/props-schema.ts` — existing props schema types; extend, don't replace

---

## Skills to Invoke

- `payload-super` — invoke before any Payload collection relationship or global changes (task 1.4)
- `storybook-story-writing` — invoke before writing stories (tasks 1.1–1.3)
- `/ui` — invoke for any styling/component questions

---

## Key Context

### Registry Pattern
Each component in `registry.ts` is registered as:
```typescript
{
  type: string,           // kebab-case slug, e.g. 'project-timeline'
  label: string,          // Human-readable, e.g. 'Project Timeline'
  category: 'content' | 'layout' | 'data' | 'interactive',
  icon: React.ComponentType,  // From heroicons/react
  allowedZones: string[],     // Zone names from template configs, or [] for "unrestricted"
  propsSchema: PropsSchema,   // See props-schema.ts for type definition
  renderComponent: React.ComponentType<any>,  // Live preview component
  previewRenderer: React.ComponentType<any>,  // Smaller thumbnail for toolbox
}
```

### Template Zone Names (from existing templates)
- `'main'` — primary content area (most components allowed)
- `'sidebar'` — right rail (restricted list)
- `'hero'` — hero section (only Hero Banner allowed)
- `'full-body'` — flexible page (unrestricted)
- `'newsletter'` — footer CTA area (only Subscribe Banner)
- `'tab-content'` — board detail tabs (most content components)
- `'results-zone'` — search/listing results (data widgets only)

### Preview Renderers
The `previewRenderer` is a compact card used in the toolbox. It should:
- Show a simplified version of the component at ~200×120px
- Use mock data (import from `src/__mocks__/cms-data.ts`, extend if needed)
- Be a pure display component — no hooks, no API calls

### Existing Component Count
The registry currently has **31 components** across 4 categories:
- Content Blocks: 10 (Rich Text, Heading, Image, Video, Accordion, Tabs, Table, Blockquote, Divider, Image Grid)
- Layout Components: 7 (Card Grid, 2-Column, 3-Column, Hero Banner, CTA Banner, Feature Row, Stats Bar)
- Data-Driven Widgets: 9 (Project List, News Feed, Event Calendar, Document Table, Contact Card, Board Members Grid, Consultation Countdown, Standards List, Effective Dates Table)
- Interactive Elements: 5 (Search Bar, Filter Panel, Newsletter Signup, Download Button, Anchor Link)

After this layer: **53 components** (22 new added).

---

## Tasks

### 1.1 Register 22 new components in registry.ts
Add all 22 components below to `registry.ts`. For each, write a `propsSchema` and a `renderComponent`. See the detailed specs below.

**New Components — Full Specs:**

#### project-timeline
- **Category:** data
- **Label:** Project Timeline
- **allowedZones:** `['main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    stages: {
      type: 'array',
      label: 'Stages',
      maxRows: 10,
      fields: {
        label: { type: 'text', required: true },
        status: { type: 'select', options: ['complete', 'in-progress', 'not-started'], default: 'not-started' },
        description: { type: 'textarea' },
        date: { type: 'text', label: 'Date (display text)' },
        ctas: {
          type: 'array', label: 'CTAs', maxRows: 3,
          fields: {
            label: { type: 'text', required: true },
            url: { type: 'text', required: true },
          }
        }
      }
    }
  }
  ```
- **Render:** Vertical stepper. Complete stages show filled checkmark, in-progress shows highlighted ring, not-started shows empty ring. CTA buttons render as inline links below the stage description.

#### quick-links
- **Category:** layout
- **Label:** Quick Links
- **allowedZones:** `['sidebar', 'main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Quick Links' },
    items: {
      type: 'array', label: 'Links', maxRows: 10,
      fields: {
        description: { type: 'text', required: true },
        url: { type: 'text', required: true },
        icon: { type: 'text', label: 'Icon name (heroicons)', placeholder: 'document-text' },
      }
    }
  }
  ```
- **Note:** Reusable for Board Detail sidebar AND Project Detail sidebar — just different content.

#### page-header
- **Category:** layout
- **Label:** Page Header
- **allowedZones:** `['main', 'full-body', 'tab-content']`
- **propsSchema:**
  ```typescript
  {
    title: { type: 'text', label: 'Title (leave blank to use page name)', placeholder: 'Custom title...' },
    showBreadcrumb: { type: 'checkbox', default: true },
  }
  ```

#### news-card-widget
- **Category:** data
- **Label:** News Card Widget
- **allowedZones:** `['main', 'tab-content', 'full-body', 'sidebar']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Latest News' },
    clarityText: { type: 'text', label: 'Subheading', placeholder: 'Stay up to date...' },
    viewAllUrl: { type: 'text', label: 'View All URL', default: '/news' },
    limit: { type: 'number', min: 1, max: 10, default: 3 },
    manualOverride: {
      type: 'relationship', relationTo: 'news', hasMany: true,
      label: 'Manual items (overrides dynamic fetch when set)',
    },
  }
  ```

#### drafts-card
- **Category:** data
- **Label:** Documents for Comment Card
- **allowedZones:** `['main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Documents for Comment' },
    clarityText: { type: 'text', placeholder: 'Open for public comment...' },
    viewAllUrl: { type: 'text', default: '/open-consultations' },
    limit: { type: 'number', min: 1, max: 10, default: 3 },
    manualOverride: { type: 'relationship', relationTo: 'document-for-comment', hasMany: true },
  }
  ```

#### events-card
- **Category:** data
- **Label:** Events Card
- **allowedZones:** `['main', 'tab-content', 'full-body', 'sidebar']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Upcoming Events' },
    clarityText: { type: 'text', placeholder: 'Meetings, webinars, deadlines...' },
    viewAllUrl: { type: 'text', default: '/events' },
    limit: { type: 'number', min: 1, max: 10, default: 3 },
    manualOverride: { type: 'relationship', relationTo: 'events', hasMany: true },
    showStartTime: { type: 'checkbox', label: 'Show start time (webinar events only)', default: false },
  }
  ```

#### promo-card-grid
- **Category:** layout
- **Label:** Promo Card Grid
- **allowedZones:** `['main', 'full-body']`
- **Note:** Homepage-only one-off. `allowedZones` is intentionally broad but used primarily on Homepage template.
- **propsSchema:**
  ```typescript
  {
    items: {
      type: 'array', label: 'Cards', maxRows: 8,
      fields: {
        label: { type: 'text', required: true },
        url: { type: 'text', required: true },
        icon: { type: 'text', label: 'Icon name (heroicons)' },
        board: { type: 'relationship', relationTo: 'boards', label: 'Associated board (optional)' },
      }
    }
  }
  ```

#### news-events-grid
- **Category:** layout
- **Label:** News / Events Grid
- **allowedZones:** `['main', 'full-body']`
- **Note:** 3-panel homepage section wrapping News Card Widget + Drafts Card + Events Card config in one component.
- **propsSchema:**
  ```typescript
  {
    newsConfig: {
      type: 'group', fields: {
        headline: { type: 'text', default: 'Latest News' },
        limit: { type: 'number', default: 3 },
        viewAllUrl: { type: 'text', default: '/news' },
      }
    },
    draftsConfig: {
      type: 'group', fields: {
        headline: { type: 'text', default: 'Documents for Comment' },
        limit: { type: 'number', default: 3 },
        viewAllUrl: { type: 'text', default: '/open-consultations' },
      }
    },
    eventsConfig: {
      type: 'group', fields: {
        headline: { type: 'text', default: 'Upcoming Events' },
        limit: { type: 'number', default: 3 },
        viewAllUrl: { type: 'text', default: '/events' },
      }
    },
  }
  ```

#### browse-by-standard
- **Category:** data
- **Label:** Browse by Standard
- **allowedZones:** `['main', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    categories: {
      type: 'array', label: 'Categories', maxRows: 6,
      fields: {
        heading: { type: 'text', required: true },
        items: {
          type: 'array', label: 'Links', maxRows: 20,
          fields: {
            label: { type: 'text', required: true },
            href: { type: 'text', required: true },
          }
        }
      }
    }
  }
  ```

#### right-rail-events-list
- **Category:** data
- **Label:** Right Rail Events List
- **allowedZones:** `['sidebar']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Upcoming Events' },
    events: { type: 'relationship', relationTo: 'events', hasMany: true },
    maxItems: { type: 'number', default: 5, max: 10 },
  }
  ```

#### right-rail-resource-list
- **Category:** data
- **Label:** Right Rail Resource List
- **allowedZones:** `['sidebar']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', default: 'Resources' },
    resources: { type: 'relationship', relationTo: 'resources', hasMany: true },
    autoIcon: { type: 'checkbox', label: 'Auto-detect file type icon', default: true },
  }
  ```

#### subscribe-banner
- **Category:** interactive
- **Label:** Subscribe Banner
- **allowedZones:** `['main', 'full-body', 'newsletter']`
- **propsSchema:**
  ```typescript
  {
    headline: { type: 'text', required: true, default: 'Stay Informed' },
    body: { type: 'textarea' },
    buttonText: { type: 'text', default: 'Subscribe' },
    hubspotFormId: { type: 'text', label: 'HubSpot Form ID', required: true },
    linkedinUrl: { type: 'text', label: 'LinkedIn URL (optional)' },
  }
  ```
- **Note:** Submits directly to HubSpot — not a generic form handler.

#### event-summary-table
- **Category:** data
- **Label:** Event Summary Table
- **allowedZones:** `['main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    event: { type: 'relationship', relationTo: 'events', label: 'Event' },
    columns: {
      type: 'array', label: 'Visible columns', maxRows: 8,
      fields: {
        key: { type: 'text', required: true },
        label: { type: 'text', required: true },
      }
    },
  }
  ```

#### member-action-form
- **Category:** interactive
- **Label:** Member Action Form
- **allowedZones:** `['main', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    formVariant: {
      type: 'select',
      options: ['attend', 'observe', 'volunteer', 'document-comment'],
      required: true,
    },
    heading: { type: 'text', required: true },
    description: { type: 'textarea' },
  }
  ```
- **Note:** Member-only form — renders login gate for non-members.

#### category-pills
- **Category:** interactive
- **Label:** Category Pills
- **allowedZones:** `['main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    categories: {
      type: 'array', label: 'Categories', maxRows: 12,
      fields: {
        label: { type: 'text', required: true },
        value: { type: 'text', required: true },
      }
    },
    defaultActive: { type: 'text', label: 'Default active value' },
    scopeCollection: {
      type: 'select',
      options: ['news', 'events', 'resources', 'projects', 'document-for-comment'],
      label: 'Filters this collection',
    },
  }
  ```

#### anchor-nav
- **Category:** interactive
- **Label:** Anchor Navigation
- **allowedZones:** `['sidebar', 'main', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    items: {
      type: 'array', label: 'Nav Items', maxRows: 12,
      fields: {
        label: { type: 'text', required: true },
        anchorId: { type: 'text', required: true, label: 'Target anchor ID (without #)' },
      }
    },
    sticky: { type: 'checkbox', default: true, label: 'Sticky on scroll' },
  }
  ```

#### meeting-topics-table
- **Category:** data
- **Label:** Meeting Topics Table
- **allowedZones:** `['main', 'tab-content', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    event: { type: 'relationship', relationTo: 'events', label: 'Meeting event' },
    searchable: { type: 'checkbox', default: false, label: 'Show search bar above table' },
  }
  ```

#### disclaimer
- **Category:** content
- **Label:** Disclaimer
- **allowedZones:** `['main', 'tab-content', 'full-body', 'sidebar']`
- **propsSchema:**
  ```typescript
  {
    content: { type: 'richtext', label: 'Disclaimer text' },
    variant: {
      type: 'select',
      options: ['bordered', 'highlighted', 'subtle'],
      default: 'bordered',
    },
  }
  ```

#### social-share
- **Category:** interactive
- **Label:** Social Share
- **allowedZones:** `['main', 'sidebar', 'full-body', 'tab-content']`
- **propsSchema:**
  ```typescript
  {
    platforms: {
      type: 'array', label: 'Platforms', maxRows: 4,
      fields: {
        platform: {
          type: 'select',
          options: ['twitter', 'linkedin', 'email', 'copy-link'],
          required: true,
        }
      }
    },
    shareUrl: { type: 'text', label: 'URL to share (blank = current page)' },
    shareTitle: { type: 'text', label: 'Title to share (blank = page title)' },
  }
  ```

#### related-content
- **Category:** data
- **Label:** Related Content
- **allowedZones:** `['main', 'sidebar', 'full-body', 'tab-content']`
- **propsSchema:**
  ```typescript
  {
    heading: { type: 'text', default: 'Related Content' },
    contentType: {
      type: 'select',
      options: ['news', 'projects', 'resources', 'events', 'document-for-comment'],
      required: true,
    },
    limit: { type: 'number', default: 3, max: 6 },
    autoPopulate: {
      type: 'checkbox',
      default: true,
      label: 'Auto-populate by matching tags and board',
    },
    manualOverride: { type: 'relationship', relationTo: 'pages', hasMany: true, label: 'Manual items (used when auto-populate is off)' },
  }
  ```

#### meeting-detail
- **Category:** data
- **Label:** Meeting Detail
- **allowedZones:** `['main', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    meeting: { type: 'relationship', relationTo: 'events', label: 'Meeting event', required: true },
    showAgenda: { type: 'checkbox', default: true },
    showMaterials: { type: 'checkbox', default: true },
  }
  ```

#### rss-link
- **Category:** interactive
- **Label:** RSS Link
- **allowedZones:** `['sidebar', 'main', 'full-body']`
- **propsSchema:**
  ```typescript
  {
    feedUrl: { type: 'text', required: true, label: 'RSS feed URL' },
    label: { type: 'text', default: 'Subscribe via RSS' },
    iconOnly: { type: 'checkbox', default: false, label: 'Show icon only (no label text)' },
  }
  ```

---

### 1.2 Write preview renderers for all 22 new components
Each component needs a `previewRenderer` — a compact card showing a simplified version of the component at ~200×120px. Rules:
- Pure display component — no API calls, no hooks that fetch
- Use mock data from `src/__mocks__/cms-data.ts` (add mocks if needed)
- Must render in Storybook without errors
- Preview should be recognizable at a glance — show the component's key UI pattern
- File location: `src/admin/components/builder/previews/` — create one file per component or group related ones

The 10 existing components may or may not have preview renderers — check and fill any gaps.

### 1.3 Write Storybook stories for all 22 new components
Create co-located `.stories.tsx` files alongside each component file (or in `src/admin/components/builder/previews/` for previews). Follow the CSF3 format from the project's existing stories.

Required stories per component:
- `Default` — all default props
- At least one variant where applicable (e.g., `WithManualOverride`, `Minimal`, `WithRelationship`)
- Edge case — empty data, long text, single item

Story structure:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta = {
  title: 'Builder/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { ...defaultProps } }
```

**Validation:** `npx storybook build --quiet` must exit 0 after all stories are written.

### 1.4 Add SiteAlert global component
- Create a `site-alert` Payload Global (in `src/globals/SiteAlert.ts`) with fields:
  ```typescript
  {
    enabled: { type: 'checkbox', default: false, label: 'Show alert banner' },
    message: { type: 'richtext', label: 'Alert message' },
    variant: { type: 'select', options: ['info', 'warning', 'error', 'success'], default: 'info' },
    dismissible: { type: 'checkbox', default: true },
    expiresAt: { type: 'date', label: 'Auto-hide after (optional)' },
  }
  ```
- Create `<SiteAlert />` React component at `src/components/SiteAlert.tsx` that:
  - Renders a top-of-page banner when `enabled === true` and `expiresAt` is in the future (or unset)
  - Uses the `variant` for color (info=blue, warning=yellow, error=red, success=green)
  - Shows a dismiss (×) button when `dismissible === true`, with localStorage persistence
  - Fetches the global on every page load (server component is fine — it's a single cheap query)
- Register `SiteAlert` in `payload.config.ts` globals array
- Mount `<SiteAlert />` in the root `app/(frontend)/layout.tsx` above the `<SiteHeader />`
- Write a Storybook story: `src/components/SiteAlert.stories.tsx`
- **Output:** Alert banner appears/disappears based on the global's `enabled` field

---

## Validation Gates (Layer 1 is complete when ALL of these pass)

```bash
# 1. TypeScript clean
npx tsc --noEmit

# 2. Production build
npm run build

# 3. Storybook builds cleanly
npx storybook build --quiet

# 4. Registry has 53 components
node -e "const r = require('./src/admin/components/builder/registry.ts'); console.log(Object.keys(r.registry).length)"
# Expected: 53 (or verify manually by counting in registry.ts)

# 5. SiteAlert global registered
grep -r "SiteAlert\|site-alert" src/payload.config.ts   # Must show registration
```

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 1" section → read all task entries
2. If Layer 1 section doesn't exist yet, ADD IT with tasks 1.1–1.4 as `[ ]` items
3. Find first `[ ]` task, mark `[~]`
4. Build it, validate, mark `[x]`, commit: `feat(layer-1): task 1.N — [short description]`
5. Continue until all tasks are `[x]`
6. Run full validation suite → update AUDIT_LOG.md → output stop condition

---

## Stop Condition

When ALL 4 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md` (date, Type: BUILD, Layer 1, tasks, files, deviations)
2. Create summary commit: `feat(layer-1): component registry expansion — all tasks complete`
3. Output EXACTLY:
```
<promise>LAYER 1 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Every acceptance criterion satisfied
2. `npx tsc --noEmit` passes
3. Task updated to `[x]` in MASTER_TODO.md
4. Git commit created
5. If the task creates a UI component, a co-located `.stories.tsx` exists and compiles

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose root cause, fix, re-validate
2. Second attempt: try alternative approach, re-validate
3. Third attempt: mark `[!]` with reason, move to next task

### HARD STOPS
Output `<promise>LAYER 1 ABORTED: [reason]</promise>` if:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict
- More than 5 structural TypeScript errors
- You detect you're in an infinite loop

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT mark tasks `[x]` before validation passes
- Do NOT skip reading MASTER_TODO.md at the start
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
- Do NOT skip stories — every new component gets a `.stories.tsx`
