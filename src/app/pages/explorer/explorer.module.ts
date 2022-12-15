import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbDatepickerModule,
  NbTooltipModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbListModule,
  NbBadgeModule,
  NbTabsetModule,
  NbToggleModule,
  NbRadioModule,
  NbFormFieldModule,
  NbAccordionModule,
  NbTreeGridModule,
  NbDialogModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ComponentsModule } from '../../@components/components.module';
import { KpiFormattingPipe } from '../../pipes/kpi-formatting.pipe';

import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerComponent } from './explorer.component';
import { BreakdownComponent } from './planning-explorer/widgets/breakdown/breakdown.component';
import { MapComponent } from './supply-explorer/map/map.component';
import { TimeseriesComponent } from './planning-explorer/widgets/timeseries/timeseries.component';
import { KpisComponent } from './planning-explorer/widgets/kpis/kpis.component';
import { PlanningExplorerComponent } from './planning-explorer/planning-explorer.component';
import { DemandChartComponent } from './demand-planning/widgets/demand-chart.component';
import { DemandPlanningComponent } from './demand-planning/demand-planning.component';
import { OrganizeDetailDialogComponent } from './demand-planning/widgets/forecast-table/organize-detail-dialog.component';
import { EventsManagementModule } from './events-management/events-management.module';
import { InventoryComponent } from './supply-explorer/inventory/inventory.component';
import { ProfitExplorerComponent } from './profit-explorer/profit-explorer.component';
import { SupplyExplorerComponent } from './supply-explorer/supply-explorer.component';
import { SankeyChartComponent } from './supply-explorer/sankey-chart/sankey-chart.component';
import { ForecastComponent } from './forecast/forecast.component';
import { TaskService } from '@/app/@core/backend/simcel/task.service';
import { DemandTableComponent } from './demand-planning/widgets/demand-table.component';
import { InputDataComponent } from './input-data/input-data.component';
import { InputDataService } from './input-data/input-data.service';
import { KpisSettingComponent } from './planning-explorer/widgets/kpis-setting/kpis-setting.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    ThemeModule,
    LeafletModule,
    DragDropModule,
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbTooltipModule,
    NbDialogModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbPopoverModule,
    NbSelectModule,
    NbTabsetModule,
    NbToggleModule,
    NbTreeGridModule,
    NbFormFieldModule,
    NbAccordionModule,
    NbRadioModule,
    EventsManagementModule,
    ExplorerRoutingModule,
    NbSpinnerModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
  ],
  exports: [CommonModule],
  providers: [TaskService, InputDataService],
  declarations: [
    ExplorerComponent,
    BreakdownComponent,
    KpisComponent,
    MapComponent,
    PlanningExplorerComponent,
    TimeseriesComponent,
    DemandChartComponent,
    DemandTableComponent,
    OrganizeDetailDialogComponent,
    DemandPlanningComponent,
    KpiFormattingPipe,
    InventoryComponent,
    SankeyChartComponent,
    ProfitExplorerComponent,
    SupplyExplorerComponent,
    SankeyChartComponent,
    ForecastComponent,
    InputDataComponent,
    KpisSettingComponent
  ],
})
export class ExplorerModule {}
