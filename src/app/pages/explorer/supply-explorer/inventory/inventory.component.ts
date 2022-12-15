import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'cel-planning-inventory',
  styleUrls: ['./inventory.component.scss'],
  templateUrl: 'inventory.component.html',
})
export class InventoryComponent implements OnChanges {
  @Input() quantityUnit?: string;
  @Input() timeUnit = '';
  @Input() commonParams: any = {};
  @Input() src = '';

  params = {};

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.params = {
      ...this.commonParams,
      quantityUnit: this.quantityUnit,
      timeUnit: this.timeUnit,
    };
  }
  changeQuantityUnit(quantity: string) {
    this.quantityUnit = quantity;
    this.refresh();
  }
  changeTimeUnit(time: string) {
    this.timeUnit = time;
    this.refresh();
  }

  returnClassBtnSelect(time: string) {
    if (time == this.timeUnit) {
      return "selected ng-star-inserted"
    } else {
      return "ng-star-inserted"
    }
  }

}
