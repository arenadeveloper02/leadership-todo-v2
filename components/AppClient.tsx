"use client"

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TabId, TodoApiRequest, TodoTask } from '@/lib/types';
import { computeStats, normalizeRows, todayISO } from '@/lib/todo';
import NavHeader from '@/components/NavHeader';
import TabBar from '@/components/TabBar';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import DoneList from '@/components/DoneList';
import StatsView from '@/components/StatsView';
import TaskSheet from '@/components/TaskSheet';

async function callTodo(body: TodoApiRequest): Promise<unknown> {
  const res = await fetch('/api/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // CRUD contract: { action, rowId?, data? }. Proxy wraps as Arena { input: ... }.
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export default function AppClient() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('tasks');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const json = await callTodo({ action: 'list' });
      setTasks(normalizeRows(json));
      setError(null);
    } catch {
      setError('Could not load tasks. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTask = useCallback(
    async (taskText: string, owner: string, dueDate: string): Promise<boolean> => {
      try {
        await callTodo({
          action: 'add',
          data: { Task: taskText, Owner: owner, EntryDate: todayISO(), DueDate: dueDate },
        });
        await refresh();
        setTab('tasks');
        return true;
      } catch {
        return false;
      }
    },
    [refresh]
  );

  const toggleDone = useCallback(
    async (task: TodoTask): Promise<void> => {
      const next = !task.done;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, done: next, completedDate: next ? todayISO() : '' } : t
        )
      );
      setSelectedId(null);
      try {
        await callTodo({ action: 'update', rowId: task.id, data: { Done: next } });
      } catch {
        setError('Could not update the task. Refreshing…');
      }
      await refresh();
    },
    [refresh]
  );

  const saveTask = useCallback(
    async (task: TodoTask, comment: string, dueDate: string): Promise<void> => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, comment, dueDate } : t)));
      try {
        await callTodo({ action: 'update', rowId: task.id, data: { Comment: comment, DueDate: dueDate } });
      } catch {
        setError('Could not save changes. Refreshing…');
      }
      await refresh();
    },
    [refresh]
  );

  const deleteTask = useCallback(
    async (task: TodoTask): Promise<void> => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setSelectedId(null);
      try {
        await callTodo({ action: 'delete', rowId: task.id });
      } catch {
        setError('Could not delete the task. Refreshing…');
      }
      await refresh();
    },
    [refresh]
  );

  const openTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.done)
      .slice()
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks]);

  const doneTasks = useMemo(() => {
    return tasks
      .filter((t) => t.done)
      .slice()
      .sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''));
  }, [tasks]);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const selectedTask = useMemo(() => {
    if (!selectedId) return null;
    return tasks.find((t) => t.id === selectedId) ?? null;
  }, [selectedId, tasks]);

  const headerMap: Record<TabId, { title: string; subtitle: string }> = {
    tasks: {
      title: 'Tasks',
      subtitle: loading ? 'Loading…' : `${openTasks.length} open · ${doneTasks.length} done`,
    },
    add: { title: 'New Task', subtitle: 'Position2 Leadership' },
    done: {
      title: 'Done',
      subtitle: loading ? 'Loading…' : `${doneTasks.length} completed`,
    },
    stats: { title: 'Stats', subtitle: 'Leadership overview' },
  };
  const header = headerMap[tab];

  const handleSelect = useCallback((task: TodoTask) => {
    setSelectedId(task.id);
  }, []);

  return (
    <div className="app-shell">
      <NavHeader title={header.title} subtitle={header.subtitle} />

      <main className="app-content">
        {tab === 'tasks' && (
          <TaskList tasks={openTasks} loading={loading} error={error} onSelect={handleSelect} />
        )}
        {tab === 'add' && <AddTaskForm onAdd={addTask} />}
        {tab === 'done' && (
          <DoneList
            tasks={doneTasks}
            loading={loading}
            onSelect={handleSelect}
            onReopen={(t) => {
              void toggleDone(t);
            }}
          />
        )}
        {tab === 'stats' && <StatsView stats={stats} loading={loading} />}
      </main>

      <TabBar active={tab} onChange={setTab} openCount={openTasks.length} />

      {selectedTask && (
        <TaskSheet
          key={selectedTask.id}
          task={selectedTask}
          onClose={() => setSelectedId(null)}
          onToggleDone={toggleDone}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
