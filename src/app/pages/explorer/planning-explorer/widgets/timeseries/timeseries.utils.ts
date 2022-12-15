import { DatePipe } from '@angular/common';

import { Plan, PlanFlag } from '@/app/@core/interfaces/business/plan';
import {
  Datapoint,
  Timeseries,
  ScenarioToTimeseriesConfig,
} from '@/app/@core/interfaces/business/timeseries';
import { COLOR_CURRENT } from './timeseries.constants';
import { generateDiffColor } from '../breakdown/breakdown.utils';
import { DateAggregationOption } from './timeseries.constants';
import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { getDate, getMonth, getWeek, getYear } from 'date-fns';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  format,
} from 'date-fns/fp';
import { TooltipComponentFormatterCallbackParams } from 'echarts';
import { Demand_v2 } from '@/app/@core/interfaces/business/demand';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';

export enum DataSetName {
  QUANTITY = 'quantity',
  NSV = 'netSalesValue',
  CBM = 'cbm',
}

export enum ChartLabel {
  CURRENT = 'CURRENT',
  ACTUAL = 'ACTUAL',
  FUTURE = 'FUTURE',
}

export enum SeriesName {
  ACTUAL = 'Actual',
  CURRENT = 'Current',
}

export enum ChartTitle {
  DEMAND = 'Demand chart',
  PNL_EVOLUTION = 'Sales & Profit Evolution',
}

export declare interface TimeSeriesDiffText {
  color?: string;
  value?: string;
  foundDiff?: boolean;
}

// const CBM_ICON_SVG_PATH =
//   'path://M150,0C67.29000091552734,0,0,67.29000091552734,0,150s67.29000091552734,150,150,150s150,-67.28999328613281,150,-150S232.7100067138672,0,150,0ZM150,270c-66.16899871826172,0,-120,-53.832000732421875,-120,-120S83.83100128173828,30,150,30s120,53.832000732421875,120,120S216.16799926757812,270,150,270Z';

/** Round given ms timestamp to the nearest value in date aggregation option. */
export function roundTimestampToDateAggregation(
  timestamp: number,
  dateAggregation: DateAggregationOption,
) {
  const date = new Date(timestamp);
  const dayOfWeek = date.getDay();

  switch (dateAggregation) {
    case DateAggregationOption.YEAR:
      date.setMonth(0);
      date.setDate(1);
      date.setHours(0, 0, 0);
      return date.getTime();
    case DateAggregationOption.MONTH:
      date.setDate(1);
      date.setHours(0, 0, 0);
      return date.getTime();
    case DateAggregationOption.WEEK:
      date.setDate(date.getDate() - dayOfWeek);
      date.setHours(0, 0, 0);
      return date.getTime();
    case DateAggregationOption.DAY:
    default:
      date.setHours(0, 0, 0);
      return date.getTime();
  }
}

/** Creates a sorted list of timestamps (ms) based on given start, end and date interval. */
export function generateIntervalTimestamps(
  startMs: number,
  endMs: number,
  dateAggregation: DateAggregationOption,
): number[] {
  const roundedStartDate = new Date(roundTimestampToDateAggregation(startMs, dateAggregation));
  const roundedEndDate = new Date(roundTimestampToDateAggregation(endMs, dateAggregation));

  const timestamps: number[] = [];

  const cursor = roundedStartDate;
  while (cursor.getTime() <= roundedEndDate.getTime()) {
    timestamps.push(cursor.getTime());

    switch (dateAggregation) {
      case DateAggregationOption.DAY:
        cursor.setDate(cursor.getDate() + 1);
        break;
      case DateAggregationOption.MONTH:
        cursor.setMonth(cursor.getMonth() + 1);
        break;
      case DateAggregationOption.WEEK:
        cursor.setDate(cursor.getDate() + 7);
        break;
      case DateAggregationOption.YEAR:
        cursor.setFullYear(cursor.getFullYear() + 1);
        break;
    }
  }

  return timestamps.sort((a, b) => a - b);
}

