import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  emoji: { type: String, required: true },
  color: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Habit', habitSchema);
