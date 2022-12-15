import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { PlanImportService } from '@/app/@core/entity/plan-import.service';
import {
  LOAD_PLAN_IMPORTS,
  LOAD_PLAN_IMPORTS_FAILED,
  LOAD_PLAN_IMPORTS_SUCCESS,
} from './plan-import.actions';

@Injectable()
export class PlanImportEffects {
  // Call API
  loadPlanImports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_PLAN_IMPORTS),
      switchMap(() =>
        this.planImportService.getAll().pipe(
          map((data) => LOAD_PLAN_IMPORTS_SUCCESS({ data })),
          catchError((error) => of(LOAD_PLAN_IMPORTS_FAILED({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly planImportService: PlanImportService,
  ) {}
}
