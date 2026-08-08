// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface PieChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function PieChart(props: PieChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for PieChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: '5%',
        top: 'middle',
        textStyle: { color: 'var(--text-secondary)' }
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
        center: ['40%', '50%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: 'var(--bg-surface, #1a1b26)',
          borderWidth: 2
        },
        label: { show: false },
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
