import { Demand } from './demand';

/**
 * Defines a KPI breakdown, where each of the property is a measurement of
 * success for the supply chain network.
 *
 * This structure is used mostly as a receiver for aggregated KPI endpoints.
 * The `_id` property defines how the retrieved aggregated KPI endpoints are
 * grouped.
 *
 * The current implementation in the backend only groups by date, so the
 * format of the `_id` property looks like:
 *
 *  _id: {
 *    "day": "DD",
 *    "month": "MM",
 *    "year": "YYYY",
 *  }
 *
 * TODO(nathanielcapule): Consider renaming `_id` to `grouping` or flattening.
 */
export declare interface Breakdown {
  /** Indicator of how the retrieved KPIs are grouped before being aggregated. */
  _id?: { [key: string]: any };

  /** @deprecated This field will not be return in the new KPI endpoint */
  id: string;
  demandValue: number;
  netSalesValue: number;
  grossSalesValue: number;
  discountsRebates: number;
  cogs: number;
  transferCost: number;
  storageCost: number;
  handlingCost: number;
  distributionCost: number;
  dispatchQuantity: number;
  orderQuantity: number;
  averageInventoryValue: number;
  count?: number;
  CO2?: number;
}

/** Returns a zero-valued breakdown. */
export function emptyBreakdown(): Breakdown {
  return {
    id: '',
    demandValue: 0,
    netSalesValue: 0,
    grossSalesValue: 0,
    discountsRebates: 0,
    cogs: 0,
    transferCost: 0,
    storageCost: 0,
    handlingCost: 0,
    distributionCost: 0,
    orderQuantity: 0,
    dispatchQuantity: 0,
    averageInventoryValue: 0,
    CO2: 0,
    count: 0,
  };
}

/** Merge together a given list of breakdowns' KPI stats. */
export function mergeBreakdowns(...breakdowns: Breakdown[]) {
  // Base KPI.
  const base = emptyBreakdown();
  // List of property names that corresponds to a KPI. It excludes 'id' of course.
  const kpiProps = Object.keys(base).filter((prop) => prop !== 'id') as (keyof Breakdown)[];

  // Sum all the KPI properties of the listed breakdowns.
  return breakdowns.reduce((prev, curr) => {
    kpiProps.forEach((prop) => ((prev[prop] as number) += +(curr?.[prop] || 0)));
    return prev;
  }, base);
}

/** Utility function for calculating storage and handling cost from a KPI breakdown. */
export function calculateStorageAndHandling(breakdown?: Breakdown | null): number | null {
  if (!breakdown) return null;
  return breakdown.storageCost + breakdown.handlingCost;
}

export function calculateStorageAndDistribution(breakdown?: Breakdown | null): number | null {
  if (!breakdown) return null;
  return (
    breakdown.transferCost +
    breakdown.distributionCost +
    breakdown.storageCost +
    breakdown.handlingCost
  );
}

/** Utility function for calculating CBM of a KPI breakdown. */
export function calculateCbm(breakdown?: Breakdown | null): number | null {
  if (!breakdown) return null;
  const storage = calculateStorageAndHandling(breakdown);
  return (
    breakdown.netSalesValue -
    breakdown.cogs -
    breakdown.transferCost -
    breakdown.distributionCost -
    (storage || 0)
  );
}

export function calculateServiceLevel(breakdown?: Breakdown | null): number | null {
  if (!breakdown) return null;
  return (breakdown.dispatchQuantity / breakdown.orderQuantity) * 100;
}

export function calculateMargin(breakdown?: Breakdown | null): number | null {
  const cbm = calculateCbm(breakdown);
  if (!breakdown || cbm === null) return null;
  return (cbm / breakdown.netSalesValue) * 100;
}

/**
 * Utility function for calculating timestamp from _id property of a KPI breakdown.
 *
 * The name of the `_id` property comes from the hardcoded column name needed by
 * MongoDB when wanting to group an aggregation (ie. GROUP BY in SQL), which is
 * why we reuse this convention in the frontend.
 */
export function calculateTimestamp(breakdown: Breakdown | Demand): number {
  const grouping = breakdown._id;
  if (!grouping) {
    return 0;
  }
  const year = grouping['year'] || '0000';
  const month = grouping['month'] || '00';
  const day = grouping['day'] || '00';

  return new Date(`${year}-${month}-${day}`).getTime();
}

// Todo : refactor to use enum for all possible types of KPIs
export type BreakdownKpis =
  | keyof Breakdown
  | 'cbm'
  | 'storageAndHandling'
  | 'serviceLevel'
  | 'margin'
  | 'storageAndDistribution';
export interface KpiMetadata {
  shortName: BreakdownKpis;
  name: string;
  type: 'profit' | 'lost';
  measureIn: 'value' | 'percentage';
  getter?: (b?: Breakdown | null) => number | null;
}

/** List of KPI metadatas. */

