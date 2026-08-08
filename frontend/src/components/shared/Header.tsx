/**
 * Header Component — Onyx Edition
 * ================================
 * Ultra-modern header with sharp edges, monochromatic scheme, and crisp typography.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Search, Bell, Sun, Moon, LogOut, User,
  ChevronDown, Settings, ShieldAlert, BookOpen,
  AlertTriangle, Target, Sparkles, Menu, Clock3
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';
import CommandPalette from './CommandPalette';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onOpenMobileNav: () => void;
}

/** Derive breadcrumb from pathname */
function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    dashboard: 'Overview',
    employees: 'Workforce',
    skills: 'Competencies',
    repository: 'Library',
    forecast: 'Forecasting',
    'skill-gaps': 'Analysis',
    learning: 'Pathways',
    readiness: 'Metrics',
    promotion: 'Advancement',
    attrition: 'Retention',
    roi: 'ROI Models',
    reports: 'Intelligence',
    settings: 'Preferences',
  };

  return segments.map((seg, i) => ({
    label: labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    path: '/' + segments.slice(0, i + 1).join('/'),
  }));
}

export default function Header({ sidebarCollapsed, onOpenMobileNav }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const sidebarWidth = sidebarCollapsed ? 80 : 280;
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <header
        className="app-header fixed top-0 right-0 z-30 flex items-center justify-between px-8 glass"
        style={{
          height: 'var(--header-height)',
          left: `${sidebarWidth}px`,
          transition: 'left var(--transition-normal)',
        }}
      >
        {/* Left: Breadcrumb + Search */}
        <div className="flex items-center gap-6 flex-1">
          <button className="md:hidden p-2 -ml-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]" onClick={onOpenMobileNav} aria-label="Open navigation">
            <Menu className="w-5 h-5" />
          </button>
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 shrink-0 font-outfit" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-2">
                {i > 0 && <span className="text-[var(--text-tertiary)]">/</span>}
                <span
                  className="font-medium text-[13px] tracking-wide uppercase"
                  style={{
                    color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>

          <div className="hidden md:block w-px h-5 bg-[var(--border-primary)]" />

          {/* Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="header-search flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-left bg-[var(--bg-input)] border border-[var(--border-primary)] hover:border-[var(--text-tertiary)] w-[260px]"
          >
            <Search className="w-4 h-4 shrink-0 text-[var(--text-tertiary)]" />
            <span className="flex-1 text-[13px] font-medium text-[var(--text-tertiary)] font-outfit">
              Search workspace...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono border border-[var(--border-secondary)] bg-[var(--bg-card)] text-[var(--text-muted)]">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[var(--text-secondary)] bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
            <Clock3 className="w-3.5 h-3.5 text-[var(--color-primary-light)]" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {/* AI Assistant Button */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md transition-all text-[12px] font-semibold font-outfit uppercase tracking-widest bg-[var(--bg-hover)] text-[var(--color-primary)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]">
            <Sparkles className="w-3.5 h-3.5" />
            Copilot
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] border-2 border-[var(--bg-header)]" />
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-[380px] rounded-lg overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-secondary)] shadow-[var(--shadow-xl)]"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
                    <h3 className="text-[12px] font-semibold uppercase tracking-widest font-outfit text-[var(--text-primary)]">
                      Inbox
                    </h3>
                    <button className="text-[11px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {[
                      { icon: ShieldAlert, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', title: 'Alert: Attrition Metrics', msg: 'Engineering department shows elevated risk (68%).', time: '10m ago' },
                      { icon: Target, color: 'var(--color-primary)', bg: 'var(--color-primary-bg)', title: 'Promotion Eligibility', msg: '3 candidates identified for Senior Data Scientist.', time: '1h ago' },
                      { icon: BookOpen, color: 'var(--color-success)', bg: 'var(--color-success-bg)', title: 'Certification Expiry', msg: 'AWS Solutions Architect expires in 30 days.', time: '5h ago' },
                      { icon: AlertTriangle, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', title: 'Skill Gap Detected', msg: 'Critical gap in Cloud Architecture (React team).', time: '1d ago' },
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                      >
                        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border border-[var(--border-primary)]" style={{ background: n.bg }}>
                          <n.icon className="w-4 h-4" style={{ color: n.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]">{n.title}</p>
                          <p className="text-[13px] mt-1 line-clamp-2 text-[var(--text-secondary)]">{n.msg}</p>
                          <p className="text-[11px] mt-2 font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-[var(--border-primary)] bg-[var(--bg-surface)]">
                    <button className="text-[12px] font-semibold uppercase tracking-wider transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-outfit">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          <div className="w-px h-6 mx-2 bg-[var(--border-primary)]" />

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-primary)] text-[12px] font-bold font-outfit">
                  {user ? getInitials(user.first_name, user.last_name) : 'AD'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-[260px] rounded-lg overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-secondary)] shadow-[var(--shadow-xl)]"
                >
                  <div className="px-5 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
                    <p className="text-[15px] font-semibold truncate text-[var(--text-primary)]">
                      {user ? `${user.first_name} ${user.last_name}` : 'Administrator'}
                    </p>
                    <p className="text-[13px] truncate text-[var(--text-secondary)] mt-0.5">
                      {user?.email || 'admin@acme.global'}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-md transition-colors text-[var(--text-primary)] hover:bg-[var(--bg-hover)]">
                      <User className="w-4 h-4 text-[var(--text-secondary)]" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-md transition-colors text-[var(--text-primary)] hover:bg-[var(--bg-hover)]">
                      <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
                      Preferences
                    </button>
                  </div>
                  <div className="p-2 border-t border-[var(--border-primary)]">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-md transition-colors text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <CommandPalette
        isOpen={showCommandPalette}
        onOpen={() => setShowCommandPalette(true)}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
}
