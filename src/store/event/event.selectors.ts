import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IEventState, EVENT_STATE_KEY } from './event.state';

const selectFeature = createFeatureSelector<IEventState>(EVENT_STATE_KEY);
export const select_events = createSelector(selectFeature, (state) => state.data);
export const select_workspaceEvents = createSelector(selectFeature, (state) => state.workspaceData)

// map event version id to event name
export const select_eventNamesLookup = createSelector(selectFeature, (state) =>
  Object.fromEntries(
    state.data.flatMap((event) =>
      event.versions.map((eventVersion) => [
        eventVersion.id,
        `${event.name} - ${eventVersion.name}`,
      ]),
    ),
  ),
);
export const select_savingEventVersion = createSelector(selectFeature, (state) => state.saving);
