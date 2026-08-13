"use client"

import type { ReactNode } from 'react';
import type { TabId } from '@/lib/types';

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  openCount: number;
}

const tabDefs: { id: TabId; label: string }[] = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'add', label: 'Add' },
  { id: 'done', label: 'Done' },
  { id: 'stats', label: 'Stats' },
];

const icons: Record<TabId, ReactNode> = {
  tasks: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
    </svg>
  ),
  add: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  done: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  ),
  stats: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="5" y1="20" x2="5" y2="12" />
      <line x1="12" y1="20" x2="12" y2="5" />
      <line x1="19" y1="20" x2="19" y2="9" />
    </svg>
  ),
};

export default function TabBar({ active, onChange, openCount }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {tabDefs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-item ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
        >
          <span className="tab-icon">{icons[tab.id]}</span>
          <span className="tab-label">{tab.label}</span>
          {tab.id === 'tasks' && openCount > 0 && <span className="tab-badge">{openCount}</span>}
        </button>
      ))}
    </nav>
  );
}
