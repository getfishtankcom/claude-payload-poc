# Sitecore Media Library — FRAS Canada Full Dump (1GB)

## Summary

- **Total blob files:** 1,275 (982 MB on disk)
- **Estimated total media items:** ~850+ (many items have EN+FR language versions sharing the same blob)
- **Media types:** PDFs (majority by file size), JPEG images, PNG images
- **Top-level folders:** 3 (`FRASCanada/`, `IRCSS/`, `Site/`)
- **FRASCanada subfolders:** 18 (including a stray GUID folder and a standalone logo)
- **Deepest nesting:** 4 levels (e.g., `FRASCanada/AcSB/Committees/IDG Extracts/`)

## Folder Structure

```
media library/
├── FRASCanada/                          (~800+ items)
│   ├── {ACAADB3B-...}/                  (1 item — stray GUID folder)
│   ├── AASB/                            (~38 items)
│   │   ├── About/                       (16 items — strategic plans, due process, annual reports)
│   │   ├── Member-Photos/               (16 items — headshots)
│   │   └── News/                        (7 items — news graphics, transcripts)
│   ├── AASOC/                           (~26 items)
│   │   ├── About/                       (5 items — public interest report, annual report)
│   │   ├── Activities/                  (4 items — activity thumbnails EN/FR)
│   │   ├── Member-Photos/               (15 items — headshots)
│   │   └── News/                        (2 items — AASOC logo EN/FR)
│   ├── AcSB/                            (~237 items)
│   │   ├── About/                       (54 items — strategic plans, due process, annual plans)
│   │   ├── Committees/                  (~180 items)
│   │   │   ├── IDG Extracts/            (105 items — meeting extracts EN/FR)
│   │   │   ├── IDG Reports/             (73 items — meeting reports EN/FR)
│   │   │   └── ITRG - Reports/          (2 items)
│   │   ├── Meetings/                    (10 items — webinar slides, transcripts)
│   │   ├── Member-Photos/               (17 items — headshots)
│   │   └── News/                        (48 items — COVID-19, research, frameworks)
│   ├── AcSOC/                           (~34 items)
│   │   ├── {07002039-...}/              (1 item — stray GUID)
│   │   ├── About/                       (5 items — about page, annual report)
│   │   ├── Activities/                  (4 items — activity thumbnails)
│   │   └── Member Photos/               (25 items — headshots)
│   ├── ASPE/                            (~49 items)
│   │   ├── Documents/                   (40 items — exposure drafts, response booklets)
│   │   └── Resources/                   (9 items — in-briefs, webinar transcripts)
│   ├── CAS/                             (~56 items)
│   │   ├── Documents/                   (48 items — exposure drafts, standards docs)
│   │   └── Resources/                   (8 items — banners, guidance documents)
│   ├── CSQC/                            (9 items)
│   │   └── Documents/                   (9 items — quality management standards)
│   ├── CSSB/                            (~28 items)
│   │   ├── Meetings/                    (2 items — webinar slides)
│   │   ├── Member-Photos/               (22 items — headshots)
│   │   └── News/                        (4 items — response letters, graphics)
│   ├── FRAS/                            (48 items — LinkedIn logos, signatures, infographics, relationships)
│   ├── FRAS Full_CMYK-Horiz/            (1 item — FRAS logo variant)
│   ├── Global-Images/                   (~52 items)
│   │   ├── Banners/                     (14 items — board banners EN/FR)
│   │   ├── default-member/              (1 item — placeholder headshot)
│   │   ├── Homepage/                    (20 items — board logos RGB + Reverse, EN/FR)
│   │   ├── Icons/                       (6 items — Audits, Financial Statements, etc.)
│   │   ├── Karen-Hogan/                 (1 item)
│   │   ├── Logos/                       (3 items — header + footer logos EN/FR)
│   │   ├── Search/                      (1 item — search icon)
│   │   └── Social-Icons/                (3 items — Facebook, LinkedIn, Twitter)
│   ├── IFRS/                            (~48 items)
│   │   ├── Documents/                   (21 items — exposure drafts, comment letters)
│   │   ├── Projects/                    (4 items — flowcharts)
│   │   └── Resources/                   (23 items — changes to Part I, thumbnails)
│   ├── NFPOS/                           (~20 items)
│   │   ├── Documents/                   (16 items — contributions, combinations)
│   │   └── Resources/                   (4 items — webinar slides)
│   ├── Other/                           (~27 items)
│   │   ├── Documents/                   (10 items — sustainability assurance, LCE)
│   │   ├── Projects/                    (2 items — post-implementation reviews)
│   │   └── Resources/                   (15 items — guidance, banners, pie charts)
│   ├── Pensions/                        (8 items)
│   │   └── Documents/                   (8 items — pension plan exposure drafts)
│   ├── PSAB/                            (~246 items)
│   │   ├── About/                       (56 items — strategic plans, due process, icons)
│   │   ├── Committees/                  (53 items — PSADG meeting reports, observer notes)
│   │   ├── Meetings/                    (12 items — webinar slides, transcripts)
│   │   ├── Member-Photos/               (21 items — headshots)
│   │   ├── News/                        (2 items — response documents)
│   │   └── PSADG-Past-Meetings/         (38 items — past meeting reports EN/FR)
│   ├── Public-Sector/                   (~126 items)
│   │   ├── Documents/                   (39 items — exposure drafts, standards docs)
│   │   ├── Projects/                    (18 items — in-briefs, posters, comparisons)
│   │   └── Resources/                   (69 items — guidance, webinars, one-pagers)
│   └── Sustainability/                  (6 items — ISSB webinar slides, transcripts, photos)
├── IRCSS/                               (35 items — consultation papers, infographics, logos, reports)
│   └── (flat structure, no subfolders)
└── Site/                                (~5 items)
    └── Bio-Images/                      (4 items — Bill-Cox, Edward-Waitzer, Nicola-Young, Bruce-West)
```

