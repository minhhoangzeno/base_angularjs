import { createReducer, on } from '@ngrx/store';

import { TaskStatus, TaskStatusItem } from '@/app/@core/backend/simcel/task.service';
import { FETCH_TASK_STATUSES_SUCCESS } from './task.actions';
import { LOAD_PLANS_SUCCESS } from '../plan/plan.actions';
import { LOAD_SCENARIOS_SUCCESS } from '../scenario/scenario.actions';
import { LOAD_EVENTS_SUCCESS } from '../event/event.actions';

export const TASK_STATE_KEY = 'task';

/*************************************
 * State
 *************************************/

export interface ITaskState {
  planTasks: ReadonlyArray<TaskStatusItem>;
  scenarioTasks: ReadonlyArray<TaskStatusItem>;
  eventTasks: Record<string, ReadonlyArray<TaskStatusItem>>;
  loading: boolean;
  errors: any;
}

export const initialState: ITaskState = {
  planTasks: [],
  scenarioTasks: [],
  eventTasks: {},
  loading: false,
  errors: [],
};

/*************************************
 * Reducers
 *************************************/

const toTaskItemMapper = (item: { id: string; tasks?: string[] }): TaskStatusItem[] => {
  return (
    item?.tasks?.map((id) => ({
      id,
      status: TaskStatus.Unknown,
      progress: { increment: 0, step: '' },
      parent: item.id,
    })) || []
  );
};

function updateStatus(targets: readonly TaskStatusItem[], data: TaskStatusItem[]) {
  return targets.map((target) => {
    const newTarget = data.find((_item) => _item.id === target.id);
    if (!newTarget) {
      // If item not found, consider task done
      return { ...target, status: TaskStatus.Finished, previousStatus: target.status };
    }

    return { ...newTarget, previousStatus: target.status };
  });
}

export const taskReducer = createReducer(
  initialState,
  // Register task when loaded Plans
  on(LOAD_PLANS_SUCCESS, (state, { data }) => ({
    ...state,
    planTasks: data.flatMap(toTaskItemMapper),
  })),
  // Register task when loaded Scenarios
  on(LOAD_SCENARIOS_SUCCESS, (state, { data }) => ({
    ...state,
    scenarioTasks: data.flatMap(toTaskItemMapper),
  })),
  // Register task when loaded Events
  on(LOAD_EVENTS_SUCCESS, (state, { data }) => ({
    ...state,
    eventTasks: Object.fromEntries(
      data
        .filter((event) => event.versions.some((eventversion) => eventversion.tasks?.length))
        .map((event) => [event.id, event.versions.flatMap(toTaskItemMapper)]),
    ),
  })),
  on(FETCH_TASK_STATUSES_SUCCESS, (state, { data }) => ({
    ...state,
    planTasks: updateStatus(state.planTasks, data),
    scenarioTasks: updateStatus(state.scenarioTasks, data),
    eventTasks: Object.fromEntries(
      Object.entries(state.eventTasks).map(([a, b]) => [a, updateStatus(b, data)]),
    ),
  })),
);
