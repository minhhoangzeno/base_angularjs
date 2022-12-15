import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { WidgetType } from '@/app/@components/business/planning-segment/widget-management.component';
import { ENSURE_NO_SCENARIO_IS_EDITING } from '@/store/pages/planning-explorer/planning-explorer.actions';
import { select_selectedWidgets } from '@/store/widget/widget.selectors';

@Component({
  selector: 'cel-planning-explorer',
  template: `
    <div *ngrxLet="this.selectedWidgets as sw">
      <cel-planning-kpis *ngIf="sw.includes(WidgetType.KPI_TABLE)"></cel-planning-kpis>
      <cel-planning-breakdown *ngIf="sw.includes(WidgetType.PNL_CHART)"></cel-planning-breakdown>
      <cel-planning-timeseries
        *ngIf="sw.includes(WidgetType.SALES_CHART)"
      ></cel-planning-timeseries>
    </div>
  `,
})
export class PlanningExplorerComponent implements OnInit {
  selectedWidgets = this.store.select(select_selectedWidgets);

  readonly WidgetType = WidgetType;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ENSURE_NO_SCENARIO_IS_EDITING());
  }
}
