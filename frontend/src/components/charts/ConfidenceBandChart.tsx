/**
 * Confidence Band Chart
 * =====================
 * ECharts implementation of a line chart with upper/lower confidence bands.
 */

import Chart from '../ui/Chart';
import type { EChartsOption } from 'echarts';
import { colors } from '../../design-system';

interface ConfidenceBandChartProps {
  data: any[];
  xKey: string;
  lineKey: string;
  upperKey: string;
  lowerKey: string;
}

export default function ConfidenceBandChart({ data, xKey, lineKey, upperKey, lowerKey }: ConfidenceBandChartProps) {
  const xAxisData = data.map(item => item[xKey]);
  const lineData = data.map(item => item[lineKey]);
  const upperData = data.map(item => item[upperKey]);
  const lowerData = data.map(item => item[lowerKey]);

  // To draw a band in ECharts, we use a stacked area chart trick:
  // Base series = lowerData (invisible)
  // Band series = upperData - lowerData (visible area)
  const bandData = upperData.map((val, idx) => (val - lowerData[idx]));

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        if (!params || !params.length) return '';
        const xVal = params[0].name;
        // Find the index to pull original values since bandData is a diff
        const idx = params[0].dataIndex;
        const lineVal = lineData[idx]?.toFixed(1);
        const upVal = upperData[idx]?.toFixed(1);
        const lowVal = lowerData[idx]?.toFixed(1);

        return `
          <div class="font-medium mb-1">${xVal}</div>
          <div class="flex items-center gap-2 text-[12px]"><span class="w-2 h-2 rounded-full" style="background:${colors.brand.primary}"></span> Forecast: <b>${lineVal}</b></div>
          <div class="flex items-center gap-2 text-[12px]"><span class="w-2 h-2 rounded-full" style="background:rgba(37,99,235,0.4)"></span> Upper Bound: ${upVal}</div>
          <div class="flex items-center gap-2 text-[12px]"><span class="w-2 h-2 rounded-full" style="background:rgba(37,99,235,0.4)"></span> Lower Bound: ${lowVal}</div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
    },
    series: [
      {
        name: 'Lower Bound (Invisible)',
        type: 'line',
        data: lowerData,
        lineStyle: { opacity: 0 },
        itemStyle: { opacity: 0 },
        stack: 'confidence-band',
      },
      {
        name: 'Confidence Band',
        type: 'line',
        data: bandData,
        lineStyle: { opacity: 0 },
        itemStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(37, 99, 235, 0.15)'
        },
        stack: 'confidence-band',
      },
      {
        name: 'Forecast',
        type: 'line',
        data: lineData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: colors.brand.primary,
        },
        itemStyle: {
          color: colors.brand.primary,
        }
      }
    ]
  };

  return <Chart option={option} height="100%" />;
}
