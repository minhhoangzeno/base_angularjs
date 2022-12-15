import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DEFAULT_SEGMENT } from '@/app/@core/interfaces/business/segment';
import { ILayoutState, PAGE__LAYOUT_STATE_KEY } from './layout.state';

export const selectFeature = createFeatureSelector<ILayoutState>(PAGE__LAYOUT_STATE_KEY);

/**
 * **Warning**: Don't use this directly, as it will **EMPTY** on initial page load.
 * It will only contain data **after** user selecting a Plan in the UI
 *
 * Should use `select_selectedPlan` instead, as it will take the first
 * plan in the list if user haven't select any plan yet
 */
export const select_selectedPlanId = createSelector(selectFeature, (state) => state.selectedPlanId);
export const select_highlightedScenarioId = createSelector(
  selectFeature,
  (state) => state.highlightedScenarioId,
);
export const select_editingScenario = createSelector(
  selectFeature,
  (state) => state.editingScenario,
);
export const select_scenarioEditEnabled = createSelector(selectFeature, (state) => state.editMode);
export const select_selectedDateRangeRaw = createSelector(
  selectFeature,
  (state) => state.selectedDateRange,
);
export const select_selectedSegment = createSelector(
  selectFeature,
  (state) => state.selectedSegment || DEFAULT_SEGMENT,
);

export const select_creatingPlan = createSelector(selectFeature, (state) => state.creatingPlan);
export const select_creatingPlanError = createSelector(
  selectFeature,
  (state) => state.creatingPlan_error,
);
