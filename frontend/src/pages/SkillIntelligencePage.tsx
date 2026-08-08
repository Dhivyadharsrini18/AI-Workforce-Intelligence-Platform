/**
 * Skill Intelligence Page
 * =======================
 * Workforce capability forecasting, heatmap, skill gaps, and emerging skills.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { analyticsService } from '../services/analyticsService';
import { skillService } from '../services/skillService';
import SkillDashboard from '../components/analytics/SkillDashboard';
import SkillHeatmap from '../components/analytics/SkillHeatmap';
import SkillForecastChart from '../components/analytics/SkillForecastChart';
import AIInsights from '../components/analytics/AIInsights';
import SkillGapCard from '../components/analytics/SkillGapCard';
import EmergingSkills from '../components/analytics/EmergingSkills';
import { staggerContainer, staggerItem } from '../design-system';

// Lazy loaded charts
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));
const RadarChart = React.lazy(() => import('../components/charts/RadarChart'));
const NetworkGraph = React.lazy(() => import('../components/charts/NetworkGraph'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const BarChart = React.lazy(() => import('../components/charts/MixedChart')); // Using MixedChart as BarChart fallback
const BubbleChart = React.lazy(() => import('../components/charts/BubbleChart'));

export default function SkillIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [emergingSkills, setEmergingSkills] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          dashRes, gapsRes, heatmapRes, insightsRes, emergingRes, forecastRes
        ] = await Promise.all([
          analyticsService.getDashboardKPIs(),
          analyticsService.getSkillGaps(),
          analyticsService.getDepartmentHeatmap(),
          analyticsService.getAIInsights(),
          skillService.getEmerging(5),
          skillService.getForecast('Python', 12)
        ]);

        setDashboardData(dashRes);
        setSkillGaps(gapsRes);
        setHeatmapData(heatmapRes);
        setInsights(insightsRes);
        setEmergingSkills(emergingRes);
        setForecastData(forecastRes);
      } catch (err) {
        console.error("Failed to load skill intelligence data", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Skill Intelligence</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">AI-powered workforce capability forecasting and analytics</p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <SkillDashboard {...dashboardData} />
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        <div className="span-8 space-y-6">
          <AIInsights insights={insights} />
          
          <div className="h-[400px]">
            <SkillForecastChart data={forecastData} skillName="Python" />
          </div>
          
          <div className="h-[400px]">
            <SkillHeatmap data={heatmapData} />
          </div>
        </div>
        
        <div className="span-4 space-y-6">
          <div className="h-[400px]">
            <SkillGapCard gaps={skillGaps} />
          </div>
          <div className="h-[400px]">
            <EmergingSkills skills={emergingSkills} />
          </div>
        </div>
      </motion.div>

      {/* Advanced Enterprise Analytics - Skills Matrix */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Skill Demand Trend" endpoint="/analytics/skill-demand-trend-global" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <AreaChart title="Skill Supply vs Demand" endpoint="/analytics/skill-supply-demand" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <HeatmapChart title="Skill Heatmap" endpoint="/analytics/skill-heatmap-advanced" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <RadarChart title="Technology Radar" endpoint="/analytics/technology-radar" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Emerging Skills (Advanced)" endpoint="/analytics/emerging-skills-advanced" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-8 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-8">
            <NetworkGraph title="Skill Dependency Network" endpoint="/analytics/skill-dependency" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Certification Distribution" endpoint="/analytics/certification-distribution" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Skill Growth Timeline" endpoint="/analytics/skill-growth-timeline" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BubbleChart title="AI Readiness Comparison" endpoint="/analytics/ai-readiness-comparison" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <HeatmapChart title="Department Skill Matrix" endpoint="/analytics/department-skill-matrix" />
          </div>
        </Suspense>
      </motion.div>

    </motion.div>
  );
}
