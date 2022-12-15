/**
 * Creates a new object that merges all the given input objects. This function only deep merges objects.
 * If it encounters a prop of array type (or any other type), it falls back to simple assignment.
 *
 * Note that this is a very naive implementation of a deep merge.
 *  - If a prop is an object, we do another deep merge
 *  - If a prop is not an object, we just directly
 *
 * TODO(nathaniel): Add test to confirm behavior.
 */
export function deepAssign<T extends Record<string, unknown>>(...objects: T[]): T {
  const base: any = {};

  objects.forEach((object) => {
    Object.entries(object).forEach(([prop, value]) => {
      // If target isn't the same type as source or if the source isn't an object, assign and bail.
      if (typeof value !== typeof base[prop] || typeof value !== 'object') {
        base[prop] = value;
        return;
      }
      // Otherwise, do another level of deep assignment.
      base[prop] = deepAssign(base[prop], value);
    });
  });

  return base;
}
