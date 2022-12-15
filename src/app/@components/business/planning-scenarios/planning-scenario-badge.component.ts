import { SAVE_SCENARIO } from '@/store/pages/layout/layout.actions';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Scenario } from '../../../@core/interfaces/business/scenario';

@Component({
  selector: 'cel-planning-scenario-badge',
  templateUrl: './planning-scenario-badge.component.html',
  styleUrls: ['./planning-scenario-badge.component.scss'],
})
export class PlanningScenarioBadgeComponent implements OnInit {
  @Input() scenario?: Scenario;
  @Input() isChangeColor?: string;
  @Input() primary?: boolean;
  hideColorPicker: boolean = false;
  hideTextInput: boolean = false;
  color: string = '#0C80EB';
  constructor(private readonly store: Store) { }
  ngOnInit(): void {
    if (this.scenario) {
      this.color = this.scenario.color || '#0C80EB'
    }
  }
  changeColor() {
    if (this.scenario) {
      let update = this.scenario;
      update.color = this.color;
      this.store.dispatch(SAVE_SCENARIO({ scenario: update, reSimulate: false }));
    }
  }

}
