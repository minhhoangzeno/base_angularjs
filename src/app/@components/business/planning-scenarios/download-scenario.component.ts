import { Component } from '@angular/core';
import { Scenario } from '../../../@core/interfaces/business/scenario';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'cel-download-scenario',
  templateUrl: './download-scenario.component.html',
  styleUrls: ['./download-scenario.component.scss'],
})
export class DownloadScenarioComponent {
  constructor(private readonly dialogRef: NbDialogRef<Scenario>) {}

  scenario?: Scenario;

  close() {
    this.dialogRef.close();
  }
}
