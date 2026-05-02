# Sitecore Template Definitions -- FRAS Canada Dump

> Extracted from Sitecore 10.2 XM/SXA package at `data/old-fras-dump/_extracted/fras-214mb/contents/items/master/sitecore/templates/NLC/`
> Date: 2026-03-04

## Summary

- **Total templates found:** 92
- **Total template sections:** 88
- **Total template fields:** 266
- **Categories:** Base (11), Components (26), Data (18), Folders (12), Modules (10), Pages (15)
- **Common GUID for Sitecore Standard Template:** `{1930BBEB-7805-471A-A3BE-4858AC7CF696}`

### GUID Reference (Base Templates)

These GUIDs appear frequently in `__base template` fields:

| GUID | Template Name |
|------|--------------|
| `{1930BBEB-7805-471A-A3BE-4858AC7CF696}` | Sitecore Standard Template |
| `{FB91FEFD-EBEB-4CB4-8B3A-D22F355E3787}` | Base - Page |
| `{D906A4D6-1181-4BEA-B99F-26E8991CC604}` | Base - Fras Workflow |
| `{DE8DA7F2-0249-4819-A08A-D26C7BBF727B}` | Base - Component Workflow |
| `{D517229D-E60E-4D16-9747-4A946D65EB76}` | Base - News Tags |
| `{FA80E762-BDA0-4298-805E-EB10592C9D7C}` | Base - Meetings Tags |
| `{3F3EAB56-8321-432F-B3C9-A2DF317969EF}` | Base - Cta |
| `{35D02DB4-8489-441A-95BA-6386EFD16AFE}` | Base - Featured Page |
| `{E5E78CD2-3292-4E57-A365-D32FA8F815E1}` | Base - Indexable |
| `{C0BD877E-AAD8-4FD4-9424-A4ABE1583C32}` | Base - Redirect |
| `{FF52AA24-4E20-448E-96CD-CC664668D67A}` | Base - Search Facet |
| `{29BC813C-5741-42F6-B93F-1D1341A2FC9A}` | Base - Simple Workflow |
| `{53134358-485E-4125-97D9-8AD278D161FE}` | Summary (Component) |
| `{596E9DD6-055D-41C9-A130-FBF07921CAB6}` | CTA (Component) |
| `{CEF35612-330C-4892-8DBC-65685EE5EBD3}` | Rich Text Editor (Component) |
| `{65D1C3E6-4A1B-4939-98C9-EEEC288E8E58}` | Page CTA Configuration |
| `{D8036EFD-92B2-4C87-9235-0E4E83EED173}` | Page Rich Text Configuration |

---

## 1. Base Templates

### 1.1 Base - Page `{FB91FEFD-EBEB-4CB4-8B3A-D22F355E3787}`

**Inherits from:** Standard Template, Base - Fras Workflow, Base - Featured Page, Base - Indexable

This is the core page template. All FRAS page templates inherit from this.

**Section: Titles**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Breadcrumb Title | Single-Line Text | | |
| Section Title | Droptree | `/sitecore/content/Fras/Site-Components/Tags/Base-Tags` | Yes |
| Page Title | Single-Line Text | | |

**Section: Content**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| FRAS ID Number | Single-Line Text | | Yes |
| Description | Rich Text | | |
| Search Date | Date | | |

**Section: Banner**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Image | Image | `/sitecore/media library/FRASCanada` | |

**Section: Breadcrumb**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Include in Breadcrumb | Checkbox | | Yes |

**Section: Metatags**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Meta Keywords | Single-Line Text | | |

**Section: Socials**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Show Share Options | Checkbox | | Yes |

**Section: Authentication Settings**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Login Required To Access | Checkbox | | Yes |

---

### 1.2 Base - Cta `{3F3EAB56-8321-432F-B3C9-A2DF317969EF}`

**Inherits from:** Standard Template

**Section: Cta Information**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| CTA Title | Single-Line Text | | |
| CTA Description | Rich Text | | |
| Background Color | Droptree | | Yes |
| Button 1 | Droptree | | Yes |
| Button 1 Label | Single-Line Text | | |
| Button 1 Link | General Link | | |
| Button 2 | Droptree | | Yes |
| Button 2 Label | Single-Line Text | | |
| Button 2 Link | General Link | | |
| Button 3 | Droptree | `datasource=/sitecore/content/Fras/Configurations/Settings/Button-Styles` | Yes |
| Button 3 Label | Single-Line Text | | |
| Button 3 Link | General Link | | |
| Button 4 | Droptree | `datasource=/sitecore/content/Fras/Configurations/Settings/Button-Styles` | Yes |
| Button 4 Label | Single-Line Text | | |
| Button 4 Link | General Link | | |

