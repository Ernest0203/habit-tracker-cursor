import { useState } from 'react';

const EMOJIS = ['🏃', '💧', '📚', '🧘', '💪', '🥗', '😴', '✍️', '🎯', '🎸', '🧹', '💊'];
const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4', '#a855f7'];

export default function AddHabitModal({ open, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [frequency, setFrequency] = useState('daily');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({ name: name.trim(), emoji, color, frequency });
      setName('');
      setEmoji(EMOJIS[0]);
      setColor(COLORS[0]);
      setFrequency('daily');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h2>New Habit</h2>
        <form onSubmit={handleSubmit}>
          <label className="field-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
              autoFocus
            />
          </label>

          <div className="field-group">
            <span className="field-label">Emoji</span>
            <div className="emoji-grid">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-btn ${emoji === e ? 'selected' : ''}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <span className="field-label">Color</span>
            <div className="color-grid">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-btn ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="field-group">
            <span className="field-label">Frequency</span>
            <div className="frequency-toggle">
              <button
                type="button"
                className={frequency === 'daily' ? 'active' : ''}
                onClick={() => setFrequency('daily')}
              >
                Daily
              </button>
              <button
                type="button"
                className={frequency === 'weekly' ? 'active' : ''}
                onClick={() => setFrequency('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting || !name.trim()}>
              {submitting ? 'Adding…' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
