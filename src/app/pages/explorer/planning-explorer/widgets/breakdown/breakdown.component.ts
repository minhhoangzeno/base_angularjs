import { Component } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { BREAKDOWN_OPTIONS_BASE } from './breakdown.constants';
import {
  select_breakdownChartOptions,
  select_kpis_loading,
} from '@/store/pages/planning-explorer/planning-explorer.selector';
import { select_displayingScenarios } from '@/store/scenario/scenario.selectors';

@Component({
  selector: 'cel-planning-breakdown',
  styleUrls: ['./breakdown.component.scss'],
  templateUrl: './breakdown.component.html',
})
export class BreakdownComponent {
  displayingScenarios = this.store.select(select_displayingScenarios);
  loading = this.store.select(select_kpis_loading);
  optionsMerge = this.store.select(select_breakdownChartOptions);

  readonly options: EChartsOption = BREAKDOWN_OPTIONS_BASE;
  echartsInstance?: ECharts;
  echartsOptionsSub?: Subscription;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.echartsOptionsSub = this.optionsMerge.subscribe(this.mergeChartOption.bind(this));
  }
  ngOnDestroy(): void {
    this.echartsOptionsSub?.unsubscribe();
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  /**
   * Apply custom merge to maximize peformance
   * https://echarts.apache.org/en/api.html#echartsInstance.setOption
   */
  mergeChartOption(opt: any) {
    this.echartsInstance?.setOption(opt, { replaceMerge: ['series'], silent: true });
  }
}
