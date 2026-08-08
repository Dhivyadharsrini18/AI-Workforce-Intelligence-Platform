// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface TreemapChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function TreemapChart(props: TreemapChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for TreemapChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'treemap',
        data: s.data,
        
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

