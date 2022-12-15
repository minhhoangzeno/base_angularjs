import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TypedAction } from '@ngrx/store/src/models';

import { DemandService } from '@/app/@core/entity/demand.service';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import {
  SHOULD_LOAD_DEMAND_CHART_DATA,
  SHOULD_LOAD_DEMAND_IMPACT_CHART_DATA,
} from '@/store/composed-actions';
import {
  select_params_loadDemandChartData,
  select_params_loadDemandImpactsChartData,
} from './demand-planning.selectors';
import {
  LOAD_DEMAND_CHART_DATA,
  LOAD_DEMAND_CHART_DATA_FAILED,
  LOAD_DEMAND_CHART_DATA_SUCCESS,
  LOAD_DEMAND_IMPACTS_CHART_DATA,
  LOAD_DEMAND_IMPACTS_CHART_DATA_FAILED,
  LOAD_DEMAND_IMPACTS_CHART_DATA_SUCCESS,
} from './demand-planning.actions';

@Injectable()
export class DemandPlanningPageEffects {
  trigger_loadDemands = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_DEMAND_CHART_DATA),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_params_loadDemandChartData)),
      map(([, params]) => params),
      filter(notNullOrUndefined),
      map((params) => LOAD_DEMAND_CHART_DATA({ params })),
    );
  });

  loadDemands = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_DEMAND_CHART_DATA),
      concatMap(({ params }) =>
        this.demandService.getDemands(params).pipe(
          map((data) => LOAD_DEMAND_CHART_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_DEMAND_CHART_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  trigger_loadDemandImpacts = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_DEMAND_IMPACT_CHART_DATA),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_params_loadDemandImpactsChartData)),
      map(([, params]) => params),
      filter(notNullOrUndefined),
      map((params) => LOAD_DEMAND_IMPACTS_CHART_DATA({ params })),
    );
  });

  loadDemandImpactss = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_DEMAND_IMPACTS_CHART_DATA),
      concatMap(({ params }) =>
        this.demandService.getDemandImpacts(params).pipe(
          map((data) => LOAD_DEMAND_IMPACTS_CHART_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_DEMAND_IMPACTS_CHART_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly demandService: DemandService,
    private readonly store: Store,
    private readonly notification: NzNotificationService,
  ) {}

  private handleError(action: TypedAction<string> & { error: any }) {
    this.notification.create('error', 'Error', action.type);
    console.debug(action.type, action.error);
    return of(action);
  }
}
