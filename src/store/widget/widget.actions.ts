import { WidgetType } from '@/app/@components/business/planning-segment/widget-management.component';
import { createAction, props } from '@ngrx/store';

export const SELECTED_WIDGETS_CHANGED = createAction(
  '[🌱 Layout] Selected Widgets changed',
  props<{ ids: WidgetType[] }>(),
);
