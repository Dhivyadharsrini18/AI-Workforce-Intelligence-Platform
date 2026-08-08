// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface ScatterChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function ScatterChart(props: ScatterChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for ScatterChart
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'scatter',
        data: s.data,
        
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

