import { SegmentService } from '@/app/@core/entity/segment.service';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap
} from 'rxjs/operators';
import { SHOULD_LOAD_SEGMENTS, SHOULD_LOAD_SEGMENT_OPTIONS } from '../composed-actions';
import { DELETE_SEGMENT, EDIT_SEGMENT, SAVE_SEGMENT } from '../pages/layout/layout.actions';
import { select_selectedSegment } from '../pages/layout/layout.baseSelectors';
import { select_selectedPlan } from '../pages/layout/layout.selectors';
import {
  DELETE_SEGMENT_FAILED, DELETE_SEGMENT_SUCCESS, EDIT_SEGMENT_FAILED, EDIT_SEGMENT_SUCCESS, LOAD_SEGMENTS, LOAD_SEGMENTS_FAILED,
  LOAD_SEGMENTS_SUCCESS, LOAD_SEGMENT_OPTIONS, LOAD_SEGMENT_OPTIONS_FAILED,
  LOAD_SEGMENT_OPTIONS_SUCCESS, SAVE_SEGMENT_FAILED, SAVE_SEGMENT_SUCCESS
} from './segment.actions';


@Injectable()
export class SegmentEffects {
  trigger_loadSegments = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_SEGMENTS),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, plan]) => plan?.masterInputDatabase),
      filter(notNullOrUndefined),
      map((database) => LOAD_SEGMENTS({ database })),
    );
  });
  loadSegments = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SEGMENTS),
      switchMap(() =>
        // FIXME: should load segment for selected plan/database only
        this.savedSegmentService.getAll().pipe(
          map((data) => LOAD_SEGMENTS_SUCCESS({ data })),
          catchError((error) => of(LOAD_SEGMENTS_FAILED({ error }))),
        ),
      ),
    );
  });

  trigger_loadSegmentOptions = createEffect(() => {
    return this.actions$.pipe(
      ofType(...SHOULD_LOAD_SEGMENT_OPTIONS),
      concatLatestFrom(() => this.store.select(select_selectedPlan)),
      map(([, plan]) => plan),
      filter(notNullOrUndefined),
      distinctUntilChanged(),
      map((plan) => LOAD_SEGMENT_OPTIONS({ planId: plan.id })),
    );
  });

  loadSegmentOptions = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_SEGMENT_OPTIONS),
      switchMap(({ planId }) =>
        this.savedSegmentService.getOptionsWithQuery({ planId }).pipe(
          map((data) => LOAD_SEGMENT_OPTIONS_SUCCESS({ data })),
          catchError((error) => of(LOAD_SEGMENT_OPTIONS_FAILED({ error }))),
        ),
      ),
    );
  });

  saveSegment = createEffect(() => {
    return this.actions$.pipe(
      ofType(SAVE_SEGMENT),
      concatLatestFrom(() => this.store.select(select_selectedSegment)),
      concatMap(([{ segmentName }, selectedSegment]) =>
        this.savedSegmentService.add({ ...selectedSegment, name: segmentName, id: undefined }).pipe(
          map((data) => SAVE_SEGMENT_SUCCESS({ data })),
          catchError((error) => of(SAVE_SEGMENT_FAILED({ error }))),
        ),
      ),
    );
  });
 
  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DELETE_SEGMENT),
      concatMap(({ segment }) =>
        this.savedSegmentService.deleteSegment(segment).pipe(
          map(() => DELETE_SEGMENT_SUCCESS({ segment })),
          catchError((error) => of(DELETE_SEGMENT_FAILED({ error }))),
        ),
      ),
    );
  });

  edit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EDIT_SEGMENT),
      concatMap(({ segment }) =>
        this.savedSegmentService.editSegment(segment).pipe(
          map(() => EDIT_SEGMENT_SUCCESS({ segment })),
          catchError((error) => of(EDIT_SEGMENT_FAILED({ error }))),
        ),
      ),
    );
  });



  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly savedSegmentService: SegmentService,
  ) { }
}
