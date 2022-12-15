import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'cel-planning-map',
  styleUrls: ['./map.component.scss'],
  templateUrl: 'map.component.html',
})
export class MapComponent implements OnChanges {
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

  changeTimeUnit(time: string) {
    this.timeUnit = time;
    this.refresh()
  }

  changeQuantityUnit(quantity: string) {
    this.quantityUnit = quantity;
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
