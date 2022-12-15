import { Event, EventVersion } from '@/app/@core/interfaces/business/event';
import { createAction, props } from '@ngrx/store';

export const CANCEL_EVENT_VERSION_EDIT = createAction('[🤖 EventManage Page] Cancel Edit');

/** Create / save an event version record (depends if _id exists). */
export const SAVE_EVENT_VERSION = createAction(
  '[🤖 EventManage Page] Save EventVersion',
  props<{ event: Event; version: EventVersion }>(),
);

/** Delete an event version. */
export const DELETE_EVENT_VERSION = createAction(
  '[🤖 EventManage Page] Delete EventVersion',
  props<{ event: Event; version: EventVersion }>(),
);

/** Edit an event version. */
export const BEGIN_EDIT_EVENT_VERSION = createAction(
  '[⚡️ EventManage Page] Edit EventVersion',
  props<{ version: EventVersion }>(),
);

/** Handler when create new event has been fired. */
export const CREATE_NEW_EVENT_VERSION_LOCALLY = createAction(
  '[⚡️ EventManage Page] Create New EventVersion locally',
);

/** Handler when an event is selected to be edited. */
export const CREATE_NEW_EVENT_VERSION_LOCALLY_SUCCESS = createAction(
  '[🤖 Event API] Create new EventVersion locally success',
  props<{ version: EventVersion }>(),
);

export const CLONE_EVENT_VERSION = createAction(
  '[🌱 EventManage Page] Clone EventVersion',
  props<{ event: Event; version: EventVersion }>(),
);
