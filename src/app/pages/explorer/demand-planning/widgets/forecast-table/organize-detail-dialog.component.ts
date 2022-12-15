import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { MATCHER_LABELS_LOOKUP } from '@/app/@core/constants/entity-matcher.constants';

@Component({
  selector: 'cel-organize-detail-dialog',
  templateUrl: './organize-detail-dialog.component.html',
  styleUrls: ['./organize-detail-dialog.component.scss'],
})
export class OrganizeDetailDialogComponent {
  fields: string[] = [];
  groupings: string[] = [];

  constructor(private readonly dialogRef: NbDialogRef<string[]>) {}

  save() {
    this.dialogRef.close(this.groupings);
  }

  close() {
    this.dialogRef.close();
  }

  /** Drag-n-drop handler. */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  /** Returns proper label for a grouping key. */
  label(key: string): string {
    return MATCHER_LABELS_LOOKUP[key];
  }
}
