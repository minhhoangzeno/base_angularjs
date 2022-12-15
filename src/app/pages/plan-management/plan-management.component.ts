import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbDialogRef,
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogService,
} from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { filter, map, pairwise, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { addYears } from 'date-fns';

import { Plan } from '../../@core/interfaces/business/plan';
import { PlanImport } from '../../@core/interfaces/business/plan-import';

import { SimpleDateRange } from '../../@core/interfaces/common/date-range';
import { select_availablePlanImports } from '@/store/plan-import/plan-import.selectors';
import { convertToSimpleDateRangeFromRangepickerVal } from '../../../utils/calendar';
import { LOAD_PLAN_IMPORTS } from '@/store/plan-import/plan-import.actions';
import { BEGIN_CREATE_NEW_PLAN } from '@/store/pages/layout/layout.actions';
import { PlanCreationErrorComponent } from './plan-creation-error.component';
import {
  select_creatingPlan,
  select_creatingPlanError,
} from '@/store/pages/layout/layout.baseSelectors';

// const now = new Date();
// const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

@Component({
  selector: 'cel-plan-management',
  templateUrl: './plan-management.component.html',
  styleUrls: ['./plan-management.component.scss'],
})
export class PlanManagementComponent implements OnInit, OnDestroy {
  form_rangeSelected = new FormControl([]);

  selectedPlanImport?: PlanImport;
  planTitle = '';
  planDescription = '';
  planDateRange?: SimpleDateRange;
  preDate: Date = new Date();
  now: Date[] = [new Date(), new Date()];
  updateMode = false;
  selectExistingPlan = 10;
  forecastingMethod = 'Prophet';
  useForecasting = false;
  createdPlan?: Plan;

  planImports = this.store.select(select_availablePlanImports);
  creatingPlan = this.store.select(select_creatingPlan);
  creatingPlan_error = this.store.select(select_creatingPlanError);

  presettedDateRanges = {
    'One year plan': [this.preDate, addYears(this.preDate, 1)],
    'Two year plan': [this.preDate, addYears(this.preDate, 2)],
    'Three year plan': [this.preDate, addYears(this.preDate, 3)],
    'Five year plan': [this.preDate, addYears(this.preDate, 5)],
  };

  /** Unsubscribe helper. */
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly store: Store,
    private readonly dialogRef: NbDialogRef<Plan>,
    private readonly toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(LOAD_PLAN_IMPORTS());
    this.bindFormControlToProp();

    this.creatingPlan
      .pipe(
        pairwise(),
        withLatestFrom(this.creatingPlan_error),
        tap(([[previousVal, currentVal], error]) => {
          // Close the dialog if its status changed from 'true' to 'false' and having no error
          if (previousVal === true && currentVal === false && !error) this.close();
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private bindFormControlToProp() {
    this.form_rangeSelected.valueChanges.subscribe(result => {
      this.onChangePresettedDateRanges(result[0])
    });
    this.form_rangeSelected.valueChanges
      .pipe(
        map(convertToSimpleDateRangeFromRangepickerVal),
        filter((data) => !!data.start && !!data.end),
        tap((data) => (this.planDateRange = data)),
        takeUntil(this.unsubscribe),
      )
      .subscribe();


  }

  onChangePresettedDateRanges(e: Date) {
    this.presettedDateRanges = {
      'One year plan': [e, addYears(e, 1)],
      'Two year plan': [e, addYears(e, 2)],
      'Three year plan': [e, addYears(e, 3)],
      'Five year plan': [e, addYears(e, 5)],
    }
  }

  changeMode(checked: boolean) {
    this.updateMode = checked;
  }
  changeDate(e){
    this.onChangePresettedDateRanges(e[0])
  }

  changeCreateMode(checked: boolean) {
    this.useForecasting = checked;

    if (checked) {
      this.selectedPlanImport = undefined;
    }
  }

  create() {
    this.store.dispatch(
      BEGIN_CREATE_NEW_PLAN({
        params: {
          planImport: this.selectedPlanImport,
          title: this.planTitle,
          description: this.planDescription,
          useForecasting: this.useForecasting,
          futureStartDate: this.planDateRange?.start || '',
          futureEndDate: this.planDateRange?.end || '',
          forecastingMethod: this.forecastingMethod,
        },
      }),
    );
  }

  showMessage(title: string, content: string, durartion: number, status: string) {
    this.toastrService.show(content, title, {
      position: NbGlobalLogicalPosition.BOTTOM_START,
      duration: durartion,
      destroyByClick: true,
      status: status,
    });
  }

  close() {
    this.dialogRef.close();
  }

  generateCreateBtnClass() {
    return this.planTitle != '' && this.selectedPlanImport != null
      ? 'plan-mgt-btn -save'
      : 'plan-mgt-btn -cancel';
  }

  isCreateButnDisabled(): boolean {
    if (!this.useForecasting) {
      if (!this.selectedPlanImport) {
        return true;
      }
    } else {
      if (!this.planDateRange) {
        return true;
      }
    }

    if (this.planTitle === '') {
      return true;
    }

    return false;
  }

  openErrorWindow(errorMessage: string) {
    this.dialogService.open(PlanCreationErrorComponent, {
      hasBackdrop: true,
      closeOnEsc: true,
      closeOnBackdropClick: false,
      context: {
        errorMessage: errorMessage,
      },
    });
  }
}