const DATE_INTERVAL_PERIOD_FN = {
  [DateAggregationOption.YEAR]: eachYearOfInterval,
  [DateAggregationOption.MONTH]: eachMonthOfInterval,
  [DateAggregationOption.WEEK]: eachWeekOfInterval,
  [DateAggregationOption.DAY]: eachDayOfInterval,
};
const DATE_FORMAT_BY_PERIOD_FN = {
  [DateAggregationOption.YEAR]: format('yyyy'),
  [DateAggregationOption.MONTH]: format('yyyy-MM'),
  [DateAggregationOption.WEEK]: format("'W'ww MMM yyyy"),
  [DateAggregationOption.DAY]: format('yyyy-MM-dd'),
};

/** Creates a sorted list of timestamps (ms) based on given start, end and date interval. */
export function generateIntervalTimestampsV2(
  start: Date | undefined,
  end: Date | undefined,
  dateAggregation: DateAggregationOption,
): Date[] {
  if (!start || !end) return [];
  const intervalGen = DATE_INTERVAL_PERIOD_FN[dateAggregation]; // Increase by 1 period (curried function)
  return intervalGen({ start, end });
}

export function generateFormattedGroup(
  parsedDate: Demand_v2['parsedDate'],
  dateAggregation: DateAggregationOption,
) {
  const { year, month, week, day } = parsedDate;
  return [year, month, week, day]
    .slice(
      0,
      dateAggregation === DateAggregationOption.DAY
        ? 4
        : dateAggregation === DateAggregationOption.WEEK
          ? 3
          : dateAggregation === DateAggregationOption.MONTH
            ? 2
            : dateAggregation === DateAggregationOption.YEAR
              ? 1
              : 0,
    )
    .join('-');
}

export function generateFormattedIntervalTimestampsV2(
  start: Date | undefined,
  end: Date | undefined,
  dateAggregation: DateAggregationOption,
) {
  return generateIntervalTimestampsV2(start, end, dateAggregation).map((d) => {
    return generateFormattedGroup(
      {
        year: getYear(d),
        month: getMonth(d),
        week: getWeek(d, { weekStartsOn: 0, firstWeekContainsDate: 4 }),
        day: getDate(d),
      },
      dateAggregation,
    );
  });
}

export function formatTimestampsByDateAggregation(date: Date, da: DateAggregationOption) {
  return DATE_FORMAT_BY_PERIOD_FN[da](date);
}

/** Reuse angular date pipe formatter. */
const datePipe = new DatePipe('en-US');

/**
 * Predefined list of date pipe formats. Check out the Angular DatePipe docs for more info
 * on how to format dates: https://angular.io/api/common/DatePipe
 */
export enum DateFormat {
  YEAR = 'yyyy',
  MONTH_YEAR = 'MMM yy',
  WEEK_MONTH_YEAR = 'ww MMM yy',
  DAY_MONTH_YEAR = 'dd MMM yy',
}

/** Creates a function that can format an input timestamp to the specified format input. */
export function dateFormatterFactory(
  format: DateFormat | string,
  prefix = '',
  tz = 'UTC+7',
  locale = 'en-US',
) {
  return function (timestamp: any): string {
    const date = new Date(Number(timestamp) || 0);
    const formattedDate = prefix + datePipe.transform(date, format, tz, locale);
    return formattedDate;
  };
}

// TODO: Replace all calls to these functions to directly use dateFormatterFactory instead.

/** Format a timestamp to YYYY. */
export const formatTimestampToYear = dateFormatterFactory(DateFormat.YEAR);

/** Format a timestamp to MMM DD. */
export const formatTimestampToMonthYear = dateFormatterFactory(DateFormat.MONTH_YEAR);

/** Format a timestamp to ww MMM DD. */
export const formatTimestampToWeekMonthYear = dateFormatterFactory(DateFormat.WEEK_MONTH_YEAR, 'W');

