import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PLACEHOLDER_ACTUAL_ID } from '@/app/pages/explorer/shared/explorer.utils';
import {
  select_displayingScenarioIds,
  select_displayingScenarios,
  select_highlightedScenario,
} from '@/store/scenario/scenario.selectors';
import { select_selectedSegment } from '../layout/layout.baseSelectors';
import { IGetKpisParams, IGetSpChartDataParams } from '@/app/@core/services/kpis.service';
import { select_selectedDateRange, select_selectedPlan } from '../layout/layout.selectors';
import { IBizPageState, PAGE__BIZ_STATE_KEY } from './planning-explorer.state';
import {
  createWaterfallSeries,
  createWaterfallSeriesData,
  seriesPairFormatterFactory,
} from '@/app/pages/explorer/planning-explorer/widgets/breakdown/breakdown.utils';
import { BREAKDOWN_KPIS_INFO, calculateCbm } from '@/app/@core/interfaces/business/breakdown';
import { PNL_EVOLUTION_KPIS } from '@/app/pages/explorer/planning-explorer/widgets/breakdown/breakdown.constants';
import { EChartsOption, LineSeriesOption } from 'echarts';
import { seriesPairFormatterFactory_v2 } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.utils';
import {
  COLOR_HISTORICAL,
  COLOR_CURRENT,
} from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import {
  calculateDataArea,
  formatByDateAggregationGen,
} from '../demand-planning/demand-planning.utils';
import { select_plansetting } from '@/store/plan-setting/planSetting.selectors';
import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import { nullAcceptedWithSelectedPlan } from '@/utils/numbers';
import { select_selectedWorkspace } from '@/store/workspace/workspace.selectors';

const selectFeature = createFeatureSelector<IBizPageState>(PAGE__BIZ_STATE_KEY);

export const select_spChartDateAgg = createSelector(
  selectFeature,
  (state) => state.spChart_dateAgg,
);
export const select_spChart = createSelector(selectFeature, (state) => state.spChart);
export const select_spChart_loading = createSelector(
  selectFeature,
  (state) => state.spChart_loading,
);
export const select_kpis = createSelector(selectFeature, (state) => state.kpis);
export const select_kpis_loading = createSelector(selectFeature, (state) => state.kpis_loading);

export const select_breakdownChartOptions = createSelector(
  select_kpis,
  select_displayingScenarios,
  select_highlightedScenario,
  (kpis, displayingScenarios, highlighted): EChartsOption | undefined => {
    if (!kpis) return;
    const series: any[] = displayingScenarios
      .map((s) =>
        createWaterfallSeries(
          s,
          kpis[s.id],
          kpis[PLACEHOLDER_ACTUAL_ID],
          s.color || '#0C80EB',
          s.id === highlighted?.id,
        ),
      )
      .reduce((prev, curr) => [...prev, ...curr], []);

    const highlightedSeriesData = createWaterfallSeriesData(
      highlighted,
      kpis[highlighted?.id || ''],
      kpis[PLACEHOLDER_ACTUAL_ID],
    );
    const tooltipFormatter = seriesPairFormatterFactory(
      highlighted?.name,
      highlightedSeriesData,
      PNL_EVOLUTION_KPIS.map((name) => BREAKDOWN_KPIS_INFO[name]?.type),
    );

    return {
      tooltip: { formatter: (p: any) => tooltipFormatter(p) },
      series: series,
    };
  },
);

