"use client"

import { useState, type FormEvent } from 'react';
import { formatDate, todayISO } from '@/lib/todo';

interface AddTaskFormProps {
  onAdd: (task: string, owner: string, dueDate: string) => Promise<boolean>;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [task, setTask] = useState('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim() || !owner.trim()) {
      setMessage({ kind: 'error', text: 'Task and owner are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const ok = await onAdd(task.trim(), owner.trim(), dueDate);
    setSaving(false);
    if (ok) {
      setTask('');
      setOwner('');
      setDueDate('');
      setMessage({ kind: 'success', text: 'Task added.' });
    } else {
      setMessage({ kind: 'error', text: 'Could not add the task. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-card">
        <div className="form-row">
          <label htmlFor="task-text">Task</label>
          <input
            id="task-text"
            type="text"
            placeholder="What needs to get done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label htmlFor="task-owner">Owner</label>
          <input
            id="task-owner"
            type="text"
            placeholder="Who owns this?"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <p className="form-hint">Entry date is set automatically to today ({formatDate(todayISO())}).</p>

      {message && <div className={`form-message ${message.kind}`}>{message.text}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
