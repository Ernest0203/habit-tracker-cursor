import { Router } from 'express';
import Habit from '../models/Habit.js';
import Entry from '../models/Entry.js';
import { calculateStreak } from '../utils/streak.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    const habitsWithStreak = await Promise.all(
      habits.map(async (habit) => {
        const entries = await Entry.find({ habitId: habit._id });
        const streak = calculateStreak(entries, habit.frequency);
        return { ...habit.toObject(), streak };
      })
    );
    res.json(habitsWithStreak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, emoji, color, frequency } = req.body;
    if (!name || !emoji || !color) {
      return res.status(400).json({ error: 'name, emoji, and color are required' });
    }
    const habit = await Habit.create({ name, emoji, color, frequency: frequency || 'daily' });
    res.status(201).json({ ...habit.toObject(), streak: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    await Entry.deleteMany({ habitId: req.params.id });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
