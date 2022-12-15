import { TimeseriesComponent } from './timeseries.component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ExplorerModule } from '../../../explorer.module';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { SimpleChange } from '@angular/core';
import { PlanningExplorerScenarioResults } from '../../../planning-explorer/planning-explorer.models';
import { DateAggregationOption } from './timeseries.constants';

describe('TimeseriesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeseriesComponent],
      imports: [ExplorerModule, ThemeModule.forRoot()],
    });
  });

  it('emits date aggregation event if aggregation button is clicked', fakeAsync(() => {
    const fixture = TestBed.createComponent(TimeseriesComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    // Add anything to planning scenarios, so that the aggregation buttons show up in HTML.
    component.planningScenarios = [{} as any];
    fixture.detectChanges();

    // updateDateAggregation will be called if an agg button is clicked.
    spyOn(component, 'updateDateAggregation').and.callThrough();
    spyOn(component.dateAggregationChanged, 'emit');

    // Get the aggregation buttons.
    const buttons: NodeList =
      fixture.debugElement.nativeElement.querySelectorAll('.time-range-btn');
    buttons.forEach((button) => {
      if (button.textContent.indexOf(DateAggregationOption.DAY) >= 0) {
        (button as HTMLButtonElement).click();
      }
    });
    tick();

    expect(component.updateDateAggregation).toHaveBeenCalledWith(DateAggregationOption.DAY);
    expect(component.dateAggregationChanged.emit).toHaveBeenCalledWith(DateAggregationOption.DAY);
  }));

  // TODO: Test is failing. Fix me and re-enable test by `xit` -> `it`.
  xit('creates echarts options from input timeseries', async () => {
    const fixture = TestBed.createComponent(TimeseriesComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.config = TEST_TIME_SERIES_CONFIG;
    component.planningScenarios = TEST_PLANNING_SCENARIOS;

    component.ngOnChanges({
      planningScenarios: new SimpleChange(null, TEST_PLANNING_SCENARIOS, true),
    });

    await expect(component.options.series[0]).toEqual({
      scenarioName: 'scenario A',
      name: 'NSV',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      itemStyle: { borderWidth: 1, borderColor: 'red', color: 'red' },
      lineStyle: { width: 2, type: 'solid', color: 'red' },
      symbolSize: 8,
      data: [40],
      markArea: {
        data: [
          [
            {
              name: 'ACTUAL',
              xAxis: '-374400000',
              itemStyle: { color: '#E3E3E3', opacity: 0.3 },
              label: { color: '#979797' },
            },
            { xAxis: '1518282000000' },
          ],
          [
            {
              name: 'CURRENT',
              xAxis: '1518282000000',
              itemStyle: { color: '#7C596F', opacity: 0.2 },
              label: { color: '#AD3781' },
            },
            { xAxis: '1520701200000' },
          ],
          [
            {
              name: 'FUTURE',
              xAxis: '1520701200000',
              label: { color: '#222B45', align: 'center' },
            },
            { xAxis: '-374400000' },
          ],
        ],
        itemStyle: { color: '#FFFFFF' },
        label: {
          fontFamily: 'simcel-Bw-Mitga',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 9,
          lineHeight: 11,
          align: 'center',
        },
      },
    });
  });
});

const TEST_FUTURE_DATA = [
  {
    id: 'scenario A',
    data: [
      { timestamp: 40000000, cbm: 14, netSalesValue: 15 },
      { timestamp: 50000000, cbm: 24, netSalesValue: 25 },
    ],
  },
  {
    id: 'scenario B',
    data: [
      { timestamp: 50000000, cbm: 34, netSalesValue: 35 },
      { timestamp: 60000000, cbm: 44, netSalesValue: 45 },
    ],
  },
];

const TEST_SCENARIOS = [
  {
    id: 'abcdefg',
    name: 'scenario A',
    planRef: 'june plan',
    color: 'red',
  },
  {
    id: 'hyjklmn',
    name: 'scenario B',
    planRef: 'june plan',
    color: 'blue',
  },
];

/** Build planning scenario data from combining scenario and timeseries list. */
const TEST_PLANNING_SCENARIOS: PlanningExplorerScenarioResults[] = TEST_SCENARIOS.map(
  (scenario, index) => ({
    scenario: scenario,
    breakdown: null, // empty since it doesn't concern this component.
    timeseries: TEST_FUTURE_DATA[index],
  }),
);

const TEST_TIME_SERIES_CONFIG = {
  settings: [
    {
      useScenarioName: false,
      name: 'NSV',
      datasetName: 'netSalesValue',
    },
    { useScenarioName: false, name: 'CBM', datasetName: 'cbm' },
  ],
};
