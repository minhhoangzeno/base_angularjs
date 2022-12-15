import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';

export const PLANNING_EXPLORER_PAGE = '/pages/explorer/planning-explorer';
export const BUSINESS_EXPLORER_PAGE = '/pages/explorer/business-explorer';
export const SUPPLY_EXPLORER_PAGE = '/pages/explorer/supply-explorer';
export const DEMAND_PLANNING_PAGE = '/pages/explorer/demand-planning';
export const EVENT_MANAGEMENT_PAGE = '/pages/explorer/events-management';

export enum WidgetType {
  KPI_TABLE,
  PNL_CHART,
  SALES_CHART,
  DEMAND_CHART,
  FORECAST_ACCURACY,
  EVENT_IMPACT,
}

interface WidgetInfo {
  type: WidgetType;
  name: string;
  description: string;
  imgPath: string;
  page: string;
}

// change url PLANNING_EXPLORER_PAGE to BUSINESS_EXPLORER_PAGE
const WIDGETS_INFO: WidgetInfo[] = [
  {
    type: WidgetType.KPI_TABLE,
    name: 'KPI table',
    description: 'Overall comparison of KPIs between Scenarios',
    imgPath: '../../../../assets/images/kpiTable.png',
    page: BUSINESS_EXPLORER_PAGE,
  },
  {
    type: WidgetType.PNL_CHART,
    name: 'P&L',
    description: 'Waterfall display of Scenarios Profut & Loss',
    imgPath: '../../../../assets/images/p&l.png',
    page: BUSINESS_EXPLORER_PAGE,
  },
  {
    type: WidgetType.SALES_CHART,
    name: 'Time Serie with Sales & CBM',
    description: 'Time serie display of Sales & CBM of each scenario',
    imgPath: '../../../../assets/images/salesTS.png',
    page: BUSINESS_EXPLORER_PAGE,
  },
  {
    type: WidgetType.DEMAND_CHART,
    name: 'Time Series with Demand & Sales',
    description: 'Time serie display of Demand & Sales of each scenario',
    imgPath: '../../../../assets/images/demandTS.png',
    page: DEMAND_PLANNING_PAGE,
  },
  {
    type: WidgetType.FORECAST_ACCURACY,
    name: 'Forecast Accuracy',
    description: 'Time serie display of accuracy KPIs (RMSE, MAPE, Bias...)',
    imgPath: '../../../../assets/images/forecast_accuracy.png',
    page: BUSINESS_EXPLORER_PAGE,
  },
  {
    type: WidgetType.EVENT_IMPACT,
    name: 'Event Impact',
    description: 'Comparison of each event impact on KPIs between scenarios',
    imgPath: '../../../../assets/images/event_impact.png',
    page: BUSINESS_EXPLORER_PAGE,
  },
];

@Component({
  selector: 'cel-widget-management',
  templateUrl: './widget-management.component.html',
  styleUrls: ['./widget-management.component.scss'],
})
export class WidgetManagementDialogComponent implements OnInit {
  constructor(private readonly dialogRef: NbDialogRef<string[]>, private readonly router: Router) {}

  readonly widgetsInfo = WIDGETS_INFO;

  checkedWidgets: WidgetType[] = [];

  initCheckedWidgets: WidgetType[] = [];

  ngOnInit() {
    this.initCheckedWidgets = this.checkedWidgets;
  }

  save() {
    this.dialogRef.close(this.checkedWidgets);
  }

  isWidgetsChecked(widgetType: WidgetType): boolean {
    return this.checkedWidgets.includes(widgetType);
  }

  onCheckedChange(widgetType: WidgetType) {
    if (this.isWidgetsChecked(widgetType)) {
      this.checkedWidgets = this.checkedWidgets.filter(
        (selectedWidgetType) => selectedWidgetType !== widgetType,
      );
    } else {
      this.checkedWidgets.push(widgetType);
    }
  }

  close() {
    this.dialogRef.close(this.initCheckedWidgets);
  }

  isWidgetBelongsCurrentPage(widgetPage: string): boolean {
    return widgetPage == this.router.url;
  }

  generateWidgetsManagementTextClass(widgetType: WidgetType): string {
    if (this.isWidgetsChecked(widgetType)) {
      return 'widgets-mgt-text -checked';
    } else {
      return 'widgets-mgt-text -unchecked';
    }
  }
}
