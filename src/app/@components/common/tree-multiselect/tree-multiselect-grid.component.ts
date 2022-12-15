import {
  Component,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  OnInit,
  OnChanges,
} from '@angular/core';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

import { TreeNode, Data, LookupData, buildLookupTable } from './tree-multiselect.models';

/** Implicit id of the 'All' checkbox. */
const ID_ALL_CHECKBOX = '__ALL_CHECKBOX';

@Component({
  selector: 'cel-tree-multiselect-grid',
  templateUrl: './tree-multiselect-grid.component.html',
  styleUrls: ['./tree-multiselect-grid.component.scss'],
})
export class NgxTreeMultiselectGridComponent<T extends Data<string>>
  implements OnDestroy, OnInit, OnChanges
{
  // TODO: Allow non-id selected input
  // TODO: Allow non-id selected output

  @Input() hierarchy: string[] = [];
  @Input() selected: any[] = [];

  @Input() data: TreeNode<string, T>[] = [];
  @Input() selectedIds: string[] = [];
  @Input() searchPlaceholder?: string;

  /** Set to false to remove the 'All' option on the multi-select. */
  @Input() addNodeForAll = true;

  @Output() selectedIdsChange = new EventEmitter<string[]>();

  readonly selectedColumn = 'selected';
  readonly nameColumn = 'label';
  readonly allColumns = [this.selectedColumn, this.nameColumn];

  dataSource?: NbTreeGridDataSource<T>;
  lookupTable: { [key: string]: LookupData<string> } = {};
  selectedIdsSet = new Set<string>();

  constructor(private readonly dataSourceBuilder: NbTreeGridDataSourceBuilder<T>) {}

  ngOnInit() {
    this.recreateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes || 'selectedIds' in changes) {
      this.recreateData();
    }
  }

  ngOnDestroy() {
    // If ALL is selected, then emit no selectedIds. It's the same.
    if (this.selectedIdsSet.has(ID_ALL_CHECKBOX)) {
      this.selectedIdsChange.emit([]);
      return;
    }

    // Emit updated selected ids set.
    this.selectedIdsChange.emit([...this.selectedIdsSet]);
  }

  private recreateData() {
    let dataWithAll: TreeNode<string, Data<string>>[] = this.data;
    if (this.addNodeForAll) {
      dataWithAll = [{ data: { id: ID_ALL_CHECKBOX, label: 'All' } }, ...dataWithAll];
    }

    this.dataSource = this.dataSourceBuilder.create(dataWithAll);
    this.selectedIdsSet = new Set(this.selectedIds);
    this.lookupTable = buildLookupTable(ID_ALL_CHECKBOX, dataWithAll, this.selectedIdsSet);

    // If there are no selected ids, check ALL by default.
    // TODO: This might change once we can to distinguish between select none vs select all.
    if (this.selectedIds.length === 0) {
      this.onCheckedChange(ID_ALL_CHECKBOX, true);
    }
  }

  onCheckedChange(id: string, checked: boolean) {
    this.propagateChecked(id, checked);
    if (checked) {
      this.propagateCheckedParent(id);
    } else {
      this.propagateUncheckedParent(id);
    }
  }

  /**
   * Returns true if at least 1 but not all children are selected.
   * NOTE: This operation might be expensive. Optimize.
   */
  isIndeterminate(id: string): boolean {
    // Early exit if this id is in the selected set.
    if (this.selectedIdsSet.has(id)) {
      return false;
    }

    const children = this.lookupTable[id]?.children;
    // Early exit if has no children. It's not indeterminate.
    if (!children || !children.length) {
      return false;
    }
    // Get number of selected children.
    const selected = children.filter((id) => this.selectedIdsSet.has(id));
    // Return true if there's at least 1 selected, but not all.
    if (selected.length > 0 && selected.length !== children.length) {
      return true;
    }
    // Return true if at least 1 child is indeterminate. Might be freaking expensive.
    return children.some((id) => this.isIndeterminate(id));
  }

  /** Recursively propagate checked state to current node and its children. */
  private propagateChecked(id: string, checked: boolean) {
    // Update selected ids set.
    if (checked) {
      this.selectedIdsSet.add(id);
    } else {
      this.selectedIdsSet.delete(id);
    }

    // Special clause if the selected id is ID_ALL, which will toggle all parent nodes.
    if (id === ID_ALL_CHECKBOX) {
      this.data
        .map((node) => node.data.id)
        .forEach((rootId) => this.propagateChecked(rootId, checked));
      return;
    }

    // Check if has children in the lookup table and update those too.
    (this.lookupTable[id]?.children || []).forEach((child) =>
      this.propagateChecked(child, checked),
    );
  }

  /** Recursively propagate unchcked state to current node and its parents. */
  private propagateUncheckedParent(id: string) {
    this.selectedIdsSet.delete(id);
    const parentId = this.lookupTable[id]?.parent;
    if (parentId) {
      this.propagateUncheckedParent(parentId);
    }
  }

  /** Recursively propagate checked state to parent node if all children are checked. */
  private propagateCheckedParent(id: string) {
    const parentId = this.lookupTable[id]?.parent;

    // Early exit if parent is empty or is ALL.
    if (!parentId || parentId === ID_ALL_CHECKBOX) {
      return;
    }

    // Early exit if parents are already checked.
    if (this.selectedIdsSet.has(parentId)) {
      return;
    }

    // If all children are checked, then mark parent as checked too.
    const children = this.lookupTable[parentId]?.children || [];
    if (children.every((id) => this.selectedIdsSet.has(id))) {
      this.selectedIdsSet.add(parentId);
    }

    // Go upwards.
    this.propagateCheckedParent(parentId);
  }
}
