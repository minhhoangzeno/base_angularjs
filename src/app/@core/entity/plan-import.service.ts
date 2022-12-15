import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { PlanImport } from '../interfaces/business/plan-import';

@Injectable({ providedIn: 'root' })
export class PlanImportService extends EntityCollectionServiceBase<PlanImport> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('explorer/plan-imports', serviceElementsFactory);
  }
}
