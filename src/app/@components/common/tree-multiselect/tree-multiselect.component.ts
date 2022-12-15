import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NgxTreeMultiselectGridComponent } from './tree-multiselect-grid.component';
import { TreeNode, buildLookupTable, LookupData } from './tree-multiselect.models';
import { NbPopoverDirective } from '@nebular/theme';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cel-tree-multiselect',
  templateUrl: './tree-multiselect.component.html',
  styleUrls: ['./tree-multiselect.component.scss'],
})
export class CelTreeMultiselectComponent implements OnChanges, OnDestroy, AfterViewInit {
  /** Reference to popover, filled on after view init step. */
  @ViewChild(NbPopoverDirective) popover!: NbPopoverDirective;

  /** List of hierarchy to determine how to parse input data. */
  @Input() hierarchy: string[] = [];
  /** List of nodes that can be selected. */
  @Input() nodes: TreeNode<string, any>[] = [];
  /** List of objects that are selected. */
  @Input() selected: any[] = [];

  /** --- Legacy fields. */
  @Input() data: TreeNode<string, any>[] = [];
  @Input() selectedIds: string[] = [];
  @Input() placeholder = '';
  @Input() searchPlaceholder?: string;

  /** Emits if selectd ids change. */
  @Output() selectedIdsChange = new EventEmitter<string[]>();

  /** Component to show in popover. */
  readonly component = NgxTreeMultiselectGridComponent;

  lookupTable: { [key: string]: LookupData<string> } = {};
  previewSelection = '';

  /** Unsubscribe marker. */
  private readonly unsubscribe = new ReplaySubject<boolean>(1);

  constructor() {
    this.selectedIdsChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.onSelectedIdsChange.bind(this));
  }

  ngAfterViewInit() {
    this.rebuildContext();
    // Hack until we source our selected id from Input().
    setTimeout(() => this.onSelectedIdsChange(this.selectedIds));
  }

  ngOnChanges() {
    this.rebuildContext();
    this.onSelectedIdsChange(this.selectedIds);
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  private onSelectedIdsChange(selectedIds: string[]) {
    this.selectedIds = selectedIds;
    // Update preview text.
    this.previewSelection = this.selectedIds.map((id) => this.lookupTable[id]?.label).join(',');
    // Rebuild context.
    // this.rebuildContext();
  }

  private rebuildContext() {
    // Build lookup table.
    this.lookupTable = buildLookupTable('', this.data, new Set(this.selectedIds));

    // Skip if popover isn't defined yet.
    if (!this.popover) {
      return;
    }

    // Build context to be passed to popover.
    this.popover.context = {
      data: this.data,
      selectedIds: this.selectedIds,
      searchPlaceholder: this.searchPlaceholder,
      selectedIdsChange: this.selectedIdsChange,
      hierarchy: this.hierarchy,
    };

    // Rebuild popover.
    this.popover.rebuild();
  }
}
