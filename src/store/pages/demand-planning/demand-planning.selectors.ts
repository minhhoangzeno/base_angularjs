import { createSelector, createFeatureSelector } from '@ngrx/store';
import { color, EChartsOption } from 'echarts';
import { pick } from 'rambda';

import { IDemandPlanningPageState, PAGE__DEMAND_PLANNING_STATE_KEY } from './demand-planning.state';
import {
  select_displayingScenarios,
  select_highlightedScenario,
  select_legacy_actualAndCommittedScenarios,
} from '@/store/scenario/scenario.selectors';
import { environment } from '@/environments/environment';
import { select_selectedDateRange, select_selectedPlan } from '../layout/layout.selectors';
import { select_selectedSegment } from '../layout/layout.baseSelectors';
import {
  COLOR_CURRENT,
  COLOR_HISTORICAL,
} from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { seriesPairFormatterFactory_v2 } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.utils';
import {
  IGetDemandImpactsChartDataParams,
  IGetDemandsChartDataParams,
} from '@/app/@core/entity/demand.service';
import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import { nullAcceptedWithSelectedPlan, sumIfHaveValue } from '@/utils/numbers';
import { IDemandChartResponse, IDemandTreeNode } from './demand-planning.actions';
import {
  calculateDataArea,
  combineDemandTree,
  computeTotalLookupByNames,
  DEFAULT_ECHARTS_OPTIONS,
  DEFAULT_ECHARTS_SERIES_OPTIONS,
  formatByDateAggregationGen,
  generateShortedScenarioLegend,
  propsToColumns,
  takeRowDataById,
  takeTreeNodeChildrenById,
} from '@/store/pages/demand-planning/demand-planning.utils';
import { PlanFlag } from '@/app/@core/interfaces/business/plan';
import { ScenarioFlag } from '@/app/@core/interfaces/business/scenario';
import { select_selectedWorkspace } from '@/store/workspace/workspace.selectors';
const selectFeature = createFeatureSelector<IDemandPlanningPageState>(
  PAGE__DEMAND_PLANNING_STATE_KEY,
);

export const select_forecastURL = createSelector(
  select_displayingScenarios,
  select_legacy_actualAndCommittedScenarios,
  (scenarios, legacy_actualAndCommittedScenarios) => {
    let scenario_ids = scenarios.map((s) => s.id);
    if (scenario_ids.includes(ScenarioFlag.ACTUAL))
      scenario_ids = legacy_actualAndCommittedScenarios.map((s) => s.id);
    const url = `${environment.forecastExplorerUrl}?scenario_id=${scenario_ids.join(',')}`;
    return url;
  },
);

export const select_dateAggregation = createSelector(
  selectFeature,
  (state) => state.dateAggregation,
);
export const select_demandGroupings = createSelector(selectFeature, (state) => state.groupings);
const select_rawDemands = createSelector(selectFeature, (state) => state.demands);
export const select_demands_loading = createSelector(
  selectFeature,
  (state) => state.demands_loading || state.impacts_loading,
);

export const select_combinedDemandsChartData = createSelector(
  selectFeature,
  select_selectedPlan,
  select_selectedWorkspace,
  select_displayingScenarios,
  (state, selectedPlan, selectedWorkspace, displayingScenarios): IDemandChartResponse => {
    if (!selectedPlan || !selectedWorkspace) {
      return { columns: [], rows: [], tree: [] };
    }

    const scenarioIds = displayingScenarios.map((s) => s.id);

    // Ensure Actual & Current scenario is showed
    if (!scenarioIds.includes('actual')) scenarioIds.unshift('actual', 'current');

    const rows: IDemandChartResponse['rows'] = scenarioIds.map((scenarioId) => {
      // Find the demands data for scenario, and use Forecast base data if not found
      const demands =
        takeRowDataById(scenarioId, state.demands.rows) ||
        takeRowDataById('forecast', state.demands.rows) ||
        [];
      const impacts = takeRowDataById(scenarioId, state.impacts.rows) || [];

      // Combine demand data with demand impact data
      // if val and impacts[i] = null , they are 0
      return [scenarioId, demands.map((val, i) => sumIfHaveValue(
        val ? val : nullAcceptedWithSelectedPlan(scenarioId, selectedPlan, selectedWorkspace, state.demands.columns[i]),
        impacts[i] ? impacts[i] : nullAcceptedWithSelectedPlan(scenarioId, selectedPlan, selectedWorkspace, state.demands.columns[i])))];
    });

    // For Demand Table's tree data, does not need to add Acutal & Current
    const tree: IDemandChartResponse['tree'] = displayingScenarios.map((scenario) => {
      const demands =
        takeTreeNodeChildrenById(scenario.id, state.demands.tree) ||
        takeTreeNodeChildrenById('forecast', state.demands.tree) ||
        [];
      const impacts = takeTreeNodeChildrenById(scenario.id, state.impacts.tree) || [];

      return <IDemandTreeNode>{
        key: scenario.id,
        label: scenario.name,
        data: takeRowDataById(scenario.id, rows), // Take already combined data in rows
        children: combineDemandTree(demands, impacts),
      };
    });

    return { columns: state.demands.columns, rows, tree };
  },
);