---

### 1.3 Base - Featured Page `{35D02DB4-8489-441A-95BA-6386EFD16AFE}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type | Source |
|-----------|------|--------|
| Meta Description | Multi-Line Text | |
| Feature Image | Image | |

---

### 1.4 Base - News Tags `{D517229D-E60E-4D16-9747-4A946D65EB76}`

**Inherits from:** *(none specified beyond Standard Template)*

**Section: Tags**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Type of News | Treelist | `/sitecore/content/Fras/Site-Components/Tags/Type-of-News` | Yes |
| Type of Resource | Treelist | `/sitecore/content/Fras/Site-Components/Tags/Type-of-Resource` | Yes |
| Tags | Treelist | `/sitecore/content/Fras/Site-Components/Tags/Base-Tags` | Yes |
| Project GUID | Single-Line Text | | Yes |

---

### 1.5 Base - Meetings Tags `{FA80E762-BDA0-4298-805E-EB10592C9D7C}`

**Inherits from:** Standard Template

**Section: Tags**

| Field Name | Type | Source | Shared |
|-----------|------|--------|--------|
| Tags | Treelist | `/sitecore/content/Fras/Site-Components/Tags/Base-Tags` | Yes |
| Type Of Meeting | Treelist | `datasource=/sitecore/content/Fras/Site-Components/Tags&excludeitemsfordisplay=Base Tags,Type of Resource,Type-of-Articles` | Yes |
| Project GUID | Single-Line Text | | Yes |

---

### 1.6 Base - Indexable `{E5E78CD2-3292-4E57-A365-D32FA8F815E1}`

**Inherits from:** Standard Template

**Section: Indexable**

| Field Name | Type | Shared |
|-----------|------|--------|
| Exclude | Checkbox | Yes |

---

### 1.7 Base - Redirect `{C0BD877E-AAD8-4FD4-9424-A4ABE1583C32}`

**Inherits from:** Standard Template

**Section: Redirect**

| Field Name | Type |
|-----------|------|
| Redirect Target | General Link |

---

### 1.8 Base - Search Facet `{FF52AA24-4E20-448E-96CD-CC664668D67A}`

**Inherits from:** Standard Template

**Section: Search Facet**

| Field Name | Type | Shared |
|-----------|------|--------|
| Exclude | Checkbox | Yes |

---

### 1.9 Base - Fras Workflow `{D906A4D6-1181-4BEA-B99F-26E8991CC604}`

**Inherits from:** Standard Template
*(No own fields -- provides workflow assignment via standard values)*

---

### 1.10 Base - Component Workflow `{DE8DA7F2-0249-4819-A08A-D26C7BBF727B}`

**Inherits from:** Standard Template
*(No own fields -- provides component workflow assignment via standard values)*

---

### 1.11 Base - Simple Workflow `{29BC813C-5741-42F6-B93F-1D1341A2FC9A}`

**Inherits from:** Standard Template
*(No own fields -- provides simple workflow assignment via standard values)*

---

## 2. Component Templates

### 2.1 Staff Contact `{9265D0DC-D2AF-4F7F-A174-88BDE01EC738}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Details**

| Field Name | Type |
|-----------|------|
| Name | Single-Line Text |
| Role | Single-Line Text |
| Designations | Single-Line Text |
| Email | Single-Line Text |
| Phone Number | Single-Line Text |
| Fax | Single-Line Text |

---

### 2.2 CTA `{596E9DD6-055D-41C9-A130-FBF07921CAB6}`

**Inherits from:** Standard Template, Base - Cta, Base - Fras Workflow
*(No own fields -- inherits all CTA fields from Base - Cta)*

---

### 2.3 Disclaimer `{449A9778-9978-44EB-89CF-AADFB7C1E4DF}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Subtitle | Single-Line Text |
| Description | Rich Text |
| Background Color | Droptree |

---

### 2.4 Link Group `{F5CE6B0D-EBBE-4A3B-BA63-2851A3BA86C1}`

**Inherits from:** Standard Template, Base - Fras Workflow
*(No own fields -- acts as a container for Link Item children)*

---

### 2.5 Link Item `{0A234C5B-B4A0-4555-8FF0-11E2B6761143}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Link | General Link |

---

### 2.6 Logo Image `{C8A33EBD-2616-44D6-8088-614739DAAA34}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Logo | Image |
| Inverted Logo | Image |
| Link | General Link |

