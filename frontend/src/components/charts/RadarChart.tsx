// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface RadarChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function RadarChart(props: RadarChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for RadarChart
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
      },
      radar: data?.radar,
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'radar',
        data: s.data,
        
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
