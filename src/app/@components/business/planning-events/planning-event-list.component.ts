import { Component, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';

import { Event, EventVersion } from '../../../@core/interfaces/business/event';
import { Plan } from '../../../@core/interfaces/business/plan';
import { Scenario } from '../../../@core/interfaces/business/scenario';
import { EventListMode } from './planning-events.constants';
import {
  PLANNING_EXPLORER_PAGE,
  DEMAND_PLANNING_PAGE,
  SUPPLY_EXPLORER_PAGE,
  BUSINESS_EXPLORER_PAGE,
} from '../planning-segment/widget-management.component';
import { ObjectRef, refId } from '@/app/@core/interfaces/common/mongo';
import { environment } from '@/environments/environment';
import { User } from '@/app/@core/interfaces/common/users';
import { INITIAL_SCENARIO_COLORS_POOL } from '@/store/scenario/scenario.selectors';


@Component({
  selector: 'cel-planning-event-list',
  styleUrls: ['./planning-event-list.component.scss'],
  templateUrl: './planning-event-list.component.html',
})
export class PlanningEventListComponent implements OnChanges {
  /** Currently selected plan. */
  @Input() plan?: Plan;
  @Input() user?: User;
  /** List of events to display in this component. */
  @Input() events: readonly Event[] = [];
  /** List of scenarios to show indicators of event association. */
  @Input() scenarios?: readonly Scenario[] = [];

  @Input() listScenarios?: readonly Scenario[] = [];
  // TODO(nathaniel): Rename to scenarioEditMode or something clearer.
  /** Toggle to true if in scenario editing mode. */
  @Input() editMode = false;
  /** Toggle to true if in event / event version editing mode. */
  @Input() eventEditMode = false;
  /** The highlighted scenario. */
  @Input() highlighted?: Scenario;


  /**URL  */
  @Input() routerURL?: string;

  /** Emits when save button is clicked. */
  @Output() saveHighlighted = new EventEmitter<[Scenario, boolean]>();
  /** Emits when cancel button is clicked. */
  @Output() cancel = new EventEmitter<Scenario>();
  /** Emits when manage button is clicked. */
  @Output() manage = new EventEmitter<boolean>();
  /** Emits when Edit Input button is clicked. */
  @Output() editInputData = new EventEmitter<string>();
  // TODO(dat): Clarify in doc what this is used for.
  /** Not sure what this is for :P @Dat? */
  @Output() updatedEditMode = new EventEmitter<boolean>();
  /** Emits whenever selected event versions changed. */
  @Output() selectedEventVersions = new EventEmitter<string[]>();
  /** Emits whenever event version is marked for editing. */
  @Output() editEventVersion = new EventEmitter<EventVersion>();
  /** Emits whenever event version is copied. */
  @Output() cloneEventVersion = new EventEmitter<[Event, EventVersion]>();
  /** Emits whenever new event is clicked. */
  @Output() createEventVersion = new EventEmitter<void>();

  @Output() onOpenEdit = new EventEmitter<void>();

  @Output() onOpenDetail = new EventEmitter<void>();

  refId = refId;

  /** Two-way binded variable for the text in the search input. */
  searchEvent = '';
  /** Name of the currently highlighted scenario. Used for editing scenario. Refactor? */
  scenarioName = '';
  scenarioSimulateWithUI = false;
  // TODO : recheck naming. Is that not scenarioEventVersions?
  scenarioEvents: Array<ObjectRef<EventVersion>> = [];

  /**
   * Lookup table for selected event versions where the key is the event id
   * and value is the selected event version for this event.
   **/
  eventSelectedVersions: Record<string, ObjectRef<EventVersion>> = {};
  /** Lookup table with event version id as key, and parent event id as value. */
  eventVersiontoEventId: Record<string, string> = {};
  /** Lookup table with event version id as key, and value is if the version is selected. */
  eventVersionChecked: Record<string, boolean> = {};

  /** Expose enum to template. */
  readonly EventListMode = EventListMode;

  ngOnChanges(changes: SimpleChanges) {
    if (('events' in changes || 'highlighted' in changes) && !!this.highlighted) {
      if (!this.editMode) {
        this.scenarioName = this.highlighted?.name;
        this.scenarioEvents = this.highlighted?.events || [];
      }

      this.eventVersiontoEventId = {};
      for (const event of this.events) {
        for (const version of event.versions) {
          this.eventVersiontoEventId[version.id] = event.id;
        }
      }

      this.eventVersionChecked = {};
      this.eventSelectedVersions = {};

      for (const version of this.scenarioEvents) {
        const versionId = refId(version);
        if (!versionId) continue;
        const eventId = this.eventVersiontoEventId[versionId];
        this.eventSelectedVersions[eventId] = version;
        this.eventVersionChecked[versionId] = true;
      }
    }

    const { editMode } = changes;
    console.log("this.changes", changes)
    // Just start editing
    if (editMode && editMode.currentValue) {
      this.scenarioName = this.highlighted?.name || '';
      this.scenarioEvents = this.highlighted?.events || [];

      this.eventSelectedVersions = {};

      for (const version of this.scenarioEvents) {
        const versionId = refId(version);
        if (!versionId) continue;
        const eventId = this.eventVersiontoEventId[versionId];
        this.eventSelectedVersions[eventId] = version;
        this.eventVersionChecked[versionId] = true;
      }
    }
  }

  /** Triggers on saving of highlighted scenario. */
  onSaveHighlighted() {

    const highlightedEvents = this.highlighted?.events

    let reSimulate = true

    if (!this.highlighted?.id.includes("blank_")) {
      if (this.scenarioEvents.length == highlightedEvents?.length
        && this.scenarioEvents.every(function (u, i) {
          return u === highlightedEvents[i];
        })
      ) {
        reSimulate = false
      }
    }

    const updated: Scenario = {
      id: '',
      planRef: '',
      ...(this.highlighted || {}),
      name: this.scenarioName,
      events: this.scenarioEvents,
      simulateWithUI: this.scenarioSimulateWithUI,
    };

    // This code behavor
    // Check this action is create scenario or save scenario
    // if !this.highlighted.color is create scenario
    // I will set value color before send data scenario, in backend I created add property color of Scenario
    // I create a array COLORS except "#0C80EB" because it was fixed scenarios[0] (base)
    // Then I get list scenarios that added on database. I compare two arrays
    // I will a array that difference , I set array[0] is color new scenario.
    if (!this.highlighted?.color) {
      let colors: any = [];
      this.listScenarios?.forEach((item: any) => item.color && colors.push(item.color));
      let differenceInitialColors = INITIAL_SCENARIO_COLORS_POOL.filter(x => !colors.includes(x));
      let differenceColors = colors.filter(x => !INITIAL_SCENARIO_COLORS_POOL.includes(x));
      const difference = differenceInitialColors.concat(differenceColors);
      updated.color = difference[0];
    }
    this.saveHighlighted.emit([updated, reSimulate]);

    this.editMode = false;
    this.updatedEditMode.emit(false);

    // Open SIMCEL-UI
    if (this.scenarioSimulateWithUI) {
      window.open(environment.simulateUiUrl, '_blank');
    }

    this.eventSelectedVersions = {};
  }

  /** Triggers on selecting cancel button. */
  onCancel() {
    this.eventSelectedVersions = {};
    this.cancel.emit(this.highlighted);
  }


  /** Triggers on clicking the manage button. */
  onManage() {
    this.manage.emit(true);
  }

  onEditInputData(scenarioId?: string) {
    if (scenarioId) this.editInputData.emit(scenarioId);
  }

  /** Toggles the given event version for the highlighted scenario. */
  toggleEventVersionForHighlighted(version: EventVersion) {
    const eventId = this.eventVersiontoEventId[version.id];
    this.eventSelectedVersions[eventId] = version;

    this.updateScenarioEvents();

    this.eventVersionChecked = {};

    for (const v of this.scenarioEvents) {
      const versionId = refId(v);
      if (versionId) this.eventVersionChecked[versionId] = true;
    }

    this.selectedEventVersions.next(Object.keys(this.eventVersionChecked));
  }

  /** Checks if the highlighted scenario contains the given event. */
  highlightedHasEvent(event: Event): boolean {
    if (!this.scenarioEvents) {
      return false;
    }
    return !!this.eventSelectedVersions[event.id];
  }

  /** Checks if the highlighted scenario contains the given event version. */
  highlightedHasEventVersion(version: EventVersion): boolean {
    if (!this.scenarioEvents) {
      return false;
    }
    return this.eventVersionChecked[version.id];
  }

  /** Returns true if the highlighted scenario has been edited in this component. */
  isDirty(): boolean {
    if (!this.highlighted) {
      return false;
    }
    if (this.highlighted.blankScenario) return true;
    return (
      this.scenarioName !== this.highlighted.name || this.scenarioEvents !== this.highlighted.events
    );
  }

  unselectEvent(event: Event) {
    delete this.eventSelectedVersions[event.id];

    this.updateScenarioEvents();

    this.eventVersionChecked = {};

    for (const version of this.scenarioEvents) {
      const versionId = refId(version);
      if (versionId) this.eventVersionChecked[versionId] = true;
    }

    this.selectedEventVersions.next(Object.keys(this.eventVersionChecked));
  }

  private updateScenarioEvents() {
    this.scenarioEvents = Object.values(this.eventSelectedVersions);
  }

  /**
   * Returns the display mode of the event list component.
   *
   * TODO: Convert this to @Input instead and remove editMode and eventEditMode please.
   */
  get mode(): EventListMode | undefined {
    if (this.editMode) {
      return EventListMode.SCENARIO_EDIT;
    }
    if (this.eventEditMode) {
      return EventListMode.EVENT_EDIT;
    }
    if (this.routerURL === BUSINESS_EXPLORER_PAGE || this.routerURL === SUPPLY_EXPLORER_PAGE) {
      return EventListMode.EXPLORER_DISPLAY;
    }
    if (this.routerURL === DEMAND_PLANNING_PAGE) {
      return EventListMode.DEMAND_DISPLAY;
    }
    return;
  }

  excludeHeightForEventList(): string {
    if (this.editMode) {
      return '500px';
    }

    if (this.eventEditMode) {
      return '240px';
    }

    return '375px';
  }
}
