import os

charts = [
    ("LineChart", "'line'", "smooth: true,"),
    ("AreaChart", "'line'", "smooth: true, areaStyle: {},"),
    ("PieChart", "'pie'", "radius: '50%',"),
    ("DonutChart", "'pie'", "radius: ['40%', '70%'],"),
    ("RadarChart", "'radar'", ""),
    ("TreemapChart", "'treemap'", ""),
    ("HeatmapChart", "'heatmap'", ""),
    ("GaugeChart", "'gauge'", ""),
    ("SunburstChart", "'sunburst'", ""),
    ("BubbleChart", "'scatter'", "symbolSize: function (data: any) { return Math.sqrt(data[2]) * 5; },"),
    ("ScatterChart", "'scatter'", ""),
    ("WaterfallChart", "'bar'", "stack: 'Total',"),
    ("FunnelChart", "'funnel'", ""),
    ("SankeyChart", "'sankey'", "lineStyle: { color: 'gradient', curveness: 0.5 },"),
    ("TreeChart", "'tree'", ""),
    ("ParallelChart", "'parallel'", ""),
    ("CalendarHeatmap", "'heatmap'", "coordinateSystem: 'calendar',"),
    ("NetworkGraph", "'graph'", "layout: 'force',"),
    ("BoxPlot", "'boxplot'", ""),
    ("MixedChart", "'bar'", ""), # Requires custom setup
]

template = """import React from 'react';
import EChartWrapper from './EChartWrapper';
import type {{ EChartsOption }} from 'echarts';

interface {name}Props {{
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  staticData?: any;
  height?: number | string;
  className?: string;
}}

export default function {name}(props: {name}Props) {{
  const optionBuilder = (data: any, theme: string): EChartsOption => {{
    // Base configuration for {name}
    return {{
      tooltip: {{
        trigger: '{trigger}',
      }},
      legend: {{
        bottom: 0,
      }},
      {axes}
      series: data?.series ? data.series.map((s: any) => ({{
        name: s.name,
        type: {type},
        data: s.data,
        {extra}
      }})) : [],
    }};
  }};

  return <EChartWrapper {{...props}} optionBuilder={{optionBuilder}} />;
}}
"""

out_dir = r"c:\vs project\Agilisium DIVI\frontend\src\components\charts"

for name, type_val, extra in charts:
    trigger = "item" if type_val in ["'pie'", "'funnel'", "'treemap'", "'sunburst'", "'gauge'"] else "axis"
    
    axes = ""
    if type_val not in ["'pie'", "'funnel'", "'treemap'", "'sunburst'", "'gauge'", "'sankey'", "'tree'", "'graph'", "'radar'"]:
        axes = "xAxis: { type: 'category', data: data?.categories || [] },\n      yAxis: { type: 'value' },"

    content = template.format(name=name, type=type_val, extra=extra, trigger=trigger, axes=axes)
    
    file_path = os.path.join(out_dir, f"{name}.tsx")
    with open(file_path, "w") as f:
        f.write(content)
    
    print(f"Created {name}.tsx")
