import { createReducer, on } from '@ngrx/store';
import { PlanImport } from '@/app/@core/interfaces/business/plan-import';
import {
  LOAD_PLAN_IMPORTS,
  LOAD_PLAN_IMPORTS_FAILED,
  LOAD_PLAN_IMPORTS_SUCCESS,
} from './plan-import.actions';

export const PLAN_IMPORT_STATE_KEY = 'planImport';

/*************************************
 * State
 *************************************/

export interface IPlanImportState {
  data: ReadonlyArray<PlanImport>;
  selected: string | null;
  selectedOptions: any;
  loading: boolean;
  errors: string[];
}

export const initialState: IPlanImportState = {
  data: [],
  selected: null,
  selectedOptions: null,
  loading: false,
  errors: [],
};

/*************************************
 * Reducer
 *************************************/

export const planImportReducer = createReducer(
  initialState,
  on(LOAD_PLAN_IMPORTS, (state): IPlanImportState => ({ ...state, loading: true })),
  on(
    LOAD_PLAN_IMPORTS_SUCCESS,
    (state, { data }): IPlanImportState => ({ ...state, loading: false, data }),
  ),
  on(
    LOAD_PLAN_IMPORTS_FAILED,
    (state, { error }): IPlanImportState => ({
      ...state,
      loading: false,
      data: [],
      errors: error,
    }),
  ),
);
