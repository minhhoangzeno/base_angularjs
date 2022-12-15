import { createReducer, on } from '@ngrx/store';

import { Scenario } from '@/app/@core/interfaces/business/scenario';
import {
  LOAD_SCEANRIO_FAILED,
  LOAD_SCENARIOS_SUCCESS,
  SAVE_SCENARIO_FAILED,
  SAVE_SCENARIO_SUCCESS,
  CLONE_SCENARIO_SUCCESS,
  CLONE_SCENARIO_FAILED,
  LOAD_SCENARIOS,
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS,
  LOAD_PRIMARY_SCENARIOS_SUCCESS,
} from './scenario.actions';
import { SAVE_SCENARIO } from '../pages/layout/layout.actions';

export const SCENARIO_STATE_KEY = 'scenario';

/*************************************
 * State
 *************************************/

export interface IScenarioState {
  data: ReadonlyArray<Scenario>;
  loading: boolean;
  saving: boolean;
  errors: string[];
  legacy_actualAndCommittedScenarios: ReadonlyArray<Scenario>;
  primaryScenarios: ReadonlyArray<Scenario>;
}

export const initialState: IScenarioState = {
  data: [],
  loading: false,
  saving: false,
  errors: [],
  legacy_actualAndCommittedScenarios: [],
  primaryScenarios: [],
};

/*************************************
 * Reducers
 *************************************/

export const scenarioReducer = createReducer(
  initialState,
  on(LOAD_SCENARIOS, (state: IScenarioState): IScenarioState => ({ ...state, loading: true })),
  on(
    LOAD_SCENARIOS_SUCCESS,
    (state, { data }): IScenarioState => ({ ...state, loading: false, data }),
  ),
  on(
    LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS,
    (state, { data }): IScenarioState => ({ ...state, legacy_actualAndCommittedScenarios: data }),
  ),
  on(
    LOAD_SCEANRIO_FAILED,
    (state, { error }): IScenarioState => ({
      ...state,
      loading: false,
      data: [],
      errors: error,
    }),
  ),
  on(SAVE_SCENARIO, (state): IScenarioState => ({ ...state, saving: true })),
  on(
    SAVE_SCENARIO_SUCCESS,
    CLONE_SCENARIO_SUCCESS,
    (state): IScenarioState => ({ ...state, saving: false }),
  ),
  on(
    SAVE_SCENARIO_FAILED,
    CLONE_SCENARIO_FAILED,
    (state): IScenarioState => ({ ...state, saving: false }),
  ),
  on(
    LOAD_PRIMARY_SCENARIOS_SUCCESS,
    (state, { data }): IScenarioState => ({ ...state, primaryScenarios: data }),
  ),
);
