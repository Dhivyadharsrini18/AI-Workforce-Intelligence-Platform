/**
 * Promotion Analytics Page
 * ========================
 * AI-powered promotion eligibility analysis with SHAP explainability.
 * All styling uses CSS custom properties for theme consistency.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { promotionService } from '../services/promotionService';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge, SectionHeader } from '../components/ui/Base';
import AnimatedCounter from '../components/charts/AnimatedCounter';
import Chart from '../components/ui/Chart';
import {
  ArrowUpCircle, Sparkles, TrendingUp, BarChart3,
  Award, Target, ChevronRight,
} from 'lucide-react';
import type { PromotionPrediction, SHAPValue } from '../types/analytics';
import type { EChartsOption } from 'echarts';


// Lazy loaded charts
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const RadarChart = React.lazy(() => import('../components/charts/RadarChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const FunnelChart = React.lazy(() => import('../components/charts/FunnelChart'));
const TreeChart = React.lazy(() => import('../components/charts/TreeChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function PromotionAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<PromotionPrediction | null>(null);

  const empId = 'emp-1';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await promotionService.predictPromotion(empId);
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

  const isPromotable = (prediction.promotion_probability ?? 0) >= 70;

  const shapOption: EChartsOption = {
    title: { text: 'Feature Impact Analysis (SHAP)', textStyle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }, left: 0 },
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: 20, right: 20, bottom: 20, top: 50, containLabel: true },
    xAxis: { type: 'value' as const, splitLine: { lineStyle: { type: 'dashed', color: 'var(--border-primary)' } } },
    yAxis: {
      type: 'category' as const,
      data: prediction.shap_values.map((s: SHAPValue) => s.feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())).reverse(),
      axisLabel: { fontSize: 12, color: 'var(--text-secondary)' },
    },
    series: [{
      type: 'bar',
      data: [...prediction.shap_values].reverse().map((s: SHAPValue) => ({
        value: s.contribution,
        itemStyle: { color: s.contribution >= 0 ? '#10B981' : '#EF4444', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: 16,
    }],
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Promotion Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">XGBoost prediction with SHAP-powered explainability</p>
        </div>
      </motion.div>

      {/* Hero Prediction Card */}
      <motion.div variants={staggerItem}>
        <Card className="p-0 overflow-hidden">
          <div className="p-6 relative" style={{ background: 'var(--gradient-primary)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(167, 139, 250, 0.25) 0%, transparent 70%)' }} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase">AI Prediction Result</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{prediction.employee_name}</h2>
                <p className="text-indigo-100/80 text-[14px]">
                  {prediction.job_title} • <span className="text-white font-semibold">Promotion Candidate</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white">
                  <AnimatedCounter value={Math.round(prediction.promotion_probability)} />%
                </div>
                <Badge
                  className="mt-2 text-[12px] px-3 py-1"
                  style={{
                    background: isPromotable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isPromotable ? '#34D399' : '#FBBF24',
                  }}
                >
                  {isPromotable ? 'Promotion Ready' : 'Developing'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 divide-x" style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-card)' }}>
            {[
              { label: 'Confidence', value: `${prediction.confidence.toFixed(1)}%`, icon: Target },
              { label: 'Leadership Potential', value: `${prediction.leadership_potential.toFixed(0)}%`, icon: Award },
              { label: 'Readiness Score', value: `${(prediction.features.readiness_score ?? 0).toFixed(0)}%`, icon: BarChart3 },
              { label: 'Performance', value: `${(prediction.features.performance ?? 0).toFixed(0)}%`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 text-center" style={{ borderColor: 'var(--border-primary)' }}>
                <s.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* SHAP Analysis & Recommendation */}
      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-7 p-5">
          <Chart option={shapOption} height={300} />
        </Card>

        <Card className="span-5 p-5">
          <SectionHeader title="AI Recommendation" subtitle="Model-generated action plan" />
          <div className="space-y-3 mt-2">
            <div className="p-3 rounded-lg" style={{ background: isPromotable ? 'var(--color-success-bg)' : 'var(--color-warning-bg)' }}>
              <p className="text-[13px] font-semibold flex items-center gap-2" style={{ color: isPromotable ? 'var(--color-success)' : 'var(--color-warning)' }}>
                <ArrowUpCircle className="w-4 h-4" />
                {isPromotable ? 'Ready for promotion' : 'Needs development'}
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                {prediction.suggested_action}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Model Assessment Summary</p>
              <div className="p-3 rounded-lg text-[13px] leading-relaxed" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                {prediction.explanation}
              </div>
            </div>
            
            {prediction.timeline && (
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-link)' }}>
                <ChevronRight className="w-3.5 h-3.5" /> Timeline: {prediction.timeline}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Decision window</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction.timeline || 'Next review cycle'}</p>
          <p className="text-xs text-[var(--text-secondary)]">Recommended timing based on model confidence and readiness signals.</p>
        </Card>
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Strongest signal</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{prediction.shap_values[0]?.feature.replace(/_/g, ' ') || 'Performance'}</p>
          <p className="text-xs text-[var(--text-secondary)]">Highest-impact input in the current recommendation.</p>
        </Card>
        <Card className="span-4 metric-card card-accent">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Next manager action</p>
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">Review the assessment with the employee and align the next development milestone.</p>
          <button className="btn-secondary btn-sm self-start">View candidate plan</button>
        </Card>
      </motion.div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="Promotion Probability" endpoint="/analytics/promotion-probability" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Candidate Ranking" endpoint="/analytics/candidate-ranking" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <RadarChart title="Leadership Radar" endpoint="/analytics/leadership-radar" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <ScatterChart title="Performance Matrix" endpoint="/analytics/performance-matrix" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <FunnelChart title="Promotion Funnel" endpoint="/analytics/promotion-funnel" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <TreeChart title="Career Timeline" endpoint="/analytics/career-timeline" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <AreaChart title="AI Confidence Chart" endpoint="/analytics/promotion-ai-confidence" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
