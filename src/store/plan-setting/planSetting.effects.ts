import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import {
  ADD_DISPLAYED_SCENARIO,
  CHANGE_DISPLAYED_SCENARIO,
  CLONE_SCENARIO,
  DELETE_DISPLAYED_SCENARIO,
  DELETE_SCENARIO,
  EDIT_SCENARIO,
  HIDE_DISPLAYED_SCENARIO,
  SAVE_SCENARIO,
} from '../pages/layout/layout.actions';
import {
  select_selectedPlan,
} from '../pages/layout/layout.selectors';
import { SHOULD_LOAD_PLAN_SETTING, } from '../composed-actions';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { ADD_DISPLAYED_SCENARIO_FAILED, ADD_DISPLAYED_SCENARIO_SUCCESS, CHANGED_DISPLAYED_SCENARIO_SUCCESS, CHANGE_DISPLAYED_SCENARIO_FAILED, DELETE_DISPLAYED_SCENARIO_FAILED, DELETE_DISPLAYED_SCENARIO_SUCCESS, HIDE_DISPLAYED_SCENARIO_FAILED, HIDE_DISPLAYED_SCENARIO_SUCCESS, LOAD_PLAN_SETTING, LOAD_PLAN_SETTING_FAILED, LOAD_PLAN_SETTING_SUCCESS } from './planSetting.actions';
import { PlanSettingService } from '@/app/@core/entity/plan-setting.service';
import { of } from 'rxjs';
import { CLONE_SCENARIO_SUCCESS, DELETE_SCENARIO_SUCCESS, SAVE_SCENARIO_SUCCESS } from '../scenario/scenario.actions';

@Injectable()
export class PlanSettingEffects {
  // Load plan setting data when new Plan is selected
  trigger_load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_PLAN_SETTING),
      debounceTime(100),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, selectedPlan]) => selectedPlan),
      filter(notNullOrUndefined),
      map((selectedPlan) =>
        LOAD_PLAN_SETTING({ planId: selectedPlan.id })
      ),
    );
  });

  // Load plan setting data when new Plan is selected
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_PLAN_SETTING),
      switchMap(({ planId }) =>
        this.planSettingService.getSetting(planId).pipe(
          map((planSetting) => LOAD_PLAN_SETTING_SUCCESS({ planSetting })),
          catchError((error) => of(LOAD_PLAN_SETTING_FAILED({ error }))),
        ),
      ),
    );
  });

  add$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CLONE_SCENARIO_SUCCESS, SAVE_SCENARIO_SUCCESS, ADD_DISPLAYED_SCENARIO, EDIT_SCENARIO),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      switchMap(([{ scenario }, selectedPlan]) =>
        this.planSettingService.addDisplayedScenario(selectedPlan?.id!, scenario.id).pipe(
          map((planSetting) => ADD_DISPLAYED_SCENARIO_SUCCESS({ planSetting })),
          catchError((error) => of(ADD_DISPLAYED_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_SCENARIO_SUCCESS),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      switchMap(([{ scenario }, selectedPlan]) =>
        this.planSettingService.deleteDisplayedScenario(selectedPlan?.id!, scenario.id).pipe(
          map((planSetting) => DELETE_DISPLAYED_SCENARIO_SUCCESS({ planSetting })),
          catchError((error) => of(DELETE_DISPLAYED_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  hide$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HIDE_DISPLAYED_SCENARIO),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      switchMap(([{ scenario }, selectedPlan]) =>
        this.planSettingService.hideDisplayedScenario(selectedPlan?.id!, scenario.id).pipe(
          map((planSetting) => HIDE_DISPLAYED_SCENARIO_SUCCESS({ planSetting })),
          catchError((error) => of(HIDE_DISPLAYED_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CHANGE_DISPLAYED_SCENARIO),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      switchMap(([{ scenarios }, selectedPlan]) => {
        let scenarioIds: string[] = [];
        scenarios.forEach((scenario) => scenarioIds.push(scenario.id))
        return this.planSettingService.changeDisplayedScenario(selectedPlan?.id!, scenarioIds).pipe(
          map((planSetting) => CHANGED_DISPLAYED_SCENARIO_SUCCESS({ planSetting })),
          catchError((error) => of(CHANGE_DISPLAYED_SCENARIO_FAILED({ error }))),
        )
      }
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly planSettingService: PlanSettingService,
  ) { }
}
