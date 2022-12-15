import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  QueryParams,
} from '@ngrx/data';

import { Breakdown } from '../interfaces/business/breakdown';
import { HttpService } from '../backend/common/api/http.service';
import { Segment } from '../interfaces/business/segment';
import { SimpleDateRange } from '../interfaces/common/date-range';
import { Observable } from 'rxjs';

export const BASE_ENDPOINT = 'kpis/aggregate';
export const COMMITTED_PLANS_ENDPOINT = 'kpis/aggregate/committed-plans';
export const CURRENT_PLAN_ENDPOINT = 'kpis/aggregate/current';

export interface IGetBreakdownParams {
  database: string;
  segment?: Segment;
  dateRange?: SimpleDateRange;
  segmentDatabase: string;
  companyId: string;
  planId: string;
  interval?: string;
}

@Injectable({ providedIn: 'root' })
export class BreakdownService extends EntityCollectionServiceBase<Breakdown> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly api: HttpService,
  ) {
    super(BASE_ENDPOINT, serviceElementsFactory);
  }

  getWithPostQuery(queryParams: QueryParams, data: any, options?: any, endpoint?: string) {
    const params = queryParams;
    return this.api.post(endpoint || this.entityName, data, {
      ...options,
      // Merge params from options if it exists.
      params: {
        ...options?.params,
        ...params,
      },
    });
  }

  getBreakdownForScenario({
    database,
    segment,
    dateRange,
    segmentDatabase,
    interval,
    companyId,
    planId,
  }: IGetBreakdownParams): Observable<Breakdown[]> {
    return this.getWithPostQuery(
      { database },
      { segment, dateRange, segmentDatabase, companyId, planId, interval },
      {},
      undefined,
    );
  }

  getBreakdownForCurrentScenario({
    database,
    segment,
    dateRange,
    segmentDatabase,
    companyId,
    planId,
    interval,
  }: IGetBreakdownParams): Observable<Breakdown[]> {
    return this.getWithPostQuery(
      { database },
      { segment, dateRange, segmentDatabase, companyId, planId, interval },
      {},
      CURRENT_PLAN_ENDPOINT,
    );
  }

  getBreakdownForCommittedScenario({
    database,
    segment,
    dateRange,
    segmentDatabase,
    companyId,
    planId,
    interval,
  }: IGetBreakdownParams): Observable<Breakdown[]> {
    return this.getWithPostQuery(
      { database },
      { segment, dateRange, segmentDatabase, companyId, planId, interval },
      {},
      COMMITTED_PLANS_ENDPOINT,
    );
  }
}
