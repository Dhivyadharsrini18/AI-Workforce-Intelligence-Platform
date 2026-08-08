/**
 * Dashboard Layout
 * ================
 * Clean enterprise layout shell (Onyx Edition).
 */

import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import { pageVariants } from '../design-system';

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-[var(--bg-app)]" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <span className="text-sm text-[var(--text-secondary)]">Preparing your workspace</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-inter">
      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileNavOpen} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-black/50 md:hidden" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      
      <Header sidebarCollapsed={sidebarCollapsed} onOpenMobileNav={() => setMobileNavOpen(true)} />

      <main
        className="app-main min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: sidebarWidth, paddingTop: 'var(--header-height)' }}
      >
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="page-container"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
