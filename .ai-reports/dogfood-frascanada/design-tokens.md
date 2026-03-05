# FRAS Canada — Design Tokens

| Field | Value |
|-------|-------|
| **Date** | 2026-03-04 |
| **Sources** | Live site CSS (Chrome DevTools), Wireframe specs (Figma `FRAS-2025-07-22`), Verified discovery reports |
| **Figma File** | `3DK2vb90O9421OaYmAsJJd` — FRAS-2025-07-22 |
| **Figma Variables** | Not defined in file (Figma MCP rate-limited; variables endpoint returned no data) |
| **Live Site** | https://www.frascanada.ca/ (Sitecore CMS, ASP.NET WebForms) |
| **Purpose** | Canonical design token reference for Payload CMS + Next.js rebuild |

> **Note:** The wireframe Figma file does not have Figma Variables (design tokens) configured.
> All tokens below are extracted from the **live production site CSS** via Chrome DevTools
> and cross-referenced with the **wireframe specifications**. The wireframe uses **Inter** as its
> font family; the live site uses **Roboto** variants. The rebuild should follow the wireframe
> font choice (Inter) unless the client specifies otherwise. Items marked with `WIREFRAME`
> indicate values from the Figma wireframes; items marked `LIVE` indicate values measured
> from the production site. Items marked `NEEDS REVIEW` require design confirmation.

---

## Table of Contents

