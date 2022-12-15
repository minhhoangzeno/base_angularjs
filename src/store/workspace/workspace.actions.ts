import { createAction, props } from '@ngrx/store';

// NOTE: not used yet
export const SELECT_WORKSPACE = createAction(
  '[🤖 Layout] Select Workspace',
  props<{ id: string }>(),
);
