import { createAction, props } from '@ngrx/store';
import type { Event, EventVersion } from '@/app/@core/interfaces/business/event';

export const LOAD_EVENTS = createAction(
  '[⚡ Event API] Load Events',
  props<{ startDate: string; endDate: string }>(), // TODO: add workspace
);
export const LOAD_EVENTS_SUCCESS = createAction(
  '[🤖 Event API] Load Event success',
  props<{ data: Event[] }>(),
);
export const LOAD_EVENTS_FAILED = createAction(
  '[🤖 Event API] Load Event failed',
  props<{ error: any }>(),
);
export const LOAD_WORKSPACE_EVENTS = createAction(
  '[⚡ Event API] Load Workspace Events', // TODO: add workspace
);
export const LOAD_WORKSPACE_EVENTS_SUCCESS = createAction(
  '[🤖 Event API] Load Workspace Event success',
  props<{ workspaceData: Event[] }>(),
);
export const LOAD_WORKSPACE_EVENTS_FAILED = createAction(
  '[🤖 Event API] Load Workspace Event failed',
  props<{ error: any }>(),
);

export const SAVE_EVENT_VERSION_SUCCESS = createAction(
  '[🤖 Event API] Save EventVersion success',
  props<{ data: EventVersion }>(),
);
export const SAVE_EVENT_VERSION_FAILED = createAction(
  '[🤖 Event API] Save EventVersion failed',
  props<{ error: any }>(),
);

export const DELETE_EVENT_VERSION_SUCCESS = createAction(
  '[🤖 Event API] Delete EventVersion success',
);
export const DELETE_EVENT_VERSION_FAILED = createAction(
  '[🤖 Event API] Delete EventVersion failed',
  props<{ error: any }>(),
);
