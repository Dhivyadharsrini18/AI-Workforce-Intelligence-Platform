// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface WaterfallChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function WaterfallChart(props: WaterfallChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for WaterfallChart
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
        type: 'bar',
        data: s.data,
        stack: 'Total',
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