**Section: Display Options**

| Field Name | Type |
|-----------|------|
| Is Subtitle Image | Checkbox |

---

### 2.7 Menu `{CCDDB053-17D9-42F3-835C-3BCC40B4E661}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Content**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Link | General Link |

---

### 2.8 Menu Item `{5A101080-012B-4F21-9D0A-1E2868FA2EA9}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Link | General Link |
| Aria-Label Text | Single-Line Text |
| Show Only On Mobile | Checkbox |

---

### 2.9 Rich Text Editor `{CEF35612-330C-4892-8DBC-65685EE5EBD3}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Rich Text Fields**

| Field Name | Type |
|-----------|------|
| Content | Rich Text |

---

### 2.10 Socials `{00E22CD8-D037-4E9C-A351-E0655BFEED69}`

**Inherits from:** Standard Template, Base - Fras Workflow
*(No own fields -- acts as a container for Socials Item children)*

---

### 2.11 Socials Item `{139FE1D2-EF67-4A96-850B-B028379F7764}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Logo | Image |
| Link | General Link |

---

### 2.12 Summary `{53134358-485E-4125-97D9-8AD278D161FE}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Summary Details**

| Field Name | Type | Notes |
|-----------|------|-------|
| Title | Single-Line Text | |
| Sumary Description | Rich Text | Shown before "see more" (note: typo in original) |
| Summary Description 2 | Rich Text | Shown after "see more" click |

---

### 2.13 Standards List Group `{997576DA-9985-43E0-BAA0-8F7652497B6E}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |

---

### 2.14 Standards List Item `{06997FE6-A00D-43B1-996A-6A0634FCE9FA}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Fields**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Link | General Link |

---

### 2.15 Color `{12885F74-C8A6-44F1-AB40-B6A3154C2246}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Color Value**

| Field Name | Type |
|-----------|------|
| Hex | Single-Line Text |

---

### 2.16 Color Folder `{0202932A-E87F-423E-AFA3-67E7624F807A}`

**Inherits from:** Standard Template, Base - Fras Workflow
*(No own fields -- container for Color items)*

---

### 2.17 Button Style `{C019BE37-C3B4-442E-A678-12BAA69F4944}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Background Settings**

| Field Name | Type |
|-----------|------|
| Background Color | Droptree |
| Background Color - Hover | Droptree |

**Section: Border Settings**

| Field Name | Type |
|-----------|------|
| Border Color | Droptree |
| Border Color - Hover | Droptree |
| Include Border Radius | Checkbox |

**Section: Text Settings**

| Field Name | Type |
|-----------|------|
| Text Color | Droptree |
| Text Color - Hover | Droptree |

**Section: Link Option**

| Field Name | Type |
|-----------|------|
| Is Link Button | Checkbox |

---

### 2.18 Button Style Folder `{77325A41-EF99-4E43-953B-11DD3B7558B7}`

**Inherits from:** Standard Template, Base - Fras Workflow
*(No own fields -- container for Button Style items)*

---

### 2.19 Scriptbox `{0D357D55-5DD7-4474-A430-C01E903B4D42}`

**Inherits from:** Base - Component Workflow, Standard Template

**Section: Scriptbox Fields**

| Field Name | Type |
|-----------|------|
| Script | Multi-Line Text |

**Section: System Fields**

| Field Name | Type | Shared |
|-----------|------|--------|
| Is Scriptbox Component | Checkbox | Yes |

---

### 2.20 Project Status Table `{62DB7E88-909B-4983-A878-9B7AC56ED26C}`

**Inherits from:** *(No explicit base templates)*
**Insert options:** Row
*(No own fields -- container for Row children)*

---

### 2.21 Project Status Table > Row `{1FD0BD38-C05E-4985-9A8D-D1D681FB3751}`

**Inherits from:** Standard Template
**Insert options:** Task

**Section: Content**

| Field Name | Type |
|-----------|------|
| Step | Single-Line Text |
| Step Status | Single-Line Text |
| Button | Droptree |
| Button Label | Single-Line Text |
| Button Link | General Link |

---

### 2.22 Project Status Table > Task `{70D00874-BEE2-4D86-85E4-502F7AC14098}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Description | Single-Line Text |
| Finished | Checkbox |

---

### 2.23 Effective Dates Table `{48DA5A16-FA73-465E-B903-D4A8E8FEFD9E}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Table**

*(No own fields listed in section -- structure uses child Section/Row/Column items)*

---

### 2.24 Effective Dates Table > Column `{000A6FDF-B529-479D-833D-4FC874D268F8}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: Details**

