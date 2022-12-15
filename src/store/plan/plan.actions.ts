import { createAction, props } from '@ngrx/store';
import { Plan } from '@/app/@core/interfaces/business/plan';

export const LOAD_PLANS = createAction('[⚡ Plan API] Load Plans');
export const LOAD_PLANS_SUCCESS = createAction(
  '[🤖 Plan API] Load Plans success',
  props<{ data: Plan[] }>(),
);
export const LOAD_PLANS_FAILED = createAction(
  '[🤖 Plan API] Load Plans failed',
  props<{ error: any }>(),
);

export const SET_PRIMARY_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan API] Set Primary Scenario success',
  props<{ plan: Plan }>(),
);
export const SET_PRIMARY_SCENARIO_FAILED = createAction(
  '[🤖 Plan API] Set Primary Scenario failed',
  props<{ error: any }>(),
);
export const UPDATE_DISPLAYED_SCENARIO_SUCCESS = createAction(
  '[🤖 Plan API] Update displayed Scenario success',
  props<{ plan: Plan }>(),
);
export const UPDATE_DISPLAYED_SCENARIO_FAILED = createAction(
  '[🤖 Plan API] Update displayed Scenario failed',
  props<{ error: any }>(),
);