## Media Metadata Structure

Each media item is stored as a directory tree: `ItemName/{GUID}/[language]/[version]/xml`

### Image Item Fields (template="image")
| Field | Type | Example |
|-------|------|---------|
| `alt` | Single-Line Text | "Photo of Armand Capisciolto" / "Portrait d'Armand Capisciolto" |
| `mime type` | Single-Line Text | "image/jpeg" or "image/png" |
| `extension` | Single-Line Text | "jpg" or "png" |
| `width` | Single-Line Text | "205" |
| `height` | Single-Line Text | "205" |
| `dimensions` | Single-Line Text | "205 x 205" |
| `size` | Single-Line Text | "9023" (bytes) |
| `blob` | attachment | UUID reference to blob file |

### PDF Item Fields (template="pdf")
| Field | Type | Example |
|-------|------|---------|
| `title` | Single-Line Text | "Webinar on the Introduction to the ISSB Exposure Drafts" |
| `description` | Single-Line Text | Descriptive summary of the PDF content |
| `keywords` | Multi-Line Text | "ISSB, IFRS S1, IFRS S2, Sustainability" |
| `mime type` | Single-Line Text | "application/pdf" |
| `extension` | Single-Line Text | "pdf" |
| `size` | Single-Line Text | "1498275" (bytes) |
| `blob` | attachment | UUID reference to blob file |

### System Fields (both templates)
| Field | Key | Description |
|-------|-----|-------------|
| `__created by` | Creator | Sitecore user (e.g., `sitecore\srancour`, `cpacanada\mrousseau@cpacanada.ca`) |
| `__updated by` | Last editor | Sitecore user |
| `__created` | Created date | ISO format `20181119T193825Z` |
| `__updated` | Modified date | ISO format |
| `__owner` | Owner | Sitecore user |
| `__revision` | Version UUID | |
| `__lock` | Lock state | `<r />` = unlocked |

### Bilingual Pattern
- Images: Both EN and FR versions share the **same blob** (same image file) but have **different alt text** (EN: "Photo of...", FR: "Portrait de...")
- PDFs: Many documents exist as **separate items** for EN and FR, each with their own blob (separate PDF files per language)
- Some items only have EN version (no FR `xml` file exists)

## Media Types Breakdown

Based on sampling 13 blob files with the `file` command:

