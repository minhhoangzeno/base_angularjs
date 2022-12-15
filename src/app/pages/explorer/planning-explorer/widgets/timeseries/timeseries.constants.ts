import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';
import { EChartsOption } from 'echarts';

export const COLOR_HISTORICAL = '#979797';
export const COLOR_CURRENT = '#AD3781';
export const COLOR_FUTURE = 'red';

/** Slice unit of time. */
export enum DateAggregationOption {
  DAY = 'D',
  WEEK = 'W',
  MONTH = 'M',
  YEAR = 'Y',
}

export const PL_CHART_OPTIONS_BASE: EChartsOption = {
  title: {
    text: 'Sales & Profit Evolution',
    textStyle: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontFamily: 'simcel-Bw-Mitga',
      fontSize: 14,
      lineHeight: 19,
      color: '#686868'
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { fontFamily: 'simcel-Bw-Mitga', color: '#484848' },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (s) => transformInputToKpiFormat(s),
      fontFamily: 'simcel-Bw-Mitga',
      align: 'right',
      color: '#484848',
      showMinLabel: false,
    },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#d1d1d1' },
  textStyle: { color: '#6a6a6a' },
  legend: { itemHeight: 0, textStyle: { color: '#686868', fontFamily: 'simcel-Bw-Mitga' } },
  grid: { show: true, left: '10px', right: '10px', bottom: '10px', containLabel: true },
};
