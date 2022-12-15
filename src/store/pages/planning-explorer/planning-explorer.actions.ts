import { IGetKpisParams, IGetSpChartDataParams } from '@/app/@core/services/kpis.service';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { createAction, props } from '@ngrx/store';

export const ENSURE_NO_SCENARIO_IS_EDITING = createAction(
  '[🤖 Planning Explorer Page] Ensure no Scenario is editing',
);

export const LOAD_KPIS_DATA = createAction(
  '[⚡ Biz Page] Load Breakdowns data',
  props<{ params: IGetKpisParams }>(),
);

export const LOAD_KPIS_DATA_SUCCESS = createAction(
  '[🤖 Biz Page] Load Breakdowns data success',
  props<{ data: any }>(),
);

export const LOAD_KPIS_DATA_FAILED = createAction(
  '[🤖 Biz Page] Load Breakdowns data failed',
  props<{ error: any }>(),
);

export const LOAD_SP_CHART_DATA = createAction(
  '[⚡ Biz Page] Load "Sale & Profit" Chart data',
  props<{ params: IGetSpChartDataParams }>(),
);

export const LOAD_SP_CHART_DATA_SUCCESS = createAction(
  '[🤖 Biz Page] Load "Sale & Profit" Chart data success',
  props<{ data: any }>(),
);

export const LOAD_SP_CHART_DATA_FAILED = createAction(
  '[🤖 Biz Page] Load "Sale & Profit" Chart data failed',
  props<{ error: any }>(),
);
export const UPDATE_SP_CHART_DATE_AGG = createAction(
  '[🌱 Biz Page] Update "Sale & Profit" Chart Aggregate Option',
  props<{ option: DateAggregationOption }>(),
);
