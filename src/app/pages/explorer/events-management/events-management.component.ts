import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { select_savingEventVersion, select_workspaceEvents } from '@/store/event/event.selectors';
import {
  CANCEL_EVENT_VERSION_EDIT,
  CLONE_EVENT_VERSION,
  CREATE_NEW_EVENT_VERSION_LOCALLY,
  DELETE_EVENT_VERSION,
  BEGIN_EDIT_EVENT_VERSION,
  SAVE_EVENT_VERSION,
} from '@/store/pages/event-management/event-management.actions';
import {
  select_selectedEvent,
  select_selectedEventVersion,
} from '@/store/pages/event-management/event-management.selectors';
import { Event, EventVersion } from '../../../@core/interfaces/business/event';
import { select_selectedPlan } from '@/store/pages/layout/layout.selectors';
import { SELECT_PLAN } from '@/store/pages/layout/layout.actions';
import { select_latestPlan, select_plans, select_sortedPlan } from '@/store/plan/plan.selectors';
import { Plan } from '@/app/@core/interfaces/business/plan';
import { select_selectedWorkspace } from '@/store/workspace/workspace.selectors';
import { select_scenarios } from '@/store/scenario/scenario.selectors';

@Component({
  selector: 'cel-events-management',
  templateUrl: './events-management.component.html',
  styleUrls: ['./events-management.component.scss'],
})
export class EventsManagementComponent {
  events = this.store.select(select_workspaceEvents);
  loading = this.store.select(select_savingEventVersion);
  selectedPlan = this.store.select(select_selectedPlan);
  selectedEvent = this.store.select(select_selectedEvent);
  selectedEventVersion = this.store.select(select_selectedEventVersion);
  sortedPlans = this.store.select(select_sortedPlan)
  latestPlan = this.store.select(select_latestPlan)
  selectedWorkspace = this.store.select(select_selectedWorkspace)
  scenarios = this.store.select(select_scenarios)
  eventDetail: Boolean = false;
  eventEdit: Boolean = false;
  constructor(private readonly store: Store, private readonly router: Router) { }

  onSelectPlanChanged(plan: Plan) {
    this.store.dispatch(SELECT_PLAN({ plan }));
  }
  onEditEventVersion(version: EventVersion) {
    this.store.dispatch(BEGIN_EDIT_EVENT_VERSION({ version }));
  }
  onCreateEventVersion() {
    this.store.dispatch(CREATE_NEW_EVENT_VERSION_LOCALLY());
    this.onOpenEdit();
  }

  async redirectToDemandPlanning() {
    await this.router.navigate(['pages', 'explorer', 'demand-planning']);
  }

  saveEventVersion(event: Event, version: EventVersion) {
    this.store.dispatch(SAVE_EVENT_VERSION({ event, version }));
    this.eventDetail = false;
    this.eventEdit = false;
    this.store.dispatch(CANCEL_EVENT_VERSION_EDIT());
  }

  cloneEventVersion(event: Event, version: EventVersion) {
    this.store.dispatch(CLONE_EVENT_VERSION({ event, version }));
  }
  onDeleteEventVersion(event: Event, version: EventVersion) {
    this.store.dispatch(DELETE_EVENT_VERSION({ event, version }));
  }
  onCancelEditing() {
    this.eventDetail = false;
    this.eventEdit = false;
    this.store.dispatch(CANCEL_EVENT_VERSION_EDIT());
  }
  onOpenDetail() {
    this.eventDetail = true;
    this.eventEdit = false;
  }
  onOpenEdit() {
    this.eventDetail = false;
    this.eventEdit = true;
  }
}
