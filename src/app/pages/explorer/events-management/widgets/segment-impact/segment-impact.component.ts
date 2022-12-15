import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Adjustment,
  AdjustmentType,
  EventType,
  SegmentImpact,
  AdjustmentKey,
} from '../../../../../@core/interfaces/business/event';
import { Segment, SegmentType } from '../../../../../@core/interfaces/business/segment';
import { Plan } from '../../../../../@core/interfaces/business/plan';
import { SegmentService } from '../../../../../@core/entity/segment.service';
import { Store } from '@ngrx/store';
import { select_segments } from '@/store/segment/segment.selectors';

@Component({
  selector: 'cel-segment-impact',
  templateUrl: './segment-impact.component.html',
  styleUrls: ['./segment-impact.component.scss'],
})
export class SegmentImpactComponent {
  /** The impact segment being edited. */
  @Input() set value(s: SegmentImpact) {
    const nextImpact = JSON.parse(JSON.stringify(s || {}));

    if (!nextImpact.segment) {
      nextImpact.segment = {
        formatVersion: 'v1',
        type: SegmentType.Filter,
      };
    }
    // give the segment a name
    nextImpact.segment.name = nextImpact.segment.name || Math.random().toString(36).substr(3, 6);
    nextImpact.adjustments = nextImpact.adjustments || ({} as any);

    this.impact = nextImpact;
    setTimeout(() => {
      void this.updateCount();
    }, 500);
  }

  impact?: SegmentImpact;

  get adjustments() {
    return this.impact?.adjustments;
  }

  /** The type of the event. */
  @Input() eventType?: EventType;
  /** The plan where to match segmentCriterion. */
  @Input() plan?: Plan;
  @Input() eventDetail?: any;

  /** Emits when impact segment is edited inside this component. */
  @Output() valueChanged = new EventEmitter<SegmentImpact>();
  /** Emits when user wants to delete this segment impact. */
  @Output() delete = new EventEmitter<boolean>();

  /** Expose enum to template. */
  readonly EventType = EventType;

  constructor(
    private readonly segmentService: SegmentService,
    private readonly store: Store,
  ) { }

  updateSegment(segment: Segment) {
    if (!this.impact) return;
    this.impact.segment = segment;
    this.valueChanged.emit(this.impact);
    void this.updateCount();
  }

  resetAdjustment(key: string) {
    if (!this.impact) return;
    this.impact.adjustments[key] = { type: AdjustmentType.PERCENTAGE, value: 0 };
  }

  updateAdjustment(key: string, adjustment: Adjustment) {
    if (!this.impact) {
      return;
    }

    this.impact.adjustments[key] = adjustment;
    // clear GSV
    if (this.eventType !== EventType.GENERAL_PRICING) {
      this.resetAdjustment(AdjustmentKey.GSV);
    }
    // clear NSV
    if (this.eventType !== EventType.PROMOTION_CAMPAIGN) {
      this.resetAdjustment(AdjustmentKey.NSV);
    }
    this.valueChanged.emit(this.impact);
  }

  adapter = {
    search: (term: string, entity: string) =>
      this.segmentService.autocomplete({ term, entity, planId: this.plan?.id || '' }),
    count: (value: Segment) => this.segmentService.count(value, this.plan?.id || ''),
  };

  count?: { product: number; customer: number };

  async updateCount() {
    if (!this.impact) return;
    this.count = await this.adapter.count(this.impact.segment).toPromise();
  }

  // savedSegmentsObs = this.state.segmentsObs;
  savedSegmentsObs = this.store.select(select_segments);

  useSavedSegment(s: Segment) {
    this.updateSegment(s);
  }
}
