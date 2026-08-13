"use client"

import type { TodoStats } from '@/lib/types';

interface StatsViewProps {
  stats: TodoStats;
  loading: boolean;
}

export default function StatsView({ stats, loading }: StatsViewProps) {
  const cards: { label: string; value: number; color: string; wide?: boolean }[] = [
    { label: 'Total Tasks', value: stats.total, color: 'var(--accent2)', wide: true },
    { label: 'Open', value: stats.open, color: 'var(--accent)' },
    { label: 'Completed', value: stats.completed, color: 'var(--green)' },
    { label: 'Overdue', value: stats.overdue, color: 'var(--red)' },
    { label: 'Due within 7 days', value: stats.dueWithin7, color: 'var(--orange)' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.wide ? 'wide' : ''}`}>
          <div className="stat-value" style={{ color: card.color }}>
            {loading ? '—' : card.value}
          </div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
