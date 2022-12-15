import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';

@Component({
  selector: 'cel-date-aggregation-picker',
  template: `<div *ngrxLet="value as selected">
    <button
      *ngFor="let aggregation of dateAggregationLabels"
      [ngClass]="{ selected: aggregation === selected }"
      (click)="onDateAggregationChange(aggregation)"
    >
      {{ aggregation }}
    </button>
  </div>`,
  styles: [
    `
      div {
        display: flex;
      }
      button {
        width: 40px;
        height: 11px;
        font-family: simcel-Bw-Mitga;
        font-style: normal;
        font-weight: normal;
        font-size: 9px;
        line-height: 11px;
        text-transform: uppercase;
        color: #686868;
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #686868;
        padding: 0px;
        background-color: white;
        @media (max-width:1025px){
          width:26px;
        }
        &.selected {
          border-bottom-color: #d24a43;
          color: #d24a43;
        }
      }
    `,
  ],
})
export class DateAggregationPicker {
  @Input() value? = DateAggregationOption.WEEK;
  @Output() changed = new EventEmitter<DateAggregationOption>();

  readonly dateAggregationLabels = [
    DateAggregationOption.DAY,
    DateAggregationOption.WEEK,
    DateAggregationOption.MONTH,
    DateAggregationOption.YEAR,
  ];

  constructor(private readonly store: Store) {}

  onDateAggregationChange(evt: DateAggregationOption) {
    if (this.value !== evt) this.changed.emit(evt);
  }
}
