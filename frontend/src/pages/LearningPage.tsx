/**
 * AI Learning Path Page
 * =====================
 * Displays personalized course recommendations.
 */

import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { learningService } from '../services/learningService';
import { BookOpen, Star, Clock, Trophy, Sparkles, CalendarDays, Target } from 'lucide-react';
import type { LearningPath } from '../types/analytics';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge } from '../components/ui/Base';


// Lazy loaded charts
const GaugeChart = React.lazy(() => import('../components/charts/GaugeChart'));
const LineChart = React.lazy(() => import('../components/charts/LineChart'));
const DonutChart = React.lazy(() => import('../components/charts/DonutChart'));
const CalendarHeatmap = React.lazy(() => import('../components/charts/CalendarHeatmap'));
const FunnelChart = React.lazy(() => import('../components/charts/FunnelChart'));
const AreaChart = React.lazy(() => import('../components/charts/AreaChart'));

const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
export default function LearningPage() {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<LearningPath | null>(null);

  // In a real app, this would use the logged-in user's ID
  const empId = 'emp-1';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await learningService.getLearningPath(empId);
        setPath(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [empId]);

  if (loading || !path) {
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
      className="space-y-8 pb-12"
    >
      {/* Banner */}
      <motion.div variants={staggerItem}>
        <div className="flex justify-between items-center bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-secondary)] p-8 rounded-2xl text-white shadow-[var(--shadow-lg)] relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase font-outfit">AI Generated Learning Path</span>
            </div>
            <h1 className="text-[32px] font-outfit font-bold mb-2 tracking-tight">Personalized Growth Plan</h1>
            <p className="text-blue-100/90 mb-6 text-[14px] leading-relaxed">
              Based on {path.employee_name}'s skill gaps, career trajectory, and organizational forecasting, our AI has generated an optimized path to leadership readiness.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-[14px] bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock className="w-4 h-4 text-blue-200" />
                <span className="font-semibold">{path.total_duration_weeks} Weeks to Completion</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-blue-200" />
                <span className="font-semibold">
                  {path.phases.reduce((acc, phase) => acc + phase.courses.length, 0)} Recommended Courses
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        {[
          { label: 'Path progress', value: '18%', detail: 'first milestone in progress', icon: Target, tone: 'var(--color-primary)' },
          { label: 'Weekly focus', value: '4.5h', detail: 'recommended learning time', icon: Clock, tone: 'var(--color-accent)' },
          { label: 'Next milestone', value: 'Fri', detail: 'Cloud fundamentals checkpoint', icon: CalendarDays, tone: 'var(--color-success)' },
        ].map((metric) => (
          <Card key={metric.label} className="span-4 metric-card" interactive>
            <div className="flex items-start justify-between"><div><p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">{metric.label}</p><p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{metric.value}</p></div><metric.icon className="w-5 h-5" style={{ color: metric.tone }} /></div>
            <p className="text-xs text-[var(--text-secondary)]">{metric.detail}</p>
          </Card>
        ))}
      </motion.div>

      <div className="space-y-8 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-[var(--border-primary)]"></div>

        {path.phases.map((phase, index) => (
          <motion.div variants={staggerItem} key={index} className="relative pl-16">
            <div className="absolute left-[18px] top-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--bg-app)] shadow-sm"></div>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-1 tracking-tight">{phase.name}</h2>
            <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-5">{phase.duration_weeks} Weeks • {phase.courses.length} Courses</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {phase.courses.map(course => (
                <Card key={course.id} padding="none" interactive className="flex flex-col group border-l-4 border-l-[var(--color-primary)]">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="neutral">{course.provider}</Badge>
                      <Badge variant={course.priority === 'critical' || course.priority === 'high' ? 'warning' : 'primary'} size="sm">
                        {course.skill_name} GAP
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-[16px] mb-3 text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {course.course_title}
                    </h3>
                    
                    <div className="flex gap-4 text-[13px] text-[var(--text-secondary)] mb-5 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {course.duration_hours}h
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="bg-[var(--color-success-bg)] rounded-lg p-3.5 mt-auto border border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-[13px] text-[var(--color-success)] font-semibold mb-1">
                        <Trophy className="w-4 h-4" />
                        Career Impact: {course.career_growth.split('—')[0]}
                      </div>
                      <p className="text-[12px] text-[var(--text-secondary)]">
                        Estimated readiness boost: <span className="font-medium text-[var(--text-primary)]">{course.readiness_impact}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    
      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <GaugeChart title="Learning Progress" endpoint="/analytics/learning-progress" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Weekly Learning Trend" endpoint="/analytics/learning-trend" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <DonutChart title="Course Completion" endpoint="/analytics/course-completion" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <LineChart title="Certification Timeline" endpoint="/analytics/certification-timeline" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <CalendarHeatmap title="Learning Heatmap" endpoint="/analytics/learning-heatmap" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <FunnelChart title="Completion Funnel" endpoint="/analytics/completion-funnel" />
          </div>
        </Suspense>
      </motion.div>
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <BarChart title="AI Recommended Courses" endpoint="/analytics/recommended-courses" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-6">
            <AreaChart title="Learning ROI" endpoint="/analytics/learning-roi" />
          </div>
        </Suspense>
      </motion.div>
</motion.div>
  );
}
