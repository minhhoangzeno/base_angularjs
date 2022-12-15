import { Data, TreeNode } from '../../common/tree-multiselect/tree-multiselect.models';

/**
 * Create a function that can transform a given input into an id, based on an initial
 * list of properties to be used as an id.
 *
 * Useful when mapping structs into a map whose keys can only be a string.
 *
 * For example,
 *
 *  ```
 *  const selector = buildIdSelector(['name', 'age']);
 *  const input = { 'name': 'ABC', 'age': 23, 'nickname': 'abc' };
 *  console.log(selector(input)) // outputs 'ABC-23'
 *  ```
 */
export function buildIdSelector<T>(hierarchy: string[]) {
  return (data: T, level?: number): string => {
    if (!data) {
      return '';
    }

    if (level !== undefined) {
      return hierarchy
        .slice(0, level + 1)
        .filter((prop) => !!data[prop])
        .map((prop) => `[${data[prop]}]`)
        .join(':');
    }

    return hierarchy
      .filter(Boolean)
      .filter((prop) => !!data[prop])
      .map((prop) => `[${data[prop]}]`)
      .join(':');
  };
}

/** Given a list of objects, convert them to ids based on the input hierarchy. */
export function mapToIdsOnly<T>(targets: T[], hierarchy: string[]): string[] {
  const selector = buildIdSelector(hierarchy);
  return (targets || []).map((target) => selector(target));
}

/** Creates a function that can pick property values based on hierarchy. */
function buildLabelSelector<T>(hierarchy: string[]) {
  return (data: T, level: number) => data[hierarchy[level]];
}

/**
 * Given a list of objects and a hierarchy, build a tree structure that can be inputted
 * on a tree grid component.
 */
export function buildNodeTreeArray<T>(targets: T[], hierarchy: string[]) {
  // Early exit on empty tagets.
  if (!targets) {
    return null;
  }

  const idSelector = buildIdSelector(hierarchy);
  const labelSelector = buildLabelSelector(hierarchy);

  // Marked as any for now since type checker is screwing up.
  const table: { [key: string]: TreeNode<string, any> } = {};
  const rootKeys: string[] = [];

  targets.forEach((target) => {
    hierarchy.forEach((_, level) => {
      // Calculate id and name selector.
      const label = labelSelector(target, level);
      const key = idSelector(target, level);
      if (key in table) {
        return;
      }

      if (level < hierarchy.length - 1) {
        // Branch clause.
        const data = hierarchy
          .slice(0, level + 1)
          .reduce((acc, curr) => ({ ...acc, [curr]: target[curr] }), {} as Data<string>);
        table[key] = {
          data: {
            ...data,
            id: key,
            label,
            facilityRefs: (target as any).facilityRefs,
            productIds: (target as any).productIds,
          },
        };
      } else {
        // Leaf clause.
        table[key] = {
          data: {
            ...target,
            id: key,
            label,
            facilityRefs: (target as any).facilityRefs,
            productIds: (target as any).productIds,
          },
        };
      }

      // Collect as root keys (if root) or update parent to add current target as child.
      if (level === 0) {
        rootKeys.push(key);
      } else {
        const parentKey = idSelector(target, level - 1);
        table[parentKey].children = [...(table[parentKey].children || []), table[key]];
      }
    });
  });

  /** Return all root key entries in the lookup table. */
  return {
    data: rootKeys.map((key) => table[key]),
    lookup: table,
  };
}

// Checks if list a has the same exact values as list b.
export function isSameSet<T>(a: T[], b: T[]) {
  const sa = new Set(a);
  const sb = new Set(b);

  // Early exit if set sizes aren't the same.
  if (sa.size !== sb.size) {
    return false;
  }

  // Return true if all values in set a is also in set b.
  return [...sa].every((value) => sb.has(value));
}
