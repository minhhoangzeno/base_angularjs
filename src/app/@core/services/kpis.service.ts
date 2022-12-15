import { DateAggregationOption } from '@/app/pages/explorer/planning-explorer/widgets/timeseries/timeseries.constants';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../backend/common/api/http.service';
import { BREAKDOWN_KPIS_GROUPING_INFO_LIST } from '../interfaces/business/breakdown';
import { Segment } from '../interfaces/business/segment';
import { SimpleDateRange } from '../interfaces/common/date-range';

export interface IGetKpisParams {
  segment?: Segment;
  dateRange?: SimpleDateRange;
  planId: string;
  scenarios: Array<string>;
}
export interface IGetKpisByDateParams extends IGetKpisParams {
  interval: DateAggregationOption;
}

export interface IGetSpChartDataParams extends IGetKpisParams {
  interval: DateAggregationOption;
}

@Injectable()
export class KpisService {
  constructor(private readonly httpService: HttpService) { }

  getKpis(params: IGetKpisParams) {
    return this.httpService.post('kpis', params);
  }
  getSpChart(params: IGetSpChartDataParams) {
    return this.httpService.post('kpis/chart', params);
  }
}
