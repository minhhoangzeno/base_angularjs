import { WidgetType } from '@/app/@components/business/planning-segment/widget-management.component';
import { select_authUser } from '@/store/auth/auth.selectors';
import { select_events } from '@/store/event/event.selectors';
import { SELECT_EVENT_VERSIONS } from '@/store/pages/demand-planning/demand-planning.actions';
import {
  CANCEL_SCENARIO_EDITING,
  CLONE_SCENARIO,
  CREATE_NEW_SCENARIO_LOCALLY,
  DELETE_SCENARIO,
  EDIT_SCENARIO,
  HIGHLIGHT_SCENARIO,
  REFRESH_PLANS,
  SAVE_SCENARIO,
  SELECT_PLAN,
  SET_SCENARIOS,
  SET_PRIMARY_SCENARIO,
  SWITCH_SCENARIO_EDIT_MODE,
  ADD_DISPLAYED_SCENARIO,
  DELETE_DISPLAYED_SCENARIO,
  HIDE_DISPLAYED_SCENARIO,
  CHANGE_DISPLAYED_SCENARIO,
} from '@/store/pages/layout/layout.actions';
import { select_scenarioEditEnabled } from '@/store/pages/layout/layout.baseSelectors';
import { select_selectedPlan } from '@/store/pages/layout/layout.selectors';
import { LOAD_PLAN_SETTING } from '@/store/plan-setting/planSetting.actions';
import { select_sortedPlan } from '@/store/plan/plan.selectors';
import {
  select_displayingScenarios,
  select_displayingScenariosWithTaskStatus, select_highlightedScenario,
  select_primaryScenario, select_scenarios, select_unselectedScenarios
} from '@/store/scenario/scenario.selectors';
import { SELECTED_WIDGETS_CHANGED } from '@/store/widget/widget.actions';
import { select_selectedWidgets } from '@/store/widget/widget.selectors';
import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Plan } from '../../@core/interfaces/business/plan';
import { Scenario } from '../../@core/interfaces/business/scenario';


@Component({
  selector: 'cel-simcel-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent {
  plans = this.store.select(select_sortedPlan);
  user = this.store.select(select_authUser);
  selectedPlan = this.store.select(select_selectedPlan);
  selectedScenarios = this.store.select(select_displayingScenariosWithTaskStatus);
  listScenarios = this.store.select(select_scenarios);
  unselectedSceanrios = this.store.select(select_unselectedScenarios);
  primaryScenario = this.store.select(select_primaryScenario);
  highlightedScenario = this.store.select(select_highlightedScenario);
  scenarioEditEnabled = this.store.select(select_scenarioEditEnabled);
  events = this.store.select(select_events);
  selectedWidgets = this.store.select(select_selectedWidgets);

  constructor(
    readonly router: Router,
    private readonly dialogService: NbDialogService,
    private readonly store: Store,
  ) { }

  onSelectPlanChanged(plan: Plan) {
    this.store.dispatch(SELECT_PLAN({ plan }));
  }

  onRefreshPlans() {
    this.store.dispatch(REFRESH_PLANS());
  }
  onSetPrimaryScenario(scenario: Scenario) {
    this.store.dispatch(SET_PRIMARY_SCENARIO({ scenario }));
  }
  async onSetHighlightedScenario(scenario: Scenario) {
    const highlightedScenario = await firstValueFrom(this.highlightedScenario);
    if (highlightedScenario?.id !== scenario?.id)
      this.store.dispatch(HIGHLIGHT_SCENARIO({ id: scenario?.id }));
  }
  onSelectScenario(scenario: Scenario) {
    this.store.dispatch(ADD_DISPLAYED_SCENARIO({ scenario: scenario }))
  }
  onDeselectScenario(scenario: Scenario) {
    // this.store.dispatch(HIDE_SCENARIO({ scenario }));
    this.store.dispatch(HIDE_DISPLAYED_SCENARIO({ scenario: scenario }))
  }
  onSetScenario(scenarios: Scenario[]) {
    this.store.dispatch(SET_SCENARIOS({ scenarios }));
  }
  onCloneScenario(scenario: Scenario) {
    this.store.dispatch(CLONE_SCENARIO({ scenario }));
  }
  onSelectWidgets(widgets: WidgetType[]) {
    this.store.dispatch(SELECTED_WIDGETS_CHANGED({ ids: widgets }));
  }
  onSaveScenario(scenario: Scenario, reSimulate: boolean) {
    this.store.dispatch(SAVE_SCENARIO({ scenario, reSimulate }));
  }
  onUpdateEditMode(editing: boolean) {
    this.store.dispatch(SWITCH_SCENARIO_EDIT_MODE({ editing }));
  }
  onSelecteEventVersions(eventVersionIds: string[]) {
    this.store.dispatch(SELECT_EVENT_VERSIONS({ ids: eventVersionIds }));
  }

  onCreateScenario() {
    this.store.dispatch(CREATE_NEW_SCENARIO_LOCALLY());
  }

  onCancelScenarioEditMode() {
    this.store.dispatch(CANCEL_SCENARIO_EDITING());
  }

  redirectToEventsManagement() {
    void this.router.navigate(['pages', 'explorer', 'events-management']);
  }

  redirectToEditMasterData(scenarioId: string) {
    void this.router.navigate(['pages', 'explorer', 'input-data', scenarioId]);
  }

  deleteScenario(scenario: Scenario) {
    this.store.dispatch(DELETE_SCENARIO({ scenario }));
  }

  changeDisplayedScenarios(scenarios: Scenario[]) {
    this.store.dispatch(CHANGE_DISPLAYED_SCENARIO({ scenarios }))
  }

  openConfirm(dialog: TemplateRef<any>, scenario: Scenario) {
    this.dialogService.open(dialog, {
      context: scenario,
    });
  }

  showEditSccenarioView(scenario: Scenario) {
    this.store.dispatch(EDIT_SCENARIO({ scenario }));
  }
}
