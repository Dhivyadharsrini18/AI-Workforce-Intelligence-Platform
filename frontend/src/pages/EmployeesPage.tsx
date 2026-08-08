/**
 * Employees Page
 * ==============
 * Enterprise directory with token-based styling.
 */

import React, { useState, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, Upload } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../types/employee';

// Import Components
import EmployeeAnalytics from '../components/employees/EmployeeAnalytics';
import EmployeeFilters from '../components/employees/EmployeeFilters';
import BulkActions from '../components/employees/BulkActions';
import EmployeeAvatar from '../components/employees/EmployeeAvatar';
import EmployeeDrawer from '../components/employees/EmployeeDrawer';
import ImportEmployees from '../components/employees/ImportEmployees';
import ExportEmployees from '../components/employees/ExportEmployees';
import DeleteEmployeeDialog from '../components/employees/DeleteEmployeeDialog';
import { SkeletonTable } from '../components/shared/SkeletonLoader';
import EmptyState from '../components/shared/EmptyState';
import { Card, Badge } from '../components/ui/Base';
import { staggerContainer, staggerItem } from '../design-system';

// Lazy loaded charts
const PieChart = React.lazy(() => import('../components/charts/PieChart'));
const DonutChart = React.lazy(() => import('../components/charts/DonutChart'));
const MixedChart = React.lazy(() => import('../components/charts/MixedChart'));
const BoxPlot = React.lazy(() => import('../components/charts/BoxPlot'));
const TreemapChart = React.lazy(() => import('../components/charts/TreemapChart'));
const ScatterChart = React.lazy(() => import('../components/charts/ScatterChart'));
const HeatmapChart = React.lazy(() => import('../components/charts/HeatmapChart'));

