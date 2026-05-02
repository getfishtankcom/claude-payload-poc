# Sitecore Package Export: Renderings, Layouts & Placeholder Settings

**Source:** Sitecore 10.2 package extracted at `data/old-fras-dump/_extracted/fras-214mb/contents/`
**Generated:** 2026-03-04
**Total items documented:** 1 layout, 51 sublayouts, 27 Coveo renderings, 5 placeholder settings

---

## 1. Layouts

| Name | Sitecore ID | Path (.aspx) | Notes |
|------|-------------|--------------|-------|
| FRAS Layout | `{159B1777-C796-4970-8073-90EBCC0D1591}` | `/layouts/Layouts/Site/FrasLayout.aspx` | Main site layout. Created 2018-05-23. Single layout for entire FRAS site. |

---

## 2. Sublayouts Inventory

### 2.1 Components (`CPA - FRAS/Components/`)

| # | Name | Sitecore ID | .ascx Path | Datasource Template | Placeholder | Notes |
|---|------|-------------|------------|---------------------|-------------|-------|
| 1 | Back To Project | `{D06EF1B5-A4AE-4734-A15D-F96CF81A7905}` | `~/layouts/Sublayouts/CPA - FRAS/Components/BackToProject.ascx` | -- | -- | Navigation back-link from sub-pages to parent project |
| 2 | Banner | `{C7B49F9D-784B-4FB2-9D73-4376C78E0177}` | `~/layouts/Sublayouts/CPA - FRAS/Components/Banner.ascx` | `/sitecore/templates/NLC/Components/Fras/Banner` | -- | Hero/banner image component. Allowed in `phBanner` placeholder. |
| 3 | Committee Members List | `{71BD77CA-C3AC-4070-BAD8-4986BDA69164}` | `/layouts/Sublayouts/CPA - FRAS/Components/CommitteeMembersList.ascx` | -- | -- | Has parameters template `{CE744B38-...}`. Allowed in `mainContent`. |
| 4 | Coveo Fras Search Results | `{AACCFCC1-8D30-4CF0-B826-505571A51EEB}` | `~/layouts/Sublayouts/CPA - FRAS/Components/SearchResults.ascx` | `/sitecore/Templates/CoveoModule/Search/Coveo Search Parameters` | `mainContent` | Coveo search results integration. Has parameters template. Sort order -100 (high priority). |
| 5 | Disclaimer | `{DFDF684D-0D0B-473F-9870-CC360D3CC8B3}` | `~/layouts/Sublayouts/CPA - FRAS/Components/Disclaimer.ascx` | `/sitecore/templates/NLC/Components/Fras/Disclaimer` | -- | Disclaimer text block |
| 6 | Document Comment Section | `{0C7618FA-E066-4374-A609-8DFA012652E9}` | `/layouts/Sublayouts/CPA - FRAS/Components/DocumentComment.ascx` | -- | -- | Editable. Comment section for document feedback. Allowed in `mainContent`. |
| 7 | Document Table | `{255189B5-734C-4C05-81C7-E8D7A7B6F666}` | `/layouts/Sublayouts/CPA - FRAS/Components/DocumentTable.ascx` | -- | -- | Editable. Displays document listing tables (standards docs, exposure drafts, etc.) |
| 8 | Effective Dates Table | `{C3A5D577-3570-4172-8822-796F608CA1A8}` | `/layouts/Sublayouts/CPA - FRAS/Components/EffectiveDatesTables.ascx` | `/sitecore/templates/Branches/NLC/Fras/Effective Dates Table` | -- | Datasource location `./`. Standards effective dates display. |
| 9 | Error Message | `{650FCD48-1C3A-4A80-9B39-9A72A3A29359}` | `/layouts/Sublayouts/CPA - FRAS/Components/ErrorRte.ascx` | -- | -- | Error page rich text content |
| 10 | Footer | `{E44EC0DD-C7CF-443D-9CAE-094C0C835D65}` | `/layouts/Sublayouts/CPA - FRAS/Components/Footer.ascx` | -- | -- | Site footer. Allowed in `bottomContent` placeholder. |
| 11 | Generic CTA | `{E7856C0E-1A97-418D-83A1-AC0170A9BC8E}` | `~/layouts/Sublayouts/CPA - FRAS/Components/CTA.ascx` | `/sitecore/templates/NLC/Components/Fras/CTA` | -- | Call-to-action block. Has parameters template `{CBFD0EA8-...}`. Datasource location `./`. Allowed in `mainContent`. |
| 12 | Header | `{A32D27DF-8CF0-42E7-B677-F9CD6C5577E8}` | `~/layouts/Sublayouts/CPA - FRAS/Components/Header.ascx` | -- | -- | Site header/navigation. Allowed in `topHeader` placeholder. |
| 13 | Image | `{E2942A34-42BA-407B-8957-6414006E428E}` | `/layouts/Sublayouts/CPA - FRAS/Components/Image.ascx` | `/sitecore/templates/NLC/Components/Fras/Logo Image` | -- | Single image display. Datasource location `./`. |
| 14 | Image Grid | `{3C5FC46C-7619-4FAD-9ED7-A76E4257224F}` | `/layouts/Sublayouts/CPA - FRAS/Components/ImageGrid.ascx` | -- | -- | Multi-image grid display (board logos, partner logos) |
| 15 | Meeting Page Details | `{7EF4817A-3FC2-47CA-8A43-2858E86B46EF}` | `/layouts/Sublayouts/CPA - FRAS/Components/MeetingPageDetails.ascx` | -- | -- | Individual meeting detail page. Allowed in `mainContent`. |
| 16 | Meeting Summaries Rollup | `{47B5C8B8-9257-41FF-8D13-E25A6190737C}` | `/layouts/Sublayouts/CPA - FRAS/Components/MeetingSummariesRollup.ascx` | `/sitecore/templates/NLC/Data/Fras/Meeting Rollups Configuration` | -- | Datasource locations: `./` or `/sitecore/content/Fras/Site-Components/Rollup-Configs`. Allowed in `mainContent`. |
| 17 | Meetings Listing | `{4D048D64-19D4-4161-B84B-929ADB129526}` | `/layouts/Sublayouts/CPA - FRAS/Components/MeetingsListing.ascx` | `/sitecore/templates/NLC/Data/Fras/Meeting Listings Configuration` | -- | Datasource location `./`. Allowed in `mainContent`. |
| 18 | Member Details | `{6BB497CF-559E-4AAA-BC3E-088078D37B3F}` | `/layouts/Sublayouts/CPA - FRAS/Components/MemberDetails.ascx` | -- | -- | Individual board/committee member profile page |
| 19 | Members List | `{68A23980-00A4-42AA-BC18-79FBE6BA2C24}` | `/layouts/Sublayouts/CPA - FRAS/Components/MembersList.ascx` | -- | -- | Editable. Has parameters template `{43CD000D-...}`. Board/committee members listing. |
| 20 | News Article Header | `{CE5DF31F-40E1-42D6-83B8-FA58B24FBB73}` | `/layouts/Sublayouts/CPA - FRAS/Components/NewsArticleHeader.ascx` | -- | -- | News article page header (title, date, etc.) |
| 21 | News Details | `{1FBE9715-5CCD-4617-B614-BAED48775BE9}` | `/layouts/Sublayouts/CPA - FRAS/Components/NewsDetails.ascx` | -- | -- | News article body content |
| 22 | News Listing | `{23C6F8C2-6068-4EEA-85ED-B7A2E716668B}` | `/layouts/Sublayouts/CPA - FRAS/Components/NewsLanding.ascx` | `/sitecore/templates/NLC/Data/Fras/News Listings Configuration` | `maincontent` | Editable. Datasource location `./`. News landing/listing page. Allowed in `mainContent`. |
| 23 | News Rollup | `{A07B5970-30CF-4496-B5B7-A43D7DCF9A40}` | `/layouts/Sublayouts/CPA - FRAS/Components/NewsRollup.ascx` | `/sitecore/templates/NLC/Data/Fras/News Rollups Configuration` | -- | Editable. Datasource locations: `./` or `/sitecore/content/Fras/Site-Components/Rollup-Configs`. Allowed in `mainContent`. |
| 24 | Page Title | `{BE083611-BC3D-40E4-842F-EF935D54653C}` | `~/layouts/Sublayouts/CPA - FRAS/Components/PageTitle.ascx` | -- | -- | Page title/H1 display |
| 25 | Project Details | `{991E6D8C-8270-4BE3-A600-EAD2B309D9E3}` | `/layouts/Sublayouts/CPA - FRAS/Components/ProjectDetails.ascx` | `/sitecore/templates/Branches/NLC/Fras/Project Status Table` | -- | Datasource location `./`. Project status details with table. |
| 26 | Project Document Rich Text | `{1978AAFF-9373-4EFA-B288-32006036E8E0}` | `/layouts/Sublayouts/CPA - FRAS/Components/ProjectDocumentRte.ascx` | -- | -- | Rich text for project document pages |
| 27 | Project Overview | `{388422C0-F9B3-4AC8-820A-730776B991EB}` | `/layouts/Sublayouts/CPA - FRAS/Components/ProjectOverview.ascx` | -- | -- | Datasource location `/sitecore/content/Fras/Home`. Project overview/summary display. |
| 28 | Projects Tables | `{6DBA5F01-EFD1-4C2F-A1C0-33E9908332F0}` | `/layouts/Sublayouts/CPA - FRAS/Components/ProjectsTable.ascx` | `/sitecore/templates/Branches/NLC/Fras/Projects Table` | -- | Editable. Datasource location `./`. Active/completed projects tabular listing. |
| 29 | Search Past Meeting Topics Table | `{B4335DCB-D4A4-4A06-912F-FEE6E30C197E}` | `/layouts/Sublayouts/CPA - FRAS/Components/PastMeetingsTable.ascx` | `/sitecore/templates/NLC/Data/Fras/Meeting Topics/Meeting Topics Table` | -- | Datasource location `./`. Past meeting topics searchable table. |
| 30 | Section Title | `{9E0E3CBE-88C1-41A1-B646-AFEB64D4A72C}` | `/layouts/Sublayouts/CPA - FRAS/Components/SectionTitle.ascx` | -- | -- | Section heading component |
| 31 | Staff Contact | `{0110D73B-31F3-476A-9545-C3FE101028AC}` | `~/layouts/Sublayouts/CPA - FRAS/Components/StaffContactSublayout.ascx` | -- | -- | Has parameters template `{8C8D42EA-...}`. Staff contact info block (name, email, phone). |
| 32 | Standards List | `{A80203F7-3065-470D-891E-2B4F201D8969}` | `/layouts/Sublayouts/CPA - FRAS/Components/StandardsList.ascx` | `/sitecore/templates/NLC/Components/Fras/Standards List Group` | -- | Datasource location `./`. Standards listing with groups. |
| 33 | Summary | `{45D51D1F-1043-49E9-8BC1-40666E74B54A}` | `/layouts/Sublayouts/CPA - FRAS/Components/StaffSummary.ascx` | `/sitecore/templates/NLC/Components/Fras/Summary` | -- | Datasource location `./`. Staff/board summary block. |
| 34 | Upcoming Meetings Rollup | `{C051D1BB-0927-4F03-BA6E-172B52399C0E}` | `/layouts/Sublayouts/CPA - FRAS/Components/UpcomingMeetingsRollup.ascx` | `/sitecore/templates/NLC/Data/Fras/Meeting Rollups Configuration` | -- | Datasource locations: `./` or `/sitecore/content/Fras/Site-Components/Rollup-Configs`. Allowed in `mainContent`. |

