import { createAction, props } from '@ngrx/store';

import { Plan } from '@/app/@core/interfaces/business/plan';
import { Segment, SegmentFilter } from '@/app/@core/interfaces/business/segment';
import { SimpleDateRange } from '@/app/@core/interfaces/common/date-range';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { EventVersion } from '@/app/@core/interfaces/business/event';
import { ICreatePlanImportParams } from '@/app/@core/backend/simcel/plan-import.service';
import { PlanSetting } from '@/app/@core/interfaces/business/plan-setting';

export const REFRESH_PLANS = createAction('[🌱 Layout] Refresh Plans');
export const SHOW_SCENARIO = createAction(
  '[🌱 Layout] Show Scenario',
  props<{ scenario: Scenario }>(),
);
export const SET_SCENARIOS = createAction(
  '[🌱 Layout] SETS Scenarios',
  props<{ scenarios: Scenario[] }>(),
);
export const HIDE_SCENARIO = createAction(
  '[🌱 Layout] Hide Scenario',
  props<{ scenario: Scenario }>(),
);
export const HIGHLIGHT_SCENARIO = createAction(
  '[🌱 Layout] Hightlight Scenario',
  props<{ id: string }>(),
);
export const SET_PRIMARY_SCENARIO = createAction(
  '[🌱 Layout] Set Primary Scenario',
  props<{ scenario: Scenario }>(),
);
export const CLONE_SCENARIO = createAction(
  '[🌱 Layout] Clone Scenario',
  props<{ scenario: Scenario }>(),
);
export const SAVE_SCENARIO = createAction(
  '[🌱 Layout] Save Scenario',
  props<{ scenario: Scenario, reSimulate: boolean }>(),
);
export const DELETE_SCENARIO = createAction(
  '[🌱 Layout] Delete Scenario',
  props<{ scenario: Scenario }>(),
);
export const HIDE_DISPLAYED_SCENARIO = createAction(
  '[🌱 Layout] Hide Displayed Scenario',
  props<{ scenario: Scenario }>(),
);
export const ADD_DISPLAYED_SCENARIO = createAction(
  '[🌱 Layout] Add Displayed Scenario',
  props<{ scenario: Scenario }>(),
);

export const CHANGE_DISPLAYED_SCENARIO = createAction(
  '[🌱 Layout] Change Displayed Scenario',
  props<{ scenarios: Scenario[] }>(),
);
export const DELETE_DISPLAYED_SCENARIO = createAction(
  '[🌱 Layout] Delete Displayed Scenario',
  props<{ scenario: Scenario }>(),
);
export const CREATE_NEW_SCENARIO_LOCALLY = createAction('[🌱 Layout] Create new Scenario locally');
export const CREATE_NEW_SCENARIO_LOCALLY_SUCCESS = createAction(
  '[🤖 Layout Effect] Create new Scenario locally Success',
  props<{ scenario: Scenario }>(),
);
export const EDIT_SCENARIO = createAction(
  '[🌱 Layout] Edit Scenario',
  props<{ scenario: Scenario }>(),
);
export const SWITCH_SCENARIO_EDIT_MODE = createAction(
  '[🌱 Layout] Switch Scenario edit mode',
  props<{ editing: boolean }>(),
);
export const CANCEL_SCENARIO_EDITING = createAction('[🌱 Layout] Cancel editing Scenario');

// TODO: migrate logic of creating new plan to store
export const SELECT_PLAN = createAction('[🌱 Layout] Select Plan', props<{ plan: Plan }>());
export const BEGIN_CREATE_NEW_PLAN = createAction(
  '[🌱 Layout] Creating new Plan...',
  props<{ params: ICreatePlanImportParams }>(),
);
export const CREATE_NEW_PLAN_SUCCESS = createAction(
  '[⚡️ Layout] New Plan created',
  props<{ plan: Plan }>(),
);
export const CREATE_NEW_PLAN_FAILED = createAction(
  '[⚡️ Layout] Failed to create new Plan!',
  props<{ error: any }>(),
);
export const SELECTED_DATE_RANGE_CHANGED = createAction(
  '[🌱 Layout] Select DateRange Changed',
  props<{ data: SimpleDateRange | undefined }>(),
);
export const SAVE_SEGMENT = createAction(
  '[🌱 Layout] Save Segment',
  props<{ segmentName: string }>(),
);
export const DELETE_SEGMENT = createAction(
  '[🌱 Layout] Delete Segment',
  props<{ segment: Segment }>(),
);
export const EDIT_SEGMENT = createAction(
  '[🌱 Layout] Edit Segment',
  props<{ segment: Segment }>(),
);
export const UPDATE_SELECTED_SEGMENT = createAction(
  '[🌱 Layout] Update selected Segment',
  props<{
    product?: SegmentFilter[];
    customer?: SegmentFilter[];
    location?: SegmentFilter[];
  }>(),
);
export const SELECTED_SEGMENT_CHANGED = createAction(
  '[🌱 Layout] Selected Segment changed',
  props<{ segment?: Segment }>(),
);

export const DO_LOGOUT = createAction('[🌱 Layout] Logout');
