// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface HeatmapChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function HeatmapChart(props: HeatmapChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for HeatmapChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      xAxis: { type: 'category', data: data?.xAxis || data?.categories || [] },
      yAxis: { type: 'category', data: data?.yAxis || [] },
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'heatmap',
        data: s.data,
        
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

