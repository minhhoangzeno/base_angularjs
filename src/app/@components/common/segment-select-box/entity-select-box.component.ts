import { Component, Input, Output, EventEmitter } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';
import { SegmentAdapter } from './segment-select-box.component';

interface Option {
  type: string;
  value: string;
}

@Component({
  selector: 'cel-entity-select-box',
  templateUrl: './entity-select-box.component.html',
  styleUrls: ['./entity-select-box.component.scss'],
})
export class EntitySelectBoxComponent {
  options: Option[] = [];

  @Input() adapter: SegmentAdapter = {
    search: (_term: string, _entity: string) => of([]),
  };

  @Input() entity = '';

  @Output() update = new EventEmitter<Option>();
  @Output() add = new EventEmitter<void>();

  async search(term: string) {
    try {
      this.options = await lastValueFrom(this.adapter.search(term, this.entity));
    } catch (e) {
      console.log(e);
    }
  }

  onSelect(option: Option) {
    this.update.next(option);
  }

  addNewSearch() {
    this.add.next();
  }
}
