import { useRef, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Maximize, Minimize, Download, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useChartData } from '../../hooks/useChartData';

interface EChartWrapperProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
  params?: Record<string, any>;
  optionBuilder: (data: any, theme: 'dark' | 'light') => EChartsOption;
  height?: number | string;
  className?: string;
  // Fallback for non-API charts (e.g. testing or static)
  staticData?: any;
}

export default function EChartWrapper({
  title,
  subtitle,
  endpoint,
  params,
  optionBuilder,
  height = 400,
  className,
  staticData,
}: EChartWrapperProps) {
  const chartRef = useRef<ReactECharts>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  // In a real app, you'd get the theme from a provider. For now, assuming dark by default or light
  const theme = 'dark'; // TODO: fetch from context

  const { data, isLoading, error, refetch } = useChartData({
    endpoint: endpoint || '',
    params,
    enabled: !!endpoint && !staticData,
  });

  const chartData = staticData || data;

  const options = useMemo(() => {
    if (!chartData) return {};
    return optionBuilder(chartData, theme);
  }, [chartData, theme, optionBuilder]);

  const handleExportPNG = () => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({ type: 'png', backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' });
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.click();
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'relative flex flex-col bg-card rounded-xl border border-border overflow-hidden transition-all duration-300',
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : '',
        className
      )}
      style={isFullscreen ? {} : { height: '100%' }}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
        </div>
        
        {/* Toolbar */}
        <AnimatePresence>
          {showToolbar && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              {endpoint && (
                <button onClick={() => refetch()} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors" title="Filter">
                <Filter className="w-4 h-4" />
              </button>
              <button onClick={handleExportPNG} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors" title="Export PNG">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={toggleFullscreen} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative p-4 min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10 text-red-500">
            Failed to load data
          </div>
        )}
        {chartData && (
          <ReactECharts
            ref={chartRef}
            option={options}
            style={{ height: isFullscreen ? '100%' : height, width: '100%' }}
            theme={theme}
            notMerge={true}
            lazyUpdate={true}
          />
        )}
      </div>
    </motion.div>
  );
}
