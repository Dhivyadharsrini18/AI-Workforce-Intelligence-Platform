/**
 * Base EChart Component
 * =====================
 * Wrapper around echarts-for-react that automatically handles theme
 * and applies enterprise defaults.
 */

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '../../contexts/ThemeContext';
import { colors } from '../../design-system';

interface ChartProps {
  option: EChartsOption;
  height?: number | string;
  className?: string;
}

export default function Chart({ option, height = 300, className = '' }: ChartProps) {
  const { isDark } = useTheme();

  // Inject global enterprise defaults into the option
  const defaultOption: EChartsOption = {
    color: colors.chart as unknown as string[],
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: "'Inter', sans-serif",
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? colors.dark.bg.elevated : colors.light.bg.elevated,
      borderColor: isDark ? colors.dark.border.primary : colors.light.border.primary,
      textStyle: {
        color: isDark ? colors.dark.text.primary : colors.light.text.primary,
        fontSize: 12,
      },
      padding: [8, 12],
      borderRadius: 8,
      shadowBlur: 16,
      shadowColor: 'rgba(0,0,0,0.2)',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: colors.brand.primary,
        }
      }
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 20,
      left: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: isDark ? colors.dark.border.primary : colors.light.border.primary } },
      axisLabel: { color: isDark ? colors.dark.text.secondary : colors.light.text.secondary },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: isDark ? colors.dark.text.secondary : colors.light.text.secondary },
      splitLine: { 
        lineStyle: { 
          type: 'dashed',
          color: isDark ? colors.dark.border.secondary : colors.light.border.primary 
        } 
      },
    },
    ...option, // Override with specific option passed
  };

  return (
    <ReactECharts
      option={defaultOption}
      style={{ height, width: '100%' }}
      className={className}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
