/**
 * Skills Repository Page
 * =======================
 * Organizational taxonomy of skills and competencies.
 * Styled using CSS variables and design tokens for clean dark/light mode support.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { skillService } from '../services/skillService';
import { Search, Plus, MoreVertical, BookOpen, Layers, TrendingUp, AlertTriangle, Sparkles, X } from 'lucide-react';
import type { Skill } from '../types/employee';
import { staggerContainer, staggerItem } from '../design-system';
import { Badge, Card } from '../components/ui/Base';

// Lazy loaded charts
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const NetworkGraph = React.lazy(() => import('../components/charts/NetworkGraph'));
const TreeChart = React.lazy(() => import('../components/charts/TreeChart'));
const BarChart = React.lazy(() => import('../components/charts/MixedChart'));
const LineChart = React.lazy(() => import('../components/charts/LineChart'));

export default function SkillsRepositoryPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'technical',
    subcategory: '',
    description: '',
    current_demand_score: 50,
    is_emerging: false,
    is_critical: false
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await skillService.getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const addedSkill = await skillService.createSkill(newSkill);
      setSkills(prev => [addedSkill, ...prev]);
      setIsModalOpen(false);
      setNewSkill({
        name: '',
        category: 'technical',
        subcategory: '',
        description: '',
        current_demand_score: 50,
        is_emerging: false,
        is_critical: false
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add skill. Please ensure the name is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await skillService.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      setActiveMenuId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill. It might be used in other records.");
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const emergingCount = skills.filter((skill) => skill.is_emerging).length;
  const criticalCount = skills.filter((skill) => skill.is_critical).length;
  const averageDemand = skills.length ? Math.round(skills.reduce((total, skill) => total + (skill.current_demand_score || 0), 0) / skills.length) : 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Skills Repository</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage the organizational taxonomy of skills and competencies</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        {[
          { label: 'Capability library', value: skills.length, detail: 'skills in the organization', icon: Layers, tone: 'var(--color-primary)' },
          { label: 'Emerging signals', value: emergingCount, detail: 'skills gaining momentum', icon: TrendingUp, tone: 'var(--color-success)' },
          { label: 'Critical capabilities', value: criticalCount, detail: 'require active coverage', icon: AlertTriangle, tone: 'var(--color-danger)' },
          { label: 'Average demand', value: `${averageDemand}%`, detail: 'across tracked technology', icon: Sparkles, tone: 'var(--color-accent)' },
        ].map((metric) => (
          <Card key={metric.label} interactive className="span-3 metric-card">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-tertiary)]">{metric.label}</p>
                <p className="text-3xl font-bold mt-2 text-[var(--text-primary)]">{metric.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-hover)]" style={{ color: metric.tone }}><metric.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{metric.detail}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid">
        <div className="table-container span-12 min-h-[460px] flex flex-col">
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-surface)] gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input 
                type="text"
                placeholder="Search skills or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[var(--text-tertiary)]">
              <Layers className="w-4 h-4" />
              <span>Total Skills: <strong className="text-[var(--text-primary)]">{filteredSkills.length}</strong></span>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
              <div className="spinner mx-auto" style={{ width: 28, height: 28 }} />
              <p className="text-xs mt-3 text-[var(--text-tertiary)]">Loading taxonomy...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] backdrop-blur-md bg-opacity-90">
                  <tr>
                    <th className="pl-6">Skill Name</th>
                    <th>Category</th>
                    <th>Demand Score</th>
                    <th>Status Tag</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredSkills.map((skill) => (
                  <tr key={skill.id}>
                    <td className="font-semibold pl-6 text-[var(--text-primary)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border border-[var(--border-subtle)] bg-[var(--color-primary-bg)]">
                          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                        </div>
                        <span>{skill.name}</span>
                      </div>
                    </td>
                    <td className="capitalize text-[var(--text-secondary)]">
                      {skill.category}
                      {skill.subcategory && <span className="text-[11px] ml-1.5 opacity-60">({skill.subcategory})</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                          <div 
                            className="h-full bg-[var(--color-primary)]"
                            style={{ width: `${skill.current_demand_score}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[var(--text-primary)]">
                          {Math.round(skill.current_demand_score || 0)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {skill.is_critical && <Badge variant="danger">Critical</Badge>}
                        {skill.is_emerging && <Badge variant="primary">Emerging</Badge>}
                        {!skill.is_critical && !skill.is_emerging && <Badge variant="neutral">Standard</Badge>}
                      </div>
                    </td>
                    <td className="text-right pr-6 relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === skill.id ? null : skill.id);
                        }}
                        className="btn-ghost p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeMenuId === skill.id && (
                        <div 
                          className="absolute right-8 top-8 z-50 w-36 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-xl py-1 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                            onClick={() => {
                              alert(`View Details for ${skill.name}`);
                              setActiveMenuId(null);
                            }}
                          >
                            View Details
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                            onClick={() => {
                              alert(`Edit mode for ${skill.name} coming soon!`);
                              setActiveMenuId(null);
                            }}
                          >
                            Edit Skill
                          </button>
                          <div className="h-px bg-[var(--border-primary)] my-1" />
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-danger-hover)] bg-[var(--color-danger-bg)] text-[var(--color-danger)] transition-colors"
                            onClick={() => handleDeleteSkill(skill.id!)}
                          >
                            Delete Skill
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Advanced Enterprise Analytics */}
      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Category Distribution" endpoint="/analytics/skill-category-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Skill Popularity" endpoint="/analytics/skill-popularity" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <LineChart title="Skill Usage Trend" endpoint="/analytics/skill-usage-trend" />
          </div>
        </Suspense>
      </motion.div>

      <motion.div variants={staggerItem} className="modular-grid mt-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BarChart title="Demand Ranking" endpoint="/analytics/skill-demand-ranking" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <TreeChart title="Technology Tree" endpoint="/analytics/technology-tree" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <NetworkGraph title="Skill Relationship Graph" endpoint="/analytics/skill-relationships" />
          </div>
        </Suspense>
      </motion.div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
              <h2 className="text-xl font-bold font-outfit text-[var(--text-primary)]">Add New Skill</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSkill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Skill Name *</label>
                <input required type="text" className="input-field w-full" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} placeholder="e.g. Quantum Computing" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Category *</label>
                  <select required className="select-field w-full" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}>
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skill</option>
                    <option value="domain">Domain</option>
                    <option value="leadership">Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Subcategory</label>
                  <input type="text" className="input-field w-full" value={newSkill.subcategory} onChange={e => setNewSkill({...newSkill, subcategory: e.target.value})} placeholder="e.g. AI & ML" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Description</label>
                <textarea className="input-field w-full resize-none" rows={3} value={newSkill.description} onChange={e => setNewSkill({...newSkill, description: e.target.value})} placeholder="Brief description of the skill..." />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Initial Demand Score ({newSkill.current_demand_score})</label>
                <input type="range" min="0" max="100" className="w-full" value={newSkill.current_demand_score} onChange={e => setNewSkill({...newSkill, current_demand_score: parseInt(e.target.value)})} />
              </div>
              
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
                  <input type="checkbox" checked={newSkill.is_emerging} onChange={e => setNewSkill({...newSkill, is_emerging: e.target.checked})} className="rounded border-[var(--border-primary)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                  Mark as Emerging
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
                  <input type="checkbox" checked={newSkill.is_critical} onChange={e => setNewSkill({...newSkill, is_critical: e.target.checked})} className="rounded border-[var(--border-primary)] text-[var(--color-danger)] focus:ring-[var(--color-danger)]" />
                  Mark as Critical
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)] mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
