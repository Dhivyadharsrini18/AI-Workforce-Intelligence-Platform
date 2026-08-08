// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface MixedChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function MixedChart(props: MixedChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for MixedChart
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
        type: 'bar',
        data: s.data,
        
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

