/**
 * Seed test users — one per role.
 *
 * Usage: npx tsx scripts/seed-test-users.ts
 *
 * Creates / re-creates:
 *   admin@test.com   / Test1234!   (role: admin)
 *   editor@test.com  / Test1234!   (role: editor)
 *   author@test.com  / Test1234!   (role: author)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const USERS: Array<{
  email: string
  password: string
  role: 'admin' | 'editor' | 'author'
  firstName: string
  lastName: string
}> = [
  { email: 'admin@test.com', password: 'Test1234!', role: 'admin', firstName: 'Ada', lastName: 'Admin' },
  { email: 'editor@test.com', password: 'Test1234!', role: 'editor', firstName: 'Eli', lastName: 'Editor' },
  { email: 'author@test.com', password: 'Test1234!', role: 'author', firstName: 'Andi', lastName: 'Author' },
]

async function main() {
  const payload = await getPayload({ config })

  for (const u of USERS) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: u.email } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      const id = existing.docs[0].id
      // Reset password + role on existing account so the seed is idempotent.
      await payload.update({
        collection: 'users',
        id,
        data: {
          password: u.password,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
        },
      })
      console.log(`  ↻  ${u.email}  (${u.role})  — updated`)
    } else {
      await payload.create({
        collection: 'users',
        data: {
          email: u.email,
          password: u.password,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
        },
      })
      console.log(`  ✚  ${u.email}  (${u.role})  — created`)
    }
  }

  console.log('\n✓ Done. Login with any of:')
  for (const u of USERS) {
    console.log(`    ${u.email} / ${u.password}   (${u.role})`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed to seed users:', err)
  process.exit(1)
})
