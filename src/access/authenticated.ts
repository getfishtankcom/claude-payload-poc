/**
 * @description
 * Access control: require authenticated user.
 * Used for write access and admin-only operations.
 *
 * @notes
 * - From Payload website template pattern
 * - Use for: create/update/delete on all content collections
 */
import type { AccessArgs } from 'payload'

type IsAuthenticated = (args: AccessArgs) => boolean

export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