export const select_spChartOptions = createSelector(
  select_spChart,
  select_spChartDateAgg,
  select_displayingScenarios,
  select_highlightedScenario,
  select_selectedPlan,
  select_selectedWorkspace,
  (
    spChartData,
    spChartDateAgg,
    displayingScenarios,
    highlightedScenario,
    selectedPlan,
    selectedWorkspace,
  ): EChartsOption | undefined => {
    if (!spChartData || !selectedPlan || !selectedWorkspace) return undefined;

    const marks = calculateDataArea(spChartData);
    const colorLookup = {
      actual: COLOR_HISTORICAL,
      current: COLOR_CURRENT,
      ...Object.fromEntries(displayingScenarios.map((s) => [s.id, s.color || '#0C80EB'])),
    };

    const colFormatter = formatByDateAggregationGen(spChartDateAgg);
    const tooltipFormatter = seriesPairFormatterFactory_v2(
      highlightedScenario?.id,
      true,
      (s) => colFormatter(s),
      (s) => (s || '').split('|')[0],
    );
    // we will overwrite echarts option
    return {
      
      tooltip: { formatter: tooltipFormatter, trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#d1d1d1' },
      xAxis: {
        axisLabel: { formatter: colFormatter }, data: spChartData.columns,
        type: 'category',
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: spChartData.rows.flatMap(([id, data]) => [
        <LineSeriesOption>{
          id: id + '|netSalesValue',
          name: 'Net Sales Value',
          markArea: marks[id] || marks.future,
          data: data.map((d, index) => d?.netSalesValue ? d.netSalesValue : nullAcceptedWithSelectedPlan(id, selectedPlan, selectedWorkspace, spChartData.columns[index])),
          ...genBasicLineSeriesOptions(colorLookup[id], 'solid', id === highlightedScenario?.id),
          type:'line'
        },
        <LineSeriesOption>{
          id: id + '|cbm',
          name: 'Profit Before Marketing',
          markArea: marks[id] || marks.future,
          data: data.map((d, index) => calculateCbm(d) ? calculateCbm(d) : nullAcceptedWithSelectedPlan(id, selectedPlan, selectedWorkspace, spChartData.columns[index])),
          ...genBasicLineSeriesOptions(colorLookup[id], 'dotted', id === highlightedScenario?.id),
          type:'line'
        },
       
      ]),
      title: {
        text: 'Sales & Profit Evolution',
        textStyle: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontFamily: 'simcel-Bw-Mitga',
          fontSize: 12,
          lineHeight: 19,
          color: '#686868',
        },
        top: -5
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (s) => transformInputToKpiFormat(s),
          fontFamily: 'simcel-Bw-Mitga',
          align: 'right',
          color: '#484848',
          showMinLabel: false,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      textStyle: { color: '#6a6a6a', fontSize: 10 },
      legend: { itemHeight: 0, textStyle: { color: '#686868', fontFamily: 'simcel-Bw-Mitga' } },
      grid: { show: true, left: '10px', right: '10px', bottom: '10px', containLabel: true }
      
    };
  },
);

export const select_params_loadKpisData = createSelector(
  select_selectedPlan,
  select_displayingScenarioIds,
  select_selectedDateRange,
  select_selectedSegment,
  (
    selectedPlan,
    displayingScenarioIds,
    selectedDateRange,
    selectedSegment,
  ): IGetKpisParams | undefined => {
    if (!selectedPlan) return;

    return {
      planId: selectedPlan.id,
      scenarios: displayingScenarioIds,
      dateRange: selectedDateRange,
      segment: selectedSegment,
    };
  },
);
export const select_params_loadSpChartData = createSelector(
  select_params_loadKpisData,
  select_spChartDateAgg,
  (params_loadKpisData, spChartDateAgg): IGetSpChartDataParams | undefined => {
    if (!params_loadKpisData) return;
    return {
      ...params_loadKpisData,
      interval: spChartDateAgg,
    };
  },
);

function genBasicLineSeriesOptions(
  color: string,
  type: 'solid' | 'dotted',
  isHighlight: boolean,
): LineSeriesOption {
  // use straight lines instead of curved lines
  return {
    type: 'line',
    // smooth: true,
    symbol: 'none',
    showAllSymbol: true,
    itemStyle: { borderWidth: 1, borderColor: color, color },
    lineStyle: { width: isHighlight ? 4 : 1, type, color },
    emphasis: { disabled: true },
    symbolSize: 8,
    
  };
}
