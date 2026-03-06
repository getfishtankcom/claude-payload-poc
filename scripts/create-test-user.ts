/**
 * @description
 * Creates a test admin user for self-test runs.
 * Uses Payload Local API directly (no HTTP server needed).
 *
 * Usage: npx tsx scripts/create-test-user.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  // Check if any users exist
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log('User already exists, skipping creation.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@test.com',
      password: 'Test1234!',
      role: 'admin',
      firstName: 'Test',
      lastName: 'Admin',
    },
  })

  console.log('Test admin user created: admin@test.com / Test1234!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed to create test user:', err)
  process.exit(1)
})
