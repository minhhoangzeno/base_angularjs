import { select_selectedSegment } from '@/store/pages/layout/layout.baseSelectors';
import { select_segments } from '@/store/segment/segment.selectors';
import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';

/** Shows up to specify name of a newly created saved segment. */
@Component({
  selector: 'cel-planning-segment-dialog',
  templateUrl: './planning-segment-dialog.component.html',
  styleUrls: ['./planning-segment-dialog.component.scss'],
})
export class PlanningSegmentDialogComponent implements OnInit {
  segments = this.store.select(select_segments);
  selectedSegmentId?: string = '';
  choseSegment?: any;
  searchSegment = '';
  name = '';
  updateMode = false;
  constructor(private readonly dialogRef: NbDialogRef<string>,
    private readonly store: Store) { }
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.store.select(select_selectedSegment).subscribe(result => {
      this.selectedSegmentId = result.id
    })
  }
  save() {
    if (!this.updateMode) {
      this.dialogRef.close({
        name: this.name
      });
    } else {
      this.dialogRef.close({
        choseSegment: this.choseSegment
      });
    }
  }
  changeMode(checked: boolean) {
    this.updateMode = checked;
  }
  changeOption(value) {
    this.choseSegment = value;
  }
}
