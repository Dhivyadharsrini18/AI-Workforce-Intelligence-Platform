import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../design-system';

const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));

export default function SettingsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="page-header border-b border-[var(--border-primary)] pb-6 mb-6">
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">System Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1 font-medium">System performance, ML models, and security dashboard</p>
      </motion.div>

      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-3 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-3">
            <GaugeChart title="API Health" endpoint="/analytics/api-health" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Database Usage" endpoint="/analytics/database-usage" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-5 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-5">
            <LineChart title="ML Model Status" endpoint="/analytics/ml-model-status" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <AreaChart title="Storage Usage" endpoint="/analytics/storage-usage" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Active Users" endpoint="/analytics/active-users" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <AreaChart title="System Performance" endpoint="/analytics/system-performance" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Audit Logs Trend" endpoint="/analytics/audit-logs" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <HeatmapChart title="Security Dashboard" endpoint="/analytics/security-dashboard" />
          </div>
        </Suspense>
      </motion.div>
    </motion.div>
  );
}