| Type | Estimated Count | Avg Size | Notes |
|------|----------------|----------|-------|
| PDF documents | ~700-800 | ~800KB-2MB | Exposure drafts, meeting reports, response booklets, strategic plans, webinar slides |
| JPEG images | ~200-250 | ~5-50KB | Member headshots (205x205), stock photos for banners (750x100) |
| PNG images | ~150-200 | ~5-100KB | Logos, icons, infographics, thumbnails, banners (up to 1140x375) |

**Note:** PDFs dominate by total file size (likely 900+ MB of the 982 MB blob directory). Images are numerous but small.

## Organization Patterns

1. **Board-centric hierarchy:** Media is organized primarily by board/council (AcSB, PSAB, AASB, CSSB, etc.), mirroring the site's content structure. Each board folder has consistent subfolder patterns.

2. **Functional subfolders:** Within each board, common subfolder types include:
   - `About/` — Strategic plans, due process manuals, annual reports, infographics
   - `Member-Photos/` — Headshot images of board/committee members
   - `Documents/` — Formal publications: exposure drafts, response booklets, comment letters
   - `Resources/` — Supporting materials: in-briefs, webinar slides/transcripts, thumbnails
   - `News/` — News-related graphics and supporting media
   - `Committees/` — Committee meeting reports (IDG, PSADG, ITRG)
   - `Meetings/` — Webinar slides, transcripts, presentations
   - `Projects/` — Project-specific media (flowcharts, comparisons)

3. **Bilingual naming convention:** French versions often have French prefixes or translations:
   - EN: `AcSB-Strategic-Plan-2022-2027` / FR: `CNC-plan-strategique-2022-2027`
   - EN: `PSAB-Banner-EN` / FR: `PSAB-Banner-FR`
   - EN: Board acronyms (AcSB, AASB, PSAB) / FR: French acronyms (CNC, CNAC, CCSP)
   - Thumbnails often suffixed with `-vignette` (FR) or `-thumbnail` (EN)

4. **Standards-section folders:** IFRS, ASPE, NFPOS, Public-Sector, Pensions, CSQC are organized by standards domain rather than board ownership. These contain the formal standards documents.

5. **Shared/global assets:** `Global-Images/` contains site-wide assets (banners, logos, icons, homepage board logos, social icons) not tied to any specific board.

6. **Committee meeting reports are the largest collection:** AcSB Committees alone has 180 items (IDG Extracts: 105, IDG Reports: 73, ITRG: 2). These are EN/FR pairs of PDF meeting reports spanning 2012-2023.

7. **Thumbnail pattern:** Many PDFs have companion thumbnail images with `-thumbnail` or `-vignette` suffix, used as preview images on listing pages.

8. **IRCSS is flat:** The Independent Standard-Setting Review folder has no subfolders — all 35 items are at the top level.

## Key Findings for Migration

### Migration Complexity
1. **~1,275 blob files** need to be extracted and re-uploaded to the new media library. The blob-to-item mapping requires parsing each item's XML to find the `blob` field UUID.

2. **Bilingual alt text requires special handling:** Image items share one blob but have separate EN/FR alt text. The new system needs to store alt text per locale, not per file.

3. **PDF metadata is rich:** Many PDFs have `title`, `description`, and `keywords` fields that should be preserved during migration for search indexing.

4. **Thumbnail associations are implicit:** The relationship between a document and its thumbnail is based only on naming convention (e.g., `AcSB-Strategic-Plan-2022-2027` + `AcSB-Strategic-Plan-2022-2027-Thumbnail`). Migration would need to establish explicit relationships.

### Folder Structure Recommendations for Payload CMS
1. **Preserve board-based organization** in the new media library folder structure.
2. **Flatten the committee meeting reports** — the 3-level nesting under `AcSB/Committees/IDG Extracts/` may be excessive. Consider `AcSB/Committees/` with metadata-based filtering.
3. **Consolidate `FRAS/` and `Global-Images/`** into a single `Shared/` or `Global/` folder.
4. **Standards-section folders** (IFRS, ASPE, NFPOS, etc.) should map to board ownership in metadata rather than folder location, since these documents belong to AcSB or PSAB projects.
5. **Member photos** (~95 across all boards) are small JPEGs (205x205) — consider standardizing dimensions and format during migration.

