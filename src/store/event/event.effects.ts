import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap } from 'rxjs/operators';

import { ErrorMessageDialogComponent } from '@/app/@components/common/error-message-dialog/error-message-dialog.component';
import { PricingGenerationService } from '@/app/@core/backend/simcel/pricing-generation.service';
import { EventVersionService } from '@/app/@core/entity/event-version.service';
import { EventService } from '@/app/@core/entity/event.service';
import { EventVersion } from '@/app/@core/interfaces/business/event';
import { Plan } from '@/app/@core/interfaces/business/plan';
import {
  CREATE_NEW_EVENT_VERSION_LOCALLY,
  CREATE_NEW_EVENT_VERSION_LOCALLY_SUCCESS,
  DELETE_EVENT_VERSION,
  BEGIN_EDIT_EVENT_VERSION,
  SAVE_EVENT_VERSION,
} from '../pages/event-management/event-management.actions';
import { select_selectedDateRange, select_selectedPlan } from '../pages/layout/layout.selectors';
import {
  DELETE_EVENT_VERSION_FAILED,
  DELETE_EVENT_VERSION_SUCCESS,
  LOAD_EVENTS,
  LOAD_EVENTS_FAILED,
  LOAD_EVENTS_SUCCESS,
  LOAD_WORKSPACE_EVENTS,
  LOAD_WORKSPACE_EVENTS_FAILED,
  LOAD_WORKSPACE_EVENTS_SUCCESS,
  SAVE_EVENT_VERSION_FAILED,
  SAVE_EVENT_VERSION_SUCCESS,
} from './event.actions';
import { SHOULD_LOAD_EVENTS } from '../composed-actions';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { select_params_loadDemandImpactsChartData } from '../pages/demand-planning/demand-planning.selectors';

/** Create a bare-minimum event-version object that can be edited. */
export function createDummyEventVersion(plan?: Plan): EventVersion {
  const baseDate = plan?.futurePlanStartDate ? new Date(plan.futurePlanStartDate) : new Date();
  const startDate = baseDate.toISOString().slice(0, 10);
  baseDate.setMonth(baseDate.getMonth() + 1);
  const endDate = baseDate.toISOString().slice(0, 10);

  return {
    id: '',
    name: '',
    startDate,
    endDate,
    segmentImpacts: [],
  };
}

@Injectable()
export class EventEffects {
  trigger_loadEvents = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_EVENTS),
      concatLatestFrom(() => this.store.select(select_selectedDateRange)),
      map(([, dateRange]) => dateRange),
      filter(notNullOrUndefined),
      map((dateRange) =>
        LOAD_EVENTS({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      ),
    );
  });

  loadEvents = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_EVENTS),
      switchMap(({ startDate, endDate }) =>
        this.eventsService.getWithQuery({ startDate, endDate }).pipe(
          map((data) => LOAD_EVENTS_SUCCESS({ data })),
          catchError((error) => of(LOAD_EVENTS_FAILED({ error }))),
        ),
      ),
    );
  });

  trigger_loadWorksapceEvents = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_EVENTS),
      filter(notNullOrUndefined),
      map(() =>
        LOAD_WORKSPACE_EVENTS(),
      ),
    );
  });

  loadWorkspaceEvents = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_WORKSPACE_EVENTS),
      switchMap(({ }) =>
        this.eventsService.getWithQuery({ }).pipe(
          map((workspaceData) => LOAD_WORKSPACE_EVENTS_SUCCESS({ workspaceData })),
          catchError((error) => of(LOAD_WORKSPACE_EVENTS_FAILED({ error }))),
        ),
      ),
    );
  });

  // Creating EventVersion: Add a new one based on selected Plan
  createEvent = createEffect(() => {
    return this.actions$.pipe(
      ofType(CREATE_NEW_EVENT_VERSION_LOCALLY),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, selectedPlan]) => selectedPlan),
      filter(notNullOrUndefined),
      map(createDummyEventVersion),
      map((version) => CREATE_NEW_EVENT_VERSION_LOCALLY_SUCCESS({ version })),
    );
  });

  // Show error dialog
  showErrorDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DELETE_EVENT_VERSION_FAILED),
        concatMap(
          ({ error }) =>
            this.dialogService.open(ErrorMessageDialogComponent, {
              closeOnBackdropClick: false,
              context: error,
            }).onClose,
        ),
      );
    },
    { dispatch: false },
  );

  // Saving EventVersion:
  saveEvent = createEffect(() => {
    return this.actions$.pipe(
      ofType(SAVE_EVENT_VERSION),
      concatLatestFrom(() => this.store.select(select_params_loadDemandImpactsChartData)),
      filter(([, params]) => !!params),
      concatMap(([{ event, version }, params]) =>
        from(this.eventVersionService.addOrUpdateEventVersion(version, event, params!)).pipe(
          map(({ version, confirmed, editEventVersion }) => {
            if (!confirmed && editEventVersion) {
              return BEGIN_EDIT_EVENT_VERSION({ version: version })
            }
            return SAVE_EVENT_VERSION_SUCCESS({ data: version })
          }),
          catchError((error) => of(SAVE_EVENT_VERSION_FAILED({ error }))),
        ),
      ),
    );
  });

  // Call the demand generator to create new demand for the updated event.
  generatePricing = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SAVE_EVENT_VERSION_SUCCESS),
        concatLatestFrom(() => this.store.select(select_selectedPlan)),
        filter(([, selectedPlan]) => !!selectedPlan),
        concatMap(([{ data: version }, selectedPlan]) =>
          this.pricingGenerationService.createPricingForEventVersion(
            version,
            selectedPlan!.id,
          ),
        ),
      );
    },
    { dispatch: false },
  );

  // Deleting EventVersion:
  deleteEventVersion = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_EVENT_VERSION),
      concatMap(({ version }) =>
        from(this.eventVersionService.delete(version)).pipe(
          map(() => DELETE_EVENT_VERSION_SUCCESS()),
          catchError((error) => of(DELETE_EVENT_VERSION_FAILED({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly eventsService: EventService,
    private readonly eventVersionService: EventVersionService,
    private readonly pricingGenerationService: PricingGenerationService,
    private readonly dialogService: NbDialogService,
  ) { }
}
