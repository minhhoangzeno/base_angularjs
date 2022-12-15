import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, takeWhile } from 'rxjs/operators';

import { TaskService, TaskStatus } from '@/app/@core/backend/simcel/task.service';
import {
  FETCH_TASK_STATUSES_FAILED,
  FETCH_TASK_STATUSES_SUCCESS,
  SCENARIO_JUST_FINISHED_SIMULATION,
} from './task.actions';
import { select_allTasks, select_inProgessTaskIds } from './task.selectors';
import { SHOULD_FETCH_TASK_STATUSES } from '../composed-actions';
import { select_displayingScenarios } from '../scenario/scenario.selectors';

@Injectable()
export class TaskEffects {
  fetchStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_FETCH_TASK_STATUSES),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      switchMap(() =>
        timer(0, 5000).pipe(
          concatLatestFrom(() => this.store.select(select_inProgessTaskIds)),
          takeWhile(([, tasks]) => !!tasks.length), // Stop the timer when no more inprogress-Task
          switchMap(([, tasks]) =>
            this.taskService.fetchTaskStatus(tasks).pipe(
              map((data) => FETCH_TASK_STATUSES_SUCCESS({ data })),
              catchError((error) => of(FETCH_TASK_STATUSES_FAILED({ error }))),
            ),
          ),
        ),
      ),
    );
  });

  notifyJustFinishedTasks = createEffect(() => {
    return this.actions$.pipe(
      ofType(FETCH_TASK_STATUSES_SUCCESS),
      // Get the list of finished tasks (only id)
      map(({ data }) => data.filter((s) => s.status === TaskStatus.Finished).map((t) => t.id)),
      concatLatestFrom(() => this.store.select(select_allTasks)),
      // Taks only the tasks that just finished (previously in progress)
      map(([finishedTaskIds, { scenarioTasks }]) =>
        scenarioTasks
          .filter(
            (s) => s.previousStatus === TaskStatus.InProgress && finishedTaskIds.includes(s.id),
          )
          .map((t) => t.id),
      ),
      filter((ids) => !!ids.length),
      concatLatestFrom(() => this.store.select(select_displayingScenarios)),
      map(([ids, displayingScenarios]) =>
        displayingScenarios.filter((s) => s.tasks?.some((t) => ids.includes(t))),
      ),
      filter((data) => !!data.length),
      map((data) => SCENARIO_JUST_FINISHED_SIMULATION({ data })),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly taskService: TaskService,
  ) {}
}
