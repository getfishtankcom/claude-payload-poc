# FRAS Canada — Component Registry

_Generated: 2026-03-05_

## Shared Page Scaffold

Every page on frascanada.ca shares this structural scaffold inside `<main#main-content>`:

| Section | ID / Selector | Purpose |
|---------|---------------|----------|
| Breadcrumbs | `#breadcrumb-container` | Path navigation (hidden on mobile) |
| Section Title | `#second-title-container` | Board/section name (e.g. "AcSB") |
| Sub-Navigation | `#second-navigation-container` | Tab navigation (About, Meetings, etc.) |
| Page Title | `#main-title-container` | H1 page title |
| Content Zone | _(varies by page type)_ | Unique content below scaffold |

## Content Block Wrappers

These are the top-level content containers found in the content zone.

| Wrapper | Page Types | Child Structure |
|---------|-----------|----------------|
| `.purple-info-container` | homepage, board-landing, board-subpage, board-meetings-listing, council-landing, council-subpage, council-committee, council-meetings-listing, council-news-listing, council-volunteer, about, board-project-detail, board-resources, section-landing, section-document-detail, section-subpage, section-projects-listing, section-project-detail, section-resources-listing, section-resource-detail, contact, static-page, news-detail | col-sm-12 col-xs-12 |
| `.maincontent_4_ScriptWrapper` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | 1 children |
| `.row` | board-about, board-member-profile, board-subpage, council-about, council-committee, about, board-resources, council-members-listing | rte-wrapper, sidebar-menu hidden-xs |
| `.maincontent_4_NewsListingPanel` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | section, input, input |
| `.section` | board-landing, board-project-detail, section-landing, section-subpage, section-project-detail, council-member-profile | col-sm-12 |
| `.detail-content-container` | council-news-detail, about, section-document-detail, section-resource-detail, news-detail | detail-content rte-wrapper |
| `.detail-content-intro` | council-news-detail, about, section-resource-detail, news-detail | col-sm-12 |
| `.new-meetings-news-container` | board-landing, council-landing, section-landing | meetings-news-content |
| `.maincontent_4_MeetingsListingPanel` | board-meetings-listing, council-meetings-listing | a, a, section |
| `.maincontent_4_PlMeetingDescription` | board-meeting-detail, council-meeting-detail | col-sm-12 col-xs-12 |
| `.project-table-container` | board-projects-listing, section-projects-listing | div |
| `.project-status-container` | board-project-detail, section-project-detail | project-status-content |
| `.section rollups` | board-project-detail, section-project-detail | div |
| `.form-section-content` | council-volunteer | rte-wrapper |
| `.section form-section` | council-volunteer | form-section-content |
| `.maincontent_12_DisclaimerWrapper` | board-project-detail | div |
| `.maincontent_9_DisclaimerWrapper` | board-project-detail | div |
| `.document-table-container document-for-comment-cont` | section-documents-listing | div |
| `.document-comment-container` | section-document-detail | left-sec-container, right-sec-container |
| `.maincontent_10_DisclaimerWrapper` | section-project-detail | div |
| `.maincontent_11_DisclaimerWrapper` | section-project-detail | div |
| `.boardMemberDesignation` | council-member-profile | 0 children |

## Sitecore CMS Control IDs

ASP.NET WebForms IDs reveal CMS rendering slots. Pattern: `maincontent_N_fieldName`

