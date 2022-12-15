import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { formatTimestampsByDateAggregation } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.utils';
import { getWeek } from 'date-fns';

/**
 * Defines a Demand to hold the demandValue / quantity / variation. Can also receive demands
 * with groupings specified.
 *
 * This structure is used mostly as a receiver for demand endpoints.
 *
 * The `_id` property defines how the retrieved aggregated demand are grouped.
 */
export declare interface Demand {
  /** Indicator of how the retrieved demands are grouped before being aggregated. */
  _id?: { [key: string]: any };

  id: string;
  quantity?: number;
  quantityVariation?: number;
  demandValue?: number;

  /** Optional grouping columns. See forecast-table.models -> PROP_TO_COLUMN_LOOKUP. */
  region?: string;
  channel?: string;
  city?: string;
  country?: string;
  brands?: string;
  category?: string;
  subCategory?: string;
  productRange?: string;
}

export declare interface Demand_v2 {
  date: Date;
  quantity?: number;
  quantityVariation?: number;
  /** Indicator of how the retrieved demands are grouped before being aggregated. */
  group?: Record<string, string>;
  /** Group */
  parsedDate: { year: number; month: number; week: number; day: number };
}

export function convertDemandToV2(demand: Demand): Demand_v2 {
  const { day, month, year, ...group } = demand._id || {};
  const date = new Date(year, month - 1, day); // in JS date, month start at 0
  const week = getWeek(date, { weekStartsOn: 0, firstWeekContainsDate: 4 });

  return {
    date,
    group,
    quantity: demand.quantity,
    quantityVariation: demand.quantityVariation,
    parsedDate: { day, month, year, week },
  };
}

/** Returns a zero-valued demand. */
export function emptyDemand(): Demand {
  return {
    id: '',
    demandValue: 0,
  };
}

/**
 * Utility function for calculating timestamp from _id property of a Demand breakdown.
 *
 * The name of the `_id` property comes from the hardcoded column name needed by
 * MongoDB when wanting to group an aggregation (ie. GROUP BY in SQL), which is
 * why we reuse this convention in the frontend.
 */
export function calculateTimestamp(demand: Demand): number {
  const grouping = demand._id;
  if (!grouping) {
    return 0;
  }
  const year = grouping['year'] || '0000';
  const month = grouping['month'] || '00';
  const day = grouping['day'] || '00';

  return new Date(`${year}-${month}-${day}`).getTime();
}
