import { select_displayingScenariosWithTaskStatus } from '@/store/scenario/scenario.selectors';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Plan, PlanFlag } from '../../../@core/interfaces/business/plan';
import { Scenario, ScenarioWithTaskStatus } from '../../../@core/interfaces/business/scenario';

@Component({
  selector: 'cel-planning-scenarios',
  styleUrls: ['./planning-scenarios.component.scss'],
  templateUrl: './planning-scenarios.component.html',
})
export class PlanningScenariosComponent  {
  /** Reference to the popover element in html. */
  @ViewChild(NbPopoverDirective) popover?: NbPopoverDirective;

  @Input() plan?: Plan;
  @Input() unselectedScenarios: Scenario[] = [];
  @Input() scenarios: ScenarioWithTaskStatus[] = [];
  @Input() listScenarios: Scenario[] = [];

  @Input() primary?: Scenario;
  @Input() highlighted?: Scenario;
  @Input() editMode?: boolean;
  // selectedScenarios = this.store.select(select_displayingScenariosWithTaskStatus);

  /** Fires if the user want the scenario to be a primary scenario. */
  @Output() setPrimary = new EventEmitter<Scenario>();
  /** Fires if the user want the scenario to be a highlighted scenario. */
  @Output() setHighlighted = new EventEmitter<Scenario>();

  /** Fires if the user selected create a new scenario. */
  @Output() create = new EventEmitter<Scenario>();
  /** Fires if user selects a scenario on the add scenario popup. */
  @Output() add = new EventEmitter<Scenario>();
  /** Fires if user clicks on the scenario edit button. */
  @Output() edit = new EventEmitter<Scenario>();
  /** Fires if user clicks on the scenario remove button. */
  @Output() hide = new EventEmitter<Scenario>();
  @Output() set = new EventEmitter<Scenario[]>();

  @Output() delete = new EventEmitter<Scenario>();
  @Output() clone = new EventEmitter<Scenario>();

  @Output() changeDisplayedScenarios = new EventEmitter<Scenario[]>();

  constructor(
    private readonly store: Store,
  ) { }

  addScenario(scenario: Scenario) {
    this.add.emit(scenario);
    this.popover?.hide();
  }

  
  
  createScenario() {
    this.create.emit();
    this.popover?.hide();
  }

 

  /** Disable any kind of editing if currently displayed plan is for "Actual". */
  get readonly() {
    const flags = this.plan?.flags || [];
    return flags.includes(PlanFlag.ACTUAL);
  }
  drop(event: CdkDragDrop<string[]>) {
    // check if selected_Scenario > select_displayingWithStatus do
    if(this.listScenarios.length >= this.scenarios.length){
      moveItemInArray(this.scenarios, event.previousIndex, event.currentIndex);
      this.changeDisplayedScenarios.emit(this.scenarios);
    }
  }

  addAndEdit(scenario: Scenario) {
    this.add.next(scenario);
    // wait for previous ng change detector to finish
    setTimeout(() => {
      this.edit.next(scenario);
    }, 1000);
  }
}
