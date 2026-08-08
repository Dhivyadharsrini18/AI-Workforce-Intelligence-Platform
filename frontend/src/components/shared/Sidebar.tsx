/**
 * Sidebar — Premium Enterprise Navigation (Onyx Edition)
 * =======================================================
 * Sleek, ultra-modern sidebar with sharp edges and subtle emerald accents.
 */

import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Brain, BookOpen,
  LineChart, Target, GraduationCap, ShieldCheck,
  ArrowUpCircle, AlertTriangle, Lightbulb,
  FileBarChart, Settings, ChevronLeft, ChevronRight,
  Building2, LogOut, Plus, Sparkles, HardDrive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';
import Logo from '../brand/Logo';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Employees', path: '/employees', icon: Users },
      { name: 'Skills', path: '/skills', icon: Brain },
      { name: 'Skills Repository', path: '/skills/repository', icon: BookOpen },
    ],
  },
  {
    label: 'AI Engines',
    items: [
      { name: 'Skill Forecast', path: '/forecast', icon: LineChart },
      { name: 'Gap Analysis', path: '/skill-gaps', icon: Target },
      { name: 'Learning Paths', path: '/learning', icon: GraduationCap },
      { name: 'Readiness', path: '/readiness', icon: ShieldCheck },
    ],
  },
  {
    label: 'Predictions',
    items: [
      { name: 'Promotion AI', path: '/promotion', icon: ArrowUpCircle },
      { name: 'Attrition Risk', path: '/attrition', icon: AlertTriangle },
      { name: 'Hire vs Upskill', path: '/roi', icon: Lightbulb },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Reports', path: '/reports', icon: FileBarChart },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={`app-sidebar fixed left-0 top-0 h-screen flex flex-col ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
      style={{
        zIndex: 40,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-primary)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div
        className="flex items-center justify-center gap-3 shrink-0 relative"
        style={{ height: 70, borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Logo variant={collapsed ? 'symbol' : 'full'} size={34} tagline="Workforce intelligence" />
        </div>
      </div>

      {/* Organization Header */}
      {!collapsed && (
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold truncate text-white">Acme Global</p>
              <p className="text-[11px] text-[var(--color-primary)] font-medium">Enterprise License</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="btn-ghost justify-start !px-2.5 !py-2 text-[11px]" aria-label="Create a new workspace item">
              <Plus className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Quick create
            </button>
            <button className="btn-ghost justify-start !px-2.5 !py-2 text-[11px]" aria-label="Open AI assistant">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Ask Divi
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {/* Section Label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 font-outfit text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Items */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));

                return (
                  <li key={item.path} className="relative">
                    <NavLink to={item.path} className="block group" aria-label={item.name}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all relative ${
                          collapsed ? 'justify-center' : ''
                        }`}
                        style={{
                          background: isActive ? 'var(--bg-active)' : 'transparent',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }
                        }}
                      >
                        <item.icon 
                          className="w-4 h-4 shrink-0 transition-colors" 
                          style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} 
                        />

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </NavLink>

                    {/* Tooltip on collapsed state */}
                    {collapsed && (
                      <div className="tooltip">
                        <div className="tooltip-content" style={{ left: '100%', bottom: 'auto', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' }}>
                          {item.name}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Collapse Toggle */}
      <div className="shrink-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
        {!collapsed && (
          <div className="mx-4 mt-3 rounded-xl p-3 bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-2">
              <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> Workspace usage</span>
              <span>62%</span>
            </div>
            <div className="progress-bar"><div className="progress-bar-fill" style={{ width: '62%' }} /></div>
          </div>
        )}
        {/* User Profile */}
        {!collapsed && user && (
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 border border-[var(--border-secondary)] bg-[var(--bg-elevated)]">
              <span className="text-white text-[12px] font-bold font-outfit">
                {getInitials(user.first_name, user.last_name)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold truncate text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[11px] truncate text-[var(--text-tertiary)]">
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-md transition-colors shrink-0 text-[var(--text-tertiary)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)]"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="px-4 py-3" style={{ borderTop: user && !collapsed ? '1px solid var(--border-primary)' : 'none' }}>
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-colors text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[13px] font-medium font-outfit">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
