import { Component, OnInit, OnDestroy } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';

import { DateAggregationOption, PL_CHART_OPTIONS_BASE } from './timeseries.constants';
import { Store } from '@ngrx/store';
import {
  select_spChartDateAgg,
  select_spChartOptions,
  select_spChart_loading,
} from '@/store/pages/planning-explorer/planning-explorer.selector';
import { UPDATE_SP_CHART_DATE_AGG } from '@/store/pages/planning-explorer/planning-explorer.actions';
import {
  select_displayingScenarios,
  select_highlightedScenario,
} from '@/store/scenario/scenario.selectors';

/** Format of the parameters emitted when zooming in/out from the timeseries chart. */
export interface DataZoomEvent {
  startTime: number;
  endTime: number;
}

@Component({
  selector: 'cel-planning-timeseries',
  styleUrls: ['./timeseries.component.scss'],
  templateUrl: './timeseries.component.html',
})
export class TimeseriesComponent implements OnInit, OnDestroy {
  loading = this.store.select(select_spChart_loading);
  chartOptions = this.store.select(select_spChartOptions);
  highlighted = this.store.select(select_highlightedScenario);
  scenarios = this.store.select(select_displayingScenarios);
  dateAgg = this.store.select(select_spChartDateAgg);

  /** Echarts options. */
  readonly options = PL_CHART_OPTIONS_BASE;
  optionsMerge: EChartsOption = {};

  /** Expose constants and type declaration to template. */
  readonly dateAggregationLabels = [
    DateAggregationOption.DAY,
    DateAggregationOption.WEEK,
    DateAggregationOption.MONTH,
    DateAggregationOption.YEAR,
  ];
  echartsOptionsSub?: Subscription;
  echartsInstance?: ECharts;

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    this.echartsOptionsSub = this.chartOptions.subscribe(this.mergeChartOption.bind(this));
  }
  ngOnDestroy(): void {
    this.echartsOptionsSub?.unsubscribe();
  }

  /** Triggers when the user changes time slice. */
  async updateDateAggregation(dateAggregation: DateAggregationOption) {
    this.store.dispatch(UPDATE_SP_CHART_DATE_AGG({ option: dateAggregation }));
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  /**
   * Apply custom merge to maximize peformance
   * https://echarts.apache.org/en/api.html#echartsInstance.setOption
   */
  // same as demand-chart .
  mergeChartOption(opt: any) {
    this.echartsInstance?.setOption(opt, { replaceMerge: ['series'], notMerge: true, silent: true, });
  }
}
