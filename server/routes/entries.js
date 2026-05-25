import { Router } from 'express';
import Entry from '../models/Entry.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { habitId, month } = req.query;
    const filter = {};

    if (habitId) filter.habitId = habitId;

    if (month) {
      const [year, mon] = month.split('-');
      const start = `${year}-${mon}-01`;
      const lastDay = new Date(Number(year), Number(mon), 0).getDate();
      const end = `${year}-${mon}-${String(lastDay).padStart(2, '0')}`;
      filter.date = { $gte: start, $lte: end };
    }

    const entries = await Entry.find(filter).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { habitId, date, completed } = req.body;
    if (!habitId || !date) {
      return res.status(400).json({ error: 'habitId and date are required' });
    }

    const entry = await Entry.findOneAndUpdate(
      { habitId, date },
      { habitId, date, completed: completed ?? true },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
