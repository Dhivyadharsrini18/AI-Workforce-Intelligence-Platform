/**
 * Attrition Analytics Page
 * ========================
 * AI-powered attrition risk analysis with feature importance and risk drivers.
 * All styling uses CSS custom properties for theme consistency.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { attritionService } from '../services/attritionService';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge, SectionHeader } from '../components/ui/Base';
import AnimatedCounter from '../components/charts/AnimatedCounter';
import Chart from '../components/ui/Chart';
import {
  AlertTriangle, TrendingDown, Shield,
  Sparkles, Target, BarChart3,
} from 'lucide-react';
import type { AttritionPrediction, SHAPValue } from '../types/analytics';
import type { EChartsOption } from 'echarts';


// Lazy loaded charts
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const DonutChart = React.lazy(() => import('../components/charts/DonutChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function AttritionAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<AttritionPrediction | null>(null);

  const empId = 'emp-1';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await attritionService.predictAttrition(empId);
        setPrediction(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [empId]);

  if (loading || !prediction) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  const riskProb = prediction.attrition_probability ?? 0;
  const riskLevel = riskProb >= 70 ? 'Critical' :
    riskProb >= 40 ? 'High' :
    riskProb >= 20 ? 'Medium' : 'Low';

  const riskColor = riskProb >= 70 ? 'var(--color-danger)' :
    riskProb >= 40 ? 'var(--color-warning)' :
    riskProb >= 20 ? '#F59E0B' : 'var(--color-success)';

  const riskBg = riskProb >= 70 ? 'var(--color-danger-bg)' :
    riskProb >= 40 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)';

  // Feature importance chart using SHAP
  const featureImportanceOption: EChartsOption = {
    title: { text: 'Attrition Risk Drivers (SHAP)', textStyle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }, left: 0 },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: 20, right: 20, bottom: 20, top: 50, containLabel: true },
    xAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { type: 'dashed', color: 'var(--border-primary)' } },
    },
    yAxis: {
      type: 'category' as const,
      data: prediction.shap_values
        ? prediction.shap_values.map((f: SHAPValue) => f.feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())).reverse()
        : [],
      axisLabel: { fontSize: 12, color: 'var(--text-secondary)' },
    },
    series: [{
      type: 'bar',
      data: prediction.shap_values
        ? [...prediction.shap_values].reverse().map((f: SHAPValue) => ({
            value: f.contribution,
            itemStyle: {
              color: f.contribution >= 5 ? '#EF4444' : f.contribution >= 0 ? '#F59E0B' : '#6366F1',
              borderRadius: [0, 4, 4, 0],
            },
          }))
        : [],
      barWidth: 16,
    }],
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Attrition Risk Intelligence</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">ML-powered flight risk detection with actionable retention strategies</p>
        </div>
      </motion.div>

      {/* Hero Risk Card */}
      <motion.div variants={staggerItem}>
        <Card className="p-0 overflow-hidden">
          <div
            className="p-6 relative"
            style={{
              background: riskProb >= 50
                ? 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #DC2626 100%)'
                : 'var(--gradient-primary)',
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)' }} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase font-outfit">Attrition Risk Assessment</span>
                </div>
                <h2 className="text-3xl font-outfit font-bold text-white mb-2">{prediction.employee_name}</h2>
                <p className="text-white/70 text-[14px]">{prediction.job_title}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white font-outfit">
                  <AnimatedCounter value={Math.round(riskProb)} />%
                </div>
                <Badge
                  className="mt-2 text-[12px] px-3 py-1 font-semibold"
                  style={{
                    background: riskBg,
                    color: riskColor,
                  }}
                >
                  <AlertTriangle className="w-3 h-3" /> {riskLevel} Risk
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x" style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-card)' }}>
            {[
              { label: 'Confidence', value: `${prediction.confidence.toFixed(1)}%`, icon: Target },
              { label: 'Engagement Risk', value: `${(prediction.features?.engagement_risk ?? 0).toFixed(0)}%`, icon: Shield },
              { label: 'Burnout Risk', value: `${(prediction.features?.burnout_risk ?? 0).toFixed(0)}%`, icon: BarChart3 },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 text-center" style={{ borderColor: 'var(--border-primary)' }}>
                <s.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-lg font-bold font-outfit" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Risk Analysis & Retention Strategy */}
      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-7 p-5">
          <Chart option={featureImportanceOption} height={300} />
        </Card>

        <Card className="span-5 p-5">
          <SectionHeader title="Retention Strategy" subtitle="AI-generated recommendations" />
          <div className="space-y-3 mt-2">
            <div className="p-3 rounded-lg" style={{ background: riskBg }}>
              <p className="text-[13px] font-semibold flex items-center gap-2" style={{ color: riskColor }}>
                <TrendingDown className="w-4 h-4" />
                {riskLevel} Attrition Risk
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                {prediction.recommended_action || 'Review compensation benchmarks and discuss career trajectory in next 1-on-1.'}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Explanation</p>
              <div className="p-3 rounded-lg text-[13px] leading-relaxed" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                {prediction.explanation}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Priority conversation</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">This week</p>
          <p className="text-xs text-[var(--text-secondary)]">Schedule a focused 1:1 while the risk signals are current.</p>
        </Card>
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Primary driver</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction.shap_values?.[0]?.feature.replace(/_/g, ' ') || 'Engagement'}</p>
          <p className="text-xs text-[var(--text-secondary)]">Top model contribution to the current risk assessment.</p>
        </Card>
        <Card className="span-4 metric-card card-accent">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Retention playbook</p>
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">Combine career-path clarity with workload and compensation review.</p>
          <button className="btn-secondary btn-sm self-start">Open action plan</button>
        </Card>
      </motion.div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Attrition Trend" endpoint="/analytics/attrition-trend" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <ScatterChart title="Burnout Analysis" endpoint="/analytics/burnout-analysis" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <DonutChart title="Risk Distribution" endpoint="/analytics/risk-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <HeatmapChart title="Department Risk Heatmap" endpoint="/analytics/department-risk-heatmap" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Employee Risk Ranking" endpoint="/analytics/employee-risk-ranking" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="Retention Probability" endpoint="/analytics/retention-probability" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="SHAP Explanation" endpoint="/analytics/attrition-shap" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
