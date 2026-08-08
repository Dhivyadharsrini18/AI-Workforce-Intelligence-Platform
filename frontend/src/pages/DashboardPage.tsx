/**
 * Dashboard Page — Onyx Executive Overview
 * ==========================================
 * High-density modular grid with sharp edges, monochromatic styling,
 * and high-contrast emerald data visualization accents.
 */

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { analyticsService } from '../services/analyticsService';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge } from '../components/ui/Base';
import AnimatedCounter from '../components/charts/AnimatedCounter';
import Chart from '../components/ui/Chart';

// Lazy loaded charts
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const RadarChart = React.lazy(() => import('../components/charts/RadarChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));
const MixedChart = React.lazy(() => import('../components/charts/MixedChart'));
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));
const FunnelChart = React.lazy(() => import('../components/charts/FunnelChart'));
import {
  Users, TrendingUp, Target, Sparkles, ArrowUpRight,
  ArrowDownRight, Activity, Award, BookOpen, AlertTriangle,
  ChevronRight, Clock, Zap
} from 'lucide-react';
import type { EChartsOption } from 'echarts';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const mockKpis = {
  total_employees: 248,
  avg_skill_score: 72.4,
  critical_gaps: 14,
  retention_rate: 94.2,
};

const mockInsights = [
  'Cloud architecture is the highest-priority capability gap for the next planning cycle.',
  'Python demand is projected to grow 23% across data and product teams.',
  'Retention indicators remain above the organizational benchmark.',
];