### 2.2 Containers (`CPA - FRAS/Containers/`)

| # | Name | Sitecore ID | .ascx Path | Placeholder Exposed | Notes |
|---|------|-------------|------------|---------------------|-------|
| 35 | Dynamic Container | `{83EDD266-BCF9-43B2-8FE1-60AA9FFB9A29}` | `/layouts/Sublayouts/CPA - FRAS/Containers/DynamicContainer.ascx` | `ColumnsContent` | Has parameters template `{21B21F7F-...}`. Flexible container for dynamic column layouts. Allowed in `mainContent`. Updated 2024-01-23. |
| 36 | Two Columns | `{89A42BBB-5BB8-41EB-88B3-995C0705E98E}` | `~/layouts/Sublayouts/CPA - FRAS/Containers/TwoColumn_8_4.ascx` | -- | 8/4 column split layout (Bootstrap grid: col-8 + col-4) |

### 2.3 Coveo Search (`CPA - FRAS/Coveo/`)

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 37 | Coveo Hosted Search Page | `{5D19EE2D-A171-4659-81E3-D1C3E30919DA}` | `~/layouts/Sublayouts/CPA - FRAS/Coveo/CoveoHostedSearchPage.ascx` | Coveo hosted search page integration |

### 2.4 CTA Forms (`CPA - FRAS/CTA-Forms/`)