| Field Name | Type |
|-----------|------|
| Text | Single-Line Text |

---

### 2.25 Effective Dates Table > Row `{98CF7953-EE88-478C-88F5-AE88482F1883}`

**Inherits from:** Standard Template, Base - Fras Workflow

**Section: RowDetails**

| Field Name | Type |
|-----------|------|
| Is Header | Checkbox |

---

### 2.26 Effective Dates Table > Section `{8F454117-A45D-42EB-8AF1-3FD861A0D210}`

**Inherits from:** *(No explicit base templates)*

**Section: Content**

| Field Name | Type |
|-----------|------|
| Name | Single-Line Text |

---

## 3. Data Templates

### 3.1 Author `{F92ED00D-F99F-4C48-86EC-C9218117C322}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Name | Single-Line Text |
| FRAS Title | Single-Line Text |
| Designations | Single-Line Text |
| Image | Image |

---

### 3.2 Banner Image `{3D34B6CD-F804-46BB-A38C-08CA897A85E1}`

**Inherits from:** *(No explicit base templates)*

**Section: Content**

| Field Name | Type |
|-----------|------|
| Image | Image |
| Tag | Droptree |

---

### 3.3 Tag `{52BA658E-4B27-4A3B-BE28-25FDB2794726}`

**Inherits from:** Standard Template, Base - Search Facet

**Section: Content**

| Field Name | Type |
|-----------|------|
| Tag Name | Single-Line Text |
| Icon | Image |

---

### 3.4 State `{9D004253-74A0-4DC1-821F-43A29BC51547}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Label | Single-Line Text |
| Status | Single-Line Text |

---

### 3.5 Type of Document `{D88F4A3D-B54E-483E-9F7C-1A6520C2DFEF}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Document Type | Single-Line Text |

---

### 3.6 Meeting Listings Configuration `{9CB1ABB5-4A98-4703-BEDC-DBB9270DE29B}`

**Inherits from:** Base - Meetings Tags
*(No own fields -- relies on inherited Tags fields for filtering)*

---

### 3.7 Meeting Rollups Configuration `{71A09B85-CEA2-4CC5-B9CA-13677515B91B}`

**Inherits from:** Base - Meetings Tags

**Section: Content**

| Field Name | Type |
|-----------|------|
| Section Title | Single-Line Text |
| Parent Item | Droptree |
| Link | General Link |
| Link Text | Single-Line Text |
| Force Listing Layout | Checkbox |

---

### 3.8 News Listings Configuration `{F923B3BB-F373-4414-9004-AB02D363BA64}`

**Inherits from:** Base - News Tags
*(No own fields -- relies on inherited Tags fields for filtering)*

---

### 3.9 News Rollups Configuration `{2BB20325-19D5-4D63-B208-832DCD038F7B}`

**Inherits from:** Base - News Tags

**Section: Content**

| Field Name | Type |
|-----------|------|
| Section Title | Single-Line Text |
| Parent Item | Droptree |
| Link | General Link |
| Link Text | Single-Line Text |
| Force Listing Layout | Checkbox |

---

### 3.10 Page CTA Configuration `{65D1C3E6-4A1B-4939-98C9-EEEC288E8E58}`

**Inherits from:** *(No explicit base templates)*

**Section: Cta Information**

| Field Name | Type |
|-----------|------|
| Is Text Black | Checkbox |

---

### 3.11 Page Rich Text Configuration `{D8036EFD-92B2-4C87-9235-0E4E83EED173}`

**Inherits from:** *(No explicit base templates)*

**Section: Rich Text Fields**

| Field Name | Type |
|-----------|------|
| Is Text White | Checkbox |

---

### 3.12 Contact Form `{1CA4719F-EDBB-4681-8696-58073E4C2AB8}`

**Inherits from:** Standard Template

**Section: Contact Form**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Description | Rich Text |
| Fields | Multi-Line Text |
| ButtonText | Single-Line Text |
| Sucess Message | Rich Text |

**Section: Email information**

| Field Name | Type |
|-----------|------|
| ToEmail | Single-Line Text |
| From Email | Single-Line Text |
| Email Subject | Single-Line Text |
| Email Template | Multi-Line Text |

---

### 3.13 Request Form Field `{B97327C9-1D09-4B7C-987D-2F286F19B5AA}`

**Inherits from:** Standard Template

**Section: Series Form Field**

| Field Name | Type |
|-----------|------|
| Text | Single-Line Text |
| Type | Single-Line Text |
| Required | Checkbox |
| Max Length | Single-Line Text |
| Regex Validation | Single-Line Text |

