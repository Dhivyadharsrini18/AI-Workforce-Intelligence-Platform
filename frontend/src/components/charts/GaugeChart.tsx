// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface GaugeChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function GaugeChart(props: GaugeChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for GaugeChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      
      series: data?.series ? data.series.map((s: any) => {
        const seriesData = Array.isArray(s.data) ? s.data : [];
        const formattedData = seriesData.length > 0 && typeof seriesData[0] === 'number' 
          ? [{ value: seriesData[seriesData.length - 1], name: s.name }]
          : seriesData;

        return {
          name: s.name,
          type: 'gauge',
          data: formattedData,
          progress: { show: true },
          detail: { valueAnimation: true, formatter: '{value}' },
          axisLabel: { color: 'var(--text-secondary)' },
        };
      }) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
