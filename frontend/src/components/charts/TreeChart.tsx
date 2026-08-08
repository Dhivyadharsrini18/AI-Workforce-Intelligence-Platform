// import React from 'react';
import EChartWrapper from './EChartWrapper';
import type { EChartsOption } from 'echarts';

interface TreeChartProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}

export default function TreeChart(props: TreeChartProps) {
  const optionBuilder = (data: any, _theme: string): EChartsOption => {
    // Base configuration for TreeChart
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
      },
      
      series: data?.series ? data.series.map((s: any) => ({
        name: s.name,
        type: 'tree',
        data: s.data,
        top: '10%',
        left: '15%',
        bottom: '10%',
        right: '15%',
        symbolSize: 12,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'center',
          fontSize: 13,
          color: 'var(--text-primary)',
          distance: 10
        },
        leaves: {
          label: {
            position: 'bottom',
            verticalAlign: 'middle',
            align: 'center'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      })) : [],
    };
  };

  return <EChartWrapper {...props} optionBuilder={optionBuilder} />;
}
