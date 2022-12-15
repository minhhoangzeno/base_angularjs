import { DELETE_SEGMENT, EDIT_SEGMENT, SELECTED_SEGMENT_CHANGED } from '@/store/pages/layout/layout.actions';
import { select_selectedSegment } from '@/store/pages/layout/layout.baseSelectors';
import { select_segments } from '@/store/segment/segment.selectors';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Segment } from '../../../@core/interfaces/business/segment';

@Component({
  selector: 'cel-segment-management',
  templateUrl: './segment-management.component.html',
  styleUrls: ['./segment-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentManagementComponent implements OnInit {
  segments = this.store.select(select_segments);

  constructor(private readonly store: Store,
    private readonly dialogService: NbDialogService,
  ) { }
  choseSegment?: any;
  searchSegment = '';
  segmentSelect?: any;


  ngOnInit(): void {
    this.store.select(select_selectedSegment).subscribe(result => {
      if (result.id) {
        this.choseSegment = result.id
      } else {
        this.choseSegment = null
      }
    })
  }
  // this.store.dispatch(DELETE_SCENARIO({ scenario }));

  deleteSegment(segment: Segment) {
    this.store.dispatch(DELETE_SEGMENT({ segment }))
    if (segment.id == this.choseSegment) {
      this.store.dispatch(SELECTED_SEGMENT_CHANGED({ segment: undefined }));
    }
  }
  selectSumbit() {
    let selectedSegment;
    if (this.choseSegment) {
      let arraySegments: any = [];
      this.segments.subscribe(result => arraySegments = result)
      selectedSegment = arraySegments.filter(item => item._id == this.choseSegment)[0]
    } else {
      selectedSegment = null;
    }
    this.store.dispatch(SELECTED_SEGMENT_CHANGED({ segment: selectedSegment }));
  }
  editSegment() {
    this.store.dispatch(EDIT_SEGMENT({ segment: this.segmentSelect }))
    this.store.dispatch(SELECTED_SEGMENT_CHANGED({ segment: this.segmentSelect }));
  }

  isSelected(segment?: Segment): boolean {
    if (!segment || !this.choseSegment) {
      return false;
    }
    return segment.id === this.choseSegment.id;
  }
  changeOption(value) {
    this.choseSegment = value;
  }

  openConfirmDelete(dialog: TemplateRef<any>, segment: Segment) {
    this.dialogService.open(dialog, {
      context: segment,
    });
  }

  openEditSegment(dialog: TemplateRef<any>, segment: Segment) {
    this.segmentSelect = segment;
    this.dialogService.open(dialog, {
      context: segment,
    });
  }
  changeRenameSegment(value: string, segment) {
    this.segmentSelect = { ...segment, name: value }
  }

}
