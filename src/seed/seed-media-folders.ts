/**
 * @description
 * Seed script for the media-folders collection (Epic 24).
 * Creates the initial folder structure for the media library:
 *   Images/ (Boards/, News/, Heroes/)
 *   Documents/ (PDFs/, Reports/)
 *   Logos/
 *   Videos/
 *
 * @notes
 * - Run via: npx tsx src/seed/seed-media-folders.ts
 * - Checks for existing folders before creating to avoid duplicates
 * - Uses Payload Local API with overrideAccess: true for seeding
 */
import { getPayload } from 'payload'
import config from '@payload-config'

interface FolderSeed {
  name: string
  sortOrder: number
  children?: FolderSeed[]
}

const FOLDER_STRUCTURE: FolderSeed[] = [
  {
    name: 'Images',
    sortOrder: 0,
    children: [
      { name: 'Boards', sortOrder: 0 },
      { name: 'News', sortOrder: 1 },
      { name: 'Heroes', sortOrder: 2 },
    ],
  },
  {
    name: 'Documents',
    sortOrder: 1,
    children: [
      { name: 'PDFs', sortOrder: 0 },
      { name: 'Reports', sortOrder: 1 },
    ],
  },
  { name: 'Logos', sortOrder: 2 },
  { name: 'Videos', sortOrder: 3 },
]

async function createFolders(
  payload: Awaited<ReturnType<typeof getPayload>>,
  folders: FolderSeed[],
  parentId: number | null,
): Promise<void> {
  for (const folder of folders) {
    // Check if folder already exists under this parent
    const existing = await payload.find({
      collection: 'media-folders',
      where: {
        name: { equals: folder.name },
        ...(parentId
          ? { parent: { equals: parentId } }
          : { parent: { exists: false } }),
      },
      limit: 1,
    })

    let folderId: number

    if (existing.docs.length > 0) {
      folderId = existing.docs[0].id as number
      console.log(`  Folder exists: ${folder.name} (id: ${folderId})`)
    } else {
      const created = await payload.create({
        collection: 'media-folders',
        data: {
          name: folder.name,
          sortOrder: folder.sortOrder,
          ...(parentId ? { parent: parentId } : {}),
        },
      })
      folderId = created.id as number
      console.log(`  Created folder: ${folder.name} (id: ${folderId})`)
    }

    if (folder.children) {
      await createFolders(payload, folder.children, folderId)
    }
  }
}

export async function seedMediaFolders(): Promise<void> {
  const payload = await getPayload({ config })
  console.log('Seeding media folders...')
  await createFolders(payload, FOLDER_STRUCTURE, null)
  console.log('Media folders seeded successfully.')
}

// Allow direct execution
const isDirectRun = process.argv[1]?.includes('seed-media-folders')
if (isDirectRun) {
  seedMediaFolders()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err)
      process.exit(1)
    })
}
