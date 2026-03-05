# Ralph Loop Prompt — Epics 25 & 26: Page Builder

## Your Mission

Build the template-first visual page builder with component toolbox, placeholder zones, drag-and-drop, props drawer, responsive preview, and undo/redo. This is the most complex admin feature — the Sitecore Experience Editor equivalent.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 25 and Epic 26 tasks
3. `.ai-reports/PRD-admin-panel.md` — Section 6 (Page Builder) — the primary spec
4. `.ai-reports/research-sitecore-admin-interface.md` — Sections 3 (Experience Editor) + 4 (SXA)
5. `.ai-reports/wireframe-specs.md` — page layouts to derive template zone definitions

## Key Decisions (from PRD Section 14)

- **Template-first:** Pages start from templates with locked + editable zones. NOT blank canvas.
- **Versioning:** Page-level drafts. Editing creates a new draft version of the entire page.
- **Props panel:** Slide-out drawer (right side, 300px)
- **Components:** Code-only registration — Admins cannot create custom component types
- **Responsive:** 3 breakpoints — Desktop (1440px), Tablet (768px), Mobile (375px)

## Epic 25: Page Builder Core (tasks 25.1–25.7)

### 25.1 Page template system
- Define template zone configurations in code (`src/admin/templates/`):
  - Each template defines: locked zones (component + position) and editable zones (name + allowed component types)
  - Templates per PRD Section 6.5: Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search Results, Content Page, Flexible Page
- Add `template` select field to `pages` collection (select from template types)
- Add `layout` JSON field to `pages` collection (stores component placement per zone)
- Template selected on page creation, determines available zones
- **Output:** Template configs exist, pages have template + layout fields

### 25.2 Component registry
- Create `src/admin/components/registry.ts` — central registry of all page builder components
- Each component type registers (PRD Section 11.3):
  ```
  type, label, category, icon, thumbnail, allowedZones[], propsSchema, renderComponent
  ```
- 4 categories with all components from PRD Section 6.2:
  - **Content Blocks** (9): Rich Text, Heading, Image, Video, Accordion, Tabs, Table, Blockquote, Divider
  - **Layout Components** (7): Card Grid, 2-Column, 3-Column, Hero Banner, CTA Banner, Feature Row, Stats Bar
  - **Data-Driven Widgets** (7): Project List, News Feed, Event Calendar, Document Table, Contact Card, Board Members Grid, Consultation Countdown
  - **Interactive Elements** (5): Search Bar, Filter Panel, Newsletter Signup, Download Button, Anchor Link
- Props schemas define configurable fields per component (PRD Section 6.2 tables)
- Data-driven widgets support two data source modes: Manual (inline data) and Dynamic (collection + filters)
- **Output:** Registry exports all 28 component types with schemas

### 25.3 Page builder view (`/admin/builder/:id`)
- Custom Payload admin view at `/admin/builder/:id`
- Three-panel layout (PRD Section 6.1):
  - **Left:** Component Toolbox (collapsible, categorized)
  - **Center:** Page Canvas (iframe rendering the actual Next.js page)
  - **Right:** Props Drawer (slides out on component gear click)
- Toolbar above canvas: [Save] [Undo] [Redo] [Preview] [Desktop/Tablet/Mobile] Language: [EN/FR]
- Load page's `layout` JSON on mount, render zone structure
- Save button persists `layout` JSON back to Payload API
- "Open in Page Builder" button added to Payload's edit view for pages
- **Output:** Builder view renders with all 3 panels, loads/saves layout

### 25.4 Component toolbox (left panel)
- Categorized list of available components (PRD Section 6.2)
- Search bar at top to filter components
- Each component shows: icon + label
- Categories collapsible: Content, Layout, Data, Interactive
- Components are draggable — `@dnd-kit/core` drag source
- Toolbox collapses to icon-only strip when canvas is in tablet/mobile preview mode
- **Output:** Toolbox renders all 28 components, drag initiates correctly

### 25.5 Canvas with placeholder zones (center panel)
- Render page in iframe with `?preview=true&editing=true` query params
- Communication between admin and iframe via `postMessage` API:
  - Admin -> iframe: highlight component, select component, update component data
  - iframe -> admin: component clicked, component hovered, zone dimensions
- **Locked zones:** Gray dashed border, lock icon, "Locked" label. Not interactive.
- **Editable zones:** Blue dashed border, "Editable Zone" label, "+" button at bottom.
- Components in editable zones show chrome on hover (PRD Section 6.3):
  - Label (component type name), gear icon, drag handle arrows, X (remove)
- Drop targets: green highlight when dragging valid component over editable zone
- **Output:** Canvas renders page, zones visible, component chrome works

### 25.6 Drag-and-drop: toolbox to canvas + reorder
- Drag from toolbox -> drop into editable zone: creates new component instance
- Drag component within zone -> reorder (sort order changes)
- Drag component between editable zones (if multiple zones on template)
- Drop validation: check component's `allowedZones` against target zone name
- Invalid drops: red highlight, snap back to origin
- On drop: update `layout` JSON, re-render canvas via postMessage
- Use `@dnd-kit/core` + `@dnd-kit/sortable` for both toolbox-to-canvas and in-zone reordering
- **Output:** Drag from toolbox creates component, drag within zone reorders

