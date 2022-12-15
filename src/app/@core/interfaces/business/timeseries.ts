import { Breakdown, calculateTimestamp, calculateCbm } from './breakdown';
import { Demand } from './demand';
import { ObjectRef, refId } from '../common/mongo';

// ScenarioToTimeseriesConfig is used to configure how a scenario should be transformed
// into data that is directly usable a echart inputs.
// It is used for example to allow a single scenario to be represented as several timeseries on the same chart
// each one showing a different dataset of the same scenario
export declare interface ScenarioToTimeseriesConfig {
  settings: ScenarioToTimeseriesSetting[];
}

export declare interface ScenarioToTimeseriesSetting {
  name?: string;
  useScenarioName: boolean;
  datasetName: string;
}

export declare interface Datapoint {
  timestamp: number;
  // TODO: this is too much oriented towards representing a P&L breakdown.
  // A dataset should be able to hold any kind of data.
  netSalesValue?: number;
  cbm?: number;
  demandValue?: number;
  // TODO : double check why there are two names for demand and gather behavior
  quantity?: number;
  quantityVariation?: number;
}

export declare interface Timeseries {
  id: string;
  data: Datapoint[];
}

/** Generates timeseries datapoints from a series of dated breakdowns. */
export function fromBreakdowns(id: string, breakdowns: readonly Breakdown[]): Timeseries {
  return {
    id,
    data: breakdowns.map((breakdown) => ({
      timestamp: calculateTimestamp(breakdown),
      netSalesValue: breakdown.netSalesValue,
      cbm: calculateCbm(breakdown) || 0,
      demandValue: breakdown.demandValue,
      quantity: 0,
      quantityVariation: 0,
    })),
  };
}

/**
 * Normalize utility since forecast base weirdly uses quantityVariation while scenario
 * datapoints uses quantity to indicate demand.
 */
export function normalizeTimeseries(timeseries: Timeseries): Timeseries {
  return {
    ...timeseries,
    data: timeseries.data.map((datapoint) => ({
      ...datapoint,
      quantity: datapoint.quantity || datapoint.quantityVariation || 0,
      quantityVariation: datapoint.quantity || datapoint.quantityVariation || 0,
    })),
  };
}

/** Merges two timeseries datapoints by adding all value props, with priority on the right. */
export function mergeDatapoints(left: Datapoint, right: Datapoint): Datapoint {
  return {
    ...left,
    ...right,
    demandValue: (left?.demandValue || 0) + (right?.demandValue || 0),
    quantity: (left?.quantity || 0) + (right?.quantity || 0),
    quantityVariation: (left?.quantityVariation || 0) + (right?.quantityVariation || 0),
    netSalesValue: (left?.netSalesValue || 0) + (right?.netSalesValue || 0),
    cbm: (left?.cbm || 0) + (right?.cbm || 0),
  };
}

/**
 * Merges two timeseries with option on how to do the merge. The base / number of resulting
 * datapoints will depend on the first timeseries provided.
 *
 * - 'priority-left': If a timestamp has value on both sides, use left value.
 * - 'priority-right': If a timestamp has value on both sides, use right value.
 * - 'cut-left': Remove all values in left whose timestamps are >= of the min in the right.
 * - 'cut-right': Remove all values in right whose timestamps <= of the max of the left.
 * - 'sum': If a timestamp has value on both sides, add all number props.
 */
export function mergeTimeseries(
  left: Timeseries,
  right: Timeseries,
  mergeStrategy: 'priority-left' | 'priority-right' | 'cut-left' | 'cut-right' | 'sum' = 'sum',
): Timeseries {
  const transformToLookup = (prev: { [key: number]: Datapoint }, curr) => ({
    ...prev,
    [curr.timestamp]: curr,
  });

  // Key is timestamp, value is the datapoint.
  const base = left.data.reduce(transformToLookup, {} as { [key: number]: Datapoint });
  const rightMinTimestamp = Math.min(...right.data.map((v) => v.timestamp));
  const leftMaxTimestamp = Math.max(...left.data.map((v) => v.timestamp));

  switch (mergeStrategy) {
    case 'priority-left':
      right.data.forEach((datapoint) => {
        base[datapoint.timestamp] = { ...datapoint, ...base[datapoint.timestamp] };
      });
      break;
    case 'priority-right':
      right.data.forEach((datapoint) => {
        base[datapoint.timestamp] = { ...base[datapoint.timestamp], ...datapoint };
      });
      break;
    case 'cut-left':
      Object.keys(base).forEach((timestamp) => {
        // Remove from base all timestamps that are in scope of the right datapoints.
        if (timestamp >= String(rightMinTimestamp)) {
          delete base[timestamp];
        }
      });
      right.data.forEach((datapoint) => {
        base[datapoint.timestamp] = { ...datapoint, ...base[datapoint.timestamp] };
      });
      break;
    case 'cut-right':
      right.data.forEach((datapoint) => {
        // Remove from right all timestamps that are in scope of the left datapoints.
        if (datapoint.timestamp <= leftMaxTimestamp) {
          return;
        }
        base[datapoint.timestamp] = { ...base[datapoint.timestamp], ...datapoint };
      });
      break;
    case 'sum':
    default:
      right.data.forEach((datapoint) => {
        base[datapoint.timestamp] = mergeDatapoints(base[datapoint.timestamp], datapoint);
      });
      break;
  }

  return {
    ...left,
    ...right,
    data: Object.values(base).sort((a, b) => b.timestamp - a.timestamp),
  };
}

/** Generates timeseries datapoints from a series of dated aggregated demand or demand impacts. */
// Currently used to create timeseries data for both plan (to represent forecast base) and a scenario (to represent demand)
export function fromAggregatedDemand(
  associatedEntity: ObjectRef<{ id: string }>,
  demands: readonly Demand[],
): Timeseries {
  const lookup: { [key: number]: Datapoint } = demands.reduce((prev, curr) => {
    const timestamp = calculateTimestamp(curr);
    prev[timestamp] = mergeDatapoints(prev[timestamp], {
      timestamp,
      netSalesValue: 0,
      cbm: 0,
      demandValue: curr.demandValue,
      quantity: curr.quantity,
      quantityVariation: curr.quantityVariation,
    });
    return prev;
  }, {});

  return {
    id: refId(associatedEntity) || '',
    data: Object.values(lookup).sort((a, b) => b.timestamp - a.timestamp),
  };
}