| Field Pattern | Tag | Page Types | Example Content |
|--------------|-----|-----------|----------------|
| `sectionTitle` | `p` | board-landing, board-about, board-member-profile, board-subpage, board-meetings-listing, board-meeting-detail, council-landing, council-subpage, council-about, council-committee, council-meetings-listing, council-news-listing, council-news-detail, council-volunteer, about, council-meeting-detail, board-projects-listing, board-project-detail, board-resources, section-landing, section-documents-listing, section-document-detail, section-subpage, section-projects-listing, section-project-detail, section-resources-listing, section-resource-detail, contact, static-page, news-listing, news-detail, council-members-listing, council-member-profile | AASB |
| `12colcontainer{guid}_N_PlRichText` | `div` | homepage, board-landing, board-subpage, board-meetings-listing, council-landing, council-subpage, council-meetings-listing, council-news-listing, council-volunteer, about, board-resources, section-landing, section-subpage, section-projects-listing, section-resources-listing, section-resource-detail, contact, static-page | .purple-info-container{margin-bottom:0px |
| `ScriptWrapper` | `div` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | //<![CDATA[
Sys.WebForms.PageRequestMana |
| `8col{guid}_N_PlRichText` | `div` | board-about, board-member-profile, board-subpage, council-about, council-committee, about, board-resources, council-members-listing | The Canadian Auditing and Assurance Stan |
| `4col{guid}_N_SideNavigationTitle` | `a` | board-about, board-member-profile, board-subpage, council-about, council-committee, about, board-resources, council-members-listing | About |
| `12colcontainer{guid}_N_CTAStyle` | `style` | council-landing, council-committee, board-project-detail, board-resources, section-landing, section-subpage, section-project-detail, news-detail |  |
| `PaginationRepeater_BtnPage_0` | `a` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing | 1 |
| `PaginationRepeater_BtnPage_1` | `a` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing | 2 |
| `PaginationRepeater_BtnPage_2` | `a` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing | 3 |
| `BtnNext` | `a` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing |  |
| `NewsListingPanel` | `div` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | All Items
                               |
| `BtnAllTagsDesktop` | `a` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | All Items |
| `DesktopTags_BtnDesktopTag_0` | `a` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | Document for Comment |
| `DesktopTags_BtnDesktopTag_1` | `a` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | International Activity |
| `ItemsPerPageLabel` | `label` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | Items per page: |
| `sortByLabel` | `label` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing | Sort by |
| `ChosenTag` | `input` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |  |
| `12colcontainer{guid}_N_titleCta` | `h3` | council-landing, council-committee, board-project-detail, section-landing, section-subpage, section-project-detail | Canadian Standard Setting Changes Ahead  |
| `DesktopTags_BtnDesktopTag_2` | `a` | homepage, council-news-listing, board-resources, section-resources-listing, news-listing | Meeting Summary |
| `DesktopTags_BtnDesktopTag_3` | `a` | homepage, council-news-listing, board-resources, section-resources-listing, news-listing | News |
| `DesktopTags_BtnDesktopTag_4` | `a` | homepage, council-news-listing, board-resources, section-resources-listing, news-listing | Resource |
| `4colcontainermain{guid}5_N_ContactsRepeater_RoleDe` | `span` | board-project-detail, section-document-detail, section-project-detail, section-resource-detail, news-detail | Associate Director, Accounting Standards |
| `4colcontainermain{guid}5_N_ContactsRepeater_PhoneD` | `div` | board-project-detail, section-document-detail, section-project-detail, section-resource-detail, news-detail | +1 416 204 3951 |
| `4colcontainermain{guid}5_N_ContactsRepeater_EmailD` | `div` | board-project-detail, section-document-detail, section-project-detail, section-resource-detail, news-detail | DMacleod@acsbcanada.ca |
| `PaginationRepeater_BtnPage_4` | `a` | homepage, board-meetings-listing, council-news-listing, news-listing | 101 |
| `PaginationRepeater_BtnPage_5` | `a` | homepage, board-meetings-listing, council-news-listing, news-listing | 102 |
| `6colcontainer{guid}_N_CTAStyle` | `style` | board-landing, council-landing, about, section-landing |  |
| `6colcontainer{guid}_N_titleCta` | `h3` | board-landing, council-landing, about, section-landing | Attention Management and Auditors: Revis |
| `6colcontainer{guid}2_N_CTAStyle` | `style` | board-landing, council-landing, about, section-landing |  |
| `6colcontainer{guid}2_N_titleCta` | `h3` | board-landing, council-landing, about, section-landing | Virtual Roundtable – Canadian Input on t |
| `newsDate` | `span` | council-news-detail, about, section-resource-detail, news-detail | March 31, 2024 |
| `newsType` | `span` | council-news-detail, about, section-resource-detail, news-detail | News |
| `4colcontainermain{guid}_N_CTAStyle` | `style` | homepage, board-landing, section-landing |  |
| `4colcontainermain{guid}2_N_CTAStyle` | `style` | homepage, board-landing, section-landing |  |
| `4colcontainermain{guid}3_N_CTAStyle` | `style` | homepage, board-landing, section-landing |  |
| `8colcontainer{guid}_N_CTAStyle` | `style` | board-landing, council-landing, about |  |
| `12colcontainer{guid}_N_pnlContactForm` | `div` | board-subpage, council-subpage, contact | Contact Us
    
    Have a question or c |
| `12colcontainer{guid}_N_lTitle` | `span` | board-subpage, council-subpage, contact | Contact Us |
| `12colcontainer{guid}_N_lDescription` | `span` | board-subpage, council-subpage, contact | Have a question or comment? Write to us! |
| `12colcontainer{guid}_N_FormSubmissionValuesTxt` | `input` | board-subpage, council-subpage, contact |  |
| `12colcontainer{guid}_N_pnlPackage` | `div` | board-subpage, council-subpage, contact | Full Name: *Title:Organization:Email add |
| `12colcontainer{guid}_N_lblBottomText` | `span` | board-subpage, council-subpage, contact |  |
| `8colcontainer{guid}_N_PlRichText` | `div` | about, section-resource-detail, news-detail | Context
The standard-setting environment |
| `8colcontainer{guid}_N_titleCta` | `h3` | board-landing, council-landing | About the AASB |
| `4colcontainermain{guid}5_N_CTAStyle` | `style` | board-landing, council-landing |  |
| `4colcontainermain{guid}5_N_titleCta` | `h3` | board-landing, council-landing | Contact the AASB |
| `meetingsLink` | `a` | board-landing, council-landing | See all meetings & events summaries |
| `allNewsLink` | `a` | board-landing, council-landing | See all news |
| `4colcontainermain{guid}_N_titleCta` | `h3` | board-landing, section-landing | IFRS® Accounting Standards Discussion Gr |
| `4colcontainermain{guid}2_N_titleCta` | `h3` | board-landing, section-landing | Stay Up to Date on the Progress of Stand |
| `4colcontainermain{guid}3_N_titleCta` | `h3` | board-landing, section-landing | Follow Us on Social Media: |
| `8col{guid}_N_VotingHeading` | `div` | board-member-profile, council-members-listing | Voting Members |
| `MeetingsListingPanel` | `div` | board-meetings-listing, council-meetings-listing | Upcoming meetings & events
              |
| `Tab1Mobile` | `span` | board-meetings-listing, council-meetings-listing | Upcoming meetings & events |
| `Tab2mobile` | `span` | board-meetings-listing, council-meetings-listing | Past meetings & events |
| `PlMeetingDescription` | `div` | board-meeting-detail, council-meeting-detail | This summary of decisions of the Auditin |
| `4colcontainermain{guid}5_N_PlRichText` | `div` | about, section-resource-detail | Related News:
December 19, 2023: Canadia |
| `sectionTitle2` | `h2` | board-project-detail, section-project-detail | News |
| `DisclaimerWrapper` | `div` | board-project-detail, section-project-detail | Disclaimer
                      This pr |
| `filtersLabel` | `label` | board-resources, section-resources-listing | Filters |
| `4colcontainermain{guid}_N_PlRichText` | `div` | council-subpage | Yearly Activities |
| `4colcontainermain{guid}2_N_PlRichText` | `div` | council-subpage |  |
| `8col{guid}_N_8colcontainer{guid}_N_PlRichText` | `div` | council-committee | The Governance Committee oversees the Re |
| `8col{guid}_N_4colcontainermain{guid}5_N_ContactsRe` | `span` | council-committee | Secretary, Oversight Council |
| `8col{guid}_N_4colcontainermain{guid}5_N_ContactsRe` | `div` | council-committee | +1 905 808 8807 |
| `8col{guid}_N_4colcontainermain{guid}5_N_ContactsRe` | `div` | council-committee | jhinchliffe@frascanada.ca |
| `PaginationRepeater_BtnPage_3` | `a` | council-meetings-listing | 4 |
| `phrichtext_N_PlRichText` | `div` | council-volunteer | If you are unable to login using your ex |
| `ControlOutside1_ValidationSummary1` | `div` | council-volunteer |  |
| `ControlOutside1_litLoginLabel` | `span` | council-volunteer |  |
| `ControlOutside1_UserNameLabel` | `label` | council-volunteer | User Name (email address) |
| `ControlOutside1_UserNameRequired` | `span` | council-volunteer | * |
| `ControlOutside1_hlinkForgotUName` | `a` | council-volunteer | Forgot your User Name? |
| `ControlOutside1_PasswordLabel` | `label` | council-volunteer | Password |
| `ControlOutside1_PasswordRequired` | `span` | council-volunteer | * |
| `ControlOutside1_hlinkForgotUID` | `a` | council-volunteer | Forgot your Password? |
| `ControlOutside1_cmdLogin` | `a` | council-volunteer | Log in |
| `ControlOutside1_lbllogInRegistered` | `span` | council-volunteer | Not registered yet? |
| `ControlOutside1_hLinkCreateNewprofile` | `a` | council-volunteer | Create My account |
| `phrichtextbottom_N_PlRichText` | `div` | council-volunteer | Update your language preference
To recei |
| `8col{guid}_N_12colcontainer{guid}_N_PlRichText` | `div` | board-resources | #detail-content-intro {margin-bottom:0;} |
| `4colcontainermain{guid}_N_ContactsRepeater_RoleDet` | `span` | board-resources | Principal, Accounting Standards Board an |
| `4colcontainermain{guid}_N_ContactsRepeater_PhoneDe` | `div` | board-resources | +1 604 449 2439 |
| `4colcontainermain{guid}_N_ContactsRepeater_EmailDe` | `div` | board-resources | alevine@acsbcanada.ca |
| `Tab1Tab` | `li` | section-documents-listing | Open for Comment |
| `Tab2Tab` | `li` | section-documents-listing | Closed for Comment |
| `Tab1MessageRow` | `tr` | section-documents-listing | No documents found |
| `Tab1NoDocumentsFoundMessage` | `td` | section-documents-listing | No documents found |
| `SectionTitle` | `h2` | section-document-detail | Support Materials |
| `4colcontainermain{guid}5_N_ContactsRepeater_RoleDe` | `span` | news-detail | Principal, Auditing and Assurance Standa |
| `4colcontainermain{guid}5_N_ContactsRepeater_PhoneD` | `div` | news-detail | +1 416 204 3443 |
| `4colcontainermain{guid}5_N_ContactsRepeater_EmailD` | `div` | news-detail | cng@aasbcanada.ca |
| `designationTxt` | `p` | council-member-profile | GCB.D, CCB.D |
| `memberImage` | `img` | council-member-profile |  |
| `frasPosition` | `span` | council-member-profile |  |
| `appointedDateRow` | `tr` | council-member-profile | Appointed:
	April 1, 2025 |
| `appointedDate` | `span` | council-member-profile | April 1, 2025 |
| `termExpiresRow` | `tr` | council-member-profile | Term Expires:
	March 31, 2028 |
| `termExpires` | `span` | council-member-profile | March 31, 2028 |
| `localtionRow` | `tr` | council-member-profile | Location:
	Toronto |
| `location` | `span` | council-member-profile | Toronto |

## Content CSS Classes

Meaningful classes inside content zones (Bootstrap/OneTrust/nav noise filtered).

| Class | Page Types |
|-------|------------|
| `.second-navigation-content` | board-landing, board-about, board-member-profile, board-subpage, board-meetings-listing, board-meeting-detail, council-landing, council-subpage, council-about, council-committee, council-meetings-listing, council-news-listing, council-news-detail, council-volunteer, about, council-meeting-detail, board-projects-listing, board-project-detail, board-resources, section-landing, section-documents-listing, section-document-detail, section-subpage, section-projects-listing, section-project-detail, section-resources-listing, section-resource-detail, contact, static-page, news-listing, news-detail, council-members-listing, council-member-profile |
| `.rte-wrapper` | homepage, board-landing, board-about, board-member-profile, board-subpage, board-meetings-listing, board-meeting-detail, council-landing, council-subpage, council-about, council-committee, council-meetings-listing, council-news-listing, council-news-detail, council-volunteer, about, council-meeting-detail, board-project-detail, board-resources, section-landing, section-document-detail, section-subpage, section-projects-listing, section-project-detail, section-resources-listing, section-resource-detail, contact, static-page, news-detail, council-members-listing |
| `.purple-info-container` | homepage, board-landing, board-subpage, board-meetings-listing, council-landing, council-subpage, council-committee, council-meetings-listing, council-news-listing, council-volunteer, about, board-project-detail, board-resources, section-landing, section-document-detail, section-subpage, section-projects-listing, section-project-detail, section-resources-listing, section-resource-detail, contact, static-page, news-detail |
| `.Default-Button` | homepage, board-landing, council-landing, council-committee, about, board-projects-listing, board-project-detail, section-landing, section-subpage, section-projects-listing, section-project-detail, news-detail |
| `.purple-btn` | homepage, board-landing, council-landing, council-committee, about, board-projects-listing, board-project-detail, section-landing, section-subpage, section-projects-listing, section-project-detail, news-detail |
| `.cta-button-1` | homepage, board-landing, council-landing, council-committee, about, board-projects-listing, board-project-detail, section-landing, section-subpage, section-projects-listing, section-project-detail, news-detail |
| `.purple-info-content` | homepage, board-landing, council-landing, council-committee, about, board-project-detail, board-resources, section-landing, section-subpage, section-project-detail, news-detail |
| `.flex-row` | homepage, board-landing, council-landing, council-committee, about, board-project-detail, board-resources, section-landing, section-subpage, section-project-detail, news-detail |
| `.btn-container` | homepage, board-landing, council-landing, council-committee, about, board-project-detail, board-resources, section-landing, section-subpage, section-project-detail, news-detail |
| `.content-icon` | homepage, board-landing, council-landing, council-news-listing, board-project-detail, board-resources, section-landing, section-project-detail, section-resources-listing, news-listing |
| `.t-last-br` | council-landing, council-subpage, council-meetings-listing, council-news-listing, council-meeting-detail, board-project-detail, section-subpage, section-project-detail, section-resources-listing |
| `.select-item` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.select` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.form-group` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.select-hidden` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.select-styled` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.select-options` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.standards-plain-language-content` | homepage, council-news-listing, council-volunteer, board-project-detail, board-resources, section-project-detail, section-resources-listing, news-listing |
| `.sideNavigation-container` | board-about, board-member-profile, board-subpage, council-about, council-committee, about, board-resources, council-members-listing |
| `.sidebar-menu` | board-about, board-member-profile, board-subpage, council-about, council-committee, about, board-resources, council-members-listing |
| `.content-item` | homepage, council-news-listing, board-project-detail, board-resources, section-project-detail, section-resources-listing, news-listing |
| `.content-item-title` | homepage, council-news-listing, board-project-detail, board-resources, section-project-detail, section-resources-listing, news-listing |
| `.pagination` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing |
| `.next` | homepage, board-meetings-listing, council-meetings-listing, council-news-listing, board-resources, section-resources-listing, news-listing |
| `.date` | board-landing, council-landing, council-news-detail, about, section-landing, section-resource-detail, news-detail |
| `.tab_container` | board-meetings-listing, council-meetings-listing, board-projects-listing, board-project-detail, section-documents-listing, section-projects-listing, section-project-detail |
| `.meetings-container` | board-meetings-listing, council-meetings-listing, board-projects-listing, board-project-detail, section-documents-listing, section-projects-listing, section-project-detail |
| `.standard-project-intro` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.standard-project-content` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.right-side` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.staffname` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.organization` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.contact-container` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.phone-content` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.mail-content` | council-committee, board-project-detail, board-resources, section-document-detail, section-project-detail, section-resource-detail, news-detail |
| `.filter-element` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.dates` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.external-icon` | homepage, council-news-listing, board-project-detail, section-project-detail, section-resources-listing, news-listing |
| `.filter-container` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.custom-datepicker` | homepage, council-news-listing, council-volunteer, board-resources, section-resources-listing, news-listing |
| `.mobile-data` | board-landing, board-projects-listing, section-landing, section-documents-listing, section-subpage, section-projects-listing |
| `.responsive-table` | board-landing, board-projects-listing, section-landing, section-documents-listing, section-subpage, section-projects-listing |
| `.title` | board-landing, board-member-profile, council-landing, section-landing, council-members-listing |
| `.tab_drawer_heading` | board-meetings-listing, council-meetings-listing, board-projects-listing, section-documents-listing, section-projects-listing |
| `.tabs` | board-meetings-listing, council-meetings-listing, board-projects-listing, section-documents-listing, section-projects-listing |
| `.d_active` | board-meetings-listing, council-meetings-listing, board-projects-listing, section-documents-listing, section-projects-listing |
| `.tab_content` | board-meetings-listing, council-meetings-listing, board-projects-listing, section-documents-listing, section-projects-listing |
| `.detail-content` | council-news-detail, about, section-document-detail, section-resource-detail, news-detail |
| `.Secondary-Button` | board-landing, council-landing, board-projects-listing, section-projects-listing |
| `.new-meetings-news-item` | board-meetings-listing, council-meetings-listing, board-project-detail, section-project-detail |

## Per-Page Inspection Details

### homepage: https://www.frascanada.ca/en

- **H1:** Top Stories
- **Section Title:** N/A
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 6
- **Headings:** 15
- **Sitecore IDs:** 22
- **Content Classes:** 25
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/homepage/_en.png

**Heading Hierarchy:**

- H1: Top Stories
  - H2: Virtual Roundtable: Help Shape Canada’s Input on the IAASB’s ISA 540 Review
  - H2: What We Heard at the Canadian Technology Quality Management Roundtable
  - H2: ROMRS Post‑implementation Review: What You Need to Know
  - H2: News Listings
  - H2: AcSB Exposure Draft – Amendments to the Fair Value Option for Investments in Associates and Joint Ventures
  - H2: AcSB endorses amendments to several illustrative examples to clarify disclosure requirements for uncertainties
  - H2: IFRS® Accounting Standards Discussion Group – Request for Issues
  - H2: AcSB endorses Translation to a Hyperinflationary Presentation Currency (Amendments to IAS 21)
  - H2: What We Heard and Next Steps for the Canadian Amendments Related to Indigenous Matters in the Canadian Standard on Susta
  - H2: Retractable or Mandatorily Redeemable Shares Issued in a Tax Planning Arrangement (ROMRS) Post-implementation Review – W
  - H2: What We Heard at the Canadian Technology Quality Management Roundtable
  - H2: AcSB Decision Summary – January 22, 2026
  - H2: AASB Decision Summary – January 19, 2026
  - H2: AcSB and CSSB Meet Japanese Counterparts to Advance Global Accounting and Sustainability Standards

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12
- `purple-info-container` → rte-wrapper
- `purple-info-container` → row
- `purple-info-container` → rte-wrapper
- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input

### board-landing: https://www.frascanada.ca/en/aasb

- **H1:** Auditing and Assurance Standards Board
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 5
- **Headings:** 8
- **Sitecore IDs:** 15
- **Content Classes:** 22
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-landing/_en_aasb.png

**Heading Hierarchy:**

- H1: Auditing and Assurance Standards Board
    - H3: About the AASB
    - H3: Contact the AASB
    - H3: Attention Management and Auditors: Revised CAS 570, Going Concern Brings Changes to the Auditor’s Expectation for Manage
    - H3: Virtual Roundtable – Canadian Input on the International Auditing and Assurance Standards Board’s (IAASB) Post-implement
  - H2: Meeting & event summaries
  - H2: Upcoming meetings & events
  - H2: News

**Content Blocks:**

- `purple-info-container` → row
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content

### board-landing: https://www.frascanada.ca/en/acsb

- **H1:** Accounting Standards Board
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 5
- **Headings:** 8
- **Sitecore IDs:** 16
- **Content Classes:** 23
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-landing/_en_acsb.png

**Heading Hierarchy:**

- H1: Accounting Standards Board
    - H3: About the AcSB
    - H3: Contact the AcSB
    - H3: IFRS® Accounting Standards Discussion Group Meeting – December 9, 2025
    - H3: Stay Up to Date on the Progress of Standard-setting Initiatives
    - H3: Follow Us on Social Media:
  - H2: Meeting & event summaries
  - H2: News

**Content Blocks:**

- `purple-info-container` → row
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content
- `purple-info-container` → rte-wrapper

### board-landing: https://www.frascanada.ca/en/aspe

- **H1:** Overview
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 5
- **Sitecore IDs:** 6
- **Content Classes:** 25
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-landing/_en_aspe.png

**Heading Hierarchy:**

- H1: Overview
  - H2: Active Projects
    - H3: Submit an Issue
    - H3: CPA Canada Handbook
  - H2: News

**Content Blocks:**

- `section` → col-sm-12
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content

### board-about: https://www.frascanada.ca/en/aasb/about

- **H1:** About
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 5
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-about/_en_aasb_about.png

**Heading Hierarchy:**

- H1: About
  - H2: Our Community
  - H2: Membership
  - H2: Meetings
  - H2: Our relationship with CPA Canada

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### board-about: https://www.frascanada.ca/en/acsb/about

- **H1:** About the AcSB
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 6
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-about/_en_acsb_about.png

**Heading Hierarchy:**

- H1: About the AcSB
  - H2: Objectives
  - H2: Our Community
  - H2: Members
  - H2: Meetings
  - H2: Our relationship with CPA Canada

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### board-about: https://www.frascanada.ca/en/cssb/about

- **H1:** About
- **Section Title:** CSSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 7
- **Sitecore IDs:** 4
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-about/_en_cssb_about.png

**Heading Hierarchy:**

- H1: About
  - H2: Our mission
  - H2: Our vision
  - H2: Our community
  - H2: Members
  - H2: Meetings
  - H2: Our relationship with CPA Canada

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### board-member-profile: https://www.frascanada.ca/en/aasb/about/members

- **H1:** Members
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 4
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-member-profile/_en_aasb_about_members.png

**Heading Hierarchy:**

- H1: Members

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### board-member-profile: https://www.frascanada.ca/en/acsb/about/members

- **H1:** Members
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 4
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-member-profile/_en_acsb_about_members.png

**Heading Hierarchy:**

- H1: Members

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### board-member-profile: https://www.frascanada.ca/en/cssb/about/members

- **H1:** Members
- **Section Title:** CSSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 4
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-member-profile/_en_cssb_about_members.png

**Heading Hierarchy:**

- H1: Members

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### board-subpage: https://www.frascanada.ca/en/aasb/committees

- **H1:** Committees
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-subpage/_en_aasb_committees.png

**Heading Hierarchy:**

- H1: Committees

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### board-subpage: https://www.frascanada.ca/en/aasb/contact-us

- **H1:** Contact Us
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 3
- **Sitecore IDs:** 8
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-subpage/_en_aasb_contact-us.png

**Heading Hierarchy:**

- H1: Contact Us
  - H2: Media Inquiries
  - H2: CPA Canada Handbooks – Content Issues

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### board-subpage: https://www.frascanada.ca/en/aasb/initiatives

- **H1:** Initiatives
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 3
- **Sitecore IDs:** 4
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-subpage/_en_aasb_initiatives.png

**Heading Hierarchy:**

- H1: Initiatives
  - H2: Audits of LCEs
  - H2: Technology

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### board-meetings-listing: https://www.frascanada.ca/en/aasb/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 12
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-meetings-listing/_en_aasb_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: AASB Decision Summary – January 19, 2026
  - H2: AASB Decision Summary – December 1-2, 2025
  - H2: AASB Decision Summary – September 9, 2025
  - H2: AASB Decision Summary – June 9-10, 2025
  - H2: AASB Decision Summary – March 10-11, 2025
  - H2: AASB Decision Summary – January 21, 2025
  - H2: AASB Decision Summary – December 2-3, 2024
  - H2: AASB Decision Summary – September 10-11, 2024
  - H2: AASOC Meeting Minutes – June 13, 2024
  - H2: AASB Decision Summary – June 10-11, 2024

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### board-meetings-listing: https://www.frascanada.ca/en/acsb/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 12
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-meetings-listing/_en_acsb_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: AcSB Decision Summary – January 22, 2026
  - H2: AcSB Decision Summary – December 11, 2025
  - H2: IFRS® Accounting Standards Discussion Group Meeting Report – December 9, 2025
  - H2: AcSB Decision Summary – November 12-13, 2025
  - H2: On-demand Webinar – AcSB Consultation Paper, “Detailed Review of Accounting Standards for Private Enterprises”
  - H2: AcSB Decision Summary – October 21, 2025
  - H2: On-demand Webinar – AcSB Consultation Paper, “Detailed Review of Accounting Standards for Private Enterprises”
  - H2: IFRS® Accounting Standards Discussion Group Meeting Report – September 18, 2025
  - H2: AcSB Decision Summary – September 16-17, 2025
  - H2: AcSB Decision Summary – July 15, 2025

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### board-meetings-listing: https://www.frascanada.ca/en/cssb/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** CSSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 10
- **Content Classes:** 24
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-meetings-listing/_en_cssb_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: Watch the Recording: CSSB and UN PRI’s “Sustainability Disclosure in Canada: Overcoming the Headwinds”
  - H2: CSSB Decision Summary – November 19-20, 2025
  - H2: CSSB Decision Summary – October 29, 2025
  - H2: CSSB Decision Summary – August 27, 2025
  - H2: CSSB Decision Summary – June 19, 2025
  - H2: CSSB Decision Summary – May 28-29, 2025
  - H2: CSSB Decision Summary – March 26, 2025
  - H2: CSSB Decision summary – February 19-20, 2025
  - H2: On-Demand Webinar – Understanding the CSSB’s Proposed 2025-2028 Strategic Plan
  - H2: CSSB Decision summary – January 15, 22-23, 2025

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### board-meeting-detail: https://www.frascanada.ca/en/aasb/meetings-and-events/apr-5-2023

- **H1:** AASB Decision Summary – April 5, 2023
- **Section Title:** AASB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 8
- **Sitecore IDs:** 2
- **Content Classes:** 2
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-meeting-detail/_en_aasb_meetings-and-events_apr-5-2023.png

**Heading Hierarchy:**

- H1: AASB Decision Summary – April 5, 2023
  - H2: Canadian Auditing Standards
    - H3: Audit Evidence
    - H3: Going Concern
  - H2: Other Canadian Standards
    - H3: Audits of Less Complex Entities (LCEs)
  - H2: Other
    - H3: IAASB Strategy

**Content Blocks:**

- `maincontent_4_PlMeetingDescription` → col-sm-12 col-xs-12

### board-meeting-detail: https://www.frascanada.ca/en/acsb/meetings-and-events/2022-02-23

- **H1:** AcSB Decision Summary – February 23, 2022
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 15
- **Sitecore IDs:** 2
- **Content Classes:** 2
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-meeting-detail/_en_acsb_meetings-and-events_2022-02-23.png

**Heading Hierarchy:**

- H1: AcSB Decision Summary – February 23, 2022
  - H2: IFRS® Standards
    - H3: Non-current Liabilities with Covenants
  - H2: Standards for Private Enterprises
    - H3: Related Party Combinations
  - H2: Standards for Private Enterprises and Not-for-Profit Organizations
    - H3: Cloud Computing Arrangements
  - H2: Standards for Pension Plans
  - H2: Relevance of Financial Reporting
    - H3: Independent Standard-setting Review
  - H2: Due Process
    - H3: AcSB’s Advisory Committees
      - H4: Not-for-Profit Advisory Committee
      - H4: Private Enterprise Advisory Committee
    - H3: Strategic Plan

**Content Blocks:**

- `maincontent_4_PlMeetingDescription` → col-sm-12 col-xs-12

### council-landing: https://www.frascanada.ca/en/aasoc

- **H1:** Auditing and Assurance Standards Oversight Council
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 5
- **Headings:** 6
- **Sitecore IDs:** 12
- **Content Classes:** 22
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-landing/_en_aasoc.png

**Heading Hierarchy:**

- H1: Auditing and Assurance Standards Oversight Council
    - H3: About AASOC
    - H3: Contact AASOC
    - H3: Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
  - H2: Meeting & event summaries
  - H2: News

**Content Blocks:**

- `purple-info-container` → row
- `purple-info-container` → purple-info-content
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content
- `purple-info-container` → rte-wrapper

### council-landing: https://www.frascanada.ca/en/acsoc

- **H1:** Accounting Standards Oversight Council
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 5
- **Headings:** 7
- **Sitecore IDs:** 14
- **Content Classes:** 23
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-landing/_en_acsoc.png

**Heading Hierarchy:**

- H1: Accounting Standards Oversight Council
    - H3: About AcSOC
    - H3: Contact AcSOC
    - H3: Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
    - H3: Shape AcSOC's Agenda
  - H2: Meeting & event summaries
  - H2: News

**Content Blocks:**

- `purple-info-container` → row
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content
- `purple-info-container` → rte-wrapper

### council-landing: https://www.frascanada.ca/en/rasoc

- **H1:** The Oversight Council
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 5
- **Headings:** 6
- **Sitecore IDs:** 13
- **Content Classes:** 23
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-landing/_en_rasoc.png

**Heading Hierarchy:**

- H1: The Oversight Council
    - H3: Contact the Oversight Council
    - H3: Stay Up to Date on the Progress of Standard-setting Initiatives
    - H3: Follow Us on Social Media:
  - H2: Meeting & event summaries
  - H2: News

**Content Blocks:**

- `purple-info-container` → row
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content
- `new-meetings-news-container` → meetings-news-content
- `purple-info-container` → rte-wrapper

### council-subpage: https://www.frascanada.ca/en/aasoc/aasoc-activities

- **H1:** AASOC Activities
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 2
- **Sitecore IDs:** 5
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-subpage/_en_aasoc_aasoc-activities.png

**Heading Hierarchy:**

- H1: AASOC Activities
  - H2: Yearly Activities

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12
- `purple-info-container` → row

### council-subpage: https://www.frascanada.ca/en/aasoc/contact-us

- **H1:** Contact Us
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 2
- **Sitecore IDs:** 9
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-subpage/_en_aasoc_contact-us.png

**Heading Hierarchy:**

- H1: Contact Us
  - H2: Media Inquiries

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12
- `purple-info-container` → rte-wrapper

### council-subpage: https://www.frascanada.ca/en/acsoc/contact-us

- **H1:** Contact Us
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 1
- **Headings:** 2
- **Sitecore IDs:** 8
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-subpage/_en_acsoc_contact-us.png

**Heading Hierarchy:**

- H1: Contact Us
  - H2: Media Inquiries

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### council-about: https://www.frascanada.ca/en/aasoc/about

- **H1:** About
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 4
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-about/_en_aasoc_about.png

**Heading Hierarchy:**

- H1: About
  - H2: Membership
  - H2: Meetings
  - H2: Our relationship with CPA Canada

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### council-about: https://www.frascanada.ca/en/acsoc/about

- **H1:** About AcSOC
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 1
- **Headings:** 5
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-about/_en_acsoc_about.png

**Heading Hierarchy:**

- H1: About AcSOC
  - H2: Responsibilities
  - H2: Members
  - H2: Meetings
  - H2: Our relationship with CPA Canada

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### council-about: https://www.frascanada.ca/en/rasoc/about

- **H1:** About the Reporting & Assurance Standards Oversight Council
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 7
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-about/_en_rasoc_about.png

**Heading Hierarchy:**

- H1: About the Reporting & Assurance Standards Oversight Council
  - H2: Key Roles of the Oversight Council
  - H2: Responsibilities of the Oversight Council
  - H2: Oversight Council Members
  - H2: Transitional Measures
  - H2: Meetings
  - H2: Relationship with CPA Canada

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### council-committee: https://www.frascanada.ca/en/aasoc/committees

- **H1:** Committees
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 3
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-committee/_en_aasoc_committees.png

**Heading Hierarchy:**

- H1: Committees

**Content Blocks:**

- `row` → rte-wrapper, sidebar-menu hidden-xs

### council-committee: https://www.frascanada.ca/en/rasoc/committes

- **H1:** Committees
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 4
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-committee/_en_rasoc_committes.png

**Heading Hierarchy:**

- H1: Committees

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### council-committee: https://www.frascanada.ca/en/rasoc/committes/governance

- **H1:** Governance Committee
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 4
- **Sitecore IDs:** 10
- **Content Classes:** 19
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-committee/_en_rasoc_committes_governance.png

**Heading Hierarchy:**

- H1: Governance Committee
  - H2: Staff Contact(s)
  - H2: Members
    - H3: Terms of Reference

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs
- `purple-info-container` → purple-info-content

### council-meetings-listing: https://www.frascanada.ca/en/aasoc/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 10
- **Content Classes:** 24
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meetings-listing/_en_aasoc_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: AASOC Meeting Minutes – June 13, 2024
  - H2: AASOC Meeting Minutes – April 9, 2024
  - H2: AASOC Meeting Minutes – December 20, 2023
  - H2: AASOC Meeting Minutes – September 28, 2023
  - H2: AASOC Meeting Minutes – July 6, 2023
  - H2: AASOC Meeting Minutes – April 3, 2023
  - H2: AASOC Meeting Minutes – September 26, 2022
  - H2: AASOC Meeting Minutes - June 27-28, 2022
  - H2: AASOC Meeting Minutes – December 16-17, 2021

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### council-meetings-listing: https://www.frascanada.ca/en/acsoc/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 9
- **Content Classes:** 25
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meetings-listing/_en_acsoc_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: AcSOC Meeting Minutes – June 1, 2023
  - H2: AcSOC Meeting Minutes – February 23, 2023
  - H2: AcSOC Meeting Minutes – June 2-3, 2022
  - H2: AcSOC Meeting Minutes – February 17-18, 2022
  - H2: AcSOC Meeting Minutes – October 7-8, 2021
  - H2: AcSOC Public Meeting Report – April 14, 2021
  - H2: AcSOC Public Meeting Report – February 11-12, 2021
  - H2: AcSOC Public Meeting Report – October 29-30, 2020
  - H2: AcSOC Public Meeting Report – June 11, 2020

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### council-meetings-listing: https://www.frascanada.ca/en/rasoc/meetings-and-events

- **H1:** Meetings and Events
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 11
- **Content Classes:** 24
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meetings-listing/_en_rasoc_meetings-and-events.png

**Heading Hierarchy:**

- H1: Meetings and Events
  - H2: RASOC Meeting – February 4, 2026
  - H2: RASOC Meeting – November 5, 2025
  - H2: Reporting and Assurance Standards Oversight Council Meeting Minutes – June 18, 2025
  - H2: Oversight Council Meeting Minutes – February 4, 2025
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: AASOC Meeting Minutes – June 13, 2024
  - H2: AcSOC Meeting Minutes – June 4, 2024
  - H2: AASOC Meeting Minutes – April 9, 2024
  - H2: AcSOC Meeting Minutes – February 27, 2024
  - H2: AASOC Meeting Minutes – December 20, 2023

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_MeetingsListingPanel` → a, a, section
- `purple-info-container` → rte-wrapper

### council-news-listing: https://www.frascanada.ca/en/aasoc/news-listings

- **H1:** News Listings
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 19
- **Content Classes:** 20
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-listing/_en_aasoc_news-listings.png

**Heading Hierarchy:**

- H1: News Listings
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: AASOC Meeting Minutes – June 13, 2024
  - H2: AASOC Meeting Minutes – April 9, 2024
  - H2: Canada’s Reporting and Assurance Oversight Councils Announce Transition to Single Oversight Council for Streamlined Stan
  - H2: Appointments, Reappointments and Retirements – AASOC
  - H2: Appointments, Reappointments, and Retirements – AASOC
  - H2: AASOC Meeting Minutes – December 20, 2023
  - H2: Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
  - H2: AASOC Meeting Minutes – September 28, 2023
  - H2: Top 5 FAQs – Independent Review Committee on Standard Setting in Canada Final Report Recommendations

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### council-news-listing: https://www.frascanada.ca/en/acsoc/news-listings

- **H1:** News Listings
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 19
- **Content Classes:** 21
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-listing/_en_acsoc_news-listings.png

**Heading Hierarchy:**

- H1: News Listings
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: Canada’s Reporting and Assurance Oversight Councils Announce Transition to Single Oversight Council for Streamlined Stan
  - H2: Appointments, Reappointments, and Retirements – AcSOC
  - H2: Appointments, Reappointments, and Retirements – AcSOC
  - H2: Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
  - H2: Top 5 FAQs – Independent Review Committee on Standard Setting in Canada Final Report Recommendations
  - H2: “Standard setting is a key public interest activity” – A message from our Oversight Council Chairs
  - H2: AcSOC Annual Report 2022-2023 – Grounded in a Sustainable Future
  - H2: AcSOC Meeting Minutes – June 1, 2023
  - H2: Media Release – Independent review concludes, setting the stage for the future of Canadian accounting, auditing, and sus

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### council-news-listing: https://www.frascanada.ca/en/rasoc/news-listings

- **H1:** News Listings
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 19
- **Content Classes:** 19
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-listing/_en_rasoc_news-listings.png

**Heading Hierarchy:**

- H1: News Listings
  - H2: Media Release – Andrew Newman Named Chair of the Public Sector Accounting Board
  - H2: Explore the 2024–2025 Annual Reports from the Reporting and Assurance Standards Oversight Council  and the Standard-sett
  - H2: Call for Applications: Chair, Public Sector Accounting Board
  - H2: Reporting and Assurance Standards Oversight Council Meeting Minutes – June 18, 2025
  - H2: Media Release – Wendy Berman Named as the Canadian Sustainability Standards Board Permanent Chair
  - H2: Appointments, Reappointments, and Retirements – RASOC
  - H2: Oversight Council Meeting Minutes – February 4, 2025
  - H2: Oversight Council Meeting Minutes – October 29, 2024
  - H2: Leadership Transition at the Canadian Sustainability Standards Board (CSSB)
  - H2: Volunteer Opportunity – Reporting and Assurance Standards Oversight Council

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### council-news-detail: https://www.frascanada.ca/en/aasoc/news-listings/appointments-reappointments-retirements-aasoc

- **H1:** Appointments, Reappointments, and Retirements – AASOC
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 2
- **Sitecore IDs:** 3
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-detail/_en_aasoc_news-listings_appointments-reappointments-retirements-aasoc.png

**Heading Hierarchy:**

- H1: Appointments, Reappointments, and Retirements – AASOC
  - H2: AASB Appointments

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `detail-content-container` → detail-content rte-wrapper

### council-news-detail: https://www.frascanada.ca/en/acsoc/news-listings/2023-acsoc-appointments

- **H1:** Appointments, Reappointments, and Retirements – AcSOC
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 2
- **Headings:** 3
- **Sitecore IDs:** 3
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-detail/_en_acsoc_news-listings_2023-acsoc-appointments.png

**Heading Hierarchy:**

- H1: Appointments, Reappointments, and Retirements – AcSOC
  - H2: AcSB appointments and retirements
  - H2: PSAB appointments and retirements

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `detail-content-container` → detail-content rte-wrapper

### council-news-detail: https://www.frascanada.ca/en/rasoc/news-listings/2023-acsoc-appointments

- **H1:** Appointments, Reappointments, and Retirements – AcSOC
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 3
- **Sitecore IDs:** 3
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-news-detail/_en_rasoc_news-listings_2023-acsoc-appointments.png

**Heading Hierarchy:**

- H1: Appointments, Reappointments, and Retirements – AcSOC
  - H2: AcSB appointments and retirements
  - H2: PSAB appointments and retirements

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `detail-content-container` → detail-content rte-wrapper

### council-volunteer: https://www.frascanada.ca/en/aasoc/volunteer-opportunities

- **H1:** Volunteer Opportunities
- **Section Title:** AASOC
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 3
- **Content Classes:** 3
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-volunteer/_en_aasoc_volunteer-opportunities.png

**Heading Hierarchy:**

- H1: Volunteer Opportunities

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### council-volunteer: https://www.frascanada.ca/en/rasoc/volunteer-opportunities

- **H1:** Volunteer Opportunities
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 2
- **Sitecore IDs:** 9
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-volunteer/_en_rasoc_volunteer-opportunities.png

**Heading Hierarchy:**

- H1: Volunteer Opportunities
    - H3: No Results Found

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input

### council-volunteer: https://www.frascanada.ca/en/rasoc/volunteer-opportunities/apply-to-volunteer

- **H1:** Log in
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 5
- **Headings:** 1
- **Sitecore IDs:** 15
- **Content Classes:** 10
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-volunteer/_en_rasoc_volunteer-opportunities_apply-to-volunteer.png

**Heading Hierarchy:**

- H1: Log in

**Content Blocks:**

- `form-section-content` → rte-wrapper
- `section form-section` → form-section-content
- `form-section-content` → rte-wrapper
- `purple-info-container` → col-sm-12 col-xs-12
- `purple-info-container` → rte-wrapper

### about: https://www.frascanada.ca/en/about

- **H1:** About
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 6
- **Sitecore IDs:** 8
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/about/_en_about.png

**Heading Hierarchy:**

- H1: About
  - H2: About Canada’s Standard-setting Boards and Oversight Council
  - H2: Our Relationship with CPA Canada
  - H2: The CPA Canada Handbook
    - H3: Stay Up to Date on the Progress of Standard-setting Initiatives
    - H3: Follow Us on Social Media:

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs
- `purple-info-container` → row

### about: https://www.frascanada.ca/en/about/ircss-final-recommendations

- **H1:** Independent Review Committee on Standard Setting issues Final Recommendations
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 5
- **Sitecore IDs:** 5
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/about/_en_about_ircss-final-recommendations.png

**Heading Hierarchy:**

- H1: Independent Review Committee on Standard Setting issues Final Recommendations
  - H2: Context
  - H2: Early recommendation issued to establish sustainability standards board
  - H2: Final recommendations delivered in March 2023
  - H2: Recommendations approved and next steps

**Content Blocks:**

- `purple-info-container` → rte-wrapper white-text
- `purple-info-container` → row

### about: https://www.frascanada.ca/en/about/ircss-final-recommendations/top-faqs

- **H1:** Top 5 FAQs: IRCSS Final Report Recommendations
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 8
- **Sitecore IDs:** 3
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/about/_en_about_ircss-final-recommendations_top-faqs.png

**Heading Hierarchy:**

- H1: Top 5 FAQs: IRCSS Final Report Recommendations
  - H2: 1. Why establish Standardsco?
  - H2: 2. Does Standardsco change the relationship between standard setters and CPA Canada should these recommendations be appr
    - H3: Standards as a public good
  - H2: 3. What’s going on with the Canadian Sustainability Standards Board?
    - H3: Assurance
  - H2: 4. How will oversight work with the new CSSB and Standardsco?
  - H2: 5. What happens next?

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `detail-content-container` → detail-content rte-wrapper

### council-meeting-detail: https://www.frascanada.ca/en/acsoc/meetings-and-events/february-23-2023

- **H1:** AcSOC Meeting Minutes – February 23, 2023
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 1
- **Headings:** 11
- **Sitecore IDs:** 2
- **Content Classes:** 3
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meeting-detail/_en_acsoc_meetings-and-events_february-23-2023.png

**Heading Hierarchy:**

- H1: AcSOC Meeting Minutes – February 23, 2023
  - H2: Call to Order
  - H2: Approval of Meeting Minutes from October 13-14, 2022
  - H2: Chair’s Remarks
  - H2: PRC Report on AcSB and PSAB
    - H3: AcSB Annual Plan
    - H3: PSAB Annual Plan
  - H2: AcSB Chair Report
  - H2: PSAB Chair Report
  - H2: CSSB Update
  - H2: Adjournment

**Content Blocks:**

- `maincontent_4_PlMeetingDescription` → col-sm-12 col-xs-12

### council-meeting-detail: https://www.frascanada.ca/en/rasoc/meetings-and-events/aasoc-june-2024

- **H1:** AASOC Meeting Minutes – June 13, 2024
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 6
- **Sitecore IDs:** 2
- **Content Classes:** 2
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meeting-detail/_en_rasoc_meetings-and-events_aasoc-june-2024.png

**Heading Hierarchy:**

- H1: AASOC Meeting Minutes – June 13, 2024
  - H2: Meeting Minutes
  - H2: Call to Order and Opening Remarks
  - H2: Approval of Minutes
  - H2: AASB Chair’s Report and Update
  - H2: Adjournment

**Content Blocks:**

- `maincontent_4_PlMeetingDescription` → col-sm-12 col-xs-12

### council-meeting-detail: https://www.frascanada.ca/en/acsoc/meetings-and-events/june-1-2023

- **H1:** AcSOC Meeting Minutes – June 1, 2023
- **Section Title:** AcSOC
- **Sub-Nav Tabs:** 0
- **Content Blocks:** 1
- **Headings:** 13
- **Sitecore IDs:** 2
- **Content Classes:** 2
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-meeting-detail/_en_acsoc_meetings-and-events_june-1-2023.png

**Heading Hierarchy:**

- H1: AcSOC Meeting Minutes – June 1, 2023
  - H2: Call to Order
  - H2: Approval of Meeting Minutes from February 23-24, 2023
  - H2: Chair’s Remarks
  - H2: Performance Review Committee Report on the AcSB and PSAB
    - H3: PSAB 2022-2023 Annual Report
    - H3: AcSB 2022-2023 Annual Report
  - H2: PSAB Chair Report
  - H2: AcSB Chair Report
  - H2: CSSB Update
  - H2: Education Sessions
  - H2: Closing Remarks
  - H2: Adjournment

**Content Blocks:**

- `maincontent_4_PlMeetingDescription` → col-sm-12 col-xs-12

### board-projects-listing: https://www.frascanada.ca/en/aspe/projects

- **H1:** Project Listing
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 1
- **Content Classes:** 16
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-projects-listing/_en_aspe_projects.png

**Heading Hierarchy:**

- H1: Project Listing

**Content Blocks:**

- `project-table-container` → div

### board-project-detail: https://www.frascanada.ca/en/aspe/projects/2021-aip

- **H1:** 2021 Annual Improvements
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 7
- **Headings:** 15
- **Sitecore IDs:** 7
- **Content Classes:** 39
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-project-detail/_en_aspe_projects_2021-aip.png

**Heading Hierarchy:**

- H1: 2021 Annual Improvements
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Project Status
  - H2: News
    - H3: Handbook Update – 2021 Annual Improvements
    - H3: AcSB Exposure Draft – 2021 Annual Improvements
  - H2: Meeting & event summaries
    - H3: AcSB Decision Summary – January 20, 2021
    - H3: AcSB Decision Summary – September 9, 2020
    - H3: Private Enterprise Advisory Committee Notes – July 22, 2020
    - H3: AcSB Decision Summary – July 7, 2020
    - H3: AcSB Decision Summary – June 16, 2020
    - H3: Private Enterprise Advisory Committee Notes – February 25, 2020
    - H3: AcSB Decision Summary – September 17-18, 2019

**Content Blocks:**

- `section` → back-to-project
- `purple-info-container` → row
- `project-status-container` → project-status-content
- `purple-info-container` → col-sm-12 col-xs-12
- `section rollups` → div
- `section rollups` → col-sm-12
- `maincontent_12_DisclaimerWrapper` → div

### board-project-detail: https://www.frascanada.ca/en/aspe/projects/acsb-strategic-plan

- **H1:** AcSB Strategic Plan
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 6
- **Headings:** 11
- **Sitecore IDs:** 9
- **Content Classes:** 36
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-project-detail/_en_aspe_projects_acsb-strategic-plan.png

**Heading Hierarchy:**

- H1: AcSB Strategic Plan
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Project Status
    - H3: 2022-2027 AcSB Strategic Plan
  - H2: Meeting & event summaries
    - H3: AcSB Decision Summary – January 22, 2026
    - H3: AcSB Decision Summary – November 12-13, 2025
    - H3: AcSB Decision Summary – September 16-17, 2025
    - H3: AcSB Decision Summary – June 11-12, 2025
    - H3: AcSB Decision Summary – January 23, 2025

**Content Blocks:**

- `section` → back-to-project
- `purple-info-container` → row
- `project-status-container` → project-status-content
- `purple-info-container` → col-sm-12 col-xs-12
- `section rollups` → col-sm-12
- `maincontent_9_DisclaimerWrapper` → div

### board-resources: https://www.frascanada.ca/en/aspe/resources

- **H1:** Resources
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 18
- **Content Classes:** 20
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-resources/_en_aspe_resources.png

**Heading Hierarchy:**

- H1: Resources
  - H2: Retractable or Mandatorily Redeemable Shares Issued in a Tax Planning Arrangement (ROMRS) Post-implementation Review – W
  - H2: In Brief – AcSB’s Exposure Draft, “Relief from Recognition of Acquired Intangible Assets and Amortization of Goodwill”
  - H2: On-demand Webinar – AcSB Consultation Paper, “Detailed Review of Accounting Standards for Private Enterprises”
  - H2: In Brief – AcSB Consultation Paper, “Detailed Review of Accounting Standards for Private Enterprises”
  - H2: Attention Management and Auditors: Revised CAS 570, Going Concern Brings Changes to the Auditor’s Expectation for Manage
  - H2: On-demand Webinar – Domestic Accounting Standards Update (Spring 2025)
  - H2: What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements: Awareness D
  - H2: What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements: Awareness D
  - H2: What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements: Awareness D
  - H2: On-demand – Webinar – Domestic Accounting Standards Update (Spring 2024)

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### board-resources: https://www.frascanada.ca/en/aspe/resources/climate-related-risks-and-opportunities-aspe

- **H1:** What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements: Awareness Document
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 7
- **Sitecore IDs:** 8
- **Content Classes:** 16
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-resources/_en_aspe_resources_climate-related-risks-and-opportunities-aspe.png

**Heading Hierarchy:**

- H1: What You Need to Know about Effects of Climate-related Risks and Opportunities on ASPE Financial Statements: Awareness D
  - H2: What’s the issue?
  - H2: Why it’s relevant
  - H2: ASPE principles for climate-related matters
  - H2: What to expect from this series of awareness documents
  - H2: What’s new for ASPE users and preparers
  - H2: Staff Contact(s)

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs
- `purple-info-container` → row
- `purple-info-container` → purple-info-content

### board-resources: https://www.frascanada.ca/en/aspe/resources/climate-related-risks-and-opportunities-aspe/agricultural-inventories

- **H1:** Agricultural inventories and productive biological assets
- **Section Title:** Accounting Standards for Private Enterprises
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 4
- **Sitecore IDs:** 4
- **Content Classes:** 4
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/board-resources/_en_aspe_resources_climate-related-risks-and-opportunities-aspe_agricultural-inv.png

**Heading Hierarchy:**

- H1: Agricultural inventories and productive biological assets
  - H2: Extracts from relevant Accounting Standards for Private Enterprises (ASPE)
    - H3: Measurement
    - H3: Impairment and write-downs

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### section-landing: https://www.frascanada.ca/en/cass

- **H1:** Overview
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 5
- **Sitecore IDs:** 6
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-landing/_en_cass.png

**Heading Hierarchy:**

- H1: Overview
  - H2: Active Projects
    - H3: CPA Canada Handbook
    - H3: Participate in International Consultations​
  - H2: News

**Content Blocks:**

- `section` → col-sm-12
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content

### section-landing: https://www.frascanada.ca/en/csqc

- **H1:** Overview
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 4
- **Headings:** 4
- **Sitecore IDs:** 5
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-landing/_en_csqc.png

**Heading Hierarchy:**

- H1: Overview
  - H2: Active Projects
    - H3: CPA Canada Handbook
  - H2: News

**Content Blocks:**

- `section` → col-sm-12
- `purple-info-container` → purple-info-content
- `new-meetings-news-container` → meetings-news-content
- `purple-info-container` → rte-wrapper

### section-landing: https://www.frascanada.ca/en/ifrsstandards

- **H1:** Overview
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 6
- **Sitecore IDs:** 8
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-landing/_en_ifrsstandards.png

**Heading Hierarchy:**

- H1: Overview
  - H2: Active Projects
    - H3: Submit an Issue
    - H3: CPA Canada Handbook
    - H3: Participate in International Consultations
  - H2: News

**Content Blocks:**

- `section` → col-sm-12
- `purple-info-container` → row
- `new-meetings-news-container` → meetings-news-content

### section-documents-listing: https://www.frascanada.ca/en/cass/documents

- **H1:** Documents for Comment
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 5
- **Content Classes:** 14
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-documents-listing/_en_cass_documents.png

**Heading Hierarchy:**

- H1: Documents for Comment

**Content Blocks:**

- `document-table-container document-for-comment-container` → div

### section-documents-listing: https://www.frascanada.ca/en/csqc/documents

- **H1:** Documents for Comment
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 5
- **Content Classes:** 14
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-documents-listing/_en_csqc_documents.png

**Heading Hierarchy:**

- H1: Documents for Comment

**Content Blocks:**

- `document-table-container document-for-comment-container` → div

### section-documents-listing: https://www.frascanada.ca/en/ifrsstandards/documents

- **H1:** Documents for Comment
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 3
- **Content Classes:** 14
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-documents-listing/_en_ifrsstandards_documents.png

**Heading Hierarchy:**

- H1: Documents for Comment

**Content Blocks:**

- `document-table-container document-for-comment-container` → div

### section-document-detail: https://www.frascanada.ca/en/cass/documents/aasb-cas-240-fraud

- **H1:** AASB Exposure Draft – Proposed Amendments to Canadian Auditing Standard (CAS) 240, The Auditor's Responsibilities Relating to Fraud in an Audit of Financial Statements
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 5
- **Sitecore IDs:** 5
- **Content Classes:** 26
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-document-detail/_en_cass_documents_aasb-cas-240-fraud.png

**Heading Hierarchy:**

- H1: AASB Exposure Draft – Proposed Amendments to Canadian Auditing Standard (CAS) 240, The Auditor's Responsibilities Relati
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Support Materials
  - H2: Background

**Content Blocks:**

- `purple-info-container` → row
- `document-comment-container` → left-sec-container, right-sec-container
- `detail-content-container` → detail-content rte-wrapper

### section-document-detail: https://www.frascanada.ca/en/csqc/documents/aasb-strategic-plan-consultation

- **H1:** AASB Consultation Paper – 2026-2029 Strategic Plan
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 3
- **Sitecore IDs:** 4
- **Content Classes:** 23
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-document-detail/_en_csqc_documents_aasb-strategic-plan-consultation.png

**Heading Hierarchy:**

- H1: AASB Consultation Paper – 2026-2029 Strategic Plan
  - H2: Summary
  - H2: Staff Contact(s)

**Content Blocks:**

- `purple-info-container` → row
- `document-comment-container` → left-sec-container, right-sec-container
- `detail-content-container` → detail-content rte-wrapper

### section-document-detail: https://www.frascanada.ca/en/ifrsstandards/documents/2021-05-03-ed-disclosure-requirements-ifrs-standards-pilot-approach

- **H1:** AcSB Exposure Draft – Disclosure Requirements in IFRS Standards — A Pilot Approach
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 5
- **Sitecore IDs:** 5
- **Content Classes:** 24
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-document-detail/_en_ifrsstandards_documents_2021-05-03-ed-disclosure-requirements-ifrs-standards.png

**Heading Hierarchy:**

- H1: AcSB Exposure Draft – Disclosure Requirements in IFRS Standards — A Pilot Approach
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Support Materials
  - H2: Background

**Content Blocks:**

- `purple-info-container` → row
- `document-comment-container` → left-sec-container, right-sec-container
- `detail-content-container` → detail-content rte-wrapper

### section-subpage: https://www.frascanada.ca/en/cass/effective-dates

- **H1:** Effective Dates – Canadian Auditing Standards
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 4
- **Headings:** 4
- **Sitecore IDs:** 5
- **Content Classes:** 13
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-subpage/_en_cass_effective-dates.png

**Heading Hierarchy:**

- H1: Effective Dates – Canadian Auditing Standards
    - H3: About Proposed Effective Dates
    - H3: About Final Effective Dates
    - H3: CPA Canada Handbook

**Content Blocks:**

- `purple-info-container` → rte-wrapper
- `purple-info-container` → rte-wrapper
- `section` → responsive-table
- `purple-info-container` → purple-info-content

### section-subpage: https://www.frascanada.ca/en/csqc/effective-dates

- **H1:** Effective Dates – Canadian Standards on Quality Management
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 4
- **Headings:** 4
- **Sitecore IDs:** 5
- **Content Classes:** 13
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-subpage/_en_csqc_effective-dates.png

**Heading Hierarchy:**

- H1: Effective Dates – Canadian Standards on Quality Management
    - H3: About Proposed Effective Dates
    - H3: About Final Effective Dates
    - H3: CPA Canada Handbook

**Content Blocks:**

- `purple-info-container` → rte-wrapper
- `purple-info-container` → rte-wrapper
- `section` → responsive-table
- `purple-info-container` → purple-info-content

### section-subpage: https://www.frascanada.ca/en/ifrsstandards/effective-dates

- **H1:** Effective Dates – IFRS Accounting Standards
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 2
- **Content Classes:** 8
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-subpage/_en_ifrsstandards_effective-dates.png

**Heading Hierarchy:**

- H1: Effective Dates – IFRS Accounting Standards

**Content Blocks:**

- `purple-info-container` → rte-wrapper
- `section` → responsive-table

### section-projects-listing: https://www.frascanada.ca/en/cass/projects

- **H1:** Project Listing
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 2
- **Content Classes:** 16
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-projects-listing/_en_cass_projects.png

**Heading Hierarchy:**

- H1: Project Listing

**Content Blocks:**

- `project-table-container` → div
- `purple-info-container` → rte-wrapper

### section-projects-listing: https://www.frascanada.ca/en/csqc/projects

- **H1:** Project Listing
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 2
- **Content Classes:** 13
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-projects-listing/_en_csqc_projects.png

**Heading Hierarchy:**

- H1: Project Listing

**Content Blocks:**

- `project-table-container` → div
- `purple-info-container` → rte-wrapper

### section-projects-listing: https://www.frascanada.ca/en/ifrsstandards/projects

- **H1:** Project Listing
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 2
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-projects-listing/_en_ifrsstandards_projects.png

**Heading Hierarchy:**

- H1: Project Listing

**Content Blocks:**

- `project-table-container` → div
- `purple-info-container` → rte-wrapper

### section-project-detail: https://www.frascanada.ca/en/cass/projects/audit-evidence

- **H1:** Audit Evidence & Risk Response
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 7
- **Headings:** 30
- **Sitecore IDs:** 8
- **Content Classes:** 43
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-project-detail/_en_cass_projects_audit-evidence.png

**Heading Hierarchy:**

- H1: Audit Evidence & Risk Response
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Project Status
  - H2: News
    - H3: AASB Responds to the IAASB’s Exposure Draft of ISA 500, Audit Evidence
    - H3: On-demand Webinar – Exposure Draft – CAS 500, Audit Evidence
    - H3: AASB Exposure Draft – CAS 500, Audit Evidence
    - H3: IAASB issues Exposure Draft of ISA 500, Audit Evidence
  - H2: Meeting & event summaries
    - H3: AASB Decision Summary – December 1-2, 2025
    - H3: AASB Decision Summary – September 9, 2025
    - H3: AASB Decision Summary – June 9-10, 2025
    - H3: AASB Decision Summary – March 10-11, 2025
    - H3: AASB Decision Summary – December 2-3, 2024
    - H3: AASB Decision Summary – March 11-12, 2024
    - H3: AASB Decision Summary – December 4-5, 2023
    - H3: AASB Decision Summary – September 12-13, 2023
    - H3: AASB Decision Summary – April 5, 2023
    - H3: AASB Decision Summary – March 13-14, 2023
    - H3: AASB Decision Summary – October 25, 2022
    - H3: AASB Decision Summary – September 8-9 2022
    - H3: AASB Decision Summary – June 6-7 2022
    - H3: AASB Decision Summary – May 5, 2022
    - H3: AASB Decision Summary – March 7-8, 2022
    - H3: AASB Decision Summary – July 15, 2021
    - H3: AASB Decision Summary – November 30 – December 1, 2020
    - H3: AASB Decision Summary – June 8-9, 2020
    - H3: AASB Decision Summary – March 9-10, 2020
    - H3: AASB Decision Summary – June 10-11, 2019

**Content Blocks:**

- `section` → back-to-project
- `purple-info-container` → row
- `project-status-container` → project-status-content
- `purple-info-container` → purple-info-content
- `section rollups` → div
- `section rollups` → col-sm-12
- `maincontent_10_DisclaimerWrapper` → div

### section-project-detail: https://www.frascanada.ca/en/csqc/projects/aasb-strategic-plan

- **H1:** AASB Strategic Plan
- **Section Title:** AASB
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 6
- **Headings:** 8
- **Sitecore IDs:** 8
- **Content Classes:** 34
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-project-detail/_en_csqc_projects_aasb-strategic-plan.png

**Heading Hierarchy:**

- H1: AASB Strategic Plan
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Project Status
    - H3: Understanding. Responding. Supporting.
  - H2: News
    - H3: AASB Strategic Plan 2022-2025 Feedback Statement
    - H3: The Future of Auditing Standards – AASB Draft Strategic Plan

**Content Blocks:**

- `section` → back-to-project
- `purple-info-container` → row
- `project-status-container` → project-status-content
- `purple-info-container` → purple-info-content
- `section rollups` → div
- `maincontent_11_DisclaimerWrapper` → div

### section-project-detail: https://www.frascanada.ca/en/ifrsstandards/projects/2019-comprehensive-review-of-ifrs-for-smes

- **H1:** Second Comprehensive Review of the IFRS for SMEs Accounting Standard
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 7
- **Headings:** 11
- **Sitecore IDs:** 7
- **Content Classes:** 38
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-project-detail/_en_ifrsstandards_projects_2019-comprehensive-review-of-ifrs-for-smes.png

**Heading Hierarchy:**

- H1: Second Comprehensive Review of the IFRS for SMEs Accounting Standard
  - H2: Summary
  - H2: Staff Contact(s)
  - H2: Project Status
  - H2: News
    - H3: IASB Exposure Draft – Third Edition of the IFRS for SMEs Accounting Standard
    - H3: UPDATE – IASB amends workplan and timelines
    - H3: IASB Request for Information – 2019 Comprehensive Review of the IFRS for SMEs Standard
  - H2: Meeting & event summaries
    - H3: AcSB Decision Summary – January 26, 2023
    - H3: AcSB Decision Summary – November 16-17, 2022

**Content Blocks:**

- `section` → back-to-project
- `purple-info-container` → row
- `project-status-container` → project-status-content
- `purple-info-container` → col-sm-12 col-xs-12
- `section rollups` → div
- `section rollups` → col-sm-12
- `maincontent_10_DisclaimerWrapper` → div

### section-resources-listing: https://www.frascanada.ca/en/cass/resources

- **H1:** Resources
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 17
- **Content Classes:** 21
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resources-listing/_en_cass_resources.png

**Heading Hierarchy:**

- H1: Resources
  - H2: Attention Management and Auditors: Revised CAS 570, Going Concern Brings Changes to the Auditor’s Expectation for Manage
  - H2: AASB 2026-2029 Strategic Plan
  - H2: What You Need to Know about Changes to the Fraud Audit Standard
  - H2: New Resource: IAASB issues FAQ on Investigating Exceptions and Relevance of Performance Materiality When Using Automated
  - H2: On-demand Webinar - CAS 570, Going Concern
  - H2: Survey: Prioritizing Projects in the IAASB’s Work Plan for 2024-2027
  - H2: Amendments to IAS 1 and the Impact on the CASs: Disclosure of Material Accounting Policy Information
  - H2: Lessons Learned from KAM Reporting on Audits of TSX-Listed Entities: Observations from the 2020 Canadian Experience
  - H2: In Brief – Joint Policy Statement Concerning Communications between Actuaries Involved in the Preparation of Financial S
  - H2: Joint report on Fraud, Going Concern and the Expectation Gap in Audit

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### section-resources-listing: https://www.frascanada.ca/en/csqc/resources

- **H1:** Resources
- **Section Title:** Canadian Standards on Quality Management
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 7
- **Sitecore IDs:** 14
- **Content Classes:** 19
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resources-listing/_en_csqc_resources.png

**Heading Hierarchy:**

- H1: Resources
  - H2: What We Heard at the Canadian Technology Quality Management Roundtable
  - H2: AASB 2026-2029 Strategic Plan
  - H2: Survey: Prioritizing Projects in the IAASB’s Work Plan for 2024-2027
  - H2: IAASB Quality Management Implementation Resources
  - H2: IFAC Quality Management Panel Discussion
  - H2: AASB Strategic Plan 2022-2025 Feedback Statement

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### section-resources-listing: https://www.frascanada.ca/en/ifrsstandards/resources

- **H1:** Resources
- **Section Title:** IFRS® Accounting Standards
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 18
- **Content Classes:** 21
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resources-listing/_en_ifrsstandards_resources.png

**Heading Hierarchy:**

- H1: Resources
  - H2: 2024 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: 2023 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: What You Need to Know about IASB’s Exposure Draft “Business Combinations – Disclosure, Goodwill and Impairment”
  - H2: 2022 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: IAS 1 Presentation of Financial Statements – Additional disclosure considerations for companies engaging in crypto-asset
  - H2: IFRS 17 Matters for Non-insurance Entities
  - H2: 2021 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: 2020 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: COVID-19 and Going Concern: What the accounting standards require
  - H2: Close Call Going Concern Assessments

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input
- `purple-info-container` → rte-wrapper

### section-resource-detail: https://www.frascanada.ca/en/cass/resources/amendments-ias-1-impact-on-cass

- **H1:** Amendments to IAS 1 and the Impact on the CASs: Disclosure of Material Accounting Policy Information
- **Section Title:** Canadian Auditing Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 7
- **Headings:** 6
- **Sitecore IDs:** 10
- **Content Classes:** 9
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resource-detail/_en_cass_resources_amendments-ias-1-impact-on-cass.png

**Heading Hierarchy:**

- H1: Amendments to IAS 1 and the Impact on the CASs: Disclosure of Material Accounting Policy Information
  - H2: Narrow-scope Amendments to IAS 1
  - H2: What’s Changing in the CASs
  - H2: Disclosures in the Financial Statements Impacted by the Change to IAS 1
    - H3: The auditor’s responsibilities
  - H2: About this Publication

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `purple-info-container` → rte-wrapper
- `purple-info-container` → rte-wrapper
- `purple-info-container` → row
- `purple-info-container` → rte-wrapper
- `purple-info-container` → rte-wrapper
- `purple-info-container` → rte-wrapper

### section-resource-detail: https://www.frascanada.ca/en/ifrsstandards/resources/2020-changes-to-part-i-acsb-due-process-endorsement-activities

- **H1:** 2020 Changes to Part I – AcSB Due Process – Endorsement Activities
- **Section Title:** AcSB
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 4
- **Sitecore IDs:** 3
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resource-detail/_en_ifrsstandards_resources_2020-changes-to-part-i-acsb-due-process-endorsement-.png

**Heading Hierarchy:**

- H1: 2020 Changes to Part I – AcSB Due Process – Endorsement Activities
  - H2: The AcSB’s Due Process – Endorsing IFRS Standards
  - H2: Documenting Endorsement Activities
  - H2: 2020 Changes to Part I

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `detail-content-container` → detail-content rte-wrapper

### section-resource-detail: https://www.frascanada.ca/en/other/resources/audits-lces-progress-report

- **H1:** Audits of Less Complex Entities – Our Progress Toward a Solution
- **Section Title:** Other Canadian Standards
- **Sub-Nav Tabs:** 5
- **Content Blocks:** 3
- **Headings:** 11
- **Sitecore IDs:** 9
- **Content Classes:** 17
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/section-resource-detail/_en_other_resources_audits-lces-progress-report.png

**Heading Hierarchy:**

- H1: Audits of Less Complex Entities – Our Progress Toward a Solution
  - H2: Content Sections
  - H2: Overview of Discussion Paper Respondents
  - H2: What You Told Us
    - H3: Option 1 – Separate standard for LCE audits
    - H3: Option 2 – Limited targeted revisions to the CASs
    - H3: Option 3 – Targeted non-authoritative guidance
    - H3: Our response to the IAASB Exposure Draft
  - H2: What We Are Doing Now
  - H2: What Assistance Is Available Now
  - H2: Staff Contact(s)

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `purple-info-container` → row
- `purple-info-container` → row

### contact: https://www.frascanada.ca/en/contact-us

- **H1:** Contact Us
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 1
- **Headings:** 2
- **Sitecore IDs:** 8
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/contact/_en_contact-us.png

**Heading Hierarchy:**

- H1: Contact Us
  - H2: Media Inquiries

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### static-page: https://www.frascanada.ca/en/cookie-policy

- **H1:** Cookie policy
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 1
- **Headings:** 16
- **Sitecore IDs:** 2
- **Content Classes:** 6
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/static-page/_en_cookie-policy.png

**Heading Hierarchy:**

- H1: Cookie policy
  - H2: What is a cookie?
  - H2: What is interested-based advertising and do we conduct any?
  - H2: Do we use cookies and for what purposes?
  - H2: How can I manage my cookie preferences?
  - H2: Where do we store your personal data?  How do we safeguard your personal data?
  - H2: How to contact us?
  - H2: To learn more
  - H2: Strictly Necessary Cookies
  - H2: Performance Cookies
  - H2: Targeting Cookies
  - H2: To learn more...
    - H3: Strictly Necessary Cookies
    - H3: Performance Cookies
    - H3: Functional Cookies
    - H3: Targeting Cookies

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### static-page: https://www.frascanada.ca/en/cookie-policy/cookie-policy-2024

- **H1:** Cookie policy
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 1
- **Headings:** 16
- **Sitecore IDs:** 2
- **Content Classes:** 6
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/static-page/_en_cookie-policy_cookie-policy-2024.png

**Heading Hierarchy:**

- H1: Cookie policy
  - H2: What is a cookie?
  - H2: What is interested-based advertising and do we conduct any?
  - H2: Do we use cookies and for what purposes?
  - H2: How can I manage my cookie preferences?
  - H2: Where do we store your personal data?  How do we safeguard your personal data?
  - H2: How to contact us?
  - H2: To learn more
  - H2: Strictly Necessary Cookies
  - H2: Performance Cookies
  - H2: Targeting Cookies
  - H2: To learn more...
    - H3: Strictly Necessary Cookies
    - H3: Performance Cookies
    - H3: Functional Cookies
    - H3: Targeting Cookies

**Content Blocks:**

- `purple-info-container` → col-sm-12 col-xs-12

### static-page: https://www.frascanada.ca/en/copyright

- **H1:** Copyright
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 2
- **Content Classes:** 3
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/static-page/_en_copyright.png

**Heading Hierarchy:**

- H1: Copyright

**Content Blocks:**

- `purple-info-container` → rte-wrapper

### news-listing: https://www.frascanada.ca/en/news-listings

- **H1:** News Listings
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 11
- **Sitecore IDs:** 18
- **Content Classes:** 18
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/news-listing/_en_news-listings.png

**Heading Hierarchy:**

- H1: News Listings
  - H2: AcSB Exposure Draft – Amendments to the Fair Value Option for Investments in Associates and Joint Ventures
  - H2: AcSB endorses amendments to several illustrative examples to clarify disclosure requirements for uncertainties
  - H2: IFRS® Accounting Standards Discussion Group – Request for Issues
  - H2: AcSB endorses Translation to a Hyperinflationary Presentation Currency (Amendments to IAS 21)
  - H2: What We Heard and Next Steps for the Canadian Amendments Related to Indigenous Matters in the Canadian Standard on Susta
  - H2: Retractable or Mandatorily Redeemable Shares Issued in a Tax Planning Arrangement (ROMRS) Post-implementation Review – W
  - H2: What We Heard at the Canadian Technology Quality Management Roundtable
  - H2: AcSB Decision Summary – January 22, 2026
  - H2: AASB Decision Summary – January 19, 2026
  - H2: AcSB and CSSB Meet Japanese Counterparts to Advance Global Accounting and Sustainability Standards

**Content Blocks:**

- `maincontent_4_ScriptWrapper`
- `maincontent_4_NewsListingPanel` → section, input, input

### news-detail: https://www.frascanada.ca/en/news-listings/2024-04-01-rasoc-announcement

- **H1:** Canada’s Reporting and Assurance Oversight Councils Announce Transition to Single Oversight Council for Streamlined Standard Setting
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 5
- **Sitecore IDs:** 4
- **Content Classes:** 7
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/news-detail/_en_news-listings_2024-04-01-rasoc-announcement.png

**Heading Hierarchy:**

- H1: Canada’s Reporting and Assurance Oversight Councils Announce Transition to Single Oversight Council for Streamlined Stan
  - H2: Reporting & Assurance Standards Oversight Council appoints Chair, to follow a pragmatic multi-year approach to recruitme
  - H2: About AASOC
  - H2: About AcSOC
  - H2: For further information:

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `purple-info-container` → row

### news-detail: https://www.frascanada.ca/en/news-listings/canadian-standard-setting-changes-ahead

- **H1:** Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 2
- **Headings:** 2
- **Sitecore IDs:** 7
- **Content Classes:** 15
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/news-detail/_en_news-listings_canadian-standard-setting-changes-ahead.png

**Heading Hierarchy:**

- H1: Canadian Standard Setting Changes Ahead – Independent Review Committee recommendations are moving forward
  - H2: Staff Contact(s)

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `purple-info-container` → row

### news-detail: https://www.frascanada.ca/en/news-listings/close-call-going-concern-assessment

- **H1:** Close Call Going Concern Assessments
- **Section Title:** FRASCanada
- **Sub-Nav Tabs:** 7
- **Content Blocks:** 4
- **Headings:** 2
- **Sitecore IDs:** 11
- **Content Classes:** 22
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/news-detail/_en_news-listings_close-call-going-concern-assessment.png

**Heading Hierarchy:**

- H1: Close Call Going Concern Assessments
  - H2: Staff Contact(s)

**Content Blocks:**

- `detail-content-intro` → col-sm-12
- `purple-info-container` → row
- `purple-info-container` → purple-info-content
- `detail-content-container` → detail-content rte-wrapper

### council-members-listing: https://www.frascanada.ca/en/rasoc/about/members

- **H1:** Members
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 1
- **Headings:** 1
- **Sitecore IDs:** 4
- **Content Classes:** 12
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-members-listing/_en_rasoc_about_members.png

**Heading Hierarchy:**

- H1: Members

**Content Blocks:**

- `row` → col-sm-8 col-xs-12, sidebar-menu hidden-xs

### council-member-profile: https://www.frascanada.ca/en/rasoc/about/members/barb-sundquist

- **H1:** Barb Sundquist
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 8
- **Content Classes:** 6
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-member-profile/_en_rasoc_about_members_barb-sundquist.png

**Heading Hierarchy:**

- H1: Barb Sundquist

**Content Blocks:**

- `boardMemberDesignation`
- `section` → row

### council-member-profile: https://www.frascanada.ca/en/rasoc/about/members/beili-wong

- **H1:** Beili Wong
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 10
- **Content Classes:** 6
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-member-profile/_en_rasoc_about_members_beili-wong.png

**Heading Hierarchy:**

- H1: Beili Wong

**Content Blocks:**

- `boardMemberDesignation`
- `section` → row

### council-member-profile: https://www.frascanada.ca/en/rasoc/about/members/christine-moore

- **H1:** Christine Moore
- **Section Title:** Reporting & Assurance Standards Oversight Council
- **Sub-Nav Tabs:** 6
- **Content Blocks:** 2
- **Headings:** 1
- **Sitecore IDs:** 8
- **Content Classes:** 6
- **Screenshot:** .ai-reports/dogfood-frascanada/screenshots/council-member-profile/_en_rasoc_about_members_christine-moore.png

**Heading Hierarchy:**

- H1: Christine Moore

**Content Blocks:**

- `boardMemberDesignation`
- `section` → row