// change Type readony to any : because change list sort
export const BREAKDOWN_KPIS_INFO_LIST: Array<KpiMetadata> = [
  { shortName: 'demandValue', name: 'Demand Value (USD)', type: 'profit', measureIn: 'value' },
  { shortName: 'orderQuantity', name: 'Demand\nVolume (CTN)', type: 'profit', measureIn: 'value' },
  { shortName: 'dispatchQuantity', name: 'Sale\nVolume (USD)', type: 'profit', measureIn: 'value' },
  {
    shortName: 'grossSalesValue',
    name: 'Gross Sales\nValue (USD)',
    type: 'profit',
    measureIn: 'value',
  },
  {
    shortName: 'discountsRebates',
    name: 'Trade\nExpenses (USD)',
    type: 'lost',
    measureIn: 'value',
  },
  {
    shortName: 'distributionCost',
    name: 'Distribution\nCost (USD)',
    type: 'lost',
    measureIn: 'value',
  },
  {
    shortName: 'netSalesValue',
    name: 'Net Sales\nValue (USD)',
    type: 'profit',
    measureIn: 'value',
  },
  { shortName: 'cogs', name: 'COGS (USD)', type: 'lost', measureIn: 'value' },
  { shortName: 'transferCost', name: 'Stock\nTransfer (USD)', type: 'lost', measureIn: 'value' },
  { shortName: 'storageCost', name: 'Storage (USD)', type: 'lost', measureIn: 'value' },
  { shortName: 'handlingCost', name: 'Customer\nDelivery (USD)', type: 'lost', measureIn: 'value' },
  {
    shortName: 'storageAndHandling',
    name: 'Storage\nand\nHandling (USD)',
    type: 'lost',
    getter: calculateStorageAndHandling,
    measureIn: 'value',
  },
  {
    shortName: 'storageAndDistribution',
    name: 'Storage\nAnd\nDistribution (USD)',
    type: 'lost',
    getter: calculateStorageAndDistribution,
    measureIn: 'value',
  },
  {
    shortName: 'cbm',
    name: 'Profit Before Marketing (USD)',
    type: 'profit',
    getter: calculateCbm,
    measureIn: 'value',
  },
  {
    shortName: 'margin',
    name: 'Margin (%)',
    type: 'profit',
    measureIn: 'percentage',
    getter: calculateMargin,
  },
  {
    shortName: 'serviceLevel',
    name: 'Service\nLevel (%)',
    type: 'profit',
    getter: calculateServiceLevel,
    measureIn: 'percentage',
  },
  {
    shortName: 'averageInventoryValue',
    name: 'Average\nInventory\nValue (USD)',
    type: 'lost',
    measureIn: 'value',
  },
  {
    shortName: 'CO2',
    name: 'CO2\nEmission (Kg)',
    type: 'lost',
    measureIn: 'value',
  },
];

// KPIS selected in Grouping
export const BREAKDOWN_KPIS_GROUPING_INFO_LIST: Array<KpiMetadata> = [
  { shortName: 'demandValue', name: 'Demand Value (USD)', type: 'profit', measureIn: 'value' },
  {
    shortName: 'netSalesValue',
    name: 'Net Sales\nValue (USD)',
    type: 'profit',
    measureIn: 'value',
  },
  { shortName: 'cogs', name: 'COGS (USD)', type: 'lost', measureIn: 'value' },
  {
    shortName: 'storageAndDistribution',
    name: 'Storage\nAnd\nDistribution (USD)',
    type: 'lost',
    getter: calculateStorageAndDistribution,
    measureIn: 'value',
  },
  {
    shortName: 'cbm',
    name: 'Profit Before Marketing (USD)',
    type: 'profit',
    getter: calculateCbm,
    measureIn: 'value',
  },
  {
    shortName: 'margin',
    name: 'Margin (%)',
    type: 'profit',
    measureIn: 'percentage',
    getter: calculateMargin,
  },
  {
    shortName: 'averageInventoryValue',
    name: 'Average\nInventory\nValue (USD)',
    type: 'lost',
    measureIn: 'value',
  },
];

/** Lookup of KPI metadata where key is the kpi shortname. */
export const BREAKDOWN_KPIS_INFO = BREAKDOWN_KPIS_INFO_LIST.reduce(
  (prev, curr) => ({
    ...prev,
    [curr.shortName]: curr,
  }),
  {} as Record<BreakdownKpis, KpiMetadata>,
);

/** Returns KPI numbers given a shortname. The shortname must exist in KPIS_INFO. */
export function kpiOf(breakdown: Breakdown | undefined, shortName: BreakdownKpis): number | null {
  if (!breakdown) return 0;

  const metadata = BREAKDOWN_KPIS_INFO[shortName];
  if (metadata?.getter) {
    return metadata.getter(breakdown);
  }
  return breakdown[shortName as keyof Breakdown] as number;
}
