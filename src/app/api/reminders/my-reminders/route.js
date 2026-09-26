import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reminder from '@/models/Reminder';
import Service from '@/models/Service';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const reminders = await Reminder.find({ userId: user._id })
      .populate('serviceId')
      .sort({ nextDueDate: 1 });

    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching reminders', error: error.message }, { status: 500 });
  }
}
