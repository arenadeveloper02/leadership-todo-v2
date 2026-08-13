"use client"

import type { TodoTask } from '@/lib/types';
import TaskRow from '@/components/TaskRow';

interface DoneListProps {
  tasks: TodoTask[];
  loading: boolean;
  onSelect: (task: TodoTask) => void;
  onReopen: (task: TodoTask) => void;
}

export default function DoneList({ tasks, loading, onSelect, onReopen }: DoneListProps) {
  if (loading) {
    return (
      <div className="list-card">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '35%', height: 10 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎯</div>
        <h3>Nothing completed yet</h3>
        <p>Completed tasks will show up here with their completion date.</p>
      </div>
    );
  }

  return (
    <div className="list-card">
      {tasks.map((task) => (
        <TaskRow
          key={task.id || task.task}
          task={task}
          onSelect={onSelect}
          quickLabel="Reopen"
          onQuickAction={onReopen}
        />
      ))}
    </div>
  );
}
