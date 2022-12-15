import { PlanService } from '@/app/@core/entity/plan.service';
import { refId } from '@/app/@core/interfaces/common/mongo';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap } from 'rxjs/operators';

import { SHOULD_LOAD_PLANS } from '../composed-actions';
import { HIDE_SCENARIO, SHOW_SCENARIO, SET_PRIMARY_SCENARIO, SET_SCENARIOS } from '../pages/layout/layout.actions';
import { select_selectedPlan } from '../pages/layout/layout.selectors';
import {
  CLONE_SCENARIO_SUCCESS,
  SAVE_SCENARIO_SUCCESS,
  DELETE_SCENARIO_SUCCESS,
} from '../scenario/scenario.actions';
import { select_selectedForecastBaseScenario } from '../scenario/scenario.selectors';
import {
  LOAD_PLANS,
  LOAD_PLANS_FAILED,
  LOAD_PLANS_SUCCESS,
  SET_PRIMARY_SCENARIO_FAILED,
  SET_PRIMARY_SCENARIO_SUCCESS,
} from './plan.actions';

@Injectable()
export class PlanEffects {
  trigger_loadPlans = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_PLANS),
      map(() => LOAD_PLANS()),
    );
  });

  loadPlans = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_PLANS),
      switchMap(() =>
        this.planService.getAll().pipe(
          map((plans) => LOAD_PLANS_SUCCESS({ data: plans })),
          catchError((error) => of(LOAD_PLANS_FAILED({ error }))),
        ),
      ),
    );
  });

  // Update primary sceanrio
  setPrimarySceanrio = createEffect(() => {
    return this.actions$.pipe(
      ofType(SET_PRIMARY_SCENARIO),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      filter(([, selectedPlan]) => !!selectedPlan),
      concatMap(([{ scenario }, selectedPlan]) =>
        from(this.planService.updatePrimaryScenario(selectedPlan!, scenario)).pipe(
          map((plan) => SET_PRIMARY_SCENARIO_SUCCESS({ plan })),
          catchError((error) => of(SET_PRIMARY_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  // hideScenario = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(HIDE_SCENARIO),
  //     concatLatestFrom(() => this.store.select(select_selectedPlan)),
  //     filter(([, selectedPlan]) => !!selectedPlan),
  //     concatMap(([{ scenario }, selectedPlan]) =>
  //       this.planService
  //         .update({
  //           ...selectedPlan,
  //           displayedScenarios: selectedPlan?.displayedScenarios?.filter(
  //             (s) => refId(s) !== scenario.id,
  //           ),
  //         })
  //         .pipe(
  //           map((plan) => UPDATE_DISPLAYED_SCENARIO_SUCCESS({ plan })),
  //           catchError((error) => of(UPDATE_DISPLAYED_SCENARIO_FAILED({ error }))),
  //         ),
  //     ),
  //   );
  // });

  // showScenario = createEffect(() => {
  //   return this.actions$.pipe(
  //     // Also show scenaio when it added/cloned
  //     ofType(SHOW_SCENARIO, CLONE_SCENARIO_SUCCESS, SAVE_SCENARIO_SUCCESS),
  //     concatLatestFrom(() => this.store.select(select_selectedPlan)),
  //     filter(([, selectedPlan]) => !!selectedPlan),
  //     concatMap(([{ scenario }, selectedPlan]) =>
  //       this.planService
  //         .update({
  //           ...selectedPlan,
  //           displayedScenarios:
  //             selectedPlan?.displayedScenarios
  //               ?.filter((s) => refId(s) !== scenario.id)
  //               ?.concat(scenario) || [],
  //         })
  //         .pipe(
  //           map((plan) => UPDATE_DISPLAYED_SCENARIO_SUCCESS({ plan })),
  //           catchError((error) => of(UPDATE_DISPLAYED_SCENARIO_FAILED({ error }))),
  //         ),
  //     ),
  //   );
  // });

  //Make sure the ForecastBase Scenario become primary if user delete a primary scenario
  ensurePrimarySceanrio = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_SCENARIO_SUCCESS),
      concatLatestFrom(() => this.store.select(select_selectedForecastBaseScenario)),
      filter(
        ([{ scenario }, { selectedPlan }]) => refId(selectedPlan?.primaryScenario) === scenario.id,
      ),
      concatMap(([, { forecastBaseScenario, selectedPlan }]) =>
        this.planService
          .update({ ...selectedPlan, primaryScenario: forecastBaseScenario?.id })
          .pipe(
            map((plan) => SET_PRIMARY_SCENARIO_SUCCESS({ plan })),
            catchError((error) => of(SET_PRIMARY_SCENARIO_FAILED({ error }))),
          ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly planService: PlanService,
    private readonly store: Store,
  ) { }
}