export const select_formatByDateAggregation = createSelector(
  select_dateAggregation,
  (dateAggregation) => formatByDateAggregationGen(dateAggregation),
);

export const select_demandChartOptions = createSelector(
  select_combinedDemandsChartData,
  select_rawDemands,
  select_displayingScenarios,
  select_highlightedScenario,
  select_dateAggregation,
  (
    combinedDemandsChartData,
    rawDemands,
    displayingScenarios,
    highlightedScenario,
    dateAggregation,
  ): EChartsOption => {
    const marks = calculateDataArea(rawDemands);
    const colors = [COLOR_HISTORICAL, COLOR_CURRENT, ...displayingScenarios.map((s) => s.color || '#0C80EB')];
    const totalMap = computeTotalLookupByNames(combinedDemandsChartData, displayingScenarios);
    const colFormatter = formatByDateAggregationGen(dateAggregation);
    const scenarios = displayingScenarios.map(pick(['id', 'name']));
    // const scenarioLegend = generateShortedScenarioLegend(sce)
    // const generateShorterKpiName(kpiName: string): string {
    //   if (kpiName.concat('\n')) {
    //     kpiName = kpiName.replace(/\n/g, ' ');
    //   }
    //   return kpiName.match(/.{1,20}/g)?.[0] + '...';
    // }
    // Ensure Actual & Current series is showed
    if (!scenarios.some((s) => s.id === 'actual'))
      scenarios.unshift({ id: 'actual', name: 'Actual' }, { id: 'current', name: 'Current' });
    // we will overwrite echarts option
    return <EChartsOption>{
      tooltip: {
        formatter: seriesPairFormatterFactory_v2(highlightedScenario?.id, false, colFormatter),
        trigger: 'axis'
      },
      title: {
        text: 'Demand chart',
        textStyle: { fontWeight: 500, fontFamily: 'Roboto', fontSize: 14, color: '#00355C' },
      },
      grid: { bottom: '40', containLabel: true, left: 200, right: 20 },
      legend: {
        formatter: (name) =>
          !totalMap[name] ? name : `${generateShortedScenarioLegend(name)}\nTotal: ${transformInputToKpiFormat(totalMap[name])}`,
        icon: 'roundRect', itemHeight: 2, left: 'left', orient: 'vertical', top: 50
      },
      xAxis: {
        data: combinedDemandsChartData.columns,
        axisLabel: { formatter: formatByDateAggregationGen(dateAggregation) },
      },
      yAxis: {
        axisLabel: { formatter: transformInputToKpiFormat },
        splitLine: { show: false },
      },
      color: colors,
      series: scenarios.map(({ id, name }) => ({
        id,
        name,
        markArea: marks[id] || marks.future,
        emphasis: { disabled: true },
        data: takeRowDataById(id, combinedDemandsChartData.rows),
        ...DEFAULT_ECHARTS_SERIES_OPTIONS,
        lineStyle: { width: id === highlightedScenario?.id ? 4 : 1 },
        // if only has a point, will appear mark point
        showSymbol: combinedDemandsChartData.columns.length > 1 ? false : true,
        type:'line'
      })),

      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          bottom: 5
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ]
    };
  },
);

/** Compose the param to load Demand Chart data */
export const select_params_loadDemandChartData = createSelector(
  select_selectedPlan,
  select_selectedSegment,
  select_selectedDateRange,
  select_demandGroupings,
  select_dateAggregation,
  (
    selectedPlan,
    selectedSegment,
    selectedDateRange,
    demandGroupings,
    dateAggregation,
  ): IGetDemandsChartDataParams | undefined => {
    if (!selectedPlan) return;

    return <IGetDemandsChartDataParams>{
      planId: selectedPlan.id,
      interval: dateAggregation,
      segment: selectedSegment,
      dateRange: selectedDateRange?.start && {
        start: selectedDateRange?.start,
        end: selectedDateRange?.end
      },
      groupingColumns: propsToColumns(demandGroupings),
      workspaceId: selectedPlan.workspace.id,
    };
  },
);

/** Compose the param to load Demand Impact Chart data */
export const select_params_loadDemandImpactsChartData = createSelector(
  select_selectedPlan,
  select_params_loadDemandChartData,
  select_displayingScenarios,
  (selectedPlan, params, displayingScenarios) => {
    if (!params) return;

    if (selectedPlan?.flags?.includes(PlanFlag.ACTUAL)) {
      return <IGetDemandImpactsChartDataParams>{
        ...params,
        scenarios: ['committed'],
      };
    }

    return <IGetDemandImpactsChartDataParams>{
      ...params,
      scenarios: [
        ...displayingScenarios.map((s) =>
          s.blankScenario ? { id: s.id, events: s.events } : s.id,
        ),
      ],
    };
  },
);
