// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface LineChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function LineChart(props: LineChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for LineChart
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
      },
      xAxis: { type: 'category', data: data?.xAxis || data?.categories || [] },
      yAxis: { type: 'value' },
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

