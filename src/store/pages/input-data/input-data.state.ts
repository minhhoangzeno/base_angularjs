import { createReducer, on } from '@ngrx/store';
import {
  LOAD_EDITED_INPUT_DATA,
  LOAD_EDITED_INPUT_DATA_FAILED,
  LOAD_EDITED_INPUT_DATA_SUCCESS,
  LOAD_INPUT_DATA,
  LOAD_INPUT_DATA_FAILED,
  LOAD_INPUT_DATA_SUCCESS,
  LOAD_INPUT_DATA_TOTAL_SUCCESS,
  UPSERT_INPUT_DATA_SUCCESS,
} from './input-data.actions';

export const PAGE__INPUT_DATA_STATE_KEY = 'page_inputData';

/*************************************
 * State
 *************************************/

export interface IInputDataPageState {
  data: ReadonlyArray<any>;
  editedData: ReadonlyArray<any>;
  loading: boolean;
  loadingEditied: boolean;
  total?: number;
  editingRow?: any;
  error?: any;
}

export const initialState: IInputDataPageState = {
  loading: false,
  loadingEditied: false,
  data: [],
  editedData: [],
};

/*************************************
 * Reducers
 *************************************/

export const page_inputDataReducer = createReducer(
  initialState,
  on(LOAD_INPUT_DATA, (state): IInputDataPageState => ({ ...state, loading: true })),
  on(
    LOAD_INPUT_DATA_FAILED,
    (state, { error }): IInputDataPageState => ({ ...state, loading: false, error }),
  ),
  on(
    LOAD_INPUT_DATA_SUCCESS,
    (state, { data }): IInputDataPageState => ({ ...state, loading: false, data }),
  ),
  on(LOAD_INPUT_DATA_TOTAL_SUCCESS, (state, { count }) => ({ ...state, total: count })),
  on(LOAD_EDITED_INPUT_DATA, (state): IInputDataPageState => ({ ...state, loadingEditied: true })),
  on(
    LOAD_EDITED_INPUT_DATA_FAILED,
    (state, { error }): IInputDataPageState => ({ ...state, loadingEditied: false, error }),
  ),
  on(
    LOAD_EDITED_INPUT_DATA_SUCCESS,
    (state, { data }): IInputDataPageState => ({
      ...state,
      loadingEditied: false,
      editedData: data,
    }),
  ),
  on(UPSERT_INPUT_DATA_SUCCESS, (state, {}) => {
    return { ...state };
  }),
);
