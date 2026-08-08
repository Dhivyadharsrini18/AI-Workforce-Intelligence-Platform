// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface BubbleChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function BubbleChart(props: BubbleChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for BubbleChart
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
      },
      xAxis: { type: 'category', data: data?.categories || [] },
      yAxis: { type: 'value' },
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'scatter',
        data: s.data,
        symbolSize: function (data: any) { return Math.sqrt(data[2]) * 5; },
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
