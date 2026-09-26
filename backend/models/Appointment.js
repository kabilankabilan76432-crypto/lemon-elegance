const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
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
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String, // e.g., "10:00 AM"
      required: [true, 'Time slot is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    discountApplied: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Compound index for slot management
appointmentSchema.index({ date: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