All CTA forms share parameters template `{9D11C106-590E-497D-AD77-170E7781D18E}`.

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 38 | RegisterToAttend | `{31ABC64C-55B0-4E3F-87E8-AC285ACEF416}` | `/layouts/Sublayouts/CPA - FRAS/CTA-Forms/RegisterToAttendForm.ascx` | Meeting registration (attend) form |
| 39 | RegisterToObserve | `{DD5E12C8-94E7-4282-84A3-3369A267A24D}` | `/layouts/Sublayouts/CPA - FRAS/CTA-Forms/RegisterToObserveForm.ascx` | Meeting registration (observe) form |
| 40 | RegisterToVolunteer | `{4A3FED78-A696-4CD4-B89C-428B51059C92}` | `/layouts/Sublayouts/CPA - FRAS/CTA-Forms/RegisterToVolunteerForm.ascx` | Volunteer registration form |
| 41 | SubmitAgendaItemForm | `{5EC07AB5-7332-4EA1-BDBE-CABFBAA3AB63}` | `/layouts/Sublayouts/CPA - FRAS/CTA-Forms/SubmitAgendaItem.ascx` | Agenda item submission form |
| 42 | SubmitComment | `{247642BE-580D-4E29-8B34-7CE151E8B221}` | `/layouts/Sublayouts/CPA - FRAS/CTA-Forms/SubmitCommentForm.ascx` | Document/consultation comment submission form |

