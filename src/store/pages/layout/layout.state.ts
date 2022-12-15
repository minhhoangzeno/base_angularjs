import { createReducer, on } from '@ngrx/store';

import { Scenario } from '@/app/@core/interfaces/business/scenario';
import {
  CREATE_NEW_SCENARIO_LOCALLY_SUCCESS,
  CANCEL_SCENARIO_EDITING,
  BEGIN_CREATE_NEW_PLAN,
  HIGHLIGHT_SCENARIO,
  SELECTED_DATE_RANGE_CHANGED,
  SELECT_PLAN,
  SELECTED_SEGMENT_CHANGED,
  EDIT_SCENARIO,
  DELETE_SCENARIO,
  CREATE_NEW_PLAN_SUCCESS,
  CREATE_NEW_PLAN_FAILED,
} from './layout.actions';
import { SimpleDateRange } from '@/app/@core/interfaces/common/date-range';
import { CLONE_SCENARIO_SUCCESS, SAVE_SCENARIO_SUCCESS } from '@/store/scenario/scenario.actions';
import { ENSURE_NO_SCENARIO_IS_EDITING as ENSURE_NO_SCENARIO_IS_EDITING1 } from '../planning-explorer/planning-explorer.actions';
import { ENSURE_NO_SCENARIO_IS_EDITING as ENSURE_NO_SCENARIO_IS_EDITING2 } from '../supply-explorer/supply-explorer.actions';
import { DEFAULT_SEGMENT, Segment } from '@/app/@core/interfaces/business/segment';
import { SELECT_EVENT_VERSIONS } from '../demand-planning/demand-planning.actions';
import { SAVE_SEGMENT_SUCCESS } from '@/store/segment/segment.actions';
import { LOCALSTORAGE_KEY_SELECTED_PLAN_ID } from '@/app/pages/explorer/shared/explorer.utils';

export const PAGE__LAYOUT_STATE_KEY = 'page_layout';

/*************************************
 * State
 *************************************/

export interface ILayoutState {
  selectedPlanId?: string;
  creatingPlan: boolean;
  creatingPlan_error?: any;
  highlightedScenarioId?: string;
  editingScenario?: Scenario;
  editMode: boolean;
  selectedDateRange?: SimpleDateRange;
  selectedSegment?: Segment;
}

export const initialState: ILayoutState = {
  creatingPlan: false,
  selectedPlanId: undefined,
  highlightedScenarioId: undefined,
  editingScenario: undefined,
  editMode: false,
  selectedDateRange: undefined,
  selectedSegment: DEFAULT_SEGMENT,
};

/*************************************
 * Reducers
 *************************************/

export const page_layoutReducer = createReducer(
  initialState,
  on(
    SELECT_PLAN,
    (state, { plan }): ILayoutState => {
      localStorage.setItem(LOCALSTORAGE_KEY_SELECTED_PLAN_ID, plan.id);
      return {
        ...state,
        selectedPlanId: plan.id,
        // Clear edit mode when selecting plan
        editMode: false,
        editingScenario: undefined,
        // Update the dateRange to plan's default
        selectedDateRange: {
          start: plan.defaultPlanDisplayStartDate,
          end: plan.defaultPlanDisplayEndDate,
        },
      };
    },
  ),
  on(
    HIGHLIGHT_SCENARIO,
    (state, { id }): ILayoutState => ({
      ...state,
      highlightedScenarioId: id,
      // If highlighted changed, turn off edit mode
      editMode: state.highlightedScenarioId !== id ? false : state.editMode,
    }),
  ),
  on(
    EDIT_SCENARIO,
    (state, { scenario }): ILayoutState => ({
      ...state,
      editMode: true,
      editingScenario: scenario,
    }),
  ),
  on(
    CREATE_NEW_SCENARIO_LOCALLY_SUCCESS,
    (state, { scenario }): ILayoutState => ({
      ...state,
      editMode: true,
      editingScenario: scenario,
      highlightedScenarioId: scenario.id,
    }),
  ),
  on(
    SAVE_SCENARIO_SUCCESS,
    CLONE_SCENARIO_SUCCESS,
    (state, { scenario }): ILayoutState => ({
      ...state,
      highlightedScenarioId: scenario.id,
      editMode: false,
      editingScenario: undefined,
    }),
  ),
  on(
    BEGIN_CREATE_NEW_PLAN,
    (state): ILayoutState => ({ ...state, creatingPlan: true, creatingPlan_error: undefined }),
  ),
  on(
    CREATE_NEW_PLAN_FAILED,
    (state, { error }): ILayoutState => ({
      ...state,
      creatingPlan: false,
      creatingPlan_error: error,
    }),
  ),
  on(
    CREATE_NEW_PLAN_SUCCESS,
    (state, { plan }): ILayoutState => ({ ...state, creatingPlan: false, selectedPlanId: plan.id }),
  ),
  on(
    SELECTED_DATE_RANGE_CHANGED,
    (state, { data: range }): ILayoutState => ({ ...state, selectedDateRange: range }),
  ),
  on(
    SELECTED_SEGMENT_CHANGED,
    (state, { segment: data }): ILayoutState => ({
      ...state,
      selectedSegment: data,
    }),
  ),
  on(
    SAVE_SEGMENT_SUCCESS,
    (state, { data }): ILayoutState => ({
      ...state,
      selectedSegment: data,
    }),
  ),
  on(
    SELECT_EVENT_VERSIONS,
    (state, { ids }): ILayoutState => ({
      ...state,
      editingScenario: state.editingScenario
        ? {
            ...state.editingScenario,
            events: ids,
          }
        : undefined,
    }),
  ),
  on(
    CANCEL_SCENARIO_EDITING,
    ENSURE_NO_SCENARIO_IS_EDITING1,
    ENSURE_NO_SCENARIO_IS_EDITING2,
    (state): ILayoutState => ({ ...state, editMode: false, editingScenario: undefined }),
  ),
  on(
    DELETE_SCENARIO,
    (state, { scenario }): ILayoutState => ({
      ...state,
      ...(scenario.blankScenario ? { editMode: false, editingScenario: undefined } : {}),
    }),
  ),
);
