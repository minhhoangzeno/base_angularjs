import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { equals, pick } from 'rambda';

import {
  CREATE_NEW_SCENARIO_LOCALLY_SUCCESS,
  BEGIN_CREATE_NEW_PLAN,
  CREATE_NEW_SCENARIO_LOCALLY,
  UPDATE_SELECTED_SEGMENT,
  SELECTED_SEGMENT_CHANGED,
  CREATE_NEW_PLAN_SUCCESS,
  CREATE_NEW_PLAN_FAILED,
} from './layout.actions';
import { select_selectedPlan } from './layout.selectors';
import { select_selectedSegment } from './layout.baseSelectors';
import { Segment } from '@/app/@core/interfaces/business/segment';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { generateBlankScenario } from '@/utils/scenario';
import { NbDialogService, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { of, catchError } from 'rxjs';
import { PlanImportService } from '@/app/@core/backend/simcel/plan-import.service';
import { PlanCreationErrorComponent } from '@/app/pages/plan-management/plan-creation-error.component';

@Injectable()
export class LayoutEffects {
  createNewPlan = createEffect(() => {
    return this.actions$.pipe(
      ofType(BEGIN_CREATE_NEW_PLAN),
      switchMap(({ params }) =>
        this.planImportService.createPlanFromPlanImport(params).pipe(
          map((plan) => CREATE_NEW_PLAN_SUCCESS({ plan })),
          tap(() =>
            this.showMessage(
              `Plan created`,
              'Please wait until the plan has finished processing to select it.' +
                ' Using it earlier might result in undesired behaviors',
              10000,
              'warning',
            ),
          ),
          catchError((error) => {
            this.openErrorWindow(error.error.text);
            return of(CREATE_NEW_PLAN_FAILED({ error }));
          }),
        ),
      ),
    );
  });

  // Redirect to Demand Page after created plan
  redirecToDemandPage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CREATE_NEW_PLAN_SUCCESS),
        switchMap(() => this.router.navigate(['pages', 'explorer', 'demand-planning'])),
      );
    },
    { dispatch: false },
  );

  // When creatimg new sceanrio, add a Blank one (based on data from selected Plan)
  // Also navigate to demand-planning page
  createBlankScenario$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CREATE_NEW_SCENARIO_LOCALLY),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, selectedPlan]) => selectedPlan),
      filter(notNullOrUndefined),
      map((selectedPlan) =>
        CREATE_NEW_SCENARIO_LOCALLY_SUCCESS({ scenario: generateBlankScenario(selectedPlan) }),
      ),
      tap(() => void this.router.navigate(['pages', 'explorer', 'demand-planning'])),
    );
  });

  updateSegment = createEffect(() => {
    return this.actions$.pipe(
      ofType(UPDATE_SELECTED_SEGMENT),
      concatLatestFrom(() => this.store.select(select_selectedSegment)),
      map(([{ customer, product, location }, selectedSegment]): Segment | null => {
        const s = pick(['customer', 'location', 'product'], selectedSegment || {});

        if (customer && !equals(customer, s.customer)) s.customer = customer;
        else if (location && !equals(location, s.location)) s.location = location;
        else if (product && !equals(product, s.product)) s.product = product;
        else return null; // no changed

        return s;
      }),
      filter(notNullOrUndefined),
      map((s) => SELECTED_SEGMENT_CHANGED({ segment: s })),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store,
    private readonly dialogService: NbDialogService,
    private readonly toastrService: NbToastrService,
    private readonly planImportService: PlanImportService,
  ) {}

  showMessage(title: string, content: string, durartion: number, status: string) {
    this.toastrService.show(content, title, {
      position: NbGlobalLogicalPosition.BOTTOM_START,
      duration: durartion,
      destroyByClick: true,
      status: status,
    });
  }
  openErrorWindow(errorMessage: string) {
    this.dialogService.open(PlanCreationErrorComponent, {
      hasBackdrop: true,
      closeOnEsc: true,
      closeOnBackdropClick: false,
      context: { errorMessage: errorMessage },
    });
  }
}
