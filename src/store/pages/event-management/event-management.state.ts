import { EventVersion } from '@/app/@core/interfaces/business/event';
import {
  DELETE_EVENT_VERSION_SUCCESS,
  SAVE_EVENT_VERSION_SUCCESS,
} from '@/store/event/event.actions';
import { createReducer, on } from '@ngrx/store';
import {
  CANCEL_EVENT_VERSION_EDIT,
  CREATE_NEW_EVENT_VERSION_LOCALLY_SUCCESS,
  BEGIN_EDIT_EVENT_VERSION,
} from './event-management.actions';

export const PAGE__EVENTS_MANAGEMENT_STATE_KEY = 'page_eventsManagement';

/*************************************
 * State
 *************************************/

export interface IEventsManagementPageState {
  selectedEventVersion: Partial<EventVersion> | null;
}

export const initialState: IEventsManagementPageState = {
  selectedEventVersion: null,
};

/*************************************
 * Reducers
 *************************************/

export const page_eventsManagementReducer = createReducer(
  initialState,
  // Selected the dummy Event Version that just generated
  on(
    CREATE_NEW_EVENT_VERSION_LOCALLY_SUCCESS,
    BEGIN_EDIT_EVENT_VERSION,
    (state, { version }): IEventsManagementPageState => ({
      ...state,
      selectedEventVersion: version,
    }),
  ),
  on(
    CANCEL_EVENT_VERSION_EDIT,
    (state): IEventsManagementPageState => ({
      ...state,
      selectedEventVersion: null,
    }),
  ),
  // Select the newly saved Event Version
  on(
    SAVE_EVENT_VERSION_SUCCESS,
    (state, { data: version }): IEventsManagementPageState => ({
      ...state,
      selectedEventVersion: version,
    }),
  ),
  // on(CLONE_EVENT_VERSION, (state): IEventsManagementPageState => ({ ...state })),
  on(
    DELETE_EVENT_VERSION_SUCCESS,
    (state): IEventsManagementPageState => ({ ...state, selectedEventVersion: null }),
  ),
);
