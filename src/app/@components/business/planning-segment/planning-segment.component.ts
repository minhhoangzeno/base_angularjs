import { SegmentFilter } from '@/app/@core/interfaces/business/segment';
import { simpleDateRangeChanged } from '@/app/@core/interfaces/common/date-range';
import {
  EDIT_SEGMENT,
  SAVE_SEGMENT,
  SELECTED_DATE_RANGE_CHANGED, SELECTED_SEGMENT_CHANGED, UPDATE_SELECTED_SEGMENT
} from '@/store/pages/layout/layout.actions';
import { select_selectedSegment } from '@/store/pages/layout/layout.baseSelectors';
import {
  select_disabledDateRangeFn,
  select_presettedDateRanges, select_selectedDateRange
} from '@/store/pages/layout/layout.selectors';
import {
  select_segmentCustomersOptions,
  select_segmentOptions,
  select_segmentProductsOptions,
  select_segments
} from '@/store/segment/segment.selectors';
import {
  convertToRangePickerVal,
  convertToSimpleDateRangeFromRangepickerVal
} from '@/utils/calendar';
import { notNullOrUndefined } from '@/utils/notNullOrUndefined';
import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbCalendarMonthCellComponent, NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Setting } from '../../common/select-tree/graph';
import { PlanningSegmentDialogComponent } from './planning-segment-dialog.component';
import { SegmentManagementComponent } from './segment-management.component';
import { WidgetManagementDialogComponent, WidgetType } from './widget-management.component';


Object.defineProperty(NbCalendarMonthCellComponent.prototype, 'selected', {
  get: function () {
    return this.dateService.isSameMonthSafe(this.date, this.selectedValue.end);
  },
  enumerable: true,
  configurable: true,
});

@Component({
  selector: 'cel-planning-segment',
  styleUrls: ['./planning-segment.component.scss'],
  templateUrl: './planning-segment.component.html',
})
export class PlanningSegmentComponent implements OnInit, OnDestroy {
  segments = this.store.select(select_segments);
  segmentOptions = this.store.select(select_segmentOptions);
  selectedSegment = this.store.select(select_selectedSegment);
  selectedDateRange = this.store.select(select_selectedDateRange);
  segmentProductsOptions = this.store.select(select_segmentProductsOptions);
  segmentCustomersOptions = this.store.select(select_segmentCustomersOptions);
  selectableDateRangeFn = this.store.select(select_disabledDateRangeFn);
  presettedDateRanges = this.store.select(select_presettedDateRanges);
  segmentSelectName;
  noDateAllowed = (_: Date) => false;

  /** Reference to popover, filled on after view init step. */
  @ViewChild(NbPopoverDirective) popover!: NbPopoverDirective;
  @Output() selectedWidgets = new EventEmitter<WidgetType[]>();
  @Input() widgets: readonly WidgetType[] = [];

  formControl_selectedRange = new FormControl([]);

  readonly component = SegmentManagementComponent;

  /** Unsubscribe helper. */
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.bindStoreToFormControl();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private bindStoreToFormControl() {
    this.selectedDateRange
      .pipe(
        map(convertToRangePickerVal),
        filter((range) => !!range.length),
        tap((range) =>
          this.formControl_selectedRange.setValue(range, {
            onlySelf: true,
            emitEvent: false,
            emitModelToViewChange: true,
            emitViewToModelChange: false,
          }),
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe();

    this.formControl_selectedRange.valueChanges
      .pipe(
        map(convertToSimpleDateRangeFromRangepickerVal),
        filter((data) => !!data.start && !!data.end),
        withLatestFrom(this.selectedDateRange), // 1. Take currently selected range
        filter(simpleDateRangeChanged), //         2. Check if it changed
        map(([range]) => range), //                3. Discard value included in step 1
        filter(notNullOrUndefined), //             4. Ensure it not null
        tap((data) => this.store.dispatch(SELECTED_DATE_RANGE_CHANGED({ data }))),
        takeUntil(this.unsubscribe),
      )
      .subscribe();
  }

  openSegmentManagementPopOver() {
    if (!this.popover) return;

    this.popover.rebuild();
  }
  
  // let segment;
  // this.segments.subscribe(result => {
  //   segment = result.filter(item => item.id == this.choseSegment)[0];
  // })
  // this.store.dispatch(UPDATE_SEGMENT({ segment }))
  /** Fires when the user clicks the "save" segment button. */
  addSavedSegment() {
    this.dialogService.open(PlanningSegmentDialogComponent).onClose.subscribe((savedName) => {
      if (savedName?.name) {
        this.store.dispatch(SAVE_SEGMENT({ segmentName: savedName.name }));
      }
      if (savedName?.choseSegment) {
        let selectedFilter;
        this.selectedSegment.subscribe(result => selectedFilter = result);
        let segment;
        this.segments.subscribe(result => {
          segment = result.filter(item => item.id == savedName.choseSegment)[0];
        })
        segment = { ...segment, customer: selectedFilter.customer, product: selectedFilter.product, location: selectedFilter.location }
        this.store.dispatch(EDIT_SEGMENT({ segment }))
        this.store.dispatch(SELECTED_SEGMENT_CHANGED({ segment: segment }));

      }
    });
  }

  openWidgetManagementWindow() {
    this.dialogService
      .open(WidgetManagementDialogComponent, {
        hasBackdrop: true,
        closeOnEsc: false,
        closeOnBackdropClick: false,
        context: {
          checkedWidgets: [...this.widgets],
        },
      })
      .onClose.subscribe((widgets) => this.selectedWidgets.emit(widgets));
  }

  productSettings: Setting[] = [
    {
      type: 'category',
    },
    {
      type: 'subCategory',
    },
    {
      type: 'brands',
    },
    {
      type: 'productRange',
    },
    {
      type: 'productId',
      title: 'productName',
    },
  ];

  customerSettings: Setting[] = [
    {
      type: 'channel',
    },
    {
      type: 'subChannel',
    },
    {
      type: 'keyAccount',
    },
    {
      type: 'shipTo',
    },
    {
      type: 'ref',
      title: 'name',
    },
  ];

  locationSettings: Setting[] = [
    {
      type: 'country',
    },
    {
      type: 'region',
    },
    {
      type: 'city',
    },
    {
      type: 'ref',
      title: 'name',
    },
  ];

  onProductFiltersChanged(filters: SegmentFilter[]) {
    this.store.dispatch(UPDATE_SELECTED_SEGMENT({ product: filters }));
  }

  onCustomerFiltersChanged(filters: SegmentFilter[]) {
    this.store.dispatch(UPDATE_SELECTED_SEGMENT({ customer: filters }));
  }

  onLocationFiltersChanged(filters: SegmentFilter[]) {
    this.store.dispatch(UPDATE_SELECTED_SEGMENT({ location: filters }));
  }
}
