/**
 * @description
 * Seed script for the media collection (Epic 24 testing).
 * Uploads a mix of images, PDFs, and logos into the Media Library
 * with proper folder assignments matching the seeded folder structure.
 *
 * Sources:
 * - RAS Canada logos/banners/news images: downloaded from frascanada.ca
 * - Property images: borrowed from manchester-properties project for visual variety
 * - PDFs: borrowed from manchester-properties for document folder testing
 *
 * @notes
 * - Run via: npx tsx src/seed/seed-media.ts
 * - Requires media-folders to be seeded first (seed-media-folders.ts)
 * - Uses Payload Local API with file buffer uploads
 * - Skips files that already exist (by filename match)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Manchester media base path
const MANCHESTER_MEDIA = '/Users/garson/02--onske/projects/manchester-properties/upgraded-fortnite/public/media'

// Local FRAS assets (downloaded from frascanada.ca)
const FRAS_ASSETS = path.resolve(__dirname, 'media-assets')

interface MediaSeed {
  /** Source file path on disk */
  sourcePath: string
  /** Desired filename in Payload */
  filename: string
  /** Alt text (EN) */
  alt: string
  /** Title (EN) */
  title: string
  /** Target folder name (must exist in seeded folders) */
  folderName: string
  /** Parent folder name (for nested folders like Images/Boards) */
  parentFolderName?: string
  /** MIME type */
  mimeType: string
}

// --- Media items to seed ---

const MEDIA_ITEMS: MediaSeed[] = [
  // === LOGOS ===
  {
    sourcePath: path.join(FRAS_ASSETS, 'fras-header-logo.png'),
    filename: 'fras-header-logo.png',
    alt: 'RAS Canada header logo',
    title: 'RAS Canada Header Logo',
    folderName: 'Logos',
    mimeType: 'image/png',
  },
  {
    sourcePath: path.join(FRAS_ASSETS, 'fras-footer-logo-en.png'),
    filename: 'fras-footer-logo-en.png',
    alt: 'RAS Canada footer logo',
    title: 'RAS Canada Footer Logo (English)',
    folderName: 'Logos',
    mimeType: 'image/png',
  },

  // === HERO / BANNER IMAGES ===
  {
    sourcePath: path.join(FRAS_ASSETS, 'fras-banner-en.png'),
    filename: 'fras-banner-en.png',
    alt: 'RAS Canada homepage banner',
    title: 'Homepage Hero Banner (English)',
    folderName: 'Heroes',
    parentFolderName: 'Images',
    mimeType: 'image/png',
  },

  // === NEWS IMAGES ===
  {
    sourcePath: path.join(FRAS_ASSETS, 'news-isa-540-review.jpg'),
    filename: 'news-isa-540-review.jpg',
    alt: 'ISA 540 Review virtual roundtable',
    title: 'ISA 540 Review - Top Story Image',
    folderName: 'News',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(FRAS_ASSETS, 'news-technology-roundtable.jpg'),
    filename: 'news-technology-roundtable.jpg',
    alt: 'Canadian Technology Quality Management Roundtable',
    title: 'Technology Roundtable - Top Story Image',
    folderName: 'News',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(FRAS_ASSETS, 'news-romrs-review.jpg'),
    filename: 'news-romrs-review.jpg',
    alt: 'ROMRS Post-implementation Review',
    title: 'ROMRS Review - Top Story Image',
    folderName: 'News',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },

  // === BOARD IMAGES (from manchester site-images — repurposed as board visuals) ===
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'site-images/MP_Office_Default.jpg'),
    filename: 'board-acsb-hero.jpg',
    alt: 'AcSB Accounting Standards Board hero image',
    title: 'AcSB Hero Image',
    folderName: 'Boards',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'site-images/MP_Industrial_Default.jpg'),
    filename: 'board-psab-hero.jpg',
    alt: 'PSAB Public Sector Accounting Board hero image',
    title: 'PSAB Hero Image',
    folderName: 'Boards',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'site-images/MP_Land_Default.jpg'),
    filename: 'board-aasb-hero.jpg',
    alt: 'AASB Auditing and Assurance Standards Board hero image',
    title: 'AASB Hero Image',
    folderName: 'Boards',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'site-images/MP_Retail_Default.jpg'),
    filename: 'board-cssb-hero.jpg',
    alt: 'CSSB Canadian Sustainability Standards Board hero image',
    title: 'CSSB Hero Image',
    folderName: 'Boards',
    parentFolderName: 'Images',
    mimeType: 'image/jpeg',
  },

  // === GENERAL IMAGES (property images repurposed as misc content images) ===
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250625_195648641_iOS-400x300.jpg'),
    filename: 'content-image-01.jpg',
    alt: 'Content placeholder image 1',
    title: 'Content Image 01',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250625_195715692_iOS-400x300.jpg'),
    filename: 'content-image-02.jpg',
    alt: 'Content placeholder image 2',
    title: 'Content Image 02',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250625_195747455_iOS-400x300.jpg'),
    filename: 'content-image-03.jpg',
    alt: 'Content placeholder image 3',
    title: 'Content Image 03',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250625_195800355_iOS-400x300.jpg'),
    filename: 'content-image-04.jpg',
    alt: 'Content placeholder image 4',
    title: 'Content Image 04',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250625_195822042_iOS-400x300.jpg'),
    filename: 'content-image-05.jpg',
    alt: 'Content placeholder image 5',
    title: 'Content Image 05',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250626_165543962_iOS-400x300.jpg'),
    filename: 'content-image-06.jpg',
    alt: 'Content placeholder image 6',
    title: 'Content Image 06',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250626_165613857_iOS-400x300.jpg'),
    filename: 'content-image-07.jpg',
    alt: 'Content placeholder image 7',
    title: 'Content Image 07',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'property-images/20250626_165927607_iOS-400x300.jpg'),
    filename: 'content-image-08.jpg',
    alt: 'Content placeholder image 8',
    title: 'Content Image 08',
    folderName: 'Images',
    mimeType: 'image/jpeg',
  },

  // === PDFs ===
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'pdf/5073_11_Street_SE.pdf'),
    filename: 'sample-annual-report-2024.pdf',
    alt: 'Sample annual report PDF',
    title: 'Annual Report 2024 (Sample)',
    folderName: 'Reports',
    parentFolderName: 'Documents',
    mimeType: 'application/pdf',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'pdf/207-61-Ave.pdf'),
    filename: 'sample-consultation-paper.pdf',
    alt: 'Sample consultation paper PDF',
    title: 'Consultation Paper — Revenue Recognition (Sample)',
    folderName: 'PDFs',
    parentFolderName: 'Documents',
    mimeType: 'application/pdf',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'pdf/2107-2115-Sirocco-April12025.pdf'),
    filename: 'sample-exposure-draft.pdf',
    alt: 'Sample exposure draft PDF',
    title: 'Exposure Draft — Leases (Sample)',
    folderName: 'PDFs',
    parentFolderName: 'Documents',
    mimeType: 'application/pdf',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'pdf/1601-centre-Street-N-Unit-B-Lease-Brochure-20250311.pdf'),
    filename: 'sample-meeting-summary.pdf',
    alt: 'Sample meeting summary PDF',
    title: 'AcSB Meeting Summary — March 2025 (Sample)',
    folderName: 'PDFs',
    parentFolderName: 'Documents',
    mimeType: 'application/pdf',
  },
  {
    sourcePath: path.join(MANCHESTER_MEDIA, 'pdf/207-61AVE_NEW_BROCHURE_V1.pdf'),
    filename: 'sample-strategic-plan.pdf',
    alt: 'Sample strategic plan PDF',
    title: 'FRAS Strategic Plan 2024-2027 (Sample)',
    folderName: 'Reports',
    parentFolderName: 'Documents',
    mimeType: 'application/pdf',
  },
]

