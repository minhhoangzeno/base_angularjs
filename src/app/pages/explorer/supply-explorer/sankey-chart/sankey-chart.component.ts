import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'cel-sankey-chart',
  templateUrl: './sankey-chart.component.html',
  styleUrls: ['./sankey-chart.component.scss'],
})
export class SankeyChartComponent implements OnChanges {
  @Input() quantityUnit?: string;
  @Input() destinationLevel = '';
  @Input() productLevel = '';
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
      destinationLevel: this.destinationLevel,
      productLevel: this.productLevel,
    };
  }

  changeQuantityUnit(quantity: string) {
    this.quantityUnit = quantity;
    this.refresh();
  }

  changeDestinationLevel(destination: string) {
    this.destinationLevel = destination;
    this.refresh();
  }

  changeProductLevel(product: string) {
    this.productLevel = product;
    this.refresh();
  }
}
