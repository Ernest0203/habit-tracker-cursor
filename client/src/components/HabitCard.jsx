import { useState } from 'react';
import HeatmapGrid from './HeatmapGrid.jsx';

export default function HabitCard({
  habit,
  entries,
  todayCompleted,
  onToggle,
  onDelete,
}) {
  const [animating, setAnimating] = useState(false);

  const handleToggle = async () => {
    setAnimating(true);
    await onToggle(habit._id, !todayCompleted);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <article className="habit-card card">
      <div className="habit-card-header">
        <div className="habit-info">
          <span className="habit-emoji">{habit.emoji}</span>
          <div>
            <h3 className="habit-name">{habit.name}</h3>
            <span className="habit-frequency">{habit.frequency}</span>
          </div>
        </div>
        <div className="habit-actions">
          <div className="streak-badge" style={{ '--accent': habit.color }}>
            <span className="streak-number">{habit.streak ?? 0}</span>
            <span className="streak-label">streak</span>
          </div>
          <button
            type="button"
            className={`habit-checkbox ${todayCompleted ? 'checked' : ''} ${animating ? 'animating' : ''}`}
            style={{ '--accent': habit.color }}
            onClick={handleToggle}
            aria-label={todayCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(habit._id)}
            aria-label="Delete habit"
          >
            ×
          </button>
        </div>
      </div>
      <HeatmapGrid entries={entries} color={habit.color} />
    </article>
  );
}
