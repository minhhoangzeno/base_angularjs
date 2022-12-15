import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NbGetters,
  NbPopoverDirective,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import { SegmentFilter } from '../../../@core/interfaces/business/segment';
import { Graph, Setting, Vertex } from './graph';

@Component({
  selector: 'cel-select-tree',
  templateUrl: './select-tree.component.html',
  styleUrls: ['./select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTreeComponent {
  source?: NbTreeGridDataSource<Vertex>;
  preview = '';
  graph = new Graph();
  private _filter: SegmentFilter[] = [];

  @Input() placeholder = '';
  @Input() set settings(settings: Setting[]) {
    if (!settings) {
      return;
    }
    let prev = '';
    for (let i = 0; i < settings.length; i++) {
      const s = settings[i];
      const t = settings[i + 1];
      if (!s.outset && t) {
        s.outset = [t.type];
      }
      if (!s.key) {
        s.key = `${prev}:${s.type}`;
        prev = s.key;
      }
    }
    this.graph.settings = settings;
  }

  @Input() set data(data: any[]) {
    if (data.length < 1) {
      return;
    }
    this.graph.build(data);
    const entries = [...this.graph.getEntries()];
    this.source = this.dataSourceBuilder.create(entries, this.getters);
    this.refresh();
  }

  @Input() set filters(filters: SegmentFilter[]) {
    this._filter = filters || [];
    this.refresh();
  }

  @Input() showExpandIndicator = false;

  @Output() filtersChange = new EventEmitter();

  @ViewChild(NbPopoverDirective) set popover(p: NbPopoverDirective) {
    const s = p.nbPopoverShowStateChange.subscribe((state) => {
      s.unsubscribe();
      if (!state.isShown) {
        // emit change on popup closed
        this.emitChange();
      }
    });
  }

  private readonly getters: NbGetters<Vertex, Vertex> = {
    dataGetter: (node: Vertex) => node,
    childrenGetter: (node: Vertex) => {
      return [...this.graph.getNeighbour(node)];
    },
    expandedGetter: (node: Vertex) => !!node.expanded,
  };

  constructor(private readonly dataSourceBuilder: NbTreeGridDataSourceBuilder<Vertex>) {}

  onChanged(vertex: Vertex, selected: boolean) {
    vertex.updateSelect(selected);
  }

  emitChange() {
    const filters = this.graph.compact();
    this.filtersChange.emit(filters);
  }

  refresh() {
    const filters = this._filter;
    this.graph.applyFilters(filters);
    const strs: string[][] = [];
    for (const filter of filters) {
      const s = Object.values(filter).map((v) => v.join(','));
      strs.push(s);
    }
    this.placeholder = strs.join(';');
  }

  selectAll() {
    this.graph.getEntries().forEach(e => e.updateSelect(true)); 
  }

  deselectAll() {
    this.graph.getEntries().forEach(e => e.updateSelect(false)); 
  }
}
