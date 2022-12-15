import { createReducer, on } from '@ngrx/store';
import { PlanSetting } from '../../app/@core/interfaces/business/plan-setting';
import {
  ADD_DISPLAYED_SCENARIO_FAILED,
  ADD_DISPLAYED_SCENARIO_SUCCESS,
  CHANGED_DISPLAYED_SCENARIO_SUCCESS,
  CHANGE_DISPLAYED_SCENARIO_FAILED,
  DELETE_DISPLAYED_SCENARIO_FAILED,
  DELETE_DISPLAYED_SCENARIO_SUCCESS,
  HIDE_DISPLAYED_SCENARIO_FAILED,
  HIDE_DISPLAYED_SCENARIO_SUCCESS,
  LOAD_PLAN_SETTING,
  LOAD_PLAN_SETTING_FAILED,
  LOAD_PLAN_SETTING_SUCCESS
} from './planSetting.actions';

export const PLAN_SETTING_STATE_KEY = 'plan-setting';

/*************************************
 * State
 *************************************/

export interface IPlanSettingState {
  planSetting?: PlanSetting;
  loading: boolean;
  saving: boolean;
  errors: string[];
}

export const initialState: IPlanSettingState = {
  loading: false,
  saving: false,
  errors: [],
};

/*************************************
 * Reducers
 *************************************/

export const planSettingReducer = createReducer(
  initialState,
  on(LOAD_PLAN_SETTING, (state: IPlanSettingState): IPlanSettingState => ({ ...state, loading: true })),
  on(
    LOAD_PLAN_SETTING_SUCCESS,
    (state, { planSetting }): IPlanSettingState => ({ ...state, loading: false, planSetting }),
  ),

  on(
    LOAD_PLAN_SETTING_FAILED,
    (state, { error }): IPlanSettingState => ({
      ...state,
      loading: false,
      planSetting: { id: '', planRef: '', userId: '', displayedScenarios: [] },
      errors: error,
    }),
  ),
  on(
    ADD_DISPLAYED_SCENARIO_SUCCESS,
    HIDE_DISPLAYED_SCENARIO_SUCCESS,
    DELETE_DISPLAYED_SCENARIO_SUCCESS,
    CHANGED_DISPLAYED_SCENARIO_SUCCESS,
    (state): IPlanSettingState => ({ ...state, saving: false }),
  ),
  on(
    ADD_DISPLAYED_SCENARIO_FAILED,
    HIDE_DISPLAYED_SCENARIO_FAILED,
    DELETE_DISPLAYED_SCENARIO_FAILED,
    CHANGE_DISPLAYED_SCENARIO_FAILED,
    (state): IPlanSettingState => ({ ...state, saving: false }),
  ),
);
