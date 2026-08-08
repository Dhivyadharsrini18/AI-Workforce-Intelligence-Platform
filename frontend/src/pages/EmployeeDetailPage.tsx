/**
 * Employee Detail Page
 * ====================
 * Premium profile view with hero banner, KPI cards, tab navigation,
 * skill breakdown, certifications, and career metrics.
 * Uses CSS custom properties throughout (no hardcoded Tailwind colors).
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeService } from '../services/employeeService';
import { staggerContainer, staggerItem } from '../design-system';
import { Card, Badge, SectionHeader } from '../components/ui/Base';
import AnimatedCounter from '../components/charts/AnimatedCounter';
import Chart from '../components/ui/Chart';
import {
  ArrowLeft, Mail, Building2, Calendar, Award, TrendingUp,
  BookOpen, Target, Clock, Shield,
  GraduationCap, Briefcase,
} from 'lucide-react';
import type { EmployeeDetail, EmployeeSkill, Certification } from '../types/employee';
import { formatDate, getInitials } from '../utils/formatters';
import type { EChartsOption } from 'echarts';

// Lazy loaded charts
const LineChart = React.lazy(() => import('../components/charts/LineChart'));

const tabs = ['Overview', 'Skills', 'Certifications', 'Career'];

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    async function loadEmployee() {
      try {
        setLoading(true);
        if (id) {
          const data = await employeeService.getEmployee(id);
          setEmployee(data as EmployeeDetail);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEmployee();
  }, [id]);

  if (loading || !employee) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  const statusColor = employee.status === 'active'
    ? { text: 'var(--color-success)', bg: 'var(--color-success-bg)' }
    : employee.status === 'on_leave'
    ? { text: 'var(--color-warning)', bg: 'var(--color-warning-bg)' }
    : { text: 'var(--text-secondary)', bg: 'var(--bg-badge)' };

  const kpis = [
    { label: 'Readiness Score', value: employee.readiness_score ?? 0, suffix: '%', icon: Target, color: 'var(--color-primary)', bg: 'var(--color-primary-bg)' },
    { label: 'Performance', value: employee.performance_score ?? 0, suffix: '%', icon: TrendingUp, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
    { label: 'Certifications', value: employee.certifications?.length ?? 0, icon: Award, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { label: 'Experience', value: employee.experience_years ?? 0, suffix: ' yrs', icon: Briefcase, color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
  ];

  // Radar chart for skill distribution
  const skillNames = employee.skills?.slice(0, 6).map((s: EmployeeSkill) => s.skill?.name || 'Skill') ?? [];
  const skillLevels = employee.skills?.slice(0, 6).map((s: EmployeeSkill) => s.proficiency_level ?? 0) ?? [];
  
  const radarOption: EChartsOption = {
    radar: {
      indicator: skillNames.map((name: string) => ({ name, max: 100 })),
      shape: 'circle' as const,
      splitNumber: 4,
      axisLine: { lineStyle: { color: 'var(--border-primary)' } },
      splitLine: { lineStyle: { color: 'var(--border-primary)' } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisName: { color: 'var(--text-secondary)', fontSize: 11 },
    },
    series: [{
      type: 'radar',
      data: [{
        value: skillLevels,
        name: 'Proficiency',
        areaStyle: { color: 'rgba(99, 102, 241, 0.15)' },
        lineStyle: { color: '#6366F1', width: 2 },
        itemStyle: { color: '#6366F1' },
        symbol: 'circle',
        symbolSize: 5,
      }],
    }],
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Back + Hero */}
      <motion.div variants={staggerItem}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] font-medium mb-4 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Employees
        </button>

        {/* Profile Hero Card */}
        <Card className="p-0 overflow-hidden">
          {/* Gradient Banner */}
          <div className="h-28 relative" style={{ background: 'var(--gradient-primary)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(167, 139, 250, 0.3) 0%, transparent 70%)' }} />
          </div>

          <div className="px-6 pb-6 relative">
            {/* Avatar overlapping the banner */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white -mt-10 relative z-10"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-lg)',
                border: '4px solid var(--bg-card)',
              }}
            >
              {getInitials(employee.first_name, employee.last_name)}
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {employee.first_name} {employee.last_name}
                </h1>
                <p className="text-[14px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {employee.job_title} ({employee.job_level})
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {employee.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {employee.department?.name || 'Department'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(employee.hire_date)}
                  </span>
                </div>
              </div>

              <Badge
                style={{ background: statusColor.bg, color: statusColor.text }}
                className="capitalize text-[12px] font-semibold px-3 py-1"
              >
                {employee.status?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={staggerItem} className="modular-grid">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="span-3 p-4 card-accent">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: kpi.bg }}>
                <kpi.icon className="w-[18px] h-[18px]" style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-lg font-bold font-outfit" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={kpi.value} />{kpi.suffix && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{kpi.suffix}</span>}
                </p>
                <p className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={staggerItem}>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-2 rounded-md text-[13px] font-medium transition-all"
              style={{
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: activeTab === tab ? 'var(--bg-active)' : 'transparent',
              }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-md"
                  style={{ background: 'var(--bg-active)', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Overview' && (
            <div className="modular-grid">
              {/* Skill Radar */}
              <Card className="span-5 p-5">
                <SectionHeader title="Skill Profile" subtitle="Top competency distribution" />
                <Chart option={radarOption} height={280} />
              </Card>

              {/* Quick Info */}
              <Card className="span-7 p-5">
                <SectionHeader title="Profile Summary" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Department', value: employee.department?.name || 'Engineering', icon: Building2 },
                    { label: 'Job Title', value: employee.job_title, icon: Briefcase },
                    { label: 'Manager', value: employee.manager_name || 'N/A', icon: Shield },
                    { label: 'Employee Code', value: employee.employee_code, icon: Target },
                    { label: 'Hire Date', value: formatDate(employee.hire_date), icon: Calendar },
                    { label: 'Readiness Score', value: `${employee.readiness_score}%`, icon: TrendingUp },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                      <div>
                        <p className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'Skills' && (
            <Card className="p-5">
              <SectionHeader title="Skills & Competencies" subtitle={`${employee.skills?.length ?? 0} skills tracked`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {employee.skills?.map((skillItem: EmployeeSkill, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'var(--bg-hover)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-bg)' }}>
                        <BookOpen className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{skillItem.skill?.name || 'Competency'}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{skillItem.skill?.category || 'General'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill primary"
                            style={{ width: `${skillItem.proficiency_level ?? 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[13px] font-bold w-8 text-right" style={{ color: 'var(--text-primary)' }}>
                        {skillItem.proficiency_level ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'Certifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employee.certifications && employee.certifications.length > 0 ? (
                employee.certifications.map((cert: Certification, i: number) => (
                  <Card key={i} interactive className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-warning-bg)' }}>
                        <Award className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{cert.name}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cert.issuer}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(cert.earned_date)}
                          </span>
                          {cert.expiry_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires {formatDate(cert.expiry_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center col-span-full">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>No certifications recorded</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>Certifications will appear here once added.</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'Career' && (
            <div className="modular-grid">
              <Card className="span-6 p-5">
                <SectionHeader title="Career Timeline" subtitle="Key milestones and progression" />
                <div className="mt-4 relative pl-8 space-y-4">
                  <div className="absolute left-3 top-2 bottom-2 w-px" style={{ background: 'var(--border-primary)' }} />
                  {[
                    { title: `${employee.job_title} (${employee.job_level})`, date: 'Present', desc: `${employee.department?.name || 'Engineering'} department` },
                    { title: 'Skill Evaluation', date: `Score: ${employee.readiness_score ?? 0}%`, desc: 'Latest readiness assessment' },
                    { title: 'Joined Organization', date: formatDate(employee.hire_date), desc: `${employee.experience_years ?? 0} years of industry experience` },
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full" style={{ background: i === 0 ? 'var(--color-primary)' : 'var(--border-secondary)', border: '3px solid var(--bg-card)' }} />
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-[12px] font-medium" style={{ color: 'var(--color-primary)' }}>{item.date}</p>
                      <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Suspense fallback={<div className="span-6 h-64 bg-card rounded animate-pulse" />}>
                <div className="span-6">
                  <LineChart title="Employee Growth Timeline" endpoint={`/analytics/employee-growth/${employee.id}`} />
                </div>
              </Suspense>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
