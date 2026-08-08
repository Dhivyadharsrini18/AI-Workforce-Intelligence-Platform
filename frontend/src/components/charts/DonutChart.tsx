// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface DonutChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function DonutChart(props: DonutChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for DonutChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      color: [
        '#818cf8', // primary
        '#60a5fa', // secondary
        '#10B981', // success
        '#c084fc', // accent
        '#F59E0B', // warning
        '#EF4444', // danger
        '#0EA5E9', // info
      ],
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'pie',
        data: s.data,
        radius: ['40%', '70%'],
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}

