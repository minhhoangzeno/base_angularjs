export namespace TreeList {
  export interface ITreeNode {
    key: string;
    label: string;
    data: Array<number | null>;
    // Additional stateful data
    level?: number;
    expand?: boolean;
    parent?: ITreeNode;
    children?: ITreeNode[];
  }

  export function convert(root: ITreeNode): ITreeNode[] {
    const stack: ITreeNode[] = [];
    const array: ITreeNode[] = [];
    const hashMap: Record<string, boolean> = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      visitNode(node, hashMap, array);
      if (node.children?.length) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  export function collapse(array: ITreeNode[], data: ITreeNode, $event: boolean): void {
    if (!$event) {
      if (data.children?.length) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
          target.expand = false;
          collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  function visitNode(node: ITreeNode, hashMap: Record<string, boolean>, array: ITreeNode[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
}
