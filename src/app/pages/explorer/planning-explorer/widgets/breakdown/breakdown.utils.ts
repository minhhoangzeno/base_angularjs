import tinycolor from 'tinycolor2';
import { Breakdown, kpiOf } from '@/app/@core/interfaces/business/breakdown';
import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import { PNL_EVOLUTION_KPIS } from './breakdown.constants';
import { Scenario, ScenarioFlag } from '@/app/@core/interfaces/business/scenario';

const BLANK_SERIES_NAME = '_blank';

/** Create a pair of series data for a waterfall chart pluggable for echarts data. */
export function createWaterfallSeries(
  scenario?: Scenario,
  scenarioBreakdown?: Breakdown,
  actualBreakdown?: Breakdown,
  color?: string,
  isHighlighted = false,
) {
  const lightColor = tinycolor(color);
  lightColor.setAlpha(0.5);

  const result = [
    // Specifies the blank area below each data point in the waterfall chart. Note
    // that all offsets here can be derived from the mockup at:
    // https://www.figma.com/file/JqjqLZ0XOgDtK2xwWc0d2U/Simcel?node-id=903%3A1436
    {
      name: BLANK_SERIES_NAME,
      type: 'bar',
      stack: scenario?.id,
      itemStyle: { borderColor: 'rgba(0,0,0,0)', color: 'rgba(0,0,0,0)' },
      emphasis: { itemStyle: { borderColor: 'rgba(0,0,0,0)', color: 'rgba(0,0,0,0)' } },
      data: createWaterfallPaddingData(scenario, scenarioBreakdown, actualBreakdown),
    },
    // Specifies the filled areas on top of the blank areas in the waterfall chart.
    {
      name: scenario?.name,
      type: 'bar',
      stack: scenario?.id,
      itemStyle: {
        borderColor: isHighlighted ? color : null,
        borderWidth: 2,
        borderRadius: 4,
        color: lightColor.toString(),
      },
      data: createWaterfallSeriesData(scenario, scenarioBreakdown, actualBreakdown),
    },
  ];
  return result;
}

/** Tooltip formatter for a series pair. Excludes series with name = '_blank'. */
export function seriesPairFormatterFactory(
  highlightedScenarioName: string | undefined,
  highlightedWaterfallSeriesData: (number | null)[],
  kpiTypes: string[],
) {
  return (
    params: Array<{ seriesName: string; value: number; dataIndex: number; marker: string }>,
  ): string => {
    if (params.length === 0) {
      return 'No data';
    }

    const content = params
      .filter((param) => param.seriesName !== BLANK_SERIES_NAME)
      .map((param) => {
        const value = transformInputToKpiFormat(param.value);
        let diffPercentageInString = '';
        let fontWeight = 'bold';
        let color = '';

        /** Add diff value to the tooltips of non-highlighted scenarios.*/
        if (param.seriesName !== highlightedScenarioName) {
          const highlightedValue = highlightedWaterfallSeriesData[param.dataIndex];
          if (highlightedValue) {
            const diffPercentage = ((param.value - highlightedValue) / highlightedValue) * 100;
            color = generateDiffColor(diffPercentage, kpiTypes[param.dataIndex]);

            fontWeight = 'normal';
            const sign = diffPercentage > 0 ? '+' : '';
            diffPercentageInString = `(${sign}${diffPercentage.toFixed(1)}%)`;
          }
        }

        return `${param.marker} <span style="color:#484848; font-weight:${fontWeight}">${value}</span> 
        <span style="padding-left:20px; font-weight:bold; color:${color}">${diffPercentageInString}</span>`;
      })
      .join('<br/>');
    return content;
  };
}

export function createWaterfallPaddingData(
  scenario?: Scenario,
  scenarioBreakdown?: Breakdown,
  actualBreakdown?: Breakdown,
): (number | null)[] {
  // If the scenario is an executed plans scenario, do not add actual to the scenario breakdown.
  const isActualPlans = scenario?.flags?.includes(ScenarioFlag.ACTUAL);
  const breakdown = isActualPlans ? actualBreakdown : scenarioBreakdown;
  if (!breakdown) return [];

  return PNL_EVOLUTION_KPIS.map((name) => {
    switch (name) {
      case 'discountsRebates':
        return kpiOf(breakdown, 'netSalesValue');
      case 'cogs':
        return (kpiOf(breakdown, 'netSalesValue') || 0) - (kpiOf(breakdown, 'cogs') || 0);
      case 'transferCost':
        return (
          (kpiOf(breakdown, 'netSalesValue') || 0) -
          (kpiOf(breakdown, 'cogs') || 0) -
          (kpiOf(breakdown, 'transferCost') || 0)
        );
      case 'storageAndHandling':
        return (kpiOf(breakdown, 'cbm') || 0) + (kpiOf(breakdown, 'distributionCost') || 0);
      case 'distributionCost':
        return kpiOf(breakdown, 'cbm');
      default:
        return 0;
    }
  });
}

export function createWaterfallSeriesData(
  scenario?: Scenario,
  scenarioBreakdown?: Breakdown,
  actualBreakdown?: Breakdown,
): (number | null)[] {
  // For actual scenario, we use the actual breakdown data
  if (scenario?.flags?.includes(ScenarioFlag.ACTUAL)) {
    if (!actualBreakdown) return [];

    return PNL_EVOLUTION_KPIS.map((name) => kpiOf(actualBreakdown, name));
  }
  if (!scenarioBreakdown) return [];

  // const merged = mergeBreakdowns(actualBreakdown, scenarioBreakdown);
  // Otherwise, we use scenario breakdown data
  return PNL_EVOLUTION_KPIS.map((name) => kpiOf(scenarioBreakdown, name));
}

export function generateDiffColor(value: string | number, kpiType: string): string {
  if (typeof value === 'string') value = +value;
  const greenColor = '#028647';
  const redColor = '#FE4B48';

  if (kpiType === 'profit') {
    if (value > 0) {
      return greenColor;
    }

    return redColor;
  }

  if (value > 0) {
    return redColor;
  }

  return greenColor;
}
