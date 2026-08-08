/**
 * Skill Gap Analysis Page
 * =======================
 * Identifies workforce deficiencies.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gapService } from '../services/gapService';
import Chart from '../components/ui/Chart';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Target, AlertTriangle, Layers } from 'lucide-react';
import type { OrganizationGapOverview } from '../types/analytics';
import { staggerContainer, staggerItem, colors } from '../design-system';
import { Card, SectionHeader, Badge } from '../components/ui/Base';
import { useTheme } from '../contexts/ThemeContext';

import type { EChartsOption } from 'echarts';


// Lazy loaded charts
const RadarChart = React.lazy(() => import('../components/charts/RadarChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const ParallelChart = React.lazy(() => import('../components/charts/ParallelChart'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const LineChart = React.lazy(() => import('../components/charts/LineChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function SkillGapPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OrganizationGapOverview | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [overviewData] = await Promise.all([
          gapService.getOverview()
        ]);
        setOverview(overviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !overview) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Transform top gaps into radar chart format
  const radarIndicators = overview.top_gaps.slice(0, 6).map(g => ({
    name: g.skill_name.length > 15 ? g.skill_name.substring(0, 15) + '...' : g.skill_name,
    max: 100
  }));
  const currentValues = overview.top_gaps.slice(0, 6).map(g => Math.round(100 - g.gap_pct));
  const targetValues = overview.top_gaps.slice(0, 6).map(() => 100);

  const radarOption: EChartsOption = {
    radar: {
      indicator: radarIndicators,
      radius: '65%',
      splitArea: { show: false },
      axisLine: { lineStyle: { color: isDark ? colors.dark.border.primary : colors.light.border.primary } },
      splitLine: { lineStyle: { color: isDark ? colors.dark.border.primary : colors.light.border.primary } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: targetValues,
          name: 'Target Requirement',
          itemStyle: { color: isDark ? colors.dark.border.secondary : colors.light.border.secondary },
          areaStyle: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          lineStyle: { type: 'dashed' as const }
        },
        {
          value: currentValues,
          name: 'Current Capability',
          itemStyle: { color: colors.brand.primary },
          areaStyle: { color: 'rgba(37, 99, 235, 0.2)' }
        }
      ]
    }]
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Skill Gap Analysis</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Detect workforce deficiencies against future requirements</p>
        </div>
      </motion.div>

      <div className="modular-grid">
        {/* KPI Cards */}
        <motion.div variants={staggerItem} className="span-4">
          <Card className="h-full border-l-4 border-l-[var(--color-primary)]">
            <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-[var(--color-primary)]" /> Avg Skill Gap
            </p>
            <p className="text-[32px] font-bold text-[var(--text-primary)]">
              <AnimatedCounter value={overview.average_gap_percentage} suffix="%" />
            </p>
          </Card>
        </motion.div>
        
        <motion.div variants={staggerItem} className="span-4">
          <Card className="h-full border-l-4 border-l-[var(--color-danger)]">
            <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[var(--color-danger)]" /> Critical Gaps
            </p>
            <p className="text-[32px] font-bold text-[var(--text-primary)]">
              <AnimatedCounter value={overview.critical_gaps_count} />
            </p>
          </Card>
        </motion.div>
        
        <motion.div variants={staggerItem} className="span-4">
          <Card className="h-full border-l-4 border-l-[var(--color-success)]">
            <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[var(--color-success)]" /> Skills at Target
            </p>
            <p className="text-[32px] font-bold text-[var(--text-primary)]">
              <AnimatedCounter value={overview.skills_at_target} />
            </p>
          </Card>
        </motion.div>

        {/* Charts & Lists */}
        <motion.div variants={staggerItem} className="span-6">
          <Card className="h-[450px] flex flex-col">
            <SectionHeader title="Top Deficiencies vs Target" />
            <div className="flex-1 -mt-4 flex items-center justify-center">
              <Chart option={radarOption} height="100%" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} className="span-6">
          <Card padding="none" className="h-[450px] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Critical Gaps Action List</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {overview.top_gaps.map((gap) => (
                <div key={gap.skill_id} className="flex flex-col gap-3 p-4 border border-[var(--border-primary)] rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-[var(--text-primary)]">{gap.skill_name}</h4>
                    <Badge variant={gap.is_critical ? 'danger' : 'warning'} size="sm">
                      {gap.is_critical ? 'CRITICAL' : 'HIGH'}
                    </Badge>
                  </div>
                  <div className="w-full bg-[var(--bg-elevated)] rounded-full h-1.5 overflow-hidden relative border border-[var(--border-primary)]">
                    <div className="bg-[var(--color-primary)] h-full rounded-l-full" style={{ width: `${100 - gap.gap_pct}%` }}></div>
                    <div className="absolute top-0 right-0 bg-[var(--color-danger)] h-full opacity-60" style={{ width: `${gap.gap_pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                    <span>Current Capability</span>
                    <span className="text-[var(--color-danger)]">Gap: {gap.gap_pct.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <RadarChart title="Skill Gap Radar" endpoint="/analytics/skill-gap-radar" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <HeatmapChart title="Department Heatmap" endpoint="/analytics/gap-department-heatmap" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <ScatterChart title="Priority Matrix" endpoint="/analytics/priority-matrix" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Capability Comparison" endpoint="/analytics/capability-comparison" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <PieChart title="Gap Distribution" endpoint="/analytics/gap-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Critical Skills Ranking" endpoint="/analytics/critical-skills" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="AI Recommendation Timeline" endpoint="/analytics/ai-timeline" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
