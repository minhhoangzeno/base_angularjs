import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createEffect, ofType, concatLatestFrom, Actions } from '@ngrx/effects';
import { debounceTime, map, filter, concatMap, catchError, of } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TypedAction } from '@ngrx/store/src/models';

import { SHOULD_LOAD_KPIS_CHART_DATA, SHOULD_LOAD_KPIS_DATA } from '@/store/composed-actions';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import {
  LOAD_KPIS_DATA,
  LOAD_KPIS_DATA_SUCCESS,
  LOAD_KPIS_DATA_FAILED,
  LOAD_SP_CHART_DATA,
  LOAD_SP_CHART_DATA_SUCCESS,
  LOAD_SP_CHART_DATA_FAILED,
} from './planning-explorer.actions';
import {
  select_params_loadKpisData,
  select_params_loadSpChartData,
} from './planning-explorer.selector';
import { KpisService } from '@/app/@core/services/kpis.service';

@Injectable()
export class BizPageEffects {
  trigger_loadKpis = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_KPIS_DATA),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_params_loadKpisData)),
      map(([, params]) => params),
      filter(notNullOrUndefined),
      map((params) => LOAD_KPIS_DATA({ params })),
    );
  });

  loadKpis = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_KPIS_DATA),
      concatMap(({ params }) =>
        this.kpisService.getKpis(params).pipe(
          map((data) => LOAD_KPIS_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_KPIS_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  trigger_loadSpChart = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_KPIS_CHART_DATA),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_params_loadSpChartData)),
      map(([, params]) => params),
      filter(notNullOrUndefined),
      map((params) => LOAD_SP_CHART_DATA({ params })),
    );
  });

  loadSpChart = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SP_CHART_DATA),
      concatMap(({ params }) =>
        this.kpisService.getSpChart(params).pipe(
          map((data) => LOAD_SP_CHART_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_SP_CHART_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly kpisService: KpisService,
    private readonly notification: NzNotificationService,
  ) {}

  private handleError(action: TypedAction<string> & { error: any }) {
    this.notification.create('error', 'Error', action.type);
    console.debug(action.type, action.error);
    return of(action);
  }
}
