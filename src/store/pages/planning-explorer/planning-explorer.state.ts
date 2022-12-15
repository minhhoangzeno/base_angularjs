import { Breakdown } from '@/app/@core/interfaces/business/breakdown';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { createReducer, on } from '@ngrx/store';
import {
  LOAD_KPIS_DATA,
  LOAD_KPIS_DATA_FAILED,
  LOAD_KPIS_DATA_SUCCESS,
  LOAD_SP_CHART_DATA,
  LOAD_SP_CHART_DATA_FAILED,
  LOAD_SP_CHART_DATA_SUCCESS,
  UPDATE_SP_CHART_DATE_AGG,
} from './planning-explorer.actions';

export const PAGE__BIZ_STATE_KEY = 'page_biz';

interface IGetKpisChartDataResponse {
  columns: string[];
  rows: Array<[string, Array<Breakdown | null>]>;
}

/*************************************
 * State
 *************************************/

export interface IBizPageState {
  kpis?: Record<string, Breakdown>;
  kpis_loading: boolean;
  kpis_error?: any;
  spChart?: IGetKpisChartDataResponse;
  spChart_loading: boolean;
  spChart_error?: any;
  spChart_dateAgg: DateAggregationOption;
}

export const initialState: IBizPageState = {
  kpis_loading: false,
  spChart_loading: false,
  spChart_dateAgg: DateAggregationOption.WEEK,
};

/*************************************
 * Reducers
 *************************************/

export const page_bizReducer = createReducer(
  initialState,
  on(
    LOAD_KPIS_DATA,
    (state): IBizPageState => ({
      ...state,
      kpis_loading: true,
      kpis_error: undefined,
    }),
  ),
  on(
    LOAD_KPIS_DATA_SUCCESS,
    (state, { data }): IBizPageState => ({
      ...state,
      kpis: data,
      kpis_loading: false,
      kpis_error: undefined,
    }),
  ),
  on(
    LOAD_KPIS_DATA_FAILED,
    (state, { error }): IBizPageState => ({
      ...state,
      kpis_loading: false,
      kpis_error: error,
    }),
  ),
  on(
    LOAD_SP_CHART_DATA,
    (state): IBizPageState => ({
      ...state,
      spChart_loading: true,
      spChart_error: undefined,
    }),
  ),
  on(
    LOAD_SP_CHART_DATA_SUCCESS,
    (state, { data }): IBizPageState => ({
      ...state,
      spChart: data,
      spChart_loading: false,
      spChart_error: undefined,
    }),
  ),
  on(
    LOAD_SP_CHART_DATA_FAILED,
    (state, { error }): IBizPageState => ({
      ...state,
      spChart_loading: false,
      spChart_error: error,
    }),
  ),
  on(
    UPDATE_SP_CHART_DATE_AGG,
    (state, { option }): IBizPageState => ({ ...state, spChart_dateAgg: option }),
  ),
);
