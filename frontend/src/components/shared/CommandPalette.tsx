/**
 * Command Palette
 * ===============
 * Global search triggered by Cmd+K or clicking the search bar.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Users, Brain, LayoutDashboard,
  Target, TrendingUp, Settings, FileBarChart,
  ArrowRight
} from 'lucide-react';
import { scaleIn } from '../../design-system';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global hotkey cmd+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpen, onClose]);

  const results = [
    { label: 'Employees', icon: Users, path: '/employees', category: 'Pages' },
    { label: 'Skill Intelligence', icon: Brain, path: '/skills', category: 'Pages' },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', category: 'Pages' },
    { label: 'Skill Gap Analysis', icon: Target, path: '/skill-gaps', category: 'Pages' },
    { label: 'Workforce Forecast', icon: TrendingUp, path: '/forecast', category: 'Pages' },
    { label: 'Organization Settings', icon: Settings, path: '/settings', category: 'System' },
    { label: 'Reports', icon: FileBarChart, path: '/reports', category: 'System' },
  ].filter(r => r.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-[calc(100%-2rem)] max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl shadow-[var(--shadow-card-hover)] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-[var(--border-primary)]">
            <Search className="w-5 h-5 text-[var(--text-tertiary)] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees, skills, courses..."
              aria-label="Search workspace"
              className="w-full bg-transparent border-none outline-none py-4 px-3 text-[var(--text-primary)] text-[15px]"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono bg-[var(--bg-hover)] text-[var(--text-muted)]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(result.path);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[var(--bg-app)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                        <result.icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">
                          {result.label}
                        </p>
                        <p className="text-[11px] text-[var(--text-tertiary)]">
                          {result.category}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[14px] font-medium text-[var(--text-primary)]">No results found</p>
                <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                  Try searching for something else
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
