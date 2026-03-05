/**
 * @description
 * Access control: allow anyone (public access).
 * Used for read access on published content collections.
 *
 * @notes
 * - From Payload website template pattern
 * - Use for: pages, news, projects, resources (read)
 */
import type { Access } from 'payload'

export const anyone: Access = () => true
