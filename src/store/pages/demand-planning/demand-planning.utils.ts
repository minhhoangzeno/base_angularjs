import { EChartsOption, LineSeriesOption } from 'echarts';
import { pick, sum } from 'rambda';
import { format, parseISO } from 'date-fns';

import { Scenario } from '@/app/@core/interfaces/business/scenario';
import {
  IDemandChartResponse,
  IDemandTreeNode,
} from '@/store/pages/demand-planning/demand-planning.actions';
import { notNullOrUndefined } from '../../../utils/notNullOrUndefined';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { sumIfHaveValue } from '../../../utils/numbers';
import { PROP_TO_COLUMN_LOOKUP } from '@/app/@core/constants/entity-matcher.constants';

export const DEFAULT_ECHARTS_SERIES_OPTIONS = <LineSeriesOption>{
  type: 'line',
  // smooth: true,
  showSymbol: false,
  legendHoverLink: false,
  selectedMode: 'series',
  lineStyle: { width: 1 },
};

// mainType?: 'axisPointer';
// type?: 'line' | 'shadow' | 'cross' | 'none';
// link?: AxisPointerLink[];
/** Override configs for timeseries chart. */
export const DEFAULT_ECHARTS_OPTIONS: EChartsOption = {
  title: {
    text: 'Demand chart',
    textStyle: { fontWeight: 500, fontFamily: 'Roboto', fontSize: 14, color: '#00355C' },
  },
  grid: { bottom: '40', containLabel: true, left: 200, right: 20 },
  legend: { icon: 'roundRect', itemHeight: 2, left: 'left', orient: 'vertical', top: 50 },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: { type: 'category' },
  yAxis: {
  },
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

export function computeTotalLookupByNames(
  combinedDemandsChartData: IDemandChartResponse,
  displayingScenarios: Scenario[],
) {
  const isActualPlan = displayingScenarios.some(({ id }) => id === 'actual');
  const scenarios = displayingScenarios.map(pick(['id', 'name']));
  // Ensure Actual & Current series is showed
  if (!scenarios.some((s) => s.id === 'actual'))
    scenarios.unshift({ id: 'actual', name: 'Actual' }, { id: 'current', name: 'Current' });

  return Object.fromEntries(
    scenarios.map((s) => {
      const data = takeRowDataById(s.id, combinedDemandsChartData.rows) || [];
      return [s.name, sum(data.filter(notNullOrUndefined))];
    }),
  );
}
export function calculateDataArea(rawData: { rows: Array<any>; columns: string[] }) {
  enum D {
    actual = 'actual',
    current = 'current',
    future = 'future',
  }
  // Area of Future is determinded by forecast base's data
  const data: Record<D, any[]> = {
    actual: rawData.rows.filter((r) => r[0] === 'actual').flatMap((r) => r[1]),
    current: rawData.rows.filter((r) => r[0] === 'current').flatMap((r) => r[1]),
    // Get the Forecast Base data, or if not found take the last row, after excluxing all special rows
    future: rawData.rows
      .filter((r) => r[0] !== 'actual')
      .filter((r) => r[0] !== 'current')
      .filter((r) => r[0] !== 'committed')
      .filter((r, i) => r[0] === 'forecast' || i === rawData.rows.length - 1)
      .flatMap((r) => r[1]),
  };
  const dataIndies: Record<D, number[]> = {
    actual: findIndexRangeOfAvailableData(data.actual),
    current: findIndexRangeOfAvailableData(data.current),
    future: findIndexRangeOfAvailableData(data.future),
  };
  const colValues: Record<D, string[]> = {
    actual: dataIndies.actual.map((i) => rawData.columns[i]),
    current: dataIndies.current.map((i) => rawData.columns[i]),
    future: dataIndies.future.map((i) => rawData.columns[i]),
  };
  const labelColors: Record<D, string> = {
    actual: '#979797',
    current: '#AD3781',
    future: '#222B45',
  };
  const bgColors: Record<D, string> = {
    actual: '#E3E3E340',
    current: '#7C596F40',
    future: 'transparent',
  };

  const result: Array<[string, LineSeriesOption['markArea']]> = Object.values(D).map((val) => [
    val,
    dataIndies[val].length
      ? {
        silent: true,
        data: [
          [
            {
              name: val.toUpperCase(),
              label: { color: labelColors[val] },
              itemStyle: { color: bgColors[val] },
              xAxis: colValues[val][0],
            },
            { xAxis: colValues[val][1] },
          ],
        ],
      }
      : undefined,
  ]);

  return Object.fromEntries(result);
}
export function combineDemandTree(
  tree1?: IDemandTreeNode[],
  tree2?: IDemandTreeNode[],
): IDemandTreeNode[] | undefined {
  if (!tree1 || !tree2) return tree1 || tree2;

  const keys = [...new Set([...tree1.map(({ key }) => key), ...tree2.map(({ key }) => key)])];

  return keys
    .map((k) => {
      const node1 = tree1.find(({ key }) => key === k);
      const node2 = tree2.find(({ key }) => key === k);
      if (!node1 || !node2) return node1 || node2;

      return <IDemandTreeNode>{
        key: k,
        label: node1.label,
        data: node1.data.map((val, i) => sumIfHaveValue(val, node2.data[i])),
        children: combineDemandTree(node1.children, node2.children),
      };
    })
    .filter(notNullOrUndefined);
}
export function formatByDateAggregationGen(dao: DateAggregationOption) {
  return (s?: string) => {
    if (!s) return '';
    switch (dao) {
      default:
      case DateAggregationOption.DAY:
        return format(parseISO(s), 'dd MMM yy');
      case DateAggregationOption.WEEK:
        return format(new Date(s), "'W'ww MMM yyyy", { weekStartsOn: 0, firstWeekContainsDate: 4 });
      case DateAggregationOption.MONTH:
        return format(parseISO(s), 'MMM yy');
      case DateAggregationOption.YEAR:
        return format(parseISO(s), 'yyyy');
    }
  };
}
// generateShorterKpiName(kpiName: string): string {
//   if (kpiName.concat('\n')) {
//     kpiName = kpiName.replace(/\n/g, ' ');
//   }
//   return kpiName.match(/.{1,20}/g)?.[0] + '...';
// }
export function generateShortedScenarioLegend(scenarioName: string): string {
  if (scenarioName.concat('\n')) {
    scenarioName = scenarioName.replace(/\n/g, ' ');
  }
  return scenarioName.match(/.{1,20}/g)?.[0] + '...';
}
export function takeRowDataById<T extends number | null | undefined>(
  dataId: string,
  rows: Array<[id: string, data: Array<T>]>,
) {
  return rows
    .filter(([id]) => id === dataId)
    .map(([_, data]) => data)
    .pop();
}

export function takeTreeNodeChildrenById(id: string, treeNodes: IDemandTreeNode[]) {
  return treeNodes
    .filter(({ key }) => key === id)
    .map(({ children }) => children)
    .filter(notNullOrUndefined)
    .pop();
}

/** Given a list of entity matcher properties, return their equivalent column names. */
export function propsToColumns(props: readonly string[]): string[] {
  return props.map((prop) => PROP_TO_COLUMN_LOOKUP[prop]);
}

function findIndexRangeOfAvailableData<T>(array: Array<T | null | undefined>) {
  let first: number | null = null;
  let last: number | null = null;

  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    if (item === null || item === undefined) continue;
    if (first === null) first = index;
    last = index;
  }

  if (first !== null && last !== null) return [first, last];
  return [];
}
