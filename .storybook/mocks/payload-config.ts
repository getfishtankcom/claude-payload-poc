/**
 * @description
 * Mock for @payload-config used in Storybook builds.
 * Prevents Vite from failing on this Payload-specific path alias
 * that only resolves in the Next.js/Payload runtime.
 *
 * @notes
 * - This is a no-op mock — stories that need Payload data use fetch mocks instead
 */
export default {} as any
