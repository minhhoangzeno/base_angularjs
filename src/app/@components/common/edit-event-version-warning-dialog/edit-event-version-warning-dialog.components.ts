import { Plan } from '@/app/@core/interfaces/business/plan';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'cel-edit-event-version-warning',
  templateUrl: './edit-event-version-warning-dialog.component.html',
  styleUrls: ['./edit-event-version-warning-dialog.component.scss'],
})
export class EditEventVersionWarningDialog {
  scenarios?: Scenario[];
  plans?: Plan[];

  constructor(public ref: NbDialogRef<boolean>) {}

  getScenariosFromPlanRef(planRef: string): Scenario[] {
    return this.scenarios?.filter((scenario) => scenario.planRef === planRef) || [];
  }
}