1. [Colors](#1-colors)
2. [Typography](#2-typography)
3. [Spacing](#3-spacing)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Breakpoints](#6-breakpoints)
7. [Layout & Grid](#7-layout--grid)
8. [Component-Specific Tokens](#8-component-specific-tokens)
9. [Figma vs Live Site Discrepancies](#9-figma-vs-live-site-discrepancies)

---

## 1. Colors

### 1.1 Brand Primary — Purple Palette

The FRAS Canada brand is built around a purple color system. The primary purple `#601F5B`
is the most prominent color, used for headings, links, active states, and CTA backgrounds.

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `color-primary` | `#601F5B` | `rgb(96, 31, 91)` | H1 headings, H2 section headings, links, "How to Reply" CTA background, active project phase, Staff Contact heading, content links |
| `color-primary-bright` | `#A53B9D` | `rgb(165, 59, 157)` | "Submit comment" button background, secondary CTA buttons on dark backgrounds |
| `color-primary-medium` | `#8E3387` | `rgb(142, 51, 135)` | Homepage feature card CTA buttons ("Register now", "Read now"), OneTrust cookie buttons |
| `color-primary-vivid` | `#800080` | `rgb(128, 0, 128)` | H3 sub-headers (inner pages), news item title links |
| `color-primary-feature` | `#601F5B` | `rgb(96, 31, 91)` | Homepage "Top Stories" section full-width background |

### 1.2 Hero Banner Gradient

The hero/header banner uses a multi-stop linear gradient transitioning from red through purple to blue.

| Token Name | Value | Notes |
|------------|-------|-------|
| `gradient-hero` | `linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%)` | Full extracted gradient from `.header-banner` |
| `gradient-stop-1` | `#9F2528` / `rgb(159, 37, 40)` | Red (left edge, 12%) |
| `gradient-stop-2` | `#8A2339` / `rgb(138, 35, 57)` | Crimson/maroon (32%) |
| `gradient-stop-3` | `#60205B` / `rgb(96, 32, 91)` | Purple (center, 49%) |
| `gradient-stop-4` | `#243E90` / `rgb(36, 62, 144)` | Blue (right edge, 86%) |

> The banner also has a dotted/halftone circle SVG pattern overlay on the blue side.

### 1.3 Neutral / Gray Palette

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `color-text-primary` | `#333333` | `rgb(51, 51, 51)` | Primary body text, H2 "News Listings" on white bg, active filter pill bg |
| `color-text-secondary` | `#303030` | `rgb(48, 48, 48)` | H4 headings, footer titles |
| `color-text-muted` | `#696969` | `rgb(105, 105, 105)` | H3 headings (homepage context), secondary text |
| `color-text-light` | `#555555` | `rgb(85, 85, 85)` | Lighter secondary text |
| `color-text-filter-inactive` | `#525252` | `rgb(82, 82, 82)` | Inactive filter pill text (Closed for Comment tab) |
| `color-black` | `#000000` | `rgb(0, 0, 0)` | Disclaimer block background, strong emphasis |
| `color-white` | `#FFFFFF` | `rgb(255, 255, 255)` | Text on dark backgrounds, card backgrounds, page background |
| `color-white-translucent` | — | `rgba(255, 255, 255, 0.82)` | Body text on dark/purple backgrounds, disclaimer text |

### 1.4 Background Colors

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `bg-page` | `#FFFFFF` | `rgb(255, 255, 255)` | Default page background |
| `bg-footer` | `#EEEEEE` | `rgb(238, 238, 238)` | Footer container background |
| `bg-section-alt` | `#F5F5F5` | `rgb(245, 245, 245)` | Completed project phases, alternating rows, light gray sections |
| `bg-surface-light` | `#F8F8F8` | `rgb(248, 248, 248)` | Cookie consent accordion backgrounds |
| `bg-dark` | `#333333` | `rgb(51, 51, 51)` | Active filter pills, dropdown select backgrounds |
| `bg-disclaimer` | `#000000` | `rgb(0, 0, 0)` | Disclaimer block (pure black) |
| `bg-feature` | `#601F5B` | `rgb(96, 31, 91)` | Feature sections, CTA blocks, active phase indicator |
| `bg-row-alt` | `#F8F8F8` | `rgb(248, 248, 248)` | Alternating table/list row background (approximation of `#f9f9f9` from wireframes) |
| `bg-group-header` | `#F0F0F0` | `rgb(240, 240, 240)` | Section group header background in tables |

### 1.5 Semantic / State Colors

| Token Name | Hex | RGB | Usage | Source |
|------------|-----|-----|-------|--------|
| `color-link` | `#601F5B` | `rgb(96, 31, 91)` | Content links (underlined) | LIVE |
| `color-link-hover` | — | — | `NEEDS REVIEW` — hover state not measured | — |
| `color-active-phase` | `#601F5B` | `rgb(96, 31, 91)` | Current project phase bg (white text) | LIVE |
| `color-completed-phase` | `#F5F5F5` | `rgb(245, 245, 245)` | Completed project phase bg (dark text + green checkmark) | LIVE |
| `color-success` | — | — | Green checkmark icons on completed phases (PNG via CSS `::before`) | LIVE |
| `color-error` | — | — | `NEEDS REVIEW` — form validation error color not measured | — |
| `color-focus-ring` | — | — | `NEEDS REVIEW` — focus/accessibility ring color not measured | — |

### 1.6 Content Type Badge Colors (from wireframe specs)

| Badge | Color Description | Source |
|-------|-------------------|--------|
| Standard | Purple | WIREFRAME |
| News | Dark / near-black | WIREFRAME |
| Webinar | Teal | WIREFRAME |
| Meeting Summary | Gray | WIREFRAME |
| Guidance | Dark outline (ghost) | WIREFRAME |

> `NEEDS REVIEW` — Exact hex values for badge colors need extraction from Figma or live site.

---

## 2. Typography

### 2.1 Font Families

| Token Name | Live Site Value | Wireframe Value | Notes |
|------------|----------------|-----------------|-------|
| `font-family-display` | `"Roboto Black"` | `Inter` | Headings H1, H2, section titles |
| `font-family-heading` | `"Roboto Bold"` | `Inter` | H3, H4, sub-headings, bold labels |
| `font-family-body` | `"Roboto Regular"` | `Inter` | Body text, links, navigation, form inputs |
| `font-family-body-light` | `"Roboto Light"` | `Inter` | Light body text (homepage paragraph context) |

> **Recommendation for rebuild:** Use `Inter` as specified in the wireframes. Inter is a
> Google Font with similar proportions to Roboto and excellent variable font support.
> Load weights: 300 (Light), 400 (Regular), 600 (Semi-Bold), 700 (Bold), 900 (Black).

### 2.2 Heading Scale

| Element | Font Family | Size | Weight | Line Height | Color | Context |
|---------|------------|------|--------|-------------|-------|---------|
| **H1** | Roboto Black | `46px` | `500` (Black face) | `52px` | `#601F5B` (purple) | Page titles across all templates |
| **H2 (section)** | Roboto Black | `34px` | `500` (Black face) | `42px` | `#333333` (dark) | Section headings on white bg (e.g., "News Listings") |
| **H2 (content)** | Roboto Black | `20px` | `500` (Black face) | `20px` | `#601F5B` (purple) | Content sub-headings (e.g., "Summary", "Project Status", "News") |
| **H2 (card)** | Roboto Black | `21.3px` | `500` (Black face) | `26.7px` | `#FFFFFF` (white) | Card titles on purple/dark backgrounds |
| **H2 (news link)** | Roboto Bold | `16px` | `500` | — | `#800080` (vivid purple) | News item title links in listings |
| **H3** | Roboto Bold | `16px` | `500` | `24px` | `#800080` (vivid purple) | Sub-headings in content areas |
| **H3 (homepage)** | Roboto Regular | `18px` | `700` | `21.6px` | `#696969` (gray) | Homepage card meta/labels |
| **H4** | Roboto Bold | `16px` | `500` | `16px` | `#303030` (dark) | Minor headings, footer titles |

> **Note:** The live site uses named Roboto font faces (`Roboto Black`, `Roboto Bold`, etc.)
> rather than a single `Roboto` family with weight values. The CSS `font-weight` values
> (500) are overridden by the font face itself carrying the actual weight. For the rebuild
> with Inter, use explicit numeric weights: 900 for Black, 700 for Bold, 400 for Regular, 300 for Light.

### 2.3 Body Text Scale

| Element | Font Family | Size | Weight | Line Height | Color |
|---------|------------|------|--------|-------------|-------|
| **Body (content pages)** | Roboto Regular | `16px` | `400` | `28px` | `#000000` (black) |
| **Body (homepage, on purple)** | Roboto Light | `16px` | `400` | `28px` | `rgba(255,255,255,0.82)` |
| **Links (content)** | Roboto Regular | `16px` | `400` | — | `#601F5B` (purple), underlined |
| **Links (navigation)** | Roboto Regular | `16px` | `400` | — | `#601F5B` (purple) |
| **Button text** | Roboto Regular | `14px` | `400` | — | `#FFFFFF` (white) |
| **Labels / Captions** | Roboto Regular | `14px` | `400` | — | `#696969` (gray) |
| **Small / Metadata** | Roboto Regular | `12-14px` | `400` | — | `#555555` or `#696969` |

### 2.4 Recommended Inter Weight Mapping

| Live Site (Roboto variant) | Rebuild (Inter weight) | CSS `font-weight` |
|---------------------------|----------------------|-------------------|
| Roboto Black | Inter Black | `900` |
| Roboto Bold | Inter Bold | `700` |
| Roboto Regular | Inter Regular | `400` |
| Roboto Light | Inter Light | `300` |

---

## 3. Spacing

### 3.1 Base Spacing Scale

> `NEEDS REVIEW` — The live site does not use CSS custom properties for spacing.
> Values below are measured from computed styles and common patterns. The wireframes
> specify a 1440px desktop width and 390px mobile width but do not define a spacing scale.

| Token Name | Value | Usage |
|------------|-------|-------|
| `spacing-xs` | `4px` | Minimal gaps |
| `spacing-sm` | `8px` | Tight internal padding |
| `spacing-md` | `16px` | Standard padding, form gaps |
| `spacing-lg` | `24px` | Section internal padding |
| `spacing-xl` | `32px` | Section vertical gaps |
| `spacing-2xl` | `48px` | Large section vertical margins |
| `spacing-3xl` | `64px` | Hero/banner internal padding |

### 3.2 Component Spacing (measured from live site)

| Component | Property | Value |
|-----------|----------|-------|
| Button padding | padding | `10px 15px` |
| Container padding (desktop) | padding-left/right | `15px` (Bootstrap default) |
| Content body line-height | line-height | `28px` (1.75x at 16px base) |
| H1 line-height | line-height | `52px` (1.13x at 46px) |

---

## 4. Border Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `radius-none` | `0px` | Filter pills/tabs (rectangular tab-style toggles), table cells |
| `radius-sm` | `5px` | Buttons (CTA, Submit, feature card buttons) |
| `radius-md` | `8px` | `NEEDS REVIEW` — Cards (if applicable in wireframes) |
| `radius-lg` | `12px` | `NEEDS REVIEW` — Larger cards, modals |
| `radius-full` | `9999px` | `NEEDS REVIEW` — Pill badges (if used in redesign) |

> **Important:** The live site's filter "pills" are actually rectangular (`border-radius: 0px`),
> functioning as tab-style toggles rather than rounded pill elements. The wireframe may
> introduce true pill shapes — confirm with Figma file.

---

## 5. Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `shadow-none` | `none` | Most elements on the live site use no box-shadow |
| `shadow-card` | `NEEDS REVIEW` | Cards may use subtle shadow in wireframes |
| `shadow-dropdown` | `NEEDS REVIEW` | Mega-menu/dropdown shadow |
| `shadow-modal` | `NEEDS REVIEW` | Search modal overlay |

> The live Sitecore site uses minimal to no box-shadows. The wireframe redesign may
> introduce elevation/shadow tokens for cards, dropdowns, and modals. Extract from Figma
> when API quota resets.

---

## 6. Breakpoints

### 6.1 Bootstrap 3 Grid Breakpoints (live site)

The live site uses Bootstrap 3. The rebuild should use modern breakpoints aligned with
Tailwind CSS or a custom system, but these are the reference breakpoints from the current CSS.

| Token Name | Value | Live Site Media Query |
|------------|-------|---------------------|
| `breakpoint-xs` | `0px` | Default (mobile-first) |
| `breakpoint-sm` | `768px` | `(min-width: 768px)` — Tablet portrait |
| `breakpoint-md` | `992px` | `(min-width: 992px)` — Tablet landscape / small desktop |
| `breakpoint-lg` | `1200px` | `(min-width: 1200px)` — Desktop |

### 6.2 Additional Breakpoints Found in CSS

| Query | Purpose |
|-------|---------|
| `(max-width: 767px)` | Mobile styles |
| `(max-width: 991px)` | Tablet and below |
| `(max-width: 1199px)` | Below desktop |
| `(min-width: 768px) and (max-width: 991px)` | Tablet only |
| `(min-width: 992px) and (max-width: 1199px)` | Small desktop only |
| `(max-width: 640px)` | Small mobile |
| `(max-width: 470px)` | Extra small mobile |
| `(min-width: 800px)` | Custom breakpoint |
| `(min-width: 768px) and (max-width: 980px)` | Custom tablet range |

### 6.3 Wireframe Reference Widths

| Context | Width | Source |
|---------|-------|--------|
| Desktop wireframes | `1440px` | WIREFRAME |
| Mobile wireframes | `390px` | WIREFRAME |

### 6.4 Recommended Rebuild Breakpoints

| Token Name | Value | Description |
|------------|-------|-------------|
| `breakpoint-mobile` | `390px` | Wireframe mobile reference |
| `breakpoint-sm` | `640px` | Small devices |
| `breakpoint-md` | `768px` | Tablets |
| `breakpoint-lg` | `1024px` | Small desktops |
| `breakpoint-xl` | `1280px` | Desktops |
| `breakpoint-2xl` | `1440px` | Wireframe desktop reference |

---

## 7. Layout & Grid

| Token Name | Value | Source | Notes |
|------------|-------|--------|-------|
| `layout-max-width` | `1170px` | LIVE | Bootstrap 3 `.container` max-width at 1200px+ |
| `layout-desktop-reference` | `1440px` | WIREFRAME | Figma artboard width |
| `layout-mobile-reference` | `390px` | WIREFRAME | Figma mobile artboard width |
| `layout-content-main` | `~70%` | LIVE + WIREFRAME | Main content column (8 of 12 cols) |
| `layout-content-sidebar` | `~30%` | LIVE + WIREFRAME | Staff Contact sidebar (4 of 12 cols) |
| `grid-columns` | `12` | LIVE | Bootstrap 12-column grid |
| `grid-gutter` | `30px` | LIVE | Bootstrap default (15px per side) |

---

## 8. Component-Specific Tokens

### 8.1 Buttons

| Variant | Background | Text Color | Border | Radius | Padding | Font Size |
|---------|-----------|------------|--------|--------|---------|-----------|
| **Primary (CTA on dark bg)** | `#8E3387` | `#FFFFFF` | none | `5px` | `10px 15px` | `14px` |
| **Primary (Submit)** | `#A53B9D` | `#FFFFFF` | none | `5px` | `10px 15px` | `14px` |
| **Primary (dark fill)** | `#601F5B` | `#FFFFFF` | none | `5px` | `10px 15px` | `14px` |
| **Secondary (outline)** | transparent | `#601F5B` | `1px solid #601F5B` | `5px` | `10px 15px` | `14px` |
| **Ghost (text + arrow)** | transparent | `#601F5B` | none | `0` | `0` | `16px` |
| **Filter pill (active)** | `#333333` | `#FFFFFF` | none | `0px` | varies | `14px` |
| **Filter pill (inactive)** | `#FFFFFF` | `#525252` | `1px solid` | `0px` | varies | `14px` |

### 8.2 Cards

| Token | Value | Source |
|-------|-------|--------|
| Card background | `#FFFFFF` | LIVE + WIREFRAME |
| Card border | Subtle gray border | WIREFRAME ("subtle border") |
| Card shadow | `NEEDS REVIEW` | — |
| Card radius | `NEEDS REVIEW` | — |

### 8.3 Navigation

| Element | Background | Text Color |
|---------|-----------|------------|
| Header banner | Gradient (see 1.2) | White (logo) |
| Utility nav bar | `NEEDS REVIEW` | `#601F5B` |
| Primary nav links | transparent | `#601F5B` |
| Active nav tab underline | `#601F5B` (purple bar) | — |
| Mobile menu overlay | `NEEDS REVIEW` | — |

### 8.4 Footer

| Element | Background | Text Color |
|---------|-----------|------------|
| Footer container | `#EEEEEE` | `#333333` |
| Footer titles | transparent | `#303030` |
| Footer links | transparent | `#333333` |
| Sub-footer bar | Dark red/maroon (measured as dotted pattern on live site) | White |

### 8.5 Project Phase Timeline

| State | Background | Text Color | Icon |
|-------|-----------|------------|------|
| Completed | `#F5F5F5` | `#333333` | Green checkmark PNG (CSS `::before`) |
| Active/Current | `#601F5B` | `#FFFFFF` | None (items in progress) |
| Future/Pending | `#F5F5F5` | `#333333` | None |

### 8.6 Disclaimer Block

| Token | Value |
|-------|-------|
| Background | `#000000` (pure black) |
| Text color | `rgba(255, 255, 255, 0.82)` (translucent white) |
| Font style | `normal` (NOT italic, despite content being a legal disclaimer) |

### 8.7 "How to Reply" CTA Block

| Token | Value |
|-------|-------|
| Container background | `#601F5B` / `rgb(96, 31, 91)` |
| Heading text (H3) | `#FFFFFF` (white) |
| Body text | White on dark purple |
| "Submit comment" button bg | `#A53B9D` / `rgb(165, 59, 157)` |
| "Submit comment" button text | `#FFFFFF` (white) |

---

## 9. Figma vs Live Site Discrepancies

| Token | Wireframe (Figma) | Live Site | Resolution |
|-------|-------------------|-----------|------------|
| **Font family** | Inter | Roboto (Black/Bold/Regular/Light) | Use Inter for rebuild per wireframe |
| **Primary button** | "Dark/black fill, white text" | Purple fill (`#8E3387`), white text | `NEEDS REVIEW` — wireframe says dark/black, live uses purple. Confirm with design team |
| **Section background** | "Light gray/blue tint" | `#F5F5F5` (pure light gray, no blue tint) | Use wireframe description; may be a cooler gray in redesign |
| **Desktop width** | 1440px (artboard) | 1170px (Bootstrap container max) | Rebuild to 1440px reference per wireframe |
| **Mobile width** | 390px (artboard) | Responsive down to 320px+ | Use 390px as primary mobile reference |
| **Filter pills** | Described as "pills" | Rectangular tabs (`border-radius: 0px`) | `NEEDS REVIEW` — wireframe may introduce actual pill shapes |
| **H2 sizing** | Not specified per context | Varies widely (20px-34px) | Standardize in rebuild with clear semantic scale |

---

## Appendix A: CSS Custom Properties Template

Below is a recommended CSS custom properties structure for the rebuild. Adjust values
based on final design confirmation.

```css
:root {
  /* ── Brand Colors ── */
  --color-primary: #601F5B;
  --color-primary-bright: #A53B9D;
  --color-primary-medium: #8E3387;
  --color-primary-vivid: #800080;

  /* ── Hero Gradient ── */
  --gradient-hero: linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%);

  /* ── Neutrals ── */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-900: #333333;
  --color-gray-800: #303030;
  --color-gray-600: #525252;
  --color-gray-500: #696969;
  --color-gray-400: #555555;
  --color-gray-200: #EEEEEE;
  --color-gray-100: #F5F5F5;
  --color-gray-50: #F8F8F8;
  --color-white-82: rgba(255, 255, 255, 0.82);

  /* ── Semantic ── */
  --color-text-primary: var(--color-gray-900);
  --color-text-heading: var(--color-primary);
  --color-text-muted: var(--color-gray-500);
  --color-text-on-dark: var(--color-white);
  --color-text-on-dark-muted: var(--color-white-82);
  --color-link: var(--color-primary);
  --color-bg-page: var(--color-white);
  --color-bg-footer: var(--color-gray-200);
  --color-bg-alt: var(--color-gray-100);
  --color-bg-feature: var(--color-primary);
  --color-bg-row-alt: var(--color-gray-50);
  --color-bg-group-header: #F0F0F0;
  --color-bg-disclaimer: var(--color-black);

  /* ── Typography ── */
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.3125rem; /* 21px */
  --font-size-3xl: 2.125rem; /* 34px */
  --font-size-4xl: 2.875rem; /* 46px */

  --line-height-tight: 1.13;
  --line-height-snug: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ── Spacing ── */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */

  /* ── Border Radius ── */
  --radius-none: 0;
  --radius-sm: 5px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* ── Breakpoints (for reference; use in @media queries) ── */
  /* --breakpoint-sm: 640px;  */
  /* --breakpoint-md: 768px;  */
  /* --breakpoint-lg: 1024px; */
  /* --breakpoint-xl: 1280px; */
  /* --breakpoint-2xl: 1440px; */

  /* ── Layout ── */
  --layout-max-width: 1440px;
  --layout-content-max-width: 1200px;
  --grid-columns: 12;
  --grid-gutter: 30px;
}
```

---

## Appendix B: Items Requiring Manual Review

The following tokens could not be extracted programmatically and need manual confirmation
from the Figma file or design team:

| Item | What's Needed | Priority |
|------|---------------|----------|
| Content type badge exact hex colors | Purple, Teal, Dark, Gray variants for Standard/Webinar/News/Meeting Summary/Guidance badges | High |
| Card border and shadow tokens | Whether redesigned cards have box-shadow, border-color, border-width | High |
| Hover/focus state colors | Link hover color, button hover states, focus ring color | High |
| Dropdown/mega-menu shadow | Box-shadow on mega-menu dropdowns | Medium |
| Modal overlay color | Search modal backdrop opacity and color | Medium |
| Icon color tokens | Chevron, search icon, external link icon colors | Medium |
| Mobile menu colors | Overlay bg, active link highlight, divider colors | Medium |
| Error/validation state colors | Form input error borders, error message text | Medium |
| Newsletter CTA block colors | Background, heading, input, and button colors in footer newsletter section | Low |
| Tooltip/popover tokens | If any tooltips exist in the redesign | Low |
| Animation/transition tokens | Duration, easing function for menu transitions, hover effects | Low |

> **Next step:** When the Figma MCP rate limit resets, re-run `get_variable_defs` and
> `get_design_context` on the Navigation & Footer components frame and individual component
> nodes to fill in the `NEEDS REVIEW` items above.