### 2.5 IRCSS Components (`CPA - FRAS/IRCSS/Components/`)

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 43 | Header (IRCSS) | `{032B6027-8B6C-4C08-B637-1016305C5554}` | `/layouts/Sublayouts/CPA - FRAS/IRCSS/Components/Header.ascx` | IRCSS-specific header variant. Created 2021-07-19. |

### 2.6 Preference Centre (`CPA - FRAS/PreferenceCentre/`)

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 44 | MySubscriptions | `{0DAF6479-BF65-4849-A4C1-7D234AA14FA3}` | `/layouts/Sublayouts/CPA - FRAS/PreferenceCentre/MySubscriptionsForm.ascx` | Email subscription management form |
| 45 | UnsubscribeFeedback | `{F81A2E1F-864F-4A70-8E23-FB2400947D86}` | `/layouts/Sublayouts/CPA - FRAS/PreferenceCentre/UnsubscribeFeedbackForm.ascx` | Unsubscribe feedback/reason form |

### 2.7 Site Elements (`CPA - FRAS/Site Elements/`)

| # | Name | Sitecore ID | .ascx Path | Datasource Template | Notes |
|---|------|-------------|------------|---------------------|-------|
| 46 | Breadcrumb | `{7A56C78E-AEDB-46BD-9B65-05B01315D3D6}` | `/layouts/Sublayouts/CPA - FRAS/SiteElements/Breadcrumb.ascx` | -- | Breadcrumb navigation trail |
| 47 | ContactForm | `{154E3B8E-E812-4A69-ACAD-A36FAE8276E1}` | `/layouts/Sublayouts/Site/SiteElements/ContactUsForm.ascx` | `/sitecore/templates/NLC/Data/ContactForms/Contact Form` | Placeholder: `leftcolumn`. Datasource: `/sitecore/content/Fras/Configurations/Settings/FRAS-Contact-Forms`. NOTE: .ascx path is under `Site/` not `CPA - FRAS/`. Allowed in `mainContent`. Created 2022-10-31. |
| 48 | Rich Text | `{1C1624C8-0FC1-45C3-9203-1B6D7A8FB4D3}` | `/layouts/Sublayouts/CPA - FRAS/Components/RichText.ascx` | `/sitecore/templates/NLC/Components/Fras/Rich Text Editor` | Datasource location `./`. Has parameters template `{08ADA9C2-...}`. General-purpose rich text editor block. |
| 49 | Secondary Navigation | `{4B00C86A-AA40-4B2B-8F2B-0B7EC30DA366}` | `/layouts/Sublayouts/CPA - FRAS/SiteElements/SecondaryNavigation.ascx` | `/sitecore/templates/NLC/Components/Fras/Menu` | Datasource: `/sitecore/content/Fras/Site-Components/Secondary-Navigations`. Tab/horizontal sub-navigation. Allowed in `topContent`. |
| 50 | Side Navigation | `{68B6CF7D-1B66-425E-B2FF-E5252ADD3789}` | `/layouts/Sublayouts/CPA - FRAS/SiteElements/SideNavigation.ascx` | `/sitecore/templates/NLC/Components/Fras/Menu` | Datasource: `/sitecore/content/Fras/Site-Components/Side-Navigations` or `/sitecore/content/Fras/Site-Components/IRCSS/Secondary-Navigations`. Left sidebar tree navigation. |

