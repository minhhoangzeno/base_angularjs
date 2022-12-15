import { createAction, props } from '@ngrx/store';
import { Scenario } from '@/app/@core/interfaces/business/scenario';

export const LOAD_SCENARIOS = createAction(
  '[⚡ Scenario API] Load Scenarios',
  props<{ planId: string }>(),
);
export const LOAD_SCENARIOS_SUCCESS = createAction(
  '[🤖 Scenario API] Load Scenarios success',
  props<{ data: Scenario[] }>(),
);
export const LOAD_SCEANRIO_FAILED = createAction(
  '[🤖 Scenario API] Load Scenario failed',
  props<{ error: any }>(),
);

export const SAVE_SCENARIO_SUCCESS = createAction(
  '[🤖 Scenaio API] Save Scenario success',
  props<{ scenario: Scenario, reSimulate: boolean }>(),
);
export const SAVE_SCENARIO_FAILED = createAction(
  '[🤖 Scenaio API] Save Scenario failed',
  props<{ error: any }>(),
);
export const DELETE_SCENARIO_SUCCESS = createAction(
  '[🤖 Scenaio API] Delete Scenario success',
  props<{ scenario: Scenario }>(),
);
export const DELETE_SCENARIO_FAILED = createAction(
  '[🤖 Scenaio API] Delete Scenario failed',
  props<{ error: any }>(),
);
export const CLONE_SCENARIO_SUCCESS = createAction(
  '[🤖 Scenario API] Clone Scenario success',
  props<{ scenario: Scenario, reSimulate: boolean }>(),
);
export const CLONE_SCENARIO_FAILED = createAction(
  '[🤖 Scenario API] Clone Scenario failed',
  props<{ error: any }>(),
);

export const LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS = createAction(
  '[⚡️ Scenaio API] Load legacy Actual & Committed Scenarios',
  props<{ planId: string }>(),
);
export const LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS = createAction(
  '[🤖 Scenaio API] Load legacy Actual & Committed Scenarios success',
  props<{ data: Scenario[] }>(),
);
export const LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_FAILED = createAction(
  '[🤖 Scenaio API] Load legacy Actual & Committed Scenarios failed',
  props<{ error: any }>(),
);
export const LOAD_PRIMARY_SCENARIOS = createAction(
  '[⚡ Scenario API] Load Primary Scenarios',
  props<{ workspaceId: string }>(),
);
export const LOAD_PRIMARY_SCENARIOS_SUCCESS = createAction(
  '[🤖 Scenario API] Load Primary Scenarios success',
  props<{ data: Scenario[] }>(),
);
export const LOAD_PRIMARY_SCEANRIO_FAILED = createAction(
  '[🤖 Scenario API] Load Primary Scenario failed',
  props<{ error: any }>(),
);
