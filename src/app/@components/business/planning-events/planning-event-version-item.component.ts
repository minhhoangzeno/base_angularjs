import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Event, EventVersion } from '../../../@core/interfaces/business/event';
import { Scenario } from '../../../@core/interfaces/business/scenario';
import { EventListMode } from './planning-events.constants';

@Component({
  selector: 'cel-planning-event-version-item',
  templateUrl: './planning-event-version-item.component.html',
  styleUrls: ['./planning-event-version-item.component.scss'],
})
export class PlanningEventVersionItemComponent{
  /** The parent event of the version being displayed. */
  @Input() event?: Event;
  /** The event version being displayed. */
  @Input() version?: EventVersion;
  /** List of scenarios to check association against. */
  @Input() scenarios: readonly Scenario[] = [];
  /** Display mode of the event list. */
  @Input() mode?= EventListMode.EXPLORER_DISPLAY;
  /** Set the checkbox value. */
  @Input() checked = false;

  /** Emits when the edit mode checkbox has been toggled. */
  @Output() toggle = new EventEmitter<EventVersion>();
  /** Emits when edit has been clicked. */
  @Output() edit = new EventEmitter<EventVersion>();
  /** Emits when clone has been clicked. */
  @Output() clone = new EventEmitter<[Event, EventVersion]>();

  @Output() openDetail = new EventEmitter();
  @Output() openEdit = new EventEmitter();
  /** Expose enum to template. */
  readonly EventListMode = EventListMode;

  readonly EVENT_NAME_VERSION_LIMIT_CHARACTER = 20;

  constructor(private readonly iconsLibrary: NbIconLibraries) {
    this.iconsLibrary.registerSvgPack('simcel-event-icons', {
      edit:
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M10.5 4.15172V10.5C10.5 11.3284 9.82837 12 9 12H1.5C0.671625 12 0 11.3284 0 10.5V3C0 2.17162 ' +
        '0.671625 1.5 1.5 1.5H7.84791L6.34863 3H1.5V10.5H9V5.65209L10.5 4.15172ZM9.34863 1.06055L8.81836 1.59082L10.4092 ' +
        '3.18202L10.9395 2.65174L9.34863 1.06055ZM10.4092 0L9.87891 0.530273L11.4697 2.12147L12 1.59082L10.4092 0ZM3.51562 ' +
        '6.89503L5.10645 8.48585L9.87891 3.71264L8.28809 2.12145L3.51562 6.89503ZM3 9H4.5L3 7.5V9Z" fill="#0C80EB"/></svg>',
    });
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
    return eventName.length > this.EVENT_NAME_VERSION_LIMIT_CHARACTER;
  }

  onEditEventVersion() {
    if (this.version) this.edit.next(this.version);
    this.openEdit.emit();
  }
  onOpenDetailVersion(){
    if (this.version) this.edit.next(this.version);
    this.openDetail.emit();
  }

  onClone() {
    if (!this.event || !this.version) return;
    this.clone.next([this.event, this.version]);
  }

  checkScenarioVersion(scenarioEvent, version) {
    if (scenarioEvent.id == version.id) {
      return true
    }
    return false;
  }

 
}
