import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { E2eScenarioComponent } from './e2e-scenario.component';

const routes: Routes = [
  {
    path: 'home',
    component: E2eScenarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class E2eScenarioRoutingModule {}
