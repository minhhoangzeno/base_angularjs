import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event, EventVersion } from '@/app/@core/interfaces/business/event';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { EventListMode } from './planning-events.constants';

@Component({
  selector: 'cel-planning-event-item',
  templateUrl: './planning-event-item.component.html',
  styleUrls: ['./planning-event-item.component.scss'],
})
export class PlanningEventItemComponent {
  @Input() event?: Event;
  @Input() scenarios: readonly Scenario[] = [];
  @Input() checked = false;
  @Input() mode? = EventListMode.EXPLORER_DISPLAY;

  @Output() toggle = new EventEmitter<Event>();
  @Output() create = new EventEmitter<void>();

  readonly EVENT_NAME_LIMIT_CHARACTER = 15;

  /** Checks if the event contains the given event version. */
  eventHasEventVersion(event?: Event, version?: EventVersion): boolean {
    if (!event || !version) return false;
    return event.versions.some((ev) => ev.id === version.id);
  }

  /** Returns true if an event has no event version. */
  isEventVersionsEmpty(event?: Event): boolean {
    return event?.versions?.length === 0;
  }

  /** Quick access if in scenario editing mode. */
  get scenarioEditMode() {
    return this.mode === EventListMode.SCENARIO_EDIT;
  }

  generateShorterEventName(eventName?: string): string {
    if (!eventName) return '';
    return eventName.match(/.{1,20}/g)?.[0] + '...';
  }

  isEventNameOutOfLimit(eventName?: string): boolean {
    if (!eventName) return false;
    return eventName.length > this.EVENT_NAME_LIMIT_CHARACTER;
  }

 
}
