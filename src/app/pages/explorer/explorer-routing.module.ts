import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExplorerComponent } from './explorer.component';
import { DemandPlanningComponent } from './demand-planning/demand-planning.component';
import { PlanningExplorerComponent } from './planning-explorer/planning-explorer.component';
import { EventsManagementComponent } from './events-management/events-management.component';
import { ProfitExplorerComponent } from './profit-explorer/profit-explorer.component';
import { SupplyExplorerComponent } from './supply-explorer/supply-explorer.component';
import { ForecastComponent } from './forecast/forecast.component';
import { InputDataComponent } from './input-data/input-data.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerComponent,
    children: [
      {
        path: 'home',
        redirectTo: 'business-explorer',
      },
      {
        path: 'business-explorer',
        component: PlanningExplorerComponent,
      },
      {
        path: 'supply-explorer',
        component: SupplyExplorerComponent,
      },
      {
        path: 'demand-planning',
        component: DemandPlanningComponent,
      },
    ],
  },
  {
    path: 'scenario-explorer',
    component: ProfitExplorerComponent,
  },
  {
    path: 'forecast',
    component: ForecastComponent,
  },
  {
    path: 'events-management',
    component: EventsManagementComponent,
  },
  {
    path: 'input-data/:scenarioId',
    component: InputDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorerRoutingModule {}
