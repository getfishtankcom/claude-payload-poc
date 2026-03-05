# Ralph Loop Prompt — Epic 24: Media Library

## Your Mission

Build a folder-based media library browser for the admin panel, replacing Payload's default flat media list with a Sitecore-style folder tree + thumbnail grid. Includes upload, search, filter, grid/list toggle, media picker modal, and bulk operations.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 24 tasks
3. `.ai-reports/PRD-admin-panel.md` — Section 9 (Media Library)
4. `.ai-reports/research-sitecore-admin-interface.md` — Section 6.1 (Media Library)

## Key Decisions (from PRD Section 14)

- **Folder model:** Folder-based browser with tree hierarchy (NOT flat + tags)
- **Permissions:** No folder scoping — all editors access all folders
- **Picker integration:** Media picker modal used by fields and page builder components

## Tasks

### 24.1 Media folder collection
- Create `media-folders` collection in Payload:
  - Fields: `name` (text), `parent` (self-referential relationship), `sortOrder` (number)
- Seed initial folder structure: Images/ (Boards/, News/, Heroes/), Documents/ (PDFs/, Reports/), Logos/, Videos/
- API endpoint `GET /api/media-folders/tree` returning nested folder hierarchy
- **Output:** Folder collection exists, tree API returns folder structure

### 24.2 Media library view (`/admin/media`)
- Custom Payload admin view at route `/admin/media`
- Two-panel layout (PRD Section 9.1):
  - **Left panel:** Folder tree (reuse tree component patterns from Epic 23)
  - **Right panel:** Media grid showing items in selected folder
- Click folder in tree to filter media grid to that folder
- Breadcrumb showing current folder path above grid
- **Output:** Media library renders with folder navigation

### 24.3 Media grid + list toggle
- **Grid view (default):** Thumbnail cards showing: preview image (or file type icon for non-images), filename, file size
- **List view:** Table with columns: thumbnail, filename, type, size, dimensions, uploaded date, uploaded by
- Toggle button in toolbar: grid/list icon
- View preference persisted in localStorage
- Lazy-load thumbnails (intersection observer)
- Use Payload's built-in image resize for thumbnail generation
- **Output:** Both views render, toggle works, thumbnails lazy-load

### 24.4 Upload + drag-and-drop
- Upload button in toolbar opens file picker
- Drag-and-drop zone: drag files onto the grid area to upload
- Bulk upload: select multiple files at once
- Files uploaded to Payload's `media` collection with `folder` relationship field added
- Upload progress indicator per file
- Auto-assign uploaded files to currently selected folder
- Accepted types: Images (jpg, png, webp, svg, gif), Docs (pdf, docx, xlsx, pptx), Video (mp4, webm)
- **Output:** Upload works via button and drag-and-drop, files appear in correct folder

### 24.5 Search + filters
- Search bar in toolbar: full-text search across filename, alt text, title, description
- Filter dropdown: file type (Image, Document, Video, Audio, All)
- Search scoped to current folder + descendants (or global toggle)
- Results update grid in real-time
- Clear search button
- Use Payload's `where` query for filtering
- **Output:** Search finds media across folders, filters narrow by type

### 24.6 Media detail panel
- Click a media item to open detail panel (slide-out drawer or expanded card)
- Shows: full preview (image render or file icon), metadata fields:
  - Alt text (editable), Title (editable), Description (editable)
  - Filename, file type, dimensions (images), file size, uploaded by, upload date
- **Usage list:** which pages/components reference this media item (Payload relationship query)
- Save button for metadata edits
- Delete button (with confirmation: "This media is used by X pages. Delete anyway?")
- Alt text and title fields must be locale-aware (EN/FR) — Sitecore stored separate alt text per language while sharing one blob
- Description field also locale-aware
- This is critical for WCAG 2.1 AA bilingual compliance
- **Output:** Detail panel shows metadata, usage list, editable fields with per-locale alt text/title/description

### 24.7 Media picker modal
- Reusable modal component for field/component media selection
- Opens the media library as a modal overlay
- Same folder tree + grid as the full view, but compact
- "Select" button confirms choice and returns media reference to the calling field
- "Upload" option within modal for adding new media on the fly
- Used by: Image fields in Payload editor, Image component in page builder, any field needing media
- **Output:** Modal opens, browse/search/upload works, selection returns to calling field

### 24.8 Bulk operations
- Multi-select: checkboxes on each media item in grid view
- "Select All" checkbox in toolbar
- Bulk actions toolbar (appears when items selected):
  - **Move to...** — folder picker dialog
  - **Delete** — confirmation with usage check
  - **Download** — zip selected items
- Deselect all button
- Count indicator: "3 items selected"
- **Output:** Multi-select works, bulk move/delete execute correctly

### 24.9 Folder management
- **New Folder** button in left panel toolbar
- Right-click folder context menu: Rename, Delete (only if empty), Move
- Drag media items between folders (drag from grid, drop on folder in tree)
- Drag folders within tree to reorganize
- **Output:** Folders can be created, renamed, deleted, reorganized

## Validation

```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # Media library loads without errors
```

Per task:
- 24.1: `/api/media-folders/tree` returns nested folder JSON
- 24.2: Media library view renders at `/admin/media`, folder click filters grid
- 24.3: Grid/list toggle works, thumbnails lazy-load
- 24.4: Drag file onto grid — uploads to current folder, progress shown
- 24.5: Search "logo" — finds all logo files across folders
- 24.6: Click image — detail shows metadata, usage list, alt text editable
- 24.7: Open media picker from Image field — browse, select, reference returned
- 24.8: Select 3 items, click "Move to..." — items move to target folder
- 24.9: Right-click folder, Rename — folder name updates in tree

## Workflow

1. Read MASTER_TODO.md -> find first `[ ]` task in Epic 24
2. Mark `[~]`, build it, validate, mark `[x]`
3. When ALL tasks are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 24 COMPLETE</promise>
```

## IMPORTANT

- Extend Payload's existing `media` (upload) collection — do NOT create a separate media system
- Add a `folder` relationship field to the existing media collection pointing to `media-folders`
- Payload handles image resizing, focal point, and format conversion — use its built-in capabilities
- Media picker modal must be a reusable component importable by page builder and field editor
- Thumbnails: use Payload's auto-generated sizes (add a `thumbnail` size: 200x200 if not already defined)
- Reference Payload 3.x upload collection docs via Context7 MCP
- Media items share a single file across locales but alt text, title, and description must be per-locale (Payload's localization on fields)
