import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { UPDATE_DATE_AGGREGATION } from '@/store/pages/demand-planning/demand-planning.actions';
import {
  select_demands_loading,
  select_demandChartOptions,
  select_dateAggregation,
} from '@/store/pages/demand-planning/demand-planning.selectors';
import { DEFAULT_ECHARTS_OPTIONS } from '@/store/pages/demand-planning/demand-planning.utils';
import { ECharts } from 'echarts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cel-demand-chart',
  template: ` <section style="margin-bottom: 100px;" >
    <nz-spin nzTip="Loading..." [nzSpinning]="demandChartDataLoading | ngrxPush | defaultTo: true">
      <div
        class="chart"
        echarts
        [options]="DEFAULT_ECHARTS_OPTIONS"
        [merge]="demandChartOptions | ngrxPush | defaultTo: {}"
        (chartInit)="onChartInit($event)"
      ></div>
    </nz-spin>
    <cel-demand-table></cel-demand-table>
    <!-- Floating Buttons. It should appear last to show on top of the chart -->
    <button class="forecast-btn" routerLink="/pages/explorer/forecast">Forecast</button>
    <cel-date-aggregation-picker
      [value]="dateAgg | ngrxPush"
      (changed)="onDateAggregationChange($event)"
    ></cel-date-aggregation-picker>
  </section>`,
  styles: [
    `
      section {
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        background-color: white;
        position: relative;
        padding: 20px;
      }
      .chart {
        height: 500px;
        margin-bottom: 10px;
      }
      cel-date-aggregation-picker {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .forecast-btn {
        position: absolute;
        left: 160px;
        top: 0;
        height: 32px;
        margin: 0.8rem 0.25rem 0.25rem 0.25rem;
        font-size: 14px;
        font-family: Roboto;
        background-color: #426c9d;
        border-color: #426c9d;
        color: #ffffff;
      }
    `,
  ],
})
export class DemandChartComponent implements OnInit, OnDestroy {
  DEFAULT_ECHARTS_OPTIONS = DEFAULT_ECHARTS_OPTIONS;
  demandChartOptions = this.store.select(select_demandChartOptions);
  demandChartDataLoading = this.store.select(select_demands_loading);
  dateAgg = this.store.select(select_dateAggregation);

  echartsInstance?: ECharts;
  echartsOptionsSub?: Subscription;

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    this.echartsOptionsSub = this.demandChartOptions.subscribe(this.mergeChartOption.bind(this));
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
  // when displaying Scenarios change, charts will change
  // notMerge Optional. Whether not to merge with previous option. 
  // false by default, means merge, see more details in Component Merging Modes. 
  // If true, all of the current components will be removed and new components will be created according to the new option.
  // This mean we will overwrite DEFAULT_ECHARTS_OPTIONS
  mergeChartOption(opt: any) {
    this.echartsInstance?.setOption(opt, { replaceMerge: ['series'], silent: true, notMerge: true });
  }

  onDateAggregationChange(evt: DateAggregationOption) {
    this.store.dispatch(UPDATE_DATE_AGGREGATION({ dateAggregation: evt }));
  }
}
