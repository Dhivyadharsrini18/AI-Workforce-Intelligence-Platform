// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface SankeyChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function SankeyChart(props: SankeyChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for SankeyChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'sankey',
        data: s.data,
        links: s.links,
        lineStyle: { color: 'gradient', curveness: 0.5 },
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
