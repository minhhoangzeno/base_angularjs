import { createFeatureSelector, createSelector } from '@ngrx/store';

import { WorkspaceState, WORKSPACE_STATE_KEY } from './workspace.state';

const selectFeature = createFeatureSelector<WorkspaceState>(WORKSPACE_STATE_KEY);

export const select_workspacesLoading = createSelector(selectFeature, (state) => state.loading);
export const select_selectedWorkspaceId = createSelector(selectFeature, (state) => state.selected);
export const select_selectedWorkspace = createSelector(
  selectFeature,
  (state) => state.data.find((d) => d.id === state.selected) || state.data[0],
);
