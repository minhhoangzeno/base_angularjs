import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IWidgetStage, WIDGET_STATE_KEY } from './widget.state';

const selectFeature = createFeatureSelector<IWidgetStage>(WIDGET_STATE_KEY);

export const select_selectedWidgets = createSelector(selectFeature, (state) => state.selected);
