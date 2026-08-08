/**
 * Skill Forecast Page
 * ===================
 * Enterprise AI Forecast dashboard with Bento layout.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { forecastService } from '../services/forecastService';
import ConfidenceBandChart from '../components/charts/ConfidenceBandChart';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { TrendingUp, AlertCircle, Activity, Brain } from 'lucide-react';
import type { SkillForecast, TechnologyTrend } from '../types/analytics';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge } from '../components/ui/Base';


// Lazy loaded charts
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const CalendarHeatmap = React.lazy(() => import('../components/charts/CalendarHeatmap'));
const SankeyChart = React.lazy(() => import('../components/charts/SankeyChart'));
const WaterfallChart = React.lazy(() => import('../components/charts/WaterfallChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function SkillForecastPage() {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<TechnologyTrend[]>([]);
  const [topForecast, setTopForecast] = useState<SkillForecast | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [trendsData, allForecasts] = await Promise.all([
          forecastService.getTrends(),
          forecastService.getAllForecasts(24)
        ]);
        
        setTrends(trendsData);
        if (allForecasts.length > 0) {
          const detailed = await forecastService.getSkillForecast(allForecasts[0].skill_id, 24);
          setTopForecast(detailed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Skill Demand Forecast</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Prophet-powered time-series forecasting for future technology trends</p>
        </div>
        <select className="select-field w-auto text-xs py-2 px-3">
          <option>Next 6 Months</option>
          <option>Next 12 Months</option>
          <option selected>Next 24 Months</option>
        </select>
      </motion.div>

      <div className="modular-grid">
        {/* Main Forecast Chart */}
        {topForecast && topForecast.time_series && (
          <motion.div variants={staggerItem} className="span-12">
            <Card padding="lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[18px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[var(--color-primary)]" />
                    {topForecast.skill_name} Demand Projection
                  </h2>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                    Forecast confidence: <span className="font-semibold text-[var(--color-primary)]">{topForecast.confidence.toFixed(1)}%</span>
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-right border-r border-[var(--border-primary)] pr-6">
                    <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-widest font-semibold mb-1">Current</p>
                    <p className="text-[24px] font-bold text-[var(--text-primary)]">
                      <AnimatedCounter value={topForecast.current_demand} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-widest font-semibold mb-1">24m Forecast</p>
                    <p className="text-[24px] font-bold text-[var(--color-primary)]">
                      <AnimatedCounter value={topForecast.forecast_24m} />
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ConfidenceBandChart 
                  data={topForecast.time_series}
                  xKey="date"
                  lineKey="demand"
                  upperKey="upper"
                  lowerKey="lower"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Technology Growth Trends Table */}
        <motion.div variants={staggerItem} className="span-8">
          <Card padding="none" className="h-full flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                Highest Growth Technologies
              </h3>
            </div>
            <div className="table-container border-0 border-radius-0 rounded-none flex-1">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] backdrop-blur-md bg-opacity-90">
                  <tr>
                    <th className="pl-6">Rank</th>
                    <th>Technology</th>
                    <th>Category</th>
                    <th className="text-right pr-6">Growth Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.slice(0, 5).map((trend) => (
                    <tr key={trend.skill_id}>
                      <td className="pl-6">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-hover)] text-[12px] font-bold text-[var(--text-secondary)]">
                          {trend.rank}
                        </span>
                      </td>
                      <td className="font-medium text-[var(--text-primary)]">
                        {trend.skill_name}
                        {trend.is_emerging && (
                          <Badge variant="info" size="sm" className="ml-2">EMERGING</Badge>
                        )}
                      </td>
                      <td>{trend.category}</td>
                      <td className="text-right font-semibold text-[var(--color-success)] pr-6">
                        +{trend.growth_rate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div variants={staggerItem} className="span-4 flex flex-col gap-5">
          <Card className="flex-1 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] border-[var(--border-primary)]">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-[var(--color-info)]" />
              <h3 className="font-semibold text-[var(--text-primary)] text-[15px]">Model Metrics</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-1">Algorithm</p>
                <p className="font-medium text-[13px] text-[var(--text-primary)]">Prophet Time-Series + XGBoost</p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-1">Historical Window</p>
                <p className="font-medium text-[13px] text-[var(--text-primary)]">36 Months</p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-1">Mean Absolute Error (MAE)</p>
                <p className="font-medium text-[13px] text-[var(--color-success)]">2.4%</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-l-4 border-l-[var(--color-warning)] bg-[var(--color-warning-bg)]">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-bold text-[var(--color-warning)]">AI Alert</h4>
                <p className="text-[13px] text-[var(--text-primary)] mt-1.5 opacity-90 leading-relaxed">
                  Demand for Generative AI and Prompt Engineering is accelerating faster than historical norms. Confidence bands have been widened to account for high volatility.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Historical vs Forecast" endpoint="/analytics/historical-forecast" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <AreaChart title="Confidence Interval" endpoint="/analytics/confidence-interval" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="Forecast Accuracy" endpoint="/analytics/forecast-accuracy" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <CalendarHeatmap title="Seasonal Trend" endpoint="/analytics/seasonal-trend" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <SankeyChart title="Technology Adoption" endpoint="/analytics/technology-adoption" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Industry Benchmark" endpoint="/analytics/industry-benchmark" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <WaterfallChart title="Growth Projection" endpoint="/analytics/growth-projection" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <HeatmapChart title="Future Demand Heatmap" endpoint="/analytics/future-demand" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
