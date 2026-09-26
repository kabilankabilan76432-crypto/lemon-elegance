import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reminder from '@/models/Reminder';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const reminder = await Reminder.findById(params.id);
    if (!reminder) {
      return NextResponse.json({ message: 'Reminder not found' }, { status: 404 });
    }

    if (reminder.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    reminder.status = reminder.status === 'active' ? 'paused' : 'active';
    await reminder.save();

    const updated = await Reminder.findById(reminder._id).populate('serviceId');
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error toggling reminder', error: error.message }, { status: 500 });
  }
}
