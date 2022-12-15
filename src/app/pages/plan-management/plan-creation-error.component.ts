import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'cel-plan-creation-error',
  templateUrl: './plan-creation-error.component.html',
  styleUrls: ['./plan-creation-error.component.scss'],
})
export class PlanCreationErrorComponent {
  errorMessage: string = '';

  constructor(private readonly dialogRef: NbDialogRef<String>) {}
  close() {
    this.dialogRef.close();
  }
}
