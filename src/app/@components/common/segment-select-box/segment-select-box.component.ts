import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Segment, SegmentFilter } from '../../../@core/interfaces/business/segment';

interface Option {
  type: string;
  value: string;
}

// function GroupBy<T>(data: IterableIterator<T>, field: string) {
//   const map = new Map<string, Set<T>>();
//   for (const v of data) {
//     const k = v[field];
//     if (!map.has(k)) {
//       map.set(k, new Set());
//     }
//     map.get(k).add(v);
//   }
//   return map;
// }

export interface SegmentAdapter {
  search(term: string, entity: string): Observable<Option[]>;
  count?(segment: Segment): Observable<any>;
}

@Component({
  selector: 'cel-segment-select-box',
  templateUrl: './segment-select-box.component.html',
  styleUrls: ['./segment-select-box.component.scss'],
})
export class SegmentSelectBoxComponent {
  constructor(private readonly domSanitizer: DomSanitizer) {}

  count = {
    product: 0,
    customer: 0,
  };

  segment: Segment = {};

  @Input() adapter: SegmentAdapter = {
    search: () => of([]),
    count: () => of({}),
  };

  @Input() eventDetail?:any

  @Input() set value(s: Segment | undefined) {
    if (!s) return;
    // clone the object
    this.segment = s;
    this.segment.customer = s.customer || [{}];
    this.segment.product = s.product || [{}];
    this.segment.location = s.location || [{}];
  }

  @Output() valueChanged = new EventEmitter<Segment>();

  addFilter(filters?: SegmentFilter[]) {
    if (!filters) return;
    const firstFilterEmpty = filters.length > 0 && Object.keys(filters[0]).length < 1;
    if (!firstFilterEmpty) {
      filters.unshift({});
    }
  }

  updateFilter(filters: SegmentFilter[] | undefined, option: Option, index: number) {
    if (!filters) return;
    const filter = filters[index];
    const { type, value } = option;
    if (!Array.isArray(filter[type])) {
      filter[type] = [value];
    } else if (!filter[type].includes(value)) {
      filter[type].push(value);
    }
    filters[index] = filter;
    this.emitChange();
  }

  deleteFilter(filters: SegmentFilter[] | undefined, index: number) {
    if (!filters) return;
    filters.splice(index, 1);
    if (filters.length < 1) {
      filters.push({});
    }
    this.emitChange();
  }

  preview(filter: SegmentFilter) {
    const s = Object.entries(filter)
      .map(([k, v]) => {
        const key = this.fieldToText[k] || k;
        const value = v.join(',');
        return `<strong>${key}</strong>: ${value}`;
      })
      .join(' / ');
    return this.domSanitizer.bypassSecurityTrustHtml(s);
  }

  emitChange() {
    this.valueChanged.emit(this.segment);
  }

  private readonly fieldToText = {
    name: 'Name',
    channel: 'Channel',
    subChannel: 'Subchannel',
    keyAccount: 'Key Account',
    country: 'Country',
    region: 'Region',
    city: 'City',
    category: 'Category',
    subCategory: 'Subcategory',
    brands: 'Brand',
    productRange: 'Product Range',
  };
}
