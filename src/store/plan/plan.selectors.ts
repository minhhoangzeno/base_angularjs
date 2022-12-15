import { PlanFlag, sortPlansByStartDate } from '@/app/@core/interfaces/business/plan';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IPlanState, PLAN_STATE_KEY } from './plan.state';

const selectFeature = createFeatureSelector<IPlanState>(PLAN_STATE_KEY);

export const select_plans = createSelector(selectFeature, (state) => state.data);
export const select_sortedPlan = createSelector(select_plans, (plans) =>
  sortPlansByStartDate([...plans]),
);
export const select_latestPlan = createSelector(
  select_plans,
  (plans) => sortPlansByStartDate([...plans])[0],
);
export const select_actualPlan = createSelector(select_plans, (plans) =>
  plans.find((p) => p.flags?.includes(PlanFlag.ACTUAL)),
);
