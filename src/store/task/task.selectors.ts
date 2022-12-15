import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TaskStatus, TaskStatusItem } from '@/app/@core/backend/simcel/task.service';
import { ITaskState, TASK_STATE_KEY } from './task.state';

const selectFeature = createFeatureSelector<ITaskState>(TASK_STATE_KEY);

export const select_planTasks = createSelector(selectFeature, (s) => s.planTasks);
export const select_scenarioTasks = createSelector(selectFeature, (s) => s.scenarioTasks);
export const select_eventTasks = createSelector(selectFeature, (s) => s.eventTasks);
export const select_allTasks = createSelector(
  select_planTasks,
  select_scenarioTasks,
  select_eventTasks,
  (planTasks, scenarioTasks, eventTasks) => ({
    planTasks,
    scenarioTasks,
    eventTasks,
  }),
);

export const select_taskIds = createSelector(selectFeature, (state) => [
  ...state.planTasks.map((t) => t.id),
  ...state.scenarioTasks.map((t) => t.id),
  ...Object.values(state.eventTasks)
    .flat()
    .map((t) => t.id),
]);

function filterInProgressItem(t: TaskStatusItem) {
  return t.status === TaskStatus.Unknown || t.status === TaskStatus.InProgress;
}

export const select_inProgessTaskIds = createSelector(selectFeature, (state) => {
  const tasks = [
    ...state.planTasks,
    ...state.scenarioTasks,
    ...Object.values(state.eventTasks).flat(),
  ];

  return (
    tasks
      .filter(filterInProgressItem)
      // Don't have any sibiling that status is failed
      .filter(
        ({ id, parent }) =>
          !parent ||
          !tasks.some((t) => id !== t.id && parent === t.parent && t.status === TaskStatus.Failed),
      )
      .map((t) => t.id)
  );
});

export const select_scenarioTaskStatuses = createSelector(
  selectFeature,
  (state) => state.scenarioTasks,
);
