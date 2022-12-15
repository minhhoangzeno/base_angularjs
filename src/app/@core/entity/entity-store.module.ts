import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';

import { explorerDataServiceConfig } from './entity.metadata';
import { EntityUrlGenerator } from './entity-url.generator';
import { ScenarioService } from './scenario.service';
import { BreakdownService } from './breakdown.service';
import { CommentService } from './comment.service';
import { DemandService } from './demand.service';
import { EventService } from './event.service';
import { PlanImportService } from './plan-import.service';
import { PlanService } from './plan.service';
import { PlanSettingService } from './plan-setting.service';
import { EventVersionService } from './event-version.service';
import { SegmentService } from './segment.service';

/**
 * The @core/entity module houses all simple CRUD entities that are declared in the
 * backend. It is heavily based on conventions laid out by [@ngrx/data](https://ngrx.io/guide/data)
 * for interfacing with CRUD endpoints.
 *
 * To add a new entity:
 *
 * 1. Create a service.
 *
 *    - For example, check out `event-version.service.ts`
 *
 * . Add the service in the `entity-store.module.ts`
 *
 *    - Make sure to call the super with the first parameter as the name of the
 *      endpoint (minus the `/api`).
 *
 * 3. Add the entity metadata in the `entity.metadata.ts`
 *
 *    - Make sure that the `entityName` property is the name of the endpoint (minus
 *      the `/api`).
 *
 * TODO(nathaniel): Step 2 and 3 has redundant declaration of endpoints. Let's refactor it.
 */
@NgModule({
  providers: [
    BreakdownService,
    CommentService,
    DemandService,
    EventService,
    EventVersionService,
    PlanService,
    PlanImportService,
    SegmentService,
    ScenarioService,
    PlanSettingService,
    { provide: DefaultDataServiceConfig, useValue: explorerDataServiceConfig },
    { provide: HttpUrlGenerator, useClass: EntityUrlGenerator },
  ],
})
export class EntityStoreModule { }