---

### 3.14 Meeting Topics Table `{36B72BC3-D653-4A48-8E3C-BBE49C71A4C7}`

**Inherits from:** *(No explicit base templates)*

**Section: Headings**

| Field Name | Type |
|-----------|------|
| Column Heading 1 | Single-Line Text |
| Column Heading 2 | Single-Line Text |
| Column Heading 3 | Single-Line Text |
| Column Heading 4 | Single-Line Text |
| Column Heading 5 | Single-Line Text |

---

### 3.15 Meeting Topics Row `{7C4DF24D-79A9-4B9E-852F-38CB570DB387}`

**Inherits from:** Standard Template

**Section: Content**

| Field Name | Type |
|-----------|------|
| Topic Name | Single-Line Text |
| Date | Single-Line Text |
| Description | Rich Text |
| Document | General Link |
| Audio | General Link |

---

### 3.16 Projects Table `{4026EC32-50DB-4E9F-A9E4-C5AC71F20002}`

**Inherits from:** *(No explicit base templates)*

**Section: Content**

| Field Name | Type |
|-----------|------|
| Active Projects | Droptree |
| Completed Projects | Droptree |
| Deffered Projects | Droptree |

---

### 3.17 Projects Table > Row `{03776791-B722-4063-A682-F58D9C8E9B40}`

**Inherits from:** *(No explicit base templates)*

**Section: Project - Column 1**

| Field Name | Type |
|-----------|------|
| Subtitle | Single-Line Text |
| Subtitle Row | Single-Line Text |
| Project Link | General Link |

**Section: Column 2**

| Field Name | Type |
|-----------|------|
| C2 Button 1 | Droptree |
| C2 Button 1 Label | Single-Line Text |
| C2 Button 1 Link | General Link |
| C2 Button 2 | Droptree |
| C2 Button 2 Label | Single-Line Text |
| C2 Button 2 Link | General Link |
| C2 Label or Button 1 | Single-Line Text |
| C2 Label or Button 2 | Single-Line Text |

**Section: Column 3**

| Field Name | Type |
|-----------|------|
| C3 Button 1 | Droptree |
| C3 Button 1 Label | Single-Line Text |
| C3 Button 1 Link | General Link |
| C3 Button 2 | Droptree |
| C3 Button 2 Label | Single-Line Text |
| C3 Button 2 Link | General Link |
| C3 Label or Button 1 | Single-Line Text |
| C3 Label or Button 2 | Single-Line Text |

**Section: Column 4**

| Field Name | Type |
|-----------|------|
| C4 Button 1 | Droptree |
| C4 Button 1 Label | Single-Line Text |
| C4 Button 1 Link | General Link |
| C4 Button 2 | Droptree |
| C4 Button 2 Label | Single-Line Text |
| C4 Button 2 Link | General Link |
| C4 Label or Button 1 | Single-Line Text |
| C4 Label or Button 2 | Single-Line Text |

**Section: Column 5**

| Field Name | Type |
|-----------|------|
| C5 Button 1 | Droptree |
| C5 Button 1 Label | Single-Line Text |
| C5 Button 1 Link | General Link |
| C5 Button 2 | Droptree |
| C5 Button 2 Label | Single-Line Text |
| C5 Button 2 Link | General Link |
| C5 Label or Button 1 | Single-Line Text |
| C5 Label or Button 2 | Single-Line Text |

---

### 3.18 Projects Table > Table `{E075099C-28E5-462D-A629-E3F00AB33888}`

**Inherits from:** *(No explicit base templates)*

**Section: Column Headings**

| Field Name | Type |
|-----------|------|
| Column 1 | Single-Line Text |
| Column 2 | Single-Line Text |
| Column 3 | Single-Line Text |
| Column 4 | Single-Line Text |
| Column 5 | Single-Line Text |

---

## 4. Page Templates

### 4.1 Homepage `{1748ED10-68F0-4A6E-8986-B2BD30205A2C}`

**Inherits from:** Standard Template, Base - Page

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Logo | Image |
| Logo Url | General Link |
| Header Main Menu | Droptree |
| Search Page | Droptree |
| Footer Navigation | Droptree |
| Footer Logo | Image |
| Footer Social | Droptree |
| Footer Left Side Links | Droptree |
| Footer Right Side Links | Droptree |
| Analytics Snippet | Multi-Line Text |
| Analytics Snippet Part Two | Multi-Line Text |
| AddThis Widget Source | Single-Line Text |

---

