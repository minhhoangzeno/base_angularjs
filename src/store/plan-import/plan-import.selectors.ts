import { createFeatureSelector, createSelector } from '@ngrx/store';
import { select_latestPlan } from '../plan/plan.selectors';

import { IPlanImportState, PLAN_IMPORT_STATE_KEY } from './plan-import.state';

const selectFeature = createFeatureSelector<IPlanImportState>(PLAN_IMPORT_STATE_KEY);

export const select_planImports = createSelector(selectFeature, (state) => state.data);

export const select_availablePlanImports = createSelector(
  select_planImports,
  select_latestPlan,
  (planImports, latestPlan) =>
    planImports.filter(
      (planImport) =>
        new Date(planImport.futurePlanStartDate).getTime() >
        new Date(latestPlan.futurePlanStartDate).getTime(),
    ),
);
