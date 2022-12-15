import { createReducer, on } from '@ngrx/store';

import { Plan } from '@/app/@core/interfaces/business/plan';
import {
  LOAD_PLANS,
  LOAD_PLANS_FAILED,
  LOAD_PLANS_SUCCESS,
  SET_PRIMARY_SCENARIO_SUCCESS,
  UPDATE_DISPLAYED_SCENARIO_SUCCESS,
} from './plan.actions';
import { BEGIN_CREATE_NEW_PLAN } from '../pages/layout/layout.actions';

export const PLAN_STATE_KEY = 'plan';

/*************************************
 * State
 *************************************/

export interface IPlanState {
  data: ReadonlyArray<Plan>;
  loading: boolean;
  errors: string[];
}
export const initialState: IPlanState = {
  data: [],
  loading: false,
  errors: [],
};

/*************************************
 * Reducers
 *************************************/

export const planReducer = createReducer(
  initialState,
  on(
    LOAD_PLANS,
    (state: IPlanState): IPlanState => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    LOAD_PLANS_SUCCESS,
    (state, { data }): IPlanState => ({
      ...state,
      loading: false,
      data,
    }),
  ),
  on(
    LOAD_PLANS_FAILED,
    (state, { error }): IPlanState => ({ ...state, loading: false, data: [], errors: error }),
  ),
  // When created new plan, clear data to reload it
  on(BEGIN_CREATE_NEW_PLAN, (state): IPlanState => ({ ...state, data: [] })),
  // The Plan is updated
  on(SET_PRIMARY_SCENARIO_SUCCESS, UPDATE_DISPLAYED_SCENARIO_SUCCESS, (state, { plan }) => ({
    ...state,
    data: state.data.filter((p) => p.id !== plan.id).concat(plan),
  })),
);
