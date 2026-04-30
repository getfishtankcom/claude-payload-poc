import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })
  const users = await payload.find({ collection: 'users', limit: 10 })
  console.log('Existing users:', users.docs.map((u: any) => u.email))
  for (const u of users.docs) {
    await payload.delete({ collection: 'users', id: u.id })
  }
  await payload.create({
    collection: 'users',
    data: { email: 'test@test.com', password: 'Test1234!' } as any
  })
  console.log('Created: test@test.com / Test1234!')
  process.exit(0)
}
main().catch(e => { console.error(e.message); process.exit(1) })
