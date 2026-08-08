/**
 * Readiness Page — Workforce Readiness Engine
 * ===========================================
 * Predictive promotion readiness with SHAP explainability and feature breakdown.
 * Uses design system CSS tokens for total dark/light theme harmony.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { readinessService } from '../services/readinessService';
import LocalGaugeChart from '../components/charts/GaugeChart';
import LocalWaterfallChart from '../components/charts/WaterfallChart';
import { ShieldCheck, Zap } from 'lucide-react';
import type { ReadinessScore } from '../types/analytics';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge, SectionHeader } from '../components/ui/Base';


// Lazy loaded charts
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const BoxPlot = React.lazy(() => import('../components/charts/BoxPlot'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const LineChart = React.lazy(() => import('../components/charts/LineChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function ReadinessPage() {
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState<ReadinessScore | null>(null);

  const empId = 'emp-1';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await readinessService.getEmployeeScore(empId);
        setScoreData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [empId]);

  if (loading || !scoreData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  // const waterfallData = [
  //   { name: 'Baseline', value: 50, type: 'start' as const },
  //   ...scoreData.shap_values.map(s => ({
  //     name: s.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  //     value: s.contribution,
  //     type: (s.contribution >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
  //   })),
  //   { name: 'Final Score', value: scoreData.readiness_score, type: 'end' as const }
  // ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Workforce Readiness Engine</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">XGBoost-powered prediction with SHAP explainability</p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        {/* Main Readiness Gauge */}
        <Card className="span-4 p-6 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
              Promotion Readiness
            </span>
            <Badge variant="primary">
              Confidence: {scoreData.confidence.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="h-60 w-full relative my-2">
            <LocalGaugeChart endpoint="/analytics/readiness-score-gauge" title="Readiness Score" />
          </div>

          <div 
            className="w-full p-4 rounded-xl flex items-start gap-3 mt-4"
            style={{
              background: scoreData.readiness_score >= 80 ? 'var(--color-success-bg)' :
                scoreData.readiness_score >= 60 ? 'var(--color-primary-bg)' : 'var(--color-warning-bg)',
              color: scoreData.readiness_score >= 80 ? 'var(--color-success)' :
                scoreData.readiness_score >= 60 ? 'var(--color-primary-light)' : 'var(--color-warning)'
            }}
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[13px]">AI Recommendation</p>
              <p className="text-[12px] mt-0.5 opacity-90 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {scoreData.recommendation}
              </p>
            </div>
          </div>
        </Card>

        {/* SHAP Explainability Waterfall */}
        <Card className="span-8 p-6">
          <SectionHeader 
            title="SHAP Explainability" 
            subtitle="Feature contribution breakdown explaining the AI model prediction"
            action={<Badge variant="warning"><Zap className="w-3 h-3 text-amber-400" /> Model Insights</Badge>}
          />
          <div className="h-[340px] mt-2">
            <LocalWaterfallChart endpoint="/analytics/shap-waterfall" title="SHAP Explainability" />
          </div>
        </Card>
      </motion.div>

      {/* Feature Breakdown */}
      <motion.div variants={staggerItem}>
        <Card className="p-6">
          <SectionHeader title="Input Feature Analysis" subtitle="Individual factors evaluated by the model" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Object.entries(scoreData.features).map(([key, value]) => (
              <div 
                key={key} 
                className="p-4 rounded-xl"
                style={{ 
                  background: 'var(--bg-hover)', 
                  border: '1px solid var(--border-primary)' 
                }}
              >
                <p className="text-[11px] uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {key.replace(/_/g, ' ')}
                </p>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value.toFixed(0)}</span>
                  <span className="text-[12px] mb-1" style={{ color: 'var(--text-tertiary)' }}>/100</span>
                </div>
                <div className="progress-bar mt-3">
                  <div 
                    className={`progress-bar-fill ${value > 75 ? 'success' : value > 40 ? 'primary' : 'warning'}`} 
                    style={{ width: `${value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="Readiness Gauge" endpoint="/analytics/readiness-gauge" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <ScatterChart title="Promotion Readiness" endpoint="/analytics/promotion-readiness" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BoxPlot title="Department Comparison" endpoint="/analytics/department-comparison" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="Feature Importance" endpoint="/analytics/feature-importance" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="SHAP Summary" endpoint="/analytics/shap-summary" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <PieChart title="Readiness Distribution" endpoint="/analytics/readiness-distribution" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Readiness Timeline" endpoint="/analytics/readiness-timeline" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="AI Confidence" endpoint="/analytics/ai-confidence" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
