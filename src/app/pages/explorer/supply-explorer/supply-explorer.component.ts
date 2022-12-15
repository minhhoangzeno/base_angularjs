import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '@/environments/environment';
import { ENSURE_NO_SCENARIO_IS_EDITING } from '@/store/pages/supply-explorer/supply-explorer.actions';
import { select_suppyChartParams } from '@/store/pages/supply-explorer/supply-explorer.selectors';

@Component({
  selector: 'cel-supply-explorer',
  templateUrl: './supply-explorer.component.html',
  styleUrls: ['./supply-explorer.component.scss'],
})
export class SupplyExplorerComponent implements OnInit {
  commonParamsObs = this.store.select(select_suppyChartParams);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ENSURE_NO_SCENARIO_IS_EDITING());
  }

  srcs = {
    planning: `${environment.rApiUrl}/postRProductionOutputChart`,
    sankey: `${environment.rApiUrl}/postRSankeyChart`,
    inventory: `${environment.rApiUrl}/postRInventoryChart`,
  };
}
