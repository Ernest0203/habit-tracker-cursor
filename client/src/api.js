import { getUserTimezone } from './utils/dates.js';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API = `${BASE.replace(/\/$/, '')}/api`;

export async function fetchHabits() {
  const tz = getUserTimezone();
  const res = await fetch(`${API}/habits?tz=${encodeURIComponent(tz)}`);
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function createHabit(data) {
  const res = await fetch(`${API}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function deleteHabit(id) {
  const res = await fetch(`${API}/habits/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete habit');
  return res.json();
}

export async function fetchEntries(habitId, month) {
  const params = new URLSearchParams();
  if (habitId) params.set('habitId', habitId);
  if (month) params.set('month', month);
  const res = await fetch(`${API}/entries?${params}`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function toggleEntry(habitId, date, completed) {
  const res = await fetch(`${API}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habitId, date, completed }),
  });
  if (!res.ok) throw new Error('Failed to update entry');
  return res.json();
}

export { todayString, last30Days, weekDates } from './utils/dates.js';
