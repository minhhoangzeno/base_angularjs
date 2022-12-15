import { InputDataService } from '@/app/pages/explorer/input-data/input-data.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  LOAD_EDITED_INPUT_DATA,
  LOAD_EDITED_INPUT_DATA_FAILED,
  LOAD_EDITED_INPUT_DATA_SUCCESS,
  LOAD_INPUT_DATA,
  LOAD_INPUT_DATA_FAILED,
  LOAD_INPUT_DATA_SUCCESS,
  LOAD_INPUT_DATA_TOTAL,
  LOAD_INPUT_DATA_TOTAL_FAILED,
  LOAD_INPUT_DATA_TOTAL_SUCCESS,
  UPSERT_INPUT_DATA,
  UPSERT_INPUT_DATA_FAILED,
  UPSERT_INPUT_DATA_SUCCESS,
} from './input-data.actions';

@Injectable()
export class InputDataEffects {
  load = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_INPUT_DATA),
      switchMap(({ params }) =>
        this.inputDataService.load(params).pipe(
          map((data) => LOAD_INPUT_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_INPUT_DATA_FAILED({ error }))),
        ),
      ),
    );
  });
  loadTotal = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_INPUT_DATA_TOTAL),
      switchMap(({ params }) =>
        this.inputDataService.loadTotal(params).pipe(
          map((data) => LOAD_INPUT_DATA_TOTAL_SUCCESS({ count: data })),
          catchError((error) => this.handleError(LOAD_INPUT_DATA_TOTAL_FAILED({ error }))),
        ),
      ),
    );
  });

  loadEdited = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_EDITED_INPUT_DATA),
      switchMap(({ params }) =>
        this.inputDataService.loadEditied(params).pipe(
          map((data) => LOAD_EDITED_INPUT_DATA_SUCCESS({ data })),
          catchError((error) => this.handleError(LOAD_EDITED_INPUT_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  upsert = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPSERT_INPUT_DATA),
      switchMap(({ params }) =>
        this.inputDataService.upsert(params).pipe(
          map(() => LOAD_EDITED_INPUT_DATA({ params })),
          catchError((error) => this.handleError(UPSERT_INPUT_DATA_FAILED({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly inputDataService: InputDataService,
    private readonly notification: NzNotificationService,
  ) {}

  private handleError(action: TypedAction<string> & { error: any }) {
    this.notification.create('error', 'Error', action.type);
    console.debug(action.type, action.error);
    return of(action);
  }
}
