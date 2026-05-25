import { useCallback, useEffect, useState } from 'react';
import {
  createHabit,
  deleteHabit,
  fetchEntries,
  fetchHabits,
  toggleEntry,
} from './api.js';
import AddHabitModal from './components/AddHabitModal.jsx';
import HabitCard from './components/HabitCard.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import { useLocalDay } from './hooks/useLocalDay.js';
import { formatDisplayDate } from './utils/dates.js';

export default function App() {
  const [habits, setHabits] = useState([]);
  const [entriesByHabit, setEntriesByHabit] = useState({});
  const [allEntries, setAllEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [habitsData, entriesData] = await Promise.all([
        fetchHabits(),
        fetchEntries(),
      ]);
      setHabits(habitsData);
      setAllEntries(entriesData);

      const byHabit = {};
      for (const habit of habitsData) {
        byHabit[habit._id] = entriesData.filter(
          (e) => String(e.habitId) === String(habit._id)
        );
      }
      setEntriesByHabit(byHabit);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const { today, timezoneLabel } = useLocalDay(loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (habitId, completed) => {
    await toggleEntry(habitId, today, completed);
    await loadData();
  };

  const handleAdd = async (data) => {
    await createHabit(data);
    await loadData();
  };

  const handleDelete = async (id) => {
    await deleteHabit(id);
    await loadData();
  };

  const getTodayCompleted = (habitId) => {
    const entries = entriesByHabit[habitId] || [];
    const entry = entries.find(
      (e) => String(e.habitId) === String(habitId) && e.date === today
    );
    return entry?.completed ?? false;
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Habit Tracker</h1>
          <p className="header-date">
            {formatDisplayDate(today)}
            <span className="header-tz"> · день сбрасывается в 00:00 ({timezoneLabel})</span>
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
          + Add Habit
        </button>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner card">
            {error} — make sure the server is running on port 3001.
          </div>
        )}

        <StatsPanel habits={habits} allEntries={allEntries} />

        <section className="today-section">
          <h2 className="section-title">Сегодня</h2>
          {loading ? (
            <p className="empty-state">Loading habits…</p>
          ) : habits.length === 0 ? (
            <p className="empty-state">No habits yet. Add your first one!</p>
          ) : (
            <div className="habits-list">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  entries={entriesByHabit[habit._id] || []}
                  todayCompleted={getTodayCompleted(habit._id)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <AddHabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