/** Format a timestamp to dd MMM DD. */
export const formatTimestampToDayMonthYear = dateFormatterFactory(DateFormat.DAY_MONTH_YEAR);

/** Formats a timestamp based on the value of date aggregation input. */
export function formatFromDateAggregation(dateAggregation: DateAggregationOption) {
  switch (dateAggregation) {
    case DateAggregationOption.DAY:
      return dateFormatterFactory(DateFormat.DAY_MONTH_YEAR);
    case DateAggregationOption.WEEK:
      return dateFormatterFactory(DateFormat.WEEK_MONTH_YEAR, 'W');
    case DateAggregationOption.MONTH:
      return dateFormatterFactory(DateFormat.MONTH_YEAR);
    case DateAggregationOption.YEAR:
    default:
      return dateFormatterFactory(DateFormat.YEAR);
  }
}

/** Comparison sorter for data points. */
function sortByTimestamp(a: Datapoint, b: Datapoint): number {
  return a.timestamp - b.timestamp;
}

/** Round and aggregate timeseries datapoints to the nearest time slice. */
export function aggregateByDateAggregationOption(
  points: Datapoint[],
  dateAggregation: DateAggregationOption,
): Datapoint[] {
  // TODO : document what "number" is in this table or find clearer name
  const table: Record<number, Datapoint> = {};

  for (const point of points) {
    const key = roundTimestampToDateAggregation(point.timestamp, dateAggregation);
    table[key] = {
      timestamp: key,
      cbm: (table[key]?.cbm || 0) + (point.cbm || 0),
      netSalesValue: (table[key]?.netSalesValue || 0) + (point.netSalesValue || 0),
      demandValue: (table[key]?.demandValue || 0) + (point.demandValue || 0),
      quantityVariation: (table[key]?.quantityVariation || 0) + (point.quantityVariation || 0),
      quantity: (table[key]?.quantity || 0) + (point.quantity || 0),
    };
  }

  return Object.values(table);
}

/**
 * Transforms the datapoints of all the given timeserieses to be:
 *  (1) **sorted**; and
 *  (2) **aggregated** by the given slice
 */
export function sortAndAggregate(
  datasets: Timeseries[],
  dateAggregation: DateAggregationOption,
): Timeseries[] {
  return datasets
    .map((dataset) => ({
      ...dataset,
      data: (dataset?.data || []).sort(sortByTimestamp),
    }))
    .map((dataset) => ({
      ...dataset,
      data: aggregateByDateAggregationOption(dataset?.data, dateAggregation),
    }));
}

/**
 * Converts a timeseries to an echarts-compatible series data points.
 *
 * Warning: The input `config` is being mutated by this function.
 *
 * TODO : document what "timestamps" are
 */
