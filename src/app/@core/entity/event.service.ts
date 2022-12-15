import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Event } from '../interfaces/business/event';

@Injectable({ providedIn: 'root' })
export class EventService extends EntityCollectionServiceBase<Event> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('explorer/events', serviceElementsFactory);
  }

  add(event: Event) {
    return super.add(this.cleanEvent(event));
  }

  update(event: Event) {
    return super.update(this.cleanEvent(event));
  }

  // strip objects that only exists on the frontend
  private cleanEvent(event: Event) {
    const eventObject: Event = { ...event, versions: [] };
    for (const version of event.versions) {
      // skip empty version id
      // the event service remove all versions if one of them has empty id
      if (version.id) {
        eventObject.versions.push(version);
      }
    }
    return eventObject;
  }
}
