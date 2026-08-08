
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 px-4 border-b border-[var(--border-subtle)]">
      <div className="w-10 h-10 rounded-full skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton w-1/4" />
        <div className="h-3 skeleton w-1/3" />
      </div>
      <div className="h-6 skeleton rounded-full w-24" />
      <div className="h-4 skeleton w-24" />
      <div className="h-8 skeleton w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
      <div className="bg-[var(--bg-surface)] px-4 py-3 border-b border-[var(--border-primary)]">
        <div className="h-4 skeleton w-full" />
      </div>
      <div>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      <div className="card flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse mt-4" />
          </div>
          <div className="space-y-4 mt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5 animate-pulse" />
          </div>
          <div className="space-y-4 mt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse" />
          </div>
        ))}
      </div>
      
      <div className="card h-64 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse mb-4" />
      </div>
    </div>
  );
}