export function timeseriesToDatapoints(
  title: string | undefined,
  timestamps: number[],
  timeseries: Timeseries | undefined,
  primary: boolean,
  color: string | undefined,
  plan: Plan,
  dateAggregation: DateAggregationOption,
  sectionName: string,
  config: ScenarioToTimeseriesConfig | undefined,
): any[] {
  // Convert timeseries to a lookup table where key is the timestamp.
  const table = timeseries?.data.reduce(
    (acc, curr) => ({ ...acc, [curr.timestamp]: curr }),
    {} as { [key: number]: Datapoint },
  );

  const roundedChartTimestamp = (dateString: string | number | Date) =>
    roundTimestampToDateAggregation(new Date(dateString).getTime(), dateAggregation);

  // Max and minimum timestamps in the datapoints.
  const max = roundedChartTimestamp(Math.max(...timestamps));
  const min = roundedChartTimestamp(Math.min(...timestamps));

  // Conditions when to show the labels.
  const showActual =
    roundedChartTimestamp(plan.workspace.actualStartDate) < max &&
    roundedChartTimestamp(plan.currentPlanStartDate) > min;
  const showCurrent =
    roundedChartTimestamp(plan.currentPlanStartDate) < max &&
    roundedChartTimestamp(plan.futurePlanStartDate) > min;
  const showFuture =
    roundedChartTimestamp(plan.futurePlanStartDate) < max &&
    roundedChartTimestamp(plan.futurePlanEndDate) > min;

  // Get the exact timestamps.
  const HISTORICAL_START = timestamps[0];
  const FROZEN_START = roundedChartTimestamp(plan.currentPlanStartDate);
  const CURRENT_START = roundedChartTimestamp(plan.futurePlanStartDate);
  const CURRENT_END = timestamps[timestamps.length - 1];

  // Compose the labels.
  const labelActual = [
    {
      name: ChartLabel.ACTUAL,
      xAxis: String(Math.max(min, HISTORICAL_START)),
      itemStyle: { color: '#E3E3E3', opacity: 0.3 },
      label: { color: '#979797' },
    },
    { xAxis: String(Math.min(max, FROZEN_START)) },
  ];
  const labelCurrent = [
    {
      name: ChartLabel.CURRENT,
      xAxis: String(Math.max(min, FROZEN_START)),
      itemStyle: { color: '#7C596F', opacity: 0.2 },
      label: { color: '#AD3781' },
    },
    { xAxis: String(Math.min(max, CURRENT_START)) },
  ];
  const labelFuture = [
    {
      name: ChartLabel.FUTURE,
      xAxis: String(Math.max(min, CURRENT_START)),
      label: { color: '#222B45', align: 'center' },
    },
    { xAxis: String(Math.min(max, CURRENT_END)) },
  ];

  const markArea = {
    data: [
      ...(showActual ? [labelActual] : []),
      ...(showCurrent ? [labelCurrent] : []),
      ...(showFuture ? [labelFuture] : []),
    ],
    itemStyle: { color: '#FFFFFF' },
    label: {
      fontFamily: 'simcel-Bw-Mitga',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 9,
      lineHeight: 11,
      align: 'center',
    },
  };

  const echartSettings: any[] = [];
  config?.settings.forEach((setting) => {
    if (
      title != ChartTitle.DEMAND ||
      sectionName != 'Forecast Base' ||
      !plan.flags?.includes(PlanFlag.ACTUAL)
    ) {
      echartSettings.push({
        scenarioName: sectionName,
        name: setting.useScenarioName ? sectionName : setting.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        showAllSymbol: true,
        itemStyle: {
          borderWidth: 1,
          borderColor: color,
          color: color,
        },
        lineStyle: {
          width: primary ? 4 : 1,
          type: timeSeriesLineStyleType(setting.datasetName, primary),
          color: color,
        },
        symbolSize: 8,
        data: timestamps.map((timestamp) =>
          table?.[timestamp] ? table[timestamp][setting.datasetName as keyof Datapoint] : undefined,
        ),
        // TODO : markArea was not used on all options before, checkout why
        markArea: markArea,
      });
    }
  });

  return echartSettings;
}

/**
 * Styling the line base on dataset
 * - Solid line for NSV, Quantity dataset
 * - Dashed line for CBM
 */
function timeSeriesLineStyleType(datasetName: string, _primary: boolean): string {
  if (datasetName === DataSetName.NSV) {
    return 'solid';
  }

  if (datasetName === DataSetName.CBM) {
    return 'dotted';
  }

  return 'solid';
}

/** Styling and show the YAxis bases on the title of the chart */
export function timeSeriesYAxis(): any {
  return {
    axisLabel: {
      formatter: transformInputToKpiFormat,
      fontFamily: 'simcel-Bw-Mitga',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 12,
      lineHeight: 14,
      color: '#484848',
      margin: 40,
    },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
  };
}