/**
 * Resolve a folder ID by name, optionally under a parent folder.
 */
async function resolveFolderId(
  payload: Awaited<ReturnType<typeof getPayload>>,
  folderName: string,
  parentFolderName?: string,
): Promise<number | null> {
  if (parentFolderName) {
    // First find parent
    const parentResult = await payload.find({
      collection: 'media-folders',
      where: {
        name: { equals: parentFolderName },
        parent: { exists: false },
      },
      limit: 1,
    })
    if (parentResult.docs.length === 0) {
      console.warn(`  Parent folder "${parentFolderName}" not found`)
      return null
    }
    const parentId = parentResult.docs[0].id

    // Then find child under parent
    const childResult = await payload.find({
      collection: 'media-folders',
      where: {
        name: { equals: folderName },
        parent: { equals: parentId },
      },
      limit: 1,
    })
    if (childResult.docs.length === 0) {
      console.warn(`  Child folder "${folderName}" under "${parentFolderName}" not found`)
      return null
    }
    return childResult.docs[0].id as number
  }

  // Root-level folder
  const result = await payload.find({
    collection: 'media-folders',
    where: {
      name: { equals: folderName },
      parent: { exists: false },
    },
    limit: 1,
  })
  if (result.docs.length === 0) {
    console.warn(`  Folder "${folderName}" not found`)
    return null
  }
  return result.docs[0].id as number
}

export async function seedMedia(): Promise<void> {
  const payload = await getPayload({ config })
  console.log('Seeding media items...\n')

  let created = 0
  let skipped = 0
  let failed = 0

  for (const item of MEDIA_ITEMS) {
    // Check if file already exists
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  SKIP: ${item.filename} (already exists)`)
      skipped++
      continue
    }

    // Verify source file exists
    if (!fs.existsSync(item.sourcePath)) {
      console.error(`  FAIL: ${item.filename} — source not found: ${item.sourcePath}`)
      failed++
      continue
    }

    // Resolve folder
    const folderId = await resolveFolderId(payload, item.folderName, item.parentFolderName)

    // Read file buffer
    const fileBuffer = fs.readFileSync(item.sourcePath)

    try {
      await payload.create({
        collection: 'media',
        data: {
          alt: item.alt,
          title: item.title,
          ...(folderId ? { folder: folderId } : {}),
        },
        file: {
          data: fileBuffer,
          mimetype: item.mimeType,
          name: item.filename,
          size: fileBuffer.length,
        },
      })
      const folderPath = item.parentFolderName
        ? `${item.parentFolderName}/${item.folderName}`
        : item.folderName
      console.log(`  OK: ${item.filename} → ${folderPath} (${(fileBuffer.length / 1024).toFixed(0)} KB)`)
      created++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  FAIL: ${item.filename} — ${msg}`)
      failed++
    }
  }

  console.log(`\nMedia seed complete: ${created} created, ${skipped} skipped, ${failed} failed`)
}

// Allow direct execution
const isDirectRun = process.argv[1]?.includes('seed-media')
if (isDirectRun) {
  seedMedia()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err)
      process.exit(1)
    })
}
