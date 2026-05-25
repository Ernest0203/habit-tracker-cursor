import { last30Days } from '../api.js';

export default function HeatmapGrid({ entries, color }) {
  const days = last30Days();
  const completedSet = new Set(
    entries.filter((e) => e.completed).map((e) => e.date)
  );

  return (
    <div className="heatmap">
      {days.map((date) => (
        <div
          key={date}
          className={`heatmap-cell ${completedSet.has(date) ? 'completed' : ''}`}
          style={completedSet.has(date) ? { backgroundColor: color } : undefined}
          title={date}
        />
      ))}
    </div>
  );
}
