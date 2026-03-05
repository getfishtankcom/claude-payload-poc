/**
 * @description
 * Deep merge utility for objects. Used by the link field
 * to merge overrides into default field configurations.
 *
 * @notes
 * - From Payload website template
 * - Only merges plain objects — arrays are replaced, not concatenated
 */

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

export function deepMerge<T extends Record<string, unknown>, R extends Record<string, unknown>>(
  target: T,
  source: R,
): T & R {
  const output = { ...target } as Record<string, unknown>

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          )
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output as T & R
}