### 4.2 Standard Page `{A0418E74-CF42-45C5-A538-26AFECCA9E62}`

**Inherits from:** Standard Template, Base - Page, Base - News Tags
*(No own fields -- uses inherited fields from Base - Page and Base - News Tags)*

---

### 4.3 Standard Page With Side Navigation `{A247605D-74E0-428C-B909-CE20D4423225}`

**Inherits from:** Standard Template, Base - Page, Base - News Tags
*(No own fields -- same as Standard Page but renders with side navigation layout)*

---

### 4.4 News Article `{9769F3E7-7900-4BFB-B35D-8EE081F0C5DA}`

**Inherits from:** Standard Template, Base - Page, Base - News Tags, Summary

**Section: Content**

| Field Name | Type |
|-----------|------|
| Date | Date |
| Author | Droptree |
| Content | Rich Text |

---

### 4.5 Project `{5B254C29-288B-44CA-9D91-02E725EFA9DD}`

**Inherits from:** Base - Page, Summary, Rich Text Editor, CTA, Page CTA Configuration, Page Rich Text Configuration, Base - Redirect, Base - News Tags
**Insert options:** Rich Text Editor

**Section: Content**

| Field Name | Type |
|-----------|------|
| Project Status | Droptree |
| Issued Date | Date |

**Section: Disclaimer**

| Field Name | Type |
|-----------|------|
| Show | Checkbox |

---

### 4.6 Meeting Details `{2F06D9AE-86CC-4A6F-82E1-AADDA69B7A42}`

**Inherits from:** CTA, Page CTA Configuration, Base - Meetings Tags, Base - Page, Base - Fras Workflow

**Section: Content**

| Field Name | Type |
|-----------|------|
| Start Date | Date |
| End Date | Date |
| Time | Single-Line Text |
| Body Content | Rich Text |
| Google Map | Multi-Line Text |

**Section: Location**

| Field Name | Type |
|-----------|------|
| Address Line 1 | Single-Line Text |
| Address Line 2 | Single-Line Text |
| City | Single-Line Text |
| Province | Single-Line Text |
| Postal Code | Single-Line Text |

---

### 4.7 Member `{2A068006-5EC0-40DF-BD4F-B5FB7F456091}`

**Inherits from:** Standard Template, Base - Page

**Section: Content**

| Field Name | Type |
|-----------|------|
| Name | Single-Line Text |
| FRAS Title | Single-Line Text |
| Designation | Single-Line Text |
| Location | Single-Line Text |
| Photo | Image |
| Body Content | Rich Text |
| Appointed Date | Date |
| Term Expires | Single-Line Text |
| Is Voting Member | Checkbox |

---

### 4.8 Document for comment `{A9BC5DF5-19EE-41BE-90CD-3DFDF50EF83C}`

**Inherits from:** Standard Template, Base - Page, Summary

**Section: Content**

| Field Name | Type |
|-----------|------|
| Document State | Droptree |
| Type of Document | Droptree |
| Rich Text Content | Rich Text |

**Section: CTA Content**

| Field Name | Type |
|-----------|------|
| CTA Title | Single-Line Text |
| Teaser | Rich Text |
| Documents | Treelist |
| Button | Droptree |
| Button Label | Single-Line Text |
| Button Link | General Link |

**Section: Left Section Document Comment**

| Field Name | Type |
|-----------|------|
| Left Section Background | Droptree |

**Section: Support Materials**

| Field Name | Type |
|-----------|------|
| Support Section Title | Single-Line Text |
| Links | Treelist |
| Linked Documents | Treelist |
| Right Section Background | Droptree |

---

### 4.9 Internal Or External News Page `{6B8C566C-056B-4CBD-9D64-D8B771578118}`

**Inherits from:** Base - News Tags, Base - Fras Workflow

**Section: Content**

| Field Name | Type |
|-----------|------|
| Title | Single-Line Text |
| Date | Date |
| Content | Rich Text |
| Link | General Link |

---

### 4.10 Error Page `{0EF62899-96EE-4311-BF3E-8AE28F8E563A}`

**Inherits from:** Standard Template, Base - Page

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Response Status Code | Single-Line Text |

**Section: Content**

| Field Name | Type |
|-----------|------|
| Message | Rich Text |

---

### 4.11 Redirect Landing `{572FB106-EC32-43EA-A888-BFFA9F6AE9FA}`

**Inherits from:** Base - Page, Base - Redirect
*(No own fields -- inherits redirect target from Base - Redirect)*

---

### 4.12 RSS Listing Feed `{A2EA910B-5687-4620-8140-9CD508872123}`