const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    if (useMockData) {
      setKpis(mockKpis);
      setInsights(mockInsights);
      setLoading(false);
      return;
    }

    const [kpiResult, insightsResult] = await Promise.allSettled([
      analyticsService.getDashboardKPIs(),
      analyticsService.getAIInsights(),
    ]);

    if (kpiResult.status === 'fulfilled') {
      setKpis(kpiResult.value);
      setInsights(insightsResult.status === 'fulfilled' ? insightsResult.value : mockInsights);
    } else {
      console.error('Unable to load dashboard metrics', kpiResult.reason);
      setKpis(null);
      setLoadError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (loadError || !kpis) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-[var(--text-secondary)]">
        <AlertTriangle className="w-8 h-8 mb-4 text-[var(--color-warning)]" />
        <p className="text-sm font-medium">Failed to load dashboard metrics.</p>
        <button onClick={() => void loadData()} className="mt-4 btn btn-secondary btn-sm">Retry</button>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Headcount',
      value: kpis.total_employees ?? 248,
      icon: Users,
      trend: '+12',
      up: true,
      color: 'var(--text-primary)',
      bg: 'var(--bg-hover)',
    },
    {
      label: 'Avg Competency',
      value: kpis.avg_skill_score ?? 72.4,
      decimals: 1,
      suffix: '%',
      icon: Target,
      trend: '+3.2',
      up: true,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-bg)',
    },
    {
      label: 'Critical Gaps',
      value: kpis.critical_gaps ?? 14,
      icon: AlertTriangle,
      trend: '-2',
      up: false,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-bg)',
    },
    {
      label: 'Retention Index',
      value: kpis.retention_rate ?? 94.2,
      decimals: 1,
      suffix: '%',
      icon: Award,
      trend: '+1.8',
      up: true,
      color: 'var(--color-info)',
      bg: 'var(--color-info-bg)',
    },
  ];

  const recentActivity = [
    { icon: BookOpen, msg: 'Sarah Chen completed AWS Solutions Architect', time: '2h ago', color: 'var(--color-primary)' },
    { icon: AlertTriangle, msg: 'Cloud Architecture gap detected in Data team', time: '4h ago', color: 'var(--color-warning)' },
    { icon: Award, msg: 'James Miller promoted to Senior Data Scientist', time: '1d ago', color: 'var(--color-info)' },
    { icon: Activity, msg: 'Attrition risk elevated in Engineering (68%)', time: '1d ago', color: 'var(--color-danger)' },
    { icon: TrendingUp, msg: 'Python demand forecast up 23% for Q3', time: '2d ago', color: 'var(--text-primary)' },
  ];

  // Chart: Workforce Trend (Sharp, minimalistic style)
  const trendChartOption: EChartsOption = {
    title: { show: false },
    grid: { top: 20, right: 10, bottom: 20, left: 30 },
    xAxis: { 
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: { 
      min: 200,
      splitLine: { lineStyle: { type: 'dashed', color: 'var(--border-subtle)' } }
    },
    series: [
      {
        name: 'Headcount',
        type: 'line',
        data: [210, 218, 224, 228, 232, 238, 244, 248],
        smooth: false, // Sharp lines
        lineStyle: { width: 2, color: '#818cf8' },
        areaStyle: { 
          color: { 
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1, 
            colorStops: [
              { offset: 0, color: 'rgba(129, 140, 248, 0.2)' },
              { offset: 1, color: 'rgba(129, 140, 248, 0)' },
            ] 
          } 
        },
        symbol: 'circle',
        symbolSize: 4,
        itemStyle: { color: '#818cf8' },
      },
    ],
  };

  // Chart: Skill Distribution (Donut)
  const skillDistOption: EChartsOption = {
    title: { show: false },
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 0, borderColor: '#1c2040', borderWidth: 3 },
        label: { show: false },
        data: [
          { value: 35, name: 'Technical', itemStyle: { color: '#818cf8' } },
          { value: 25, name: 'Leadership', itemStyle: { color: '#60a5fa' } },
          { value: 20, name: 'Data & AI', itemStyle: { color: '#0EA5E9' } },
          { value: 12, name: 'Cloud', itemStyle: { color: '#F59E0B' } },
          { value: 8, name: 'Security', itemStyle: { color: '#10B981' } },
        ],
      },
    ],
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="dashboard-stack">
      {/* Hero Header */}
      <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-outfit tracking-tight text-[var(--text-primary)]">
            {getGreeting()}.
          </h1>
          <p className="text-[15px] mt-2 text-[var(--text-secondary)] font-medium">
            Intelligence summary for{' '}
            <span className="text-[var(--text-primary)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary" className="py-1.5 px-3 uppercase tracking-widest text-[10px]">
            <Zap className="w-3 h-3 mr-1" /> Copilot Active
          </Badge>
          <button className="btn btn-primary text-[12px] uppercase tracking-wider font-outfit">
            Generate Report
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={staggerItem} className="modular-grid">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="span-3 p-6 group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-10 h-10 rounded-md flex items-center justify-center border border-[var(--border-primary)] transition-colors group-hover:border-[var(--border-secondary)]" style={{ background: kpi.bg }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[11px] font-bold font-outfit uppercase" style={{ color: kpi.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold font-outfit text-[var(--text-primary)] tracking-tight">
                <AnimatedCounter value={kpi.value} decimals={kpi.decimals || 0} />
                {kpi.suffix && <span className="text-xl ml-1 text-[var(--text-tertiary)]">{kpi.suffix}</span>}
              </p>
              <p className="text-[13px] font-medium mt-1 text-[var(--text-secondary)] uppercase tracking-wider">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={staggerItem} className="modular-grid">
        {/* AI Insights Card */}
        <Card className="span-4 flex flex-col p-0">
          <div className="p-6 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
            <h2 className="text-[14px] font-bold font-outfit uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              Copilot Insights
            </h2>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {(insights.length > 0 ? insights : [
              'Capability coverage is stable across core business functions.',
              'Review cloud architecture learning pathways before the next planning cycle.',
              'Retention indicators remain above the organizational benchmark.',
            ]).slice(0, 4).map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-4"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0 shadow-[var(--shadow-glow-sm)]" />
                <p className="text-[14px] leading-relaxed text-[var(--text-secondary)] font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Workforce Trend Chart */}
        <Card className="span-8 flex flex-col p-0">
          <div className="p-6 border-b border-[var(--border-primary)] bg-[var(--bg-surface)] flex justify-between items-center">
            <h2 className="text-[14px] font-bold font-outfit uppercase tracking-widest text-[var(--text-primary)]">
              Workforce Growth
            </h2>
            <select className="bg-transparent text-[12px] font-medium text-[var(--text-secondary)] outline-none cursor-pointer">
              <option>YTD 2026</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="p-6 flex-1">
            <Chart option={trendChartOption} height={280} />
          </div>
        </Card>
      </motion.div>

      {/* Second Row */}
      <motion.div variants={staggerItem} className="modular-grid">
        {/* Skill Distribution */}
        <Card className="span-4 flex flex-col p-0">
          <div className="p-6 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
            <h2 className="text-[14px] font-bold font-outfit uppercase tracking-widest text-[var(--text-primary)]">
              Competency Mix
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-bold font-outfit text-[var(--text-primary)]">248</span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Total</span>
              </div>
            </div>
            <Chart option={skillDistOption} height={240} />
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="span-8 flex flex-col p-0">
          <div className="p-6 border-b border-[var(--border-primary)] bg-[var(--bg-surface)] flex justify-between items-center">
            <h2 className="text-[14px] font-bold font-outfit uppercase tracking-widest text-[var(--text-primary)]">
              Activity Stream
            </h2>
            <button className="text-[12px] font-semibold uppercase tracking-wider flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-outfit">
              View Log <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-hover)] cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border border-[var(--border-primary)] bg-[var(--bg-surface)] group-hover:border-[var(--border-secondary)] transition-colors">
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">{item.msg}</p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 text-[var(--text-tertiary)]">
                  <Clock className="w-3 h-3" /> {item.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Advanced Enterprise Analytics - Third Row */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Employee Distribution" endpoint="/dashboard/employee-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <RadarChart title="Department Performance" endpoint="/dashboard/department-performance" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <AreaChart title="Hiring vs Attrition" endpoint="/dashboard/hiring-vs-attrition" />
          </div>
        </Suspense>
      </motion.div>

      {/* Advanced Enterprise Analytics - Fourth Row */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <MixedChart title="Revenue vs Cost" endpoint="/dashboard/revenue-vs-cost" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Monthly Productivity" endpoint="/dashboard/monthly-productivity" />
          </div>
        </Suspense>
      </motion.div>

      {/* Advanced Enterprise Analytics - Fifth Row */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-3 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-3">
            <GaugeChart title="AI Prediction Accuracy" endpoint="/dashboard/ai-accuracy" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-5 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-5">
            <HeatmapChart title="Workforce Utilization" endpoint="/dashboard/workforce-utilization" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Executive KPI Trend" endpoint="/dashboard/executive-kpi" />
          </div>
        </Suspense>
      </motion.div>

      {/* Advanced Enterprise Analytics - Sixth Row */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Skill Demand Trend" endpoint="/dashboard/skill-demand-trend" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Workforce Forecast" endpoint="/dashboard/workforce-forecast" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <FunnelChart title="Recruitment Pipeline" endpoint="/dashboard/recruitment-pipeline" />
          </div>
        </Suspense>
      </motion.div>
    </motion.div>
  );
}
