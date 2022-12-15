import { createAction, props } from '@ngrx/store';
import { PlanSetting } from '../../app/@core/interfaces/business/plan-setting';

export const LOAD_PLAN_SETTING = createAction(
  '[⚡ Plan Setting API] Load Plan Setting',
  props<{ planId: string }>(),
);
export const LOAD_PLAN_SETTING_SUCCESS = createAction(
  '[🤖 Plan Setting API] Load Plan Setting success',
  props<{ planSetting: PlanSetting }>(),
);
export const LOAD_PLAN_SETTING_FAILED = createAction(
  '[🤖 Plan Setting API] Load Plan Setting failed',
  props<{ error: any }>(),
);

export const ADD_DISPLAYED_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan Setting API] Add Displayed Scenario success',
  props<{ planSetting: PlanSetting }>(),
);


export const ADD_DISPLAYED_SCENARIO_FAILED = createAction(
  '[🤖 Plan Setting API] Add Displayed Scenario failed',
  props<{ error: any }>(),
);
export const DELETE_DISPLAYED_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan Setting API] Delete Displayed Scenario success',
  props<{ planSetting: PlanSetting }>(),
);
export const DELETE_DISPLAYED_SCENARIO_FAILED = createAction(
  '[🤖 Plan Setting API] Delete Displayed Scenario failed',
  props<{ error: any }>(),
);
export const HIDE_DISPLAYED_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan Setting API] Hide Displayed Scenario success',
  props<{ planSetting: PlanSetting }>(),
);
export const HIDE_DISPLAYED_SCENARIO_FAILED = createAction(
  '[🤖 Plan Setting API] Hide Displayed Scenario failed',
  props<{ error: any }>(),
);


export const CHANGED_DISPLAYED_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan Setting API] Change Displayed Scenario success',
  props<{ planSetting: PlanSetting }>(),
);


export const CHANGE_DISPLAYED_SCENARIO_FAILED = createAction(
  '[🤖 Plan Setting API] Change Displayed Scenario failed',
  props<{ error: any }>(),
);