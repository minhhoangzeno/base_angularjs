import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxColorsModule } from 'ngx-colors';
import {
  NbSelectModule,
  NbInputModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbTooltipModule,
  NbIconModule,
  NbListModule,
  NbPopoverModule,
  NbTabsetModule,
  NbToggleModule,
  NbFormFieldModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbTreeGridModule,
  NbDialogModule,
  NbContextMenuModule,
  NbRadioModule,
  NbToastrModule,
  NbSpinnerModule,
  NbAutocompleteModule,
} from '@nebular/theme';
import { ReactiveComponentModule } from '@ngrx/component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';

import { FilteringByNamePipe } from '../pipes/filtering-by-name.pipe';
import { CelTreeMultiselectComponent } from './common/tree-multiselect/tree-multiselect.component';
import { NgxTreeMultiselectGridComponent } from './common/tree-multiselect/tree-multiselect-grid.component';
import { CelValidationMessageComponent } from './common/validation-message/validation-message.component';
import { PlanManagementModule } from '../pages/plan-management/plan-management.module';
import { PlanningCommentsComponent } from './business/planning-comments/planning-comments.component';
import { PlanningEventItemComponent } from './business/planning-events/planning-event-item.component';
import { PlanningEventListComponent } from './business/planning-events/planning-event-list.component';
import { PlanningEventVersionItemComponent } from './business/planning-events/planning-event-version-item.component';
import { PlanningImportComponent } from './business/planning-import/planning-import.component';
import { PlanningScenarioBadgeComponent } from './business/planning-scenarios/planning-scenario-badge.component';
import { PlanningScenarioItemComponent } from './business/planning-scenarios/planning-scenario-item.component';
import { PlanningScenariosComponent } from './business/planning-scenarios/planning-scenarios.component';
import { PlanningSegmentComponent } from './business/planning-segment/planning-segment.component';
import { PlanningSegmentDialogComponent } from './business/planning-segment/planning-segment-dialog.component';
import { SegmentManagementComponent } from './business/planning-segment/segment-management.component';
import { WidgetManagementDialogComponent } from './business/planning-segment/widget-management.component';
import { ExternalRGeneratedContentComponent } from './common/external-r-generated-content/external-r-generated-content.component';
import { DownloadScenarioComponent } from './business/planning-scenarios/download-scenario.component';
import { SelectTreeComponent } from './common/select-tree/select-tree.component';
import { SegmentSelectBoxComponent } from './common/segment-select-box/segment-select-box.component';
import { EntitySelectBoxComponent } from './common/segment-select-box/entity-select-box.component';
import { ErrorMessageDialogComponent } from './common/error-message-dialog/error-message-dialog.component';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { EditEventVersionWarningDialog } from './common/edit-event-version-warning-dialog/edit-event-version-warning-dialog.components';
import { DefaultToPipe } from '../pipes/defaultTo.pipe';
import { EnsureArrayPipe } from '../pipes/ensureArray.pipe';
import { NullToUndefinedPipe } from '../pipes/null2undefined.pipe';
import { DateAggregationPicker } from './common/date-aggregation-picker';
import { SafeUrlPipe } from '../pipes/safeURL.pipe';

const COMPONENTS = [
  CelValidationMessageComponent,
  CelTreeMultiselectComponent,
  NgxTreeMultiselectGridComponent,
  PlanningCommentsComponent,
  PlanningEventItemComponent,
  PlanningEventListComponent,
  PlanningEventVersionItemComponent,
  PlanningScenariosComponent,
  PlanningScenarioItemComponent,
  PlanningScenarioBadgeComponent,
  PlanningSegmentComponent,
  PlanningSegmentDialogComponent,
  PlanningImportComponent,
  SegmentManagementComponent,
  WidgetManagementDialogComponent,
  FilteringByNamePipe,
  ExternalRGeneratedContentComponent,
  SelectTreeComponent,
  SegmentSelectBoxComponent,
  ErrorMessageDialogComponent,
  ConfirmDialogComponent,
  DateAggregationPicker,
  EditEventVersionWarningDialog,
  DefaultToPipe,
  EnsureArrayPipe,
  NullToUndefinedPipe,
  SafeUrlPipe,
];
const NZ_MODULES = [
  ReactiveComponentModule,
  NzDatePickerModule,
  NzButtonModule,
  NzIconModule,
  NzTableModule,
  NzPopoverModule,
  NzNotificationModule,
  NzSpinModule,
  NzTabsModule,
  NzInputModule,
  NgxColorsModule
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NbAccordionModule,
    NbAutocompleteModule,
    NbBadgeModule,
    NbButtonModule,
    DragDropModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbTooltipModule,
    NbDialogModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbPopoverModule,
    NbSelectModule,
    NbTabsetModule,
    NbToggleModule,
    NbTreeGridModule,
    NbRadioModule,
    NbToastrModule,
    NbSpinnerModule,
    PlanManagementModule,
    ...NZ_MODULES,
  ],
  exports: [...COMPONENTS, ...NZ_MODULES],
  declarations: [...COMPONENTS, EntitySelectBoxComponent, DownloadScenarioComponent],
})
export class ComponentsModule {}