**Inherits from:** Standard Template, `{B960CBE4-381F-4A2B-9F44-A43C7A991A0B}` (external/SXA base template)

**Section: Data**

| Field Name | Type |
|-----------|------|
| Listing Page | Droptree |

---

### 4.13 Redirect `{61D46F59-F6C1-43E2-A427-9281F4A43854}`

**Inherits from:** Base - Simple Workflow, Standard Template

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Redirect Page | General Link |
| Is Permanent Redirect | Checkbox |
| Requested By | Single-Line Text |

---

### 4.14 IRCSS Homepage `{5541801E-8650-4B4B-8C0A-3A1AFC510814}`

**Inherits from:** Base - Page

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Logo | Image |
| Logo Url | General Link |
| Header Menu | Droptree |
| Banner Image | Image |
| Footer Links | Droptree |
| Analytics Header Snippet | Multi-Line Text |
| Analytics Body Snippet | Multi-Line Text |

---

## 5. Folder Templates

### 5.1 Page Components `{B13A1257-4A77-43BE-88B2-828621FB795E}`

**Inherits from:** Standard Template, Base - Fras Workflow
*(No own fields -- container for page component items)*

---

### 5.2 Generic Folder `{EA4BF347-D6FE-452A-BFD3-CF2B69FFB47C}`

**Inherits from:** Standard Template
*(No own fields)*

---

### 5.3 Staff Contact Folder `{6924E840-C27C-4F3F-B5E1-09371C8158BC}`

*(No own fields -- container for Staff Contact items)*

---

### 5.4 Author Folder `{B238C73C-1154-4B89-922C-49349411DFBA}`

*(No own fields -- container for Author items)*

---

### 5.5 Label Folder `{15DAD16A-226C-49B3-B748-0F9842C46F14}`

*(No own fields)*

---

### 5.6 State Folder `{C3C8F09E-019F-4BE7-A407-1D6FE3059203}`

*(No own fields -- container for State items)*

---

### 5.7 Tag Folder `{6548CD4E-02D4-473C-93C9-81CF5D144743}`

*(No own fields -- container for Tag items)*

---

### 5.8 Type of Document Folder `{8DBB76D6-DFFE-4DC6-81C4-EB6332532D78}`

*(No own fields -- container for Type of Document items)*

---

### 5.9 Redirect Folder `{000C3F58-5997-43AF-8D12-0536E96646FC}`

*(No own fields -- container for Redirect items)*

---

### 5.10 Request Form Fields Folder `{4840B2E9-92B3-4D8B-AD68-52497528DE4F}`

*(No own fields)*

---

### 5.11 Series Forms Folder `{443BC356-6708-4D4C-BCE3-9586C17ED939}`

*(No own fields)*

---

### 5.12 Site Component Folder `{CE1BF5B9-6375-4631-A261-547C95A62BBF}`

*(No own fields)*

---

## 6. Module Templates (Configuration Manager)

### 6.1 Base - Configuration `{869E88E7-86E1-4E1C-9D44-4C7B112EB6E0}`

**Inherits from:** Standard Template

**Section: Base Configuration**

| Field Name | Type |
|-----------|------|
| Key | Single-Line Text |

---

### 6.2 Configurations `{23CD1332-FD12-4CF3-8BA1-7A6BC4A2128B}`

**Inherits from:** Standard Template
*(No own fields -- container for config items)*

---

### 6.3 Config Folder `{7A4F3535-300B-44FD-985B-21FD3D416C15}`

*(No own fields)*

---

### 6.4 Single-Line Text Config `{4512ECEF-0D56-48C2-991B-7679A304B98F}`

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Value | Single-Line Text |

---

### 6.5 Multi-Line Text Config `{C40F89BE-499C-4CE6-9244-2EEE4ACD3CEA}`

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Value | Multi-Line Text |

---

### 6.6 Rich Text Config `{C1128211-1194-4201-9682-D7071113BCAF}`

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Value | Rich Text |

---

### 6.7 General Link Config `{58DADE9F-1DAF-4B8A-A3B9-F71FD301C91D}`

**Section: Configuration**

| Field Name | Type |
|-----------|------|
| Value | General Link |

---

### 6.8 Single-Line Text Config Shared `{79837EF3-2AD5-403E-B7BB-3F40D6F84D4A}`

**Section: Configuration**

| Field Name | Type | Shared |
|-----------|------|--------|
| Value | Single-Line Text | Yes |

---

### 6.9 Image Config Shared `{78E5104D-98CC-4CDF-A771-B9A60F9C703F}`

