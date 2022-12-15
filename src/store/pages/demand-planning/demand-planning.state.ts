import { createReducer, on } from '@ngrx/store';

import { DataZoomEvent } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.component';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import {
  DEFAULT_DEMAND_CHART_RESPONSE,
  IDemandChartResponse,
  LOAD_DEMAND_CHART_DATA,
  LOAD_DEMAND_CHART_DATA_FAILED,
  LOAD_DEMAND_CHART_DATA_SUCCESS,
  LOAD_DEMAND_IMPACTS_CHART_DATA,
  LOAD_DEMAND_IMPACTS_CHART_DATA_FAILED,
  LOAD_DEMAND_IMPACTS_CHART_DATA_SUCCESS,
  UPDATE_DATE_AGGREGATION,
  UPDATE_DATE_ZOOM,
  UPDATE_DEMAND_GROUPING,
} from './demand-planning.actions';

export const PAGE__DEMAND_PLANNING_STATE_KEY = 'page_demandPlanning';

/*************************************
 * State
 *************************************/

export interface IDemandPlanningPageState {
  datesSubfiltering?: DataZoomEvent;
  groupings: ReadonlyArray<string>;
  dateAggregation: DateAggregationOption;
  demands: IDemandChartResponse;
  demands_loading: boolean;
  demands_error?: any;
  impacts: IDemandChartResponse;
  impacts_loading: boolean;
  impacts_error?: any;
}

export const initialState: IDemandPlanningPageState = {
  dateAggregation: DateAggregationOption.WEEK,
  groupings: ['channel', 'subCategory', 'brands'],
  demands: DEFAULT_DEMAND_CHART_RESPONSE,
  impacts: DEFAULT_DEMAND_CHART_RESPONSE,
  demands_loading: false,
  impacts_loading: false,
};

/*************************************
 * Reducers
 *************************************/

export const page_demandPLanningReducer = createReducer(
  initialState,
  on(
    UPDATE_DATE_ZOOM,
    (state, { zoom }): IDemandPlanningPageState => ({ ...state, datesSubfiltering: zoom }),
  ),
  on(
    UPDATE_DATE_AGGREGATION,
    (state, { dateAggregation }): IDemandPlanningPageState => ({
      ...state,
      dateAggregation,
    }),
  ),
  on(
    LOAD_DEMAND_CHART_DATA,
    (state): IDemandPlanningPageState => ({
      ...state,
      demands_loading: true,
      demands_error: undefined,
    }),
  ),
  on(
    LOAD_DEMAND_CHART_DATA_SUCCESS,
    (state, { data }): IDemandPlanningPageState => ({
      ...state,
      demands: data,
      demands_loading: false,
      demands_error: undefined,
    }),
  ),
  on(
    LOAD_DEMAND_CHART_DATA_FAILED,
    (state, { error }): IDemandPlanningPageState => ({
      ...state,
      demands: DEFAULT_DEMAND_CHART_RESPONSE,
      demands_loading: false,
      demands_error: error,
    }),
  ),

  on(
    LOAD_DEMAND_IMPACTS_CHART_DATA,
    (state): IDemandPlanningPageState => ({
      ...state,
      impacts_loading: true,
      impacts_error: undefined,
    }),
  ),
  on(
    LOAD_DEMAND_IMPACTS_CHART_DATA_SUCCESS,
    (state, { data }): IDemandPlanningPageState => ({
      ...state,
      impacts: data,
      impacts_loading: false,
      impacts_error: undefined,
    }),
  ),
  on(
    LOAD_DEMAND_IMPACTS_CHART_DATA_FAILED,
    (state, { error }): IDemandPlanningPageState => ({
      ...state,
      impacts: DEFAULT_DEMAND_CHART_RESPONSE,
      impacts_loading: false,
      impacts_error: error,
    }),
  ),
  on(
    UPDATE_DEMAND_GROUPING,
    (state, { data }): IDemandPlanningPageState => ({ ...state, groupings: data }),
  ),
);
