import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { lastValueFrom, of } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { equals } from 'rambda';
import { NbDialogService } from '@nebular/theme';

import { ScenarioService } from '@/app/@core/entity/scenario.service';
import { Plan, PlanFlag } from '@/app/@core/interfaces/business/plan';
import { q } from '@/utils/request';
import { CLONE_SCENARIO, DELETE_SCENARIO, SAVE_SCENARIO } from '../pages/layout/layout.actions';
import {
  CLONE_SCENARIO_FAILED,
  CLONE_SCENARIO_SUCCESS,
  DELETE_SCENARIO_FAILED,
  DELETE_SCENARIO_SUCCESS,
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS,
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_FAILED,
  LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS,
  LOAD_PRIMARY_SCEANRIO_FAILED,
  LOAD_PRIMARY_SCENARIOS,
  LOAD_PRIMARY_SCENARIOS_SUCCESS,
  LOAD_SCEANRIO_FAILED,
  LOAD_SCENARIOS,
  LOAD_SCENARIOS_SUCCESS,
  SAVE_SCENARIO_FAILED,
  SAVE_SCENARIO_SUCCESS,
} from './scenario.actions';
import { select_selectedPlan } from '../pages/layout/layout.selectors';
import { SimulationService } from '@/app/@core/backend/simcel/simulation.service';
import { SHOULD_LOAD_PRIMARY_SCENARIOS, SHOULD_LOAD_SCENARIOS } from '../composed-actions';
import { ScenarioFlag } from '@/app/@core/interfaces/business/scenario';
import { select_selectedWorkspace } from '../workspace/workspace.selectors';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { generateClonedScenario, isBlankScenario } from '@/utils/scenario';

@Injectable()
export class ScenarioEffects {
  // Load sceanrio data when new Plan is slected
  trigger_load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_SCENARIOS),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, selectedPlan]) => selectedPlan),
      filter(notNullOrUndefined),
      map((selectedPlan) =>
        !selectedPlan.flags?.includes(PlanFlag.ACTUAL)
          ? LOAD_SCENARIOS({ planId: selectedPlan.id })
          : LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS({ planId: selectedPlan.id }),
      ),
    );
  });

  // Load sceanrio data when new Plan is slected
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SCENARIOS),
      switchMap(({ planId }) =>
        this.scenarioService.getWithQuery(q({ planRef: planId })).pipe(
          map((data) => LOAD_SCENARIOS_SUCCESS({ data })),
          catchError((error) => of(LOAD_SCEANRIO_FAILED({ error }))),
        ),
      ),
    );
  });

  // Same as above effect, but will trigger difference action
  // Use for forecast integrations (to be deprecared)
  load_legacy = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS),
      switchMap(({ planId }) =>
        this.scenarioService.getWithQuery(q({ planRef: planId })).pipe(
          map((data) => LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_SUCCESS({ data })),
          catchError((error) => of(LOAD_LEGACY_ACTUAL_AND_COMMITTED_SCENARIOS_FAILED({ error }))),
        ),
      ),
    );
  });

  // Load all primary scenarios of workspace
  trigger_load_primary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_PRIMARY_SCENARIOS),
      debounceTime(100), // Because we're watching several actions here, let's debound it a bit in case it trigger together
      concatLatestFrom(() => this.store.select(select_selectedWorkspace)),
      filter(([, selectedWorkspace]) => !!selectedWorkspace),
      map(([, selectedWorkspace]) => selectedWorkspace),
      map((selectedWorkspace) => LOAD_PRIMARY_SCENARIOS({ workspaceId: selectedWorkspace.id })),
    );
  });

  // Load primary sceanrio data when new Plan is slected
  loadPrimaryScenarios$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_PRIMARY_SCENARIOS),
      switchMap(({ workspaceId }) =>
        this.scenarioService
          .getWithQuery(q({ workspace: workspaceId, flags: ScenarioFlag.PRIMARY }))
          .pipe(
            map((data) => LOAD_PRIMARY_SCENARIOS_SUCCESS({ data })),
            catchError((error) => of(LOAD_PRIMARY_SCEANRIO_FAILED({ error }))),
          ),
      ),
    );
  });

  save$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SAVE_SCENARIO),
      switchMap(({ scenario, reSimulate }) =>
        (isBlankScenario(scenario) // The id property is the indicator if we want to create or update a scenario.
          ? this.scenarioService.add(scenario)
          : this.scenarioService.update(scenario)
        ).pipe(
          map((updatedScenario) =>
            SAVE_SCENARIO_SUCCESS({
              scenario: {
                ...updatedScenario,
                simulateWithUI: scenario.simulateWithUI,
              },
              reSimulate,
            }),
          ),
          catchError((error) => of(SAVE_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_SCENARIO),
      filter(({ scenario }) => !scenario.blankScenario),
      concatMap(({ scenario }) =>
        this.scenarioService.delete(scenario).pipe(
          map(() => DELETE_SCENARIO_SUCCESS({ scenario })),
          catchError((error) => of(DELETE_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  clone = createEffect(() => {
    return this.actions$.pipe(
      ofType(CLONE_SCENARIO),
      concatMap(({ scenario }) =>
        this.scenarioService.add(generateClonedScenario(scenario)).pipe(
          map((scenario) => CLONE_SCENARIO_SUCCESS({ scenario, reSimulate: true })),
          catchError((error) => of(CLONE_SCENARIO_FAILED({ error }))),
        ),
      ),
    );
  });

  // Kick-off simulation for the updated scenario.
  runSimulator = createEffect(
    () => {
      return this.actions$.pipe(
        // Also show scenaio when it added/cloned
        ofType(CLONE_SCENARIO_SUCCESS, SAVE_SCENARIO_SUCCESS),
        concatLatestFrom(() => this.store.select(select_selectedPlan)),
        filter(([, selectedPlan]) => !!selectedPlan),
        concatMap(([{ scenario, reSimulate }, selectedPlan]) =>
          reSimulate
            ? this.simulationSerivce.create({
                scenarioId: scenario.id,
                withUI: scenario.simulateWithUI,
              })
            : '',
        ),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly scenarioService: ScenarioService,
    private readonly simulationSerivce: SimulationService,
  ) {}
}
