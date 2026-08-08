import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../design-system';

const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));

export default function ReportsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="page-header border-b border-[var(--border-primary)] pb-6 mb-6">
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Reports & Exports</h1>
        <p className="text-[var(--text-secondary)] mt-1 font-medium">Export analytics and report generation tracking</p>
      </motion.div>

      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Report Generation Trend" endpoint="/analytics/report-generation-trend" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Export Statistics" endpoint="/analytics/export-stats" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Department Reports" endpoint="/analytics/department-reports" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Monthly Reports" endpoint="/analytics/monthly-reports" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <AreaChart title="Download Analytics" endpoint="/analytics/download-analytics" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Executive Summary" endpoint="/analytics/executive-summary" />
          </div>
        </Suspense>
      </motion.div>
    </motion.div>
  );
}
