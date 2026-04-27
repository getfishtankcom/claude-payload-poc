/**
 * @description
 * Barrel export for the preview renderers module.
 *
 * @dependencies
 * - PreviewRenderer: main dispatch component + registry
 *
 * @notes
 * - Import PreviewRenderer for rendering any component type preview
 * - Import ComponentPreviewProps for typing custom renderers
 * - Import previewRegistry for direct renderer lookup
 */
export { PreviewRenderer, previewRegistry } from './PreviewRenderer'
export type { ComponentPreviewProps } from './PreviewRenderer'
