import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { WidgetType } from '../../../@components/business/planning-segment/widget-management.component';
import { select_selectedWidgets } from '@/store/widget/widget.selectors';

@Component({
  selector: 'cel-demand-planning',
  template: `
    <div *ngrxLet="selectedWidgets as w">
      <cel-demand-chart *ngIf="w.includes(WidgetType.DEMAND_CHART)"></cel-demand-chart>
    </div>
  `,
})
export class DemandPlanningComponent {
  readonly WidgetType = WidgetType;

  selectedWidgets = this.store.select(select_selectedWidgets);

  constructor(private readonly store: Store) {}
}
