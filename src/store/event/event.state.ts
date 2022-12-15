import { createReducer, on } from '@ngrx/store';

import type { Event, EventVersion } from '@/app/@core/interfaces/business/event';
import {
  LOAD_EVENTS,
  LOAD_WORKSPACE_EVENTS,
  LOAD_EVENTS_FAILED,
  LOAD_EVENTS_SUCCESS,
  SAVE_EVENT_VERSION_FAILED,
  SAVE_EVENT_VERSION_SUCCESS,
  LOAD_WORKSPACE_EVENTS_SUCCESS,
  LOAD_WORKSPACE_EVENTS_FAILED,
} from './event.actions';
import {
  CLONE_EVENT_VERSION,
  BEGIN_EDIT_EVENT_VERSION,
  SAVE_EVENT_VERSION,
} from '../pages/event-management/event-management.actions';

export const EVENT_STATE_KEY = 'event';

/*************************************
 * State
 *************************************/

export interface IEventState {
  data: ReadonlyArray<Event>;
  workspaceData: ReadonlyArray<Event>;
  loading: boolean;
  saving: boolean;
  editing: boolean;
  errors: string[];
}

export const initialState: IEventState = {
  data: [],
  workspaceData:[],
  loading: false,
  saving: false,
  editing: false,
  errors: [],
};

/*************************************
 * Reducers
 *************************************/

export const eventReducer = createReducer(
  initialState,
  on(LOAD_EVENTS, (state: IEventState): IEventState => ({ ...state, loading: true })),
  on(LOAD_EVENTS_SUCCESS, (state, { data }): IEventState => ({ ...state, loading: false, data })),
  on(
    LOAD_EVENTS_FAILED,
    (state, { error }): IEventState => ({
      ...state,
      loading: false,
      data: [],
      errors: error,
    }),
  ),
  on(LOAD_WORKSPACE_EVENTS, (state: IEventState): IEventState => ({ ...state, loading: true })),
  on(LOAD_WORKSPACE_EVENTS_SUCCESS, (state, { workspaceData }): IEventState => ({ ...state, loading: false, workspaceData })),
  on(
    LOAD_WORKSPACE_EVENTS_FAILED,
    (state, { error }): IEventState => ({
      ...state,
      loading: false,
      workspaceData: [],
      errors: error,
    }),
  ),
  on(BEGIN_EDIT_EVENT_VERSION, (state): IEventState => ({
    ...state, loading: false, saving: false
  })),
  on(SAVE_EVENT_VERSION, (state): IEventState => ({ ...state, saving: true })),
  on(SAVE_EVENT_VERSION_SUCCESS, (state): IEventState => ({ ...state, saving: false })),
  on(
    SAVE_EVENT_VERSION_FAILED,
    (state, { error }): IEventState => ({ ...state, saving: false, errors: error }),
  ),
  on(CLONE_EVENT_VERSION, (state, { event, version }): IEventState => {
    const targetEvent = state.data.find(({ id }) => event.id === id);
    if (!targetEvent) return state;

    const updatedEvent: Event = {
      ...targetEvent,
      versions: [...targetEvent.versions, cloneEventVersion(version, targetEvent.versions.length)],
    };

    return { ...state, data: [...state.data.filter(({ id }) => event.id !== id), updatedEvent] };
  }),
);

function cloneEventVersion(version: EventVersion, count = 1) {
  const newVerion: EventVersion = {
    id: '',
    name: `${version.name} - Copy ${count}`,
    endDate: version.endDate,
    segmentImpacts: version.segmentImpacts,
    startDate: version.startDate,
    eventId: version.eventId,
  };
  return newVerion;
}