### 25.7 Props drawer (right panel)
- Slides out (300px wide) when clicking gear icon on a component (PRD Section 6.4)
- Shows component label + close button at top
- Renders form fields based on component's `propsSchema`:
  - Text fields: `<Input />`
  - Select fields: `<Select />`
  - Rich text: Payload's Lexical editor (compact mode)
  - Media: media picker (from Epic 24)
  - Relationships: Payload relationship field
  - Arrays: add/remove/reorder items
- Data source mode toggle for data-driven widgets: Manual vs Dynamic
  - Manual: inline field editing
  - Dynamic: collection selector + filter config
- [Apply] and [Cancel] buttons
- Apply updates the component's props in `layout` JSON, triggers canvas re-render
- **Output:** Drawer opens with correct fields per component, Apply saves

## Epic 26: Page Builder Polish (tasks 26.1–26.5)

### 26.1 Responsive preview
- Toolbar toggles: [Desktop 1440px] [Tablet 768px] [Mobile 375px]
- Canvas iframe width changes with smooth CSS transition
- Toolbox collapses to icons on tablet/mobile preview
- Active breakpoint highlighted in toolbar
- Canvas centered within available space for smaller breakpoints
- **Output:** Breakpoint toggle resizes canvas, layout responds

### 26.2 Undo/redo
- Track layout state history (array of layout JSON snapshots)
- Undo: revert to previous state, re-render canvas
- Redo: advance to next state
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
- Toolbar buttons grayed out when no history available
- History cleared on save (or on page navigation)
- Max 50 history entries
- **Output:** Undo/redo works for all layout changes

### 26.3 Component copy/paste + duplicate
- Right-click component or gear menu: Copy, Paste, Duplicate
- Copy stores component JSON in clipboard (admin state, not system clipboard)
- Paste inserts copied component at cursor position in current zone
- Duplicate creates identical component directly below the source
- **Output:** Copy/paste/duplicate works within and across zones

### 26.4 Remove component
- X button on component chrome triggers confirmation: "Remove [Component Name]?"
- Confirmation shows component type and brief content preview
- Remove updates `layout` JSON, re-renders canvas
- Undo-able (tracked in undo history)
- **Output:** Remove works with confirmation, undo restores removed component

### 26.5 "Add Component" modal
- "+" button at bottom of editable zone opens component picker modal
- Searchable grid of available components (filtered by zone's allowed types)
- Shows: icon + label + brief description per component
- Categorized tabs: Content, Layout, Data, Interactive
- Click component to add it to the zone
- Alternative to toolbox drag-and-drop — more discoverable for new editors
- **Output:** Modal opens, search/filter works, selection adds component to zone

## Validation

```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # Page builder loads without errors
```

Per task:
- 25.1: Page with template "board-detail" shows correct locked + editable zones
- 25.2: `registry.ts` exports 28 components, each with propsSchema
- 25.3: `/admin/builder/:id` renders 3-panel layout, loads existing layout JSON
- 25.4: Search "card" in toolbox — filters to Card Grid. Drag Card Grid initiates DnD.
- 25.5: Canvas shows locked zones with lock icon, editable zones with blue border
- 25.6: Drag Rich Text from toolbox into main zone — component appears. Drag to reorder — order updates.
- 25.7: Click gear on Card Grid — drawer shows Columns, Style, Items fields. Change columns to 2, Apply — canvas updates.
- 26.1: Click Tablet — canvas shrinks to 768px, layout responds
- 26.2: Add component, Ctrl+Z — component removed. Ctrl+Shift+Z — component restored.
- 26.3: Right-click component, Duplicate — identical component appears below
- 26.4: Click X on component, confirm — removed. Ctrl+Z — restored.
- 26.5: Click "+" — modal shows components filtered by zone, select one — added

## Workflow

1. Read MASTER_TODO.md -> find first `[ ]` task in Epic 25 or 26
2. Mark `[~]`, build it, validate, mark `[x]`
3. Epic 25 first (core), then Epic 26 (polish) — sequential dependency
4. When ALL tasks in BOTH epics are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPICS 25 AND 26 COMPLETE</promise>
```

## IMPORTANT

- This is the HARDEST feature. Take it task by task. Don't try to build everything at once.
- The canvas iframe renders the actual Next.js frontend — you need a `?editing=true` mode in the frontend that:
  - Adds data attributes to components for identification
  - Sends postMessage events on hover/click
  - Listens for postMessage commands from the admin
- `@dnd-kit/core` handles ALL drag-and-drop (toolbox-to-canvas AND in-zone reordering)
- Layout JSON schema must be stable — changing it later breaks existing pages
- Props drawer fields should reuse Payload's field components where possible (Lexical editor, relationship picker, etc.)
- Page-level drafts: editing in the builder creates a draft version. Published version stays live until the draft is approved + published via the workflow.
- Reference Payload 3.x Live Preview docs via Context7 MCP for iframe communication patterns
