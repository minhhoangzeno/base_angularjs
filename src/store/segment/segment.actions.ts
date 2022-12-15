import { Plan } from '@/app/@core/interfaces/business/plan';
import { Segment, SegmentCriterion } from '@/app/@core/interfaces/business/segment';
import { createAction, props } from '@ngrx/store';

export const LOAD_SEGMENTS = createAction(
  '[⚡ Segment API] Load Segments',
  props<{ database: string }>(),
);
export const LOAD_SEGMENTS_SUCCESS = createAction(
  '[🤖 Segment API] Load Segments success',
  props<{ data: Segment[] }>(),
);
export const LOAD_SEGMENTS_FAILED = createAction(
  '[🤖 Segment API] Load Segmnets failed',
  props<{ error: any }>(),
);

export const LOAD_SEGMENT_OPTIONS = createAction(
  '[⚡ Segment API] Load Segment Options',
  props<{planId: string}>(),
);
export const LOAD_SEGMENT_OPTIONS_SUCCESS = createAction(
  '[🤖 Segment API] Load Segment Options success',
  props<{ data: SegmentCriterion }>(),
);
export const LOAD_SEGMENT_OPTIONS_FAILED = createAction(
  '[🤖 Segment API] Load Segment Options failed',
  props<{ error: any }>(),
);

export const SAVE_SEGMENT_SUCCESS = createAction(
  '[🤖 Segment API] Save Segment success',
  props<{ data: Segment }>(),
);
export const SAVE_SEGMENT_FAILED = createAction(
  '[🤖 Segment API] Save Segment failed',
  props<{ error: any }>(),
);
export const DELETE_SEGMENT_SUCCESS = createAction(
  '[🤖 Segment API] Delete Segment success',
  props<{ segment: Segment }>(),
);
export const DELETE_SEGMENT_FAILED = createAction(
  '[🤖 Segment API] Delete Segment failed',
  props<{ error: any }>(),
);

export const EDIT_SEGMENT_SUCCESS = createAction(
  '[🤖 Segment API] Edit Segment success',
  props<{ segment: Segment }>(),
);
export const EDIT_SEGMENT_FAILED = createAction(
  '[🤖 Segment API] Edit Segment failed',
  props<{ error: any }>(),
);