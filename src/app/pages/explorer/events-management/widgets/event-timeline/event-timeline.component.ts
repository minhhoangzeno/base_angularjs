import { Event, EventVersion } from '@/app/@core/interfaces/business/event';
import { Plan, PlanFlag } from '@/app/@core/interfaces/business/plan';
import { Scenario } from '@/app/@core/interfaces/business/scenario';
import { Workspace } from '@/app/@core/interfaces/common/workspace';
import { select_events } from '@/store/event/event.selectors';
import { SELECT_PLAN } from '@/store/pages/layout/layout.actions';
import { select_selectedPlan } from '@/store/pages/layout/layout.selectors';
import { select_scenarios } from '@/store/scenario/scenario.selectors';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid,
  ApexYAxis,
} from 'ng-apexcharts';
import { Subject } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
};

@Component({
  selector: 'cel-event-timeline',
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.scss'],
})
export class EventTimelineComponent implements OnInit, OnChanges {
  @Input() eventVersion?: Partial<EventVersion> = {};
  @Input() events: readonly Event[] = [];
  @Input() plans?: readonly Plan[] = [];
  @Input() scenarios?: readonly Scenario[] = [];
  plan?: Plan;
  @Input() workspace?: Workspace = undefined;
  // @Input() highlightedPlan?: Plan;
  highlightedPlan?: Plan;
  @Input() eventDetail;
  @Input() eventEdit
  listEventsPlan: any[] = [];
  @ViewChild('chart') chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private readonly store: Store,
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        id: 'event-timeline',
        type: 'rangeBar',
        height: 350,
        background: 'rgba(227, 227, 227, 0.3)',
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const series = config.w.config.series[config.seriesIndex];
            const data = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];

            if (data.id && series.name === 'Plans') {
              this.plan = this.plans?.filter(item => item.id == data.id)[0];
              if (this.plan) {
                this.store.dispatch(SELECT_PLAN({ plan: this.plan }));
              }
            }
          },
        },
        zoom: {
          enabled: true,
          type: 'x'
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 10,
          rangeBarGroupRows: true,
        },
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Bw-Mitga',
            fontWeight: 'bold',
            colors: ['#484848'],
          },
        },
      },
      yaxis: {
        show: false,
      },
      dataLabels: {},
      grid: {
        xaxis: {
          lines: {
            show: true,
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
      },
      // dataZoom: [
      //   {
      //     type: 'slider',
      //     xAxisIndex: 0,
      //     filterMode: 'none',
      //     bottom: 5
      //   },
      //   {
      //     type: 'slider',
      //     yAxisIndex: 0,
      //     filterMode: 'none'
      //   }
      // ]
    };
  }

  ngOnInit(): void {
    this.store.select(select_selectedPlan).subscribe(result => this.highlightedPlan = result)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('events' in changes || 'plans' in changes || 'workspace' in changes || 'scenarios' in changes) {
      this.addTimelineSeries();
    }
  }

  addTimelineSeries() {
    this.chartOptions.series = [];

    if (this.plans && this.chartOptions && this.chartOptions.series) {
      const seriesPlansData: any[] = [];
      let sortPlan: any = this.plans;
      sortPlan.sort(function (a: Plan, b: Plan) {
        return new Date(a.futurePlanStartDate).getTime() - new Date(b.futurePlanStartDate).getTime();
      })
      const actualPlan = this.plans.find((plan) => plan.flags?.includes(PlanFlag.ACTUAL));

      for (const plan of sortPlan) {
        if (!plan.flags?.includes(PlanFlag.ACTUAL)) {

          seriesPlansData.push({
            x: plan.name,
            y: [
              new Date(plan.futurePlanStartDate).getTime(),
              new Date(plan.futurePlanEndDate).getTime(),
            ],
            fillColor: plan.name === this.highlightedPlan?.name ? '#201787' : '#008FFB',
            id: plan.id
          });
        }
      }

      if (actualPlan && this.workspace) {
        seriesPlansData.push({
          x: actualPlan.name,
          y: [
            new Date(this.workspace.actualStartDate).getTime(),
            new Date(this.workspace.actualEndDate).getTime(),
          ],
          fillColor: actualPlan.name === this.highlightedPlan?.name ? '#979797' : '#E4E3E3',
          id: actualPlan.id

        });
      }

      const seriesEventsData: any[] = [];

      for (const event of this.events) {
        for (const version of event.versions) {
          seriesEventsData.push({
            x: event.name + ' - ' + version.name,
            y: [new Date(version.startDate).getTime(), new Date(version.endDate).getTime()],
            fillColor: (this.eventVersionFitHighlightedPlan(version) && this.getListEventsPlan(version.id)) ? '#00E396' : '#E4E3E3',
          });
        }
      }

      this.chartOptions.series = [
        { name: 'Plans', data: seriesPlansData },
        { name: 'Events', data: seriesEventsData },
      ];
      this.chartOptions.dataLabels = {
        enabled: true,
        formatter: function (value, { seriesIndex, dataPointIndex, w }) {
          return w.config.series[seriesIndex].data[dataPointIndex].x;
        },
        textAnchor: 'middle',
      };
    }
  }

  // get event version of plans
  getListEventsPlan(versionId) {
    let eventVersions: any[] = [];
    this.scenarios?.forEach((scenario: any) => {
      if (scenario?.events?.length > 0) {
        scenario.events.forEach((scenarioEventVersion: any) => {
          eventVersions = [...eventVersions, scenarioEventVersion.id];
        })
      }
    })
    if (eventVersions.includes(versionId)) {
      return true
    } else {
      return false;
    }
  }

  eventVersionFitHighlightedPlan(version: EventVersion): boolean {
    if (this.plans && this.highlightedPlan) {
      const versionStartDate = new Date(version.startDate);
      const versionEndDate = new Date(version.endDate);
      let planStartDate: Date;
      let planEndDate: Date;

      if (this.highlightedPlan.flags?.includes(PlanFlag.ACTUAL) && this.workspace) {
        planStartDate = new Date(this.workspace.actualStartDate);
        planEndDate = new Date(this.workspace.actualEndDate);
      } else {
        planStartDate = new Date(this.highlightedPlan?.futurePlanStartDate);
        planEndDate = new Date(this.highlightedPlan?.futurePlanEndDate);
      }

      if (versionEndDate < planStartDate || versionStartDate > planEndDate) {
        return false;
      }
      return true;
    }



    return true;
  }
}