### 2.8 Aptify Auth Sublayouts (`AptifyLayouts/Proxies/`)

Legacy authentication sublayouts (pre-CPA Canada federated auth). All created 2014-05-26 by `sitecore\roberto`.

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 51 | FrasChangePassword | `{C20B4CCE-1E88-4158-99AD-54FEB8BC4F24}` | `/layouts/Sublayouts/AptifyLayouts/Proxies/FrasChangePassword.ascx` | Password change form |
| 52 | FrasForgotUID | `{02476678-634C-4725-B192-F695EB3B5304}` | `/layouts/Sublayouts/AptifyLayouts/Proxies/FrasForgotUID.ascx` | Forgot user ID form |
| 53 | FrasForgotUsername | `{EF09E1C7-8744-46D4-82EA-4EC6AF123CB1}` | `/layouts/Sublayouts/AptifyLayouts/Proxies/FrasForgotUsername.ascx` | Forgot username form |
| 54 | FrasLogin | `{91466C5D-5D30-49F6-B2D1-743B2D659AA5}` | `/layouts/Sublayouts/AptifyLayouts/Proxies/FrasLogin.ascx` | Login form |
| 55 | FrasRegister | `{109B4040-C07C-4655-8477-E4F01BA5D445}` | `/layouts/Sublayouts/AptifyLayouts/Proxies/FrasRegister.ascx` | Registration form |

### 2.9 Site-Level Sublayouts (`Site/Components/`)

| # | Name | Sitecore ID | .ascx Path | Notes |
|---|------|-------------|------------|-------|
| 56 | Scriptbox | `{5D384A9B-444F-40D4-A4A3-E91F325E76A3}` | `/layouts/Sublayouts/Site/Components/Scriptbox.ascx` | Cacheable (varies by data). Datasource: `/sitecore/templates/NLC/Components/Scriptbox`. Inline JS/tracking script injection. Created 2012-07-11. |

---

## 3. Coveo Hive Renderings (`Renderings/Coveo Hive/`)

These are third-party Coveo search renderings included in the package. They power the site search functionality.