/** Styling for title of the chart based on given title */
export function timeSeriesTitle(title: string): any {
  if (title === ChartTitle.DEMAND) {
    return {
      fontStyle: 'normal',
      fontWeight: 500,
      fontFamily: 'Roboto',
      fontSize: 14,
      lineHeight: 16,
      color: '#00355C',
    };
  }

  if (title === ChartTitle.PNL_EVOLUTION) {
    return {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontFamily: 'simcel-Bw-Mitga',
      fontSize: 16,
      lineHeight: 19,
      color: '#686868',
    };
  }
}

/**
 * Generates tooltip content when hovering over the timeseries chart. Toggle `showScenarioName`
 * to also show scenario name besides the series name.
 */
export function seriesPairFormatterFactory_v2(
  highlightedId: string | undefined,
  groupBySeriesName = false,
  labelFormatter = (s?: string) => s,
  scenarioIdGetter = (s?: string) => s,
) {
  type CallBackParams = Extract<TooltipComponentFormatterCallbackParams, Array<any>>;
  type CallBackParam = Exclude<TooltipComponentFormatterCallbackParams, Array<any>>;

  return (rootParams: TooltipComponentFormatterCallbackParams): string => {
    if (!Array.isArray(rootParams)) return '';
    if (rootParams.length === 0 || !rootParams.some(({ value }) => notNullOrUndefined(value)))
      return 'No data';

    let highlightedValue: number =
      rootParams
        .filter((s) => scenarioIdGetter(s.seriesId) === highlightedId)
        .map((s) => s.value as number)
        .filter(notNullOrUndefined)
        .pop() || 0;

    // Helper function for generating the tooltip line for a single series.
    const tooltipForParam = (param: CallBackParam) => {
      // Show round marker for current series.
      let line = `${param.marker}`;
      const scenarioId = scenarioIdGetter(param.seriesId);
      const currentValue = param.value as number | null;

      // Show main label for current series.
      if (!groupBySeriesName) {
        line += `<span style="color:#484848; font-weight:bold">${param.seriesName}</span>`;
      } else {
        // Search for highltighted value by series name
        highlightedValue =
          rootParams
            .filter((s) => scenarioIdGetter(s.seriesId) === highlightedId)
            .filter((s) => s.seriesName === param.seriesName)
            .map((s) => s.value as number)
            .filter(notNullOrUndefined)
            .pop() || 0;
      }

      // Show value for current series.
      const valueText = transformInputToKpiFormat(currentValue);

      line += `<span style="color:#484848; font-weight:normal">: ${valueText}</span>`;

      if (scenarioId !== highlightedId) {
        const diffText = getDiffText(currentValue, highlightedValue);

        if (diffText.foundDiff) {
          line += `<span style="padding-left: 20px; font-weight:bold; color:${diffText.color}">(${diffText.value} %)</span>`;
        } else {
          if (scenarioId === 'current') {
            const actualVal = rootParams.find((s) => scenarioIdGetter(s.seriesId) === 'actual')
              ?.value as number | null | undefined;
            const diffText = getDiffText(currentValue, actualVal);
            if (diffText.foundDiff) {
              line += `<span style="padding-left: 20px; font-weight:bold; color:${diffText.color}">(${diffText.value} %)</span>`;
            }
          }
        }
      }
      return line;
    };

    const tooltipWithGrouppedseriesName = (params: CallBackParams) => {
      const paramsBySeriesName = params.reduce(function (r: any, a: any) {
        r[a.seriesName] = r[a.seriesName] || [];
        r[a.seriesName].push(a);
        return r;
      }, Object.create(null));

      let content = '';

      for (const seriesName in paramsBySeriesName) {
        content += `<br/><span style="color:#484848; font-weight:bold">${seriesName}</span><br/>`;

        content += paramsBySeriesName[seriesName]
          .filter((param: any) => param.value !== undefined)
          .map(tooltipForParam)
          .join('<br/>');
      }

      return content;
    };

    // remove label name
    const tooltipWithoutGrouppedseriesName = (params: CallBackParams) => {
      return (
        '<br/>' +
        params
          .filter(({ value }) => notNullOrUndefined(value))
          .map(tooltipForParam)
          .join('<br/>')
      );
    };

    const header = `
      <span style="color:#484848; font-weight:bold">
        ${labelFormatter(rootParams[0].name)}
      </span>`;
    const content = groupBySeriesName
      ? tooltipWithGrouppedseriesName(rootParams)
      : tooltipWithoutGrouppedseriesName(rootParams);

    return `${header}${content}`;

  };
}

