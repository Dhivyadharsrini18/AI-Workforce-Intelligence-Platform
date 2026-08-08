// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface NetworkGraphProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function NetworkGraph(props: NetworkGraphProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for NetworkGraph
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
      },
      
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'graph',
        data: s.data,
        layout: 'force',
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
