import { Injectable } from '@angular/core';

import { HttpService } from '../backend/common/api/http.service';
import { SimpleDateRange } from '../interfaces/common/date-range';
import { Segment } from '../interfaces/business/segment';
import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';

export interface IGetDemandsChartDataParams {
  interval?: DateAggregationOption;
  segment?: Segment;
  dateRange?: SimpleDateRange;
  groupingColumns: string[];
  planId: string;
  force: boolean;
  workspaceId: string;
}
export interface IGetDemandImpactsChartDataParams extends IGetDemandsChartDataParams {
  scenarios: Array<string | { id: string; events: string[] }>;
}
interface IGetDemandParams {
  database: string;
  segment: Segment;
  dateRange: SimpleDateRange;
  groupingColumns?: string[];
}
export interface IGetScenarioDemandParams extends IGetDemandParams {
  eventVersionIds: string[];
  segmentDatabase: string;
  planId: string;
  companyId: string;
  workspaceId: string;
  forceRun: boolean;
}

@Injectable({ providedIn: 'root' })
export class DemandService {
  constructor(private readonly api: HttpService) { }

  getDemands(params: IGetDemandsChartDataParams) {
    return this.api.post('demands', params);
  }
  getDemandImpacts(params: IGetDemandImpactsChartDataParams) {
    return this.api.post('demands/impact', params);
  }
}
