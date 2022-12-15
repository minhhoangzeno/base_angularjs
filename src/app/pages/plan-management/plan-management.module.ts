import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCheckboxModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule,
  NbIconModule,
  NbButtonModule,
  NbDialogModule,
  NbDatepickerModule,
} from '@nebular/theme';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveComponentModule } from '@ngrx/component';

import { PlanManagementComponent } from './plan-management.component';
import { PlanCreationErrorComponent } from './plan-creation-error.component';

const NZ_MODULES = [NzDatePickerModule];

@NgModule({
  imports: [
    NbCheckboxModule,
    NbCardModule,
    NbDialogModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveComponentModule,
    ...NZ_MODULES,
  ],
  exports: [PlanManagementComponent],
  declarations: [PlanManagementComponent, PlanCreationErrorComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PlanManagementModule {}
