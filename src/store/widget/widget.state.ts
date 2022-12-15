import { createReducer, on } from '@ngrx/store';

import { WidgetType } from '@/app/@components/business/planning-segment/widget-management.component';
import { SELECTED_WIDGETS_CHANGED } from './widget.actions';

export const WIDGET_STATE_KEY = 'widget';

const INITIAL_WIDGETS_WHOLE_EXPLORER: ReadonlyArray<WidgetType> = [
  WidgetType.KPI_TABLE,
  WidgetType.PNL_CHART,
  WidgetType.SALES_CHART,
  WidgetType.DEMAND_CHART,
];

/*************************************
 * State
 *************************************/

export interface IWidgetStage {
  selected: ReadonlyArray<WidgetType>;
}

export const initialState: IWidgetStage = {
  selected: INITIAL_WIDGETS_WHOLE_EXPLORER,
};

/*************************************
 * Reducers
 *************************************/

export const widgetReducer = createReducer(
  initialState,
  on(SELECTED_WIDGETS_CHANGED, (state, { ids }): IWidgetStage => ({ ...state, selected: ids })),
);
