import { createFeatureSelector, createSelector } from '@ngrx/store';
import { addMonths, addQuarters, isBefore, min } from 'date-fns';

import { select_events } from '@/store/event/event.selectors';
import { select_selectedPlan } from '../layout/layout.selectors';
import {
  IEventsManagementPageState,
  PAGE__EVENTS_MANAGEMENT_STATE_KEY,
} from './event-management.state';
import { parseYYYYMMDD } from '@/utils/calendar';

const selectFeature = createFeatureSelector<IEventsManagementPageState>(
  PAGE__EVENTS_MANAGEMENT_STATE_KEY,
);

export const select_selectedEventVersion = createSelector(
  selectFeature,
  (state) => state.selectedEventVersion,
);

export const select_selectedEvent = createSelector(
  select_selectedEventVersion,
  select_events,
  (selectedEventVersion, events) =>
    events.find((e) => e.versions.some((ev) => ev.id === selectedEventVersion?.id)),
);

export const select_presettedDateRanges = createSelector(
  select_selectedPlan,
  (selectedPlan): Record<string, Array<Date>> => {
    if (!selectedPlan) return {};
    console.log(selectedPlan)
    const plan_start = parseYYYYMMDD(selectedPlan.defaultPlanDisplayStartDate);
    const plan_end = parseYYYYMMDD(selectedPlan.defaultPlanDisplayEndDate);

    const firstMonth_end = addMonths(plan_start, 1);
    const firstQuarter_start = addQuarters(plan_start, 1);
    const firstSemester_start = addMonths(plan_start, 6);

    return {
      'Entire Plan': [plan_start, plan_end],
      'First Month': [plan_start, min([firstMonth_end, plan_end])],
      'First Quarter': [plan_start, min([firstQuarter_start, plan_end])],
      'First Semester': [plan_start, min([firstSemester_start, plan_end])],
    };
  },
);

export const select_disabledDateRangeFn = createSelector(
  select_selectedPlan,
  (selectedPlan): ((current: Date) => boolean) => {
    if (!selectedPlan) return () => false;
    const plan_start = parseYYYYMMDD(selectedPlan.futurePlanStartDate);

    return (d: Date) => isBefore(d, plan_start);
  },
);
