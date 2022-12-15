import { createSelector } from '@ngrx/store';
import { addMonths, isAfter, isBefore, max, min } from 'date-fns';

import { select_sortedPlan } from '@/store/plan/plan.selectors';
import {
  select_selectedDateRangeRaw,
  select_selectedPlanId,
  select_selectedSegment,
} from './layout.baseSelectors';
import { intersection, SimpleDateRange } from '@/app/@core/interfaces/common/date-range';
import { refId } from '@/app/@core/interfaces/common/mongo';
import { Plan } from '@/app/@core/interfaces/business/plan';
import { select_selectedWorkspace } from '@/store/workspace/workspace.selectors';
import { IGetScenarioDemandParams } from '@/app/@core/entity/demand.service';
import { parseYYYYMMDD } from '@/utils/calendar';
import { LOCALSTORAGE_KEY_SELECTED_PLAN_ID } from '@/app/pages/explorer/shared/explorer.utils';

export const select_selectedPlan = createSelector(
  select_sortedPlan,
  select_selectedPlanId,
  (plans, selectedPlanId): Plan | undefined => {
    const previousSelectedPlanId = localStorage.getItem(LOCALSTORAGE_KEY_SELECTED_PLAN_ID);
    const planId = selectedPlanId || previousSelectedPlanId;
    return plans.find((p) => p.id === planId) || plans[0];
  }
);
export const select_selectableDateRange = createSelector(
  select_selectedPlan,
  select_selectedWorkspace,
  (selectedPlan, selectedWorkspace): { min: Date; max: Date } => {
    const defaultRange = { min: new Date(1900, 1, 1), max: new Date(3000, 1, 1) };

    if (!selectedPlan || !selectedWorkspace) return defaultRange;

    return {
      min: parseYYYYMMDD(selectedWorkspace.actualStartDate),
      max: parseYYYYMMDD(selectedPlan.defaultPlanDisplayEndDate),
    };
  },
);
export const select_disabledDateRangeFn = createSelector(
  select_selectedPlan,
  select_selectedWorkspace,
  (selectedPlan, selectedWorkspace): ((current: Date) => boolean) => {
    if (!selectedPlan || !selectedWorkspace) return () => false;

    const plan_end = parseYYYYMMDD(selectedPlan.futurePlanEndDate);
    const actual_start = parseYYYYMMDD(selectedWorkspace.actualStartDate);

    return (date: Date) => isBefore(date, actual_start) || isAfter(date, plan_end);
  },
);
export const select_presettedDateRanges = createSelector(
  select_selectedPlan,
  select_selectedWorkspace,
  (selectedPlan, selectedWorkspace): Record<string, Array<Date>> => {
    if (!selectedPlan || !selectedWorkspace) return {};

    const plan_start = parseYYYYMMDD(selectedPlan.defaultPlanDisplayStartDate);
    const plan_end = parseYYYYMMDD(selectedPlan.defaultPlanDisplayEndDate);
    const future_start = parseYYYYMMDD(selectedPlan.futurePlanStartDate);
    const future_end = parseYYYYMMDD(selectedPlan.futurePlanEndDate);
    const actual_start = parseYYYYMMDD(selectedWorkspace.actualStartDate);

    // const firstMonth_end = addMonths(plan_start, 1);
    const first3Months_end = addMonths(plan_start, 3);
    // const lastMonth_start = addMonths(plan_end, -1);
    const last3Months_start = addMonths(plan_end, -3);

    return {
      Default: [plan_start, plan_end],
      All: [actual_start, future_end],
      // 'First Month': [plan_start, min([firstMonth_end, plan_end])],
      'First 3 Months': [plan_start, min([first3Months_end, plan_end])],
      // 'Last Month': [max([lastMonth_start, plan_end, plan_start])],
      'Last 3 Months': [max([last3Months_start, plan_start]), future_end],
    };
  },
);
export const select_selectedPlanDefaultDateRange = createSelector(
  select_selectedPlan,
  (selectedPlan): SimpleDateRange | undefined =>
    selectedPlan
      ? {
          start: selectedPlan.defaultPlanDisplayStartDate,
          end: selectedPlan.defaultPlanDisplayEndDate,
        }
      : undefined,
);

export const select_selectedDateRange = createSelector(
  select_selectedDateRangeRaw,
  select_selectedPlanDefaultDateRange,
  (selectedDateRange, selectedPlanDefaultDateRange) =>
    selectedDateRange || selectedPlanDefaultDateRange,
);

export const select_previousPlan = createSelector(
  select_sortedPlan,
  select_selectedPlan,
  (plans, selectedPlan) => {
    if (!selectedPlan) {
      return null;
    }

    return plans.find((p) => p.id === refId(selectedPlan.previousPlanCycle)) || null;
  },
);

export const select_editingEventVersionDemandsParams = createSelector(
  select_selectedPlan,
  select_selectedSegment,
  select_selectedDateRange,
  (selectedPlan, selectedSegment, selectedDateRange): IGetScenarioDemandParams | undefined => {
    if (!selectedPlan) return;

    return {
      database: '',
      segment: selectedSegment,
      dateRange: intersection(selectedDateRange, {
        start: selectedPlan.futurePlanStartDate,
        end: selectedPlan.futurePlanEndDate,
      }),
      eventVersionIds: [],
      segmentDatabase: '',
      planId: selectedPlan.id,
      companyId: selectedPlan.company,
      workspaceId: selectedPlan.workspace.id,
      forceRun: false,
    };
  },
);
