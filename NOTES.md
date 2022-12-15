# Architecture / Design Notes

## Endpoints and models

```txt
// ENDPOINTS

- Get Scenario:             GET     /v1/api/scenarios/:id
  RETURN: Scenario (check out MODELS section)
  PARAMS
    - products  : []string   // list of product ids for filter
    - customers : []string   // list of customer ids for filter
    - locations : []string   // list of location ids for filter
    - dateRange.startDateMs : number
    - dateRange.endDateMs   : number
- Get Scenario Breakdown:   GET     /v1/api/scenarios/:id/breakdown
  RETURN: Breakdown (check out MODELS section)
  PARAMS: same as Get Scenario
- Get Scenario Kpis:        GET     /v1/api/scenarios/:id/kpis
  RETURN: Kpis (check out MODELS section)
  PARAMS: same as Get Scenario
- Get Scenario Timeseries:  GET     /v1/api/scenarios/:id/timeseries
  RETURN: Timeseries (check out MODELS section)
  PARAMS: same as Get Scenario
```

```typescript
// MODELS

export interface Product {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export declare interface DateRange {
  startDateMs: number;
  endDateMs: number;
}

export declare interface Event {
  id: string;
  name: string;
}

export declare interface Scenario {
  id: string;
  name: string;
  plan: string;
  products: Product[];
  customers: Customer[];
  locations: Location[];
  dateRange: DateRange;
  selectedEvents: Event[];
}

export declare interface Breakdown {
  grossSalesValue: number;
  discountsRebates: number;
  netSalesValue: number;
  cogs: number;
  stockTransfer: number;
  storageAndHandling: number;
  customerDelivery: number;
  cbm: number;
}

export declare interface Kpi {
  id: number;
  name: string;
  unit: string;
  globalValue: number;
}

export declare interface Segment {
  id: string;
  name: string;
  products?: Product[];
  customers?: Customer[];
  locations?: Location[];
  dateRange?: DateRange;
}

export declare interface Datapoint {
  timestamp: number;
  netSalesValue: number;
  cbm: number;
  salesVolume: number;
}

export declare interface Timeseries {
  data: Datapoint[];
}
```
