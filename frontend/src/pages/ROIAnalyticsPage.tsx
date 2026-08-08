/**
 * ROI Analytics Page — Hire vs Upskill Decision Engine
 * =====================================================
 * AI-optimized strategy recommendations with cost analysis.
 * All styling uses CSS custom properties for theme consistency.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { decisionService } from '../services/decisionService';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge, SectionHeader } from '../components/ui/Base';
import AnimatedCounter from '../components/charts/AnimatedCounter';
import {
  Calculator, Lightbulb, Clock, CheckCircle2,
} from 'lucide-react';
import type { DecisionRecommendation } from '../types/analytics';


// Lazy loaded charts
const MixedChart = React.lazy(() => import('../components/charts/MixedChart'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const WaterfallChart = React.lazy(() => import('../components/charts/WaterfallChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function ROIAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<DecisionRecommendation | null>(null);

  const skillId = 'skill-1';
  const headcount = 5;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await decisionService.getStrategyRecommendation(skillId, headcount);
        setDecision(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [skillId]);

  if (loading || !decision) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  const isUpskill = decision.strategy === 'Upskill (Build)';

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Decision Engine & ROI</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">AI-optimized "Hire vs Upskill vs Outsource" recommendations</p>
        </div>
      </motion.div>

      {/* Hero Decision Card */}
      <motion.div variants={staggerItem}>
        <Card className="p-0 overflow-hidden">
          <div className="p-6 relative" style={{ background: 'var(--gradient-primary)' }}>
            <div className="absolute right-0 top-0 opacity-10">
              <Lightbulb className="w-48 h-48" style={{ color: 'white' }} />
            </div>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(167, 139, 250, 0.25) 0%, transparent 70%)' }} />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    className="text-[11px] px-2.5 py-1 font-bold uppercase tracking-wider font-outfit"
                    style={{
                      background: decision.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: decision.priority === 'Critical' ? '#FCA5A5' : '#FDE68A',
                    }}
                  >
                    {decision.priority} Priority
                  </Badge>
                  <Badge
                    className="text-[11px] px-2.5 py-1 font-bold uppercase tracking-wider font-outfit"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  >
                    {decision.skill_name}
                  </Badge>
                </div>

                <h2 className="text-4xl font-bold text-white mb-3 font-outfit" style={{ letterSpacing: '-0.02em' }}>
                  {decision.strategy}
                </h2>
                <p className="text-indigo-100/80 text-[15px] leading-relaxed mb-4">
                  {decision.business_impact}
                </p>

                <div className="flex items-center gap-4 text-[13px] text-indigo-200/70 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {decision.metrics.required_headcount} headcount
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" /> {decision.confidence.toFixed(1)}% Confidence
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Estimated Cost', value: decision.estimated_cost, prefix: '$', color: 'white' },
                  { label: 'Projected ROI', value: decision.roi_percentage, suffix: '%', color: '#34D399', decimals: 1 },
                  { label: 'Time to Value', value: decision.estimated_time_months, suffix: ' Months', color: 'white', colSpan: true },
                ].map((metric, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl ${metric.colSpan ? 'col-span-2' : ''}`}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <p className="text-[12px] text-indigo-200/70 font-medium mb-1 uppercase tracking-wider">{metric.label}</p>
                    <p className="text-3xl font-bold flex items-center gap-1 font-outfit" style={{ color: metric.color }}>
                      {metric.colSpan && <Clock className="w-5 h-5 text-indigo-300" />}
                      {metric.prefix && <span className="text-lg">{metric.prefix}</span>}
                      <AnimatedCounter value={metric.value} decimals={metric.decimals || 0} />
                      {metric.suffix && <span className="text-lg">{metric.suffix}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Market Constraints & Alternative Strategy */}
      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-4 p-5">
          <SectionHeader title="Market Constraints" />
          <div className="space-y-5 mt-2">
            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Market Availability</span>
                <span className="font-bold" style={{ color: decision.metrics.market_availability === 'Low' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {decision.metrics.market_availability}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${decision.metrics.market_availability === 'Low' ? 'danger' : 'success'}`}
                  style={{ width: decision.metrics.market_availability === 'Low' ? '25%' : '75%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Demand Growth</span>
                <span className="font-bold" style={{ color: 'var(--color-success)' }}>+{decision.metrics.demand_growth.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill success"
                  style={{ width: `${Math.min(100, decision.metrics.demand_growth * 2)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="span-8 p-5 card-accent">
          <SectionHeader title="Alternative Strategy Evaluation" />
          <div className="mt-2">
            <p className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {decision.alternative_strategy}
            </p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {isUpskill ?
                  "Hiring externally would cost approximately 4.5x more due to market scarcity and high median salaries, taking 2-3 months longer to onboard." :
                  "Upskilling internally would delay critical project deliverables by 4+ months. The short-term cost savings are outweighed by the opportunity cost."
                }
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Budget allocation</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">${Math.round(decision.estimated_cost * 0.64).toLocaleString()}</p>
          <p className="text-xs text-[var(--text-secondary)]">Recommended initial investment for the selected strategy.</p>
        </Card>
        <Card className="span-4 metric-card">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Decision confidence</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{decision.confidence.toFixed(1)}%</p>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${decision.confidence}%` }} /></div>
        </Card>
        <Card className="span-4 metric-card card-accent">
          <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">Scenario ready</p>
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">Compare assumptions before committing the workforce plan.</p>
          <button className="btn-secondary btn-sm self-start">Compare scenarios</button>
        </Card>
      </motion.div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <MixedChart title="ROI Comparison" endpoint="/analytics/roi-comparison" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <PieChart title="Cost Breakdown" endpoint="/analytics/cost-breakdown" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <AreaChart title="Investment Timeline" endpoint="/analytics/investment-timeline" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Scenario Simulation" endpoint="/analytics/scenario-simulation" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <ScatterChart title="Decision Matrix" endpoint="/analytics/decision-matrix" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <WaterfallChart title="Financial Projection" endpoint="/analytics/financial-projection" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Cost Saving Analysis" endpoint="/analytics/cost-saving" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
