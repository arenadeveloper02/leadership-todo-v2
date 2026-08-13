"use client"

import { useMemo, useState } from 'react';
import type { TodoTask } from '@/lib/types';
import TaskRow from '@/components/TaskRow';

interface TaskListProps {
  tasks: TodoTask[];
  loading: boolean;
  error: string | null;
  onSelect: (task: TodoTask) => void;
}

function SkeletonRows() {
  return (
    <div className="list-card">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '65%', height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '40%', height: 10 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TaskList({ tasks, loading, error, onSelect }: TaskListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) => t.task.toLowerCase().includes(q) || t.owner.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  return (
    <div>
      <div className="search-box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <line x1="11" y1="11" x2="14.5" y2="14.5" />
        </svg>
        <input
          type="search"
          placeholder="Search tasks or owners"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>{query ? 'No matches' : 'All caught up'}</h3>
          <p>{query ? 'Try a different search.' : 'No open tasks. Add one from the Add tab.'}</p>
        </div>
      ) : (
        <div className="list-card">
          {filtered.map((task) => (
            <TaskRow key={task.id || task.task} task={task} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