| # | Name | Sitecore ID | Category | Notes |
|---|------|-------------|----------|-------|
| 1 | Coveo For Sitecore Analytics | `{104B30A5-499C-4AF0-A670-8287E78107DD}` | Analytics | Search analytics tracking |
| 2 | Coveo Did You Mean | `{92400C60-06DD-4992-B7DD-15C2AA3CDD1D}` | Components | "Did you mean" suggestion |
| 3 | Coveo Error Report | `{9A1A68CE-83C0-47E7-BAEE-7F5BBEF6688F}` | Components | Search error display |
| 4 | Coveo Pager | `{C4D83380-BB91-4FC3-BEF5-2E3303338EF6}` | Components | Pagination |
| 5 | Coveo Query Summary | `{1129FBCD-79D1-4E47-8F92-10A02F37017E}` | Components | "X results for Y" summary |
| 6 | Coveo Result Layout | `{A163DFC4-3165-491A-B3F7-22FE8296B2FC}` | Components | Result display layout |
| 7 | Coveo Results Per Page | `{0BD1AAAB-0F08-47E1-BD73-2B6C68025A09}` | Components | Per-page count selector |
| 8 | Coveo Date Facet Slider | `{1EAD1A72-CCCD-4936-B308-D5590370FA55}` | Facets | Date range facet |
| 9 | Modular Frame | `{AD7D1F7E-532E-4182-80E8-DB0C2486B1B3}` | Frames | Content frame/wrapper |
| 10 | Coveo Search Resources | `{41C7C6DD-C132-44BD-890A-B035056BC054}` | Resources | JS/CSS resources |
| 11 | Coveo File Result Template | `{7BB9166C-352F-478E-A7A7-A85DC436F360}` | Result Templates | File result display |
| 12 | Coveo Results List | `{C2A2688A-5B1C-4AE9-9A3A-0B998D7A9FA0}` | Results List | Main results list |
| 13 | Coveo Searchbox | `{C6B7791B-47BD-4923-A3A1-A98452EB41CD}` | Search Boxes | Search input box |
| 14 | Coveo Search Interface | `{79DFC8A6-2B6D-4B17-A2D0-7A7D7E57ED32}` | Search Interfaces | Main search container |
| 15 | Facets Section | `{4C11B44C-55AF-48C7-ADC7-344497C879A3}` | Sections | Facet filters section |
| 16 | Results Header Section | `{345437C0-7B02-474F-BEC1-09DD0F8B0019}` | Sections | Results header |
| 17 | Results Layout Section | `{1D51A851-C9D2-4964-9634-6D367228BF7C}` | Sections | Results layout wrapper |
| 18 | Results Section | `{1C70D35F-ECA6-4F33-97A3-6111B8436078}` | Sections | Results content area |
| 19 | Results Sorts Section | `{6797934F-90B9-432F-AD6D-EAF64487E53D}` | Sections | Sort controls section |
| 20 | Results Summary Section | `{7284C82B-5E12-4247-8C4D-F689483C819A}` | Sections | Results summary area |
| 21 | Search Section | `{9C61D639-E07C-4F21-A40F-91A4B42D0390}` | Sections | Search section wrapper |
| 22 | Tabs Section | `{873D62A0-C161-4F41-9F5C-2BF2AEA23A31}` | Sections | Search tabs section |
| 23 | Coveo Share Query | `{F1725D82-7141-4F67-9508-E46BC25B8157}` | Settings Button Options | Share/copy search URL |
| 24 | Coveo Date Sort | `{144F9C19-0647-46BC-B766-CBF620E0B9B1}` | Sorts | Sort by date |
| 25 | Coveo Relevancy Sort | `{1AF65AE3-7BA9-4F1F-89C2-1329A82C429E}` | Sorts | Sort by relevance |
| 26 | Coveo Tab | `{F9A36720-FF33-469A-9E61-5C6A3D567C6A}` | Tabs | Search tab |

### System Renderings

| # | Name | Sitecore ID | Notes |
|---|------|-------------|-------|
| 27 | FeedRenderer | `{86F838F5-7E87-45BB-876F-C021324AC8B0}` | RSS/Atom feed rendering (system) |

---

## 4. Placeholder Settings

### 4.1 Placeholder Zone Map

| Placeholder Name | Placeholder Key | Editable | Allowed Controls | Description |
|------------------|-----------------|----------|------------------|-------------|
| **Top Header** | `topHeader` | No (locked) | Header `{A32D27DF}` | Fixed site header zone. Only the Header sublayout is allowed. |
| **Top** | `topContent` | Yes | Secondary Navigation `{4B00C86A}` | Below header, above main content. Secondary/tab navigation zone. |
| **Banner** | `phBanner` | Yes | Banner `{C7B49F9D}` | Hero banner image zone. Only the Banner sublayout is allowed. |
| **Main** | `mainContent` | Yes | Committee Members List `{71BD77CA}`, Document Comment Section `{0C7618FA}`, Dynamic Container `{83EDD266}`, Generic CTA `{E7856C0E}`, Meetings Listing `{4D048D64}`, Meeting Page Details `{7EF4817A}`, Meeting Summaries Rollup `{47B5C8B8}`, News Listing `{23C6F8C2}`, News Rollup `{A07B5970}`, Upcoming Meetings Rollup `{C051D1BB}`, ContactForm `{154E3B8E}` | Primary content zone. 11 sublayouts allowed. This is where most page content is composed. |
| **Bottom** | `bottomContent` | No (locked) | Footer `{E44EC0DD}` | Fixed site footer zone. Only the Footer sublayout is allowed. |

