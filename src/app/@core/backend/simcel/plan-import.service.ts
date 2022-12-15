import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Plan } from '../../interfaces/business/plan';
import { PlanImport } from '../../interfaces/business/plan-import';
import { HttpService } from '../common/api/http.service';

export interface ICreatePlanImportParams {
  planImport: PlanImport | undefined;
  title: string;
  description: string;
  useForecasting: boolean;
  futureStartDate: string;
  futureEndDate: string;
  forecastingMethod: string;
}

/** Simplified service for triggering and monitoring end-to-end runs. */
@Injectable()
export class PlanImportService {
  private readonly apiController: string = 'simcel-async/plan-import';

  constructor(private readonly api: HttpService) {}

  createPlanFromPlanImport({
    planImport,
    title,
    description,
    useForecasting,
    futureStartDate,
    futureEndDate,
    forecastingMethod,
  }: ICreatePlanImportParams): Observable<Plan> {
    // Format of plan import request.
    const data = {
      ...planImport,
      title,
      description,
      useForecasting,
      futureStartDate,
      futureEndDate,
      forecastingMethod,
    };
    // TODO(lou): check what pattern should be used so that all taskStatusSummaries
    // are added automatically through all operators (get/getAll/create/etc)
    // Having to do this manually is error prone
    return this.api.post(this.apiController, data);
  }
}
