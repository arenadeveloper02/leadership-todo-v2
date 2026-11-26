import type { TodoStats, TodoTask, Urgency } from '@/lib/types';

function pickString(data: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = data[key];
    if (typeof v === 'string' && v.length > 0) return v;
    if (typeof v === 'number') return String(v);
  }
  return '';
}

function fuzzyString(data: Record<string, unknown>, needle: string): string {
  for (const [k, v] of Object.entries(data)) {
    if (k.toLowerCase().includes(needle) && typeof v === 'string' && v.length > 0) {
      return v;
    }
  }
  return '';
}

function pickBool(data: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const v = data[key];
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === 'true' || s === 'yes' || s === '1' || s === 'checked' || s === 'done') return true;
      if (s === 'false' || s === 'no' || s === '0') return false;
    }
  }
  return false;
}

function normDate(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  return trimmed;
}

function findRows(payload: unknown, depth = 0): unknown[] | null {
  if (!payload || typeof payload !== 'object' || depth > 4) return null;
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.rows)) return obj.rows;
  for (const key of ['output', 'result', 'data', 'response']) {
    const found = findRows(obj[key], depth + 1);
    if (found) return found;
  }
  return null;
}

export function normalizeRows(payload: unknown): TodoTask[] {
  const rows = findRows(payload);
  if (!rows) return [];

  const tasks: TodoTask[] = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const idRaw = r.id ?? r.rowId ?? r.row_id;
    const id = typeof idRaw === 'string' ? idRaw : typeof idRaw === 'number' ? String(idRaw) : '';
    const data = (r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : r);

    let task = pickString(data, ['Task', 'task', 'Title', 'title']);
    if (!task) task = fuzzyString(data, 'task');
    let owner = pickString(data, ['Owner', 'owner']);
    if (!owner) owner = fuzzyString(data, 'owner');
    let entryDate = pickString(data, ['EntryDate', 'entryDate', 'entry_date']);
    if (!entryDate) entryDate = fuzzyString(data, 'entry');
    let dueDate = pickString(data, ['DueDate', 'dueDate', 'due_date']);
    if (!dueDate) dueDate = fuzzyString(data, 'due');
    let completedDate = pickString(data, ['CompletedDate', 'completedDate', 'completed_date']);
    if (!completedDate) completedDate = fuzzyString(data, 'completed');
    let comment = pickString(data, ['Comment', 'comment', 'Notes', 'notes']);
    if (!comment) comment = fuzzyString(data, 'comment');
    const done = pickBool(data, ['Done', 'done']);

    if (!id && !task) continue;
    tasks.push({
      id,
      task,
      owner,
      entryDate: normDate(entryDate),
      dueDate: normDate(dueDate),
      done,
      completedDate: normDate(completedDate),
      comment,
    });
  }
  return tasks;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysUntil(dueDate: string): number | null {
  if (!dueDate) return null;
  const iso = dueDate.slice(0, 10);
  const due = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export function getUrgency(task: TodoTask): Urgency {
  if (task.done) return 'done';
  const diff = daysUntil(task.dueDate);
  if (diff === null) return 'later';
  if (diff < 0) return 'overdue';
  if (diff <= 3) return 'soon';
  if (diff <= 7) return 'week';
  return 'later';
}

export const URGENCY_COLORS: Record<Urgency, string> = {
  overdue: 'var(--red)',
  soon: 'var(--orange)',
  week: 'var(--accent)',
  later: 'var(--green)',
  done: 'var(--green)',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  overdue: 'Overdue',
  soon: 'Due soon',
  week: 'Due this week',
  later: 'On track',
  done: 'Completed',
};

export function formatDate(value: string | Date): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return typeof value === 'string' ? value : '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function dueLabel(task: TodoTask): string {
  const diff = daysUntil(task.dueDate);
  if (diff === null) return 'No due date';
  if (diff < 0) return diff === -1 ? 'Overdue by 1 day' : `Overdue by ${Math.abs(diff)} days`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due ${formatDate(task.dueDate)}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0] ? parts[0].charAt(0) : '';
  const lastPart = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const second = lastPart ? lastPart.charAt(0) : '';
  const combined = (first + second).toUpperCase();
  return combined.length > 0 ? combined : '?';
}

export function computeStats(tasks: TodoTask[]): TodoStats {
  let open = 0;
  let completed = 0;
  let overdue = 0;
  let dueWithin7 = 0;
  for (const t of tasks) {
    if (t.done) {
      completed += 1;
      continue;
    }
    open += 1;
    const diff = daysUntil(t.dueDate);
    if (diff === null) continue;
    if (diff < 0) overdue += 1;
    else if (diff <= 7) dueWithin7 += 1;
  }
  return { total: tasks.length, open, completed, overdue, dueWithin7 };
}
