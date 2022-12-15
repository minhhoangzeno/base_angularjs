import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Scenario } from '../interfaces/business/scenario';

@Injectable({ providedIn: 'root' })
export class ScenarioService extends EntityCollectionServiceBase<Scenario> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('explorer/scenarios', serviceElementsFactory);
  }
}
