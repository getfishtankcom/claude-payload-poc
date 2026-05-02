/**
 * @description
 * DOM availability check. Returns true when running in a browser context.
 * Used to guard client-only code in universal/isomorphic contexts.
 *
 * @notes
 * - From Payload website template
 */
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