export default function EmployeesPage() {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ department: '', role: '', status: '' });
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal States
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean; count: number; onConfirm: () => void}>({ isOpen: false, count: 0, onConfirm: () => {} });

  // Queries
  const { data: depts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => employeeService.getDepartments(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['employees', searchTerm, filters],
    queryFn: () => employeeService.getEmployees({ search: searchTerm }),
  });

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(emp => {
      if (filters.department && emp.department_id !== filters.department) return false;
      if (filters.status && emp.status !== filters.status) return false;
      return true;
    });
  }, [data, filters]);

  const toggleSelectAll = () => {
    if (selectedEmployees.size === filteredItems.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredItems.map(e => e.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedEmployees);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEmployees(newSet);
  };

  const metrics = useMemo(() => {
    if (!data?.items) return { total: 0, active: 0, avgReadiness: 0, highRisk: 0 };
    const items = data.items;
    const active = items.filter(e => e.status === 'active').length;
    const avgReadiness = items.reduce((acc, e) => acc + e.readiness_score, 0) / (items.length || 1);
    const highRisk = items.filter(e => e.attrition_risk > 0.3).length;
    return { total: items.length, active, avgReadiness, highRisk };
  }, [data]);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      <motion.div variants={staggerItem} className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-primary)] pb-6 mb-6">
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-[var(--text-primary)]">Employee Directory</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your workforce, view profiles, and analyze skills.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="btn-secondary" onClick={() => setIsExportOpen(true)}>
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary" onClick={() => setIsDrawerOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </motion.div>

      <EmployeeAnalytics {...metrics} />

      {/* Advanced Enterprise Analytics - Row 1 */}
      <motion.div variants={staggerItem} className="modular-grid">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <PieChart title="Department Distribution Pie" endpoint="/analytics/department-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <DonutChart title="Gender Diversity" endpoint="/analytics/gender-diversity" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <MixedChart title="Employee Age Distribution" endpoint="/analytics/age-distribution" />
          </div>
        </Suspense>
      </motion.div>

      {/* Advanced Enterprise Analytics - Row 2 */}
      <motion.div variants={staggerItem} className="modular-grid">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <MixedChart title="Experience Distribution" endpoint="/analytics/experience-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <BoxPlot title="Salary Distribution" endpoint="/analytics/salary-distribution" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <TreemapChart title="Employee Location Chart" endpoint="/analytics/employee-location" />
          </div>
        </Suspense>
      </motion.div>

      {/* Advanced Enterprise Analytics - Row 3 */}
      <motion.div variants={staggerItem} className="modular-grid mb-6">
        <Suspense fallback={<div className="span-4 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-4">
            <HeatmapChart title="Attrition by Department" endpoint="/analytics/attrition-by-department" />
          </div>
        </Suspense>
        <Suspense fallback={<div className="span-8 h-64 bg-card rounded animate-pulse" />}>
          <div className="span-8">
            <ScatterChart title="Performance Scatter Plot" endpoint="/analytics/performance-scatter" />
          </div>
        </Suspense>
      </motion.div>


      <motion.div variants={staggerItem}>
        <Card padding="none" className="overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-surface)] flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search by name, role, or email..."
                className="input-field pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className={`btn-secondary sm:w-auto w-full ${filtersOpen ? 'bg-[var(--bg-active)] border-[var(--border-secondary)]' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.department || filters.status) && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              )}
            </button>
          </div>

          <EmployeeFilters 
            isOpen={filtersOpen}
            departments={depts || []}
            filters={filters}
            onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
            onClear={() => setFilters({ department: '', role: '', status: '' })}
            onClose={() => setFiltersOpen(false)}
          />

          {/* Table */}
          <div className="table-container border-0 border-radius-0 rounded-none">
            {isLoading ? (
              <div className="p-4"><SkeletonTable rows={5} /></div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12">
                <EmptyState 
                  icon={<Search className="w-8 h-8 text-[var(--text-muted)]" />}
                  title="No employees found"
                  description="No employees match your current search or filter criteria."
                  action={
                    <button className="btn-secondary" onClick={() => { setSearchTerm(''); setFilters({department: '', role: '', status: ''})}}>
                      Clear Filters
                    </button>
                  }
                />
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] backdrop-blur-md bg-opacity-90">
                  <tr>
                    <th className="w-12 text-center pl-6">
                      <input 
                        type="checkbox" 
                        className="checkbox"
                        checked={selectedEmployees.size === filteredItems.length && filteredItems.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th className="text-center">Readiness</th>
                    <th className="text-center">Status</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((emp: Employee) => (
                    <tr
                      key={emp.id}
                      className={`group ${selectedEmployees.has(emp.id) ? 'bg-[var(--bg-active)]' : ''}`}
                    >
                      <td className="w-12 text-center pl-6">
                        <input 
                          type="checkbox" 
                          className="checkbox"
                          checked={selectedEmployees.has(emp.id)}
                          onChange={() => toggleSelect(emp.id)}
                        />
                      </td>
                      <td className="cursor-pointer py-4" onClick={() => navigate(`/employees/${emp.id}`)}>
                        <div className="flex items-center gap-3">
                          <EmployeeAvatar firstName={emp.first_name} lastName={emp.last_name} size="md" />
                          <div>
                            <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                              {emp.first_name} {emp.last_name}
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="neutral">{emp.department?.name || 'Unknown'}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                            <div 
                              className={`h-full ${emp.readiness_score >= 80 ? 'bg-[var(--color-success)]' : emp.readiness_score >= 60 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-danger)]'}`}
                              style={{ width: `${emp.readiness_score}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-[var(--text-secondary)] w-8">{emp.readiness_score}%</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge variant={emp.status === 'active' ? 'success' : 'danger'}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${emp.status === 'active' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'}`} />
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--color-primary)] transition-colors rounded hover:bg-[var(--bg-hover)]" title="View Profile" onClick={() => navigate(`/employees/${emp.id}`)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--color-primary)] transition-colors rounded hover:bg-[var(--bg-hover)]" title="Edit" onClick={(e) => { e.stopPropagation(); /* TODO: Edit */ }}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--color-danger)] transition-colors rounded hover:bg-[var(--color-danger-bg)]" 
                            title="Delete" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                isOpen: true,
                                count: 1,
                                onConfirm: () => { console.log('Delete single', emp.id); setDeleteDialog(prev => ({...prev, isOpen: false}))}
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div className="text-[12px] text-[var(--text-secondary)]">
              Showing <span className="font-semibold text-[var(--text-primary)]">{filteredItems.length > 0 ? 1 : 0}</span> to <span className="font-semibold text-[var(--text-primary)]">{filteredItems.length}</span> of <span className="font-semibold text-[var(--text-primary)]">{data?.total || 0}</span> results
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary btn-sm disabled:opacity-50">Previous</button>
              <button className="btn-secondary btn-sm">Next</button>
            </div>
          </div>
        </Card>
      </motion.div>

      <BulkActions 
        selectedCount={selectedEmployees.size} 
        onClear={() => setSelectedEmployees(new Set())}
        onDelete={() => {
          setDeleteDialog({
            isOpen: true,
            count: selectedEmployees.size,
            onConfirm: () => { console.log('Delete bulk', selectedEmployees); setDeleteDialog(prev => ({...prev, isOpen: false}))}
          });
        }}
      />

      {/* Drawers & Modals */}
      <EmployeeDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <ImportEmployees 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(file) => console.log('Importing', file)}
      />

      <ExportEmployees 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={(format) => console.log('Exporting as', format)}
        selectedCount={selectedEmployees.size}
      />

      <DeleteEmployeeDialog 
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={deleteDialog.onConfirm}
        count={deleteDialog.count}
      />
    </motion.div>
  );
}
