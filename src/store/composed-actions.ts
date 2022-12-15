import { GET_CURRENT_USER_SUCCESS } from './auth/auth.actions';
import {
  DELETE_EVENT_VERSION_SUCCESS,
  LOAD_EVENTS_SUCCESS, SAVE_EVENT_VERSION_SUCCESS
} from './event/event.actions';
import {
  SELECT_EVENT_VERSIONS,
  UPDATE_DATE_AGGREGATION,
  UPDATE_DEMAND_GROUPING
} from './pages/demand-planning/demand-planning.actions';
import {
  CREATE_NEW_PLAN_SUCCESS, REFRESH_PLANS, SELECTED_DATE_RANGE_CHANGED,
  SELECTED_SEGMENT_CHANGED, SELECT_PLAN
} from './pages/layout/layout.actions';
import { UPDATE_SP_CHART_DATE_AGG } from './pages/planning-explorer/planning-explorer.actions';
import { ADD_DISPLAYED_SCENARIO_SUCCESS, CHANGED_DISPLAYED_SCENARIO_SUCCESS, DELETE_DISPLAYED_SCENARIO_SUCCESS, HIDE_DISPLAYED_SCENARIO_SUCCESS, LOAD_PLAN_SETTING_SUCCESS } from './plan-setting/planSetting.actions';
import {
  LOAD_PLANS_SUCCESS,
  SET_PRIMARY_SCENARIO_SUCCESS,
  UPDATE_DISPLAYED_SCENARIO_SUCCESS
} from './plan/plan.actions';
import {
  CLONE_SCENARIO_SUCCESS,
  DELETE_SCENARIO_SUCCESS,
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS,
  LOAD_SCENARIOS_SUCCESS,
  SAVE_SCENARIO_SUCCESS
} from './scenario/scenario.actions';
import { DELETE_SEGMENT_SUCCESS, EDIT_SEGMENT_SUCCESS, SAVE_SEGMENT_SUCCESS } from './segment/segment.actions';
import { SCENARIO_JUST_FINISHED_SIMULATION } from './task/task.actions';
import { SELECT_WORKSPACE } from './workspace/workspace.actions';

/***************************************
 * Common data
 **************************************/

// Load plan after Getting user info, or when selecting Workspace
export const SHOULD_LOAD_PLANS = [
  GET_CURRENT_USER_SUCCESS,
  SELECT_WORKSPACE,
  REFRESH_PLANS,
  CREATE_NEW_PLAN_SUCCESS,
];

export const SHOULD_LOAD_PLAN_SETTING = [
  // When new Plan are slected/loaded
  LOAD_PLANS_SUCCESS,
  SELECT_PLAN,
  CREATE_NEW_PLAN_SUCCESS,
  // After saved a Scenario
  ADD_DISPLAYED_SCENARIO_SUCCESS,
  HIDE_DISPLAYED_SCENARIO_SUCCESS,
  DELETE_DISPLAYED_SCENARIO_SUCCESS,
  // when display scenario change
  CHANGED_DISPLAYED_SCENARIO_SUCCESS
];

export const SHOULD_LOAD_SCENARIOS = [
  // Must reload scenario to fetch the output db
  SCENARIO_JUST_FINISHED_SIMULATION,
  // When new Plan are slected/loaded
  LOAD_PLANS_SUCCESS,
  SELECT_PLAN,
  CREATE_NEW_PLAN_SUCCESS,
  // After saved a Scenario
  SAVE_SCENARIO_SUCCESS,
  DELETE_SCENARIO_SUCCESS,
  CLONE_SCENARIO_SUCCESS,
  LOAD_PLAN_SETTING_SUCCESS,
];

export const SHOULD_LOAD_PRIMARY_SCENARIOS = [
  SELECT_WORKSPACE,
  LOAD_PLANS_SUCCESS,
  SET_PRIMARY_SCENARIO_SUCCESS,
];

