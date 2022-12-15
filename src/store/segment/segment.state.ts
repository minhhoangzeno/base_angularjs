import { createReducer, on } from '@ngrx/store';
import { Segment, SegmentCriterion } from '@/app/@core/interfaces/business/segment';
import {
  LOAD_SEGMENT_OPTIONS_SUCCESS,
  LOAD_SEGMENTS_FAILED,
  LOAD_SEGMENTS_SUCCESS,
  SAVE_SEGMENT_SUCCESS,
  SAVE_SEGMENT_FAILED,
  LOAD_SEGMENTS,
} from './segment.actions';
import { SAVE_SEGMENT } from '../pages/layout/layout.actions';

export const SEGMENT_STATE_KEY = 'segment';

/*************************************
 * State
 *************************************/

export interface ISegmentState {
  data: ReadonlyArray<Segment>;
  options: SegmentCriterion | null;
  loading: boolean;
  saving: boolean;
  errors: string[];
}

export const initialState: ISegmentState = {
  data: [],
  options: null,
  loading: false,
  saving: false,
  errors: [],
};

/*************************************
 * Reducer
 *************************************/

export const segmentReducer = createReducer(
  initialState,
  on(LOAD_SEGMENTS, (state: ISegmentState): ISegmentState => ({ ...state, loading: true })),
  on(
    LOAD_SEGMENTS_SUCCESS,
    (state, { data }): ISegmentState => ({ ...state, loading: false, data }),
  ),
  on(
    LOAD_SEGMENTS_FAILED,
    (state, { error }): ISegmentState => ({
      ...state,
      loading: false,
      data: [],
      errors: error,
    }),
  ),
  on(
    LOAD_SEGMENT_OPTIONS_SUCCESS,
    (state, { data }): ISegmentState => ({
      ...state,
      loading: false,
      options: data,
    }),
  ),
  on(SAVE_SEGMENT, (state): ISegmentState => ({ ...state, saving: true })),
  on(SAVE_SEGMENT_SUCCESS, (state): ISegmentState => ({ ...state, saving: false })),
  on(SAVE_SEGMENT_FAILED, (state): ISegmentState => ({ ...state, saving: false })),
);
