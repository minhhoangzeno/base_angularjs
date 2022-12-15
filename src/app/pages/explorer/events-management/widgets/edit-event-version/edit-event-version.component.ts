import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, tap } from 'rxjs';

import {
  AdjustmentType,
  Event,
  EventType,
  EventVersion,
  SegmentImpact,
} from '@/app/@core/interfaces/business/event';
import { Plan } from '@/app/@core/interfaces/business/plan';
import {
  convertToRangePickerVal,
  convertToSimpleDateRangeFromRangepickerVal,
} from '@/utils/calendar';
import {
  select_presettedDateRanges,
  select_disabledDateRangeFn,
} from '@/store/pages/event-management/event-management.selectors';

function createDummySegmentImpact(): Partial<SegmentImpact> {
  return {
    segment: { formatVersion: 'v1' },
    adjustments: {
      demand: {
        type: AdjustmentType.PERCENTAGE,
        value: 0,
      },
      nsv: {
        type: AdjustmentType.PERCENTAGE,
        value: 0,
      },
      gsv: {
        type: AdjustmentType.PERCENTAGE,
        value: 0,
      },
    },
  };
}

/** Makes sure that the input event type is valid. If not, default to GENERAL_DEMAND. */
function ensureValidEventType(eventType?: EventType) {
  if (eventType && Object.values(EventType).includes(eventType)) {
    return eventType;
  }
  return EventType.GENERAL_DEMAND;
}
@Component({
  selector: 'cel-edit-event-version',
  templateUrl: './edit-event-version.component.html',
  styleUrls: ['./edit-event-version.component.scss'],
})
export class EditEventVersionComponent implements OnChanges, OnInit, OnDestroy {
  /** List of events where this version can be associated to. */
  @Input() events: readonly Event[] = [];
  /** Parent event of the event version being edited. */
  @Input() event?: Event;
  /** The event version being edited in the form. */
  @Input() eventVersion?: Partial<EventVersion> = {};
  /** The plan where the event will be based on. */
  @Input() plan?: Plan;
  @Input() eventEdit?:any;

  /** Emits when user clicks the save button. */
  @Output() save = new EventEmitter<[Event, EventVersion]>();
  /** Emits when user clicks the delete button. */
  @Output() delete = new EventEmitter<[Event, EventVersion]>();
  /** Emits when user clicks the cancelbutton. */
  @Output() cancel = new EventEmitter<void>();

  /** The event version form being edited. */
  eventVersionForm = this.fb.group({
    id: [{ value: '', disabled: true }],
    name: [''],
    period: [[]],
    segmentImpacts: this.fb.array([]),
    /** Editable parent event properties. */
    eventName: [''],
    eventType: [''],
  });

  /** Expose event types to the template. */
  readonly eventTypes = [
    { value: EventType.PROMOTION_CAMPAIGN, name: 'Promotion' },
    { value: EventType.GENERAL_PRICING, name: 'Pricing Adjustment' },
    { value: EventType.GENERAL_DEMAND, name: 'Demand Adjustment' },
    { value: EventType.NEW_DEMAND_STREAM, name: 'New Demand Stream', disabled: true },
    { value: EventType.INVENTORY_PARAMETERS, name: 'Inventory Parameters', disabled: true },
    { value: EventType.PRODUCTION_CAPACIY, name: 'Production Capacity', disabled: true },
    { value: EventType.SHELF_LIFE_ACCEPTANCE, name: 'Shelf Life Acceptance', disabled: true },
    { value: EventType.MIN_TRUCK_FILL_RATE, name: 'Minimum Truck Fill rate', disabled: true },
    { value: EventType.MOQ, name: 'MOQ', disabled: true },
    { value: EventType.COGS, name: 'COGS', disabled: true },
    { value: EventType.STORAGE_HANDLING_COST, name: 'Storage & Handling Cost', disabled: true },
    { value: EventType.TRANSPORT_COST, name: 'Transport Cost', disabled: true },
  ];

  selectableDateRangeFn = this.store.select(select_disabledDateRangeFn);
  presettedDateRanges = this.store.select(select_presettedDateRanges);
  noDateAllowed = (_: Date) => false;

  bindToFormControl = new Subject<{ event?: Event; eventVersion?: Partial<EventVersion> }>();

  /** Unsubscribe helper. */
  private readonly unsubscribe = new Subject<void>();
  constructor(private readonly fb: FormBuilder, private readonly store: Store) {}

  get impactsForm() {
    return this.eventVersionForm.get('segmentImpacts') as FormArray;
  }

  ngOnInit(): void {
    this.bindToFormControl
      .pipe(
        debounceTime(300),
        tap(({ event, eventVersion }) => this.loadEventToForm(event, eventVersion)),
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('event' in changes || 'eventVersion' in changes) {
      this.bindToFormControl.next({ event: this.event, eventVersion: this.eventVersion });
    }
  }

  private loadEventToForm(event?: Event, eventVersion?: Partial<EventVersion>) {
    /** Loads given event in the event version form. */
    this.eventVersionForm.get('eventName')?.setValue(event?.name || '');
    this.eventVersionForm.get('eventType')?.setValue(ensureValidEventType(event?.type));

    /** Loads given event version in the event version form. */
    // Skip if event version is nully.
    if (!eventVersion) {
      this.eventVersionForm.get('id')?.setValue('');
      this.eventVersionForm.get('name')?.setValue('');
      this.eventVersionForm.get('period')?.setValue('');
      this.impactsForm.clear();
      return;
    }

    this.eventVersionForm.get('id')?.setValue(eventVersion.id);
    this.eventVersionForm.get('name')?.setValue(eventVersion.name);
    if (eventVersion.startDate && eventVersion.endDate) {
      this.eventVersionForm.get('period')?.setValue(
        convertToRangePickerVal({
          start: eventVersion.startDate,
          end: eventVersion.endDate,
        }),
      );
    } else {
      this.eventVersionForm.get('period')?.reset();
    }

    this.impactsForm.clear();
    eventVersion.segmentImpacts?.forEach((impact) => {
      this.addSegmentImpact(impact);
    });
  }

  private get formEventValue() {
    const event: Event = {
      id: '',
      ...this.event,
      name: this.eventVersionForm.get('eventName')?.value,
      type: this.eventVersionForm.get('eventType')?.value,
      versions: [...(this.event?.versions || [])],
    };
    return event;
  }

  private get formEventVersionValue() {
    const eventVersion = this.eventVersionForm.getRawValue();

    const range = convertToSimpleDateRangeFromRangepickerVal(eventVersion.period);
    // Transform back startDate and endDate into YYYY-MM-DD format.
    eventVersion.startDate = range.start;
    eventVersion.endDate = range.end;
    // Cleanup prop `period` since it's already been translated.
    delete eventVersion.period;

    return eventVersion;
  }

  onSubmit() {
    this.save.emit([this.formEventValue, this.formEventVersionValue]);
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    if (!this.event) return;
    this.delete.emit([this.event, this.eventVersionForm.getRawValue()]);
  }

  updateImpact(index: number, impact: SegmentImpact) {
    this.impactsForm.controls[index].setValue(impact);
    this.impactsForm.markAsDirty();
  }

  deleteImpact(index: number) {
    this.impactsForm.removeAt(index);
    this.impactsForm.markAsDirty();
  }

  /** Add a new segment impact control with a prefilled segment impact. */
  addSegmentImpact(segmentImpact?: SegmentImpact) {
    this.impactsForm.push(this.fb.control(segmentImpact || createDummySegmentImpact()));
    this.impactsForm.markAsDirty();
  }
}
