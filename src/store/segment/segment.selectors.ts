import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ISegmentState, SEGMENT_STATE_KEY } from './segment.state';

const selectFeature = createFeatureSelector<ISegmentState>(SEGMENT_STATE_KEY);

export const select_segments = createSelector(selectFeature, (state) => state.data);
export const select_segmentOptions = createSelector(selectFeature, (state) => state.options);
export const select_loadingSegments = createSelector(selectFeature, (state) => state.loading);
export const select_segmentProductsOptions = createSelector(
  select_segmentOptions,
  (options) => options?.products || [],
);
export const select_segmentCustomersOptions = createSelector(
  select_segmentOptions,
  (options) => options?.customers || [],
);
