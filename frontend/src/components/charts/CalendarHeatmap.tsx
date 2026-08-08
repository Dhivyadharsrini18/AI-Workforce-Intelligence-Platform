// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface CalendarHeatmapProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function CalendarHeatmap(props: CalendarHeatmapProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for CalendarHeatmap
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
      calendar: {
        top: 60,
        left: 40,
        right: 40,
        cellSize: ['auto', 16],
        range: new Date().getFullYear().toString(),
        itemStyle: { borderWidth: 0.5, borderColor: 'var(--border-primary)', color: 'transparent' },
        dayLabel: { color: 'var(--text-secondary)' },
        monthLabel: { color: 'var(--text-secondary)' },
        splitLine: { show: false }
      },
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'heatmap',
        data: s.data,
        coordinateSystem: 'calendar',
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
