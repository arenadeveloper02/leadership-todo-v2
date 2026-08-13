"use client"

import { useState } from 'react';
import type { TodoTask } from '@/lib/types';
import { URGENCY_COLORS, URGENCY_LABELS, dueLabel, formatDate, getUrgency, initials } from '@/lib/todo';

interface TaskSheetProps {
  task: TodoTask;
  onClose: () => void;
  onToggleDone: (task: TodoTask) => Promise<void>;
  onSave: (task: TodoTask, comment: string, dueDate: string) => Promise<void>;
  onDelete: (task: TodoTask) => Promise<void>;
}

export default function TaskSheet({ task, onClose, onToggleDone, onSave, onDelete }: TaskSheetProps) {
  const initialDue = task.dueDate ? task.dueDate.slice(0, 10) : '';
  const [comment, setComment] = useState(task.comment);
  const [dueDate, setDueDate] = useState(initialDue);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const urgency = getUrgency(task);
  const color = URGENCY_COLORS[urgency];
  const dirty = comment !== task.comment || dueDate !== initialDue;

  const handleSave = async () => {
    setBusy(true);
    await onSave(task, comment, dueDate);
    setBusy(false);
  };

  const handleToggle = async () => {
    setBusy(true);
    await onToggleDone(task);
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    await onDelete(task);
    setBusy(false);
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="sheet-handle" />

        <div className="sheet-header">
          <span className="avatar" style={{ backgroundColor: color }}>
            {initials(task.owner)}
          </span>
          <div>
            <h2 className="sheet-title">{task.task || 'Untitled task'}</h2>
            <p className="sheet-sub">
              {URGENCY_LABELS[urgency]}
              {!task.done ? ` · ${dueLabel(task)}` : ''}
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">Owner</span>
            <span className="detail-value">{task.owner || 'Unassigned'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Due date</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="detail-row">
            <span className="detail-label">Entry date</span>
            <span className="detail-value">{task.entryDate ? formatDate(task.entryDate) : '—'}</span>
          </div>
          {task.done && (
            <div className="detail-row">
              <span className="detail-label">Completed</span>
              <span className="detail-value">{task.completedDate ? formatDate(task.completedDate) : '—'}</span>
            </div>
          )}
        </div>

        <textarea
          className="comment-box"
          placeholder="Add a comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {dirty && (
          <button type="button" className="btn btn-tinted" onClick={handleSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        )}

        <button
          type="button"
          className={`btn ${task.done ? 'btn-primary' : 'btn-green'}`}
          onClick={handleToggle}
          disabled={busy}
        >
          {task.done ? 'Reopen Task' : 'Mark Complete'}
        </button>

        <button
          type="button"
          className={`btn btn-destructive ${confirmDelete ? 'confirm' : ''}`}
          onClick={handleDelete}
          disabled={busy}
        >
          {confirmDelete ? 'Confirm Delete' : 'Delete Task'}
        </button>
      </div>
    </>
  );
}
