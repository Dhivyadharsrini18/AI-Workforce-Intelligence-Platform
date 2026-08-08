/**
 * Formatting Utilities
 * ====================
 */

/** Format a number with commas (e.g., 10,000) */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Format currency (e.g., $120,000) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format percentage (e.g., 72.5%) */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Format a date string to readable format */
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

/** Get initials from name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Get status color class */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950',
    inactive: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    on_leave: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    terminated: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
    completed: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950',
    in_progress: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    not_started: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    dropped: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
    pending: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    accepted: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    dismissed: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
  };
  return colors[status] || 'text-gray-500 bg-gray-100';
}

/** Get priority color class */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    medium: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    high: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    critical: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
  };
  return colors[priority] || 'text-gray-500 bg-gray-100';
}

/** Get risk level label & color */
export function getRiskLevel(risk: number): { label: string; color: string } {
  if (risk >= 0.7) return { label: 'Critical', color: 'text-red-600' };
  if (risk >= 0.4) return { label: 'High', color: 'text-amber-600' };
  if (risk >= 0.2) return { label: 'Medium', color: 'text-yellow-600' };
  return { label: 'Low', color: 'text-emerald-600' };
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '…';
}
