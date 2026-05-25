function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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

export function calculateStreak(entries, frequency = 'daily') {
  const completed = new Set(
    entries.filter((e) => e.completed).map((e) => e.date)
  );
  if (completed.size === 0) return 0;

  const today = formatDate(new Date());
  let cursor = parseDate(today);

  if (!completed.has(today)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  if (frequency === 'weekly') {
    while (completed.has(formatDate(cursor))) {
      streak++;
      cursor = addDays(cursor, -7);
    }
    return streak;
  }

  while (completed.has(formatDate(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function calculateBestStreak(entries, frequency = 'daily') {
  const completed = entries
    .filter((e) => e.completed)
    .map((e) => e.date)
    .sort();

  if (completed.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < completed.length; i++) {
    const prev = parseDate(completed[i - 1]);
    const curr = parseDate(completed[i]);
    const diff = frequency === 'weekly' ? 7 : 1;
    const expected = addDays(prev, diff);
    if (formatDate(expected) === formatDate(curr)) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}
