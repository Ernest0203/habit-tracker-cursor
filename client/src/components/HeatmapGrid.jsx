import { last30Days, todayString } from '../utils/dates.js';

export default function HeatmapGrid({ entries, color }) {
  const days = last30Days();
  const today = todayString();
  const completedSet = new Set(
    entries.filter((e) => e.completed).map((e) => e.date)
  );

  return (
    <div className="heatmap-block">
      <div className="heatmap-header">
        <span className="heatmap-title">Последние 30 дней</span>
        <span className="heatmap-legend">
          <span className="legend-item">
            <span className="legend-swatch legend-empty" /> не сделано
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: color }} /> сделано
          </span>
        </span>
      </div>
      <div className="heatmap">
        {days.map((date) => (
          <div
            key={date}
            className={`heatmap-cell ${completedSet.has(date) ? 'completed' : ''} ${date === today ? 'today' : ''}`}
            style={completedSet.has(date) ? { backgroundColor: color } : undefined}
            title={`${formatTitle(date)}${date === today ? ' (сегодня)' : ''}${completedSet.has(date) ? ' — выполнено' : ''}`}
          />
        ))}
      </div>
      <p className="heatmap-hint">Слева — 30 дней назад, справа — сегодня. Наведите на квадрат, чтобы увидеть дату.</p>
    </div>
  );
}

function formatTitle(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}
