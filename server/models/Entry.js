import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

entrySchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('Entry', entrySchema);
