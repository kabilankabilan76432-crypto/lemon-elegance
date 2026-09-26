import mongoose from 'mongoose';

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
      type: String,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
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

appointmentSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
