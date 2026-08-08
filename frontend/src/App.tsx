/**
 * App Entry Point
 * ===============
 * Root component with routing, providers, and layout configuration.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Card, SectionHeader, Badge } from './components/ui/Base';
import { FileBarChart, Settings, Sliders, ShieldCheck, Download, Bell, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import SkillForecastPage from './pages/SkillForecastPage';
import SkillGapPage from './pages/SkillGapPage';
import LearningPage from './pages/LearningPage';
import ReadinessPage from './pages/ReadinessPage';
import SkillIntelligencePage from './pages/SkillIntelligencePage';
import SkillsRepositoryPage from './pages/SkillsRepositoryPage';

// Phase B1 Predictive Pages
import PromotionAnalyticsPage from './pages/PromotionAnalyticsPage';
import AttritionAnalyticsPage from './pages/AttritionAnalyticsPage';
import ROIAnalyticsPage from './pages/ROIAnalyticsPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Employees */}
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                
                {/* Skills & Intelligence */}
                <Route path="/skills" element={<SkillIntelligencePage />} />
                <Route path="/skills/repository" element={<SkillsRepositoryPage />} />
                
                {/* AI Engines */}
                <Route path="/forecast" element={<SkillForecastPage />} />
                <Route path="/skill-gaps" element={<SkillGapPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="/readiness" element={<ReadinessPage />} />
            
                {/* Predictive Analytics */}
                <Route path="/promotion" element={<PromotionAnalyticsPage />} />
                <Route path="/attrition" element={<AttritionAnalyticsPage />} />
                <Route path="/roi" element={<ROIAnalyticsPage />} />
                
                {/* System Pages */}
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/** Reports Module Shell */
function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Enterprise Reports</h1>
          <p>Exportable executive summaries and compliance analytics</p>
        </div>
        <button className="btn-primary">
          <Download className="w-4 h-4" />
          Export All (PDF)
        </button>
      </div>

      <div className="bento-grid">
        {[
          { title: 'Workforce Capability Summary', desc: 'Quarterly breakdown of organizational skill density and gap trajectories.', tag: 'Executive' },
          { title: 'AI Promotion Audit Report', desc: 'Detailed SHAP explainability audit log for model-recommended promotions.', tag: 'Compliance' },
          { title: 'Attrition Risk & Retention Forecast', desc: 'Departmental turnover probability models and cost estimation.', tag: 'HR Analytics' },
          { title: 'Upskill vs External Hiring ROI', desc: 'Financial cost-benefit analysis of internal mobility programs.', tag: 'Financial' },
        ].map((report, i) => (
          <Card key={i} interactive className="span-6 p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-bg)' }}>
                <FileBarChart className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <Badge variant="primary">{report.tag}</Badge>
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{report.title}</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{report.desc}</p>
            <button className="btn-secondary btn-sm w-full">Generate Report</button>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

/** Settings Module Shell */
function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="page-header">
        <h1>Platform Settings</h1>
        <p>Configure model parameters, integrations, and workspace preferences</p>
      </div>

      <div className="bento-grid">
        <Card className="span-4 p-5">
          <SectionHeader title="System Navigation" />
          <div className="space-y-1">
            {[
              { label: 'General Preferences', icon: Settings, active: true },
              { label: 'AI Model Thresholds', icon: Sliders, active: false },
              { label: 'Security & SSO', icon: Lock, active: false },
              { label: 'Notification Rules', icon: Bell, active: false },
              { label: 'Compliance Audit Log', icon: ShieldCheck, active: false },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: item.active ? 'var(--bg-active)' : 'transparent',
                  color: item.active ? 'var(--color-primary-light)' : 'var(--text-secondary)'
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="span-8 p-6 space-y-6">
          <SectionHeader title="General Preferences" subtitle="Organization level parameters" />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Organization Name
              </label>
              <input type="text" defaultValue="Acme Corporation" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Primary Analytics Region
              </label>
              <select className="select-field">
                <option>US-East (North Virginia)</option>
                <option>EU-Central (Frankfurt)</option>
                <option>AP-South (Mumbai)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Model Refetch Interval
              </label>
              <select className="select-field">
                <option>Realtime (WebSocket Live Stream)</option>
                <option>Hourly Batch Updates</option>
                <option>Daily Nightly Processing</option>
              </select>
            </div>
            <div className="pt-2">
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

export default App;
