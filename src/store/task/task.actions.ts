import { createAction, props } from '@ngrx/store';

import { TaskStatusItem } from '@/app/@core/backend/simcel/task.service';
import { Scenario } from '@/app/@core/interfaces/business/scenario';

export const FETCH_TASK_STATUSES_SUCCESS = createAction(
  '[🤖 Task API] Fetch Status success',
  props<{ data: TaskStatusItem[] }>(),
);
export const FETCH_TASK_STATUSES_FAILED = createAction(
  '[🤖 Task API] Fetch Status failed',
  props<{ error: any }>(),
);
export const SCENARIO_JUST_FINISHED_SIMULATION = createAction(
  '[⚡️ Task API] Scenario just finished simulation',
  props<{ data: Scenario[] }>(),
);