// Load Saved Segments data
export const SHOULD_LOAD_SEGMENTS = [
  // After Plans loaded
  LOAD_PLANS_SUCCESS,
  // After selected Plan changed
  CREATE_NEW_PLAN_SUCCESS,
  SELECT_PLAN,
  // After saved a Segment
  SAVE_SEGMENT_SUCCESS,
  DELETE_SEGMENT_SUCCESS,
  EDIT_SEGMENT_SUCCESS,
];

// Load Saved Segments Options data
export const SHOULD_LOAD_SEGMENT_OPTIONS = [
  // After Plans loaded
  LOAD_PLANS_SUCCESS,
  // After selected Plan changed
  SELECT_PLAN,
  CREATE_NEW_PLAN_SUCCESS,
];

export const SHOULD_LOAD_EVENTS = [
  // After Plans loaded
  LOAD_PLANS_SUCCESS,
  // After selected Plan changed
  SELECT_PLAN,
  CREATE_NEW_PLAN_SUCCESS,
  // After edit/remove event version
  SAVE_EVENT_VERSION_SUCCESS,
  DELETE_EVENT_VERSION_SUCCESS,
  SELECTED_DATE_RANGE_CHANGED
];

/***************************************
 * Breakdown (KPI)
 **************************************/

export const SHOULD_LOAD_SCENARIO_BREAKDOWNS = [
  // When display Scenarios changed
  LOAD_SCENARIOS_SUCCESS,
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
];

export const SHOULD_LOAD_CURRENT_BREAKDOWNS = [
  // When selected plan changed
  LOAD_PLANS_SUCCESS,
  SELECT_PLAN,
  CREATE_NEW_PLAN_SUCCESS,
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
];

export const SOULD_LOAD_ACTUAL_BREAKDOWNS = [
  // When selected plan changed
  LOAD_PLANS_SUCCESS,
  CREATE_NEW_PLAN_SUCCESS,
  SELECT_PLAN,
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
];

export const SOULD_LOAD_COMMITTED_BREAKDOWNS = SOULD_LOAD_ACTUAL_BREAKDOWNS;

export const SHOULD_LOAD_KPIS_DATA = [
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
  // When scenario finished sumulation
  SCENARIO_JUST_FINISHED_SIMULATION,
  LOAD_PLAN_SETTING_SUCCESS,
];
export const SHOULD_LOAD_KPIS_CHART_DATA = [
  ...SHOULD_LOAD_KPIS_DATA,
  // When Aggregation change
  UPDATE_SP_CHART_DATE_AGG,
];

/*************************************************************
 * Demand
 ************************************************************/

export const SHOULD_LOAD_DEMAND_CHART_DATA = [
  // After Plans loaded
  LOAD_PLANS_SUCCESS,
  // When select Plan
  SELECT_PLAN,
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
  // When grouping changed
  UPDATE_DEMAND_GROUPING,
  // When Aggregation change
  UPDATE_DATE_AGGREGATION,
];
export const SHOULD_LOAD_DEMAND_IMPACT_CHART_DATA = [
  // When selected Scenarios changed
  LOAD_SCENARIOS_SUCCESS,
  // When Actual & Committed Scenarios changed
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS,
  // When selecting events -> load impact
  SELECT_EVENT_VERSIONS,
  // When show/hide scenario
  UPDATE_DISPLAYED_SCENARIO_SUCCESS,
  // When select saved segments changed
  SELECTED_SEGMENT_CHANGED,
  // When date range changed
  SELECTED_DATE_RANGE_CHANGED,
  // When grouping changed
  UPDATE_DEMAND_GROUPING,
  // When Aggregation change
  UPDATE_DATE_AGGREGATION,
];

/*************************************************************
 * Tasks
 ************************************************************/

export const SHOULD_FETCH_TASK_STATUSES = [
  LOAD_PLANS_SUCCESS,
  LOAD_SCENARIOS_SUCCESS,
  LOAD_EVENTS_SUCCESS,
];