### 4.2 Layout-to-Placeholder Mapping

The Main placeholder setting contains embedded layout renderings data showing the FRAS Layout `{159B1777}` exposes three placeholder zones:

```
topContent  --> Placeholder Settings: CPA FRAS/Top
mainContent --> Placeholder Settings: CPA FRAS/Main
bottomContent --> Placeholder Settings: CPA FRAS/Bottom
```

Note: The bottom placeholder key in the renderings XML is `bottomConent` (typo in original -- missing 't' in "Content").

### 4.3 Additional Placeholder References (from sublayouts)

| Sublayout | Exposes Placeholder | Notes |
|-----------|---------------------|-------|
| Dynamic Container | `ColumnsContent` | Nested placeholder inside container for child components |
| ContactForm | `leftcolumn` | Column-specific placeholder |
| Coveo Fras Search Results | `mainContent` | Targets main content zone |
| News Listing | `maincontent` | Note: lowercase 'c' variant |

---

## 5. Datasource Template Registry

These are the Sitecore content templates referenced by sublayouts for their data:

| Template Path | Used By |
|---------------|---------|
| `/sitecore/templates/NLC/Components/Fras/Banner` | Banner |
| `/sitecore/templates/NLC/Components/Fras/CTA` | Generic CTA |
| `/sitecore/templates/NLC/Components/Fras/Disclaimer` | Disclaimer |
| `/sitecore/templates/NLC/Components/Fras/Logo Image` | Image |
| `/sitecore/templates/NLC/Components/Fras/Menu` | Secondary Navigation, Side Navigation |
| `/sitecore/templates/NLC/Components/Fras/Rich Text Editor` | Rich Text |
| `/sitecore/templates/NLC/Components/Fras/Standards List Group` | Standards List |
| `/sitecore/templates/NLC/Components/Fras/Summary` | Summary |
| `/sitecore/templates/NLC/Components/Scriptbox` | Scriptbox |
| `/sitecore/templates/NLC/Data/ContactForms/Contact Form` | ContactForm |
| `/sitecore/templates/NLC/Data/Fras/Meeting Listings Configuration` | Meetings Listing |
| `/sitecore/templates/NLC/Data/Fras/Meeting Rollups Configuration` | Meeting Summaries Rollup, Upcoming Meetings Rollup |
| `/sitecore/templates/NLC/Data/Fras/Meeting Topics/Meeting Topics Table` | Search Past Meeting Topics Table |
| `/sitecore/templates/NLC/Data/Fras/News Listings Configuration` | News Listing |
| `/sitecore/templates/NLC/Data/Fras/News Rollups Configuration` | News Rollup |
| `/sitecore/templates/Branches/NLC/Fras/Effective Dates Table` | Effective Dates Table |
| `/sitecore/templates/Branches/NLC/Fras/Project Status Table` | Project Details |
| `/sitecore/templates/Branches/NLC/Fras/Projects Table` | Projects Tables |
| `/sitecore/Templates/CoveoModule/Search/Coveo Search Parameters` | Coveo Fras Search Results |

---

## 6. Parameters Template References

Some sublayouts have additional rendering parameters templates:

