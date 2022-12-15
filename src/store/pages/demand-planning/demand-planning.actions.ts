import { createAction, props } from '@ngrx/store';

import { DataZoomEvent } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.component';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import {
  IGetDemandImpactsChartDataParams,
  IGetDemandsChartDataParams,
} from '@/app/@core/entity/demand.service';

// Copied from backend
export interface IDemandTreeNode {
  key: string;
  label: string;
  data: Array<number | null>;
  children?: IDemandTreeNode[];
}

export interface IDemandChartResponse {
  columns: string[];
  rows: Array<[string, Array<number | null>]>;
  tree: IDemandTreeNode[];
}

export const DEFAULT_DEMAND_CHART_RESPONSE: IDemandChartResponse = {
  columns: [],
  rows: [],
  tree: [],
};

export const UPDATE_DATE_ZOOM = createAction(
  '[🤖 Demand Chart] Update DataZoom',
  props<{ zoom: DataZoomEvent }>(),
);
export const UPDATE_DEMAND_GROUPING = createAction(
  '[🌱 Demand Planning Page] Update Demand Grouping',
  props<{ data: string[] }>(),
);

export const UPDATE_DATE_AGGREGATION = createAction(
  '[🤖 Demand Planning Page] Update Date Aggregation',
  props<{ dateAggregation: DateAggregationOption }>(),
);

export const SELECT_EVENT_VERSIONS = createAction(
  '[🌱 Demand Planning Page] Selected Event Versions changed',
  props<{ ids: string[] }>(),
);
export const LOAD_DEMAND_CHART_DATA = createAction(
  '[⚡ Demand Planning Page] Load Demand Chart data',
  props<{ params: IGetDemandsChartDataParams }>(),
);

export const LOAD_DEMAND_CHART_DATA_SUCCESS = createAction(
  '[🤖 Demand Planning Page] Load Demand Chart data success',
  props<{ data: IDemandChartResponse }>(),
);
export const LOAD_DEMAND_CHART_DATA_FAILED = createAction(
  '[🤖 Demand Planning Page] Load Demand Chart data failed',
  props<{ error: any }>(),
);

export const LOAD_DEMAND_IMPACTS_CHART_DATA = createAction(
  '[⚡ Demand Planning Page] Load Demand Impacts Chart data',
  props<{ params: IGetDemandImpactsChartDataParams }>(),
);

export const LOAD_DEMAND_IMPACTS_CHART_DATA_SUCCESS = createAction(
  '[🤖 Demand Planning Page] Load Demand Impacts Chart data success',
  props<{ data: IDemandChartResponse }>(),
);
export const LOAD_DEMAND_IMPACTS_CHART_DATA_FAILED = createAction(
  '[🤖 Demand Planning Page] Load Demand Impacts Chart data failed',
  props<{ error: any }>(),
);
