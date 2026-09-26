import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
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
    const appointments = await Appointment.find()
      .populate('serviceId')
      .populate('userId', 'name email phone')
      .sort({ date: -1, timeSlot: 1 });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching all appointments', error: error.message }, { status: 500 });
  }
}
