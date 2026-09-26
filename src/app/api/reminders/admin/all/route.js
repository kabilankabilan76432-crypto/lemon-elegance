import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Reminder from '@/models/Reminder';
import Service from '@/models/Service';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized: Admin role required' }, { status: 403 });
    }

    await connectDB();
    const reminders = await Reminder.find()
      .populate('serviceId')
      .populate('userId', 'name email phone')
      .sort({ nextDueDate: 1 });

    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching all reminders', error: error.message }, { status: 500 });
  }
}