**Section: Configuration**

| Field Name | Type | Shared |
|-----------|------|--------|
| Value | Image | Yes |

---

### 6.10 General Link Config Shared `{574A0353-6698-47F1-88EE-B3CFDE07D23E}`

**Section: Configuration**

| Field Name | Type | Shared |
|-----------|------|--------|
| Value | General Link | Yes |

---

## 7. Template Inheritance Map

This section shows the full inheritance chain for key page templates, resolving all transitive base templates.

### Homepage
```
Homepage
  +-- Base - Page
  |     +-- Base - Fras Workflow
  |     +-- Base - Featured Page
  |     +-- Base - Indexable
  |     +-- Standard Template
  +-- Standard Template
```

### Standard Page / Standard Page With Side Navigation
```
Standard Page
  +-- Base - Page (all fields above)
  +-- Base - News Tags (Tags, Type of News, Type of Resource, Project GUID)
  +-- Standard Template
```

### News Article
```
News Article
  +-- Base - Page (all base page fields)
  +-- Base - News Tags (tagging fields)
  +-- Summary (Title, Description, Description 2)
  +-- Standard Template
```

### Project
```
Project
  +-- Base - Page (all base page fields)
  +-- Summary (Title, Description, Description 2)
  +-- Rich Text Editor (Content)
  +-- CTA (inherits Base - Cta: all button/CTA fields)
  +-- Page CTA Configuration (Is Text Black)
  +-- Page Rich Text Configuration (Is Text White)
  +-- Base - Redirect (Redirect Target)
  +-- Base - News Tags (tagging fields)
```

### Meeting Details
```
Meeting Details
  +-- CTA (inherits Base - Cta: all button/CTA fields)
  +-- Page CTA Configuration (Is Text Black)
  +-- Base - Meetings Tags (Tags, Type Of Meeting, Project GUID)
  +-- Base - Page (all base page fields)
  +-- Base - Fras Workflow
```

### Document for comment
```
Document for comment
  +-- Base - Page (all base page fields)
  +-- Summary (Title, Description, Description 2)
  +-- Standard Template
```

### Member
```
Member
  +-- Base - Page (all base page fields)
  +-- Standard Template
```

---

## 8. Field Type Distribution

| Field Type | Count | Notes |
|-----------|-------|-------|
| Single-Line Text | ~115 | Most common type |
| General Link | ~40 | URLs, internal/external links |
| Droptree | ~35 | References to other items (colors, states, tags) |
| Rich Text | ~25 | HTML content fields |
| Checkbox | ~20 | Boolean flags |
| Image | ~15 | Media library references |
| Treelist | ~10 | Multi-select references (tags, documents) |
| Date | ~8 | Date fields |
| Multi-Line Text | ~8 | Plain text (scripts, analytics snippets) |

---

## 9. Key Observations for CMS Migration

1. **Deep inheritance**: Page templates inherit up to 8 base templates. The Payload CMS schema should flatten these into collection-level field groups.

2. **Button system**: The CTA system supports up to 4 buttons, each with a Droptree reference to a Button Style item (colors, borders, text). Consider a simpler approach in Payload with inline style options.

3. **Tag architecture**: Tags use Treelist fields pointing to a `/sitecore/content/Fras/Site-Components/Tags/` tree structure. This maps to Payload relationship fields pointing to a Tags collection.

4. **Projects Table complexity**: The Projects Table Row template has 5 column sections, each with up to 8 fields (buttons, labels, links). This is highly denormalized -- consider an array-of-columns approach in Payload.

5. **Workflow templates**: Three workflow base templates (Fras, Component, Simple) are inherited by most templates. These control Sitecore workflow states and don't need migration -- Payload has its own draft/publish system.

6. **Configuration Manager**: A module for key-value configuration pairs. This maps to Payload globals or a settings collection.

7. **Shared vs Versioned fields**: Many fields marked `shared=1` (same across all language versions). Important for bilingual EN/FR -- shared fields like FRAS ID Number, Section Title, etc. should not be localized in Payload.

8. **The "Summary" component pattern**: Used as a base template by News Article, Project, and Document for comment. It provides a collapsible description ("see more" pattern). In Payload, this becomes a reusable field group.

9. **Meeting Topics Table**: A 5-column dynamic table with Topic Name, Date, Description, Document link, and Audio link. This maps to an array field in Payload.

10. **IRCSS Homepage**: A separate site within the same Sitecore instance with its own header/footer configuration. This may need its own site config in the Payload rebuild.