| Sublayout | Parameters Template ID |
|-----------|----------------------|
| Committee Members List | `{CE744B38-0353-4F2B-AC9A-F89663106BBD}` |
| Generic CTA | `{CBFD0EA8-A43E-4F7C-8E0B-BD8EF01F11B4}` |
| Staff Contact | `{8C8D42EA-C999-4BF8-AB48-D5616BFC17EE}` |
| Members List | `{43CD000D-2AC4-4809-A5D8-085DF226AA13}` |
| Rich Text | `{08ADA9C2-FA1E-4BEC-A103-7D937FCB8096}` |
| Dynamic Container | `{21B21F7F-F98D-413A-8AE9-FD91F5DCBE0C}` |
| Coveo Fras Search Results | `{5E0C9885-2582-44D0-8296-A90845181835}` |
| All CTA Forms (5) | `{9D11C106-590E-497D-AD77-170E7781D18E}` |

---

## 7. Architecture Summary

### Page Composition Model

```
FRAS Layout (FrasLayout.aspx)
|
+-- topHeader (locked)
|   +-- Header.ascx
|
+-- phBanner
|   +-- Banner.ascx
|
+-- topContent
|   +-- SecondaryNavigation.ascx (tab nav)
|
+-- mainContent (author-editable, 11 allowed controls)
|   +-- [Any of: Committee Members List, Document Comment,
|   |    Dynamic Container, Generic CTA, Meetings Listing,
|   |    Meeting Page Details, Meeting Summaries Rollup,
|   |    News Listing, News Rollup, Upcoming Meetings Rollup,
|   |    ContactForm]
|   |
|   +-- Dynamic Container (nested placeholder: ColumnsContent)
|       +-- [child components]
|
+-- bottomContent (locked)
    +-- Footer.ascx
```

### Key Observations

1. **Single layout architecture**: The entire FRAS site uses one layout (`FrasLayout.aspx`) with 5 placeholder zones.

2. **Locked vs editable zones**: Header (`topHeader`) and Footer (`bottomContent`) are locked/non-editable. Only `mainContent` is fully author-composable.

3. **Component count**: 34 FRAS-specific components + 5 Aptify auth + 1 Scriptbox + 26 Coveo renderings = 66 total items.

4. **Not in placeholder settings but exist**: Many sublayouts (Back To Project, Breadcrumb, Disclaimer, Document Table, Effective Dates Table, Error Message, Image, Image Grid, Member Details, Members List, News Article Header, News Details, Page Title, Project Details, Project Document Rich Text, Project Overview, Projects Tables, Search Past Meeting Topics, Section Title, Staff Contact, Standards List, Summary, Side Navigation, Two Columns, Coveo Hosted Search Page, Rich Text) are NOT listed in any placeholder's allowed controls. These are either:
   - Hardcoded into page templates via standard values
   - Placed via presentation details on individual items
   - Used as nested sub-components within other sublayouts

5. **Coveo integration**: Heavy Coveo search integration with custom `SearchResults.ascx` wrapper and 26 Coveo Hive renderings.

6. **Legacy auth**: 5 Aptify authentication sublayouts from 2014 (pre-CPA federated auth migration).

7. **IRCSS variant**: Separate IRCSS Header component suggests the IRCSS section has a distinct header treatment.

8. **Typo in source**: The bottom placeholder in the layout renderings XML is `bottomConent` (missing 't').

### Component-to-Page-Type Mapping (inferred)

| Page Type | Likely Components Used |
|-----------|----------------------|
| Homepage | Banner, Image Grid, News Rollup, Upcoming Meetings Rollup, Meeting Summaries Rollup, Generic CTA |
| Board Landing | Banner, Secondary Navigation, Rich Text, News Rollup, Projects Tables, Staff Contact |
| Project Detail | Back To Project, Project Details, Project Overview, Document Table, Rich Text, Staff Contact, Generic CTA |
| Meeting Detail | Meeting Page Details, Document Table, RegisterToAttend, RegisterToObserve |
| News Listing | News Listing (NewsLanding.ascx) |
| News Article | News Article Header, News Details |
| Members Listing | Members List, Committee Members List |
| Member Detail | Member Details |
| Standards Page | Standards List, Effective Dates Table, Document Table |
| Search | Coveo Hosted Search Page OR Coveo Fras Search Results |
| Contact | ContactForm, Rich Text |
| Error Page | Error Message |
| Preference Centre | MySubscriptions, UnsubscribeFeedback |
| Auth Pages | FrasLogin, FrasRegister, FrasChangePassword, FrasForgotUID, FrasForgotUsername |
