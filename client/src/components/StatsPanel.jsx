import { weekDates } from '../utils/dates.js';

export default function StatsPanel({ habits, allEntries }) {
  const completedEntries = allEntries.filter((e) => e.completed);
  const totalCompletions = completedEntries.length;

  const bestStreak = habits.reduce((max, habit) => {
    const habitEntries = allEntries.filter(
      (e) => String(e.habitId) === String(habit._id) && e.completed
    );
    return Math.max(max, calcBestStreak(habitEntries.map((e) => e.date), habit.frequency));
  }, 0);

  const weekDays = weekDates();
  const weekSlots = habits.length * 7;
  const weekCompleted = completedEntries.filter((e) => weekDays.includes(e.date)).length;
  const completionRate =
    weekSlots > 0 ? Math.round((weekCompleted / weekSlots) * 100) : 0;

  return (
    <section className="stats-panel card">
      <h2 className="stats-title">Stats</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{bestStreak}</span>
          <span className="stat-label">Best streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{completionRate}%</span>
          <span className="stat-label">This week</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalCompletions}</span>
          <span className="stat-label">Total done</span>
        </div>
      </div>
    </section>
  );
}

function calcBestStreak(dates, frequency = 'daily') {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  const step = frequency === 'weekly' ? 7 : 1;
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseDate(sorted[i - 1]);
    const curr = parseDate(sorted[i]);
    const expected = addDays(prev, step);
    if (formatDate(expected) === formatDate(curr)) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

