import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbDatepickerModule,
  NbIconModule,
  NbAutocompleteModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { ComponentsModule } from '../../../@components/components.module';
import { EventsManagementComponent } from './events-management.component';
import { EditEventVersionComponent } from './widgets/edit-event-version/edit-event-version.component';
import { DetailEventVersionComponent } from './widgets/detail-event-version/detail-event-version.component';
import { SegmentImpactComponent } from './widgets/segment-impact/segment-impact.component';
import { SegmentAdjustmentComponent } from './widgets/segment-impact/segment-adjustment.component';
import { EventTimelineComponent } from './widgets/event-timeline/event-timeline.component';
import { NgApexchartsModule } from 'ng-apexcharts';

const NZ_MODULES = [NzDatePickerModule];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    NbAutocompleteModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbDatepickerModule,
    NbListModule,
    NbSelectModule,
    NbSpinnerModule,
    NgApexchartsModule,
    ...NZ_MODULES,
  ],
  exports: [CommonModule],
  declarations: [
    EditEventVersionComponent,
    DetailEventVersionComponent,
    EventsManagementComponent,
    SegmentAdjustmentComponent,
    SegmentImpactComponent,
    EventTimelineComponent,
  ],
})
export class EventsManagementModule {}
