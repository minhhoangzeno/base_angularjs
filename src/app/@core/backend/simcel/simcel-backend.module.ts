import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule } from '@nebular/auth';

import { SimulationService } from './simulation.service';
import { PlanImportService } from './plan-import.service';
import { PricingGenerationService } from './pricing-generation.service';
import { TaskService } from './task.service';

const SERVICES = [PricingGenerationService, PlanImportService, SimulationService, TaskService];

@NgModule({
  imports: [CommonModule, NbAuthModule],
})
export class SimcelBackendModule {
  static forRoot(): ModuleWithProviders<SimcelBackendModule> {
    return { ngModule: SimcelBackendModule, providers: SERVICES };
  }
}
