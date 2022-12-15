/** Minimum format of the input data. */
export interface Data<T> {
  id: T;
  label: string;
  selected?: boolean;
}

/** Tree node compatible with internal struct used by nb-tree-grid. */
export interface TreeNode<K, T extends Data<K>> {
  data: T;
  children?: TreeNode<K, T>[];
  expanded?: boolean;
  level?: number;
}

/** Internal-only representation of a TreeNode for quick lookup of parent and children. */
export interface LookupData<T> {
  id: T;
  label: string;
  parent?: T;
  children?: T[];
}

/** Creates a lookup table with Data.id as key and a translated LookupData as value. */
export function buildLookupTable<T extends Data<string>>(
  parentId: string,
  nodes: TreeNode<string, T>[],
  selectedIds: Set<string>,
): { [key: string]: LookupData<string> } {
  if (!nodes) {
    return {};
  }

  let table: { [key: string]: LookupData<string> } = {};

  // Iterate through all nodes to collect lookup data entries.
  for (const node of nodes) {
    const children = node.children || [];

    // Create table entry for current node.
    table[node.data.id] = {
      id: node.data.id,
      label: node.data.label,
      // Prevent infinite recursion by exluding assign to node with same id as parentId.
      parent: node.data.id === parentId ? undefined : parentId,
      children: children.map((v) => v.data.id),
    };

    // Merge current table with table built from children of current node.
    table = {
      ...table,
      ...buildLookupTable(node.data.id, children, selectedIds),
    };
  }

  return table;
}