### Migration Script Requirements
1. Parse XML item files to extract: blob UUID, mime type, extension, alt text (EN/FR), title, description, keywords, dimensions
2. Map blob UUID to file in `blob/master/` directory
3. Rename blob files with proper extensions (they're stored without extensions)
4. Upload to Payload CMS media collection with metadata
5. Create board/folder associations
6. Link thumbnails to their parent documents

### Items NOT Migrated
- System fields (`__created by`, `__updated by`, `__lock`, `__revision`) are Sitecore-internal
- `__icon` field (Sitecore-generated thumbnail URLs) is not needed
- `__owner` can be mapped to the new CMS admin user
- Stray GUID folders (`{ACAADB3B-...}`, `{07002039-...}`) appear to be Sitecore artifacts

## Appendix: Item Counts by Folder

| Folder Path | Items |
|-------------|-------|
| FRASCanada/AASB/About | 16 |
| FRASCanada/AASB/Member-Photos | 16 |
| FRASCanada/AASB/News | 7 |
| FRASCanada/AASOC/About | 5 |
| FRASCanada/AASOC/Activities | 4 |
| FRASCanada/AASOC/Member-Photos | 15 |
| FRASCanada/AASOC/News | 2 |
| FRASCanada/AcSB/About | 54 |
| FRASCanada/AcSB/Committees/IDG Extracts | 105 |
| FRASCanada/AcSB/Committees/IDG Reports | 73 |
| FRASCanada/AcSB/Committees/ITRG - Reports | 2 |
| FRASCanada/AcSB/Meetings | 10 |
| FRASCanada/AcSB/Member-Photos | 17 |
| FRASCanada/AcSB/News | 48 |
| FRASCanada/AcSOC/About | 5 |
| FRASCanada/AcSOC/Activities | 4 |
| FRASCanada/AcSOC/Member Photos | 25 |
| FRASCanada/ASPE/Documents | 40 |
| FRASCanada/ASPE/Resources | 9 |
| FRASCanada/CAS/Documents | 48 |
| FRASCanada/CAS/Resources | 8 |
| FRASCanada/CSQC/Documents | 9 |
| FRASCanada/CSSB/Meetings | 2 |
| FRASCanada/CSSB/Member-Photos | 22 |
| FRASCanada/CSSB/News | 4 |
| FRASCanada/FRAS (top-level items) | 48 |
| FRASCanada/FRAS Full_CMYK-Horiz | 1 |
| FRASCanada/Global-Images/Banners | 14 |
| FRASCanada/Global-Images/Homepage | 20 |
| FRASCanada/Global-Images/Icons | 6 |
| FRASCanada/Global-Images/Logos | 3 |
| FRASCanada/Global-Images/Search | 1 |
| FRASCanada/Global-Images/Social-Icons | 3 |
| FRASCanada/Global-Images/default-member | 1 |
| FRASCanada/Global-Images/Karen-Hogan | 1 |
| FRASCanada/IFRS/Documents | 21 |
| FRASCanada/IFRS/Projects | 4 |
| FRASCanada/IFRS/Resources | 23 |
| FRASCanada/NFPOS/Documents | 16 |
| FRASCanada/NFPOS/Resources | 4 |
| FRASCanada/Other/Documents | 10 |
| FRASCanada/Other/Projects | 2 |
| FRASCanada/Other/Resources | 15 |
| FRASCanada/Pensions/Documents | 8 |
| FRASCanada/PSAB/About | 56 |
| FRASCanada/PSAB/Committees | 53 |
| FRASCanada/PSAB/Meetings | 12 |
| FRASCanada/PSAB/Member-Photos | 21 |
| FRASCanada/PSAB/News | 2 |
| FRASCanada/PSAB/PSADG-Past-Meetings | 38 |
| FRASCanada/Public-Sector/Documents | 39 |
| FRASCanada/Public-Sector/Projects | 18 |
| FRASCanada/Public-Sector/Resources | 69 |
| FRASCanada/Sustainability | 6 |
| IRCSS (flat) | 35 |
| Site/Bio-Images | 4 |
| **TOTAL** | **~1,112** |

*Note: Some items have both EN and FR language versions (counted as 1 item above). The blob count (1,275) is higher because some items have separate blobs for EN/FR PDFs, and some blobs may be orphaned or duplicated.*
