import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

export interface CustomApiError {
  error?: {
    message: string;
    data?: any;
    type?: string;
  };
}

export enum CustomApiExceptionTypes {
  EventVersionInUsed = 'EventVersionInUsed',
}

@Component({
  selector: 'cel-error-message-dialog',
  template: `
    <nb-card>
      <nb-card-header>Error</nb-card-header>
      <nb-card-body>
        <p>{{ error?.error?.message || error?.message }}</p>
        <div *ngIf="error?.error?.type === CustomApiExceptionTypes.EventVersionInUsed">
          <ul>
            <li *ngFor="let s of error?.error?.data">{{ s.name }}</li>
          </ul>
          <p>
            In order to delete this event make sure to deselect the event from the scenario(s) above
          </p>
        </div>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="dismiss()">Ok</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [
    `
      nb-card {
        width: 600px;
        max-width: calc(100vw - 80px);
      }
      details > pre {
        width: 100%;
        height: 400px;
        padding: 8px;
        overflow: auto;
        background-color: LightGoldenRodYellow;
      }
    `,
  ],
})
export class ErrorMessageDialogComponent {
  @Input() error?: Error & CustomApiError;

  constructor(protected ref: NbDialogRef<ErrorMessageDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }

  get details() {
    return JSON.stringify(this.error, undefined, 2);
  }
  get CustomApiExceptionTypes() {
    return CustomApiExceptionTypes;
  }
}
