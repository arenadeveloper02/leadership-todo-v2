"use client"

import type { TodoTask } from '@/lib/types';
import { URGENCY_COLORS, dueLabel, formatDate, getUrgency, initials } from '@/lib/todo';

interface TaskRowProps {
  task: TodoTask;
  onSelect: (task: TodoTask) => void;
  quickLabel?: string;
  onQuickAction?: (task: TodoTask) => void;
}

export default function TaskRow({ task, onSelect, quickLabel, onQuickAction }: TaskRowProps) {
  const urgency = getUrgency(task);
  const color = URGENCY_COLORS[urgency];
  const subtitle = task.done
    ? task.completedDate
      ? `${task.owner || 'Unassigned'} · Completed ${formatDate(task.completedDate)}`
      : `${task.owner || 'Unassigned'} · Completed`
    : `${task.owner || 'Unassigned'} · ${dueLabel(task)}`;

  return (
    <div
      className="list-row"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(task);
      }}
    >
      <span className="avatar" style={{ backgroundColor: color }}>
        {initials(task.owner)}
      </span>
      <div className="row-main">
        <p className={`row-title ${task.done ? 'done' : ''}`}>{task.task || 'Untitled task'}</p>
        <p className="row-sub">{subtitle}</p>
      </div>
      {quickLabel && onQuickAction && (
        <button
          type="button"
          className="quick-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction(task);
          }}
        >
          {quickLabel}
        </button>
      )}
      <svg className="chevron" width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 2l8 8-8 8" />
      </svg>
    </div>
  );
}
