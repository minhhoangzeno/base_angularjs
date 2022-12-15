import { PlanImport } from '@/app/@core/interfaces/business/plan-import';
import { createAction, props } from '@ngrx/store';

export const LOAD_PLAN_IMPORTS = createAction('[🤖 PlanImport Effect] Load PlanImports');
export const LOAD_PLAN_IMPORTS_SUCCESS = createAction(
  '[🤖 PlanImport API] Load PlanImport success',
  props<{ data: PlanImport[] }>(),
);
export const LOAD_PLAN_IMPORTS_FAILED = createAction(
  '[🤖 Segment API] Load PlanImport failed',
  props<{ error: any }>(),
);
