import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbIconModule,
  NbInputModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { E2eScenarioRoutingModule } from './e2e-scenario-routing.module';
import { E2eScenarioComponent } from './e2e-scenario.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    E2eScenarioRoutingModule,
  ],
  exports: [CommonModule],
  declarations: [E2eScenarioComponent],
})
export class E2eScenarioModule {}
