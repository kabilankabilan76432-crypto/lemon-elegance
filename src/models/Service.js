import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Facial',
        'Hair Cut',
        'Hair Spa',
        'Cleanup',
        'Manicure',
        'Pedicure',
        'Waxing',
        'Threading',
        'Hair Styling',
        'Bridal Makeup',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      default: 30,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
