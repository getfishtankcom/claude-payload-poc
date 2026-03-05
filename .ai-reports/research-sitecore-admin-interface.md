# Sitecore 10.2 XM/SXA Admin Interface Research

> **Purpose:** Detailed reference for designing a familiar admin experience in Payload CMS + Next.js, targeting editors migrating FROM Sitecore.
> **Date:** 2026-03-04
> **Scope:** Sitecore 10.2 XP/XM with SXA (Sitecore Experience Accelerator)

---

## Table of Contents

1. [Content Tree / Item Browser](#1-content-tree--item-browser)
2. [Content Editor (Right Panel)](#2-content-editor-right-panel)
3. [Experience Editor (Visual/WYSIWYG)](#3-experience-editor-visualwysiwyg)
4. [SXA-Specific Features](#4-sxa-specific-features)
5. [Ribbon / Toolbar](#5-ribbon--toolbar)
6. [Other Admin Features](#6-other-admin-features)
7. [Pain Points / Limitations](#7-pain-points--limitations)
8. [Payload CMS Mapping Recommendations](#8-payload-cms-mapping-recommendations)

---

## 1. Content Tree / Item Browser

### 1.1 Tree Architecture

Sitecore uses a **hierarchical database model** where all content is organized in a parent/child tree structure. Every object in Sitecore is an "item" -- pages, components, data items, media, settings, templates -- they all live in the same tree. There is a **one-to-many** relationship: each parent can have many children, but each child can only have one parent.

The Content Editor is a **two-panel layout**:
- **Left panel:** The content tree (hierarchical item browser)
- **Right panel:** The item editor (fields, sections, tabs)

### 1.2 Tree Structure / Organization

The tree has several top-level nodes in the **Master database**:

```
/sitecore
  /content
    /Home                    <- Site root
      /About                 <- Page items
      /News                  <- Page items (may be bucketed)
      /Projects              <- Page items
      /Data                  <- Shared content/data items (not pages)
      /Settings              <- Site-level configuration
      /Presentation          <- Presentation configuration
  /media library             <- All media (images, PDFs, videos)
  /system                    <- System configuration, workflows, publishing
  /templates                 <- Template definitions (the "schemas")
  /layout                    <- Layout and rendering definitions
```

**SXA adds an additional layer:**
```
/sitecore/content
  /Tenant                    <- Multi-tenant container
    /Site                    <- Individual site
      /Home                  <- Site root page
      /Data                  <- Shared content datasources
      /Media                 <- Site-specific media
      /Settings              <- Site settings (page designs, rendering variants, etc.)
      /Presentation          <- Presentation details
```

### 1.3 Item Types

Any item in the tree can contain other items. However, items are categorized by their **template** (schema):

| Item Category | Description | Example Templates |
|---|---|---|
| **Page items** | Content pages that map to URLs | Article, Landing Page, Product Page |
| **Component/Data items** | Datasource items for renderings (components) | Promo Card, Hero Banner, Call to Action |
| **Folder items** | Organizational containers | Folder, Bucket Folder |
| **Media items** | Files stored in the Media Library | Image, PDF, Video |
| **Settings items** | Configuration data | Dictionary Entry, Redirect Rule |
| **Template items** | Schema definitions for other items | Template, Template Section, Template Field |
| **Layout/Rendering items** | Presentation definitions | Layout, Controller Rendering, View Rendering |

**Key distinction:** In Sitecore, "pages" and "data items" use the **same tree** -- there is no separate "pages" vs "content" split. The difference is whether the item has a layout assigned (making it a "page" with a URL) vs being a pure data item used as a component datasource.

### 1.4 Tree Icons and Visual Indicators

- **Item icons:** Each template defines an icon (16x16 pixel) shown in the tree. Different content types get different icons -- pages look like documents, folders look like folders, media items show file-type icons, etc. These are NOT standard folder/file icons; Sitecore uses its own icon set with many variations.
- **Gutter indicators:** The narrow pane to the LEFT of tree items. Right-click the gutter to enable indicators:
  - **Lock icon:** Shows when an item is locked (checked out) by a user, and by whom. Clicking it unlocks.
  - **Workflow state icon:** Shows current workflow state (e.g., Draft, Awaiting Approval, Approved). Clicking advances to next state if you have permission.
  - **Missing version icon:** Shows items that lack a version in the current language.
  - **Presentation overridden:** Indicates the item has custom presentation layout differing from its standard values.
  - **Broken links:** Flags items with broken internal references.
  - **Personalization:** Shows items with personalization rules applied.
  - **Item buckets:** Indicates bucketed items.
  - **Publishing warnings:** Flags items with publishing restrictions or issues.
- **Gutter limitation:** Only displays one icon at a time; hover to see others.

### 1.5 Right-Click Context Menu

Right-clicking an item in the tree reveals the context menu with these operations:

| Action | Description |
|---|---|
| **Insert** | Create a new child item -- shows allowed insert options based on template rules |
| **Copy To** | Copy item to another location in the tree |
| **Move To** | Move item to another location |
| **Duplicate** | Create a copy as a sibling |
| **Delete** | Delete the item (and optionally sub-items) |
| **Rename** | Rename the item (changes the display name / item name) |
| **Cut / Copy / Paste** | Clipboard operations |
| **Sorting** | Reorder siblings (move up/down, sort sub-items) |
| **Publishing** | Publish Now / Publish Item submenu for quick publishing |
| **Insert from Template** | Insert a new item based on a specific template |
| **Scripts** | PowerShell Extensions custom scripts (if SPE installed) |

The context menu is **extensible** -- defined in the core database at `/sitecore/content/Applications/Content Editor/Context Menues/Default`. Custom menu items can be added.

**Insert options** are controlled by "Insert Rules" on each template -- they define which child templates are allowed. This guides content authors to only insert valid content types in valid locations.

### 1.6 Drag and Drop

- Items can be **dragged and dropped** within the tree to move or reorder them.
- Drag to a different parent to move the item.
- Drop between siblings to reorder.
- The tree supports keyboard navigation and expand/collapse of nodes.

### 1.7 Multi-Select

- The Content Editor tree does **not natively support multi-select** for bulk operations in the tree panel itself.
- For bulk operations, editors typically use **Sitecore PowerShell Extensions (SPE)** or the **Workbox**.
- Individual items must be selected one at a time for editing.

### 1.8 Search Within Tree

- A **search bar** is available at the top of the content tree panel.
- Searches by item name, field values, or template type.
- Results appear inline, replacing the tree view.
- For bucketed items, search is the **primary navigation method** (see Item Buckets below).
- Search supports **faceted filtering** with configurable facets (template, date, author, etc.).

---

## 2. Content Editor (Right Panel)

### 2.1 Field Organization

When you select an item in the tree, the right panel shows the **Content tab** with the item's fields. Fields are organized into collapsible **sections** (field groups):

```
+---------------------------------------------+
|  Item: /content/Home/About                   |
|  Template: Content Page                      |
+---------------------------------------------+
|  v Content                                   |  <- Section (collapsible)
|    Title: [___________________________]      |  <- Single-Line Text field
|    Subtitle: [___________________________]   |
|    Body:  [Rich Text Editor area         ]   |  <- Rich Text field
|           [                              ]   |
|  v Navigation                                |  <- Another section
|    Show in Navigation: [x]                   |  <- Checkbox field
|    Navigation Title: [___________________]   |
|  v SEO                                       |
|    Meta Title: [_________________________]   |
|    Meta Description: [___________________]   |
|  v Appearance (Standard Field -- hidden by   |
|    default, toggle via View tab)             |
|    Icon: [...]                               |
|    Display Name: [_______________________]   |
+---------------------------------------------+
```

- Sections are defined at the **template level** -- each Template Section groups related Template Fields.
- Sections can be collapsed/expanded by clicking the section header.
- **Standard Fields** (from the Standard Template -- inherited by ALL items) are hidden by default. Toggle visibility from `View tab > Standard Fields checkbox`. These include: Created, Created By, Updated, Updated By, Workflow, Layout, Appearance, Insert Options, Publishing, Security, Statistics, etc.

### 2.2 Field Types

Sitecore provides a rich set of field types:

#### Simple Fields
| Field Type | UI Control | Storage |
|---|---|---|
| **Single-Line Text** | Text input | Plain text string |
| **Multi-Line Text** | Textarea | Plain text string |
| **Rich Text** | WYSIWYG HTML editor (Telerik RadEditor) | HTML string |
| **Integer** | Numeric input | Integer string |
| **Number** | Numeric input | Decimal string |
| **Date** | Date picker | ISO date string |
| **Datetime** | Date + time picker | ISO datetime string |
| **Checkbox** | Single checkbox | "1" or "" |

#### Link Fields
| Field Type | UI Control | Storage |
|---|---|---|
| **General Link** | Link dialog (internal, external, media, email, anchor, JavaScript) | XML fragment |
| **Internal Link** | Tree picker for internal items | Item path string |

#### Image/File Fields
| Field Type | UI Control | Storage |
|---|---|---|
| **Image** | Image picker with browse dialog, alt text, dimensions | XML fragment with media item ID |
| **File** | File picker | XML fragment with media item ID |

#### List/Selection Fields
| Field Type | UI Control | Storage |
|---|---|---|
| **Droplink** | Dropdown selecting a single item | GUID of selected item |
| **Droptree** | Tree picker selecting a single item | GUID of selected item |
| **Droplist** | Dropdown selecting a string value | String value |
| **Multilist** | Two-pane list (available -> selected) with ordering | Pipe-separated GUIDs |
| **Multilist with Search** | Same as Multilist but with search filtering | Pipe-separated GUIDs |
| **Treelist** | Tree browser for selecting multiple items | Pipe-separated GUIDs |
| **TreelistEx** | Lazy-loaded version of Treelist for performance | Pipe-separated GUIDs |
| **Checklist** | Checkboxes for multiple selection | Pipe-separated GUIDs |
| **Grouped Droplink** | Dropdown with items grouped by parent | GUID |
| **Grouped Droplist** | Dropdown with string values grouped | String value |
| **Name Value List** | Key-value pair editor | URL query string format |

#### Layout Fields
| Field Type | UI Control | Storage |
|---|---|---|
| **Layout** | Presentation details dialog | XML layout definition |
| **Rendering** | Rendering details | XML rendering reference |

**All list-type fields** that reference other items store pipe-separated GUIDs: `{GUID1}|{GUID2}|{GUID3}`

### 2.3 Field Validation Indicators

- **Required fields** show a red asterisk (*) or validation marker.
- After saving, validation errors appear as **red bar highlights** on invalid fields with error messages.
- The Review tab ribbon provides a **Validation** button that runs all validators on the item.
- Validators can be: Required, Regex Pattern, Max Length, Custom (C# code).
- Validation results show in a panel with severity levels: Error, Warning, Information.

### 2.4 Shared vs Versioned vs Unversioned Fields

This is a **critical Sitecore concept** that affects how content behaves across languages and versions:

| Field Behavior | Language Versions | Numbered Versions | Use Case |
|---|---|---|---|
| **Versioned** (default) | Yes -- separate per language | Yes -- separate per version | Most content fields (title, body, etc.) |
| **Unversioned** | Yes -- separate per language | No -- one value shared across all numbered versions within a language | Fields that vary by language but don't need versioning (e.g., URL slug) |
| **Shared** | No -- one value across ALL languages | No -- one value across ALL versions | Fields that are language-independent (e.g., a sort order number, an API key) |

- Sitecore displays a **hint indicator** next to fields that are Shared or Unversioned: `[shared]` or `[unversioned]` label.
- If no hint is displayed, the field is Versioned (the default).
- These settings are configured at the **template field level**, not per-item.

### 2.5 Language Versioning UI

- **Language selector** in the top toolbar/ribbon shows available languages.
- Clicking a language switches the entire Content Editor to show that language's field values.
- A flag icon indicates the current language.
- The **Versions tab** in the ribbon allows:
  - Adding a new language version
  - Viewing all language versions of the current item
  - Comparing versions side by side
  - Removing language versions
- **Missing version gutter icon** in the tree flags items that lack a version in the currently selected language.
- Content can be **copied between language versions** to seed translations.

### 2.6 Workflow State Indicators and Actions

- Workflow state is displayed in the **ribbon** (usually in the Review tab or a dedicated Workflow chunk).
- Current state shown as a label (e.g., "Draft", "Awaiting Approval", "Approved").
- **Workflow commands** (actions) appear as buttons: "Submit", "Approve", "Reject" -- whatever the workflow defines.
- The **gutter** shows workflow state icons next to items in the tree.
- Clicking workflow commands in the ribbon or gutter advances the item through the workflow pipeline.
- Comments can be added when executing workflow commands (e.g., rejection reason).
- Typical workflow states: Draft -> Awaiting Approval -> Approved/Published.
- As a minimum, each workflow must contain two workflow states -- the initial and final state.

### 2.7 Publishing Controls and Status

- **Publish ribbon tab** provides:
  - Preview button (opens the page in a new window)
  - Publish Item button (publishes just this item)
  - Publish Site button (publishes entire site)
  - Publishing Restrictions (set valid from/to dates, hide from publishing)
- **Publishing restrictions** set on an item:
  - Publishable checkbox (on/off)
  - Publishable from / Publishable to date range
  - Version-level publishing restrictions
- Items must be in an **Approved workflow state** (if workflow is assigned) to be publishable.

### 2.8 Lock / Unlock Mechanism

- Items must be **locked (checked out)** before editing. This prevents concurrent edits.
- Lock via: ribbon button, or the lock icon in the gutter.
- When locked, only the locking user can edit. Others see the item as read-only.
- **"Lock and Edit"** automatically creates a new numbered version -- e.g., if version 2 is published, locking creates version 3 for editing.
- Admins can unlock items locked by other users.
- Lock status is visible in the gutter and in the ribbon.

### 2.9 Raw Values View

- Toggle via `View tab > Raw Values` checkbox.
- Shows the raw stored values instead of rendered field controls -- e.g., GUIDs instead of item names, XML instead of rich text preview.
- Useful for debugging and developers, not typically used by content authors.

---

## 3. Experience Editor (Visual/WYSIWYG)

### 3.1 Overview

The Experience Editor (formerly Page Editor) is Sitecore's **WYSIWYG page editing** interface. It renders the actual page in an iframe with editing overlays ("chrome") on top. This is the primary editing tool for non-technical content authors.

### 3.2 Page Rendering and Editing Chrome

When the page loads in Experience Editor:
- The actual front-end page renders inside an iframe.
- Sitecore injects **editing chrome** -- colored borders, toolbars, and handles around each editable element.
- Two types of chrome:
  - **Placeholder chrome:** Dotted outline around placeholder regions where components can be added. Uses grey border styling via `@Html.Sitecore().ContainerChrome()`.
  - **Rendering/component chrome:** Colored border around each rendering (component) with a floating toolbar. Uses colored border styling via `@Html.Sitecore().WidgetChrome()`.
- Toggle chrome visibility via `View tab > Designing checkbox`.
- Chrome includes clickable headers in a clear hierarchy to demarcate placeholders and renderings.

### 3.3 Inline Editing

- **Text fields** (Single-Line, Multi-Line, Rich Text) can be edited directly on the page by clicking on them.
- The text becomes editable in-place -- no dialog needed.
- Rich Text fields show a floating formatting toolbar (bold, italic, links, etc.).
- **Image fields** can be swapped by clicking and using the image picker dialog.
- **Link fields** edited via a dialog that opens on click.
- Not all fields are inline-editable -- some require opening the component's properties dialog.

### 3.4 Adding / Removing / Reordering Components

**Adding a component:**
1. With Designing mode on, hover over a placeholder -- see the dotted outline with an "Add here" button.
2. Click the placeholder's "Add here" or drag a component from the **Toolbox** panel (right-side panel listing all available renderings).
3. A dialog appears: "Select a Rendering" -- shows only renderings allowed in that placeholder (based on Placeholder Settings).
4. Select the rendering and optionally choose a datasource item (or create new).

**Removing a component:**
1. Click the component to select it -- the floating toolbar appears.
2. Click the **"X" (Delete)** button on the floating toolbar.

**Reordering / Moving components:**
1. Select the component.
2. Click **"Move"** on the floating toolbar.
3. Click **"Move to here"** on the target placeholder's chrome.
4. In SXA, components can also be **dragged and dropped** between placeholders directly.

**Component floating toolbar actions:**
- Edit the component properties
- Move the component
- Delete the component
- Personalize the component
- Test the component (A/B)
- Select an associated content item (datasource)

### 3.5 Component Properties Panel

- Clicking "Edit" on the component toolbar opens a **properties dialog**.
- Shows all fields from the component's datasource item.
- Same field types as the Content Editor (text, image, link, list, etc.).
- Allows editing without leaving the page view.
- In SXA, also shows **Rendering Variant** selection and **Styles** checkboxes.

### 3.6 Preview vs Edit Mode Toggle

- **Edit mode:** Full chrome, editable fields, toolbars visible.
- **Preview mode:** Chrome hidden, page renders as visitors would see it. Toggle via ribbon.
- **Designing mode:** Toggle via `View > Designing` -- controls whether placeholder/rendering chrome borders are visible.

### 3.7 Device Preview (Responsive)

- The Experience Editor ribbon includes a **device simulation** feature.
- Predefined device profiles: Desktop, Tablet, Mobile (and custom).
- Simulates different viewport widths.
- Also used for **device-specific layouts** -- Sitecore can serve different component layouts per device.
- In practice, most modern implementations use responsive CSS rather than device-specific layouts.

### 3.8 Personalization and Testing Integration

**Personalization (built into Experience Editor):**
- Each component has a **personalization icon** on its floating toolbar.
- Opens the "Personalized experience dialog box".
- Add personalization rules with conditions from categories: Campaign, Date, Device, Location, GeoIP, Visitor behavior, Goals, etc.
- Each rule can: Hide the component, swap the datasource, swap the rendering entirely.
- Rules are evaluated **sequentially** -- first match wins for a given visitor.

**A/B Testing:**
- Each component can start a **content test** from the floating toolbar.
- The test creates a variant -- visitors are split between the default and personalized version.
- Uses **Subgroup Round Robin Sticky** strategy by default -- 50/50 split, sticky per visitor.
- Test results tracked via Sitecore Analytics (xDB) and viewable in the Experience Optimization dashboard.

---

## 4. SXA-Specific Features

### 4.1 Page Designs and Partial Designs

**Page Designs** define the overall component composition of a page:
- A page design is a **collection of partial designs** plus optional additional renderings.
- Assigned to page items via the `Page Design` field, or via wildcard rules (all items of template X use design Y).

**Partial Designs** are reusable layout fragments:
- Typically represent structural sections: Header, Footer, Sidebar, etc.
- Can **inherit from other partial designs** -- build complex from simple.
- Contain **placeholder settings** that define which renderings are allowed in each region.
- You add renderings to partial designs by dragging from the Toolbox in the Experience Editor.

```
Page Design: "Standard Page"
  +-- Partial Design: "Header"         (logo, nav, search)
  +-- Partial Design: "Sidebar"        (sidebar widgets)
  +-- Partial Design: "Footer"         (footer links, copyright)
  +-- Additional renderings:           (page-specific components)
```

### 4.2 Rendering Variants

Rendering Variants allow a **single rendering (component) to have multiple visual presentations** without creating separate renderings:

- Defined in Content Editor: `Presentation > Rendering Variants > [Rendering Name] > [Variant Definition]`
- Each variant definition contains sub-items that define the HTML output:
  - **Field** sub-item: renders a specific field
  - **Section** sub-item: wraps content in a tag
  - **Template** sub-item: defines custom HTML structure
  - **Reference** sub-item: follows a reference field to render related item data
  - **Token** sub-item: renders system tokens ($name, $date, etc.)
- Variants can be **conditionally shown/hidden** using Sitecore's Rules Engine.
- In Experience Editor, editors select the variant from the component's properties panel.

**Example:** A "Page Content" rendering could have variants: "Blog Post", "Press Release", "Event Summary" -- same rendering, different HTML output.

### 4.3 SXA Drag-and-Drop Page Building

In the Experience Editor with SXA:
- The **Toolbox** panel on the right lists all available SXA renderings, grouped by category:
  - Page Content, Page Structure, Navigation, Media, Search, Composites, etc.
- Editors **drag renderings from the Toolbox** and drop them onto placeholder regions on the page.
- Placeholder regions highlight when a valid rendering is dragged over them.
- This is the primary SXA content authoring paradigm -- **visual page composition**.

### 4.4 SXA Site Scaffolding

When creating a new SXA site, a **wizard** guides through setup:

1. **Tenant creation** -- the top-level container (for multi-site).
2. **Site creation** -- individual site within the tenant:
   - **Features tab:** Select which SXA features/modules to enable.
   - **Theme tab:** Choose the visual theme.
   - **Grid tab:** Select the grid system (Bootstrap 4, Grid 960, Foundation, custom).
3. Scaffolding **automatically creates** the full folder structure: Home, Data, Media, Settings, Presentation nodes.
4. Modules can be added to scaffolding templates for automatic inclusion in new sites.

### 4.5 Creative Exchange

Creative Exchange is an SXA workflow for **designer/developer handoff**:

- **Export:** Exports the current site as a ZIP package containing all base theme assets (HTML output, CSS, JS, images, fonts).
- **Import:** Designers modify the HTML/CSS/JS in their preferred tools, then re-import the ZIP.
- Allows front-end developers to work **in parallel** with Sitecore developers.
- The imported changes update the SXA theme items.

### 4.6 SXA Themes and Grid System

**Themes:**
- Each site has a **base theme** and a **site theme**.
- Base themes contain core styles and scripts.
- Site themes extend base themes with site-specific customizations.
- Themes are stored as items in the content tree (under Settings) and contain: CSS files, JS files, fonts, images.
- Themes can be edited via Creative Exchange or directly in the content tree.

**Grid System:**
- Selected during site creation.
- **Bootstrap** (responsive 12-column) is the most common choice.
- Grid 960 (fixed-width 12-column) is also available.
- Grid settings control how the SXA column splitter and layout components work.
- Custom grid systems can be registered.

### 4.7 SXA Content Tree Organization

SXA adds specific nodes under each site:

```
/Site
  /Home                          <- Page tree
  /Data                          <- Datasource items for renderings
    /Accordion                   <- Accordion data items
    /Carousels                   <- Carousel data items
    /Galleries                   <- Gallery data items
    /Links                       <- Reusable link items
    /Maps                        <- Map data items
    /Tabs                        <- Tab data items
    /...
  /Media                         <- Site-specific media
  /Settings
    /Page Designs                <- Page design definitions
    /Partial Designs             <- Partial design definitions
    /Rendering Variants          <- Variant definitions per rendering
    /Styles                      <- CSS class assignments per rendering
    /Site Grouping               <- Site hierarchy config
  /Presentation
    /Available Renderings        <- Renderings enabled for this site
    /Page Designs                <- Page design assignments
```

---

## 5. Ribbon / Toolbar

### 5.1 Content Editor Ribbon

The ribbon is a **tabbed toolbar** at the top of the Content Editor. Structure: **Tabs > Strips > Chunks > Buttons**.

#### Ribbon Tabs and Key Actions

| Tab | Purpose | Key Actions |
|---|---|---|
| **Home** | Core item operations | Save, Edit, Cut, Copy, Paste, Delete, Duplicate, Move, Rename, Sort sub-items, Insert child item, Insert from template |
| **Navigate** | Navigation shortcuts | Navigate to parent, Navigate to linked items, Links (shows all items linking to/from this item), Favorites, Recent items, Go to item by path/ID |
| **Review** | Content validation and workflow | Validate, Spelling, Workflow state display, Workflow command buttons (Submit, Approve, Reject, etc.), Markup (tracked changes, comments) |
| **Publish** | Publishing controls | Preview, Publish Item, Publish Site, Publishing Restrictions, Change publishing targets, Experience Editor launch |
| **Versions** | Language and numbered versions | Add Version, Remove Version, Compare Versions, Language selector/flag, Reset to standard values |
| **Presentation** | Layout and rendering configuration | Details (opens Presentation Details dialog for layout/rendering assignment), Preview, Aliases, Change Associated Content |
| **View** | Content Editor display options | Standard Fields toggle, Raw Values toggle, Tree panel options, Gutter options, Search panel, Bucket view |
| **Configure** (contextual) | Template-specific actions | Varies by template -- custom buttons, PowerShell scripts, etc. |
| **My Toolbar** | User-customized shortcuts | Users can pin frequently used actions here |

### 5.2 Presentation Details Dialog

Accessed from `Presentation tab > Details`:
- Shows the **layout** assigned to the item (the page "shell").
- Lists all **renderings** (components) assigned to the item with their:
  - Placeholder (which region of the page)
  - Datasource (which content item feeds the component)
  - Caching settings
  - Personalization rules
- Allows adding, removing, reordering, and configuring renderings.
- Shows **Shared Layout** (default from template) and **Final Layout** (item-specific overrides).
- This is the **developer-facing** way to manage page composition (vs the visual Experience Editor).

### 5.3 Experience Editor Ribbon

The Experience Editor has its own simplified ribbon:

| Tab | Purpose | Key Actions |
|---|---|---|
| **Home** | Core editing | Save, Insert (new page), Delete, Move First/Last, Sort, Change associated content |
| **Experience** | Page-level operations | Edit current item in Content Editor, View item info, Page-level personalization, Page testing |
| **Optimization** | Analytics and testing | Content testing controls, Personalization controls, Goal tracking |
| **View** | Display options | Designing toggle (show/hide chrome), Preview mode, Device simulation, Language selector |

---

## 6. Other Admin Features

### 6.1 Media Library Browser

A dedicated application accessible from the **Launchpad** or the Content Editor's bottom page bar.

- **Folder structure** mirrors the content tree model -- nested folders.
- **Upload methods:**
  - Drag and drop from Windows Explorer to the upload dialog.
  - "Upload files" button (basic -- single or multi-select with Ctrl+click).
  - "Upload files (advanced)" -- supports ZIP unpacking that preserves folder structure.
- **Metadata:** Each media item has fields: Alt Text, Title, Description, Keywords, Extension, Size, Dimensions (for images).
- **Best practice:** Mirror the website's page structure in media folders for organization.
- **Browsing:** Tree navigation in left panel, thumbnails/list in right panel. Search available.
- **Image editing:** Basic cropping and resizing within the Media Library.
- **Versioned media:** Media items support language versions (e.g., EN version of a PDF vs FR version).

### 6.2 Workbox

The Workbox is a **workflow management dashboard** accessible from the Launchpad:

- Shows **all items currently in workflows**, grouped by workflow state.
- For each workflow state, displays: item count badge, list of items.
- For each item: item name, path, last modified date, history of workflow actions, assigned user.
- Actions available per item:
  - Preview the item
  - Open in Content Editor
  - Compare versions
  - Execute workflow commands (Approve, Reject, etc.)
  - Add comments
- Filtered views: by workflow, by state, by user.
- The primary tool for **approval workflows** -- reviewers use the Workbox to see what needs attention.

### 6.3 Content Search and Filtering

Two search mechanisms:

**Content Editor Search:**
- Search bar at top of content tree.
- Full-text search across item names and field values.
- Powered by the configured search provider (Solr or Azure Search in 10.2).
- Results replace the tree view.
- Filter by: template type, location in tree, date range, field values.

**Item Buckets Search:**
- When an item is "bucketed" (converted to a bucket), its children are hidden from the tree.
- Access bucket contents via the **search interface** that replaces the tree for that item.
- Faceted search with configurable facets (stored at `/sitecore/system/Settings/Buckets/Facets`):
  - **Global facets:** Apply to all searches everywhere.
  - **Local facets:** Apply to a specific bucket or tree location.
- Default facets include: Template, Author, Date, Custom fields.
- Results displayed as a flat list with sort options.

### 6.4 Item Buckets for Large Content Sets

- **Problem:** Trees with thousands of children become unmanageable (e.g., 1,000+ news articles).
- **Solution:** Convert a folder to a "bucket" -- children are automatically organized into date-based subfolders (YYYY/MM/DD/HH/MM) and hidden from the tree.
- Children are accessed **only via search**.
- Bucketed items still have URLs and are fully functional -- the tree is just reorganized.
- Items can be "synced" (re-bucketed) if the date structure gets out of sync.
- **Key limitation:** Editors cannot browse bucket contents as a list -- they MUST search.

### 6.5 Publishing Dialog and Options

**Publish Item dialog (single item):**
- Publish sub-items: checkbox
- Smart publish (default): only publishes if changed
- Republish: force-publishes even if unchanged
- **Language selection:** checkboxes for each configured language
- **Publishing targets:** checkboxes for each target (typically "web" database, but can have staging, CDN edge, etc.)
- Publish related items: optionally publishes referenced items (images, datasources)

**Publish Site dialog (full site):**
- **Incremental publish:** Only items changed since last publish (fastest, uses PublishQueue table).
- **Smart publish:** Compares every item between Master and Web databases, publishes differences.
- **Republish:** Overwrites everything in the target database (slowest, most thorough).
- Language and target selection same as above.
- Can schedule publishing for a future date/time.

**Publishing restrictions per item:**
- Publishable: Yes/No
- Publishable from: date
- Publishable to: date
- Version-specific restrictions: specific versions can be excluded.

### 6.6 User Manager / Role Management

Sitecore includes a full **security administration** suite:

**Tools (accessible from Launchpad):**
| Tool | Purpose |
|---|---|
| **User Manager** | Create, edit, delete user accounts. Assign roles. Set profile properties. |
| **Role Manager** | Create, edit, delete roles. Add users/roles as members. |
| **Security Editor** | Assign item-level access rights (Read, Write, Create, Delete, Rename, Administer) to users/roles on specific content tree items. |
| **Access Viewer** | Read-only view of effective permissions for a user/role on an item (computed from all inherited rights). |
| **Domain Manager** | Manage security domains (logical groupings of users/roles). |

**Access Rights per item:**
| Right | Description |
|---|---|
| **Read** | Can see the item in the tree |
| **Write** | Can edit field values |
| **Rename** | Can rename the item |
| **Create** | Can create child items |
| **Delete** | Can delete the item |
| **Administer** | Can change security settings on the item |
| **Inheritance** | Controls whether rights propagate to descendants |

- Rights can be **allowed, denied, or inherited** per user/role per item.
- Rights cascade down the tree (inheritance) -- deny overrides allow.
- **Default:** The `sitecore\Everyone` role has Read access on all items.
- Predefined roles include: Author, Designer, Developer, Client Authoring, etc.

### 6.7 Multi-Language Content Management

- Sitecore supports **unlimited languages** per instance.
- Languages configured in `/sitecore/system/Languages`.
- Each item can have **multiple language versions**, each with its own numbered versions.
- Language selected via the **language dropdown** in the ribbon (shows flag icons).
- **Language fallback:** Configurable -- if an item lacks a version in the requested language, it can fall back to a default language.
- **Dictionary:** System-level key-value pairs for UI strings, managed per language.
- **Workflow per language:** Different language versions of the same item can be in different workflow states.

---

## 7. Pain Points / Limitations

### 7.1 Common Complaints from Sitecore Editors

| Pain Point | Detail |
|---|---|
| **Performance / Slowness** | Experience Editor can be very slow on large/complex sites. Content Editor tree can lag when loading deep hierarchies. Pages take minutes to load in heavily cloned systems. |
| **Complexity / Overwhelm** | The interface is feature-rich but overwhelming for new users. Many panels, ribbons, dialogs, and options. Training cost is high. |
| **No multi-select in tree** | Cannot select multiple items for bulk operations without PowerShell Extensions. |
| **Rich Text Editor frustrations** | Pasting from Word loses formatting. "Paste as Plain Text" is imperfect. Hyperlink Manager is confusing. RTE sometimes injects unwanted HTML/CSS. |
| **Standard Fields hidden by default** | Workflow fields, publishing fields are hidden -- new users don't know they exist. Leads to confusion about why items won't publish. |
| **Lock/Edit version creation** | Locking creates a new version -- confusing when users don't understand versioning. Version bloat over time. |
| **Item Buckets = search only** | Editors who are used to browsing a list suddenly can only search. Discoverability suffers. |
| **Language version confusion** | Editing in the wrong language without realizing. "Missing version" for a language is not always obvious. Switching languages requires explicit action. |
| **Recently Modified Items** | Getting back to recently modified items is clunky. The "Recent" feature always opens items in the EN language context, even if you edited FR. |
| **Templates with many fields** | Templates with 400+ fields cause performance issues -- slow saves, unresponsive Insert Link dialogs. |
| **Publishing confusion** | Smart Publish vs Republish vs Incremental -- editors don't understand the difference. Related items not always published. "I published but nothing changed" is common. |
| **Experience Editor limitations (headless)** | In newer headless/JSS architectures, Experience Editor has rendering limitations due to iframe-based editing model and dynamic DOM injection. |
| **No true WYSIWYG fidelity** | The Experience Editor renders the real page but chrome overlays, iframe context, and edit-mode-specific CSS can make the preview inaccurate. |

### 7.2 Things Editors Love and Would Miss

| Loved Feature | Detail |
|---|---|
| **Inline editing on the page** | Clicking text directly on the rendered page and typing. No form-based editing for basic text changes. |
| **Visual component composition** | Dragging components from the Toolbox onto the page in Experience Editor (especially SXA). |
| **Content tree navigation** | The hierarchical tree is intuitive for site-structure-minded editors. Click-to-navigate is fast for known paths. |
| **Workflow / Workbox** | Structured approval workflows with the Workbox dashboard. Knowing exactly what needs review. |
| **Favorites** | Bookmarking frequently accessed items via `Navigate > Favorites`. |
| **Insert Options** | Being guided on what can be created where -- no mistakes about putting a News Article under a Project folder. |
| **Presentation Details control** | Power users love the granular control over which components appear on which page, with which datasource. |
| **Language switching** | Toggling between languages to see/edit translations in the same interface. |
| **Preview** | Previewing exactly how the page will look before publishing. |
| **Personalization in-context** | Setting up personalization rules directly on a component while looking at the page. |

### 7.3 Things That Are Overly Complex

| Feature | Complexity Issue |
|---|---|
| **Presentation Details dialog** | XML-based layout definition, rendering parameters, placeholder keys -- very technical for non-developers. |
| **Template inheritance** | Standard Values, base templates, insert options, field sections -- the "template architecture" is powerful but hard to understand. |
| **Publishing model** | Master vs Web databases, publishing targets, Smart vs Republish -- conceptually heavy. |
| **Personalization rules engine** | Condition builder UI with nested AND/OR logic is powerful but has a steep learning curve. |
| **Security model** | Allow/Deny/Inherit per item per role with cascading -- easy to misconfigure, hard to debug. |
| **Shared vs Versioned fields** | Editors accidentally change a shared field thinking it only affects one language. Dangerous with no undo. |

---

## 8. Payload CMS Mapping Recommendations

Based on this research, here are the key Sitecore patterns to replicate or improve in Payload CMS:

### Replicate (editors will expect these)
1. **Hierarchical content tree** -- Payload's list view is flat by default. Consider a tree/hierarchy view for pages.
2. **Inline/visual editing** -- Payload 3.x Live Preview with Next.js draft mode. Critical for editor adoption.
3. **Field grouping with collapsible sections** -- Payload supports tabs and collapsible groups natively.
4. **Workflow states** -- Payload has `_status` (draft/published). Extend with custom workflow fields if approval is needed.
5. **Language versioning** -- Payload supports localization natively with per-locale field values.
6. **Insert options / allowed children** -- Use Payload's `admin.condition` and relationship constraints.
7. **Rich text editing** -- Payload's Lexical editor is strong. Consider paste-from-Word handling.
8. **Media library** -- Payload has native media/upload collections.
9. **Favorites / Recent items** -- Custom admin UI component showing recently edited items.
10. **Preview before publish** -- Payload's preview URL feature + Next.js draft mode.

### Improve (fix Sitecore pain points)
1. **Eliminate Master/Web database split** -- Payload's draft/published is simpler than dual databases.
2. **Real-time autosave** -- No explicit lock/edit/version-creation ceremony.
3. **Bulk operations** -- Payload's list view supports multi-select and bulk actions out of the box.
4. **Simpler publishing** -- One-click publish, no Smart vs Republish confusion.
5. **Better search** -- Full-text search in admin with facets, no "bucket" concept needed.
6. **Performance** -- Next.js admin panel is significantly faster than Sitecore's ASP.NET WebForms UI.
7. **Mobile-friendly admin** -- Payload's admin is responsive; Sitecore's Content Editor is not.
8. **Simpler permissions** -- Payload's access control is code-defined and more predictable.

### Skip (not needed for FRAS)
1. **Personalization/A/B testing in editor** -- Out of scope for initial build; can add later with third-party tools.
2. **Device-specific layouts** -- Use responsive CSS instead.
3. **Creative Exchange** -- Not applicable; designers work directly with Next.js/Tailwind.
4. **Template inheritance** -- Payload's collection-based model is simpler.

---

## Sources

- [Workflows and the Workbox | Sitecore Documentation](https://doc.sitecore.com/xp/en/users/latest/sitecore-experience-platform/workflows-and-the-workbox.html)
- [Sitecore Workflows and Workbox | Fishtank](https://www.getfishtank.com/insights/sitecore-workflows-and-workbox)
- [Common pitfalls with Rich Text Editor | Valtech](https://www.valtech.com/blog/common-pitfalls-content-authors-face-when-working-with-sitecores-rich-text-editor/)
- [Getting Started in Sitecore: Tips for Content Authors | Fishtank](https://www.getfishtank.com/insights/getting-started-in-sitecore-tips-for-new-content-authors)
- [Optimizing Experience Editor: Placeholder and Rendering Chrome | TechGuilds](https://www.techguilds.com/blog/optimizing-sitecore-experience-editor-placeholder-and-rendering-chrome)
- [Optimizing Experience Editor: The Rendering Checklist | TechGuilds](https://www.techguilds.com/blog/optimizing-sitecore-experience-editor-the-rendering-checklist)
- [Performance Issues, Content Authoring | Sitecore Saga](https://sitecoresaga.wordpress.com/category/performance-issues-content-authoring/)
- [How to Identify Common Sitecore Problems | Brimit](https://www.brimit.com/blog/how-to-identify-and-address-common-sitecore-problems)
- [What is Sitecore: Common Problems and Features | Waypath](https://waypathconsulting.com/what-is-sitecore-common-sitecore-problems-features/)
- [6 Easy Ways to Improve Content Author Experience | Sitecore Community](https://community.sitecore.com/community/en?id=community_blog&sys_id=35f2ab611bc370d0b8954371b24bcbbf)
- [Sitecore Experience Editor vs. Horizon | Sitecore Spark](https://www.sitecorespark.com/blog/2022/3/sitecore-experience-editor-vs-horizon)
- [Evolution of Content Authoring: Experience Editor to Pages | TechGuilds](https://www.techguilds.com/blog/sitecore-pages-in-xmc)
- [Add, edit, and delete a rendering | Sitecore Documentation](https://doc.sitecore.com/xp/en/users/sxa/103/sitecore-experience-accelerator/add,-edit,-and-delete-a-rendering-973854.html)
- [Sitecore Headless Experience Editor Issues | Arroact](https://www.arroact.com/blogs/sitecore-headless-experience-editor-limitations/)
- [Creating a Basic Content Approval Workflow | TheBitsThatByte](https://thebitsthatbyte.com/creating-a-basic-sitecore-content-approval-workflow/)
- [Improve Content Authors Experience | Ankit Joshi](https://ankitjoshi2409.wordpress.com/2017/07/30/improve-content-authors-experience-in-sitecore/)
