import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'cel-confirm-dialog',
  template: `
    <nb-card>
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-footer>
        <button nbButton (click)="dismiss()">No</button>
        <button nbButton (click)="submit()" status="primary">Yes</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [
    `
      nb-card {
        width: 600px;
        max-width: calc(100vw - 80px);
      }
      nb-card-footer {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() title: string = '';
  @Input() onSubmit: (ref: NbDialogRef<ConfirmDialogComponent>) => void = () => {};

  constructor(protected ref: NbDialogRef<ConfirmDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }

  submit() {
    this.onSubmit(this.ref);
  }
}
