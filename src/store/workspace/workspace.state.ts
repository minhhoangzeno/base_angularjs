import { createReducer, on } from '@ngrx/store';

import { GET_CURRENT_USER_SUCCESS } from '../auth/auth.actions';
import { Workspace } from '@/app/@core/interfaces/common/workspace';
import { SELECT_WORKSPACE } from './workspace.actions';

export const WORKSPACE_STATE_KEY = 'workspace';

/*************************************
 * State
 *************************************/

export interface WorkspaceState {
  data: ReadonlyArray<Workspace>;
  selected: string | null;
  loading: boolean;
  errors: string[];
}

export const initialState: WorkspaceState = {
  data: [],
  selected: null,
  loading: false,
  errors: [],
};

/*************************************
 * Reducer
 *************************************/

export const workspaceReducer = createReducer(
  initialState,
  on(
    GET_CURRENT_USER_SUCCESS,
    (state, { data }): WorkspaceState => ({
      ...state,
      data: data.workspaces || [],
    }),
  ),
  on(SELECT_WORKSPACE, (state, { id }): WorkspaceState => ({ ...state, selected: id })),
);
