import { EChartsOption } from 'echarts';

import { BreakdownKpis } from '@/app/@core/interfaces/business/breakdown';
import { transformInputToKpiFormat } from '@/app/pipes/kpi-formatting.pipe';

export const PNL_EVOLUTION_KPIS: BreakdownKpis[] = [
  'demandValue',
  'grossSalesValue',
  'discountsRebates',
  'netSalesValue',
  'cogs',
  'transferCost',
  'storageAndHandling',
  'distributionCost',
  'cbm',
];

export const PNL_EVOLUTION_KPIS_NAME: string[] = [
  'Demand',
  'Gross Sales\nValue',
  'Trade\nExpenses',
  'Net Sales\nValue',
  'COGS',
  'Stock\nTransfer',
  'Storage\nand\nHandling',
  'Distribution\nCost',
  'Profit\nBefore Marketing',
];

// Build breakdown waterfall chart options. For reference:
// https://echarts.apache.org/en/option.html#title
export const BREAKDOWN_OPTIONS_BASE: EChartsOption = {
  title: {
    text: 'Profit & Loss',
    show: true,
    textStyle: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontFamily: 'simcel-Bw-Mitga',
      fontSize: 16,
      lineHeight: 19,
      color: '#686868'
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: '#d1d1d1',
  },
  textStyle: { color: '#979797' },
  legend: { show: false },
  grid: {
    show: true,
    height: 'auto',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    backgroundColor: '#ffffff',
    borderColor: '#f2f2f2',
  },
  xAxis: [
    {
      type: 'category',
      data: PNL_EVOLUTION_KPIS_NAME,
      axisLabel: {
        interval: 0,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'simcel-Bw-Mitga',
        fontSize: 9,
        lineHeight: 14,
        color: '#979797',
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'Roboto',
        fontSize: 12,
        lineHeight: 14,
        color: '#979797',
        formatter: (v: string | number) => transformInputToKpiFormat(v),
      },
      axisLine: { show: false },
      axisTick: {
        show: true,
        lineStyle: { color: '#C4C4C4', type: 'dotted', width: 5 },
      },
    },
  ],
};
