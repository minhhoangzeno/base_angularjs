import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { HttpService } from '../common/api/http.service';

const TASK_STATUS_API = 'simcel-async/tasks/check-status';

export enum TaskStatus {
  Unknown = 'unknown',
  InProgress = 'inProgress',
  Finished = 'finished',
  Failed = 'failed',
}
export interface TaskStatusItem {
  id: string;
  parent: string;
  status: TaskStatus;
  progress?: { increment: number; step: string };
  /* To able to detect just finishsed tasks */
  previousStatus?: TaskStatus;
  error?: string;
}

@Injectable()
export class TaskService {
  constructor(private readonly http: HttpService) {}

  fetchTaskStatus(tasks: string[]) {
    return this.http.post(TASK_STATUS_API, tasks).pipe(map((s) => this.parseApiResponse(s)));
  }

  private parseApiResponse(data: any): TaskStatusItem[] {
    if (!Array.isArray(data)) return [];
    return data.map(({ id, finishedOn, failedReason }) => ({
      id,
      status: finishedOn
        ? failedReason
          ? TaskStatus.Failed
          : TaskStatus.Finished
        : TaskStatus.InProgress,
      error: failedReason || '',
      parent: '',
    }));
  }
}
