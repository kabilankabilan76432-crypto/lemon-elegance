import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    frequencyDays: {
      type: Number,
      required: true,
      default: 30,
    },
    lastServiceDate: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused'],
      default: 'active',
    },
    lastNotifiedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