/**
 * Base on the title of the chart, we have diff ways to get the highlighted scenario's series data
 * For now, we only have 2 charts that use this util. Demand and P&L Evolution.
 */
function getHighLightedValueWithTitleAndSeriesName(
  highlightedTimeSeriesData: any[],
  title: string,
  seriesName: string,
  index: any,
): number | undefined {
  if (title === ChartTitle.DEMAND) {
    return highlightedTimeSeriesData[0]?.data[index];
  }

  if (title === ChartTitle.PNL_EVOLUTION) {
    return highlightedTimeSeriesData.filter((data) => seriesName === data.name)[0]?.data[index];
  }

  return;
}

function getDiffTextFromTimeSeriesValue(
  timeSeriesData: any[],
  title: string,
  param: any,
  fromHighlighted: boolean,
): TimeSeriesDiffText {
  let compareValue: number | undefined = 0;

  if (fromHighlighted) {
    compareValue = getHighLightedValueWithTitleAndSeriesName(
      timeSeriesData,
      title,
      param.seriesName,
      param.dataIndex,
    );
  } else {
    compareValue = getActualValueWithTitleAndSeriesName(
      timeSeriesData,
      title,
      param.seriesName,
      param.axisValue,
    );
  }

  return getDiffText(param.value, compareValue);
}

function getDiffText(
  originValue?: number | null,
  compareValue?: number | null,
): TimeSeriesDiffText {
  compareValue = compareValue || 0;
  originValue = originValue || 0;

  const diffValue =
    compareValue === originValue || compareValue === 0
      ? '---'
      : transformInputToKpiFormat(((originValue - compareValue) / compareValue) * 100, '---');
  const diffColor = generateDiffColor(diffValue, 'profit');
  const foundDiff = diffValue === '---' ? false : true;

  return { color: diffColor, value: diffValue, foundDiff: foundDiff };
}

function getActualValueWithTitleAndSeriesName(
  actualTimeSeriesData: any[],
  title: string,
  seriesName: string,
  timeStamp: string,
): number | undefined {
  const actual = actualTimeSeriesData.find((data) => data.timestamp.toString() === timeStamp);

  if (!actual) {
    return;
  }

  if (title === ChartTitle.DEMAND) {
    return actual.quantity;
  }

  if (title === ChartTitle.PNL_EVOLUTION) {
    if (seriesName === DataSetName.CBM) {
      return actual.cbm;
    }
    return actual.netSalesValue;
  }

  return;
}

/**
 * Returns sorted unique timestamps from input timeserieses. No component dependency, refactor me.
 * @param interpolateTimestamps Set to true if want to fill missing timestamps with 0 data values.
 */
export function collectUniqueTimestamps(
  points: Timeseries[],
  dateAggregation: DateAggregationOption,
  interpolateTimestamps = true,
): number[] {
  // Collect a sorted list of all timestamps in the dataset. This op might be expensive.
  const timestampsSet = points.reduce((set, curr) => {
    (curr?.data || []).forEach((point) => set.add(point.timestamp));
    return set;
  }, new Set<number>());

  let timestamps = [...timestampsSet].sort((a, b) => a - b);
  if (interpolateTimestamps) {
    const startMs = Math.min(...timestamps);
    const endMs = Math.max(...timestamps);

    timestamps = generateIntervalTimestamps(startMs, endMs, dateAggregation);
  }

  return timestamps;
}
