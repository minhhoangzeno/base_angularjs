import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Adjustment, AdjustmentType } from '../../../../../@core/interfaces/business/event';

/** Indicator whether to have an increase or decrease adjustment. */
enum AdjustmentSign {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

/** Internal representation of a sign in this component. */
interface SignedAdjustment extends Adjustment {
  sign: AdjustmentSign;
}

/** Returns the value of a signed adjustment, with its sign applied. */
function signedValueOf(signedAdjustment: SignedAdjustment) {
  const multiplier = signedAdjustment.sign === AdjustmentSign.DECREASE ? -1 : 1;
  return signedAdjustment.value * multiplier;
}

/** Loads an Adjustment into a SignedAdjustment. Allows non-toggling of sign if same value. */
function loadAdjustmentToSigned(base?: SignedAdjustment, apply?: Adjustment): SignedAdjustment {
  // Magic happens here. This allows users to increase / decrease value without toggling the
  // displayed adjustment sign.
  if (base && signedValueOf(base) === apply?.value) {
    return { ...base, type: apply.type };
  }
  // Naive clause if base is falsy.
  return {
    sign: (apply?.value || 0) >= 0 ? AdjustmentSign.INCREASE : AdjustmentSign.DECREASE,
    value: Math.abs(apply?.value || 0) || 0,
    type: apply?.type || AdjustmentType.ABSOLUTE,
  };
}

@Component({
  selector: 'cel-segment-adjustment',
  templateUrl: './segment-adjustment.component.html',
  styleUrls: ['./segment-adjustment.component.scss'],
})
export class SegmentAdjustmentComponent implements OnChanges {
  /** Label to use in the adjustment. */
  @Input() name = '';
  /** The adjustment being edited. */
  @Input() adjustment?: Adjustment;
  @Input() eventDetail?: any;

  /** Emits when the adjustment has been edited. */
  @Output() adjustmentChange = new EventEmitter<Adjustment>();

  /** The adjustment rendered in the UI. Parsed from input adjustment. */
  signedAdjustment?: SignedAdjustment;

  /** Expose enum to template. */
  readonly AdjustmentType = AdjustmentType;
  readonly AdjustmentSign = AdjustmentSign;

  ngOnChanges(changes: SimpleChanges) {
    if ('adjustment' in changes) {
      this.signedAdjustment = loadAdjustmentToSigned(this.signedAdjustment, this.adjustment);
      console.log(this.signedAdjustment?.type)
    }
  }

  updateSign(sign: AdjustmentSign) {
    if (!this.signedAdjustment) return;
    this.signedAdjustment.sign = sign;
    this.emitAdjustment();
  }

  updateValue(value: number) {
    if (!this.signedAdjustment) return;
    this.signedAdjustment.value = value;
    this.emitAdjustment();
  }

  updateType(type: AdjustmentType) {
    if (!this.signedAdjustment) return;
    this.signedAdjustment.type = type;
    this.emitAdjustment();
  }

  private emitAdjustment() {
    if (!this.signedAdjustment) return;
    this.adjustmentChange.emit({
      value: signedValueOf(this.signedAdjustment),
      type: this.signedAdjustment.type,
    });
  }
}
