/**
 * @description
 * Mock for `payload` package used in Storybook builds.
 * Payload's server-side code uses Node.js built-ins (URL, fs, etc.)
 * that Vite's browser bundle cannot resolve.
 *
 * @notes
 * - Exports stubs for commonly used Payload functions/types
 * - Stories that need Payload data use fetch mocks instead
 */

// Stub for getPayload — server-only, never called in stories
export const getPayload = async () => ({
  find: async () => ({ docs: [], totalDocs: 0, totalPages: 0, page: 1 }),
  findGlobal: async () => ({}),
  findByID: async () => ({}),
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({}),
})

export default {} as any
