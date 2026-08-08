/**
 * Auth Layout
 * ===========
 * Full-screen layout for login, register, forgot-password.
 * Split-screen: left side has a branded gradient panel, right side has the form.
 */

import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogoMark, LogoText } from '../components/brand/Logo';
import { Brain, LineChart, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: Brain, label: 'AI-Powered Predictions', desc: 'ML models for workforce forecasting' },
  { icon: LineChart, label: 'Skill Intelligence', desc: 'Real-time capability analytics' },
  { icon: Users, label: 'Talent Optimization', desc: 'Data-driven upskilling decisions' },
  { icon: TrendingUp, label: 'Future Readiness', desc: 'Predictive promotion scoring' },
];

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-app)' }}>
      {/* Left Panel — Branded Gradient */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10"
        style={{
          background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 30%, #4338CA 60%, #4F46E5 100%)',
        }}
      >
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 30% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)' }} />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute w-48 h-48 rounded-3xl"
          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', top: '10%', right: '15%', rotate: '12deg' }}
          animate={{ y: [0, -15, 0], rotate: [12, 15, 12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', bottom: '20%', left: '10%', rotate: '-8deg' }}
          animate={{ y: [0, 12, 0], rotate: [-8, -12, -8] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-20 h-20 rounded-xl"
          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.07)', top: '45%', left: '35%', rotate: '20deg' }}
          animate={{ y: [0, -10, 0], rotate: [20, 25, 20] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <LogoMark size={36} gradientId="logo-gradient-auth" />
            <LogoText tagline="Intelligence Platform" className="[&_p]:text-white [&_p:last-child]:text-indigo-200" />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-4 leading-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Transform Your Workforce with AI-Powered Intelligence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-indigo-200/80 text-[15px] leading-relaxed mb-8"
          >
            Predict skill demands, identify talent gaps, optimize promotions, and future-proof
            your organization with enterprise ML-driven analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{f.label}</p>
                  <p className="text-[11px] text-indigo-200/70">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative z-10 flex gap-8"
        >
          {[
            { value: '99.2%', label: 'Model Accuracy' },
            { value: '50K+', label: 'Skills Tracked' },
            { value: '15+', label: 'ML Engines' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[12px] text-indigo-200/60">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
