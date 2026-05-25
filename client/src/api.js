const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API = `${BASE.replace(/\/$/, '')}/api`;

export async function fetchHabits() {
  const res = await fetch(`${API}/habits`);
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

export function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function last30Days() {
  const days = [];
  const d = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(d);
    date.setDate(d.getDate() - i);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${day}`);
  }
  return days;
}

export function weekDates() {
  const days = [];
  const d = new Date();
  const dayOfWeek = d.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${day}`);
  }
  return days;
}
